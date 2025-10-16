import React, { useState } from 'react';
import { FaSearchPlus, FaSearchMinus, FaExpand, FaMobile, FaDesktop, FaPrint } from 'react-icons/fa';

const CVPreview = ({ cvData, template = 'modern' }) => {
  const [zoom, setZoom] = useState(100);
  const [viewMode, setViewMode] = useState('desktop'); // desktop, mobile, print

  if (!cvData || !cvData.personalInfo) {
    return (
      <div className="cv-preview-placeholder">
        <div className="placeholder-content">
          <div className="placeholder-icon">📄</div>
          <h3>Aperçu du CV</h3>
          <p>Remplissez le formulaire pour voir l'aperçu de votre CV</p>
        </div>
      </div>
    );
  }

  // Helper functions pour les niveaux de langue
  const getLevelLabel = (level) => {
    const levels = ['', 'Débutant', 'Intermédiaire', 'Avancé', 'Courant', 'Langue maternelle'];
    return levels[level] || '';
  };

  const getLevelColor = (level) => {
    const colors = ['', '#ff4757', '#ffa500', '#3498db', '#00ff88', '#00d4ff'];
    return colors[level] || '#ccc';
  };

  const { personalInfo, experience, education, skills, languages, hobbies, projects, customSections, summary } = cvData;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleZoomReset = () => setZoom(100);

  return (
    <div className="cv-preview-container">
      {/* Download Button */}
      <div className="preview-download-section">
        <button
          className="btn-download-preview"
          onClick={() => window.dispatchEvent(new CustomEvent('downloadCV', { detail: cvData }))}
        >
          Télécharger le CV (500 FCFA)
        </button>
      </div>

      {/* Preview Controls */}
      <div className="cv-preview-controls">
        <div className="cv-preview-zoom">
          <button onClick={handleZoomOut} className="zoom-btn" title="Zoom arrière">
            <FaSearchMinus />
          </button>
          <span className="zoom-level">{zoom}%</span>
          <button onClick={handleZoomIn} className="zoom-btn" title="Zoom avant">
            <FaSearchPlus />
          </button>
          <button onClick={handleZoomReset} className="zoom-reset" title="Zoom 100%">
            <FaExpand />
          </button>
        </div>

        <div className="cv-preview-modes">
          <button
            onClick={() => setViewMode('desktop')}
            className={`mode-btn ${viewMode === 'desktop' ? 'active' : ''}`}
            title="Vue ordinateur"
          >
            <FaDesktop />
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`mode-btn ${viewMode === 'mobile' ? 'active' : ''}`}
            title="Vue mobile"
          >
            <FaMobile />
          </button>
          <button
            onClick={() => setViewMode('print')}
            className={`mode-btn ${viewMode === 'print' ? 'active' : ''}`}
            title="Vue impression"
          >
            <FaPrint />
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className={`cv-preview-wrapper cv-view-${viewMode}`}>
        <div
          className={`cv-preview cv-template-${template}`}
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
        >
          {/* Header Section */}
          <header className="cv-header">
            <div className="personal-info">
              <h1>{personalInfo.firstName} {personalInfo.lastName}</h1>
              <div className="contact-info">
                {personalInfo.email && <span>{personalInfo.email}</span>}
                {personalInfo.phone && <span>{personalInfo.phone}</span>}
                {personalInfo.address && <span>{personalInfo.address}</span>}
              </div>
              <div className="social-links">
                {personalInfo.linkedin && (
                  <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                )}
                {personalInfo.website && (
                  <a href={personalInfo.website} target="_blank" rel="noopener noreferrer">
                    Site Web
                  </a>
                )}
              </div>
            </div>
          </header>

          {/* Summary Section */}
          {summary && (
            <section className="cv-section">
              <h2>Profil</h2>
              <p className="summary-text">{summary}</p>
            </section>
          )}

          {/* Experience Section */}
          {experience && experience.length > 0 && (
            <section className="cv-section">
              <h2>Expérience Professionnelle</h2>
              {experience.map((exp, index) => (
                <div key={exp.id || index} className="experience-item">
                  <div className="job-header">
                    <h3>{exp.position}</h3>
                    <div className="job-meta">
                      <span className="company">{exp.company}</span>
                      <span className="dates">
                        {exp.startDate} - {exp.current ? 'Présent' : exp.endDate}
                      </span>
                    </div>
                  </div>
                  {exp.description && (
                    <p className="job-description">{exp.description}</p>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Education Section */}
          {education && education.length > 0 && (
            <section className="cv-section">
              <h2>Formation</h2>
              {education.map((edu, index) => (
                <div key={edu.id || index} className="education-item">
                  <div className="education-header">
                    <h3>{edu.degree}</h3>
                    <div className="education-meta">
                      <span className="institution">{edu.institution}</span>
                      <span className="dates">
                        {edu.startDate} - {edu.endDate}
                      </span>
                    </div>
                  </div>
                  {edu.description && (
                    <p className="education-description">{edu.description}</p>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Skills Section */}
          {skills && skills.length > 0 && (
            <section className="cv-section">
              <h2>Compétences</h2>
              <div className="skills-list">
                {skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Languages Section */}
          {languages && languages.length > 0 && (
            <section className="cv-section">
              <h2>Langues</h2>
              {languages.map((lang, index) => (
                <div key={lang.id || index} className="language-item">
                  <div className="language-header">
                    <span className="language-name">{lang.name}</span>
                    <span className="language-level">{getLevelLabel(lang.level)}</span>
                  </div>
                  {lang.certification && (
                    <div className="language-certification">{lang.certification}</div>
                  )}
                  <div className="language-level-bar">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`level-dot ${level <= lang.level ? 'active' : ''}`}
                        style={{
                          background: level <= lang.level ? getLevelColor(lang.level) : '#e0e0e0',
                          borderColor: level <= lang.level ? getLevelColor(lang.level) : '#ddd'
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Projects Section */}
          {projects && projects.length > 0 && (
            <section className="cv-section">
              <h2>Projets</h2>
              {projects.map((project, index) => (
                <div key={project.id || index} className="project-item">
                  <h3>{project.name}</h3>
                  {project.technologies && (
                    <div className="project-technologies">Technologies: {project.technologies}</div>
                  )}
                  <div className="project-meta">
                    <span className="project-dates">
                      {project.startDate} - {project.current ? 'Présent' : project.endDate}
                    </span>
                    {project.url && (
                      <span className="project-url">{project.url}</span>
                    )}
                  </div>
                  {project.description && (
                    <p className="project-description">{project.description}</p>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Hobbies Section */}
          {hobbies && hobbies.length > 0 && (
            <section className="cv-section">
              <h2>Centres d'Intérêt</h2>
              <div className="hobbies-list">
                {hobbies.map((hobby, index) => (
                  <div key={hobby.id || index} className="hobby-item">
                    <span className="hobby-name">{hobby.name}</span>
                    {hobby.description && (
                      <span className="hobby-description">{hobby.description}</span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Custom Sections */}
          {customSections && customSections.length > 0 && (
            <>
              {customSections.map((section, index) => (
                <section key={section.id || index} className="cv-section">
                  <h2>{section.title}</h2>
                  {section.type === 'text' && (
                    <p className="custom-content">{section.content}</p>
                  )}
                  {section.type === 'list' && (
                    <ul className="custom-list">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {section.type === 'description' && (
                    <div className="custom-description">{section.content}</div>
                  )}
                </section>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVPreview;