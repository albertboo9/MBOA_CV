import React, { useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaGoogle, FaShieldAlt, FaLock, FaUserCheck } from 'react-icons/fa';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const { currentUser, signInWithGoogle, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Rediriger si déjà connecté
  useEffect(() => {
    if (currentUser && !loading) {
      const from = location.state?.from?.pathname || '/templates';
      navigate(from, { replace: true });
    }
  }, [currentUser, loading, navigate, location]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // La redirection se fera automatiquement via useEffect
    } catch (error) {
      console.error('Erreur de connexion:', error);
      alert('Erreur lors de la connexion. Veuillez réessayer.');
    }
  };

  if (loading) {
    return (
      <div className={styles.loginLoading}>
        <div className={styles.loginLoadingSpinner}></div>
        <p>Connexion en cours...</p>
      </div>
    );
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>

        {/* En-tête */}
        <div className={styles.loginHeader}>
          <div className={styles.loginLogo}>
            <span className={styles.loginLogoText}>MBOA</span>
            <span className={styles.loginLogoAccent}>CV</span>
          </div>
          <h1 className={styles.loginTitle}>
            Connexion Requise
          </h1>
          <p className={styles.loginSubtitle}>
            Connectez-vous pour créer votre CV professionnel
          </p>
        </div>

        {/* Contenu principal */}
        <div className={styles.loginContent}>

          {/* Bouton de connexion Google */}
          <div className={styles.loginGoogleSection}>
            <button
              className={styles.loginGoogleButton}
              onClick={handleGoogleSignIn}
              type="button"
            >
              <FaGoogle className={styles.loginGoogleIcon} />
              <span>Continuer avec Google</span>
            </button>
            <p className={styles.loginGoogleHelp}>
              Connexion rapide et sécurisée
            </p>
          </div>

          {/* Avantages de la connexion */}
          <div className={styles.loginBenefits}>
            <h3 className={styles.loginBenefitsTitle}>
              Avantages de la connexion
            </h3>
            <div className={styles.loginBenefitsGrid}>
              <div className={styles.loginBenefitItem}>
                <FaShieldAlt className={styles.loginBenefitIcon} />
                <div className={styles.loginBenefitContent}>
                  <h4>Sécurité</h4>
                  <p>Vos données sont protégées</p>
                </div>
              </div>
              <div className={styles.loginBenefitItem}>
                <FaLock className={styles.loginBenefitIcon} />
                <div className={styles.loginBenefitContent}>
                  <h4>Sauvegarde</h4>
                  <p>Accès à vos CV partout</p>
                </div>
              </div>
              <div className={styles.loginBenefitItem}>
                <FaUserCheck className={styles.loginBenefitIcon} />
                <div className={styles.loginBenefitContent}>
                  <h4>Personnalisé</h4>
                  <p>Expérience adaptée à vos besoins</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Pied de page */}
        <div className={styles.loginFooter}>
          <p className={styles.loginFooterText}>
            En vous connectant, vous acceptez nos{' '}
            <a href="#" className={styles.loginFooterLink}>Conditions d'utilisation</a>
            {' '}et notre{' '}
            <a href="#" className={styles.loginFooterLink}>Politique de confidentialité</a>
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;