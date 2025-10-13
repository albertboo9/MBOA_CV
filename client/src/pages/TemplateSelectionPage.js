import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './TemplateSelectionPage.module.css';

const TemplateSelectionPage = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = [
    {
      id: 'modern',
      name: 'Moderne',
      description: 'Design épuré et professionnel, parfait pour les secteurs tech et créatifs',
      features: ['Layout responsive', 'Typographie moderne', 'Couleurs personnalisables'],
      preview: '/templates/modern-preview.png',
      popular: true
    },
    {
      id: 'classic',
      name: 'Classique',
      description: 'Style traditionnel et formel, idéal pour les secteurs corporate',
      features: ['Design intemporel', 'Format A4 optimisé', 'Police serif élégante'],
      preview: '/templates/classic-preview.png',
      popular: false
    },
    {
      id: 'creative',
      name: 'Créatif',
      description: 'Design original et coloré pour les profils artistiques et marketing',
      features: ['Éléments graphiques', 'Palette de couleurs vives', 'Mise en page dynamique'],
      preview: '/templates/creative-preview.png',
      popular: false
    },
    {
      id: 'minimalist',
      name: 'Minimaliste',
      description: 'Approche épurée au maximum, focus sur le contenu essentiel',
      features: ['Design très simple', 'Beaucoup d\'espace blanc', 'Focus sur la lisibilité'],
      preview: '/templates/minimalist-preview.png',
      popular: false
    }
  ];

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
  };

  const handleContinue = () => {
    if (selectedTemplate) {
      // Store selected template in localStorage for the CV creation page
      localStorage.setItem('selectedTemplate', selectedTemplate);
      navigate('/create-cv');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.header
        className={styles.header}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <div className={styles.headerContent}>
          <motion.button
            className={styles.backButton}
            onClick={handleBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Retour
          </motion.button>
          <motion.div
            className={styles.logo}
            whileHover={{ scale: 1.05 }}
          >
            <span className={styles.logoText}>MBOA</span>
            <span className={styles.logoAccent}>CV</span>
          </motion.div>
          <div className={styles.stepIndicator}>
            <span className={styles.step}>Étape 1 sur 2</span>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main
        className={styles.main}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className={styles.container}>
          {/* Title Section */}
          <motion.div
            className={styles.titleSection}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1>Choisissez Votre Modèle</h1>
            <p>
              Sélectionnez le modèle qui correspond le mieux à votre style et à votre secteur d'activité.
              Tous nos modèles sont optimisés pour l'impression et le partage numérique.
            </p>
          </motion.div>

          {/* Templates Grid */}
          <motion.div
            className={styles.templatesGrid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                className={`${styles.templateCard} ${selectedTemplate === template.id ? styles.selected : ''} ${template.popular ? styles.popular : ''}`}
                onClick={() => handleTemplateSelect(template.id)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {template.popular && (
                  <motion.div
                    className={styles.popularBadge}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.5 + index * 0.1 }}
                  >
                    <span>⭐ Plus populaire</span>
                  </motion.div>
                )}

                <div className={styles.templatePreview}>
                  <div className={styles.previewPlaceholder}>
                    <div className={styles.templateMockup}>
                      <div className={styles.mockupHeader}>
                        <div className={styles.mockupAvatar}></div>
                        <div className={styles.mockupName}>
                          <div className={styles.nameLine}></div>
                          <div className={styles.titleLine}></div>
                        </div>
                      </div>
                      <div className={styles.mockupContent}>
                        <div className={styles.contentSection}>
                          <div className={styles.sectionLineShort}></div>
                          <div className={styles.sectionLineLong}></div>
                          <div className={styles.sectionLineMedium}></div>
                        </div>
                        <div className={styles.contentSection}>
                          <div className={styles.sectionLineShort}></div>
                          <div className={styles.sectionLineLong}></div>
                        </div>
                        <div className={styles.skillsSection}>
                          <div className={styles.skillDot}></div>
                          <div className={styles.skillDot}></div>
                          <div className={styles.skillDot}></div>
                          <div className={styles.skillDot}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.templateInfo}>
                  <h3>{template.name}</h3>
                  <p>{template.description}</p>

                  <div className={styles.templateFeatures}>
                    {template.features.map((feature, i) => (
                      <motion.div
                        key={i}
                        className={styles.featureItem}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.8 + index * 0.1 + i * 0.1 }}
                      >
                        <span className={styles.featureCheck}>✓</span>
                        <span>{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.div
                  className={styles.templateSelection}
                  animate={{
                    scale: selectedTemplate === template.id ? 1.1 : 1,
                    borderColor: selectedTemplate === template.id ? '#00ffff' : '#e0e0e0'
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={`${styles.selectionIndicator} ${selectedTemplate === template.id ? styles.active : ''}`}>
                    {selectedTemplate === template.id && (
                      <motion.span
                        className={styles.checkmark}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        ✓
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Action Section */}
          <motion.div
            className={styles.actionSection}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className={styles.pricingInfo}>
              <motion.div
                className={styles.priceTag}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className={styles.price}>500 FCFA</span>
                <span className={styles.priceLabel}>par CV</span>
              </motion.div>
              <p className={styles.pricingNote}>
                Payez uniquement lorsque vous téléchargez votre CV en PDF
              </p>
            </div>

            <motion.button
              className={`${styles.continueButton} ${selectedTemplate ? styles.active : ''}`}
              onClick={handleContinue}
              disabled={!selectedTemplate}
              whileHover={selectedTemplate ? { scale: 1.05 } : {}}
              whileTap={selectedTemplate ? { scale: 0.95 } : {}}
              animate={{
                backgroundColor: selectedTemplate ? '#00ffff' : '#cccccc'
              }}
              transition={{ duration: 0.3 }}
            >
              Continuer avec ce modèle
              <motion.span
                className={styles.buttonArrow}
                animate={selectedTemplate ? { x: [0, 5, 0] } : {}}
                transition={{ duration: 1, repeat: selectedTemplate ? Infinity : 0 }}
              >
                →
              </motion.span>
            </motion.button>
          </motion.div>
        </div>
      </motion.main>

      {/* Features Preview */}
      <section className={styles.featuresPreview}>
        <div className={styles.container}>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Pourquoi nos modèles sont parfaits
          </motion.h2>
          <motion.div
            className={styles.featuresGrid}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {[
              { icon: "🎨", title: "Design Professionnel", desc: "Modèles créés par des designers professionnels" },
              { icon: "📱", title: "100% Responsive", desc: "Parfaits sur tous les appareils et formats d'impression" },
              { icon: "⚡", title: "Rapide à remplir", desc: "Interface intuitive pour une création en 10-15 minutes" },
              { icon: "🔒", title: "Sécurisé", desc: "Vos données sont sauvegardées et protégées" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className={styles.featureHighlight}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default TemplateSelectionPage;