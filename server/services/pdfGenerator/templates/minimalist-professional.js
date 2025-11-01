/**
 * Minimalist Professional Template - Clean and elegant design
 */
const htmlUtils = require('../utils/htmlUtils');
const cssUtils = require('../utils/cssUtils');
const validationUtils = require('../utils/validation');

class MinimalistProfessionalTemplate {
  constructor() {
    this.name = 'Minimalist Professional';
    this.description = 'Design épuré et élégant, focus sur le contenu avec une typographie raffinée';
    this.category = 'minimalist';
    this.premium = false;
    this.version = '1.0.0';
    this.author = 'MBOA-CV';
    this.createdAt = '2024-01-01T00:00:00Z';

    this.features = [
      'Design minimaliste épuré',
      'Typographie élégante',
      'Espaces négatifs maîtrisés',
      'Structure hiérarchisée claire',
      'Focus sur le contenu'
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
              <h1 class="main-name">${htmlUtils.escapeHtml(sanitized.personalInfo?.firstName || '')} ${htmlUtils.escapeHtml(sanitized.personalInfo?.lastName || '')}</h1>
              ${sanitized.personalInfo?.title ? `<div class="professional-title">${htmlUtils.escapeHtml(sanitized.personalInfo.title)}</div>` : ''}
            </div>

            <div class="contact-section">
              <div class="contact-grid">
                ${sanitized.personalInfo?.email ? `<div class="contact-item"><span class="contact-icon">✉</span><span>${htmlUtils.escapeHtml(sanitized.personalInfo.email)}</span></div>` : ''}
                ${sanitized.personalInfo?.phone ? `<div class="contact-item"><span class="contact-icon">📞</span><span>${htmlUtils.escapeHtml(sanitized.personalInfo.phone)}</span></div>` : ''}
                ${sanitized.personalInfo?.address ? `<div class="contact-item"><span class="contact-icon">📍</span><span>${htmlUtils.escapeHtml(sanitized.personalInfo.address)}</span></div>` : ''}
                ${sanitized.personalInfo?.linkedin ? `<div class="contact-item"><span class="contact-icon">💼</span><a href="${htmlUtils.escapeHtml(sanitized.personalInfo.linkedin)}" class="contact-link">LinkedIn</a></div>` : ''}
              </div>
            </div>
          </div>
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
      <!-- Photo Section -->
      ${cvData.personalInfo?.photo ? `
        <section class="sidebar-section photo-section">
          <div class="photo-container">
            <img src="${htmlUtils.escapeHtml(cvData.personalInfo.photo)}" alt="Photo de profil" class="profile-photo">
          </div>
        </section>
      ` : ''}

      <!-- Summary -->
      ${cvData.summary ? `
        <section class="sidebar-section">
          <h2 class="section-title">Profil</h2>
          <p class="summary-text">${htmlUtils.escapeHtml(cvData.summary)}</p>
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
                <div class="language-info">
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
                  <h3 class="position">${htmlUtils.escapeHtml(exp.position)}</h3>
                  <div class="company-info">
                    <span class="company">${htmlUtils.escapeHtml(exp.company)}</span>
                    <span class="separator">•</span>
                    <span class="period">${this.formatDateRange(exp.startDate, exp.endDate, exp.current)}</span>
                  </div>
                </div>
                ${exp.description ? `<p class="description">${htmlUtils.escapeHtml(exp.description)}</p>` : ''}
                ${exp.achievements && exp.achievements.length > 0 ? `
                  <ul class="achievements">
                    ${exp.achievements.map(achievement => `<li>${htmlUtils.escapeHtml(achievement)}</li>`).join('')}
                  </ul>
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
                  <h3 class="degree">${htmlUtils.escapeHtml(edu.degree)}</h3>
                  <div class="institution-info">
                    <span class="institution">${htmlUtils.escapeHtml(edu.institution)}</span>
                    <span class="separator">•</span>
                    <span class="period">${this.formatDateRange(edu.startDate, edu.endDate)}</span>
                  </div>
                </div>
                ${edu.description ? `<p class="description">${htmlUtils.escapeHtml(edu.description)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Projects -->
      ${cvData.projects && cvData.projects.length > 0 ? `
        <section class="main-section">
          <h2 class="section-title-main">Projets</h2>
          <div class="projects-list">
            ${cvData.projects.map(project => `
              <div class="project-item">
                <div class="project-header">
                  <h3 class="project-name">${htmlUtils.escapeHtml(project.name)}</h3>
                  ${project.url ? `<a href="${htmlUtils.escapeHtml(project.url)}" class="project-link">🔗</a>` : ''}
                </div>
                ${project.description ? `<p class="project-description">${htmlUtils.escapeHtml(project.description)}</p>` : ''}
                ${project.technologies ? `<div class="project-tech">${htmlUtils.escapeHtml(project.technologies)}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Hobbies -->
      ${cvData.hobbies && cvData.hobbies.length > 0 ? `
        <section class="main-section">
          <h2 class="section-title-main">Centres d'intérêt</h2>
          <div class="hobbies-list">
            ${cvData.hobbies.map(hobby => `
              <div class="hobby-item">
                <span class="hobby-name">${htmlUtils.escapeHtml(hobby.name)}</span>
                ${hobby.description ? `<span class="hobby-description">${htmlUtils.escapeHtml(hobby.description)}</span>` : ''}
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
      /* ===== MINIMALIST PROFESSIONAL TEMPLATE STYLES ===== */

      :root {
        --primary-color: #2c3e50;
        --secondary-color: #34495e;
        --accent-color: #3498db;
        --text-primary: #2c3e50;
        --text-secondary: #5a6c7d;
        --text-muted: #95a5a6;
        --background: #ffffff;
        --surface: #f8f9fa;
        --border: #ecf0f1;
        --shadow: rgba(0, 0, 0, 0.05);
        --shadow-hover: rgba(0, 0, 0, 0.1);
      }

      .cv-container {
        font-family: 'Inter', 'Source Sans Pro', -apple-system, BlinkMacSystemFont, sans-serif;
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
        border-bottom: 1px solid var(--border);
        padding: 2rem;
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 3rem;
      }

      .personal-section {
        flex: 1;
      }

      .main-name {
        font-size: 2.2rem;
        font-weight: 300;
        color: var(--primary-color);
        margin: 0 0 0.5rem 0;
        letter-spacing: -0.5px;
        line-height: 1.2;
      }

      .professional-title {
        font-size: 1.1rem;
        color: var(--accent-color);
        font-weight: 400;
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
        align-items: center;
        gap: 0.75rem;
        font-size: 0.9rem;
        color: var(--text-secondary);
      }

      .contact-icon {
        font-size: 1rem;
        color: var(--accent-color);
        min-width: 20px;
      }

      .contact-link {
        color: var(--accent-color);
        text-decoration: none;
        font-weight: 500;
        transition: color 0.3s ease;
      }

      .contact-link:hover {
        color: var(--primary-color);
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
        padding: 1.5rem 0;
        border-bottom: 1px solid var(--border);
      }

      .sidebar-section:last-child {
        border-bottom: none;
      }

      .photo-section {
        text-align: center;
        padding: 2rem 0;
        border-bottom: 1px solid var(--border);
      }

      .photo-container {
        width: 140px;
        height: 140px;
        margin: 0 auto;
        border-radius: 50%;
        overflow: hidden;
        border: 3px solid var(--accent-color);
        box-shadow: 0 4px 12px var(--shadow);
      }

      .profile-photo {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .section-title {
        font-size: 1rem;
        font-weight: 600;
        color: var(--primary-color);
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
        width: 30px;
        height: 2px;
        background: var(--accent-color);
      }

      .summary-text {
        font-size: 0.9rem;
        color: var(--text-secondary);
        line-height: 1.6;
        margin: 0;
      }

      .skills-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .skill-item {
        font-size: 0.9rem;
        color: var(--text-primary);
        font-weight: 500;
        padding: 0.25rem 0;
        border-bottom: 1px solid var(--border);
      }

      .skill-item:last-child {
        border-bottom: none;
      }

      .languages-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .language-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .language-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .language-name {
        font-weight: 500;
        color: var(--text-primary);
      }

      .language-level {
        font-size: 0.8rem;
        color: var(--text-muted);
        font-weight: 400;
      }

      .language-bar {
        height: 4px;
        background: var(--border);
        border-radius: 2px;
        overflow: hidden;
      }

      .language-fill {
        height: 100%;
        border-radius: 2px;
        transition: width 0.3s ease;
      }

      /* ===== MAIN CONTENT ===== */
      .main-section {
        padding: 0;
      }

      .section-title-main {
        font-size: 1.4rem;
        font-weight: 300;
        color: var(--primary-color);
        margin: 0 0 1.5rem 0;
        text-transform: uppercase;
        letter-spacing: 2px;
        position: relative;
      }

      .section-title-main::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 0;
        width: 80px;
        height: 1px;
        background: var(--accent-color);
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
      }

      .experience-item:last-child {
        border-bottom: none;
      }

      .experience-header {
        margin-bottom: 1rem;
      }

      .position {
        font-size: 1.2rem;
        font-weight: 400;
        color: var(--primary-color);
        margin: 0 0 0.5rem 0;
      }

      .company-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        color: var(--text-secondary);
      }

      .company {
        font-weight: 500;
        color: var(--accent-color);
      }

      .separator {
        color: var(--text-muted);
      }

      .description {
        color: var(--text-secondary);
        line-height: 1.6;
        margin: 1rem 0;
      }

      .achievements {
        margin: 1rem 0 0 0;
        padding-left: 1rem;
      }

      .achievements li {
        margin-bottom: 0.5rem;
        color: var(--text-secondary);
        position: relative;
      }

      .achievements li::before {
        content: '—';
        color: var(--accent-color);
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

      .degree {
        font-size: 1.1rem;
        font-weight: 400;
        color: var(--primary-color);
        margin: 0 0 0.5rem 0;
      }

      .institution-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        color: var(--text-secondary);
      }

      .institution {
        font-weight: 500;
        color: var(--accent-color);
      }

      /* Projects */
      .projects-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
      }

      .project-item {
        padding: 1.5rem;
        background: var(--surface);
        border-radius: 4px;
        border: 1px solid var(--border);
      }

      .project-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 0.75rem;
      }

      .project-name {
        font-size: 1.1rem;
        font-weight: 500;
        color: var(--primary-color);
        margin: 0;
      }

      .project-link {
        color: var(--accent-color);
        text-decoration: none;
        font-size: 1.2rem;
        transition: color 0.3s ease;
      }

      .project-link:hover {
        color: var(--primary-color);
      }

      .project-description {
        color: var(--text-secondary);
        line-height: 1.5;
        margin: 0 0 0.75rem 0;
      }

      .project-tech {
        font-size: 0.85rem;
        color: var(--text-muted);
        font-weight: 500;
      }

      /* Hobbies */
      .hobbies-list {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .hobby-item {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding: 0.75rem 1rem;
        background: var(--surface);
        border-radius: 4px;
        border: 1px solid var(--border);
      }

      .hobby-name {
        font-weight: 500;
        color: var(--text-primary);
      }

      .hobby-description {
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

        .header-content {
          flex-direction: column;
          gap: 2rem;
          text-align: center;
        }

        .main-name {
          font-size: 1.8rem;
        }

        .contact-section {
          flex: none;
          width: 100%;
        }

        .contact-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .projects-list {
          grid-template-columns: 1fr;
        }

        .photo-container {
          width: 120px;
          height: 120px;
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
        .hobby-item {
          break-inside: avoid;
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
    return validationUtils.validateMinimalistProfessional(cvData);
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
      5: 'Natif'
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

module.exports = MinimalistProfessionalTemplate;