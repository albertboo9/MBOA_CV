/**
 * Creative Minimal Template - Clean and artistic design
 */
const htmlUtils = require('../utils/htmlUtils');
const cssUtils = require('../utils/cssUtils');
const validationUtils = require('../utils/validation');

class CreativeMinimalTemplate {
  constructor() {
    this.name = 'Creative Minimal';
    this.description = 'Design créatif minimaliste avec des éléments artistiques subtils et une mise en page élégante';
    this.category = 'creative';
    this.premium = false;
    this.version = '1.0.0';
    this.author = 'MBOA-CV';
    this.createdAt = '2024-01-01T00:00:00Z';

    this.features = [
      'Design minimaliste créatif',
      'Éléments artistiques subtils',
      'Typographie élégante',
      'Espaces négatifs équilibrés',
      'Accents de couleur stratégiques'
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
        <!-- Creative Header -->
        <header class="cv-header">
          <div class="header-creative">
            <div class="personal-section">
              <h1 class="main-name">${htmlUtils.escapeHtml(sanitized.personalInfo?.firstName || '')}</h1>
              <h1 class="main-surname">${htmlUtils.escapeHtml(sanitized.personalInfo?.lastName || '')}</h1>
              ${sanitized.personalInfo?.title ? `<div class="creative-role">${htmlUtils.escapeHtml(sanitized.personalInfo.title)}</div>` : ''}
            </div>

            <div class="contact-section">
              <div class="contact-minimal">
                ${sanitized.personalInfo?.email ? `<div class="contact-line"><span class="contact-dot"></span><span>${htmlUtils.escapeHtml(sanitized.personalInfo.email)}</span></div>` : ''}
                ${sanitized.personalInfo?.phone ? `<div class="contact-line"><span class="contact-dot"></span><span>${htmlUtils.escapeHtml(sanitized.personalInfo.phone)}</span></div>` : ''}
                ${sanitized.personalInfo?.address ? `<div class="contact-line"><span class="contact-dot"></span><span>${htmlUtils.escapeHtml(sanitized.personalInfo.address)}</span></div>` : ''}
                ${sanitized.personalInfo?.linkedin ? `<div class="contact-line"><span class="contact-dot"></span><a href="${htmlUtils.escapeHtml(sanitized.personalInfo.linkedin)}" class="contact-link-minimal">LinkedIn</a></div>` : ''}
              </div>
            </div>
          </div>

          <!-- Minimalist Decorative Elements -->
          <div class="decorative-elements">
            <div class="decoration-line-left"></div>
            <div class="decoration-circle"></div>
            <div class="decoration-line-right"></div>
          </div>
        </header>

        <div class="cv-content">
          <!-- Left Column -->
          <div class="content-left">
            ${this.renderLeftColumn(sanitized)}
          </div>

          <!-- Right Column -->
          <div class="content-right">
            ${this.renderRightColumn(sanitized)}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render left column content
   * @param {Object} cvData - CV data
   * @returns {string} Left column HTML
   */
  renderLeftColumn(cvData) {
    return `
      <!-- Photo Section -->
      ${cvData.personalInfo?.photo ? `
        <section class="left-section">
          <div class="photo-section-minimal">
            <div class="photo-frame-minimal">
              <img src="${htmlUtils.escapeHtml(cvData.personalInfo.photo)}" alt="Photo de profil" class="profile-photo-minimal">
            </div>
          </div>
        </section>
      ` : ''}

      <!-- Summary -->
      ${cvData.summary ? `
        <section class="left-section">
          <h2 class="section-title-minimal">À propos</h2>
          <div class="summary-minimal">
            <p class="summary-text-minimal">${htmlUtils.escapeHtml(cvData.summary)}</p>
          </div>
        </section>
      ` : ''}

      <!-- Skills -->
      ${cvData.skills && cvData.skills.length > 0 ? `
        <section class="left-section">
          <h2 class="section-title-minimal">Compétences</h2>
          <div class="skills-minimal">
            ${cvData.skills.map((skill, index) => `
              <div class="skill-minimal">
                <span class="skill-name">${htmlUtils.escapeHtml(skill)}</span>
                <div class="skill-line skill-line-${(index % 3) + 1}"></div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Languages -->
      ${cvData.languages && cvData.languages.length > 0 ? `
        <section class="left-section">
          <h2 class="section-title-minimal">Langues</h2>
          <div class="languages-minimal">
            ${cvData.languages.map(lang => `
              <div class="language-minimal">
                <div class="language-info">
                  <span class="language-name">${htmlUtils.escapeHtml(lang.name)}</span>
                  <span class="language-level">${this.getLanguageLevelLabel(lang.level || 1)}</span>
                </div>
                <div class="language-dots">
                  ${Array.from({ length: 5 }, (_, i) => `
                    <span class="language-dot ${i < (lang.level || 1) ? 'active' : ''}"></span>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Interests -->
      ${cvData.hobbies && cvData.hobbies.length > 0 ? `
        <section class="left-section">
          <h2 class="section-title-minimal">Intérêts</h2>
          <div class="interests-minimal">
            ${cvData.hobbies.slice(0, 4).map(hobby => `
              <div class="interest-minimal">
                <span class="interest-name">${htmlUtils.escapeHtml(hobby.name)}</span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}
    `;
  }

  /**
   * Render right column content
   * @param {Object} cvData - CV data
   * @returns {string} Right column HTML
   */
  renderRightColumn(cvData) {
    return `
      <!-- Experience -->
      ${cvData.experiences && cvData.experiences.length > 0 ? `
        <section class="right-section">
          <h2 class="section-title-minimal">Expérience</h2>
          <div class="experiences-minimal">
            ${cvData.experiences.map((exp, index) => `
              <div class="experience-minimal">
                <div class="exp-header-minimal">
                  <h3 class="exp-position">${htmlUtils.escapeHtml(exp.position)}</h3>
                  <div class="exp-company">${htmlUtils.escapeHtml(exp.company)}</div>
                  <div class="exp-period">${this.formatDateRange(exp.startDate, exp.endDate, exp.current)}</div>
                </div>
                ${exp.description ? `<p class="exp-description">${htmlUtils.escapeHtml(exp.description)}</p>` : ''}
                ${exp.achievements && exp.achievements.length > 0 ? `
                  <div class="exp-achievements">
                    ${exp.achievements.map(achievement => `<div class="achievement-item">• ${htmlUtils.escapeHtml(achievement)}</div>`).join('')}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Education -->
      ${cvData.education && cvData.education.length > 0 ? `
        <section class="right-section">
          <h2 class="section-title-minimal">Formation</h2>
          <div class="education-minimal">
            ${cvData.education.map(edu => `
              <div class="education-minimal-item">
                <div class="edu-header-minimal">
                  <h3 class="edu-degree">${htmlUtils.escapeHtml(edu.degree)}</h3>
                  <div class="edu-institution">${htmlUtils.escapeHtml(edu.institution)}</div>
                  <div class="edu-period">${this.formatDateRange(edu.startDate, edu.endDate)}</div>
                </div>
                ${edu.description ? `<p class="edu-description">${htmlUtils.escapeHtml(edu.description)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Projects -->
      ${cvData.projects && cvData.projects.length > 0 ? `
        <section class="right-section">
          <h2 class="section-title-minimal">Projets</h2>
          <div class="projects-minimal">
            ${cvData.projects.map(project => `
              <div class="project-minimal">
                <div class="project-header-minimal">
                  <h3 class="project-name">${htmlUtils.escapeHtml(project.name)}</h3>
                  ${project.url ? `<a href="${htmlUtils.escapeHtml(project.url)}" class="project-link-minimal">↗</a>` : ''}
                </div>
                ${project.description ? `<p class="project-description">${htmlUtils.escapeHtml(project.description)}</p>` : ''}
                ${project.technologies ? `<div class="project-tech">${htmlUtils.escapeHtml(project.technologies)}</div>` : ''}
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
      /* ===== CREATIVE MINIMAL TEMPLATE STYLES ===== */

      :root {
        --primary-black: #1a1a1a;
        --primary-gray: #6b7280;
        --primary-light: #f8fafc;
        --accent-gold: #d4af37;
        --accent-silver: #c0c0c0;
        --accent-bronze: #cd7f32;
        --text-primary: #1a1a1a;
        --text-secondary: #6b7280;
        --text-muted: #9ca3af;
        --background: #ffffff;
        --surface: #f8fafc;
        --border: #e5e7eb;
        --shadow: rgba(0, 0, 0, 0.05);
        --shadow-hover: rgba(0, 0, 0, 0.1);
      }

      .cv-container {
        font-family: 'Crimson Text', 'Times New Roman', serif;
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
        padding: 3rem 2rem;
        position: relative;
        border-bottom: 1px solid var(--border);
      }

      .header-creative {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 4rem;
      }

      .personal-section {
        flex: 1;
      }

      .main-name,
      .main-surname {
        font-size: 2.8rem;
        font-weight: 300;
        margin: 0;
        line-height: 0.9;
        letter-spacing: -1px;
      }

      .main-name {
        color: var(--text-primary);
        margin-bottom: 0.5rem;
      }

      .main-surname {
        color: var(--accent-gold);
        margin-left: 1rem;
      }

      .creative-role {
        font-size: 1rem;
        color: var(--text-secondary);
        font-weight: 400;
        text-transform: uppercase;
        letter-spacing: 2px;
        margin-top: 1rem;
        font-family: 'Inter', sans-serif;
      }

      .contact-section {
        flex: 0 0 300px;
      }

      .contact-minimal {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .contact-line {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.9rem;
        color: var(--text-secondary);
        font-family: 'Inter', sans-serif;
      }

      .contact-dot {
        width: 4px;
        height: 4px;
        background: var(--accent-gold);
        border-radius: 50%;
        flex-shrink: 0;
      }

      .contact-link-minimal {
        color: var(--accent-gold);
        text-decoration: none;
        font-weight: 500;
        transition: color 0.3s ease;
      }

      .contact-link-minimal:hover {
        color: var(--primary-black);
      }

      .decorative-elements {
        position: absolute;
        bottom: 2rem;
        left: 2rem;
        right: 2rem;
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .decoration-line-left,
      .decoration-line-right {
        flex: 1;
        height: 1px;
        background: linear-gradient(90deg, transparent, var(--border), transparent);
      }

      .decoration-circle {
        width: 8px;
        height: 8px;
        border: 1px solid var(--accent-gold);
        border-radius: 50%;
        flex-shrink: 0;
      }

      /* ===== LAYOUT ===== */
      .cv-content {
        display: flex;
        padding: 2rem;
        gap: 3rem;
      }

      .content-left {
        flex: 0 0 280px;
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
      }

      .content-right {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 3rem;
      }

      /* ===== LEFT SECTIONS ===== */
      .left-section {
        padding: 0;
        position: relative;
      }

      .photo-section-minimal {
        text-align: center;
        margin-bottom: 2rem;
      }

      .photo-frame-minimal {
        width: 140px;
        height: 140px;
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid var(--accent-gold);
        margin: 0 auto;
        position: relative;
      }

      .profile-photo-minimal {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .section-title-minimal {
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 1.5rem 0;
        text-transform: uppercase;
        letter-spacing: 1px;
        position: relative;
        font-family: 'Inter', sans-serif;
      }

      .section-title-minimal::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 0;
        width: 30px;
        height: 1px;
        background: var(--accent-gold);
      }

      .summary-minimal {
        background: var(--surface);
        padding: 1.5rem;
        border-radius: 4px;
        border-left: 3px solid var(--accent-gold);
      }

      .summary-text-minimal {
        margin: 0;
        color: var(--text-secondary);
        line-height: 1.6;
        font-size: 0.9rem;
      }

      .skills-minimal {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .skill-minimal {
        position: relative;
        padding: 0.75rem 0;
      }

      .skill-name {
        font-weight: 500;
        color: var(--text-primary);
        font-size: 0.9rem;
        font-family: 'Inter', sans-serif;
      }

      .skill-line {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 2px;
        width: 0;
        transition: width 0.6s ease;
      }

      .skill-minimal:hover .skill-line {
        width: 100%;
      }

      .skill-line-1 { background: var(--accent-gold); }
      .skill-line-2 { background: var(--accent-silver); }
      .skill-line-3 { background: var(--accent-bronze); }

      .languages-minimal {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }

      .language-minimal {
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
        font-size: 0.9rem;
      }

      .language-level {
        font-size: 0.8rem;
        color: var(--text-muted);
        font-weight: 400;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-family: 'Inter', sans-serif;
      }

      .language-dots {
        display: flex;
        gap: 0.25rem;
      }

      .language-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--border);
        transition: background-color 0.3s ease;
      }

      .language-dot.active {
        background: var(--accent-gold);
      }

      .interests-minimal {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .interest-minimal {
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--border);
      }

      .interest-minimal:last-child {
        border-bottom: none;
      }

      .interest-name {
        font-size: 0.9rem;
        color: var(--text-secondary);
        font-weight: 400;
        font-family: 'Inter', sans-serif;
      }

      /* ===== RIGHT SECTIONS ===== */
      .right-section {
        position: relative;
      }

      .experiences-minimal {
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
      }

      .experience-minimal {
        position: relative;
        padding: 2rem 0;
        border-bottom: 1px solid var(--border);
      }

      .experience-minimal:last-child {
        border-bottom: none;
      }

      .exp-header-minimal {
        margin-bottom: 1.5rem;
      }

      .exp-position {
        font-size: 1.4rem;
        font-weight: 400;
        color: var(--text-primary);
        margin: 0 0 0.5rem 0;
        line-height: 1.2;
      }

      .exp-company {
        font-weight: 600;
        color: var(--accent-gold);
        margin-bottom: 0.25rem;
        font-size: 1rem;
        font-family: 'Inter', sans-serif;
      }

      .exp-period {
        font-size: 0.85rem;
        color: var(--text-muted);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-family: 'Inter', sans-serif;
      }

      .exp-description {
        color: var(--text-secondary);
        line-height: 1.6;
        margin: 1rem 0;
        font-size: 0.9rem;
      }

      .exp-achievements {
        margin-top: 1rem;
      }

      .achievement-item {
        color: var(--text-secondary);
        font-size: 0.85rem;
        margin-bottom: 0.5rem;
        padding-left: 1rem;
        position: relative;
      }

      .achievement-item::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0.4rem;
        width: 3px;
        height: 3px;
        background: var(--accent-gold);
        border-radius: 50%;
      }

      .education-minimal {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }

      .education-minimal-item {
        position: relative;
        padding: 1.5rem 0;
        border-bottom: 1px solid var(--border);
      }

      .education-minimal-item:last-child {
        border-bottom: none;
      }

      .edu-header-minimal {
        margin-bottom: 1rem;
      }

      .edu-degree {
        font-size: 1.2rem;
        font-weight: 400;
        color: var(--text-primary);
        margin: 0 0 0.5rem 0;
      }

      .edu-institution {
        font-weight: 600;
        color: var(--accent-gold);
        margin-bottom: 0.25rem;
        font-family: 'Inter', sans-serif;
      }

      .edu-period {
        font-size: 0.85rem;
        color: var(--text-muted);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-family: 'Inter', sans-serif;
      }

      .edu-description {
        color: var(--text-secondary);
        line-height: 1.6;
        font-size: 0.9rem;
      }

      .projects-minimal {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
      }

      .project-minimal {
        background: var(--surface);
        padding: 1.5rem;
        border-radius: 4px;
        border: 1px solid var(--border);
        position: relative;
        transition: all 0.3s ease;
      }

      .project-minimal:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px var(--shadow);
      }

      .project-header-minimal {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
      }

      .project-name {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0;
      }

      .project-link-minimal {
        color: var(--accent-gold);
        text-decoration: none;
        font-size: 1.2rem;
        transition: color 0.3s ease;
      }

      .project-link-minimal:hover {
        color: var(--primary-black);
      }

      .project-description {
        color: var(--text-secondary);
        line-height: 1.5;
        margin: 0 0 0.75rem 0;
        font-size: 0.9rem;
      }

      .project-tech {
        font-size: 0.8rem;
        color: var(--text-muted);
        font-weight: 500;
        font-family: 'Inter', sans-serif;
      }

      /* ===== RESPONSIVE DESIGN ===== */
      @media (max-width: 768px) {
        .cv-content {
          flex-direction: column;
          gap: 2rem;
        }

        .content-left {
          flex: none;
          order: 2;
        }

        .content-right {
          order: 1;
        }

        .header-creative {
          flex-direction: column;
          gap: 2rem;
          text-align: center;
        }

        .main-name,
        .main-surname {
          font-size: 2.2rem;
        }

        .contact-section {
          flex: none;
          width: 100%;
        }

        .contact-minimal {
          align-items: center;
        }

        .projects-minimal {
          grid-template-columns: 1fr;
        }

        .photo-frame-minimal {
          width: 120px;
          height: 120px;
        }
      }

      /* ===== PRINT STYLES ===== */
      @media print {
        .cv-container {
          box-shadow: none;
          background: white !important;
        }

        .left-section,
        .right-section,
        .experience-minimal,
        .education-minimal-item,
        .project-minimal {
          break-inside: avoid;
        }

        .skill-line {
          width: 100% !important;
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
    return validationUtils.validateCreativeMinimal(cvData);
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
      5: 'Expert'
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

module.exports = CreativeMinimalTemplate;