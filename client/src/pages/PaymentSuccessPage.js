import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaDownload, FaShare, FaHome } from 'react-icons/fa';
import styles from './PaymentSuccessPage.module.css';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadCode, setDownloadCode] = useState('');

  const paymentId = searchParams.get('paymentId');
  const cvId = searchParams.get('cvId');

  useEffect(() => {
    // Simuler la récupération du code de téléchargement
    if (paymentId) {
      // En production, récupérer depuis l'API
      setDownloadCode(`CV-${paymentId.slice(-8).toUpperCase()}`);
    }
  }, [paymentId]);

  const handleDownload = async () => {
    if (!cvId) return;

    setIsDownloading(true);
    try {
      // Simuler le téléchargement
      await new Promise(resolve => setTimeout(resolve, 2000));

      // En production, appeler l'API de téléchargement
      alert('Téléchargement simulé réussi !');

    } catch (error) {
      console.error('Download error:', error);
      alert('Erreur lors du téléchargement');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Mon CV Professionnel',
        text: 'Découvrez mon CV créé avec MBOA-CV',
        url: window.location.origin
      });
    } else {
      // Fallback: copier le lien
      navigator.clipboard.writeText(window.location.origin);
      alert('Lien copié dans le presse-papiers !');
    }
  };

  return (
    <div className={styles.paymentSuccessPage}>
      <motion.div
        className={styles.paymentSuccessContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Success Icon */}
        <motion.div
          className={styles.paymentSuccessIcon}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <FaCheckCircle />
        </motion.div>

        {/* Title */}
        <motion.h1
          className={styles.paymentSuccessTitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Paiement réussi !
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className={styles.paymentSuccessSubtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          Votre CV professionnel a été généré avec succès
        </motion.p>

        {/* Download Code */}
        {downloadCode && (
          <motion.div
            className={styles.paymentSuccessCode}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <h3>Code de téléchargement</h3>
            <div className={styles.paymentSuccessCodeValue}>
              {downloadCode}
            </div>
            <p className={styles.paymentSuccessCodeNote}>
              Gardez ce code précieusement pour télécharger votre CV ultérieurement
            </p>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          className={styles.paymentSuccessActions}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <button
            className={styles.paymentSuccessPrimaryBtn}
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <div className={styles.paymentSuccessSpinner}></div>
                Téléchargement...
              </>
            ) : (
              <>
                <FaDownload />
                Télécharger mon CV
              </>
            )}
          </button>

          <div className={styles.paymentSuccessSecondaryActions}>
            <button
              className={styles.paymentSuccessSecondaryBtn}
              onClick={handleShare}
            >
              <FaShare />
              Partager
            </button>

            <button
              className={styles.paymentSuccessSecondaryBtn}
              onClick={() => navigate('/dashboard')}
            >
              <FaHome />
              Mon tableau de bord
            </button>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          className={styles.paymentSuccessInfo}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className={styles.paymentSuccessInfoItem}>
            <FaCheckCircle className={styles.paymentSuccessInfoIcon} />
            <span>CV généré en haute qualité PDF</span>
          </div>
          <div className={styles.paymentSuccessInfoItem}>
            <FaCheckCircle className={styles.paymentSuccessInfoIcon} />
            <span>Téléchargements illimités avec votre code</span>
          </div>
          <div className={styles.paymentSuccessInfoItem}>
            <FaCheckCircle className={styles.paymentSuccessInfoIcon} />
            <span>Support technique disponible</span>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className={styles.paymentSuccessFooter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <p>
            Un problème avec votre téléchargement ?{' '}
            <a href="mailto:support@mboa-cv.com" className={styles.paymentSuccessLink}>
              Contactez notre support
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccessPage;