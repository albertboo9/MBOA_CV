import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import styles from './LandingPage.module.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeHover, setActiveHover] = useState(null);
  
  const heroRef = useRef(null);

  const [text] = useTypewriter({
    words: ['Révolutionnaire', 'Intelligent', 'Moderne', 'Efficace', 'Innovant'],
    loop: true,
    delaySpeed: 2000,
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    navigate('/templates');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Features data - Focus sur l'innovation
  const features = [
    {
      icon: "⚡",
      title: "Création Éclair",
      description: "Générez un CV professionnel en moins de 5 minutes avec notre interface ultra-rapide",
      color: "cyan"
    },
    {
      icon: "🤖", 
      title: "IA Avancée",
      description: "Notre intelligence artificielle optimise automatiquement votre contenu pour les recruteurs",
      color: "purple"
    },
    {
      icon: "🎨",
      title: "Design Futuriste",
      description: "Templates uniques conçus avec les dernières tendances du design numérique",
      color: "blue"
    },
    {
      icon: "🚀",
      title: "Export Instantané",
      description: "Téléchargez votre CV en PDF haute qualité en un seul clic, sans attente",
      color: "green"
    }
  ];

  // Templates data - Focus sur l'innovation
  const templates = [
    {
      name: "Nexus",
      style: "futurist",
      description: "Design avant-gardiste pour les pionniers du numérique"
    },
    {
      name: "Quantum", 
      style: "minimal",
      description: "Élégance minimaliste et performances maximales"
    },
    {
      name: "Synergy",
      style: "creative",
      description: "Harmonie parfaite entre créativité et professionnalisme"
    }
  ];

  if (isLoading) {
    return (
      <motion.div
        className={styles.loadingScreen}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.loadingOrbit}>
          <motion.div
            className={styles.orbitalCircle}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <div className={styles.orbitalDot}></div>
          </motion.div>
          <motion.div
            className={styles.loadingCore}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className={styles.logoText}>MBOA</span>
            <span className={styles.logoAccent}>CV</span>
          </motion.div>
        </div>
        <motion.p
          className={styles.loadingText}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          Initialisation de la révolution CV...
        </motion.p>
      </motion.div>
    );
  }

  return (
    <div className={styles.landingPage}>
      {/* Animated Cyber Background */}
      <div className={styles.cyberBackground}>
        <div className={styles.gridMatrix}></div>
        <div className={styles.neonPulse}></div>
        
        {/* Floating Tech Elements */}
        <div className={styles.floatingTech}>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className={styles.techElement}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.sin(i) * 50, 0],
                rotate: [0, 180, 360],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                delay: i * 0.5
              }}
            />
          ))}
        </div>

        {/* Data Streams */}
        <div className={styles.dataStreams}>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={styles.dataStream}
              animate={{
                y: [-100, 600],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.7
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <motion.nav
        className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, type: "spring" }}
      >
        <div className={styles.navContainer}>
          <motion.div
            className={styles.logo}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className={styles.logoText}>MBOA</span>
            <span className={styles.logoAccent}>CV</span>
            <motion.div
              className={styles.logoPulse}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          <div className={styles.navLinks}>
            {['accueil', 'innovation', 'design', 'commencer'].map((item) => (
              <motion.button
                key={item}
                onClick={() => scrollToSection(item)}
                className={styles.navLink}
                whileHover={{ 
                  scale: 1.1,
                  textShadow: "0 0 20px var(--neon-cyan)"
                }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setActiveHover(item)}
                onHoverEnd={() => setActiveHover(null)}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
                <AnimatePresence>
                  {activeHover === item && (
                    <motion.div
                      className={styles.navHoverGlow}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>

          <motion.button
            className={styles.navCta}
            onClick={handleGetStarted}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 30px rgba(0, 243, 255, 0.6)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Lancer la création</span>
            <motion.div
              className={styles.ctaPulse}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="accueil" className={styles.heroSection} ref={heroRef}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <motion.div
              className={styles.heroBadge}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🚀
              </motion.span>
              NOUVELLE GÉNÉRATION DE CV
            </motion.div>

            <motion.h1
              className={styles.heroTitle}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              La Révolution
              <br />
              <motion.span className={styles.heroTitleAccent}>
                du CV
              </motion.span>
              <br />
              <motion.span className={styles.typewriterText}>
                {text}
                <Cursor cursorStyle="_" />
              </motion.span>
            </motion.h1>

            <motion.p
              className={styles.heroSubtitle}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
            >
              MBOA-CV réinvente la création de CV avec une technologie de pointe. 
              Plus rapide, plus intelligent, plus efficace.
            </motion.p>

            <motion.div
              className={styles.heroActions}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
            >
              <motion.button
                className={styles.btnPrimary}
                onClick={handleGetStarted}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 40px rgba(0, 243, 255, 0.8)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Essayer Gratuitement</span>
                <motion.div
                  className={styles.btnOrbit}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <div className={styles.btnOrbitDot}></div>
                </motion.div>
              </motion.button>

              <motion.button
                className={styles.btnSecondary}
                onClick={() => scrollToSection('innovation')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Découvrir l'Innovation</span>
                <motion.span
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.button>
            </motion.div>

            {/* Tech Specs */}
            <motion.div
              className={styles.techSpecs}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.1 }}
            >
              <div className={styles.specItem}>
                <div className={styles.specIcon}>⚡</div>
                <div className={styles.specContent}>
                  <div className={styles.specValue}>5x</div>
                  <div className={styles.specLabel}>Plus rapide</div>
                </div>
              </div>
              <div className={styles.specItem}>
                <div className={styles.specIcon}>🎯</div>
                <div className={styles.specContent}>
                  <div className={styles.specValue}>IA</div>
                  <div className={styles.specLabel}>Intelligente</div>
                </div>
              </div>
              <div className={styles.specItem}>
                <div className={styles.specIcon}>💎</div>
                <div className={styles.specContent}>
                  <div className={styles.specValue}>0</div>
                  <div className={styles.specLabel}>Compromis</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Hero Visual - Interactive CV Builder */}
          <motion.div
            className={styles.heroVisual}
            initial={{ opacity: 0, x: 100, rotateY: 10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1.2, delay: 0.8 }}
          >
            <div className={styles.cvBuilder}>
              <motion.div
                className={styles.builderWindow}
                animate={{ 
                  y: [0, -20, 0],
                  rotateZ: [0, 0.5, -0.5, 0]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className={styles.builderHeader}>
                  <div className={styles.windowControls}>
                    <div className={styles.control}></div>
                    <div className={styles.control}></div>
                    <div className={styles.control}></div>
                  </div>
                  <div className={styles.builderTitle}>MBOA CV BUILDER</div>
                </div>
                
                <div className={styles.builderContent}>
                  <motion.div
                    className={styles.cvPreview}
                    animate={{
                      background: [
                        "linear-gradient(135deg, rgba(0, 243, 255, 0.1), rgba(185, 103, 255, 0.1))",
                        "linear-gradient(135deg, rgba(185, 103, 255, 0.1), rgba(0, 243, 255, 0.1))",
                        "linear-gradient(135deg, rgba(0, 243, 255, 0.1), rgba(185, 103, 255, 0.1))"
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <div className={styles.previewHeader}>
                      <motion.div
                        className={styles.avatarPlaceholder}
                        animate={{
                          boxShadow: [
                            "0 0 20px rgba(0, 243, 255, 0.5)",
                            "0 0 40px rgba(185, 103, 255, 0.8)",
                            "0 0 20px rgba(0, 243, 255, 0.5)"
                          ]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                      <div className={styles.previewInfo}>
                        <div className={styles.nameGlow}>VOTRE NOM</div>
                        <div className={styles.titleGlow}>POSTE RECHERCHÉ</div>
                      </div>
                    </div>
                    
                    <div className={styles.previewSections}>
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className={styles.previewSection}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: 1.5 + i * 0.2 }}
                        >
                          <div className={styles.sectionHeader}></div>
                          <div className={styles.sectionContent}>
                            {[...Array(2)].map((_, j) => (
                              <motion.div
                                key={j}
                                className={styles.contentLine}
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 0.8, delay: 1.8 + i * 0.2 + j * 0.1 }}
                              />
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Floating UI Elements */}
              <div className={styles.floatingUI}>
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={styles.uiElement}
                    animate={{
                      y: [0, -30, 0],
                      rotate: [0, 180, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 4 + i,
                      repeat: Infinity,
                      delay: i * 0.5
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className={styles.scrollIndicator}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <motion.div
            className={styles.scrollArrow}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ↓
          </motion.div>
          <span>Explorer l'innovation</span>
        </motion.div>
      </section>

      {/* Innovation Section */}
      <section id="innovation" className={styles.innovationSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className={styles.sectionBadge}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              🤖 TECHNOLOGIE
            </motion.div>
            <h2>L'Innovation au Service de Votre Carrière</h2>
            <p>Découvrez les fonctionnalités révolutionnaires qui changent tout</p>
          </motion.div>

          <div className={styles.innovationGrid}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`${styles.innovationCard} ${styles[feature.color]}`}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
              >
                <motion.div
                  className={styles.innovationIcon}
                  whileHover={{ 
                    scale: 1.3,
                    rotate: 360,
                    transition: { duration: 0.6 }
                  }}
                >
                  {feature.icon}
                </motion.div>
                
                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                  viewport={{ once: true }}
                >
                  {feature.title}
                </motion.h3>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                  viewport={{ once: true }}
                >
                  {feature.description}
                </motion.p>

                <motion.div
                  className={styles.cardGlow}
                  animate={{
                    opacity: [0.3, 0.7, 0.3],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Design Section */}
      <section id="design" className={styles.designSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className={styles.sectionBadge}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              🎨 DESIGN
            </motion.div>
            <h2>Des Templates d'Exception</h2>
            <p>Chaque template est une œuvre de design optimisée pour l'impact</p>
          </motion.div>

          <div className={styles.designShowcase}>
            {templates.map((template, index) => (
              <motion.div
                key={index}
                className={styles.templateShowcase}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className={styles.templateVisual}>
                  <motion.div
                    className={styles.templateMockup}
                    animate={{ 
                      y: [0, -10, 0],
                      rotateY: [0, 5, 0]
                    }}
                    transition={{ 
                      duration: 4 + index,
                      repeat: Infinity 
                    }}
                  >
                    <div className={styles.templateContent}>
                      <div className={styles.templateName}>{template.name}</div>
                      <div className={styles.templateDesc}>{template.description}</div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    className={styles.templateGlow}
                    animate={{
                      opacity: [0.2, 0.5, 0.2],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.3 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="commencer" className={styles.finalCta}>
        <div className={styles.container}>
          <motion.div
            className={styles.ctaContent}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Prêt pour la Révolution ?
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Rejoignez l'avenir de la création de CV. Simple, rapide, révolutionnaire.
            </motion.p>

            <motion.button
              className={styles.ctaButton}
              onClick={handleGetStarted}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 50px rgba(0, 243, 255, 0.8)"
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <span>Commencer Maintenant</span>
              <motion.div
                className={styles.ctaOrbit}
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={styles.orbitDot}
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3
                    }}
                  />
                ))}
              </motion.div>
            </motion.button>

            <motion.p
              className={styles.ctaNote}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              ⚡ Aucun engagement • Essai immédiat • Innovation garantie
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <motion.div
            className={styles.footerContent}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className={styles.footerBrand}>
              <div className={styles.logo}>
                <span className={styles.logoText}>MBOA</span>
                <span className={styles.logoAccent}>CV</span>
              </div>
              <p>Révolutionnant la création de CV, une innovation à la fois.</p>
            </div>
            
            <div className={styles.footerNote}>
              <p>© 2024 MBOA-CV. La nouvelle ère du CV professionnel.</p>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;