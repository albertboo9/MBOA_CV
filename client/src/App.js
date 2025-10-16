import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import AuthGuard from './components/AuthGuard';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import TemplateSelectionPage from './pages/TemplateSelectionPage';
import CVCreationPage from './pages/CVCreationPage';
import PaymentProcessingPage from './pages/PaymentProcessingPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailedPage from './pages/PaymentFailedPage';
import UserDashboardPage from './pages/UserDashboardPage';
import LoadingOrbit from './components/LoadingOrbit';
import { FaPalette } from 'react-icons/fa';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Chargement en cours...");

  const showLoading = (message = "Chargement en cours...") => {
    setLoadingMessage(message);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
  };

  const handleTemplatesNavigation = () => {
    window.navigateWithUnsavedCheck('/templates');
  };

  // Global loading context
  useEffect(() => {
    window.showLoading = showLoading;
    window.hideLoading = hideLoading;
    window.navigateWithUnsavedCheck = (targetPath) => {
      try {
        const savedData = localStorage.getItem('cvData');
        if (savedData) {
          const cvData = JSON.parse(savedData);
          const hasUnsavedData = cvData && (
            cvData.personalInfo?.firstName || cvData.personalInfo?.lastName ||
            (cvData.experiences && cvData.experiences.length > 0) ||
            (cvData.education && cvData.education.length > 0) ||
            (cvData.skills && cvData.skills.length > 0) ||
            (cvData.languages && cvData.languages.length > 0) ||
            (cvData.hobbies && cvData.hobbies.length > 0) ||
            (cvData.projects && cvData.projects.length > 0) ||
            (cvData.customSections && cvData.customSections.length > 0) ||
            cvData.summary
          );

          if (hasUnsavedData) {
            const confirmed = window.confirm(
              "Vous avez des données non sauvegardées qui seront perdues. Voulez-vous continuer ?"
            );
            if (confirmed) {
              window.location.href = targetPath;
            }
            return;
          }
        }
      } catch (error) {
        console.error('Error checking unsaved data:', error);
      }
      window.location.href = targetPath;
    };

    return () => {
      delete window.showLoading;
      delete window.hideLoading;
      delete window.navigateWithUnsavedCheck;
    };
  }, []);

  // Nettoyer les fonctions dupliquées

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/templates"
              element={
                <AuthGuard>
                  <TemplateSelectionPage />
                </AuthGuard>
              }
            />
            <Route
              path="/create-cv"
              element={
                <AuthGuard>
                  <CVCreationPage />
                </AuthGuard>
              }
            />
            <Route
              path="/payment/process/:paymentId"
              element={
                <AuthGuard>
                  <PaymentProcessingPage />
                </AuthGuard>
              }
            />
            <Route
              path="/payment/success"
              element={
                <AuthGuard>
                  <PaymentSuccessPage />
                </AuthGuard>
              }
            />
            <Route
              path="/payment/failed"
              element={
                <AuthGuard>
                  <PaymentFailedPage />
                </AuthGuard>
              }
            />
            <Route
              path="/dashboard"
              element={
                <AuthGuard>
                  <UserDashboardPage />
                </AuthGuard>
              }
            />
          </Routes>

          {isLoading && (
            <LoadingOrbit message={loadingMessage} size="medium" />
          )}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
