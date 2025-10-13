import React from 'react';

const CVPreview = ({ cvData, template = 'modern' }) => {
  if (!cvData || !cvData.personalInfo) {
    return <div className="cv-preview-placeholder">Aperçu du CV</div>;
  }

  const { personalInfo, experience, education, skills, summary } = cvData;

  return (
    <div className={`cv-preview cv-template-${template}`}>
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
  );
};

export default CVPreview;