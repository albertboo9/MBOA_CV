/**
 * Executive Elite Template - Corporate professional layout
 * A sophisticated template for executives and senior professionals
 */
const htmlUtils = require('../utils/htmlUtils');
const cssUtils = require('../utils/cssUtils');
const validationUtils = require('../utils/validation');

class ExecutiveEliteTemplate {
  constructor() {
    this.name = 'Executive Elite';
    this.description = 'Design corporate haut de gamme pour cadres et dirigeants';
    this.category = 'executive';
    this.premium = true;
    this.version = '1.0.0';
    this.author = 'MBOA-CV';
    this.createdAt = '2024-01-01T00:00:00Z';

    this.features = [
      'Design corporate élégant',
      'Couleurs sobres et professionnelles',
      'Sections encadrées',
      'Focus sur l\'expertise managériale',
      'Typographie serif distinguée'
    ];
  }

  /**
   * Render CV HTML content
   * @param {Object} cvData - CV data
   * @returns {string} HTML content
   */
  render(cvData) {
    const sanitized = validationUtils.sanitizeTemplateData(cvData);

    return `
      <div class="cv-container">
        <!-- Header Section -->
        <header class="cv-header">
          <div class="header-content">
            <div class="personal-section">
              <h1 class="name">${htmlUtils.escapeHtml(sanitized.personalInfo?.firstName || '')} ${htmlUtils.escapeHtml(sanitized.personalInfo?.lastName || '')}</h1>
              <div class="title-section">
                <h2 class="professional-title">${htmlUtils.escapeHtml(sanitized.personalInfo?.title || 'Professionnel Expérimenté')}</h2>
              </div>
            </div>
            <div class="contact-section">
              <div class="contact-grid">
                ${sanitized.personalInfo?.email ? `<div class="contact-item"><span class="contact-label">Email:</span><span class="contact-value">${htmlUtils.escapeHtml(sanitized.personalInfo.email)}</span></div>` : ''}
                ${sanitized.personalInfo?.phone ? `<div class="contact-item"><span class="contact-label">Téléphone:</span><span class="contact-value">${htmlUtils.escapeHtml(sanitized.personalInfo.phone)}</span></div>` : ''}
                ${sanitized.personalInfo?.address ? `<div class="contact-item"><span class="contact-label">Adresse:</span><span class="contact-value">${htmlUtils.escapeHtml(sanitized.personalInfo.address)}</span></div>` : ''}
                ${sanitized.personalInfo?.linkedin ? `<div class="contact-item"><span class="contact-label">LinkedIn:</span><a href="${htmlUtils.escapeHtml(sanitized.personalInfo.linkedin)}" class="contact-link">${htmlUtils.escapeHtml(sanitized.personalInfo.linkedin)}</a></div>` : ''}
              </div>
            </div>
          </div>
        </header>

        <div class="cv-body">
          <!-- Summary Section -->
          ${cvData.summary ? `
            <section class="cv-section summary-section">
              <div class="section-header">
                <h3 class="section-title">Profil Professionnel</h3>
              </div>
              <div class="section-content">
                <p class="executive-summary">${htmlUtils.escapeHtml(cvData.summary)}</p>
              </div>
            </section>
          ` : ''}

          <!-- Experience Section -->
          ${cvData.experiences && cvData.experiences.length > 0 ? `
            <section class="cv-section experience-section">
              <div class="section-header">
                <h3 class="section-title">Expérience Professionnelle</h3>
              </div>
              <div class="section-content">
                ${cvData.experiences.map((exp, index) => `
                  <div class="experience-item">
                    <div class="experience-header">
                      <div class="position-company">
                        <h4 class="position">${htmlUtils.escapeHtml(exp.position)}</h4>
                        <div class="company">${htmlUtils.escapeHtml(exp.company)}</div>
                      </div>
                      <div class="experience-dates">
                        ${this.formatDateRange(exp.startDate, exp.endDate, exp.current)}
                      </div>
                    </div>
                    ${exp.description ? `<div class="experience-description">${htmlUtils.escapeHtml(exp.description)}</div>` : ''}
                    ${exp.achievements && exp.achievements.length > 0 ? `
                      <div class="achievements-section">
                        <h5>Réalisations clés:</h5>
                        <ul class="achievements-list">
                          ${exp.achievements.map(achievement => `<li>${htmlUtils.escapeHtml(achievement)}</li>`).join('')}
                        </ul>
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}

          <!-- Education Section -->
          ${cvData.education && cvData.education.length > 0 ? `
            <section class="cv-section education-section">
              <div class="section-header">
                <h3 class="section-title">Formation</h3>
              </div>
              <div class="section-content">
                ${cvData.education.map(edu => `
                  <div class="education-item">
                    <div class="education-degree">${htmlUtils.escapeHtml(edu.degree)}</div>
                    <div class="education-institution">${htmlUtils.escapeHtml(edu.institution)}</div>
                    <div class="education-dates">${this.formatDateRange(edu.startDate, edu.endDate)}</div>
                    ${edu.description ? `<div class="education-description">${htmlUtils.escapeHtml(edu.description)}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}

          <!-- Skills Section -->
          ${cvData.skills && cvData.skills.length > 0 ? `
            <section class="cv-section skills-section">
              <div class="section-header">
                <h3 class="section-title">Compétences</h3>
              </div>
              <div class="section-content">
                <div class="skills-container">
                  ${cvData.skills.map(skill => `<span class="skill-item">${htmlUtils.escapeHtml(skill)}</span>`).join('')}
                </div>
              </div>
            </section>
          ` : ''}

          <!-- Languages Section -->
          ${cvData.languages && cvData.languages.length > 0 ? `
            <section class="cv-section languages-section">
              <div class="section-header">
                <h3 class="section-title">Langues</h3>
              </div>
              <div class="section-content">
                <div class="languages-container">
                  ${cvData.languages.map(lang => `
                    <div class="language-item">
                      <span class="language-name">${htmlUtils.escapeHtml(lang.name)}</span>
                      <span class="language-level">${this.getLanguageLevelLabel(lang.level || 1)}</span>
                      ${lang.certification ? `<span class="language-certification">(${htmlUtils.escapeHtml(lang.certification)})</span>` : ''}
                    </div>
                  `).join('')}
                </div>
              </div>
            </section>
          ` : ''}

          <!-- Projects Section (if any) -->
          ${cvData.projects && cvData.projects.length > 0 ? `
            <section class="cv-section projects-section">
              <div class="section-header">
                <h3 class="section-title">Projets Notables</h3>
              </div>
              <div class="section-content">
                ${cvData.projects.slice(0, 3).map(project => `
                  <div class="project-item">
                    <h4 class="project-name">${htmlUtils.escapeHtml(project.name)}</h4>
                    ${project.description ? `<p class="project-description">${htmlUtils.escapeHtml(project.description)}</p>` : ''}
                    ${project.technologies ? `<div class="project-technologies">Technologies: ${htmlUtils.escapeHtml(project.technologies)}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            </section>
          ` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Get CSS styles for the template
   * @returns {string} CSS styles
   */
  getCSS() {
    return `
      /* ===== EXECUTIVE ELITE TEMPLATE STYLES ===== */

      :root {
        --primary-color: #1a365d;
        --secondary-color: #2d3748;
        --accent-color: #3182ce;
        --text-primary: #1a202c;
        --text-secondary: #4a5568;
        --text-muted: #718096;
        --background: #ffffff;
        --surface: #f7fafc;
        --border: #e2e8f0;
        --border-dark: #cbd5e0;
        --shadow: rgba(0, 0, 0, 0.1);
        --shadow-lg: rgba(0, 0, 0, 0.15);
      }

      .cv-container {
        font-family: 'Times New Roman', 'Georgia', serif;
        max-width: 210mm;
        margin: 0 auto;
        background: var(--background);
        color: var(--text-primary);
        line-height: 1.6;
        font-size: 11pt;
      }

      /* ===== HEADER ===== */
      .cv-header {
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        padding: 2.5rem 2rem;
        border-bottom: 3px solid var(--accent-color);
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 2rem;
      }

      .personal-section {
        flex: 1;
      }

      .name {
        font-size: 2.2rem;
        font-weight: 700;
        margin: 0 0 0.5rem 0;
        color: white;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        letter-spacing: 0.5px;
      }

      .professional-title {
        font-size: 1.1rem;
        font-weight: 400;
        margin: 0;
        color: rgba(255, 255, 255, 0.9);
        font-style: italic;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .contact-section {
        flex: 0 0 300px;
      }

      .contact-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }

      .contact-item {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .contact-label {
        font-size: 0.8rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.8);
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .contact-value,
      .contact-link {
        font-size: 0.9rem;
        color: white;
        text-decoration: none;
        font-weight: 500;
      }

      .contact-link:hover {
        text-decoration: underline;
      }

      /* ===== BODY ===== */
      .cv-body {
        padding: 2rem;
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }

      /* ===== SECTIONS ===== */
      .cv-section {
        border: 2px solid var(--border-dark);
        border-radius: 0;
        background: var(--background);
        box-shadow: 0 2px 8px var(--shadow);
      }

      .section-header {
        background: var(--primary-color);
        color: white;
        padding: 1rem 1.5rem;
        border-bottom: 2px solid var(--accent-color);
      }

      .section-title {
        font-size: 1.2rem;
        font-weight: 700;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .section-content {
        padding: 1.5rem;
      }

      /* ===== SUMMARY ===== */
      .summary-section {
        border-color: var(--accent-color);
      }

      .summary-section .section-header {
        background: var(--accent-color);
      }

      .executive-summary {
        font-size: 1rem;
        line-height: 1.7;
        color: var(--text-primary);
        font-style: italic;
        text-align: justify;
        margin: 0;
      }

      /* ===== EXPERIENCE ===== */
      .experience-section {
        border-color: var(--primary-color);
      }

      .experience-item {
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid var(--border);
      }

      .experience-item:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }

      .experience-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
        gap: 1rem;
      }

      .position-company {
        flex: 1;
      }

      .position {
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--primary-color);
        margin: 0 0 0.25rem 0;
      }

      .company {
        font-size: 0.95rem;
        color: var(--text-secondary);
        font-weight: 600;
      }

      .experience-dates {
        font-size: 0.9rem;
        color: var(--text-muted);
        font-weight: 500;
        white-space: nowrap;
      }

      .experience-description {
        font-size: 0.95rem;
        color: var(--text-secondary);
        line-height: 1.6;
        margin-bottom: 1rem;
      }

      .achievements-section h5 {
        font-size: 0.9rem;
        font-weight: 700;
        color: var(--primary-color);
        margin: 0 0 0.5rem 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .achievements-list {
        margin: 0;
        padding-left: 1.5rem;
      }

      .achievements-list li {
        font-size: 0.9rem;
        color: var(--text-secondary);
        margin-bottom: 0.25rem;
        line-height: 1.5;
      }

      /* ===== EDUCATION ===== */
      .education-section {
        border-color: var(--secondary-color);
      }

      .education-item {
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--border);
      }

      .education-item:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }

      .education-degree {
        font-size: 1rem;
        font-weight: 700;
        color: var(--primary-color);
        margin-bottom: 0.25rem;
      }

      .education-institution {
        font-size: 0.95rem;
        color: var(--text-secondary);
        font-weight: 600;
        margin-bottom: 0.25rem;
      }

      .education-dates {
        font-size: 0.9rem;
        color: var(--text-muted);
        font-weight: 500;
      }

      .education-description {
        font-size: 0.9rem;
        color: var(--text-secondary);
        margin-top: 0.5rem;
        line-height: 1.5;
      }

      /* ===== SKILLS ===== */
      .skills-section {
        border-color: var(--accent-color);
      }

      .skills-container {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
      }

      .skill-item {
        background: var(--primary-color);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0;
        font-size: 0.85rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        box-shadow: 0 2px 4px var(--shadow);
      }

      /* ===== LANGUAGES ===== */
      .languages-section {
        border-color: var(--secondary-color);
      }

      .languages-container {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .language-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;
        background: var(--surface);
        border: 1px solid var(--border);
      }

      .language-name {
        font-weight: 600;
        color: var(--text-primary);
      }

      .language-level {
        font-size: 0.9rem;
        color: var(--text-secondary);
        font-weight: 500;
      }

      .language-certification {
        font-size: 0.8rem;
        color: var(--text-muted);
        font-style: italic;
      }

      /* ===== PROJECTS ===== */
      .projects-section {
        border-color: var(--accent-color);
      }

      .project-item {
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--border);
      }

      .project-item:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }

      .project-name {
        font-size: 1rem;
        font-weight: 700;
        color: var(--primary-color);
        margin: 0 0 0.5rem 0;
      }

      .project-description {
        font-size: 0.9rem;
        color: var(--text-secondary);
        line-height: 1.6;
        margin: 0 0 0.5rem 0;
      }

      .project-technologies {
        font-size: 0.85rem;
        color: var(--accent-color);
        font-weight: 600;
      }

      /* ===== RESPONSIVE DESIGN ===== */
      @media (max-width: 768px) {
        .cv-container {
          font-size: 10pt;
        }

        .cv-header {
          padding: 2rem 1.5rem;
        }

        .header-content {
          flex-direction: column;
          gap: 1.5rem;
        }

        .contact-section {
          flex: none;
        }

        .name {
          font-size: 1.8rem;
        }

        .professional-title {
          font-size: 1rem;
        }

        .section-content {
          padding: 1rem;
        }

        .experience-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .experience-dates {
          align-self: flex-end;
        }
      }

      /* ===== PRINT STYLES ===== */
      @media print {
        .cv-container {
          font-size: 10pt;
        }

        .cv-section {
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .experience-item,
        .education-item,
        .project-item {
          break-inside: avoid;
          page-break-inside: avoid;
        }
      }
    `;
  }

  /**
   * Validate CV data for this template
   * @param {Object} cvData - CV data
   * @returns {Object} Validation result
   */
  validate(cvData) {
    return validationUtils.validateExecutiveElite(cvData);
  }

  /**
   * Get language level label
   * @param {number} level - Language level
   * @returns {string} Level label
   */
  getLanguageLevelLabel(level) {
    const labels = {
      1: 'Débutant',
      2: 'Élémentaire',
      3: 'Intermédiaire',
      4: 'Avancé',
      5: 'Courant'
    };
    return labels[level] || 'Non spécifié';
  }

  /**
   * Format date range
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @param {boolean} current - Is current position
   * @returns {string} Formatted date range
   */
  formatDateRange(startDate, endDate, current = false) {
    const formatDate = (dateString) => {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' });
      } catch {
        return dateString;
      }
    };

    const start = formatDate(startDate);
    const end = current ? 'Présent' : formatDate(endDate);

    if (start && end) {
      return `${start} - ${end}`;
    } else if (start) {
      return start;
    } else if (end) {
      return end;
    }

    return '';
  }
}

module.exports = ExecutiveEliteTemplate;