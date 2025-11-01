/**
 * Modern Double Column Template - Nexus Pro
 * A professional double-column layout with modern design
 */
const htmlUtils = require('../utils/htmlUtils');
const cssUtils = require('../utils/cssUtils');
const validationUtils = require('../utils/validation');

class ModernDoubleTemplate {
  constructor() {
    this.name = 'Nexus Pro';
    this.description = 'Design futuriste avec double colonne, parfait pour les profils tech et créatifs';
    this.category = 'double-column';
    this.premium = false;
    this.version = '1.0.0';
    this.author = 'MBOA-CV';
    this.createdAt = '2024-01-01T00:00:00Z';

    this.features = [
      'Double colonne moderne',
      'Sidebar avec photo et compétences',
      'Design responsive optimisé PDF',
      'Gradients et effets visuels'
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
          <div class="header-main">
            <div class="personal-info">
              <h1 class="name">${htmlUtils.escapeHtml(sanitized.personalInfo?.firstName || '')} ${htmlUtils.escapeHtml(sanitized.personalInfo?.lastName || '')}</h1>
              <div class="contact-info">
                ${sanitized.personalInfo?.email ? `<div class="contact-item"><i class="icon-email"></i>${htmlUtils.escapeHtml(sanitized.personalInfo.email)}</div>` : ''}
                ${sanitized.personalInfo?.phone ? `<div class="contact-item"><i class="icon-phone"></i>${htmlUtils.escapeHtml(sanitized.personalInfo.phone)}</div>` : ''}
                ${sanitized.personalInfo?.address ? `<div class="contact-item"><i class="icon-location"></i>${htmlUtils.escapeHtml(sanitized.personalInfo.address)}</div>` : ''}
              </div>
            </div>
            ${sanitized.personalInfo?.photo ? `<div class="photo-container"><img src="${htmlUtils.escapeHtml(sanitized.personalInfo.photo)}" alt="Photo de profil" class="profile-photo"></div>` : ''}
          </div>
        </header>

        <div class="cv-content">
          <!-- Sidebar -->
          <aside class="cv-sidebar">
            ${this.renderSidebar(sanitized)}
          </aside>

          <!-- Main Content -->
          <main class="cv-main">
            ${this.renderMainContent(sanitized)}
          </main>
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
          <h3 class="section-title">Profil</h3>
          <p class="summary-text">${htmlUtils.escapeHtml(cvData.summary)}</p>
        </section>
      ` : ''}

      <!-- Skills -->
      ${cvData.skills && cvData.skills.length > 0 ? `
        <section class="sidebar-section">
          <h3 class="section-title">Compétences</h3>
          <div class="skills-list">
            ${cvData.skills.map(skill => `<span class="skill-tag">${htmlUtils.escapeHtml(skill)}</span>`).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Languages -->
      ${cvData.languages && cvData.languages.length > 0 ? `
        <section class="sidebar-section">
          <h3 class="section-title">Langues</h3>
          <div class="languages-list">
            ${cvData.languages.map(lang => `
              <div class="language-item">
                <div class="language-name">${htmlUtils.escapeHtml(lang.name)}</div>
                <div class="language-level">
                  <div class="level-bar">
                    <div class="level-fill language-level-${lang.level || 1}"></div>
                  </div>
                  <span class="level-text">${this.getLanguageLevelLabel(lang.level || 1)}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Contact Links -->
      <section class="sidebar-section">
        <h3 class="section-title">Contact</h3>
        <div class="contact-links">
          ${cvData.personalInfo?.linkedin ? `<a href="${htmlUtils.escapeHtml(cvData.personalInfo.linkedin)}" class="contact-link">LinkedIn</a>` : ''}
          ${cvData.personalInfo?.website ? `<a href="${htmlUtils.escapeHtml(cvData.personalInfo.website)}" class="contact-link">Site Web</a>` : ''}
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
          <h2 class="section-title">Expérience Professionnelle</h2>
          <div class="timeline">
            ${cvData.experiences.map((exp, index) => `
              <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <div class="experience-header">
                    <h3 class="position">${htmlUtils.escapeHtml(exp.position)}</h3>
                    <div class="company-info">
                      <span class="company">${htmlUtils.escapeHtml(exp.company)}</span>
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
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Education -->
      ${cvData.education && cvData.education.length > 0 ? `
        <section class="main-section">
          <h2 class="section-title">Formation</h2>
          ${cvData.education.map(edu => `
            <div class="education-item">
              <div class="education-header">
                <h3 class="degree">${htmlUtils.escapeHtml(edu.degree)}</h3>
                <div class="institution-info">
                  <span class="institution">${htmlUtils.escapeHtml(edu.institution)}</span>
                  <span class="period">${this.formatDateRange(edu.startDate, edu.endDate)}</span>
                </div>
              </div>
              ${edu.description ? `<p class="description">${htmlUtils.escapeHtml(edu.description)}</p>` : ''}
            </div>
          `).join('')}
        </section>
      ` : ''}

      <!-- Projects -->
      ${cvData.projects && cvData.projects.length > 0 ? `
        <section class="main-section">
          <h2 class="section-title">Projets</h2>
          <div class="projects-grid">
            ${cvData.projects.map(project => `
              <div class="project-item">
                <h3 class="project-name">${htmlUtils.escapeHtml(project.name)}</h3>
                ${project.description ? `<p class="project-description">${htmlUtils.escapeHtml(project.description)}</p>` : ''}
                ${project.technologies ? `<div class="project-tech">${htmlUtils.escapeHtml(project.technologies)}</div>` : ''}
                ${project.url ? `<a href="${htmlUtils.escapeHtml(project.url)}" class="project-link">Voir le projet</a>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Hobbies -->
      ${cvData.hobbies && cvData.hobbies.length > 0 ? `
        <section class="main-section">
          <h2 class="section-title">Centres d'intérêt</h2>
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
      /* ===== MODERN DOUBLE COLUMN TEMPLATE STYLES ===== */

      :root {
        --primary-color: #00d4ff;
        --secondary-color: #b967ff;
        --accent-color: #00ff88;
        --text-primary: #1a1a2e;
        --text-secondary: #4a5568;
        --text-muted: #718096;
        --background: #ffffff;
        --surface: #f8fafc;
        --border: #e2e8f0;
        --shadow: rgba(0, 0, 0, 0.1);
      }

      .cv-container {
        font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
        max-width: 210mm;
        margin: 0 auto;
        background: var(--background);
        color: var(--text-primary);
        line-height: 1.6;
      }

      /* ===== HEADER ===== */
      .cv-header {
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        padding: 2rem;
        position: relative;
        overflow: hidden;
      }

      .cv-header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.2)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
        opacity: 0.3;
      }

      .header-main {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        z-index: 1;
      }

      .personal-info {
        flex: 1;
      }

      .name {
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0 0 1rem 0;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      .contact-info {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .contact-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        opacity: 0.9;
      }

      .photo-container {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        overflow: hidden;
        border: 4px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      }

      .profile-photo {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      /* ===== LAYOUT ===== */
      .cv-content {
        display: flex;
        gap: 2rem;
        padding: 2rem;
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
        gap: 2rem;
      }

      /* ===== SIDEBAR SECTIONS ===== */
      .sidebar-section {
        background: var(--surface);
        padding: 1.5rem;
        border-radius: 12px;
        border: 1px solid var(--border);
        box-shadow: 0 4px 6px var(--shadow);
      }

      .section-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--primary-color);
        margin: 0 0 1rem 0;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .summary-text {
        font-size: 0.9rem;
        color: var(--text-secondary);
        line-height: 1.6;
      }

      .skills-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .skill-tag {
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        padding: 0.4rem 0.8rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
        box-shadow: 0 2px 4px rgba(0, 212, 255, 0.3);
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

      .language-name {
        font-weight: 600;
        color: var(--text-primary);
      }

      .language-level {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .level-bar {
        flex: 1;
        height: 6px;
        background: var(--border);
        border-radius: 3px;
        overflow: hidden;
      }

      .level-fill {
        height: 100%;
        border-radius: 3px;
        transition: width 0.3s ease;
      }

      .level-text {
        font-size: 0.8rem;
        color: var(--text-muted);
        font-weight: 500;
      }

      .contact-links {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .contact-link {
        color: var(--primary-color);
        text-decoration: none;
        font-weight: 500;
        font-size: 0.9rem;
        transition: color 0.3s ease;
      }

      .contact-link:hover {
        color: var(--secondary-color);
      }

      /* ===== MAIN CONTENT ===== */
      .main-section {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        border: 1px solid var(--border);
        box-shadow: 0 4px 6px var(--shadow);
      }

      .main-section .section-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0 0 1.5rem 0;
        position: relative;
      }

      .main-section .section-title::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 0;
        width: 60px;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        border-radius: 2px;
      }

      /* Timeline */
      .timeline {
        position: relative;
        padding-left: 2rem;
      }

      .timeline::before {
        content: '';
        position: absolute;
        left: 15px;
        top: 0;
        bottom: 0;
        width: 2px;
        background: linear-gradient(to bottom, var(--primary-color), var(--secondary-color));
        border-radius: 1px;
      }

      .timeline-item {
        position: relative;
        margin-bottom: 2rem;
        padding-left: 2rem;
      }

      .timeline-marker {
        position: absolute;
        left: -23px;
        top: 8px;
        width: 12px;
        height: 12px;
        background: var(--primary-color);
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 0 0 3px var(--primary-color);
      }

      .timeline-content {
        background: var(--surface);
        padding: 1.5rem;
        border-radius: 8px;
        border: 1px solid var(--border);
      }

      .experience-header {
        margin-bottom: 1rem;
      }

      .position {
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 0.5rem 0;
      }

      .company-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.9rem;
        color: var(--text-secondary);
      }

      .company {
        font-weight: 600;
        color: var(--primary-color);
      }

      .description {
        color: var(--text-secondary);
        margin: 1rem 0;
        line-height: 1.6;
      }

      .achievements {
        margin: 1rem 0 0 0;
        padding-left: 1.5rem;
      }

      .achievements li {
        margin-bottom: 0.5rem;
        color: var(--text-secondary);
      }

      /* Education */
      .education-item {
        background: var(--surface);
        padding: 1.5rem;
        border-radius: 8px;
        border: 1px solid var(--border);
        margin-bottom: 1rem;
      }

      .education-header {
        margin-bottom: 1rem;
      }

      .degree {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 0.5rem 0;
      }

      .institution-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.9rem;
        color: var(--text-secondary);
      }

      .institution {
        font-weight: 600;
        color: var(--secondary-color);
      }

      /* Projects */
      .projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1rem;
      }

      .project-item {
        background: var(--surface);
        padding: 1.5rem;
        border-radius: 8px;
        border: 1px solid var(--border);
      }

      .project-name {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 0.5rem 0;
      }

      .project-description {
        color: var(--text-secondary);
        margin: 0 0 0.5rem 0;
        font-size: 0.9rem;
      }

      .project-tech {
        font-size: 0.8rem;
        color: var(--accent-color);
        font-weight: 500;
        margin: 0 0 0.5rem 0;
      }

      .project-link {
        color: var(--primary-color);
        text-decoration: none;
        font-weight: 500;
        font-size: 0.9rem;
      }

      /* Hobbies */
      .hobbies-list {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
      }

      .hobby-item {
        background: var(--surface);
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid var(--border);
        flex: 1;
        min-width: 200px;
      }

      .hobby-name {
        font-weight: 600;
        color: var(--text-primary);
        display: block;
        margin-bottom: 0.25rem;
      }

      .hobby-description {
        color: var(--text-secondary);
        font-size: 0.9rem;
      }

      /* ===== RESPONSIVE DESIGN ===== */
      @media (max-width: 768px) {
        .cv-content {
          flex-direction: column;
          gap: 1.5rem;
        }

        .cv-sidebar {
          flex: none;
          order: 2;
        }

        .cv-main {
          order: 1;
        }

        .header-main {
          flex-direction: column;
          text-align: center;
          gap: 1.5rem;
        }

        .name {
          font-size: 2rem;
        }

        .photo-container {
          width: 100px;
          height: 100px;
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
        .timeline-content,
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
    return validationUtils.validateModernDouble(cvData);
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

module.exports = ModernDoubleTemplate;