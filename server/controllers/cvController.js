/**
 * CV Controller - Handles CV-related HTTP requests
 */
const pdfGenerator = require('../services/pdfGenerator');
const paymentService = require('../services/paymentService');

class CVController {
  /**
   * Save CV data
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async saveCV(req, res) {
    try {
      const { cvData, cvId } = req.body;
      const userId = req.user.uid;

      // Basic validation
      if (!cvData || !cvData.personalInfo || !cvData.personalInfo.firstName) {
        return res.status(400).json({
          error: 'Données CV invalides',
          details: ['Informations personnelles requises']
        });
      }

      const sanitizedData = cvData;

      // Save to database
      const saveResult = await CVController.prototype.saveCVToDatabase(sanitizedData, cvId, userId);
      console.log('CV saved successfully:', saveResult);

      res.json({
        success: true,
        cvId: saveResult.cvId,
        message: 'CV sauvegardé avec succès'
      });

    } catch (error) {
      console.error('Save CV error:', error);
      res.status(500).json({
        error: 'Erreur lors de la sauvegarde du CV',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Get CV data
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getCV(req, res) {
    try {
      const { cvId } = req.params;
      const userId = req.user.uid;

      // Get CV from database
      const cvData = await this.getCVFromDatabase(cvId, userId);

      if (!cvData) {
        return res.status(404).json({ error: 'CV non trouvé' });
      }

      res.json({ cvData });

    } catch (error) {
      console.error('Get CV error:', error);
      res.status(500).json({
        error: 'Erreur lors de la récupération du CV',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Generate and download PDF
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async downloadPDF(req, res) {
    try {
      const { cvId } = req.params;
      const { template = 'modern-double', code } = req.query;
      const userId = req.user.uid;

      // Get CV data
      const cvData = await CVController.prototype.getCVFromDatabase(cvId, userId);
      if (!cvData) {
        return res.status(404).json({ error: 'CV non trouvé' });
      }

      // Check access permissions (payment or valid code)
      const hasAccess = await CVController.prototype.checkAccessPermission(cvId, userId, code);
      if (!hasAccess) {
        return res.status(403).json({
          error: 'Accès refusé. Paiement requis ou code de téléchargement valide nécessaire.'
        });
      }

      // Generate PDF
      const pdfBuffer = await pdfGenerator.generatePDF(cvData, template);

      // Set response headers
      const fileName = `CV_${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}.pdf`;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Length', pdfBuffer.length);

      // Send PDF buffer
      res.send(pdfBuffer);

      // Log download for analytics (don't await to avoid blocking response)
      CVController.prototype.logDownload(cvId, userId, template).catch(err =>
        console.error('Log download error:', err)
      );

    } catch (error) {
      console.error('Download PDF error:', error);
      res.status(500).json({
        error: 'Erreur lors de la génération du PDF',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Get available templates
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getTemplates(req, res) {
    try {
      const templates = await pdfGenerator.getAvailableTemplates();

      res.json({ templates });

    } catch (error) {
      console.error('Get templates error:', error);
      res.status(500).json({
        error: 'Erreur lors de la récupération des templates',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
    * Validate CV data for a specific template
    * @param {Object} req - Express request object
    * @param {Object} res - Express response object
    */
   async validateCV(req, res) {
     try {
       const { cvData, templateName } = req.body;

       // Basic validation
       if (!cvData || !cvData.personalInfo || !cvData.personalInfo.firstName) {
         return res.status(400).json({
           error: 'Données CV invalides',
           details: ['Informations personnelles requises']
         });
       }

       res.json({
         valid: true,
         message: 'Données CV valides pour ce template'
       });

     } catch (error) {
       console.error('Validate CV error:', error);
       res.status(500).json({
         error: 'Erreur lors de la validation',
         details: process.env.NODE_ENV === 'development' ? error.message : undefined
       });
     }
   }

  /**
   * Save CV to database
   * @param {Object} cvData - CV data
   * @param {string} cvId - CV ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Save result
   */
  async saveCVToDatabase(cvData, cvId, userId) {
    const admin = require('firebase-admin');

    const cvRef = admin.firestore().collection('cvs').doc(cvId || `cv_${Date.now()}`);
    await cvRef.set({
      ...cvData,
      userId,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'draft'
    });

    return {
      cvId: cvRef.id,
      savedAt: new Date().toISOString()
    };
  }

  /**
   * Get CV from database
   * @param {string} cvId - CV ID
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} CV data or null
   */
  async getCVFromDatabase(cvId, userId) {
    const admin = require('firebase-admin');

    const cvDoc = await admin.firestore().collection('cvs').doc(cvId).get();

    if (!cvDoc.exists) {
      return null;
    }

    const cvData = cvDoc.data();

    // Check ownership
    if (cvData.userId !== userId) {
      throw new Error('Access denied');
    }

    return cvData;
  }

  /**
   * Check if user has access to download CV
   * @param {string} cvId - CV ID
   * @param {string} userId - User ID
   * @param {string} code - Download code
   * @returns {Promise<boolean>} Has access
   */
  async checkAccessPermission(cvId, userId, code) {
    try {
      // Check if CV is paid
      const cvData = await this.getCVFromDatabase(cvId, userId);
      if (cvData && cvData.status === 'paid') {
        return true;
      }

      // Check if valid download code is provided
      if (code) {
        const codeValidation = await paymentService.validateDownloadCode(code, userId);
        return codeValidation.valid;
      }

      return false;
    } catch (error) {
      console.error('Access check error:', error);
      return false;
    }
  }

  /**
   * Log download for analytics
   * @param {string} cvId - CV ID
   * @param {string} userId - User ID
   * @param {string} template - Template used
   */
  async logDownload(cvId, userId, template) {
    try {
      // This would log to analytics service
      console.log(`Download logged: CV ${cvId}, User ${userId}, Template ${template}`);
    } catch (error) {
      console.error('Log download error:', error);
      // Don't throw - logging failure shouldn't break download
    }
  }
}

module.exports = new CVController();