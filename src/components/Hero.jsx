import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {

  return (
    <section className="hero">
      <div className="container hero-container">
        <div className="badge-container">
          <span className="badge">Healthcare Reimagined</span>
        </div>
        
        <h1 className="hero-title">Your Health, Anywhere, Anytime</h1>
        
        <p className="hero-description">
          Experience the future of healthcare with 24/7 access to medical professionals, AI-powered
          diagnostics, and seamless virtual consultations.
        </p>
        
        <div className="hero-buttons">
          <Link to="/consultation" className="btn btn-primary">Book Consultation</Link>
          <Link to="/symptom-checker" className="btn btn-outline">Try AI Symptom Checker</Link>
          <Link to="/video-test" className="btn btn-outline">Video Test</Link>
          <Link to="/video-test-joiner" className="btn btn-outline">Join Video</Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
