import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import apiService from '../services/api';
import { FaUser, FaCheck, FaTimes } from 'react-icons/fa';

const CVForm = ({ onDataChange }) => {
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [cvId, setCvId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showPrefillModal, setShowPrefillModal] = useState(false);
  const [cvData, setCvData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      website: ''
    },
    experiences: [],
    education: [],
    skills: [],
    languages: [],
    hobbies: [],
    projects: [],
    customSections: [],
    summary: ''
  });

  const steps = [
    { id: 1, title: 'Informations Personnelles', component: PersonalInfoStep },
    { id: 2, title: 'Expériences Professionnelles', component: ExperienceStep },
    { id: 3, title: 'Formation', component: EducationStep },
    { id: 4, title: 'Compétences', component: SkillsStep },
    { id: 5, title: 'Langues', component: LanguagesStep },
    { id: 6, title: 'Loisirs', component: HobbiesStep },
    { id: 7, title: 'Projets', component: ProjectsStep },
    { id: 8, title: 'Sections Supplémentaires', component: CustomSectionsStep },
    { id: 9, title: 'Accroche', component: SummaryStep }
  ];

  useEffect(() => {
    // Load from localStorage on mount
    const savedData = localStorage.getItem('cvData');
    if (savedData) {
      setCvData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    // Auto-save to localStorage
    localStorage.setItem('cvData', JSON.stringify(cvData));
    onDataChange && onDataChange(cvData);

    // Auto-save to server (debounced)
    const timeoutId = setTimeout(async () => {
      if (currentUser) {
        try {
          setIsSaving(true);
          const result = await apiService.saveCV(cvData, cvId);
          if (result.cvId && !cvId) {
            setCvId(result.cvId);
          }
        } catch (error) {
          console.error('Auto-save failed:', error);
        } finally {
          setIsSaving(false);
        }
      }
    }, 10000); // Save every 10 seconds

    return () => clearTimeout(timeoutId);
  }, [cvData, onDataChange, currentUser, cvId]);

  const updateCvData = (section, data) => {
    setCvData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const handlePrefillAccept = () => {
    updateCvData('personalInfo', {
      ...cvData.personalInfo,
      email: currentUser.email || '',
      firstName: currentUser.displayName?.split(' ')[0] || '',
      lastName: currentUser.displayName?.split(' ').slice(1).join(' ') || ''
    });
    setShowPrefillModal(false);
  };

  const handlePrefillDecline = () => {
    setShowPrefillModal(false);
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <>
      {/* Prefill Modal */}
      {showPrefillModal && (
        <div className="prefill-modal-overlay">
          <div className="prefill-modal">
            <div className="prefill-modal-header">
              <FaUser className="prefill-icon" />
              <h3>Pré-remplir avec vos données Google</h3>
            </div>
            <div className="prefill-modal-content">
              <p>Nous avons détecté vos informations de connexion Google. Souhaitez-vous pré-remplir automatiquement les champs suivants ?</p>
              <div className="prefill-info">
                <div className="prefill-item">
                  <span className="prefill-label">Email:</span>
                  <span className="prefill-value">{currentUser?.email}</span>
                </div>
                <div className="prefill-item">
                  <span className="prefill-label">Nom complet:</span>
                  <span className="prefill-value">{currentUser?.displayName}</span>
                </div>
              </div>
              <p className="prefill-note">
                Vous pourrez modifier ces informations à tout moment.
              </p>
            </div>
            <div className="prefill-modal-actions">
              <button onClick={handlePrefillDecline} className="prefill-btn decline">
                <FaTimes />
                Non merci
              </button>
              <button onClick={handlePrefillAccept} className="prefill-btn accept">
                <FaCheck />
                Pré-remplir
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="cv-form">
        <div className="step-indicator">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`step ${currentStep === step.id ? 'active' : currentStep > step.id ? 'completed' : ''}`}
            >
              <span className="step-number">{step.id}</span>
              <span className="step-title">{step.title}</span>
            </div>
          ))}
        </div>

        <div className="step-content">
          <CurrentStepComponent
            data={cvData}
            updateData={updateCvData}
            currentUser={currentUser}
          />
        </div>

        <div className="step-navigation">
          {isSaving && <span className="saving-indicator">Sauvegarde en cours...</span>}
          {currentStep > 1 && (
            <button onClick={prevStep} className="btn-secondary">
              Précédent
            </button>
          )}
          {currentStep < steps.length && (
            <button onClick={nextStep} className="btn-primary">
              Suivant
            </button>
          )}
          {currentStep === steps.length && (
            <button className="btn-primary" onClick={() => onDataChange(cvData, 'download')}>
              Télécharger PDF (500 FCFA)
            </button>
          )}
        </div>
      </div>
    </>
  );
};

// Step Components
const PersonalInfoStep = ({ data, updateData, currentUser }) => {
  const [showPrefillModal, setShowPrefillModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData('personalInfo', {
      ...data.personalInfo,
      [name]: value
    });
  };

  useEffect(() => {
    // Check if we should show prefill modal
    const hasEmptyFields = !data.personalInfo.email && !data.personalInfo.firstName && !data.personalInfo.lastName;
    const hasUserData = currentUser && (currentUser.email || currentUser.displayName);
    const hasNotShownModal = !localStorage.getItem('prefillModalShown');

    if (hasEmptyFields && hasUserData && hasNotShownModal && !showPrefillModal) {
      setShowPrefillModal(true);
      localStorage.setItem('prefillModalShown', 'true');
    }
  }, [currentUser, data.personalInfo, showPrefillModal]);

  return (
    <div className="personal-info-step">
      <h2>Informations Personnelles</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>Prénom</label>
          <input
            type="text"
            name="firstName"
            value={data.personalInfo.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Nom</label>
          <input
            type="text"
            name="lastName"
            value={data.personalInfo.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={data.personalInfo.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Téléphone</label>
          <input
            type="tel"
            name="phone"
            value={data.personalInfo.phone}
            onChange={handleChange}
          />
        </div>
        <div className="form-group full-width">
          <label>Adresse</label>
          <input
            type="text"
            name="address"
            value={data.personalInfo.address}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>LinkedIn</label>
          <input
            type="url"
            name="linkedin"
            value={data.personalInfo.linkedin}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Site Web</label>
          <input
            type="url"
            name="website"
            value={data.personalInfo.website}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

const ExperienceStep = ({ data, updateData }) => {
  const [experiences, setExperiences] = useState(data.experiences || []);

  const addExperience = () => {
    setExperiences([...experiences, {
      id: Date.now(),
      position: '',
      company: '',
      startDate: '',
      endDate: '',
      description: '',
      current: false
    }]);
  };

  const updateExperience = (id, field, value) => {
    setExperiences(experiences.map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const removeExperience = (id) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  useEffect(() => {
    updateData('experiences', experiences);
  }, [experiences, updateData]);

  return (
    <div className="experience-step">
      <h2>Expériences Professionnelles</h2>
      {experiences.map((exp, index) => (
        <div key={exp.id} className="experience-item">
          <div className="form-grid">
            <div className="form-group">
              <label>Poste</label>
              <input
                type="text"
                value={exp.position}
                onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Entreprise</label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Date de début</label>
              <input
                type="month"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Date de fin</label>
              <input
                type="month"
                value={exp.endDate}
                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                disabled={exp.current}
              />
            </div>
            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                />
                Poste actuel
              </label>
            </div>
            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                rows="3"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => removeExperience(exp.id)}
            className="btn-remove"
          >
            Supprimer
          </button>
        </div>
      ))}
      <button type="button" onClick={addExperience} className="btn-add">
        + Ajouter une expérience
      </button>
    </div>
  );
};

const EducationStep = ({ data, updateData }) => {
  const [educations, setEducations] = useState(data.education || []);

  const addEducation = () => {
    setEducations([...educations, {
      id: Date.now(),
      degree: '',
      institution: '',
      startDate: '',
      endDate: '',
      description: ''
    }]);
  };

  const updateEducation = (id, field, value) => {
    setEducations(educations.map(edu =>
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const removeEducation = (id) => {
    setEducations(educations.filter(edu => edu.id !== id));
  };

  useEffect(() => {
    updateData('education', educations);
  }, [educations, updateData]);

  return (
    <div className="education-step">
      <h2>Formation</h2>
      {educations.map((edu) => (
        <div key={edu.id} className="education-item">
          <div className="form-grid">
            <div className="form-group">
              <label>Diplôme</label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Établissement</label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Date de début</label>
              <input
                type="month"
                value={edu.startDate}
                onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Date de fin</label>
              <input
                type="month"
                value={edu.endDate}
                onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
              />
            </div>
            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                value={edu.description}
                onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                rows="2"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => removeEducation(edu.id)}
            className="btn-remove"
          >
            Supprimer
          </button>
        </div>
      ))}
      <button type="button" onClick={addEducation} className="btn-add">
        + Ajouter une formation
      </button>
    </div>
  );
};

const SkillsStep = ({ data, updateData }) => {
  const [skills, setSkills] = useState(data.skills || []);
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  useEffect(() => {
    updateData('skills', skills);
  }, [skills, updateData]);

  return (
    <div className="skills-step">
      <h2>Compétences</h2>
      <div className="skills-input">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ajouter une compétence..."
        />
        <button type="button" onClick={addSkill} className="btn-add">
          Ajouter
        </button>
      </div>
      <div className="skills-list">
        {skills.map((skill, index) => (
          <div key={index} className="skill-item">
            <span>{skill}</span>
            <button
              type="button"
              onClick={() => removeSkill(index)}
              className="btn-remove"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const SummaryStep = ({ data, updateData }) => {
  const handleChange = (e) => {
    updateData('summary', e.target.value);
  };

  return (
    <div className="summary-step">
      <h2>Accroche Professionnelle</h2>
      <div className="form-group">
        <label>Rédigez une brève présentation de vous (3-5 phrases)</label>
        <textarea
          value={data.summary}
          onChange={handleChange}
          rows="6"
          placeholder="Décrivez votre parcours, vos motivations et vos objectifs professionnels..."
        />
      </div>
    </div>
  );
};

// Nouvelles sections ajoutées

const LanguagesStep = ({ data, updateData }) => {
  const [languages, setLanguages] = useState(data.languages || []);

  const addLanguage = () => {
    setLanguages([...languages, {
      id: Date.now(),
      name: '',
      level: 1, // 1-5 scale
      certification: ''
    }]);
  };

  const updateLanguage = (id, field, value) => {
    setLanguages(languages.map(lang =>
      lang.id === id ? { ...lang, [field]: value } : lang
    ));
  };

  const removeLanguage = (id) => {
    setLanguages(languages.filter(lang => lang.id !== id));
  };

  useEffect(() => {
    updateData('languages', languages);
  }, [languages, updateData]);

  const getLevelLabel = (level) => {
    const levels = ['', 'Débutant', 'Intermédiaire', 'Avancé', 'Courant', 'Langue maternelle'];
    return levels[level] || '';
  };

  const getLevelColor = (level) => {
    const colors = ['', '#ff4757', '#ffa500', '#3498db', '#00ff88', '#00d4ff'];
    return colors[level] || '#ccc';
  };

  return (
    <div className="languages-step">
      <h2>Langues</h2>
      {languages.map((lang) => (
        <div key={lang.id} className="language-item">
          <div className="form-grid">
            <div className="form-group">
              <label>Langue</label>
              <input
                type="text"
                value={lang.name}
                onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                placeholder="Ex: Français, Anglais..."
              />
            </div>
            <div className="form-group">
              <label>Niveau</label>
              <select
                value={lang.level}
                onChange={(e) => updateLanguage(lang.id, 'level', parseInt(e.target.value))}
              >
                <option value={1}>Débutant</option>
                <option value={2}>Intermédiaire</option>
                <option value={3}>Avancé</option>
                <option value={4}>Courant</option>
                <option value={5}>Langue maternelle</option>
              </select>
            </div>
            <div className="form-group full-width">
              <label>Certification (optionnel)</label>
              <input
                type="text"
                value={lang.certification}
                onChange={(e) => updateLanguage(lang.id, 'certification', e.target.value)}
                placeholder="Ex: TOEIC, DELF..."
              />
            </div>
          </div>

          {/* Barre de niveau visuelle */}
          <div className="language-level-visual">
            <div className="level-label">{getLevelLabel(lang.level)}</div>
            <div className="level-bar">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`level-segment ${level <= lang.level ? 'active' : ''}`}
                  style={{
                    background: level <= lang.level ? getLevelColor(lang.level) : '#e0e0e0'
                  }}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => removeLanguage(lang.id)}
            className="btn-remove"
          >
            Supprimer
          </button>
        </div>
      ))}
      <button type="button" onClick={addLanguage} className="btn-add">
        + Ajouter une langue
      </button>
    </div>
  );
};

const HobbiesStep = ({ data, updateData }) => {
  const [hobbies, setHobbies] = useState(data.hobbies || []);
  const [newHobby, setNewHobby] = useState('');

  const addHobby = () => {
    if (newHobby.trim()) {
      setHobbies([...hobbies, {
        id: Date.now(),
        name: newHobby.trim(),
        description: ''
      }]);
      setNewHobby('');
    }
  };

  const updateHobby = (id, field, value) => {
    setHobbies(hobbies.map(hobby =>
      hobby.id === id ? { ...hobby, [field]: value } : hobby
    ));
  };

  const removeHobby = (id) => {
    setHobbies(hobbies.filter(hobby => hobby.id !== id));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addHobby();
    }
  };

  useEffect(() => {
    updateData('hobbies', hobbies);
  }, [hobbies, updateData]);

  return (
    <div className="hobbies-step">
      <h2>Centres d'Intérêt & Loisirs</h2>
      <div className="hobby-input">
        <input
          type="text"
          value={newHobby}
          onChange={(e) => setNewHobby(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ajouter un loisir ou centre d'intérêt..."
        />
        <button type="button" onClick={addHobby} className="btn-add">
          Ajouter
        </button>
      </div>
      <div className="hobbies-list">
        {hobbies.map((hobby) => (
          <div key={hobby.id} className="hobby-item">
            <div className="hobby-content">
              <input
                type="text"
                value={hobby.name}
                onChange={(e) => updateHobby(hobby.id, 'name', e.target.value)}
                className="hobby-name-input"
              />
              <textarea
                value={hobby.description}
                onChange={(e) => updateHobby(hobby.id, 'description', e.target.value)}
                placeholder="Description optionnelle..."
                rows="2"
                className="hobby-description"
              />
            </div>
            <button
              type="button"
              onClick={() => removeHobby(hobby.id)}
              className="btn-remove"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProjectsStep = ({ data, updateData }) => {
  const [projects, setProjects] = useState(data.projects || []);

  const addProject = () => {
    setProjects([...projects, {
      id: Date.now(),
      name: '',
      description: '',
      technologies: '',
      url: '',
      startDate: '',
      endDate: '',
      current: false
    }]);
  };

  const updateProject = (id, field, value) => {
    setProjects(projects.map(proj =>
      proj.id === id ? { ...proj, [field]: value } : proj
    ));
  };

  const removeProject = (id) => {
    setProjects(projects.filter(proj => proj.id !== id));
  };

  useEffect(() => {
    updateData('projects', projects);
  }, [projects, updateData]);

  return (
    <div className="projects-step">
      <h2>Projets</h2>
      {projects.map((project) => (
        <div key={project.id} className="project-item">
          <div className="form-grid">
            <div className="form-group">
              <label>Nom du projet</label>
              <input
                type="text"
                value={project.name}
                onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                placeholder="Ex: Application E-commerce"
              />
            </div>
            <div className="form-group">
              <label>Technologies utilisées</label>
              <input
                type="text"
                value={project.technologies}
                onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                placeholder="Ex: React, Node.js, MongoDB"
              />
            </div>
            <div className="form-group">
              <label>Date de début</label>
              <input
                type="month"
                value={project.startDate}
                onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Date de fin</label>
              <input
                type="month"
                value={project.endDate}
                onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                disabled={project.current}
              />
            </div>
            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={project.current}
                  onChange={(e) => updateProject(project.id, 'current', e.target.checked)}
                />
                Projet en cours
              </label>
            </div>
            <div className="form-group">
              <label>URL/Démo (optionnel)</label>
              <input
                type="url"
                value={project.url}
                onChange={(e) => updateProject(project.id, 'url', e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="form-group full-width">
              <label>Description du projet</label>
              <textarea
                value={project.description}
                onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                rows="3"
                placeholder="Décrivez le projet, vos responsabilités et les résultats obtenus..."
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => removeProject(project.id)}
            className="btn-remove"
          >
            Supprimer
          </button>
        </div>
      ))}
      <button type="button" onClick={addProject} className="btn-add">
        + Ajouter un projet
      </button>
    </div>
  );
};

const CustomSectionsStep = ({ data, updateData }) => {
  const [customSections, setCustomSections] = useState(data.customSections || []);

  const addCustomSection = () => {
    setCustomSections([...customSections, {
      id: Date.now(),
      title: '',
      type: 'text', // text, list, or description
      content: '',
      items: []
    }]);
  };

  const updateCustomSection = (id, field, value) => {
    setCustomSections(customSections.map(section =>
      section.id === id ? { ...section, [field]: value } : section
    ));
  };

  const removeCustomSection = (id) => {
    setCustomSections(customSections.filter(section => section.id !== id));
  };

  const addListItem = (sectionId) => {
    setCustomSections(customSections.map(section =>
      section.id === sectionId
        ? { ...section, items: [...section.items, ''] }
        : section
    ));
  };

  const updateListItem = (sectionId, itemIndex, value) => {
    setCustomSections(customSections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            items: section.items.map((item, index) =>
              index === itemIndex ? value : item
            )
          }
        : section
    ));
  };

  const removeListItem = (sectionId, itemIndex) => {
    setCustomSections(customSections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            items: section.items.filter((_, index) => index !== itemIndex)
          }
        : section
    ));
  };

  useEffect(() => {
    updateData('customSections', customSections);
  }, [customSections, updateData]);

  return (
    <div className="custom-sections-step">
      <h2>Sections Supplémentaires</h2>
      <p className="step-description">
        Ajoutez des sections personnalisées à votre CV pour mettre en valeur d'autres aspects de votre profil.
      </p>

      {customSections.map((section) => (
        <div key={section.id} className="custom-section-item">
          <div className="form-grid">
            <div className="form-group">
              <label>Titre de la section</label>
              <input
                type="text"
                value={section.title}
                onChange={(e) => updateCustomSection(section.id, 'title', e.target.value)}
                placeholder="Ex: Certifications, Publications, Bénévolat..."
              />
            </div>
            <div className="form-group">
              <label>Type de contenu</label>
              <select
                value={section.type}
                onChange={(e) => updateCustomSection(section.id, 'type', e.target.value)}
              >
                <option value="text">Texte libre</option>
                <option value="list">Liste à puces</option>
                <option value="description">Description détaillée</option>
              </select>
            </div>

            {section.type === 'text' && (
              <div className="form-group full-width">
                <label>Contenu</label>
                <textarea
                  value={section.content}
                  onChange={(e) => updateCustomSection(section.id, 'content', e.target.value)}
                  rows="4"
                  placeholder="Contenu de votre section personnalisée..."
                />
              </div>
            )}

            {section.type === 'list' && (
              <div className="form-group full-width">
                <label>Éléments de la liste</label>
                {section.items.map((item, index) => (
                  <div key={index} className="list-item-input">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateListItem(section.id, index, e.target.value)}
                      placeholder={`Élément ${index + 1}...`}
                    />
                    <button
                      type="button"
                      onClick={() => removeListItem(section.id, index)}
                      className="btn-remove-small"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addListItem(section.id)}
                  className="btn-add-small"
                >
                  + Ajouter un élément
                </button>
              </div>
            )}

            {section.type === 'description' && (
              <div className="form-group full-width">
                <label>Description détaillée</label>
                <textarea
                  value={section.content}
                  onChange={(e) => updateCustomSection(section.id, 'content', e.target.value)}
                  rows="6"
                  placeholder="Description détaillée de cette section..."
                />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => removeCustomSection(section.id)}
            className="btn-remove"
          >
            Supprimer cette section
          </button>
        </div>
      ))}

      <button type="button" onClick={addCustomSection} className="btn-add">
        + Ajouter une section personnalisée
      </button>
    </div>
  );
};

export default CVForm;