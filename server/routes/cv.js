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
      description: 'Design futuriste avec double colonne, parfait pour les profils tech et créatifs',
      features: ['Double colonne moderne', 'Sidebar avec photo et compétences', 'Timeline verticale'],
      style: 'double-column',
      popular: true,
      gradient: 'linear-gradient(135deg, #00d4ff, #b967ff)',
      price: 500,
      available: true,
      backendId: 'modern-double'
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
      available: true,
      backendId: 'executive-elite'
    },
    {
      id: 'cyber-modern',
      name: 'Nexus Cyber',
      description: 'Design futuriste avec effets néon, parfait pour les métiers tech et innovants',
      features: ['Effets néon cyan/purple', 'Layout cybernétique', 'Animations avancées'],
      style: 'cyber',
      popular: false,
      gradient: 'linear-gradient(135deg, #00f3ff, #b967ff)',
      price: 500,
      available: true,
      backendId: 'modern'
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
      available: true,
      backendId: 'minimal'
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