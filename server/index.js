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