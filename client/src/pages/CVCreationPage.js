import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../AuthContext';
import CVForm from '../components/CVForm';
import CVPreview from '../components/CVPreview';
import apiService from '../services/api';
import {
  FaArrowLeft,
  FaEye,
  FaDownload,
  FaCheck,
  FaCreditCard,
  FaShieldAlt,
  FaTimes,
  FaSave,
  FaSpinner,
  FaEdit,
  FaSignOutAlt,
  FaUser
} from 'react-icons/fa';

import styles from './CVCreationPage.module.css';

const CVCreationPage = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
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
    summary: ''
  });
  const [selectedTemplate, setSelectedTemplate] = useState('cyber-modern');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [previewViewMode, setPreviewViewMode] = useState('desktop');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Charger les données sauvegardées
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }

    // Charger le template sélectionné (frontend ID)
    const savedTemplate = localStorage.getItem('selectedTemplate');
    if (savedTemplate) {
      setSelectedTemplate(savedTemplate);
    }

    // Charger les données CV existantes
    const savedCvData = localStorage.getItem('cvData');
    if (savedCvData) {
      try {
        const parsedData = JSON.parse(savedCvData);
        setCvData(parsedData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    }
  }, [currentUser, navigate]);

  // Sauvegarde manuelle (simulée pour l'UX)
  const handleManualSave = useCallback(async () => {
    if (!cvData.personalInfo.firstName) {
      alert('Veuillez remplir au moins votre prénom avant de sauvegarder.');
      return;
    }

    setSaveStatus('saving');

    try {
      // Simulation sauvegarde (le vrai auto-save se fait dans CVForm)
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSaveStatus('saved');
      setHasUnsavedChanges(false);

      // Revenir à idle après 2 secondes
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);

    } catch (error) {
      console.error('Erreur de sauvegarde:', error);
      setSaveStatus('error');

      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }
  }, [cvData]);

  // Gestion des modifications des données
  const handleCvDataChange = useCallback(async (data, action) => {
    setCvData(data);
    setHasUnsavedChanges(true);

    if (action === 'download') {
      await handleFinalDownload();
    }
  }, []);

  // Téléchargement final
  const handleFinalDownload = async () => {
    if (!cvData.personalInfo.firstName) {
      alert('Veuillez remplir vos informations personnelles avant de générer votre CV.');
      return;
    }

    // Ouvrir le modal de paiement
    setShowPaymentModal(true);
  };

  const processPaymentAndDownload = async () => {
    try {
      setIsProcessing(true);
      setShowPaymentModal(false);

      // Étape 1: Simulation de traitement de paiement
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Étape 2: Sauvegarder le CV avant téléchargement
      const saveResult = await apiService.saveCV(cvData);
      const cvId = saveResult.cvId;

      // Étape 3: Initier le paiement
      const paymentResult = await apiService.initiatePayment(cvId, 1250);

      // Étape 4: Simuler le paiement réussi
      await apiService.processPayment(paymentResult.paymentId, true);

      // Étape 5: Petite pause pour le traitement
      await new Promise(resolve => setTimeout(resolve, 800));

      // Étape 6: Téléchargement du PDF avec le bon template backend
      const backendTemplateId = localStorage.getItem('selectedTemplateBackend') || selectedTemplate;
      const pdfBlob = await apiService.downloadCV(cvId, backendTemplateId);
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CV_${cvData.personalInfo.firstName}_${cvData.personalInfo.lastName}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      alert('🎉 Téléchargement réussi ! Votre CV professionnel a été généré.');

    } catch (error) {
      console.error('Erreur de téléchargement:', error);
      alert('❌ Erreur lors du téléchargement. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToTemplates = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        'Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?'
      );
      if (!confirmLeave) return;
    }

    setIsButtonLoading(true);
    setTimeout(() => {
      navigate('/templates');
      setIsButtonLoading(false);
    }, 600);
  };

  if (!currentUser) {
    return (
      <div className={styles.cvCreationLoading}>
        <div className={styles.cvCreationLoadingSpinner}></div>
        <p>Chargement de votre espace personnel...</p>
      </div>
    );
  }

  return (
    <div className={styles.cvCreationPage}>
      {/* En-tête avec navigation */}
      <header className={styles.cvCreationHeader}>
        <div className={styles.cvCreationHeaderContent}> 
          <button
            className={styles.cvCreationBackButton}
            onClick={handleBackToTemplates}
            type="button"
          >
            <FaArrowLeft />
            <span>Modèles</span>
          </button>

          <div className={styles.cvCreationLogo}>
            <span className={styles.cvCreationLogoText}>MBOA</span>
            <span className={styles.cvCreationLogoAccent}>CV</span>
          </div>

          <div className={styles.cvCreationHeaderActions}>
            {/* Indicateur d'état avec sauvegarde manuelle */}
            <div className={styles.cvCreationSaveSection}>
            {hasUnsavedChanges && (
              <span className={styles.cvCreationUnsavedIndicator}>
                Modifications non sauvegardées
              </span>
            )}
            <button
              className={`${styles.cvCreationSaveButton} ${saveStatus}`}
              onClick={handleManualSave}
              disabled={saveStatus === 'saving' || !hasUnsavedChanges}
              type="button"
            >
              {saveStatus === 'saving' && <FaSpinner className={styles.cvCreationSaveSpinner} />}
              {saveStatus === 'saved' && <FaCheck />}
              {saveStatus === 'idle' && <FaSave />}
              {saveStatus === 'saving' ? 'Sauvegarde...' :
               saveStatus === 'saved' ? 'Sauvegardé !' :
               'Sauvegarder'}
            </button>
          </div>

          <button
            className={styles.cvCreationLogoutButton}
            onClick={logout}
            title="Se déconnecter"
          >
            <FaSignOutAlt />
            <span>Déconnexion</span>
          </button>
        </div>
        </div>
      </header>

      {/* Indicateur de progression */}
      <div className={styles.cvCreationProgress}>
        <div className={styles.cvCreationProgressBar}>
          <div
            className={styles.cvCreationProgressFill}
            style={{ width: '66%' }}
          ></div>
        </div>
        <div className={styles.cvCreationProgressSteps}>
          <span className={styles.cvCreationStep + ' ' + styles.cvCreationStepCompleted}>
            <FaCheck />
            Modèle choisi
          </span>
          <span className={styles.cvCreationStep + ' ' + styles.cvCreationStepActive}>
            <FaEdit />
            Rédaction
          </span>
          <span className={styles.cvCreationStep + ' ' + styles.cvCreationStepNext}>
            <FaDownload />
            Téléchargement
          </span>
        </div>
      </div>

      {/* Contenu principal */}
      <main className={styles.cvCreationMain}>
        <div className={styles.cvCreationLayout}>

          {/* Section formulaire */}
          <section className={styles.cvCreationFormSection}>
            <div className={styles.cvCreationFormContainer}>

              {/* En-tête du formulaire */}
              <div className={styles.cvCreationFormHeader}>
                <h1 className={styles.cvCreationFormTitle}>
                  Création de votre CV
                </h1>
                <p className={styles.cvCreationFormDescription}>
                  Remplissez soigneusement chaque section. Tous les champs marqués d'un <span className={styles.cvCreationRequired}>*</span> sont obligatoires.
                </p>

                {/* Statistiques rapides */}
                <div className={styles.cvCreationFormStats}>
                  <div className={styles.cvCreationStatItem}>
                    <span className={styles.cvCreationStatNumber}>
                      {cvData?.experiences?.length || 0}
                    </span>
                    <span className={styles.cvCreationStatLabel}>Expériences</span>
                  </div>
                  <div className={styles.cvCreationStatItem}>
                    <span className={styles.cvCreationStatNumber}>
                      {cvData?.education?.length || 0}
                    </span>
                    <span className={styles.cvCreationStatLabel}>Formations</span>
                  </div>
                  <div className={styles.cvCreationStatItem}>
                    <span className={styles.cvCreationStatNumber}>
                      {cvData?.skills?.length || 0}
                    </span>
                    <span className={styles.cvCreationStatLabel}>Compétences</span>
                  </div>
                </div>
              </div>

              {/* Formulaire principal */}
              <div className={styles.cvCreationFormContent}>
                <CVForm
                  cvData={cvData}
                  onDataChange={handleCvDataChange}
                />
              </div>

              {/* Actions du formulaire */}
              <div className={styles.cvCreationFormActions}>
                <button
                  className={styles.cvCreationPreviewButton}
                  onClick={() => setShowPreviewModal(true)}
                  type="button"
                >
                  <FaEye />
                  Aperçu du CV
                </button>
              </div>

            </div>
          </section>

        </div>
      </main>

      {/* Bouton d'aperçu flottant pour mobile */}
      <button
        className={styles.cvCreationFloatingPreview}
        onClick={() => setShowPreviewModal(true)}
        type="button"
        aria-label="Aperçu du CV"
      >
        <FaEye />
      </button>

      {/* Modal d'aperçu avancé */}
      <AnimatePresence>
        {showPreviewModal && (
          <motion.div
            className={styles.cvCreationPreviewOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPreviewModal(false)}
          >
            <motion.div
              className={styles.cvCreationPreviewModal}
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >

              {/* En-tête du modal d'aperçu */}
              <div className={styles.cvCreationPreviewHeader}>
                <div className={styles.cvCreationPreviewTitleSection}>
                  <h2 className={styles.cvCreationPreviewTitle}>
                    Aperçu en temps réel
                  </h2>
                  <div className={styles.cvCreationPreviewTemplateInfo}>
                    Template: <strong>{selectedTemplate}</strong>
                  </div>
                </div>

                <div className={styles.cvCreationPreviewControls}>

                  {/* Sélecteur de mode de visualisation */}
                  <div className={styles.cvCreationViewModeSelector}>
                    <button
                      className={`${styles.cvCreationViewModeButton} ${previewViewMode === 'desktop' ? styles.cvCreationViewModeActive : ''}`}
                      onClick={() => setPreviewViewMode('desktop')}
                      type="button"
                    >
                      Desktop
                    </button>
                    <button
                      className={`${styles.cvCreationViewModeButton} ${previewViewMode === 'mobile' ? styles.cvCreationViewModeActive : ''}`}
                      onClick={() => setPreviewViewMode('mobile')}
                      type="button"
                    >
                      Mobile
                    </button>
                    <button
                      className={`${styles.cvCreationViewModeButton} ${previewViewMode === 'print' ? styles.cvCreationViewModeActive : ''}`}
                      onClick={() => setPreviewViewMode('print')}
                      type="button"
                    >
                      Print
                    </button>
                  </div>

                  {/* Actions du modal */}
                  <div className={styles.cvCreationPreviewActions}>
                    <button
                      className={styles.cvCreationPreviewClose}
                      onClick={() => setShowPreviewModal(false)}
                      type="button"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              </div>

              {/* Contenu du modal d'aperçu */}
              <div className={styles.cvCreationPreviewContent}>

                {/* Zone d'affichage du CV */}
                <div className={`${styles.cvCreationPreviewDisplay} ${styles[`cvCreationPreviewDisplay${previewViewMode}`]}`}>
                  <div className={styles.cvCreationPreviewFrame}>
                    <CVPreview
                      cvData={cvData}
                      template={selectedTemplate}
                      mode={previewViewMode}
                    />
                  </div>
                </div>

                {/* Panneau latéral informatif */}
                <div className={styles.cvCreationPreviewSidebar}>

                  {/* Informations du template */}
                  <div className={styles.cvCreationPreviewInfoSection}>
                    <h3 className={styles.cvCreationPreviewInfoTitle}>
                      Détails du template
                    </h3>
                    <div className={styles.cvCreationPreviewDetails}>
                      <div className={styles.cvCreationPreviewDetailItem}>
                        <span className={styles.cvCreationPreviewDetailLabel}>Nom:</span>
                        <span className={styles.cvCreationPreviewDetailValue}>
                          {selectedTemplate}
                        </span>
                      </div>
                      <div className={styles.cvCreationPreviewDetailItem}>
                        <span className={styles.cvCreationPreviewDetailLabel}>Format:</span>
                        <span className={styles.cvCreationPreviewDetailValue}>
                          PDF A4 Professionnel
                        </span>
                      </div>
                      <div className={styles.cvCreationPreviewDetailItem}>
                        <span className={styles.cvCreationPreviewDetailLabel}>Prix:</span>
                        <span className={styles.cvCreationPreviewDetailValue + ' ' + styles.cvCreationPreviewPrice}>
                          1250 FCFA
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Conseils de validation */}
                  <div className={styles.cvCreationPreviewTipsSection}>
                    <h3 className={styles.cvCreationPreviewTipsTitle}>
                      Checklist de validation
                    </h3>
                    <ul className={styles.cvCreationPreviewTipsList}>
                      <li className={cvData.personalInfo.firstName ? styles.cvCreationPreviewTipValid : styles.cvCreationPreviewTipInvalid}>
                        {cvData.personalInfo.firstName ? '✓' : '○'} Informations personnelles
                      </li>
                      <li className={cvData.summary ? styles.cvCreationPreviewTipValid : styles.cvCreationPreviewTipInvalid}>
                        {cvData.summary ? '✓' : '○'} Résumé professionnel
                      </li>
                      <li className={(cvData?.experiences?.length || 0) > 0 ? styles.cvCreationPreviewTipValid : styles.cvCreationPreviewTipInvalid}>
                        {(cvData?.experiences?.length || 0) > 0 ? '✓' : '○'} Au moins une expérience
                      </li>
                      <li className={(cvData?.skills?.length || 0) > 0 ? styles.cvCreationPreviewTipValid : styles.cvCreationPreviewTipInvalid}>
                        {(cvData?.skills?.length || 0) > 0 ? '✓' : '○'} Compétences techniques
                      </li>
                    </ul>
                  </div>

                  {/* Appel à l'action */}
                  <button
                    className={styles.cvCreationPreviewDownloadCta}
                    onClick={() => {
                      setShowPreviewModal(false);
                      setShowPaymentModal(true);
                    }}
                    disabled={!cvData.personalInfo.firstName}
                    type="button"
                  >
                    <FaDownload />
                    Générer ce CV (1250 FCFA)
                  </button>

                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de confirmation de paiement */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className={styles.cvCreationPaymentOverlay}>
            <div className={styles.cvCreationPaymentModal}>

              <div className={styles.cvCreationPaymentHeader}>
                <h2 className={styles.cvCreationPaymentTitle}>
                  Confirmation de téléchargement
                </h2>
                <button
                  className={styles.cvCreationPaymentClose}
                  onClick={() => setShowPaymentModal(false)}
                  type="button"
                >
                  <FaTimes />
                </button>
              </div>

              <div className={styles.cvCreationPaymentContent}>
                <div className={styles.cvCreationPaymentSummary}>
                  <h3 className={styles.cvCreationPaymentSummaryTitle}>
                    Récapitulatif de commande
                  </h3>
                  <div className={styles.cvCreationPaymentDetails}>
                    <div className={styles.cvCreationPaymentDetailRow}>
                      <span>Template sélectionné:</span>
                      <span>{selectedTemplate}</span>
                    </div>
                    <div className={styles.cvCreationPaymentDetailRow}>
                      <span>Format de sortie:</span>
                      <span>PDF Haute Qualité</span>
                    </div>
                    <div className={styles.cvCreationPaymentDetailRow}>
                      <span>Utilisations:</span>
                      <span>Illimitées</span>
                    </div>
                    <div className={styles.cvCreationPaymentTotalRow}>
                      <span>Total à payer:</span>
                      <span className={styles.cvCreationPaymentTotalAmount}>
                        1250 FCFA
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.cvCreationPaymentSecurity}>
                  <FaShieldAlt />
                  <span>Paiement 100% sécurisé</span>
                </div>
              </div>

              <div className={styles.cvCreationPaymentActions}>
                <button
                  className={styles.cvCreationPaymentCancel}
                  onClick={() => setShowPaymentModal(false)}
                  type="button"
                >
                  Continuer l'édition
                </button>
                <button
                  className={styles.cvCreationPaymentConfirm}
                  onClick={processPaymentAndDownload}
                  type="button"
                >
                  <FaCreditCard />
                  Payer et Télécharger
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Overlay de traitement */}
      {(isProcessing || isLoading || isButtonLoading) && (
        <div className={styles.cvCreationProcessingOverlay}>
          <div className={styles.cvCreationProcessingModal}>
            <div className={styles.cvCreationProcessingSpinner}></div>
            <h3 className={styles.cvCreationProcessingTitle}>
              {isButtonLoading ? 'Navigation...' : isLoading ? 'Chargement...' : 'Génération en cours'}
            </h3>
            <p className={styles.cvCreationProcessingMessage}>
              {isButtonLoading ? 'Redirection en cours...' : isLoading ? 'Préparation de l\'interface...' : 'Préparation de votre CV professionnel...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVCreationPage;