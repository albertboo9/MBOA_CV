import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import apiService from '../services/api';
import LoadingOrbit from '../components/LoadingOrbit';
import { FaCreditCard, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import styles from './PaymentProcessingPage.module.css';

const PaymentProcessingPage = () => {
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [status, setStatus] = useState('processing'); // processing, success, failed
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser || !paymentId) {
      navigate('/login');
      return;
    }

    processPayment();
  }, [currentUser, paymentId, navigate]);

  const processPayment = async () => {
    try {
      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simuler succès/échec (90% de succès pour les tests)
      const success = Math.random() > 0.1;

      const response = await apiService.processPayment(paymentId, success);

      if (response.success) {
        setStatus('success');
        setPaymentData(response);
      } else {
        setStatus('failed');
        setError(response.reason || 'Payment failed');
      }
    } catch (err) {
      console.error('Payment processing error:', err);
      setStatus('failed');
      setError(err.message || 'Une erreur est survenue lors du traitement du paiement');
    }
  };

  const handleDownload = async () => {
    if (paymentData?.cvId && paymentData?.downloadCode) {
      try {
        console.log("🔄 Téléchargement avec code:", paymentData.downloadCode);
        
        // Utilisez le code de téléchargement
        const pdfBlob = await apiService.downloadCV(paymentData.cvId, 'modern', paymentData.downloadCode);
        
        // Créer le téléchargement
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `CV_${paymentData.cvId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
      } catch (error) {
        console.error('❌ Erreur de téléchargement:', error);
        alert('Erreur lors du téléchargement: ' + error.message);
      }
    }
  };

  const handleRetry = () => {
    navigate('/create-cv');
  };

  const handleGoHome = () => {
    navigate('/create-cv');
  };

  if (status === 'processing') {
    return (
      <div className={styles['payment-processing-page']}>
        <div className={styles['processing-container']}>
          <LoadingOrbit message="Traitement du paiement en cours..." size="large" />
          <div className={styles['processing-info']}>
            <FaCreditCard className={styles['payment-icon']} />
            <h2>Traitement du paiement</h2>
            <p>Veuillez patienter pendant que nous traitons votre paiement...</p>
            <div className={styles['payment-details']}>
              <p>ID de paiement: <strong>{paymentId}</strong></p>
              <p>Montant: <strong>500 FCFA</strong></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className={styles['payment-success-page']}>
        <div className={styles['success-container']}>
          <div className={styles['success-header']}>
            <FaCheckCircle className={styles['success-icon']} />
            <h1>Paiement réussi !</h1>
            <p>Votre CV est maintenant prêt à être téléchargé</p>
          </div>

          <div className={styles['success-details']}>
            <div className={styles['detail-card']}>
              <h3>Transaction réussie</h3>
              <div className={styles['transaction-info']}>
                <p><strong>ID de transaction:</strong> {paymentData?.transactionId}</p>
                <p><strong>Montant payé:</strong> 500 FCFA</p>
                <p><strong>Date:</strong> {new Date().toLocaleDateString('fr-FR')}</p>
              </div>
            </div>

            {paymentData?.downloadCode && (
              <div className={`${styles['detail-card']} ${styles['code-card']}`}>
                <h3>Code de téléchargement</h3>
                <p>Conservez ce code pour retélécharger votre CV plus tard :</p>
                <div className={styles['download-code']}>
                  <code>{paymentData.downloadCode}</code>
                  <button
                    onClick={() => navigator.clipboard.writeText(paymentData.downloadCode)}
                    className={styles['copy-btn']}
                  >
                    Copier
                  </button>
                </div>
                <p className={styles['code-note']}>
                  <small>Valable 1 an et 10 téléchargements maximum</small>
                </p>
              </div>
            )}
          </div>

          <div className={styles['success-actions']}>
            <button onClick={handleDownload} className={`${styles['btn-primary']} ${styles['download-btn']}`}>
              <FaCheckCircle />
              Télécharger mon CV
            </button>
            <button onClick={handleGoHome} className={styles['btn-secondary']}>
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className={styles['payment-failed-page']}>
        <div className={styles['failed-container']}>
          <div className={styles['failed-header']}>
            <FaTimesCircle className={styles['failed-icon']} />
            <h1>Paiement échoué</h1>
            <p>Une erreur est survenue lors du traitement de votre paiement</p>
          </div>

          <div className={styles['error-details']}>
            <div className={styles['error-message']}>
              <p><strong>Raison:</strong> {error}</p>
            </div>
            <div className={styles['payment-info']}>
              <p><strong>ID de paiement:</strong> {paymentId}</p>
              <p><strong>Montant:</strong> 500 FCFA</p>
            </div>
          </div>

          <div className={styles['failed-actions']}>
            <button onClick={handleRetry} className={styles['btn-primary']}>
              Réessayer
            </button>
            <button onClick={handleGoHome} className={styles['btn-secondary']}>
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentProcessingPage;