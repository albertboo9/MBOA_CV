import React, { useState } from 'react';
import { FaSearchPlus, FaSearchMinus, FaExpand, FaMobile, FaDesktop, FaPrint } from 'react-icons/fa';

const CVPreview = ({ cvData, template = 'modern' }) => {
  const [zoom, setZoom] = useState(100);
  const [viewMode, setViewMode] = useState('desktop'); // desktop, mobile, print

  if (!cvData || !cvData.personalInfo) {
    return <div className="cv-preview-placeholder">Aperçu du CV</div>;
  }

  const { personalInfo, experience, education, skills, summary } = cvData;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleZoomReset = () => setZoom(100);

  return (
    <div className="cv-preview-container">
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
        </div>
      </div>
    </div>
  );
};

export default CVPreview;