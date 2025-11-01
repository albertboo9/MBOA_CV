const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const helmet = require('helmet');

// Import services
const pdfGenerator = require('./services/pdfGenerator');
const paymentService = require('./services/paymentService');

// Import routes
const cvRoutes = require('./routes/cv');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(require('./serviceAccountKey.json')),
    });
    console.log('Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.warn('Firebase Admin SDK initialization failed:', error.message);
  }
} else {
  console.log('Firebase Admin SDK already initialized');
}

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Import authentication middleware
const { authenticate } = require('./middleware/auth');

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Basic info route
app.get('/', (req, res) => {
  res.json({
    message: 'MBOA-CV API Server',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Use organized routes
app.use('/api/cv', cvRoutes);

// Payment routes (temporary - will be moved to separate file later)
const paymentController = require('./controllers/cvController'); // Temporary - should be separate payment controller

app.post('/api/payment/initiate', require('./middleware/auth').authenticate, async (req, res) => {
  try {
    const { cvId, amount = 1250 } = req.body;
    const userId = req.user.uid;

    // Use payment service
    const paymentService = require('./services/paymentService');
    const paymentData = await paymentService.initiatePayment(cvId, userId, amount);

    res.json(paymentData);
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ error: error.message || 'Failed to initiate payment' });
  }
});

app.post('/api/payment/process/:paymentId', require('./middleware/auth').authenticate, async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { success = true } = req.body;

    const paymentService = require('./services/paymentService');
    const result = await paymentService.processPayment(paymentId, success);

    res.json(result);
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ error: error.message || 'Payment processing failed' });
  }
});

app.post('/api/download/validate-code', require('./middleware/auth').authenticate, async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user.uid;

    if (!code) {
      return res.status(400).json({ error: 'Download code is required' });
    }

    const paymentService = require('./services/paymentService');
    const result = await paymentService.validateDownloadCode(code, userId);

    res.json(result);
  } catch (error) {
    console.error('Download code validation error:', error);
    res.status(400).json({ error: error.message || 'Invalid download code' });
  }
});

app.get('/api/user/download-codes', require('./middleware/auth').authenticate, async (req, res) => {
  try {
    const userId = req.user.uid;
    console.log('API call: getUserDownloadCodes for user:', userId);

    const paymentService = require('./services/paymentService');
    const codes = await paymentService.getUserDownloadCodes(userId);

    console.log('API response: returning', codes.length, 'codes');
    res.json({ downloadCodes: codes });
  } catch (error) {
    console.error('Get user download codes error:', error);
    res.status(500).json({
      error: 'Failed to retrieve download codes',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Templates routes
app.get('/api/templates', (req, res) => {
  try {
    const pdfGenerator = require('./services/pdfGenerator');
    const availableTemplates = pdfGenerator.getAvailableTemplates();

    // Transform backend templates to frontend format
    const templates = availableTemplates.map(template => {
      // Map template IDs to frontend expected format
      const templateMapping = {
        'modern-double': {
          name: 'Modern Double',
          description: 'Design moderne avec double colonne et sidebar colorée',
          features: ['Double colonne élégante', 'Sidebar colorée', 'Photo ronde', 'Timeline verticale'],
          style: 'modern',
          popular: true,
          gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
          price: 500,
          available: true
        },
        'creative-vibrant': {
          name: 'Creative Vibrant',
          description: 'Design dynamique et coloré pour les profils créatifs et entrepreneuriaux',
          features: ['Éléments graphiques dynamiques', 'Palette colorée moderne', 'Mise en page asymétrique'],
          style: 'creative',
          popular: false,
          gradient: 'linear-gradient(135deg, #ff2aa4, #b967ff)',
          price: 500,
          available: true
        },
        'minimalist-professional': {
          name: 'Minimalist Professional',
          description: 'Design épuré et élégant, focus sur le contenu avec une typographie raffinée',
          features: ['Design minimaliste épuré', 'Typographie élégante', 'Espaces négatifs maîtrisés'],
          style: 'minimal',
          popular: false,
          gradient: 'linear-gradient(135deg, #00ff88, #0099ff)',
          price: 500,
          available: true
        },
        'cyber-neon': {
          name: 'Cyber Neon',
          description: 'Design futuriste avec effets néon cyan/purple, parfait pour les métiers tech et innovants',
          features: ['Effets néon cyan/purple', 'Layout cybernétique', 'Animations avancées'],
          style: 'cyber',
          popular: true,
          gradient: 'linear-gradient(135deg, #00f3ff, #b967ff)',
          price: 500,
          available: true
        },
        'corporate-executive': {
          name: 'Corporate Executive',
          description: 'Design corporate traditionnel avec structure hiérarchisée et élégance professionnelle',
          features: ['Structure hiérarchisée claire', 'Éléments décoratifs subtils', 'Palette sophistiquée'],
          style: 'corporate',
          popular: false,
          gradient: 'linear-gradient(135deg, #0099ff, #00f3ff)',
          price: 500,
          available: true
        },
        'tech-modern': {
          name: 'Tech Modern',
          description: 'Design moderne et épuré pour les professionnels de la tech et du numérique',
          features: ['Typographie sans-serif moderne', 'Accents de couleur tech', 'Layout asymétrique'],
          style: 'tech',
          popular: false,
          gradient: 'linear-gradient(135deg, #2563eb, #06b6d4)',
          price: 500,
          available: true
        },
        'creative-minimal': {
          name: 'Creative Minimal',
          description: 'Design créatif minimaliste avec des éléments artistiques subtils et une mise en page élégante',
          features: ['Éléments artistiques subtils', 'Typographie élégante', 'Espaces équilibrés'],
          style: 'creative-minimal',
          popular: false,
          gradient: 'linear-gradient(135deg, #d4af37, #c0c0c0)',
          price: 500,
          available: true
        },
        'elegant-classic': {
          name: 'Elegant Classic',
          description: 'Design classique élégant avec une touche de sophistication moderne',
          features: ['Typographie serif élégante', 'Structure hiérarchisée', 'Éléments décoratifs subtils'],
          style: 'classic',
          popular: false,
          gradient: 'linear-gradient(135deg, #1e3a8a, #d4af37)',
          price: 500,
          available: true
        }
      };

      const frontendTemplate = templateMapping[template.id] || {
        name: template.name,
        description: template.description,
        features: template.features || [],
        style: template.category || 'general',
        popular: false,
        gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
        price: 500,
        available: true
      };

      return {
        id: template.id,
        name: frontendTemplate.name,
        description: frontendTemplate.description,
        features: frontendTemplate.features,
        style: frontendTemplate.style,
        popular: frontendTemplate.popular,
        gradient: frontendTemplate.gradient,
        price: frontendTemplate.price,
        available: frontendTemplate.available,
        category: template.category,
        version: template.version,
        author: template.author
      };
    });

    res.json({ templates });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// Template validation route
app.post('/api/templates/:templateId/validate', require('./middleware/auth').authenticate, async (req, res) => {
  try {
    const { templateId } = req.params;
    const { cvData } = req.body;

    const pdfGenerator = require('./services/pdfGenerator');
    const validation = pdfGenerator.validateCVData(cvData, templateId);

    res.json(validation);
  } catch (error) {
    console.error('Template validation error:', error);
    res.status(500).json({ error: 'Failed to validate template' });
  }
});

// Basic error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
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