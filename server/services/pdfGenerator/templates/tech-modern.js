/**
 * Tech Modern Template - Clean and modern design for tech professionals
 */
const htmlUtils = require('../utils/htmlUtils');
const cssUtils = require('../utils/cssUtils');
const validationUtils = require('../utils/validation');

class TechModernTemplate {
  constructor() {
    this.name = 'Tech Modern';
    this.description = 'Design moderne et épuré pour les professionnels de la tech et du numérique';
    this.category = 'tech';
    this.premium = false;
    this.version = '1.0.0';
    this.author = 'MBOA-CV';
    this.createdAt = '2024-01-01T00:00:00Z';

    this.features = [
      'Design moderne et épuré',
      'Typographie sans-serif moderne',
      'Accents de couleur tech',
      'Layout asymétrique',
      'Éléments graphiques minimalistes'
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
            <div class="personal-section">
              <h1 class="main-name">${htmlUtils.escapeHtml(sanitized.personalInfo?.firstName || '')}</h1>
              <h1 class="main-surname">${htmlUtils.escapeHtml(sanitized.personalInfo?.lastName || '')}</h1>
              ${sanitized.personalInfo?.title ? `<div class="role-title">${htmlUtils.escapeHtml(sanitized.personalInfo.title)}</div>` : ''}
            </div>

            <div class="contact-section">
              <div class="contact-grid">
                ${sanitized.personalInfo?.email ? `<div class="contact-item"><span class="contact-icon">✉</span><span>${htmlUtils.escapeHtml(sanitized.personalInfo.email)}</span></div>` : ''}
                ${sanitized.personalInfo?.phone ? `<div class="contact-item"><span class="contact-icon">📱</span><span>${htmlUtils.escapeHtml(sanitized.personalInfo.phone)}</span></div>` : ''}
                ${sanitized.personalInfo?.address ? `<div class="contact-item"><span class="contact-icon">📍</span><span>${htmlUtils.escapeHtml(sanitized.personalInfo.address)}</span></div>` : ''}
                ${sanitized.personalInfo?.linkedin ? `<div class="contact-item"><span class="contact-icon">💼</span><a href="${htmlUtils.escapeHtml(sanitized.personalInfo.linkedin)}" class="contact-link">LinkedIn</a></div>` : ''}
                ${sanitized.personalInfo?.website ? `<div class="contact-item"><span class="contact-icon">🌐</span><a href="${htmlUtils.escapeHtml(sanitized.personalInfo.website)}" class="contact-link">Portfolio</a></div>` : ''}
              </div>
            </div>
          </div>

          <!-- Decorative Elements -->
          <div class="header-decoration">
            <div class="decoration-line"></div>
            <div class="decoration-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        </header>

        <div class="cv-body">
          <!-- Left Column -->
          <div class="cv-aside">
            ${this.renderAside(sanitized)}
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
   * Render aside content
   * @param {Object} cvData - CV data
   * @returns {string} Aside HTML
   */
  renderAside(cvData) {
    return `
      <!-- Photo Section -->
      ${cvData.personalInfo?.photo ? `
        <section class="aside-section photo-section">
          <div class="photo-wrapper">
            <div class="photo-frame">
              <img src="${htmlUtils.escapeHtml(cvData.personalInfo.photo)}" alt="Photo de profil" class="profile-photo">
            </div>
            <div class="photo-accent"></div>
          </div>
        </section>
      ` : ''}

      <!-- Summary -->
      ${cvData.summary ? `
        <section class="aside-section">
          <h2 class="section-title-aside">À propos</h2>
          <div class="summary-content">
            <p class="summary-text">${htmlUtils.escapeHtml(cvData.summary)}</p>
          </div>
        </section>
      ` : ''}

      <!-- Skills -->
      ${cvData.skills && cvData.skills.length > 0 ? `
        <section class="aside-section">
          <h2 class="section-title-aside">Compétences</h2>
          <div class="skills-modern">
            ${cvData.skills.map((skill, index) => `
              <div class="skill-modern skill-color-${((index % 4) + 1)}">
                <span class="skill-text">${htmlUtils.escapeHtml(skill)}</span>
                <div class="skill-accent"></div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Languages -->
      ${cvData.languages && cvData.languages.length > 0 ? `
        <section class="aside-section">
          <h2 class="section-title-aside">Langues</h2>
          <div class="languages-modern">
            ${cvData.languages.map(lang => `
              <div class="language-modern">
                <div class="language-header-modern">
                  <span class="language-name">${htmlUtils.escapeHtml(lang.name)}</span>
                  <span class="language-level-modern">${this.getLanguageLevelLabel(lang.level || 1)}</span>
                </div>
                <div class="language-progress">
                  <div class="progress-track">
                    <div class="progress-fill language-level-${lang.level || 1}"></div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Interests -->
      ${cvData.hobbies && cvData.hobbies.length > 0 ? `
        <section class="aside-section">
          <h2 class="section-title-aside">Intérêts</h2>
          <div class="interests-modern">
            ${cvData.hobbies.slice(0, 4).map(hobby => `
              <div class="interest-modern">
                <span class="interest-icon">${this.getInterestIcon(hobby.name)}</span>
                <span class="interest-name">${htmlUtils.escapeHtml(hobby.name)}</span>
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
        <section class="main-section-modern">
          <h2 class="section-title-main-modern">Expérience</h2>
          <div class="timeline-modern">
            ${cvData.experiences.map((exp, index) => `
              <div class="timeline-item-modern">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                  <div class="exp-header-modern">
                    <h3 class="exp-position-modern">${htmlUtils.escapeHtml(exp.position)}</h3>
                    <div class="exp-company-modern">${htmlUtils.escapeHtml(exp.company)}</div>
                    <div class="exp-period-modern">${this.formatDateRange(exp.startDate, exp.endDate, exp.current)}</div>
                  </div>
                  ${exp.description ? `<p class="exp-description-modern">${htmlUtils.escapeHtml(exp.description)}</p>` : ''}
                  ${exp.achievements && exp.achievements.length > 0 ? `
                    <div class="exp-highlights">
                      ${exp.achievements.map(achievement => `
                        <div class="highlight-item">
                          <span class="highlight-bullet">▸</span>
                          <span class="highlight-text">${htmlUtils.escapeHtml(achievement)}</span>
                        </div>
                      `).join('')}
                    </div>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Education -->
      ${cvData.education && cvData.education.length > 0 ? `
        <section class="main-section-modern">
          <h2 class="section-title-main-modern">Formation</h2>
          <div class="education-modern">
            ${cvData.education.map(edu => `
              <div class="education-item-modern">
                <div class="edu-header-modern">
                  <h3 class="edu-degree-modern">${htmlUtils.escapeHtml(edu.degree)}</h3>
                  <div class="edu-institution-modern">${htmlUtils.escapeHtml(edu.institution)}</div>
                  <div class="edu-period-modern">${this.formatDateRange(edu.startDate, edu.endDate)}</div>
                </div>
                ${edu.description ? `<p class="edu-description-modern">${htmlUtils.escapeHtml(edu.description)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Projects -->
      ${cvData.projects && cvData.projects.length > 0 ? `
        <section class="main-section-modern">
          <h2 class="section-title-main-modern">Projets</h2>
          <div class="projects-modern">
            ${cvData.projects.map(project => `
              <div class="project-modern">
                <div class="project-header-modern">
                  <h3 class="project-name-modern">${htmlUtils.escapeHtml(project.name)}</h3>
                  ${project.url ? `<a href="${htmlUtils.escapeHtml(project.url)}" class="project-link-modern">🔗</a>` : ''}
                </div>
                ${project.description ? `<p class="project-description-modern">${htmlUtils.escapeHtml(project.description)}</p>` : ''}
                ${project.technologies ? `<div class="project-tech-modern">${htmlUtils.escapeHtml(project.technologies)}</div>` : ''}
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
      /* ===== TECH MODERN TEMPLATE STYLES ===== */

      :root {
        --primary-blue: #2563eb;
        --primary-indigo: #4f46e5;
        --primary-cyan: #06b6d4;
        --primary-slate: #64748b;
        --accent-orange: #f59e0b;
        --accent-green: #10b981;
        --accent-pink: #ec4899;
        --accent-purple: #8b5cf6;
        --text-dark: #1e293b;
        --text-medium: #475569;
        --text-light: #64748b;
        --bg-white: #ffffff;
        --bg-gray-50: #f8fafc;
        --bg-gray-100: #f1f5f9;
        --border-color: #e2e8f0;
        --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      }

      .cv-container {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        max-width: 210mm;
        margin: 0 auto;
        background: var(--bg-white);
        color: var(--text-dark);
        line-height: 1.6;
        font-size: 11pt;
      }

      /* ===== HEADER ===== */
      .cv-header {
        background: linear-gradient(135deg, var(--primary-blue), var(--primary-indigo));
        padding: 3rem 2rem;
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
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="techPattern" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="30" cy="30" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23techPattern)"/></svg>');
      }

      .header-main {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        position: relative;
        z-index: 1;
        gap: 3rem;
      }

      .personal-section {
        flex: 1;
      }

      .main-name,
      .main-surname {
        font-size: 3rem;
        font-weight: 800;
        margin: 0;
        line-height: 0.9;
        text-transform: uppercase;
        letter-spacing: -1px;
      }

      .main-name {
        color: var(--bg-white);
        margin-bottom: 0.5rem;
      }

      .main-surname {
        color: var(--accent-orange);
        margin-left: 1rem;
      }

      .role-title {
        font-size: 1.1rem;
        color: var(--bg-gray-100);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 2px;
        margin-top: 1rem;
        display: inline-block;
      }

      .contact-section {
        flex: 0 0 300px;
      }

      .contact-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.75rem;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        padding: 1.5rem;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .contact-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.9rem;
        color: var(--bg-white);
      }

      .contact-icon {
        font-size: 1.1rem;
        min-width: 20px;
      }

      .contact-link {
        color: var(--accent-orange);
        text-decoration: none;
        font-weight: 600;
        transition: color 0.3s ease;
      }

      .contact-link:hover {
        color: var(--bg-white);
      }

      .header-decoration {
        position: absolute;
        bottom: 2rem;
        left: 2rem;
        right: 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .decoration-line {
        flex: 1;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      }

      .decoration-dots {
        display: flex;
        gap: 0.5rem;
      }

      .decoration-dots span {
        width: 6px;
        height: 6px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        animation: dot-pulse 2s ease-in-out infinite;
      }

      .decoration-dots span:nth-child(2) { animation-delay: 0.3s; }
      .decoration-dots span:nth-child(3) { animation-delay: 0.6s; }

      @keyframes dot-pulse {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.2); }
      }

      /* ===== LAYOUT ===== */
      .cv-body {
        display: flex;
        padding: 2rem;
        gap: 3rem;
        background: var(--bg-gray-50);
      }

      .cv-aside {
        flex: 0 0 280px;
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }

      .cv-main {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 3rem;
      }

      /* ===== ASIDE SECTIONS ===== */
      .aside-section {
        background: var(--bg-white);
        padding: 2rem;
        border-radius: 12px;
        box-shadow: var(--shadow-md);
        border: 1px solid var(--border-color);
        position: relative;
        overflow: hidden;
      }

      .aside-section::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: linear-gradient(180deg, var(--primary-blue), var(--primary-cyan));
      }

      .photo-section {
        text-align: center;
        padding: 2rem 1rem;
      }

      .photo-wrapper {
        position: relative;
        display: inline-block;
      }

      .photo-frame {
        width: 140px;
        height: 140px;
        border-radius: 50%;
        overflow: hidden;
        border: 4px solid var(--primary-blue);
        box-shadow: var(--shadow-lg);
        position: relative;
      }

      .profile-photo {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .photo-accent {
        position: absolute;
        top: -8px;
        left: -8px;
        right: -8px;
        bottom: -8px;
        border-radius: 50%;
        background: linear-gradient(45deg, var(--primary-blue), var(--primary-cyan), var(--accent-orange));
        opacity: 0.2;
        animation: photo-rotate 8s linear infinite;
      }

      @keyframes photo-rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .section-title-aside {
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--text-dark);
        margin: 0 0 1.5rem 0;
        text-transform: uppercase;
        letter-spacing: 1px;
        position: relative;
      }

      .section-title-aside::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 0;
        width: 40px;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-blue), var(--primary-cyan));
        border-radius: 2px;
      }

      .summary-content {
        background: var(--bg-gray-50);
        padding: 1rem;
        border-radius: 8px;
        border-left: 3px solid var(--primary-blue);
      }

      .summary-text {
        margin: 0;
        color: var(--text-medium);
        font-size: 0.9rem;
        line-height: 1.6;
      }

      .skills-modern {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .skill-modern {
        position: relative;
        padding: 0.75rem 1rem;
        background: var(--bg-gray-50);
        border-radius: 8px;
        border: 1px solid var(--border-color);
        transition: all 0.3s ease;
        overflow: hidden;
      }

      .skill-modern:hover {
        transform: translateX(4px);
        box-shadow: var(--shadow-md);
      }

      .skill-text {
        font-weight: 600;
        color: var(--text-dark);
        position: relative;
        z-index: 2;
      }

      .skill-accent {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 0;
        background: linear-gradient(90deg, var(--primary-blue), var(--primary-cyan));
        transition: width 0.3s ease;
        opacity: 0.1;
      }

      .skill-modern:hover .skill-accent {
        width: 100%;
      }

      .skill-color-1 { border-left: 3px solid var(--primary-blue); }
      .skill-color-2 { border-left: 3px solid var(--primary-cyan); }
      .skill-color-3 { border-left: 3px solid var(--accent-orange); }
      .skill-color-4 { border-left: 3px solid var(--accent-green); }

      .languages-modern {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .language-modern {
        background: var(--bg-gray-50);
        padding: 1rem;
        border-radius: 8px;
        border: 1px solid var(--border-color);
      }

      .language-header-modern {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
      }

      .language-name {
        font-weight: 600;
        color: var(--text-dark);
      }

      .language-level-modern {
        font-size: 0.8rem;
        color: var(--text-light);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .language-progress {
        position: relative;
      }

      .progress-track {
        height: 6px;
        background: var(--border-color);
        border-radius: 3px;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        border-radius: 3px;
        transition: width 0.3s ease;
      }

      .interests-modern {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
      }

      .interest-modern {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        background: var(--bg-gray-50);
        border-radius: 8px;
        border: 1px solid var(--border-color);
        transition: all 0.3s ease;
      }

      .interest-modern:hover {
        background: var(--primary-blue);
        color: white;
        transform: scale(1.02);
      }

      .interest-icon {
        font-size: 1.2rem;
      }

      .interest-name {
        font-weight: 500;
        font-size: 0.9rem;
      }

      /* ===== MAIN CONTENT ===== */
      .main-section-modern {
        background: var(--bg-white);
        padding: 2.5rem;
        border-radius: 12px;
        box-shadow: var(--shadow-md);
        border: 1px solid var(--border-color);
        position: relative;
      }

      .main-section-modern::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: linear-gradient(90deg, var(--primary-blue), var(--primary-cyan), var(--accent-orange));
        border-radius: 12px 12px 0 0;
      }

      .section-title-main-modern {
        font-size: 1.8rem;
        font-weight: 700;
        color: var(--text-dark);
        margin: 0 0 2rem 0;
        text-transform: uppercase;
        letter-spacing: -0.5px;
        position: relative;
      }

      .section-title-main-modern::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 0;
        width: 60px;
        height: 4px;
        background: linear-gradient(90deg, var(--primary-blue), var(--primary-cyan));
        border-radius: 2px;
      }

      /* Timeline */
      .timeline-modern {
        position: relative;
        padding-left: 2rem;
      }

      .timeline-modern::before {
        content: '';
        position: absolute;
        left: 8px;
        top: 0;
        bottom: 0;
        width: 2px;
        background: linear-gradient(180deg, var(--primary-blue), var(--primary-cyan));
        border-radius: 1px;
      }

      .timeline-item-modern {
        position: relative;
        margin-bottom: 2.5rem;
        padding-left: 2rem;
      }

      .timeline-marker {
        position: absolute;
        left: -23px;
        top: 8px;
        width: 14px;
        height: 14px;
        background: var(--primary-blue);
        border: 3px solid var(--bg-white);
        border-radius: 50%;
        box-shadow: 0 0 0 4px var(--primary-blue);
        animation: marker-pulse 2s ease-in-out infinite alternate;
      }

      @keyframes marker-pulse {
        0% { box-shadow: 0 0 0 4px var(--primary-blue); }
        100% { box-shadow: 0 0 0 8px var(--primary-blue), 0 0 15px var(--primary-blue); }
      }

      .timeline-content {
        background: var(--bg-gray-50);
        padding: 1.5rem;
        border-radius: 8px;
        border: 1px solid var(--border-color);
      }

      .exp-header-modern {
        margin-bottom: 1rem;
      }

      .exp-position-modern {
        font-size: 1.3rem;
        font-weight: 700;
        color: var(--text-dark);
        margin: 0 0 0.5rem 0;
      }

      .exp-company-modern {
        font-weight: 600;
        color: var(--primary-blue);
        margin-bottom: 0.25rem;
      }

      .exp-period-modern {
        font-size: 0.9rem;
        color: var(--text-light);
        font-weight: 500;
      }

      .exp-description-modern {
        color: var(--text-medium);
        line-height: 1.6;
        margin: 1rem 0;
      }

      .exp-highlights {
        margin-top: 1rem;
      }

      .highlight-item {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        margin-bottom: 0.5rem;
      }

      .highlight-bullet {
        color: var(--primary-blue);
        font-weight: bold;
        font-size: 1.1rem;
        line-height: 1;
        margin-top: 0.1rem;
      }

      .highlight-text {
        color: var(--text-medium);
        flex: 1;
      }

      /* Education */
      .education-modern {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .education-item-modern {
        background: var(--bg-gray-50);
        padding: 1.5rem;
        border-radius: 8px;
        border: 1px solid var(--border-color);
        position: relative;
      }

      .education-item-modern::before {
        content: '';
        position: absolute;
        top: 1.5rem;
        left: -8px;
        width: 0;
        height: 0;
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
        border-right: 8px solid var(--bg-gray-50);
      }

      .edu-header-modern {
        margin-bottom: 1rem;
      }

      .edu-degree-modern {
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--text-dark);
        margin: 0 0 0.5rem 0;
      }

      .edu-institution-modern {
        font-weight: 600;
        color: var(--primary-blue);
        margin-bottom: 0.25rem;
      }

      .edu-period-modern {
        font-size: 0.9rem;
        color: var(--text-light);
        font-weight: 500;
      }

      .edu-description-modern {
        color: var(--text-medium);
        line-height: 1.6;
      }

      /* Projects */
      .projects-modern {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
      }

      .project-modern {
        background: var(--bg-gray-50);
        padding: 1.5rem;
        border-radius: 8px;
        border: 1px solid var(--border-color);
        transition: all 0.3s ease;
      }

      .project-modern:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
        border-color: var(--primary-blue);
      }

      .project-header-modern {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
      }

      .project-name-modern {
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--text-dark);
        margin: 0;
      }

      .project-link-modern {
        color: var(--primary-blue);
        text-decoration: none;
        font-size: 1.2rem;
        transition: color 0.3s ease;
      }

      .project-link-modern:hover {
        color: var(--primary-cyan);
      }

      .project-description-modern {
        color: var(--text-medium);
        line-height: 1.5;
        margin: 0 0 0.75rem 0;
      }

      .project-tech-modern {
        font-size: 0.85rem;
        color: var(--text-light);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      /* ===== RESPONSIVE DESIGN ===== */
      @media (max-width: 768px) {
        .cv-body {
          flex-direction: column;
          gap: 2rem;
        }

        .cv-aside {
          flex: none;
          order: 2;
        }

        .cv-main {
          order: 1;
        }

        .header-main {
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

        .contact-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .interests-modern {
          grid-template-columns: 1fr;
        }

        .projects-modern {
          grid-template-columns: 1fr;
        }

        .photo-frame {
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

        .cv-header {
          background: white !important;
          -webkit-print-color-adjust: exact;
        }

        .main-name {
          color: black !important;
        }

        .main-surname {
          color: var(--accent-orange) !important;
        }

        .aside-section,
        .main-section-modern,
        .timeline-item-modern,
        .education-item-modern,
        .project-modern {
          break-inside: avoid;
          box-shadow: none !important;
        }

        .photo-accent,
        .header-decoration,
        .timeline-marker {
          display: none !important;
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
    return validationUtils.validateTechModern(cvData);
  }

  /**
   * Get language level label
   * @param {number} level - Language level
   * @returns {string} Level label
   */
  getLanguageLevelLabel(level) {
    const labels = {
      1: 'Débutant',
      2: 'Intermédiaire',
      3: 'Avancé',
      4: 'Expert',
      5: 'Natif'
    };
    return labels[level] || 'Non spécifié';
  }

  /**
   * Get interest icon based on interest name
   * @param {string} interestName - Name of the interest
   * @returns {string} Icon emoji
   */
  getInterestIcon(interestName) {
    const icons = {
      'Sport': '⚽',
      'Musique': '🎵',
      'Lecture': '📚',
      'Voyage': '✈️',
      'Cinéma': '🎬',
      'Photographie': '📷',
      'Cuisine': '👨‍🍳',
      'Jeux vidéo': '🎮',
      'Art': '🎨',
      'Technologie': '💻'
    };

    // Try to find a matching icon
    for (const [key, icon] of Object.entries(icons)) {
      if (interestName.toLowerCase().includes(key.toLowerCase())) {
        return icon;
      }
    }

    return '🎯'; // Default icon
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

module.exports = TechModernTemplate;