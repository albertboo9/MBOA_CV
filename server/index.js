const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const admin = require('firebase-admin');
const pdfGenerator = require('./services/pdfGenerator');

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
app.post('/api/cv/save', authenticate, async (req, res) => {
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

// Payment initiation route (mock implementation)
app.post('/api/payment/initiate', authenticate, async (req, res) => {
  try {
    const { cvId, amount = 500 } = req.body; // 500 FCFA default
    const userId = req.user.uid;

    // Update CV status to payment pending
    await admin.firestore().collection('cvs').doc(cvId).update({
      status: 'payment_pending',
      paymentAmount: amount,
      paymentInitiatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Create payment record
    const paymentRef = admin.firestore().collection('payments').doc();
    await paymentRef.set({
      cvId,
      userId,
      amount,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Mock payment URL - in production, this would be from the payment aggregator
    const paymentUrl = `https://payment.example.com/pay?paymentId=${paymentRef.id}&amount=${amount}`;

    res.json({
      paymentId: paymentRef.id,
      paymentUrl,
      amount
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ error: 'Failed to initiate payment' });
  }
});

// Webhook route for payment confirmation (mock implementation)
app.post('/api/payment/webhook', async (req, res) => {
  try {
    const { paymentId, status, transactionId } = req.body;

    // In production, verify webhook signature here
    // const isValidSignature = verifyWebhookSignature(req.headers, req.body);

    if (status === 'success') {
      // Update payment status
      await admin.firestore().collection('payments').doc(paymentId).update({
        status: 'completed',
        transactionId,
        completedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Get payment details to update CV
      const paymentDoc = await admin.firestore().collection('payments').doc(paymentId).get();
      const paymentData = paymentDoc.data();

      // Update CV status to paid
      await admin.firestore().collection('cvs').doc(paymentData.cvId).update({
        status: 'paid',
        paidAt: admin.firestore.FieldValue.serverTimestamp()
      });

      res.json({ received: true, status: 'payment_confirmed' });
    } else {
      // Handle failed payment
      await admin.firestore().collection('payments').doc(paymentId).update({
        status: 'failed',
        failedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      res.json({ received: true, status: 'payment_failed' });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Download route
app.get('/api/cv/:cvId/download', authenticate, async (req, res) => {
  try {
    const { cvId } = req.params;
    const userId = req.user.uid;
    const { template = 'modern' } = req.query;

    // Get CV data
    const cvDoc = await admin.firestore().collection('cvs').doc(cvId).get();

    if (!cvDoc.exists) {
      return res.status(404).json({ error: 'CV not found' });
    }

    const cvData = cvDoc.data();

    if (cvData.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (cvData.status !== 'paid') {
      return res.status(403).json({ error: 'Payment required' });
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
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});