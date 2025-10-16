import React, { useState } from 'react';
import { FaCreditCard, FaShieldAlt, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import styles from './PaymentModal.module.css';

const PaymentModal = ({ isOpen, onClose, onConfirm, cvData, isProcessing }) => {
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm(cvData);
    } catch (error) {
      console.error('Payment confirmation error:', error);
    } finally {
      setIsConfirming(false);
    }
  };

  const totalAmount = 1250; // Prix fixe en FCFA

  return (
    <div className={styles.paymentModalOverlay}>
      <div className={styles.paymentModal}>
        {/* Header */}
        <div className={styles.paymentModalHeader}>
          <div className={styles.paymentModalIcon}>
            <FaCreditCard />
          </div>
          <h2 className={styles.paymentModalTitle}>
            Confirmation de paiement
          </h2>
          <button
            className={styles.paymentModalClose}
            onClick={onClose}
            disabled={isProcessing || isConfirming}
            type="button"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className={styles.paymentModalContent}>
          {/* Order Summary */}
          <div className={styles.paymentOrderSummary}>
            <h3 className={styles.paymentOrderTitle}>
              Récapitulatif de commande
            </h3>

            <div className={styles.paymentOrderDetails}>
              <div className={styles.paymentOrderItem}>
                <div className={styles.paymentOrderItemInfo}>
                  <span className={styles.paymentOrderItemName}>
                    CV Professionnel PDF
                  </span>
                  <span className={styles.paymentOrderItemDesc}>
                    Template professionnel haute qualité
                  </span>
                </div>
                <span className={styles.paymentOrderItemPrice}>
                  {totalAmount.toLocaleString()} FCFA
                </span>
              </div>

              <div className={styles.paymentOrderDivider}></div>

              <div className={styles.paymentOrderTotal}>
                <span className={styles.paymentOrderTotalLabel}>
                  Total à payer
                </span>
                <span className={styles.paymentOrderTotalAmount}>
                  {totalAmount.toLocaleString()} FCFA
                </span>
              </div>
            </div>
          </div>

          {/* CV Preview */}
          <div className={styles.paymentCVPreview}>
            <h4 className={styles.paymentCVPreviewTitle}>
              Aperçu de votre CV
            </h4>
            <div className={styles.paymentCVPreviewCard}>
              <div className={styles.paymentCVPreviewHeader}>
                <div className={styles.paymentCVPreviewAvatar}>
                  {cvData?.personalInfo?.firstName?.[0]}{cvData?.personalInfo?.lastName?.[0]}
                </div>
                <div className={styles.paymentCVPreviewInfo}>
                  <h5 className={styles.paymentCVPreviewName}>
                    {cvData?.personalInfo?.firstName} {cvData?.personalInfo?.lastName}
                  </h5>
                  <p className={styles.paymentCVPreviewEmail}>
                    {cvData?.personalInfo?.email}
                  </p>
                </div>
              </div>

              <div className={styles.paymentCVPreviewStats}>
                <div className={styles.paymentCVPreviewStat}>
                  <span className={styles.paymentCVPreviewStatNumber}>
                    {cvData?.experiences?.length || 0}
                  </span>
                  <span className={styles.paymentCVPreviewStatLabel}>
                    Expériences
                  </span>
                </div>
                <div className={styles.paymentCVPreviewStat}>
                  <span className={styles.paymentCVPreviewStatNumber}>
                    {cvData?.education?.length || 0}
                  </span>
                  <span className={styles.paymentCVPreviewStatLabel}>
                    Formations
                  </span>
                </div>
                <div className={styles.paymentCVPreviewStat}>
                  <span className={styles.paymentCVPreviewStatNumber}>
                    {cvData?.skills?.length || 0}
                  </span>
                  <span className={styles.paymentCVPreviewStatLabel}>
                    Compétences
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className={styles.paymentSecurityNotice}>
            <FaShieldAlt className={styles.paymentSecurityIcon} />
            <div className={styles.paymentSecurityContent}>
              <h4 className={styles.paymentSecurityTitle}>
                Paiement 100% sécurisé
              </h4>
              <p className={styles.paymentSecurityText}>
                Vos données bancaires sont protégées par un cryptage SSL 256 bits.
                Nous n'enregistrons jamais vos informations de paiement.
              </p>
            </div>
          </div>

          {/* Terms */}
          <div className={styles.paymentTerms}>
            <p className={styles.paymentTermsText}>
              En procédant au paiement, vous acceptez nos{' '}
              <a href="#" className={styles.paymentTermsLink}>
                conditions générales
              </a>{' '}
              et notre{' '}
              <a href="#" className={styles.paymentTermsLink}>
                politique de confidentialité
              </a>.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.paymentModalActions}>
          <button
            className={styles.paymentModalCancel}
            onClick={onClose}
            disabled={isProcessing || isConfirming}
            type="button"
          >
            <FaTimes />
            Annuler
          </button>

          <button
            className={styles.paymentModalConfirm}
            onClick={handleConfirm}
            disabled={isProcessing || isConfirming}
            type="button"
          >
            {isConfirming ? (
              <>
                <FaSpinner className={styles.paymentModalSpinner} />
                Traitement...
              </>
            ) : (
              <>
                <FaCheck />
                Payer {totalAmount.toLocaleString()} FCFA
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;