import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTimesCircle, FaRedo, FaHome, FaQuestionCircle } from 'react-icons/fa';
import styles from './PaymentFailedPage.module.css';

const PaymentFailedPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const reason = searchParams.get('reason') || 'unknown_error';
  const cvId = searchParams.get('cvId');

  const getErrorMessage = (reason) => {
    const messages = {
      'cancelled': {
        title: 'Paiement annulé',
        message: 'Vous avez annulé le paiement. Votre CV est sauvegardé et vous pouvez réessayer quand vous voulez.',
        icon: 'cancel'
      },
      'insufficient_funds': {
        title: 'Fonds insuffisants',
        message: 'Le solde de votre compte est insuffisant pour effectuer ce paiement.',
        icon: 'funds'
      },
      'network_error': {
        title: 'Erreur de connexion',
        message: 'Un problème de connexion a interrompu le paiement. Veuillez vérifier votre connexion internet.',
        icon: 'network'
      },
      'card_declined': {
        title: 'Carte refusée',
        message: 'Votre carte bancaire a été refusée. Vérifiez vos informations ou contactez votre banque.',
        icon: 'card'
      },
      'timeout': {
        title: 'Délai dépassé',
        message: 'Le paiement a pris trop de temps. Veuillez réessayer.',
        icon: 'timeout'
      },
      'unknown_error': {
        title: 'Erreur inattendue',
        message: 'Une erreur inattendue s\'est produite. Notre équipe a été notifiée.',
        icon: 'error'
      }
    };

    return messages[reason] || messages.unknown_error;
  };

  const errorInfo = getErrorMessage(reason);

  const handleRetry = () => {
    if (cvId) {
      navigate(`/create-cv?retry=${cvId}`);
    } else {
      navigate('/create-cv');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleSupport = () => {
    window.open('mailto:support@mboa-cv.com?subject=Problème de paiement', '_blank');
  };

  return (
    <div className={styles.paymentFailedPage}>
      <motion.div
        className={styles.paymentFailedContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Error Icon */}
        <motion.div
          className={styles.paymentFailedIcon}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <FaTimesCircle />
        </motion.div>

        {/* Title */}
        <motion.h1
          className={styles.paymentFailedTitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {errorInfo.title}
        </motion.h1>

        {/* Message */}
        <motion.p
          className={styles.paymentFailedMessage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {errorInfo.message}
        </motion.p>

        {/* CV Status */}
        <motion.div
          className={styles.paymentFailedStatus}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className={styles.paymentFailedStatusIcon}>
            <FaQuestionCircle />
          </div>
          <div className={styles.paymentFailedStatusText}>
            <h3>Votre CV est sauvegardé</h3>
            <p>Vous pouvez reprendre la création où vous vous êtes arrêté</p>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          className={styles.paymentFailedActions}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <button
            className={styles.paymentFailedPrimaryBtn}
            onClick={handleRetry}
          >
            <FaRedo />
            Réessayer le paiement
          </button>

          <div className={styles.paymentFailedSecondaryActions}>
            <button
              className={styles.paymentFailedSecondaryBtn}
              onClick={handleGoHome}
            >
              <FaHome />
              Retour à l'accueil
            </button>

            <button
              className={styles.paymentFailedSecondaryBtn}
              onClick={handleSupport}
            >
              <FaQuestionCircle />
              Support
            </button>
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div
          className={styles.paymentFailedHelp}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <h3>Pourquoi cela arrive-t-il ?</h3>
          <ul>
            <li>Vérifiez que votre connexion internet est stable</li>
            <li>Assurez-vous d'avoir suffisamment de fonds</li>
            <li>Vérifiez les informations de votre carte bancaire</li>
            <li>Contactez votre banque si le problème persiste</li>
          </ul>
        </motion.div>

        {/* Footer */}
        <motion.div
          className={styles.paymentFailedFooter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <p>
            Besoin d'aide ?{' '}
            <a href="mailto:support@mboa-cv.com" className={styles.paymentFailedLink}>
              Contactez notre support
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentFailedPage;