import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../AuthContext';
import CVForm from '../components/CVForm';
import CVPreview from '../components/CVPreview';
import apiService from '../services/api';
import styles from './CVCreationPage.module.css';

const CVCreationPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [cvData, setCvData] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [showPreview, setShowPreview] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!currentUser) {
      navigate('/');
      return;
    }

    // Load selected template from localStorage
    const savedTemplate = localStorage.getItem('selectedTemplate');
    if (savedTemplate) {
      setSelectedTemplate(savedTemplate);
    }

    // Load any existing CV data
    const savedData = localStorage.getItem('cvData');
    if (savedData) {
      setCvData(JSON.parse(savedData));
    }
  }, [currentUser, navigate]);

  const handleCvDataChange = async (data, action) => {
    setCvData(data);

    if (action === 'download') {
      await handleDownload();
    }
  };

  const handleDownload = async () => {
    if (!cvData) return;

    try {
      setIsDownloading(true);

      // First, save the CV if not already saved
      let cvId = localStorage.getItem('currentCvId');
      if (!cvId) {
        const saveResult = await apiService.saveCV(cvData);
        cvId = saveResult.cvId;
        localStorage.setItem('currentCvId', cvId);
      }

      // Initiate payment
      const paymentResult = await apiService.initiatePayment(cvId);

      // Redirect to payment URL (in production, this would be handled by the payment aggregator)
      if (paymentResult.paymentUrl) {
        // For demo purposes, simulate successful payment
        alert(`Paiement initié. En production, vous seriez redirigé vers: ${paymentResult.paymentUrl}`);

        // Simulate webhook callback (in production, this would come from the payment provider)
        await simulatePaymentSuccess(cvId);

        // Download the PDF
        const pdfBlob = await apiService.downloadCV(cvId, selectedTemplate);
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CV_${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('Erreur lors du téléchargement. Veuillez réessayer.');
    } finally {
      setIsDownloading(false);
    }
  };

  const simulatePaymentSuccess = async (cvId) => {
    // Simulate webhook call (in production, this would be called by the payment provider)
    try {
      await fetch('http://localhost:5000/api/payment/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: `payment_${cvId}`,
          status: 'success',
          transactionId: `txn_${Date.now()}`
        })
      });
    } catch (error) {
      console.error('Webhook simulation failed:', error);
    }
  };

  const handleBack = () => {
    navigate('/templates');
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  if (!currentUser) {
    return <div>Chargement...</div>;
  }

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
            ← Retour aux modèles
          </motion.button>
          <motion.div
            className={styles.logo}
            whileHover={{ scale: 1.05 }}
          >
            <span className={styles.logoText}>MBOA</span>
            <span className={styles.logoAccent}>CV</span>
          </motion.div>
          <div className={styles.headerActions}>
            <motion.button
              className={`${styles.previewToggle} ${showPreview ? styles.active : ''}`}
              onClick={togglePreview}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                backgroundColor: showPreview ? 'rgba(0, 255, 255, 0.1)' : 'transparent',
                borderColor: showPreview ? '#00ffff' : 'rgba(255, 255, 255, 0.3)'
              }}
            >
              <span className={styles.toggleIcon}>
                {showPreview ? '👁️' : '👁️‍🗨️'}
              </span>
              {showPreview ? 'Masquer' : 'Afficher'} l'aperçu
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Progress Indicator */}
      <motion.section
        className={styles.progressSection}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className={styles.progressContainer}>
          <motion.div
            className={`${styles.progressStep} ${styles.completed}`}
            whileHover={{ scale: 1.05 }}
          >
            <span className={styles.stepNumber}>1</span>
            <span className={styles.stepLabel}>Modèle</span>
            <div className={styles.stepCheck}>✓</div>
          </motion.div>
          <motion.div
            className={`${styles.progressLine} ${styles.completed}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
          <motion.div
            className={`${styles.progressStep} ${styles.active}`}
            whileHover={{ scale: 1.05 }}
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(0, 255, 255, 0.4)',
                '0 0 0 10px rgba(0, 255, 255, 0)',
                '0 0 0 0 rgba(0, 255, 255, 0)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className={styles.stepNumber}>2</span>
            <span className={styles.stepLabel}>Contenu</span>
            <div className={styles.stepPulse}></div>
          </motion.div>
          <div className={styles.progressLine} />
          <motion.div
            className={styles.progressStep}
            whileHover={{ scale: 1.05 }}
          >
            <span className={styles.stepNumber}>3</span>
            <span className={styles.stepLabel}>Téléchargement</span>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={`${styles.formSection} ${showPreview ? styles.withPreview : ''}`}>
          <motion.div
            className={styles.formContainer}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className={styles.formHeader}>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Remplissez votre CV
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                Remplissez les informations demandées. Vos données sont automatiquement sauvegardées.
                Vous pouvez reprendre votre travail à tout moment.
              </motion.p>
              <motion.div
                className={styles.autoSaveIndicator}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <span className={styles.saveIcon}>💾</span>
                <span>Sauvegarde automatique activée</span>
              </motion.div>
            </div>

            <CVForm onDataChange={handleCvDataChange} />
          </motion.div>

          <AnimatePresence>
            {showPreview && (
              <motion.div
                className={styles.previewSection}
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.95 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
              >
                <div className={styles.previewContainer}>
                  <motion.div
                    className={styles.previewHeader}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <h2>Aperçu de votre CV</h2>
                    <motion.span
                      className={styles.templateBadge}
                      whileHover={{ scale: 1.05 }}
                    >
                      Modèle: {selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)}
                    </motion.span>
                  </motion.div>
                  <motion.div
                    className={styles.previewContent}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <CVPreview cvData={cvData} template={selectedTemplate} />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Download Modal/Overlay */}
      <AnimatePresence>
        {isDownloading && (
          <motion.div
            className={styles.downloadOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className={styles.downloadModal}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            >
              <motion.div
                className={styles.loadingSpinner}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <div className={styles.spinnerRing}></div>
                <div className={styles.spinnerCore}></div>
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                Traitement de votre paiement...
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                Veuillez patienter pendant que nous préparons votre CV professionnel.
              </motion.p>
              <motion.div
                className={styles.progressBar}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CVCreationPage;