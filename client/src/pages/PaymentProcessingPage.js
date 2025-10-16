import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import apiService from '../services/api';
import LoadingOrbit from '../components/LoadingOrbit';
import { FaCreditCard, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './PaymentProcessingPage.module.css';

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

  const handleDownload = () => {
    if (paymentData?.cvId) {
      window.open(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/cv/${paymentData.cvId}/download`, '_blank');
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
      <div className="payment-processing-page">
        <div className="processing-container">
          <LoadingOrbit message="Traitement du paiement en cours..." size="large" />
          <div className="processing-info">
            <FaCreditCard className="payment-icon" />
            <h2>Traitement du paiement</h2>
            <p>Veuillez patienter pendant que nous traitons votre paiement...</p>
            <div className="payment-details">
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
      <div className="payment-success-page">
        <div className="success-container">
          <div className="success-header">
            <FaCheckCircle className="success-icon" />
            <h1>Paiement réussi !</h1>
            <p>Votre CV est maintenant prêt à être téléchargé</p>
          </div>

          <div className="success-details">
            <div className="detail-card">
              <h3>Transaction réussie</h3>
              <div className="transaction-info">
                <p><strong>ID de transaction:</strong> {paymentData?.transactionId}</p>
                <p><strong>Montant payé:</strong> 500 FCFA</p>
                <p><strong>Date:</strong> {new Date().toLocaleDateString('fr-FR')}</p>
              </div>
            </div>

            {paymentData?.downloadCode && (
              <div className="detail-card code-card">
                <h3>Code de téléchargement</h3>
                <p>Conservez ce code pour retélécharger votre CV plus tard :</p>
                <div className="download-code">
                  <code>{paymentData.downloadCode}</code>
                  <button
                    onClick={() => navigator.clipboard.writeText(paymentData.downloadCode)}
                    className="copy-btn"
                  >
                    Copier
                  </button>
                </div>
                <p className="code-note">
                  <small>Valable 1 an et 10 téléchargements maximum</small>
                </p>
              </div>
            )}
          </div>

          <div className="success-actions">
            <button onClick={handleDownload} className="btn-primary download-btn">
              <FaCheckCircle />
              Télécharger mon CV
            </button>
            <button onClick={handleGoHome} className="btn-secondary">
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="payment-failed-page">
        <div className="failed-container">
          <div className="failed-header">
            <FaTimesCircle className="failed-icon" />
            <h1>Paiement échoué</h1>
            <p>Une erreur est survenue lors du traitement de votre paiement</p>
          </div>

          <div className="error-details">
            <div className="error-message">
              <p><strong>Raison:</strong> {error}</p>
            </div>
            <div className="payment-info">
              <p><strong>ID de paiement:</strong> {paymentId}</p>
              <p><strong>Montant:</strong> 500 FCFA</p>
            </div>
          </div>

          <div className="failed-actions">
            <button onClick={handleRetry} className="btn-primary">
              Réessayer
            </button>
            <button onClick={handleGoHome} className="btn-secondary">
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