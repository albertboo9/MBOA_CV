/**
 * Cyber Neon Template - Futuristic design with neon effects
 */
const htmlUtils = require('../utils/htmlUtils');
const cssUtils = require('../utils/cssUtils');
const validationUtils = require('../utils/validation');

class CyberNeonTemplate {
  constructor() {
    this.name = 'Cyber Neon';
    this.description = 'Design futuriste avec effets néon cyan/purple, parfait pour les métiers tech et innovants';
    this.category = 'cyber';
    this.premium = false;
    this.version = '1.0.0';
    this.author = 'MBOA-CV';
    this.createdAt = '2024-01-01T00:00:00Z';

    this.features = [
      'Effets néon cyan/purple',
      'Layout cybernétique',
      'Animations avancées',
      'Typographie futuriste',
      'Éléments graphiques high-tech'
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
        <!-- Cyber Header -->
        <header class="cv-header">
          <div class="header-matrix">
            <div class="glitch-name">
              <h1 class="main-name" data-text="${htmlUtils.escapeHtml(sanitized.personalInfo?.firstName || '')} ${htmlUtils.escapeHtml(sanitized.personalInfo?.lastName || '')}">
                ${htmlUtils.escapeHtml(sanitized.personalInfo?.firstName || '')} ${htmlUtils.escapeHtml(sanitized.personalInfo?.lastName || '')}
              </h1>
            </div>

            <div class="cyber-stats">
              <div class="stat-item">
                <span class="stat-label">LEVEL</span>
                <span class="stat-value">${sanitized.experiences?.length || 0}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">SKILLS</span>
                <span class="stat-value">${sanitized.skills?.length || 0}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">PROJECTS</span>
                <span class="stat-value">${sanitized.projects?.length || 0}</span>
              </div>
            </div>
          </div>

          <!-- Neon Grid Background -->
          <div class="neon-grid"></div>
        </header>

        <div class="cv-content">
          <!-- Left Panel -->
          <div class="cyber-panel left-panel">
            ${this.renderLeftPanel(sanitized)}
          </div>

          <!-- Right Panel -->
          <div class="cyber-panel right-panel">
            ${this.renderRightPanel(sanitized)}
          </div>
        </div>

        <!-- Cyber Effects -->
        <div class="cyber-effects">
          <div class="scan-line"></div>
          <div class="data-stream stream-1">01010101</div>
          <div class="data-stream stream-2">CYBER_CV_2077</div>
          <div class="data-stream stream-3">NEURAL_LINK_ACTIVE</div>
        </div>
      </div>
    `;
  }

  /**
   * Render left panel content
   * @param {Object} cvData - CV data
   * @returns {string} Left panel HTML
   */
  renderLeftPanel(cvData) {
    return `
      <!-- Profile Section -->
      <section class="cyber-section">
        <h2 class="section-title-cyber">// PROFILE</h2>
        <div class="profile-matrix">
          ${cvData.personalInfo?.photo ? `
            <div class="avatar-container">
              <div class="avatar-frame">
                <img src="${htmlUtils.escapeHtml(cvData.personalInfo.photo)}" alt="Avatar" class="cyber-avatar">
                <div class="avatar-glow"></div>
              </div>
            </div>
          ` : '<div class="avatar-placeholder"><div class="placeholder-glow"></div></div>'}

          <div class="profile-data">
            ${cvData.summary ? `<p class="profile-text">${htmlUtils.escapeHtml(cvData.summary)}</p>` : ''}
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section class="cyber-section">
        <h2 class="section-title-cyber">// CONTACT</h2>
        <div class="contact-matrix">
          ${cvData.personalInfo?.email ? `<div class="contact-line"><span class="contact-label">EMAIL:</span><span class="contact-value">${htmlUtils.escapeHtml(cvData.personalInfo.email)}</span></div>` : ''}
          ${cvData.personalInfo?.phone ? `<div class="contact-line"><span class="contact-label">PHONE:</span><span class="contact-value">${htmlUtils.escapeHtml(cvData.personalInfo.phone)}</span></div>` : ''}
          ${cvData.personalInfo?.address ? `<div class="contact-line"><span class="contact-label">LOCATION:</span><span class="contact-value">${htmlUtils.escapeHtml(cvData.personalInfo.address)}</span></div>` : ''}
          ${cvData.personalInfo?.linkedin ? `<div class="contact-line"><span class="contact-label">LINKEDIN:</span><a href="${htmlUtils.escapeHtml(cvData.personalInfo.linkedin)}" class="contact-link">CONNECT</a></div>` : ''}
        </div>
      </section>

      <!-- Skills Section -->
      ${cvData.skills && cvData.skills.length > 0 ? `
        <section class="cyber-section">
          <h2 class="section-title-cyber">// SKILLS</h2>
          <div class="skills-matrix">
            ${cvData.skills.map((skill, index) => `
              <div class="skill-node skill-node-${(index % 3) + 1}">
                <div class="node-core">${htmlUtils.escapeHtml(skill)}</div>
                <div class="node-rings">
                  <div class="ring ring-1"></div>
                  <div class="ring ring-2"></div>
                  <div class="ring ring-3"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}
    `;
  }

  /**
   * Render right panel content
   * @param {Object} cvData - CV data
   * @returns {string} Right panel HTML
   */
  renderRightPanel(cvData) {
    return `
      <!-- Experience Section -->
      ${cvData.experiences && cvData.experiences.length > 0 ? `
        <section class="cyber-section">
          <h2 class="section-title-cyber">// EXPERIENCE</h2>
          <div class="timeline-cyber">
            ${cvData.experiences.map((exp, index) => `
              <div class="timeline-node">
                <div class="node-connector"></div>
                <div class="node-content">
                  <div class="exp-header-cyber">
                    <h3 class="exp-position">${htmlUtils.escapeHtml(exp.position)}</h3>
                    <div class="exp-meta">
                      <span class="exp-company">${htmlUtils.escapeHtml(exp.company)}</span>
                      <span class="exp-period">${this.formatDateRange(exp.startDate, exp.endDate, exp.current)}</span>
                    </div>
                  </div>
                  ${exp.description ? `<p class="exp-description">${htmlUtils.escapeHtml(exp.description)}</p>` : ''}
                  ${exp.achievements && exp.achievements.length > 0 ? `
                    <div class="exp-achievements">
                      ${exp.achievements.map(achievement => `<div class="achievement-item">▸ ${htmlUtils.escapeHtml(achievement)}</div>`).join('')}
                    </div>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Education Section -->
      ${cvData.education && cvData.education.length > 0 ? `
        <section class="cyber-section">
          <h2 class="section-title-cyber">// EDUCATION</h2>
          <div class="education-matrix">
            ${cvData.education.map(edu => `
              <div class="edu-node">
                <div class="edu-core">
                  <h3 class="edu-degree">${htmlUtils.escapeHtml(edu.degree)}</h3>
                  <div class="edu-details">
                    <span class="edu-institution">${htmlUtils.escapeHtml(edu.institution)}</span>
                    <span class="edu-period">${this.formatDateRange(edu.startDate, edu.endDate)}</span>
                  </div>
                </div>
                ${edu.description ? `<p class="edu-description">${htmlUtils.escapeHtml(edu.description)}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <!-- Projects Section -->
      ${cvData.projects && cvData.projects.length > 0 ? `
        <section class="cyber-section">
          <h2 class="section-title-cyber">// PROJECTS</h2>
          <div class="projects-grid-cyber">
            ${cvData.projects.map(project => `
              <div class="project-card-cyber">
                <div class="project-header">
                  <h3 class="project-title">${htmlUtils.escapeHtml(project.name)}</h3>
                  ${project.url ? `<a href="${htmlUtils.escapeHtml(project.url)}" class="project-link-cyber">ACCESS</a>` : ''}
                </div>
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
      /* ===== CYBER NEON TEMPLATE STYLES ===== */

      :root {
        --neon-cyan: #00f3ff;
        --neon-purple: #b967ff;
        --neon-pink: #ff2aa4;
        --neon-green: #00ff88;
        --dark-bg: #0a0a0f;
        --darker-bg: #050507;
        --panel-bg: rgba(10, 10, 15, 0.95);
        --text-primary: #ffffff;
        --text-secondary: #b0b0b0;
        --text-muted: #666666;
        --border-color: var(--neon-cyan);
        --glow-shadow: 0 0 20px var(--neon-cyan);
      }

      .cv-container {
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        max-width: 210mm;
        margin: 0 auto;
        background: var(--dark-bg);
        color: var(--text-primary);
        position: relative;
        overflow: hidden;
        min-height: 297mm;
      }

      /* ===== HEADER ===== */
      .cv-header {
        background: linear-gradient(135deg, var(--darker-bg), var(--dark-bg));
        padding: 2rem;
        position: relative;
        border-bottom: 2px solid var(--neon-cyan);
        overflow: hidden;
      }

      .header-matrix {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        z-index: 2;
      }

      .glitch-name {
        position: relative;
      }

      .main-name {
        font-size: 2.5rem;
        font-weight: 900;
        background: linear-gradient(45deg, var(--neon-cyan), var(--neon-purple), var(--neon-pink));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 2px;
        text-shadow: 0 0 20px var(--neon-cyan);
        animation: glitch 2s infinite;
      }

      .main-name::before,
      .main-name::after {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: transparent;
      }

      .main-name::before {
        animation: glitch-1 0.5s infinite;
        color: var(--neon-pink);
        z-index: -1;
      }

      .main-name::after {
        animation: glitch-2 0.5s infinite;
        color: var(--neon-purple);
        z-index: -2;
      }

      @keyframes glitch {
        0%, 100% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
      }

      @keyframes glitch-1 {
        0%, 100% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
      }

      @keyframes glitch-2 {
        0%, 100% { transform: translate(0); }
        20% { transform: translate(2px, -2px); }
        40% { transform: translate(2px, 2px); }
        60% { transform: translate(-2px, -2px); }
        80% { transform: translate(-2px, 2px); }
      }

      .cyber-stats {
        display: flex;
        gap: 2rem;
      }

      .stat-item {
        text-align: center;
        padding: 0.5rem 1rem;
        background: rgba(0, 243, 255, 0.1);
        border: 1px solid var(--neon-cyan);
        border-radius: 8px;
      }

      .stat-label {
        display: block;
        font-size: 0.7rem;
        color: var(--neon-cyan);
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 0.25rem;
      }

      .stat-value {
        display: block;
        font-size: 1.5rem;
        font-weight: 900;
        color: var(--neon-cyan);
        text-shadow: 0 0 10px var(--neon-cyan);
      }

      .neon-grid {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image:
          linear-gradient(rgba(0, 243, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 243, 255, 0.1) 1px, transparent 1px);
        background-size: 20px 20px;
        animation: grid-move 20s linear infinite;
      }

      @keyframes grid-move {
        0% { transform: translate(0, 0); }
        100% { transform: translate(20px, 20px); }
      }

      /* ===== LAYOUT ===== */
      .cv-content {
        display: flex;
        padding: 2rem;
        gap: 2rem;
        position: relative;
        z-index: 1;
      }

      .cyber-panel {
        flex: 1;
        background: var(--panel-bg);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 2rem;
        backdrop-filter: blur(10px);
        box-shadow: 0 8px 32px rgba(0, 243, 255, 0.1);
      }

      /* ===== CYBER SECTIONS ===== */
      .cyber-section {
        margin-bottom: 3rem;
      }

      .cyber-section:last-child {
        margin-bottom: 0;
      }

      .section-title-cyber {
        font-size: 1rem;
        color: var(--neon-cyan);
        font-weight: 700;
        margin: 0 0 1.5rem 0;
        text-transform: uppercase;
        letter-spacing: 2px;
        position: relative;
      }

      .section-title-cyber::before {
        content: '>';
        color: var(--neon-cyan);
        margin-right: 0.5rem;
        text-shadow: 0 0 10px var(--neon-cyan);
      }

      .section-title-cyber::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 100%;
        height: 1px;
        background: linear-gradient(90deg, var(--neon-cyan), transparent);
        box-shadow: 0 0 10px var(--neon-cyan);
      }

      /* ===== LEFT PANEL ===== */
      .profile-matrix {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
      }

      .avatar-container {
        position: relative;
      }

      .avatar-frame {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        overflow: hidden;
        border: 3px solid var(--neon-cyan);
        position: relative;
      }

      .cyber-avatar {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .avatar-glow {
        position: absolute;
        top: -5px;
        left: -5px;
        right: -5px;
        bottom: -5px;
        border-radius: 50%;
        background: linear-gradient(45deg, var(--neon-cyan), var(--neon-purple));
        opacity: 0.3;
        animation: avatar-pulse 2s ease-in-out infinite alternate;
      }

      .avatar-placeholder {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: linear-gradient(45deg, var(--neon-cyan), var(--neon-purple));
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }

      .placeholder-glow {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: var(--dark-bg);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        color: var(--neon-cyan);
      }

      @keyframes avatar-pulse {
        0% { opacity: 0.3; transform: scale(1); }
        100% { opacity: 0.6; transform: scale(1.05); }
      }

      .profile-text {
        text-align: center;
        font-size: 0.9rem;
        color: var(--text-secondary);
        line-height: 1.6;
        max-width: 300px;
      }

      .contact-matrix {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .contact-line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
        background: rgba(0, 243, 255, 0.05);
        border: 1px solid rgba(0, 243, 255, 0.2);
        border-radius: 6px;
      }

      .contact-label {
        font-weight: 700;
        color: var(--neon-cyan);
        font-size: 0.8rem;
      }

      .contact-value,
      .contact-link {
        color: var(--text-primary);
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.8rem;
      }

      .contact-link {
        color: var(--neon-purple);
        text-decoration: none;
        transition: color 0.3s ease;
      }

      .contact-link:hover {
        color: var(--neon-cyan);
        text-shadow: 0 0 10px var(--neon-cyan);
      }

      .skills-matrix {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 1rem;
      }

      .skill-node {
        position: relative;
        padding: 1rem;
        background: rgba(0, 243, 255, 0.05);
        border: 1px solid var(--neon-cyan);
        border-radius: 8px;
        text-align: center;
        transition: all 0.3s ease;
      }

      .skill-node:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 243, 255, 0.3);
      }

      .node-core {
        font-weight: 600;
        color: var(--text-primary);
        position: relative;
        z-index: 2;
      }

      .node-rings {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
      }

      .ring {
        position: absolute;
        border-radius: 50%;
        border: 1px solid var(--neon-cyan);
        animation: ring-pulse 3s ease-in-out infinite;
      }

      .ring-1 {
        width: 100%;
        height: 100%;
        animation-delay: 0s;
      }

      .ring-2 {
        width: 120%;
        height: 120%;
        animation-delay: 1s;
        opacity: 0.6;
      }

      .ring-3 {
        width: 140%;
        height: 140%;
        animation-delay: 2s;
        opacity: 0.3;
      }

      @keyframes ring-pulse {
        0%, 100% {
          transform: scale(1);
          opacity: 0.3;
        }
        50% {
          transform: scale(1.1);
          opacity: 0.8;
        }
      }

      /* ===== RIGHT PANEL ===== */
      .timeline-cyber {
        position: relative;
        padding-left: 2rem;
      }

      .timeline-cyber::before {
        content: '';
        position: absolute;
        left: 10px;
        top: 0;
        bottom: 0;
        width: 2px;
        background: linear-gradient(to bottom, var(--neon-cyan), var(--neon-purple));
        box-shadow: 0 0 10px var(--neon-cyan);
      }

      .timeline-node {
        position: relative;
        margin-bottom: 2rem;
        padding-left: 2rem;
      }

      .node-connector {
        position: absolute;
        left: -23px;
        top: 8px;
        width: 12px;
        height: 12px;
        background: var(--neon-cyan);
        border: 2px solid var(--dark-bg);
        border-radius: 50%;
        box-shadow: 0 0 0 4px var(--neon-cyan);
        animation: connector-glow 2s ease-in-out infinite alternate;
      }

      @keyframes connector-glow {
        0% { box-shadow: 0 0 0 4px var(--neon-cyan); }
        100% { box-shadow: 0 0 0 8px var(--neon-cyan), 0 0 15px var(--neon-cyan); }
      }

      .node-content {
        background: rgba(0, 243, 255, 0.05);
        border: 1px solid rgba(0, 243, 255, 0.3);
        border-radius: 8px;
        padding: 1.5rem;
      }

      .exp-header-cyber {
        margin-bottom: 1rem;
      }

      .exp-position {
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--neon-cyan);
        margin: 0 0 0.5rem 0;
        text-shadow: 0 0 10px var(--neon-cyan);
      }

      .exp-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.8rem;
        color: var(--text-secondary);
      }

      .exp-company {
        color: var(--neon-purple);
        font-weight: 600;
      }

      .exp-description {
        color: var(--text-secondary);
        line-height: 1.6;
        margin: 1rem 0;
      }

      .exp-achievements {
        margin-top: 1rem;
      }

      .achievement-item {
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
        padding-left: 1rem;
        position: relative;
      }

      .achievement-item::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0.3rem;
        width: 4px;
        height: 4px;
        background: var(--neon-green);
        border-radius: 50%;
        box-shadow: 0 0 6px var(--neon-green);
      }

      .education-matrix {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .edu-node {
        background: rgba(185, 103, 255, 0.05);
        border: 1px solid rgba(185, 103, 255, 0.3);
        border-radius: 8px;
        padding: 1.5rem;
      }

      .edu-core {
        margin-bottom: 1rem;
      }

      .edu-degree {
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--neon-purple);
        margin: 0 0 0.5rem 0;
        text-shadow: 0 0 10px var(--neon-purple);
      }

      .edu-details {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.8rem;
        color: var(--text-secondary);
      }

      .edu-institution {
        color: var(--text-primary);
        font-weight: 600;
      }

      .edu-description {
        color: var(--text-secondary);
        line-height: 1.6;
      }

      .projects-grid-cyber {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
      }

      .project-card-cyber {
        background: rgba(255, 42, 164, 0.05);
        border: 1px solid rgba(255, 42, 164, 0.3);
        border-radius: 8px;
        padding: 1.5rem;
        transition: all 0.3s ease;
      }

      .project-card-cyber:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(255, 42, 164, 0.2);
      }

      .project-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
      }

      .project-title {
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--neon-pink);
        margin: 0;
        text-shadow: 0 0 10px var(--neon-pink);
      }

      .project-link-cyber {
        color: var(--neon-cyan);
        text-decoration: none;
        font-weight: 600;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        transition: all 0.3s ease;
      }

      .project-link-cyber:hover {
        color: var(--neon-purple);
        text-shadow: 0 0 10px var(--neon-purple);
      }

      .project-desc {
        color: var(--text-secondary);
        font-size: 0.9rem;
        line-height: 1.5;
        margin: 0 0 0.75rem 0;
      }

      .project-tech {
        font-size: 0.8rem;
        color: var(--neon-green);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      /* ===== CYBER EFFECTS ===== */
      .cyber-effects {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: 0;
      }

      .scan-line {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, var(--neon-cyan), transparent);
        animation: scan 3s linear infinite;
      }

      @keyframes scan {
        0% { top: 0; }
        100% { top: 100%; }
      }

      .data-stream {
        position: absolute;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.7rem;
        color: var(--neon-cyan);
        opacity: 0.6;
        white-space: nowrap;
        animation: data-flow 8s linear infinite;
      }

      .stream-1 {
        top: 20%;
        right: -100px;
        animation-delay: 0s;
      }

      .stream-2 {
        top: 60%;
        right: -200px;
        animation-delay: 3s;
        color: var(--neon-purple);
      }

      .stream-3 {
        top: 80%;
        right: -150px;
        animation-delay: 6s;
        color: var(--neon-green);
      }

      @keyframes data-flow {
        0% { transform: translateX(100vw); }
        100% { transform: translateX(-100px); }
      }

      /* ===== RESPONSIVE DESIGN ===== */
      @media (max-width: 768px) {
        .cv-content {
          flex-direction: column;
          gap: 1.5rem;
        }

        .header-matrix {
          flex-direction: column;
          gap: 2rem;
          text-align: center;
        }

        .cyber-stats {
          justify-content: center;
          gap: 1rem;
        }

        .main-name {
          font-size: 2rem;
        }

        .skills-matrix {
          grid-template-columns: repeat(2, 1fr);
        }

        .projects-grid-cyber {
          grid-template-columns: 1fr;
        }

        .avatar-frame {
          width: 100px;
          height: 100px;
        }

        .avatar-placeholder {
          width: 100px;
          height: 100px;
        }
      }

      /* ===== PRINT STYLES ===== */
      @media print {
        .cv-container {
          box-shadow: none;
          background: white !important;
          color: black !important;
        }

        .cyber-effects,
        .neon-grid,
        .avatar-glow,
        .node-rings,
        .scan-line,
        .data-stream {
          display: none !important;
        }

        .cv-header {
          background: white !important;
          border-bottom: 2px solid black !important;
        }

        .main-name {
          color: black !important;
          text-shadow: none !important;
        }

        .cyber-panel {
          background: white !important;
          border: 1px solid black !important;
          box-shadow: none !important;
        }

        .section-title-cyber {
          color: black !important;
        }

        .section-title-cyber::before {
          color: black !important;
        }

        .section-title-cyber::after {
          background: black !important;
        }

        .cyber-section,
        .timeline-node,
        .edu-node,
        .project-card-cyber {
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
    return validationUtils.validateCyberNeon(cvData);
  }

  /**
   * Get language level label
   * @param {number} level - Language level
   * @returns {string} Level label
   */
  getLanguageLevelLabel(level) {
    const labels = {
      1: 'BEGINNER',
      2: 'ELEMENTARY',
      3: 'INTERMEDIATE',
      4: 'ADVANCED',
      5: 'NATIVE'
    };
    return labels[level] || 'UNKNOWN';
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
    const end = current ? 'PRESENT' : formatDate(endDate);

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

module.exports = CyberNeonTemplate;