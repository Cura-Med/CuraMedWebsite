import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import FeaturesPage from './pages/FeaturesPage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SymptomCheckerPage from './pages/SymptomCheckerPage';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/symptom-checker" element={<SymptomCheckerPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

// src/App.jsx
/*
import React from 'react';
import VideoCall from './components/VideoCall';

function App() {
    return (
        <div className="App">
            <VideoCall />
        </div>
    );
}

export default App;*/
