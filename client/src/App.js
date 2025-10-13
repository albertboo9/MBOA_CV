import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import LandingPage from './pages/LandingPage';
import TemplateSelectionPage from './pages/TemplateSelectionPage';
import CVCreationPage from './pages/CVCreationPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/templates" element={<TemplateSelectionPage />} />
            <Route path="/create-cv" element={<CVCreationPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
