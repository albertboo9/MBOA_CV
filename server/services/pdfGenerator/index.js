/**
 * PDF Generator Service - Main orchestrator for PDF generation
 */
const puppeteer = require('puppeteer');
const TemplateManager = require('./TemplateManager');
const htmlUtils = require('./utils/htmlUtils');
const cssUtils = require('./utils/cssUtils');
const validationUtils = require('./utils/validation');

class PDFGenerator {
  constructor() {
    this.browser = null;
    this.templateManager = new TemplateManager();
    this.isInitialized = false;
    this.browserConfig = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    };
  }

  /**
   * Initialize the PDF generator
   * @returns {Promise<void>}
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log('Initializing PDF Generator...');
      this.browser = await puppeteer.launch(this.browserConfig);
      await this.templateManager.loadTemplates();
      this.isInitialized = true;
      console.log('PDF Generator initialized successfully');
    } catch (error) {
      console.error('Failed to initialize PDF Generator:', error);
      throw new Error('Erreur lors de l\'initialisation du générateur PDF');
    }
  }

  /**
   * Generate PDF from CV data
   * @param {Object} cvData - CV data
   * @param {string} templateName - Template name
   * @param {Object} options - Generation options
   * @returns {Promise<Buffer>} PDF buffer
   */
  async generatePDF(cvData, templateName = 'modern-double', options = {}) {
    await this.ensureInitialized();

    const startTime = Date.now();

    try {
      console.log(`Generating PDF with template: ${templateName}`);

      // Validate input data
      const validation = validationUtils.validateCVData(cvData);
      if (!validation.isValid) {
        throw new Error(`Données CV invalides: ${validation.errors.join(', ')}`);
      }

      // Get template
      const template = this.templateManager.getTemplate(templateName);
      if (!template) {
        throw new Error(`Template '${templateName}' non trouvé`);
      }

      // Validate template compatibility
      const templateValidation = template.validate(cvData);
      if (!templateValidation.isValid) {
        throw new Error(`Template incompatible: ${templateValidation.errors.join(', ')}`);
      }

      // Generate HTML content
      const htmlContent = template.render(cvData);
      const cssContent = template.getCSS();

      // Combine HTML and CSS
      const fullHTML = htmlUtils.wrapWithStyles(htmlContent, cssContent);

      // Sanitize HTML for security
      const sanitizedHTML = htmlUtils.sanitizeHTML(fullHTML);

      // Create new page
      const page = await this.browser.newPage();

      try {
        // Set viewport for better rendering
        await page.setViewport({
          width: 794, // A4 width at 96 DPI
          height: 1123, // A4 height at 96 DPI
          deviceScaleFactor: 1
        });

        // Set content
        await page.setContent(sanitizedHTML, {
          waitUntil: 'networkidle0',
          timeout: options.timeout || 30000
        });

        // Wait for any dynamic content to load
        await page.waitForTimeout(1000);

        // Generate PDF
        const pdfOptions = {
          format: options.format || 'A4',
          printBackground: options.printBackground !== false,
          margin: options.margin || {
            top: '15mm',
            right: '15mm',
            bottom: '15mm',
            left: '15mm'
          },
          preferCSSPageSize: true,
          displayHeaderFooter: false
        };

        const pdfBuffer = await page.pdf(pdfOptions);

        const duration = Date.now() - startTime;
        console.log(`PDF generated successfully in ${duration}ms`);

        return pdfBuffer;

      } finally {
        await page.close();
      }

    } catch (error) {
      console.error('PDF generation error:', error);
      throw error;
    }
  }

  /**
   * Get available templates
   * @returns {Promise<Array>} List of available templates
   */
  async getAvailableTemplates() {
    await this.ensureInitialized();
    return this.templateManager.getAvailableTemplates();
  }

  /**
   * Get template information
   * @param {string} templateName - Template name
   * @returns {Promise<Object|null>} Template information
   */
  async getTemplateInfo(templateName) {
    await this.ensureInitialized();
    return this.templateManager.getTemplateInfo(templateName);
  }

  /**
   * Validate CV data for a specific template
   * @param {Object} cvData - CV data
   * @param {string} templateName - Template name
   * @returns {Promise<Object>} Validation result
   */
  async validateCVData(cvData, templateName) {
    await this.ensureInitialized();

    const template = this.templateManager.getTemplate(templateName);
    if (!template) {
      return {
        isValid: false,
        errors: [`Template '${templateName}' non trouvé`]
      };
    }

    return template.validate(cvData);
  }

  /**
   * Ensure the generator is initialized
   * @returns {Promise<void>}
   */
  async ensureInitialized() {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  /**
   * Close the browser and cleanup resources
   * @returns {Promise<void>}
   */
  async close() {
    if (this.browser) {
      console.log('Closing PDF Generator...');
      await this.browser.close();
      this.browser = null;
      this.isInitialized = false;
      console.log('PDF Generator closed');
    }
  }

  /**
   * Get generator statistics
   * @returns {Object} Statistics
   */
  getStats() {
    return {
      initialized: this.isInitialized,
      templateCount: this.templateManager ? this.templateManager.getTemplateCount() : 0,
      browserVersion: this.browser ? 'Puppeteer Active' : 'Not Initialized'
    };
  }
}

// Export singleton instance
module.exports = new PDFGenerator();