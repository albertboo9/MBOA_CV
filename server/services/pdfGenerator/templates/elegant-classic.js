/**
 * Elegant Classic Template - Timeless and sophisticated design
 */
const htmlUtils = require('../utils/htmlUtils');
const cssUtils = require('../utils/cssUtils');
const validationUtils = require('../utils/validation');

class ElegantClassicTemplate {
  constructor() {
    this.name = 'Elegant Classic';
    this.description = 'Design classique élégant avec une touche de sophistication moderne';
    this.category = 'classic';
    this.premium = false;
    this.version = '1.0.0';
    this.author = 'MBOA-CV';
    this.createdAt = '2024-01-01T00:00:00Z';

    this.features = [
      'Design classique intemporel',
      'Typographie serif élégante',
      'Structure hiérarchisée claire',
      'Éléments décoratifs subtils',
      'Palette de couleurs sophistiquées'
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
        <!-- Classic Header -->
        <header class="cv-header">
          <div class="header-classic">
            <div class="personal-section">
              <h1 class="main-name">${htmlUtils.escapeHtml(sanitized.personalInfo?.firstName || '')} ${htmlUtils.escapeHtml(sanitized.personalInfo?.lastName || '')}</h1>
              ${sanitized.personalInfo?.title ? `<div class="professional-title">${htmlUtils.escapeHtml(sanitized.personalInfo.title)}</div>` : ''}

              <div class="contact-info">
                ${sanitized.personalInfo?.email ? `<div class="contact-item">✉ ${htmlUtils.escapeHtml(sanitized.personalInfo.email)}</div>` : ''}
                ${sanitized.personalInfo?.phone ? `<div class="contact-item">📞 ${htmlUtils.escapeHtml(sanitized.personalInfo.phone)}</div>` : ''}
                ${sanitized.personalInfo?.address ? `<div class="contact-item">📍 ${htmlUtils.escapeHtml(sanitized.personalInfo.address)}</div>` : ''}
              </div>
            </div>

            ${sanitized.personalInfo?.photo ? `
              <div class="photo-section">
                <div class="photo-frame">
                  <img src="${htmlUtils.escapeHtml(sanitized.personalInfo.photo)}" alt="Photo professionnelle" class="profile-photo">
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Decorative Border -->
          <div class="header-border"></div>
        </header>

        <div class="cv-body">
          <!-- Left Column -->
          <div class="cv-sidebar">
            ${this.renderSidebar(sanitized)}
          </div>

          <!-- Right Column -->
          <div class="cv-main">
            ${this.renderMainContent(sanitized)}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render sidebar content
   * @param {Object} cvData - CV data
   * @returns {string} Sidebar HTML
   */
  renderSidebar(cvData) {
    return `
      <!-- Summary -->
      ${cvData.summary ? `
        <section class="sidebar-section">
          <h2 class="section-title">Profil Professionnel</h2>
          <div class="summary-box">
            <p class="summary-text">${htmlUtils.escapeHtml(cvData.summary)}</p>
          </div>
        </section>
      ` : ''}

      <!-- Skills -->
      ${cvData.skills && cvData.skills.length > 0 ? `
        <section class="sidebar-section">
          <h2 class="section-title">Compétences</h2>
          <div class="skills-list">
            ${cvData.skills.map(skill => `<div class="skill-item">${htmlUtils.escapeHtml(skill)}</div>`).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Languages -->
      ${cvData.languages && cvData.languages.length > 0 ? `
        <section class="sidebar-section">
          <h2 class="section-title">Langues</h2>
          <div class="languages-list">
            ${cvData.languages.map(lang => `
              <div class="language-item">
                <div class="language-header">
                  <span class="language-name">${htmlUtils.escapeHtml(lang.name)}</span>
                  <span class="language-level">${this.getLanguageLevelLabel(lang.level || 1)}</span>
                </div>
                <div class="language-bar">
                  <div class="language-fill language-level-${lang.level || 1}"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Additional Information -->
      <section class="sidebar-section">
        <h2 class="section-title">Informations</h2>
        <div class="additional-info">
          <div class="info-item">
            <span class="info-label">Disponibilité:</span>
            <span class="info-value">Immédiate</span>
          </div>
          <div class="info-item">
            <span class="info-label">Permis:</span>
            <span class="info-value">B</span>
          </div>
        </div>
      </section>
    `;
  }

  /**
   * Render main content
   * @param {Object} cvData - CV data
   * @returns {string} Main content HTML
   */
  renderMainContent(cvData) {
    return `
      <!-- Experience -->
      ${cvData.experiences && cvData.experiences.length > 0 ? `
        <section class="main-section">
          <h2 class="section-title-main">Expérience Professionnelle</h2>
          <div class="experiences-list">
            ${cvData.experiences.map(exp => `
              <div class="experience-item">
                <div class="experience-header">
                  <h3 class="position-title">${htmlUtils.escapeHtml(exp.position)}</h3>
                  <div class="company-info">
                    <span class="company-name">${htmlUtils.escapeHtml(exp.company)}</span>
                    <span class="separator">•</span>
                    <span class="employment-period">${this.formatDateRange(exp.startDate, exp.endDate, exp.current)}</span>
                  </div>
                </div>
                ${exp.description ? `<p class="position-description">${htmlUtils.escapeHtml(exp.description)}</p>` : ''}
                ${exp.achievements && exp.achievements.length > 0 ? `
                  <div class="achievements-section">
                    <h4>Réalisations principales:</h4>
                    <ul>
                      ${exp.achievements.map(achievement => `<li>${htmlUtils.escapeHtml(achievement)}</li>`).join('')}
                    </ul>
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Education -->
      ${cvData.education && cvData.education.length > 0 ? `
        <section class="main-section">
          <h2 class="section-title-main">Formation</h2>
          <div class="education-list">
            ${cvData.education.map(edu => `
              <div class="education-item">
                <div class="education-header">
                  <h3 class="degree-title">${htmlUtils.escapeHtml(edu.degree)}</h3>
                  <div class="institution-info">
                    <span class="institution-name">${htmlUtils.escapeHtml(edu.institution)}</span>
                    <span class="separator">•</span>
                    <span class="education-period">${this.formatDateRange(edu.startDate, edu.endDate)}</span>
                  </div>
                </div>
                ${edu.description ? `<p class="education-description">${htmlUtils.escapeHtml(edu.description)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Projects -->
      ${cvData.projects && cvData.projects.length > 0 ? `
        <section class="main-section">
          <h2 class="section-title-main">Projets Notables</h2>
          <div class="projects-list">
            ${cvData.projects.map(project => `
              <div class="project-item">
                <div class="project-header">
                  <h3 class="project-title">${htmlUtils.escapeHtml(project.name)}</h3>
                  ${project.url ? `<a href="${htmlUtils.escapeHtml(project.url)}" class="project-link">Lien vers le projet</a>` : ''}
                </div>
                ${project.description ? `<p class="project-description">${htmlUtils.escapeHtml(project.description)}</p>` : ''}
                ${project.technologies ? `<div class="project-technologies">Technologies: ${htmlUtils.escapeHtml(project.technologies)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Interests -->
      ${cvData.hobbies && cvData.hobbies.length > 0 ? `
        <section class="main-section">
          <h2 class="section-title-main">Centres d'intérêt</h2>
          <div class="interests-list">
            ${cvData.hobbies.map(hobby => `
              <div class="interest-item">
                <span class="interest-name">${htmlUtils.escapeHtml(hobby.name)}</span>
                ${hobby.description ? `<span class="interest-description">${htmlUtils.escapeHtml(hobby.description)}</span>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}
    `;
  }

  /**
   * Get CSS styles for the template
   * @returns {string} CSS styles
   */
  getCSS() {
    return `
      /* ===== ELEGANT CLASSIC TEMPLATE STYLES ===== */

      :root {
        --primary-navy: #1e3a8a;
        --primary-charcoal: #374151;
        --accent-gold: #d4af37;
        --accent-silver: #9ca3af;
        --text-primary: #1f2937;
        --text-secondary: #6b7280;
        --text-muted: #9ca3af;
        --background: #ffffff;
        --surface: #f9fafb;
        --border: #e5e7eb;
        --shadow: rgba(0, 0, 0, 0.1);
        --shadow-hover: rgba(0, 0, 0, 0.15);
      }

      .cv-container {
        font-family: 'Times New Roman', 'Garamond', serif;
        max-width: 210mm;
        margin: 0 auto;
        background: var(--background);
        color: var(--text-primary);
        line-height: 1.6;
        font-size: 11pt;
      }

      /* ===== HEADER ===== */
      .cv-header {
        background: var(--background);
        padding: 2.5rem 2rem;
        position: relative;
        border-bottom: 2px solid var(--primary-navy);
      }

      .header-classic {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 3rem;
      }

      .personal-section {
        flex: 1;
      }

      .main-name {
        font-size: 2.5rem;
        font-weight: 400;
        color: var(--primary-navy);
        margin: 0 0 0.5rem 0;
        letter-spacing: -0.5px;
        line-height: 1.2;
        text-transform: uppercase;
      }

      .professional-title {
        font-size: 1.1rem;
        color: var(--accent-gold);
        font-weight: 400;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 1.5rem;
      }

      .contact-info {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 1rem;
      }

      .contact-item {
        font-size: 0.9rem;
        color: var(--text-secondary);
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .photo-section {
        flex: 0 0 150px;
      }

      .photo-frame {
        width: 140px;
        height: 180px;
        border: 3px solid var(--primary-navy);
        background: var(--surface);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        box-shadow: 0 4px 8px var(--shadow);
      }

      .profile-photo {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .header-border {
        position: absolute;
        bottom: 0;
        left: 2rem;
        right: 2rem;
        height: 2px;
        background: linear-gradient(90deg, transparent, var(--accent-gold), transparent);
      }

      /* ===== LAYOUT ===== */
      .cv-body {
        display: flex;
        padding: 2rem;
        gap: 3rem;
      }

      .cv-sidebar {
        flex: 0 0 280px;
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }

      .cv-main {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
      }

      /* ===== SIDEBAR SECTIONS ===== */
      .sidebar-section {
        background: var(--surface);
        padding: 1.5rem;
        border-left: 4px solid var(--accent-gold);
        box-shadow: 0 2px 4px var(--shadow);
        position: relative;
      }

      .section-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--primary-navy);
        margin: 0 0 1rem 0;
        text-transform: uppercase;
        letter-spacing: 1px;
        position: relative;
      }

      .section-title::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 0;
        width: 40px;
        height: 2px;
        background: var(--accent-gold);
      }

      .summary-box {
        background: var(--background);
        padding: 1rem;
        border: 1px solid var(--border);
        font-style: italic;
      }

      .summary-text {
        margin: 0;
        color: var(--text-secondary);
        line-height: 1.6;
      }

      .skills-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .skill-item {
        background: var(--background);
        padding: 0.5rem 1rem;
        border: 1px solid var(--border);
        font-size: 0.9rem;
        color: var(--text-primary);
        font-weight: 500;
        text-align: center;
        box-shadow: 0 1px 2px var(--shadow);
      }

      .languages-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .language-item {
        background: var(--background);
        padding: 1rem;
        border: 1px solid var(--border);
        box-shadow: 0 1px 2px var(--shadow);
      }

      .language-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
      }

      .language-name {
        font-weight: 600;
        color: var(--text-primary);
      }

      .language-level {
        font-size: 0.8rem;
        color: var(--text-muted);
        font-weight: 500;
        text-transform: uppercase;
      }

      .language-bar {
        height: 6px;
        background: var(--border);
        border-radius: 3px;
        overflow: hidden;
      }

      .language-fill {
        height: 100%;
        border-radius: 3px;
        transition: width 0.3s ease;
      }

      .additional-info {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
        background: var(--background);
        border: 1px solid var(--border);
      }

      .info-label {
        font-weight: 600;
        color: var(--primary-navy);
        font-size: 0.9rem;
      }

      .info-value {
        color: var(--text-secondary);
        font-size: 0.9rem;
      }

      /* ===== MAIN CONTENT ===== */
      .main-section {
        background: var(--background);
        padding: 2rem;
        border: 2px solid var(--border);
        box-shadow: 0 4px 8px var(--shadow);
      }

      .section-title-main {
        font-size: 1.6rem;
        font-weight: 400;
        color: var(--primary-navy);
        margin: 0 0 1.5rem 0;
        text-transform: uppercase;
        letter-spacing: 1px;
        position: relative;
        padding-bottom: 0.5rem;
      }

      .section-title-main::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100px;
        height: 3px;
        background: var(--accent-gold);
      }

      /* Experience */
      .experiences-list {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }

      .experience-item {
        padding: 1.5rem 0;
        border-bottom: 1px solid var(--border);
        position: relative;
      }

      .experience-item:last-child {
        border-bottom: none;
      }

      .experience-header {
        margin-bottom: 1rem;
      }

      .position-title {
        font-size: 1.3rem;
        font-weight: 600;
        color: var(--primary-navy);
        margin: 0 0 0.5rem 0;
      }

      .company-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        color: var(--text-secondary);
      }

      .company-name {
        font-weight: 600;
        color: var(--accent-gold);
      }

      .separator {
        color: var(--text-muted);
        font-weight: bold;
      }

      .employment-period {
        font-style: italic;
      }

      .position-description {
        color: var(--text-secondary);
        line-height: 1.6;
        margin: 1rem 0;
      }

      .achievements-section {
        margin-top: 1rem;
      }

      .achievements-section h4 {
        font-size: 1rem;
        font-weight: 600;
        color: var(--primary-navy);
        margin: 0 0 0.5rem 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .achievements-section ul {
        margin: 0;
        padding-left: 1.5rem;
      }

      .achievements-section li {
        margin-bottom: 0.5rem;
        color: var(--text-secondary);
        position: relative;
      }

      .achievements-section li::before {
        content: '•';
        color: var(--accent-gold);
        font-weight: bold;
        position: absolute;
        left: -1rem;
      }

      /* Education */
      .education-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .education-item {
        padding: 1.5rem 0;
        border-bottom: 1px solid var(--border);
      }

      .education-item:last-child {
        border-bottom: none;
      }

      .education-header {
        margin-bottom: 1rem;
      }

      .degree-title {
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--primary-navy);
        margin: 0 0 0.5rem 0;
      }

      .institution-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        color: var(--text-secondary);
      }

      .institution-name {
        font-weight: 600;
        color: var(--accent-gold);
      }

      .education-period {
        font-style: italic;
      }

      .education-description {
        color: var(--text-secondary);
        line-height: 1.6;
      }

      /* Projects */
      .projects-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
      }

      .project-item {
        background: var(--surface);
        padding: 1.5rem;
        border: 1px solid var(--border);
        box-shadow: 0 2px 4px var(--shadow);
      }

      .project-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
      }

      .project-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--primary-navy);
        margin: 0;
      }

      .project-link {
        color: var(--accent-gold);
        text-decoration: none;
        font-weight: 500;
        font-size: 0.9rem;
        transition: color 0.3s ease;
      }

      .project-link:hover {
        color: var(--primary-navy);
      }

      .project-description {
        color: var(--text-secondary);
        line-height: 1.5;
        margin: 0 0 0.75rem 0;
      }

      .project-technologies {
        font-size: 0.85rem;
        color: var(--text-muted);
        font-weight: 500;
        font-style: italic;
      }

      /* Interests */
      .interests-list {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .interest-item {
        background: var(--surface);
        padding: 0.75rem 1rem;
        border: 1px solid var(--border);
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .interest-name {
        font-weight: 600;
        color: var(--text-primary);
      }

      .interest-description {
        font-size: 0.85rem;
        color: var(--text-secondary);
      }

      /* ===== RESPONSIVE DESIGN ===== */
      @media (max-width: 768px) {
        .cv-body {
          flex-direction: column;
          gap: 2rem;
        }

        .cv-sidebar {
          flex: none;
          order: 2;
        }

        .cv-main {
          order: 1;
        }

        .header-classic {
          flex-direction: column;
          gap: 2rem;
          text-align: center;
        }

        .main-name {
          font-size: 2rem;
        }

        .photo-section {
          align-self: center;
        }

        .photo-frame {
          width: 120px;
          height: 150px;
        }

        .projects-list {
          grid-template-columns: 1fr;
        }
      }

      /* ===== PRINT STYLES ===== */
      @media print {
        .cv-container {
          box-shadow: none;
          border: none;
        }

        .sidebar-section,
        .main-section,
        .experience-item,
        .education-item,
        .project-item,
        .interest-item {
          break-inside: avoid;
          box-shadow: none !important;
        }
      }

      ${cssUtils.generateLanguageLevelCSS(1)}
      ${cssUtils.generateLanguageLevelCSS(2)}
      ${cssUtils.generateLanguageLevelCSS(3)}
      ${cssUtils.generateLanguageLevelCSS(4)}
      ${cssUtils.generateLanguageLevelCSS(5)}
    `;
  }

  /**
   * Validate CV data for this template
   * @param {Object} cvData - CV data
   * @returns {Object} Validation result
   */
  validate(cvData) {
    return validationUtils.validateElegantClassic(cvData);
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

module.exports = ElegantClassicTemplate;