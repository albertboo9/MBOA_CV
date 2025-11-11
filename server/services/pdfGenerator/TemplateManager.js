/**
 * Template Manager - Manages CV templates for PDF generation
 */
const fs = require('fs');
const path = require('path');

class TemplateManager {
  constructor() {
    this.templates = new Map();
    this.templatesDir = path.join(__dirname, 'templates');
  }

  /**
   * Load all available templates
   * @returns {Promise<void>}
   */
  async loadTemplates() {
    try {
      console.log('Loading CV templates...');

      // Clear existing templates
      this.templates.clear();

      // Load all template files
      const templateFiles = fs.readdirSync(this.templatesDir)
        .filter(file => file.endsWith('.js') && file !== 'index.js');

      for (const file of templateFiles) {
        try {
          const templatePath = path.join(this.templatesDir, file);
          const TemplateClass = require(templatePath);

          // Create instance and register
          const templateInstance = new TemplateClass();
          const templateId = file.replace('.js', '');

          this.templates.set(templateId, templateInstance);
          console.log(`Loaded template: ${templateId} (${templateInstance.name})`);
        } catch (error) {
          console.error(`Failed to load template ${file}:`, error.message);
        }
      }

      console.log(`Successfully loaded ${this.templates.size} templates`);
    } catch (error) {
      console.error('Error loading templates:', error);
      throw new Error('Failed to load CV templates');
    }
  }

  /**
   * Get a template by ID
   * @param {string} templateId - Template identifier
   * @returns {Object|null} Template instance or null if not found
   */
  getTemplate(templateId) {
    return this.templates.get(templateId) || null;
  }

  /**
   * Get all available templates
   * @returns {Array} Array of template information
   */
  getAvailableTemplates() {
    const templates = [];
    console.log(this.templates)

    for (const [id, template] of this.templates) {
      templates.push({
        id,
        name: template.name,
        description: template.description,
        category: template.category || 'general',
        premium: template.premium || false,
        version: template.version,
        author: template.author,
        createdAt: template.createdAt,
        features: template.features || []
      });
    }

    return templates;
  }

  /**
   * Get template information
   * @param {string} templateId - Template identifier
   * @returns {Object|null} Template information or null if not found
   */
  getTemplateInfo(templateId) {
    const template = this.getTemplate(templateId);
    if (!template) return null;

    return {
      id: templateId,
      name: template.name,
      description: template.description,
      category: template.category || 'general',
      premium: template.premium || false,
      version: template.version,
      author: template.author,
      createdAt: template.createdAt,
      features: template.features || []
    };
  }

  /**
   * Check if a template exists
   * @param {string} templateId - Template identifier
   * @returns {boolean} True if template exists
   */
  hasTemplate(templateId) {
    return this.templates.has(templateId);
  }

  /**
   * Get template count
   * @returns {number} Number of loaded templates
   */
  getTemplateCount() {
    return this.templates.size;
  }

  /**
   * Validate template compatibility
   * @param {string} templateId - Template identifier
   * @param {Object} cvData - CV data to validate
   * @returns {Object} Validation result
   */
  validateTemplate(templateId, cvData) {
    const template = this.getTemplate(templateId);
    if (!template) {
      return {
        isValid: false,
        errors: [`Template '${templateId}' not found`]
      };
    }

    if (typeof template.validate !== 'function') {
      return {
        isValid: true,
        errors: []
      };
    }

    return template.validate(cvData);
  }

  /**
   * Reload templates (useful for development)
   * @returns {Promise<void>}
   */
  async reloadTemplates() {
    // Clear require cache for template files
    const templateFiles = fs.readdirSync(this.templatesDir)
      .filter(file => file.endsWith('.js'));

    for (const file of templateFiles) {
      const templatePath = path.join(this.templatesDir, file);
      delete require.cache[require.resolve(templatePath)];
    }

    await this.loadTemplates();
  }
}

module.exports = TemplateManager;