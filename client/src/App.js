import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import LandingPage from './pages/LandingPage';
import TemplateSelectionPage from './pages/TemplateSelectionPage';
import CVCreationPage from './pages/CVCreationPage';
import LoadingOrbit from './components/LoadingOrbit';
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

  // Global loading context
  useEffect(() => {
    window.showLoading = showLoading;
    window.hideLoading = hideLoading;

    return () => {
      delete window.showLoading;
      delete window.hideLoading;
    };
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/templates" element={<TemplateSelectionPage />} />
            <Route path="/create-cv" element={<CVCreationPage />} />
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
