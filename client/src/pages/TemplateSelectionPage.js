import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaArrowLeft, 
  FaCheck, 
  FaStar, 
  FaPalette, 
  FaMobile, 
  FaBolt, 
  FaShieldAlt,
  FaTimes,
  FaCrown
} from 'react-icons/fa';
import styles from './TemplateSelectionPage.module.css';

const Icons = {
  ArrowLeft: () => <FaArrowLeft className={styles.icon} />,
  Check: () => <FaCheck className={styles.icon} />,
  Star: () => <FaStar className={styles.icon} />,
  Design: () => <FaPalette className={styles.icon} />,
  Mobile: () => <FaMobile className={styles.icon} />,
  Speed: () => <FaBolt className={styles.icon} />,
  Security: () => <FaShieldAlt className={styles.icon} />,
  Close: () => <FaTimes className={styles.icon} />,
  Crown: () => <FaCrown className={styles.icon} />
};

const TemplateSelectionPage = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTemplateData, setSelectedTemplateData] = useState(null);
  const [hoveredTemplate, setHoveredTemplate] = useState(null);

  const templates = [
    {
      id: 'cyber-modern',
      name: 'Nexus Cyber',
      description: 'Design futuriste avec effets néon, parfait pour les métiers tech et innovants',
      features: ['Effets néon cyan/purple', 'Layout cybernétique', 'Animations avancées'],
      style: 'cyber',
      popular: true,
      gradient: 'linear-gradient(135deg, #00f3ff, #b967ff)'
    },
    {
      id: 'quantum-minimal',
      name: 'Quantum Pro',
      description: 'Minimalisme high-tech avec typographie géométrique et espace négatif maîtrisé',
      features: ['Design épuré élégant', 'Focus sur le contenu', 'Typographie géométrique'],
      style: 'minimal',
      popular: false,
      gradient: 'linear-gradient(135deg, #00ff88, #0099ff)'
    },
    {
      id: 'synergy-creative',
      name: 'Synergy Creative',
      description: 'Design énergique et coloré pour les profils créatifs et entrepreneuriaux',
      features: ['Éléments graphiques dynamiques', 'Palette colorée moderne', 'Mise en page asymétrique'],
      style: 'creative',
      popular: false,
      gradient: 'linear-gradient(135deg, #ff2aa4, #b967ff)'
    },
    {
      id: 'matrix-corporate',
      name: 'Matrix Elite',
      description: 'Style corporate futuriste avec structure data-driven et présentation professionnelle',
      features: ['Structure organisée', 'Style professionnel avancé', 'Optimisé A4'],
      style: 'corporate',
      popular: false,
      gradient: 'linear-gradient(135deg, #0099ff, #00f3ff)'
    }
  ];

  const handleTemplateSelect = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    setSelectedTemplateData(template);
    setShowModal(true);
  };

  const handleConfirmSelection = () => {
    setSelectedTemplate(selectedTemplateData.id);
    setShowModal(false);

    // Show loading screen
    window.showLoading && window.showLoading("Préparation de votre espace de création...");

    // Navigate to CV creation page after a short delay for smooth transition
    setTimeout(() => {
      localStorage.setItem('selectedTemplate', selectedTemplateData.id);
      navigate('/create-cv');
      window.hideLoading && window.hideLoading();
    }, 1500);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTemplateData(null);
  };

  const handleContinue = () => {
    if (selectedTemplate) {
      localStorage.setItem('selectedTemplate', selectedTemplate);
      navigate('/create-cv');
    }
  };

  const handleBack = () => {
    window.showLoading && window.showLoading("Retour à l'accueil...");
    setTimeout(() => {
      navigate('/');
      window.hideLoading && window.hideLoading();
    }, 800);
  };

  // Composant de prévisualisation unique par template
  const TemplatePreview = ({ template, isSelected, isHovered }) => (
    <div className={`${styles.templateMockup} ${styles[template.style]}`}>
      <div className={styles.mockupHeader}>
        <motion.div 
          className={styles.mockupAvatar}
          animate={{
            boxShadow: isHovered ? [
              "0 0 20px rgba(0, 243, 255, 0.6)",
              "0 0 40px rgba(185, 103, 255, 0.8)",
              "0 0 20px rgba(0, 243, 255, 0.6)"
            ] : "0 0 10px rgba(0, 243, 255, 0.3)"
          }}
          transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
        />
        <div className={styles.mockupName}>
          <motion.div 
            className={styles.nameLine}
            animate={{ 
              background: isHovered ? template.gradient : 'var(--text-primary)',
              boxShadow: isHovered ? `0 0 15px ${template.style === 'cyber' ? 'var(--neon-cyan)' : 'var(--neon-purple)'}` : 'none'
            }}
          />
          <motion.div 
            className={styles.titleLine}
            animate={{ 
              background: isHovered ? template.gradient : 'var(--text-secondary)',
              boxShadow: isHovered ? `0 0 10px ${template.style === 'cyber' ? 'var(--neon-purple)' : 'var(--neon-cyan)'}` : 'none'
            }}
          />
        </div>
      </div>
      
      <div className={styles.mockupContent}>
        <div className={styles.contentSection}>
          <motion.div 
            className={styles.sectionLineShort}
            animate={{ width: isHovered ? '80%' : '60%' }}
          />
          <motion.div 
            className={styles.sectionLineLong}
            animate={{ width: isHovered ? '95%' : '85%' }}
          />
          <motion.div 
            className={styles.sectionLineMedium}
            animate={{ width: isHovered ? '70%' : '50%' }}
          />
        </div>
        
        {template.style === 'cyber' && (
          <div className={styles.cyberElements}>
            <motion.div 
              className={styles.dataStream}
              animate={{ opacity: isHovered ? [0, 1, 0] : 0 }}
              transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
            />
          </div>
        )}
        
        {template.style === 'creative' && (
          <div className={styles.creativeElements}>
            <motion.div className={styles.creativeShape} />
            <motion.div className={styles.creativeShape} />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Enhanced Header */}
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
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icons.ArrowLeft />
            Retour
          </motion.button>
          
          <motion.div
            className={styles.logo}
            whileHover={{ scale: 1.05 }}
          >
            <span className={styles.logoText}>MBOA</span>
            <span className={styles.logoAccent}>CV</span>
            <div className={styles.logoPulse} />
          </motion.div>
          
          <motion.div
            className={styles.stepIndicator}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.4 }}
          >
            <div className={styles.stepProgress}>
              <div className={styles.stepDot} />
              <div className={styles.stepLine} />
              <div className={`${styles.stepDot} ${styles.inactive}`} />
            </div>
            <span className={styles.stepText}>Étape 1 sur 2</span>
          </motion.div>
        </div>
      </motion.header>

      {/* Enhanced Main Content */}
      <motion.main
        className={styles.main}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className={styles.container}>
          {/* Enhanced Title Section */}
          <motion.div
            className={styles.titleSection}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Choisissez Votre
              <span className={styles.titleAccent}> Design Futuriste</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Sélectionnez le modèle qui incarne votre ambition professionnelle. 
              Chaque design intègre les dernières tendances en matière d'UX et de technologie visuelle.
            </motion.p>
          </motion.div>

          {/* Enhanced Templates Grid */}
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
                onHoverStart={() => setHoveredTemplate(template.id)}
                onHoverEnd={() => setHoveredTemplate(null)}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.1 * index,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -15, 
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                {template.popular && (
                  <motion.div
                    className={styles.popularBadge}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", delay: 0.5 + index * 0.1 }}
                  >
                    <Icons.Crown />
                    <span>Plus populaire</span>
                  </motion.div>
                )}

                <div className={styles.templatePreview}>
                  <TemplatePreview 
                    template={template}
                    isSelected={selectedTemplate === template.id}
                    isHovered={hoveredTemplate === template.id}
                  />
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
                        <Icons.Check />
                        <span>{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.div
                  className={styles.templateSelection}
                  animate={{
                    scale: selectedTemplate === template.id ? 1.1 : 1,
                    borderColor: selectedTemplate === template.id ? 'var(--neon-cyan)' : 'var(--card-border)',
                    boxShadow: selectedTemplate === template.id ? '0 0 30px var(--neon-cyan)' : 'none'
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
                        <Icons.Check />
                      </motion.span>
                    )}
                  </div>
                </motion.div>

                {/* Hover Glow Effect */}
                <motion.div
                  className={styles.cardGlow}
                  animate={{
                    opacity: hoveredTemplate === template.id ? 0.3 : 0,
                    background: template.gradient
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced Action Section */}
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
                <div className={styles.pricePulse} />
              </motion.div>
              <motion.p 
                className={styles.pricingNote}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Payez uniquement lorsque vous téléchargez votre CV final en PDF haute qualité
              </motion.p>
            </div>

            <motion.button
              className={`${styles.continueButton} ${selectedTemplate ? styles.active : ''}`}
              onClick={handleContinue}
              disabled={!selectedTemplate}
              whileHover={selectedTemplate ? { 
                scale: 1.05,
                boxShadow: "0 0 40px var(--neon-cyan)"
              } : {}}
              whileTap={selectedTemplate ? { scale: 0.95 } : {}}
              animate={{
                background: selectedTemplate ? 'var(--gradient-cyan-purple)' : 'var(--card-bg)',
                color: selectedTemplate ? '#000' : 'var(--text-secondary)'
              }}
              transition={{ duration: 0.3 }}
            >
              <span>Continuer avec {selectedTemplate && templates.find(t => t.id === selectedTemplate)?.name}</span>
              <motion.span
                className={styles.buttonArrow}
                animate={selectedTemplate ? { x: [0, 10, 0] } : {}}
                transition={{ duration: 1.5, repeat: selectedTemplate ? Infinity : 0 }}
              >
                →
              </motion.span>
              <motion.div
                className={styles.buttonOrbit}
                animate={{ rotate: selectedTemplate ? 360 : 0 }}
                transition={{ duration: 3, repeat: selectedTemplate ? Infinity : 0, ease: "linear" }}
              />
            </motion.button>
          </motion.div>
        </div>
      </motion.main>

      {/* Enhanced Features Preview */}
      <motion.section 
        className={styles.featuresPreview}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className={styles.container}>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            L'Excellence en Design
            <span className={styles.titleAccent}> Technologique</span>
          </motion.h2>
          
          <motion.div
            className={styles.featuresGrid}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {[
              { 
                icon: <Icons.Design />, 
                title: "Design Avant-Gardiste", 
                desc: "Modèles créés avec les dernières tendances en design cyber-futuriste et néon" 
              },
              { 
                icon: <Icons.Mobile />, 
                title: "Optimisation Multi-Format", 
                desc: "Parfaits sur tous les écrans et optimisés pour l'impression professionnelle" 
              },
              { 
                icon: <Icons.Speed />, 
                title: "Création Accélérée", 
                desc: "Interface optimisée pour une création de CV en moins de 10 minutes" 
              },
              { 
                icon: <Icons.Security />, 
                title: "Sécurité des Données", 
                desc: "Vos informations professionnelles sont cryptées et protégées" 
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className={styles.featureHighlight}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  transition: { duration: 0.3 }
                }}
              >
                <motion.div 
                  className={styles.featureIcon}
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                >
                  {feature.icon}
                </motion.div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
                <div className={styles.featureGlow} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Enhanced Modal */}
      <AnimatePresence>
        {showModal && selectedTemplateData && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className={styles.modalContent}
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h2>{selectedTemplateData.name}</h2>
                <motion.button
                  className={styles.closeButton}
                  onClick={handleCloseModal}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icons.Close />
                </motion.button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.templatePreviewLarge}>
                  <TemplatePreview 
                    template={selectedTemplateData}
                    isSelected={true}
                    isHovered={true}
                  />
                </div>

                <div className={styles.templateDetails}>
                  <p className={styles.templateDescription}>
                    {selectedTemplateData.description}
                  </p>

                  <div className={styles.templateFeatures}>
                    <h3>Caractéristiques Avancées :</h3>
                    {selectedTemplateData.features.map((feature, i) => (
                      <motion.div 
                        key={i} 
                        className={styles.featureItem}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                      >
                        <Icons.Check />
                        <span>{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className={styles.pricingInfo}>
                    <motion.div 
                      className={styles.priceTag}
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className={styles.price}>500 FCFA</span>
                      <span className={styles.priceLabel}>par CV</span>
                    </motion.div>
                    <p className={styles.pricingNote}>
                      Payez uniquement lorsque vous téléchargez votre CV final en PDF haute qualité
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <motion.button
                  className={styles.cancelButton}
                  onClick={handleCloseModal}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explorer d'autres modèles
                </motion.button>
                <motion.button
                  className={styles.confirmButton}
                  onClick={handleConfirmSelection}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 30px var(--neon-cyan)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Commencer avec {selectedTemplateData.name}</span>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    →
                  </motion.div>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TemplateSelectionPage;