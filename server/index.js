const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const admin = require('firebase-admin');
const pdfGenerator = require('./services/pdfGenerator');
const paymentService = require('./services/paymentService');

// Initialize Firebase Admin SDK
// Note: You'll need to add your service account key
try {
  admin.initializeApp({
    credential: admin.credential.cert(require('./serviceAccountKey.json')),
    // Add your Firebase project config
  });
} catch (error) {
  console.warn('Firebase Admin SDK not initialized - service account key missing');
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {


    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'MBOA-CV API Server', version: '1.0.0' });
});

// CV save route
app.post('/api/cv/save', authenticate,  async (req, res) => {
  try {
    const { cvData, cvId } = req.body;
    const userId = req.user.uid;

    const cvRef = admin.firestore().collection('cvs').doc(cvId || `cv_${Date.now()}`);
    await cvRef.set({
      ...cvData,
      userId,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'draft'
    });

    res.json({
      success: true,
      cvId: cvRef.id,
      message: 'CV saved successfully'
    });
  } catch (error) {
    console.error('Save CV error:', error);
    res.status(500).json({ error: 'Failed to save CV' });
  }
});

// Get CV data
app.get('/api/cv/:cvId', authenticate, async (req, res) => {
  try {
    const { cvId } = req.params;
    const userId = req.user.uid;

    const cvDoc = await admin.firestore().collection('cvs').doc(cvId).get();

    if (!cvDoc.exists) {
      return res.status(404).json({ error: 'CV not found' });
    }

    const cvData = cvDoc.data();

    if (cvData.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ cvData });
  } catch (error) {
    console.error('Get CV error:', error);
    res.status(500).json({ error: 'Failed to get CV' });
  }
});

// Payment initiation route
app.post('/api/payment/initiate', authenticate,  async (req, res) => {
  try {
    const { cvId, amount = 500 } = req.body;
    const userId = req.user.uid;

    const paymentData = await paymentService.initiatePayment(cvId, userId, amount);

    res.json(paymentData);
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ error: error.message || 'Failed to initiate payment' });
  }
});

// Payment processing simulation route
app.post('/api/payment/process/:paymentId', authenticate,  async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { success = true } = req.body; // Par défaut succès pour simulation

    const result = await paymentService.processPayment(paymentId, success);

    res.json(result);
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ error: error.message || 'Payment processing failed' });
  }
});

// Validate download code route
app.post('/api/download/validate-code', authenticate, async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user.uid;

    if (!code) {
      return res.status(400).json({ error: 'Download code is required' });
    }

    const result = await paymentService.validateDownloadCode(code, userId);

    res.json(result);
  } catch (error) {
    console.error('Download code validation error:', error);
    res.status(400).json({ error: error.message || 'Invalid download code' });
  }
});

// Get user download codes route
app.get('/api/user/download-codes',authenticate,  async (req, res) => {
  try {
    const userId = req.user.uid;

    const codes = await paymentService.getUserDownloadCodes(userId);

    res.json({ downloadCodes: codes });
  } catch (error) {
    console.error('Get user download codes error:', error);
    res.status(500).json({ error: 'Failed to retrieve download codes' });
  }
});

// Download route (with payment validation)
app.get('/api/cv/:cvId/download', authenticate, async (req, res) => {
  try {
    const { cvId } = req.params;
    const userId = req.user.uid
    const { template = 'modern', code } = req.query;

    // Get CV data
    const cvDoc = await admin.firestore().collection('cvs').doc(cvId).get();

    if (!cvDoc.exists) {
      return res.status(404).json({ error: 'CV not found' });
    }

    const cvData = cvDoc.data();

    if (cvData.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Vérifier l'accès (paiement ou code valide)
    let hasAccess = cvData.status === 'paid';

    if (!hasAccess && code) {
      try {
        await paymentService.validateDownloadCode(code, userId);
        hasAccess = true;
      } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired download code' });
      }
    }

    if (!hasAccess) {
      return res.status(403).json({ error: 'Payment required or valid download code needed' });
    }

    // Generate PDF
    const pdfBuffer = await pdfGenerator.generatePDF(cvData, template);

    // Set headers for download
    const fileName = `CV_${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // Stream the PDF
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
// Templates route
app.get('/api/templates', (req, res) => {
  try {
    const templates = [
      {
        id: 'cyber-modern',
        name: 'Nexus Cyber',
        description: 'Design futuriste avec effets néon, parfait pour les métiers tech et innovants',
        features: ['Effets néon cyan/purple', 'Layout cybernétique', 'Animations avancées'],
        style: 'cyber',
        popular: true,
        gradient: 'linear-gradient(135deg, #00f3ff, #b967ff)',
        price: 500,
        available: true
      },
      {
        id: 'quantum-minimal',
        name: 'Quantum Pro',
        description: 'Minimalisme high-tech avec typographie géométrique et espace négatif maîtrisé',
        features: ['Design épuré élégant', 'Focus sur le contenu', 'Typographie géométrique'],
        style: 'minimal',
        popular: false,
        gradient: 'linear-gradient(135deg, #00ff88, #0099ff)',
        price: 500,
        available: true
      },
      {
        id: 'synergy-creative',
        name: 'Synergy Creative',
        description: 'Design énergique et coloré pour les profils créatifs et entrepreneuriaux',
        features: ['Éléments graphiques dynamiques', 'Palette colorée moderne', 'Mise en page asymétrique'],
        style: 'creative',
        popular: false,
        gradient: 'linear-gradient(135deg, #ff2aa4, #b967ff)',
        price: 500,
        available: true
      },
      {
        id: 'matrix-corporate',
        name: 'Matrix Elite',
        description: 'Style corporate futuriste avec structure data-driven et présentation professionnelle',
        features: ['Structure organisée', 'Style professionnel avancé', 'Optimisé A4'],
        style: 'corporate',
        popular: false,
        gradient: 'linear-gradient(135deg, #0099ff, #00f3ff)',
        price: 500,
        available: true
      }
    ];

    res.json({ templates });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await pdfGenerator.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await pdfGenerator.close();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`MBOA-CV Server running on port ${PORT}`);
});