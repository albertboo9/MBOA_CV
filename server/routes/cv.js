/**
 * CV Routes - API endpoints for CV operations
 */
const express = require('express');
const router = express.Router();
const cvController = require('../controllers/cvController');
const { authenticate } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticate);

/**
 * @route POST /api/cv/save
 * @desc Save CV data
 * @access Private
 */
router.post('/save', cvController.saveCV);

/**
 * @route GET /api/cv/:cvId
 * @desc Get CV data
 * @access Private
 */
router.get('/:cvId', cvController.getCV);

/**
 * @route GET /api/cv/:cvId/download
 * @desc Download CV as PDF
 * @access Private
 */
router.get('/:cvId/download', cvController.downloadPDF);

/**
 * @route GET /api/templates
 * @desc Get available templates
 * @access Public (no auth required for templates)
 */
router.get('/templates', (req, res) => {
  const templates = [
    {
      id: 'nexus-pro',
      name: 'Nexus Pro',
      description: 'Design moderne avec double colonne, parfait pour les profils techniques',
      features: ['Layout double colonne', 'Sidebar élégante', 'Timeline verticale'],
      style: 'modern',
      popular: true,
      gradient: 'linear-gradient(135deg, #00f3ff, #b967ff)',
      price: 500,
      available: true
    },
    {
      id: 'executive-elite',
      name: 'Executive Elite',
      description: 'Design corporate traditionnel avec structure hiérarchisée',
      features: ['Style corporate', 'Sections encadrées', 'Typographie serif'],
      style: 'corporate',
      popular: false,
      gradient: 'linear-gradient(135deg, #2c3e50, #34495e)',
      price: 500,
      available: true
    }
  ];

  res.json({ templates });
});

/**
 * @route POST /api/cv/validate
 * @desc Validate CV data for a template
 * @access Private
 */
router.post('/validate', cvController.validateCV);

module.exports = router;