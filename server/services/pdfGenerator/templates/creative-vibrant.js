/**
 * Creative Vibrant Template - Dynamic and colorful design
 */
const htmlUtils = require('../utils/htmlUtils');
const cssUtils = require('../utils/cssUtils');
const validationUtils = require('../utils/validation');

class CreativeVibrantTemplate {
  constructor() {
    this.name = 'Creative Vibrant';
    this.description = 'Design dynamique et coloré pour les profils créatifs et entrepreneuriaux';
    this.category = 'creative';
    this.premium = false;
    this.version = '1.0.0';
    this.author = 'MBOA-CV';
    this.createdAt = '2024-01-01T00:00:00Z';

    this.features = [
      'Design asymétrique dynamique',
      'Palette de couleurs vibrantes',
      'Éléments graphiques modernes',
      'Typographie audacieuse',
      'Layout créatif non conventionnel'
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
            <div class="name-section">
              <h1 class="creative-name">${htmlUtils.escapeHtml(sanitized.personalInfo?.firstName || '')}</h1>
              <h1 class="creative-surname">${htmlUtils.escapeHtml(sanitized.personalInfo?.lastName || '')}</h1>
              <div class="role-tag">${htmlUtils.escapeHtml(sanitized.personalInfo?.title || 'Professionnel')}</div>
            </div>

            <div class="contact-section">
              ${sanitized.personalInfo?.email ? `<div class="contact-item"><span class="contact-label">Email:</span> ${htmlUtils.escapeHtml(sanitized.personalInfo.email)}</div>` : ''}
              ${sanitized.personalInfo?.phone ? `<div class="contact-item"><span class="contact-label">Tél:</span> ${htmlUtils.escapeHtml(sanitized.personalInfo.phone)}</div>` : ''}
              ${sanitized.personalInfo?.address ? `<div class="contact-item"><span class="contact-label">Adresse:</span> ${htmlUtils.escapeHtml(sanitized.personalInfo.address)}</div>` : ''}
            </div>
          </div>

          <!-- Decorative Elements -->
          <div class="decorative-elements">
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>
            <div class="shape shape-3"></div>
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
      <!-- Summary -->
      ${cvData.summary ? `
        <section class="section-left">
          <h2 class="section-title-left">À Propos</h2>
          <div class="summary-box">
            <p class="summary-text">${htmlUtils.escapeHtml(cvData.summary)}</p>
          </div>
        </section>
      ` : ''}

      <!-- Skills -->
      ${cvData.skills && cvData.skills.length > 0 ? `
        <section class="section-left">
          <h2 class="section-title-left">Compétences</h2>
          <div class="skills-cloud">
            ${cvData.skills.map((skill, index) => `
              <span class="skill-bubble skill-color-${(index % 5) + 1}">${htmlUtils.escapeHtml(skill)}</span>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Languages -->
      ${cvData.languages && cvData.languages.length > 0 ? `
        <section class="section-left">
          <h2 class="section-title-left">Langues</h2>
          <div class="languages-list">
            ${cvData.languages.map(lang => `
              <div class="language-creative">
                <span class="language-name">${htmlUtils.escapeHtml(lang.name)}</span>
                <div class="language-bar">
                  <div class="language-fill language-level-${lang.level || 1}"></div>
                </div>
                <span class="language-label">${this.getLanguageLevelLabel(lang.level || 1)}</span>
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
        <section class="section-right">
          <h2 class="section-title-right">Expérience</h2>
          ${cvData.experiences.map((exp, index) => `
            <div class="experience-creative exp-color-${(index % 4) + 1}">
              <div class="exp-header">
                <h3 class="exp-position">${htmlUtils.escapeHtml(exp.position)}</h3>
                <div class="exp-company">${htmlUtils.escapeHtml(exp.company)}</div>
                <div class="exp-period">${this.formatDateRange(exp.startDate, exp.endDate, exp.current)}</div>
              </div>
              ${exp.description ? `<p class="exp-description">${htmlUtils.escapeHtml(exp.description)}</p>` : ''}
              ${exp.achievements && exp.achievements.length > 0 ? `
                <ul class="exp-achievements">
                  ${exp.achievements.map(achievement => `<li>${htmlUtils.escapeHtml(achievement)}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </section>
      ` : ''}

      <!-- Education -->
      ${cvData.education && cvData.education.length > 0 ? `
        <section class="section-right">
          <h2 class="section-title-right">Formation</h2>
          ${cvData.education.map(edu => `
            <div class="education-creative">
              <h3 class="edu-degree">${htmlUtils.escapeHtml(edu.degree)}</h3>
              <div class="edu-institution">${htmlUtils.escapeHtml(edu.institution)}</div>
              <div class="edu-period">${this.formatDateRange(edu.startDate, edu.endDate)}</div>
              ${edu.description ? `<p class="edu-description">${htmlUtils.escapeHtml(edu.description)}</p>` : ''}
            </div>
          `).join('')}
        </section>
      ` : ''}

      <!-- Projects -->
      ${cvData.projects && cvData.projects.length > 0 ? `
        <section class="section-right">
          <h2 class="section-title-right">Projets</h2>
          <div class="projects-creative">
            ${cvData.projects.map(project => `
              <div class="project-creative">
                <h3 class="project-name">${htmlUtils.escapeHtml(project.name)}</h3>
                ${project.description ? `<p class="project-desc">${htmlUtils.escapeHtml(project.description)}</p>` : ''}
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
      /* ===== CREATIVE VIBRANT TEMPLATE STYLES ===== */

      :root {
        --primary-pink: #ff2aa4;
        --primary-purple: #b967ff;
        --primary-blue: #00d4ff;
        --primary-green: #00ff88;
        --primary-orange: #ff6b35;
        --text-dark: #1a1a2e;
        --text-light: #ffffff;
        --bg-light: #f8f9fa;
        --shadow: rgba(0, 0, 0, 0.1);
      }

      .cv-container {
        font-family: 'Poppins', 'Inter', sans-serif;
        max-width: 210mm;
        margin: 0 auto;
        background: var(--text-light);
        color: var(--text-dark);
        position: relative;
        overflow: hidden;
      }

      /* ===== HEADER ===== */
      .cv-header {
        background: linear-gradient(135deg, var(--primary-pink), var(--primary-purple), var(--primary-blue));
        padding: 3rem 2rem;
        position: relative;
        min-height: 200px;
      }

      .cv-header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="creativePattern" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="30" cy="30" r="1" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23creativePattern)"/></svg>');
      }

      .header-creative {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        position: relative;
        z-index: 1;
      }

      .name-section {
        flex: 1;
      }

      .creative-name,
      .creative-surname {
        font-size: 3rem;
        font-weight: 900;
        margin: 0;
        line-height: 0.9;
        text-transform: uppercase;
        letter-spacing: -2px;
      }

      .creative-name {
        color: var(--text-light);
      }

      .creative-surname {
        color: var(--primary-green);
        margin-left: 1rem;
      }

      .role-tag {
        background: var(--primary-orange);
        color: var(--text-light);
        padding: 0.5rem 1rem;
        border-radius: 50px;
        font-size: 0.9rem;
        font-weight: 600;
        margin-top: 1rem;
        display: inline-block;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .contact-section {
        background: rgba(255, 255, 255, 0.1);
        padding: 1.5rem;
        border-radius: 15px;
        backdrop-filter: blur(10px);
      }

      .contact-item {
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
      }

      .contact-label {
        font-weight: 600;
        color: var(--primary-green);
      }

      /* Decorative Elements */
      .decorative-elements {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }

      .shape {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
      }

      .shape-1 {
        width: 80px;
        height: 80px;
        top: 20%;
        right: 10%;
        animation: float 6s ease-in-out infinite;
      }

      .shape-2 {
        width: 60px;
        height: 60px;
        top: 60%;
        right: 20%;
        animation: float 8s ease-in-out infinite reverse;
      }

      .shape-3 {
        width: 40px;
        height: 40px;
        bottom: 20%;
        right: 30%;
        animation: float 10s ease-in-out infinite;
      }

      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }

      /* ===== LAYOUT ===== */
      .cv-content {
        display: flex;
        padding: 2rem;
        gap: 2rem;
      }

      .content-left {
        flex: 0 0 300px;
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }

      .content-right {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }

      /* ===== LEFT COLUMN SECTIONS ===== */
      .section-left {
        background: var(--bg-light);
        padding: 1.5rem;
        border-radius: 15px;
        border-left: 5px solid var(--primary-pink);
        box-shadow: 0 8px 32px var(--shadow);
      }

      .section-title-left {
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--primary-pink);
        margin: 0 0 1rem 0;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .summary-box {
        background: linear-gradient(135deg, var(--primary-purple), var(--primary-blue));
        color: var(--text-light);
        padding: 1rem;
        border-radius: 10px;
      }

      .summary-text {
        font-style: italic;
        line-height: 1.6;
        margin: 0;
      }

      .skills-cloud {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .skill-bubble {
        padding: 0.5rem 1rem;
        border-radius: 25px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
      }

      .skill-bubble:hover {
        transform: scale(1.05);
      }

      .skill-color-1 { background: linear-gradient(135deg, var(--primary-pink), #ff6b9d); color: white; }
      .skill-color-2 { background: linear-gradient(135deg, var(--primary-purple), #d4a0ff); color: white; }
      .skill-color-3 { background: linear-gradient(135deg, var(--primary-blue), #7dd3fc); color: white; }
      .skill-color-4 { background: linear-gradient(135deg, var(--primary-green), #86efac); color: var(--text-dark); }
      .skill-color-5 { background: linear-gradient(135deg, var(--primary-orange), #fed7aa); color: var(--text-dark); }

      .languages-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .language-creative {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .language-name {
        font-weight: 600;
        min-width: 80px;
      }

      .language-bar {
        flex: 1;
        height: 8px;
        background: var(--bg-light);
        border-radius: 4px;
        overflow: hidden;
      }

      .language-fill {
        height: 100%;
        border-radius: 4px;
        transition: width 0.3s ease;
      }

      .language-label {
        font-size: 0.8rem;
        color: var(--text-dark);
        min-width: 60px;
        text-align: right;
      }

      /* ===== RIGHT COLUMN SECTIONS ===== */
      .section-right {
        background: var(--text-light);
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 8px 32px var(--shadow);
        border: 2px solid transparent;
        background: linear-gradient(var(--text-light), var(--text-light)) padding-box,
                    linear-gradient(135deg, var(--primary-pink), var(--primary-purple)) border-box;
      }

      .section-title-right {
        font-size: 1.8rem;
        font-weight: 900;
        background: linear-gradient(135deg, var(--primary-pink), var(--primary-purple));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0 0 1.5rem 0;
        text-transform: uppercase;
        letter-spacing: -1px;
      }

      .experience-creative {
        background: linear-gradient(135deg, rgba(255, 42, 164, 0.1), rgba(185, 103, 255, 0.1));
        padding: 1.5rem;
        border-radius: 12px;
        margin-bottom: 1.5rem;
        border-left: 4px solid;
        position: relative;
        overflow: hidden;
      }

      .exp-color-1 { border-left-color: var(--primary-pink); }
      .exp-color-2 { border-left-color: var(--primary-purple); }
      .exp-color-3 { border-left-color: var(--primary-blue); }
      .exp-color-4 { border-left-color: var(--primary-green); }

      .exp-header {
        margin-bottom: 1rem;
      }

      .exp-position {
        font-size: 1.3rem;
        font-weight: 700;
        color: var(--text-dark);
        margin: 0 0 0.5rem 0;
      }

      .exp-company {
        font-weight: 600;
        color: var(--primary-purple);
        margin-bottom: 0.25rem;
      }

      .exp-period {
        font-size: 0.9rem;
        color: var(--text-dark);
        opacity: 0.8;
      }

      .exp-description {
        color: var(--text-dark);
        line-height: 1.6;
        margin: 1rem 0;
      }

      .exp-achievements {
        margin: 1rem 0 0 0;
        padding-left: 1rem;
      }

      .exp-achievements li {
        margin-bottom: 0.5rem;
        color: var(--text-dark);
        position: relative;
      }

      .exp-achievements li::before {
        content: '▸';
        color: var(--primary-pink);
        font-weight: bold;
        position: absolute;
        left: -1rem;
      }

      .education-creative {
        background: var(--bg-light);
        padding: 1.5rem;
        border-radius: 12px;
        margin-bottom: 1rem;
        border: 2px solid var(--primary-green);
      }

      .edu-degree {
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--text-dark);
        margin: 0 0 0.5rem 0;
      }

      .edu-institution {
        font-weight: 600;
        color: var(--primary-green);
        margin-bottom: 0.25rem;
      }

      .edu-period {
        font-size: 0.9rem;
        color: var(--text-dark);
        opacity: 0.8;
        margin-bottom: 0.5rem;
      }

      .edu-description {
        color: var(--text-dark);
        line-height: 1.6;
      }

      .projects-creative {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
      }

      .project-creative {
        background: linear-gradient(135deg, var(--primary-blue), var(--primary-purple));
        color: var(--text-light);
        padding: 1.5rem;
        border-radius: 12px;
      }

      .project-name {
        font-size: 1.1rem;
        font-weight: 700;
        margin: 0 0 0.5rem 0;
      }

      .project-desc {
        font-size: 0.9rem;
        line-height: 1.5;
        margin: 0 0 0.5rem 0;
        opacity: 0.9;
      }

      .project-tech {
        font-size: 0.8rem;
        font-weight: 600;
        opacity: 0.8;
      }

      /* ===== RESPONSIVE DESIGN ===== */
      @media (max-width: 768px) {
        .cv-content {
          flex-direction: column;
          gap: 1.5rem;
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
          gap: 1.5rem;
          text-align: center;
        }

        .creative-name,
        .creative-surname {
          font-size: 2.5rem;
        }

        .contact-section {
          width: 100%;
        }

        .projects-creative {
          grid-template-columns: 1fr;
        }
      }

      /* ===== PRINT STYLES ===== */
      @media print {
        .cv-container {
          box-shadow: none;
        }

        .section-left,
        .section-right,
        .experience-creative,
        .education-creative,
        .project-creative {
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
    return validationUtils.validateCreativeVibrant(cvData);
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

module.exports = CreativeVibrantTemplate;