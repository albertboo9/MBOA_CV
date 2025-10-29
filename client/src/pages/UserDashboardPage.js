import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { FaDownload, FaCopy, FaCalendarAlt, FaFilePdf, FaUser, FaSignOutAlt } from 'react-icons/fa';
import styles from './UserDashboardPage.module.css';

const UserDashboardPage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [downloadCodes, setDownloadCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    loadUserData();
  }, [currentUser, navigate]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUserDownloadCodes();
      setDownloadCodes(response.downloadCodes || []);
    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (code) => {
    try {
      // Valider le code et obtenir les informations du CV
      const validationResult = await apiService.validateDownloadCode(code);

      // Ouvrir le téléchargement dans un nouvel onglet
      const downloadUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/cv/${validationResult.cvId}/download?code=${code}`;
      window.open(downloadUrl, '_blank');

      // Recharger les données pour mettre à jour les compteurs
      await loadUserData();
    } catch (err) {
      console.error('Download error:', err);
      alert('Erreur lors du téléchargement: ' + err.message);
    }
  };

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopySuccess(code);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Copy error:', err);
      alert('Erreur lors de la copie');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={styles['dashboard-loading']}>
        <div className={styles['loading-spinner']}></div>
        <p>Chargement de votre espace personnel...</p>
      </div>
    );
  }

  return (
    <div className={styles['user-dashboard']}>
      {/* Header */}
      <header className={styles['dashboard-header']}>
        <div className={styles['header-content']}>
          <div className={styles['user-info']}>
            <FaUser className={styles['user-icon']} />
            <div>
              <h1>Espace Personnel</h1>
              <p>{currentUser?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className={styles['logout-btn']}>
            <FaSignOutAlt />
            Déconnexion
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles['dashboard-content']}>
        <div className={styles['dashboard-intro']}>
          <h2>Mes CV et Codes de Téléchargement</h2>
          <p>
            Ici, vous pouvez consulter tous vos codes de téléchargement actifs
            et retélécharger vos CV précédemment achetés.
          </p>
        </div>

        {error && (
          <div className={styles['error-message']}>
            <p>{error}</p>
          </div>
        )}

        {/* Download Codes Section */}
        <section className={styles['download-codes-section']}>
          <h3>
            <FaFilePdf />
            Codes de Téléchargement ({downloadCodes.length})
          </h3>

          {downloadCodes.length === 0 ? (
            <div className={styles['empty-state']}>
              <FaFilePdf className={styles['empty-icon']} />
              <h4>Aucun code de téléchargement</h4>
              <p>Vous n'avez pas encore acheté de CV ou tous vos codes ont expiré.</p>
              <button
                onClick={() => navigate('/templates')}
                className={styles['create-cv-btn']}
              >
                Créer un nouveau CV
              </button>
            </div>
          ) : (
            <div className={styles['codes-grid']}>
              {downloadCodes.map((codeData) => (
                <div key={codeData.code} className={styles['code-card']}>
                  <div className={styles['code-header']}>
                    <div className={styles['code-display']}>
                      <code>{codeData.code}</code>
                      <button
                        onClick={() => handleCopyCode(codeData.code)}
                        className={`${styles['copy-btn']} ${copySuccess === codeData.code ? styles['success'] : ''}`}
                        title="Copier le code"
                      >
                        <FaCopy />
                        {copySuccess === codeData.code && <span>Copié !</span>}
                      </button>
                    </div>
                    <div className={styles['code-status']}>
                      {codeData.isExpired ? (
                        <span className={`${styles['status']} ${styles['expired']}`}>Expiré</span>
                      ) : (
                        <span className={`${styles['status']} ${styles['active']}`}>Actif</span>
                      )}
                    </div>
                  </div>

                  <div className={styles['code-details']}>
                    <div className={styles['detail-row']}>
                      <FaCalendarAlt className={styles['detail-icon']} />
                      <span>Créé le {formatDate(codeData.createdAt)}</span>
                    </div>
                    <div className={styles['detail-row']}>
                      <span>Expire le {formatDate(codeData.expiresAt)}</span>
                    </div>
                    <div className={styles['detail-row']}>
                      <span>
                        Téléchargements restants: {codeData.downloadsRemaining}/{codeData.maxDownloads}
                      </span>
                    </div>
                  </div>

                  <div className={styles['code-actions']}>
                    <button
                      onClick={() => handleDownload(codeData.code)}
                      className={styles['download-btn']}
                      disabled={codeData.isExpired || codeData.downloadsRemaining === 0}
                    >
                      <FaDownload />
                      Télécharger
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className={styles['quick-actions']}>
          <h3>Actions Rapides</h3>
          <div className={styles['actions-grid']}>
            <button
              onClick={() => navigate('/templates')}
              className={`${styles['action-btn']} ${styles['create']}`}
            >
              <FaFilePdf />
              Créer un nouveau CV
            </button>
            <button
              onClick={() => navigate('/')}
              className={`${styles['action-btn']} ${styles['home']}`}
            >
              <FaUser />
              Retour à l'accueil
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserDashboardPage;