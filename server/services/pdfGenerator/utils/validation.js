/**
 * Validation utilities for CV templates
 */

/**
 * Sanitize template data to prevent XSS and ensure data integrity
 * @param {Object} cvData - Raw CV data
 * @returns {Object} Sanitized CV data
 */
function sanitizeTemplateData(cvData) {
  if (!cvData || typeof cvData !== 'object') {
    return {};
  }

  const sanitized = { ...cvData };

  // Sanitize personal info
  if (sanitized.personalInfo) {
    sanitized.personalInfo = {
      ...sanitized.personalInfo,
      firstName: sanitizeString(sanitized.personalInfo.firstName),
      lastName: sanitizeString(sanitized.personalInfo.lastName),
      email: sanitizeEmail(sanitized.personalInfo.email),
      phone: sanitizeString(sanitized.personalInfo.phone),
      address: sanitizeString(sanitized.personalInfo.address),
      title: sanitizeString(sanitized.personalInfo.title),
      linkedin: sanitizeUrl(sanitized.personalInfo.linkedin),
      website: sanitizeUrl(sanitized.personalInfo.website),
      photo: sanitizeUrl(sanitized.personalInfo.photo)
    };
  }

  // Sanitize summary
  if (sanitized.summary) {
    sanitized.summary = sanitizeString(sanitized.summary);
  }

  // Sanitize experiences
  if (Array.isArray(sanitized.experiences)) {
    sanitized.experiences = sanitized.experiences.map(exp => ({
      ...exp,
      position: sanitizeString(exp.position),
      company: sanitizeString(exp.company),
      description: sanitizeString(exp.description),
      startDate: sanitizeString(exp.startDate),
      endDate: sanitizeString(exp.endDate),
      current: Boolean(exp.current),
      achievements: Array.isArray(exp.achievements)
        ? exp.achievements.map(achievement => sanitizeString(achievement))
        : []
    }));
  }

  // Sanitize education
  if (Array.isArray(sanitized.education)) {
    sanitized.education = sanitized.education.map(edu => ({
      ...edu,
      degree: sanitizeString(edu.degree),
      institution: sanitizeString(edu.institution),
      description: sanitizeString(edu.description),
      startDate: sanitizeString(edu.startDate),
      endDate: sanitizeString(edu.endDate)
    }));
  }

  // Sanitize skills
  if (Array.isArray(sanitized.skills)) {
    sanitized.skills = sanitized.skills.map(skill => sanitizeString(skill));
  }

  // Sanitize languages
  if (Array.isArray(sanitized.languages)) {
    sanitized.languages = sanitized.languages.map(lang => ({
      ...lang,
      name: sanitizeString(lang.name),
      level: Math.max(1, Math.min(5, parseInt(lang.level) || 1))
    }));
  }

  // Sanitize projects
  if (Array.isArray(sanitized.projects)) {
    sanitized.projects = sanitized.projects.map(project => ({
      ...project,
      name: sanitizeString(project.name),
      description: sanitizeString(project.description),
      url: sanitizeUrl(project.url),
      technologies: sanitizeString(project.technologies)
    }));
  }

  // Sanitize hobbies
  if (Array.isArray(sanitized.hobbies)) {
    sanitized.hobbies = sanitized.hobbies.map(hobby => ({
      ...hobby,
      name: sanitizeString(hobby.name),
      description: sanitizeString(hobby.description)
    }));
  }

  // Sanitize custom sections
  if (Array.isArray(sanitized.customSections)) {
    sanitized.customSections = sanitized.customSections.map(section => ({
      ...section,
      title: sanitizeString(section.title),
      content: sanitizeString(section.content),
      listItems: Array.isArray(section.listItems)
        ? section.listItems.map(item => sanitizeString(item))
        : []
    }));
  }

  return sanitized;
}

/**
 * Sanitize a string value
 * @param {string} value - Value to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeString(value) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/[<>]/g, '');
}

/**
 * Sanitize an email address
 * @param {string} email - Email to sanitize
 * @returns {string} Sanitized email
 */
function sanitizeEmail(email) {
  if (typeof email !== 'string') return '';
  const sanitized = email.trim().toLowerCase();
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(sanitized) ? sanitized : '';
}

/**
 * Sanitize a URL
 * @param {string} url - URL to sanitize
 * @returns {string} Sanitized URL
 */
function sanitizeUrl(url) {
  if (typeof url !== 'string') return '';
  const sanitized = url.trim();
  try {
    new URL(sanitized);
    return sanitized;
  } catch {
    // If it's not a valid URL, return empty string
    return '';
  }
}

/**
 * Validate Corporate Executive template data
 * @param {Object} cvData - CV data to validate
 * @returns {Object} Validation result
 */
function validateCorporateExecutive(cvData) {
  const errors = [];
  const warnings = [];

  // Check required fields
  if (!cvData?.personalInfo?.firstName || !cvData?.personalInfo?.lastName) {
    errors.push('Le nom et prénom sont requis');
  }

  if (!cvData?.personalInfo?.email) {
    errors.push('L\'email est requis');
  }

  // Check experiences
  if (!cvData?.experiences || cvData.experiences.length === 0) {
    warnings.push('Au moins une expérience professionnelle est recommandée');
  }

  // Check education
  if (!cvData?.education || cvData.education.length === 0) {
    warnings.push('Au moins une formation est recommandée');
  }

  // Check skills
  if (!cvData?.skills || cvData.skills.length === 0) {
    warnings.push('Des compétences sont recommandées');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: Math.max(0, 100 - (errors.length * 20) - (warnings.length * 5))
  };
}

/**
 * Validate Creative Minimal template data
 * @param {Object} cvData - CV data to validate
 * @returns {Object} Validation result
 */
function validateCreativeMinimal(cvData) {
  const errors = [];
  const warnings = [];

  // Check required fields
  if (!cvData?.personalInfo?.firstName || !cvData?.personalInfo?.lastName) {
    errors.push('Le nom et prénom sont requis');
  }

  // Creative templates benefit from projects
  if (!cvData?.projects || cvData.projects.length === 0) {
    warnings.push('Les projets personnels mettent en valeur les profils créatifs');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: Math.max(0, 100 - (errors.length * 20) - (warnings.length * 5))
  };
}

/**
 * Validate Cyber Neon template data
 * @param {Object} cvData - CV data to validate
 * @returns {Object} Validation result
 */
function validateCyberNeon(cvData) {
  const errors = [];
  const warnings = [];

  // Check required fields
  if (!cvData?.personalInfo?.firstName || !cvData?.personalInfo?.lastName) {
    errors.push('Le nom et prénom sont requis');
  }

  // Tech profiles benefit from skills
  if (!cvData?.skills || cvData.skills.length < 3) {
    warnings.push('Au moins 3 compétences techniques sont recommandées pour ce style');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: Math.max(0, 100 - (errors.length * 20) - (warnings.length * 5))
  };
}

/**
 * Validate Elegant Classic template data
 * @param {Object} cvData - CV data to validate
 * @returns {Object} Validation result
 */
function validateElegantClassic(cvData) {
  const errors = [];
  const warnings = [];

  // Check required fields
  if (!cvData?.personalInfo?.firstName || !cvData?.personalInfo?.lastName) {
    errors.push('Le nom et prénom sont requis');
  }

  // Classic templates benefit from traditional structure
  if (!cvData?.experiences || cvData.experiences.length === 0) {
    warnings.push('Une expérience professionnelle est essentielle pour ce style');
  }

  if (!cvData?.education || cvData.education.length === 0) {
    warnings.push('Une formation académique est recommandée');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: Math.max(0, 100 - (errors.length * 20) - (warnings.length * 5))
  };
}

/**
 * Validate Executive Elite template data
 * @param {Object} cvData - CV data to validate
 * @returns {Object} Validation result
 */
function validateExecutiveElite(cvData) {
  const errors = [];
  const warnings = [];

  // Check required fields
  if (!cvData?.personalInfo?.firstName || !cvData?.personalInfo?.lastName) {
    errors.push('Le nom et prénom sont requis');
  }

  if (!cvData?.personalInfo?.title) {
    warnings.push('Un titre professionnel est recommandé pour ce style');
  }

  // Executive profiles need strong experience
  if (!cvData?.experiences || cvData.experiences.length < 2) {
    warnings.push('Au moins 2 expériences professionnelles sont recommandées');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: Math.max(0, 100 - (errors.length * 20) - (warnings.length * 5))
  };
}

/**
 * Validate Creative Vibrant template data
 * @param {Object} cvData - CV data to validate
 * @returns {Object} Validation result
 */
function validateCreativeVibrant(cvData) {
  const errors = [];
  const warnings = [];

  // Check required fields
  if (!cvData?.personalInfo?.firstName || !cvData?.personalInfo?.lastName) {
    errors.push('Le nom et prénom sont requis');
  }

  // Creative templates benefit from projects and hobbies
  if (!cvData?.projects || cvData.projects.length === 0) {
    warnings.push('Les projets personnels mettent en valeur les profils créatifs');
  }

  if (!cvData?.hobbies || cvData.hobbies.length === 0) {
    warnings.push('Les centres d\'intérêt enrichissent les profils créatifs');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: Math.max(0, 100 - (errors.length * 20) - (warnings.length * 5))
  };
}

/**
 * Validate Minimalist Professional template data
 * @param {Object} cvData - CV data to validate
 * @returns {Object} Validation result
 */
function validateMinimalistProfessional(cvData) {
  const errors = [];
  const warnings = [];

  // Check required fields
  if (!cvData?.personalInfo?.firstName || !cvData?.personalInfo?.lastName) {
    errors.push('Le nom et prénom sont requis');
  }

  // Minimalist templates focus on essentials
  if (!cvData?.summary) {
    warnings.push('Un résumé professionnel est recommandé pour ce style épuré');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: Math.max(0, 100 - (errors.length * 20) - (warnings.length * 5))
  };
}

/**
 * Validate Modern Double template data
 * @param {Object} cvData - CV data to validate
 * @returns {Object} Validation result
 */
function validateModernDouble(cvData) {
  const errors = [];
  const warnings = [];

  // Check required fields
  if (!cvData?.personalInfo?.firstName || !cvData?.personalInfo?.lastName) {
    errors.push('Le nom et prénom sont requis');
  }

  // Modern templates benefit from comprehensive information
  if (!cvData?.skills || cvData.skills.length === 0) {
    warnings.push('Des compétences sont recommandées pour ce layout moderne');
  }

  if (!cvData?.languages || cvData.languages.length === 0) {
    warnings.push('Les langues parlées enrichissent le profil');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: Math.max(0, 100 - (errors.length * 20) - (warnings.length * 5))
  };
}

/**
 * Validate Tech Modern template data
 * @param {Object} cvData - CV data to validate
 * @returns {Object} Validation result
 */
function validateTechModern(cvData) {
  const errors = [];
  const warnings = [];

  // Check required fields
  if (!cvData?.personalInfo?.firstName || !cvData?.personalInfo?.lastName) {
    errors.push('Le nom et prénom sont requis');
  }

  // Tech profiles need technical skills
  if (!cvData?.skills || cvData.skills.length < 3) {
    warnings.push('Au moins 3 compétences techniques sont recommandées');
  }

  // Tech profiles benefit from projects
  if (!cvData?.projects || cvData.projects.length === 0) {
    warnings.push('Les projets techniques démontrent vos compétences');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: Math.max(0, 100 - (errors.length * 20) - (warnings.length * 5))
  };
}

module.exports = {
  sanitizeTemplateData,
  sanitizeString,
  sanitizeEmail,
  sanitizeUrl,
  validateCorporateExecutive,
  validateCreativeMinimal,
  validateCyberNeon,
  validateElegantClassic,
  validateExecutiveElite,
  validateCreativeVibrant,
  validateMinimalistProfessional,
  validateModernDouble,
  validateTechModern
};