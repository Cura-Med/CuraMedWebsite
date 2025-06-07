import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBrain, FaShieldAlt, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';
import './SymptomCheckerPage.css';


const SymptomCheckerPage = () => {
  const [symptoms, setSymptoms] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [results, setResults] = useState(null);

  const handleSymptomChange = (e) => {
    setSymptoms(e.target.value);
  };

  const handleAnalyzeSymptoms = () => {
    if (!symptoms.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis process
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      
      // Mock results - in a real app, this would come from an API
      setResults({
        possibleConditions: [
          {
            name: 'Common Cold',
            probability: 'High',
            description: 'A viral infection of the upper respiratory tract.'
          },
          {
            name: 'Seasonal Allergies',
            probability: 'Medium',
            description: 'An immune system response to allergens like pollen or dust.'
          },
          {
            name: 'Migraine',
            probability: 'Low',
            description: 'A headache disorder characterized by recurrent headaches.'
          }
        ],
        recommendations: [
          'Rest and stay hydrated',
          'Over-the-counter pain relievers may help with symptoms',
          'If symptoms persist for more than 7 days, consult a healthcare professional'
        ]
      });
    }, 2000);
  };

  const resetAnalysis = () => {
    setSymptoms('');
    setAnalysisComplete(false);
    setResults(null);
  };

  const features = [
    {
      icon: <FaBrain />,
      title: 'AI-Powered Analysis',
      description: 'Advanced algorithms analyze your symptoms based on medical knowledge.'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Private & Secure',
      description: 'Your health information is protected with enterprise-grade security.'
    },
    {
      icon: <FaExclamationCircle />,
      title: 'Quick Results',
      description: 'Get instant insights about potential conditions and next steps.'
    }
  ];

  return (
    <div className="symptom-checker-page">
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">AI Symptom Checker</h1>
        </div>
      </section>
      
      <section className="section features-section">
        <div className="container">
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-box">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="section checker-section">
        <div className="container">
          {!analysisComplete ? (
            <div className="symptom-input-container">
              <h2 className="section-subtitle">Check Your Symptoms</h2>
              
              <div className="form-group">
                <label htmlFor="symptoms">Describe your symptoms</label>
                <textarea
                  id="symptoms"
                  className="form-control"
                  placeholder="Example: I've had a headache for the past 2 days and feel nauseous..."
                  value={symptoms}
                  onChange={handleSymptomChange}
                  rows="6"
                ></textarea>
              </div>
              
              <button 
                className="btn analyze-btn" 
                onClick={handleAnalyzeSymptoms}
                disabled={isAnalyzing || !symptoms.trim()}
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Symptoms'}
              </button>
            </div>
          ) : (
            <div className="analysis-results">
              <h2 className="section-subtitle">Analysis Results</h2>
              
              <div className="results-container">
                <h3>Possible Conditions</h3>
                <div className="conditions-list">
                  {results.possibleConditions.map((condition, index) => (
                    <div key={index} className="condition-item">
                      <div className="condition-header">
                        <h4>{condition.name}</h4>
                        <span className={`probability ${condition.probability.toLowerCase()}`}>
                          {condition.probability} probability
                        </span>
                      </div>
                      <p>{condition.description}</p>
                    </div>
                  ))}
                </div>
                
                <h3>Recommendations</h3>
                <ul className="recommendations-list">
                  {results.recommendations.map((recommendation, index) => (
                    <li key={index}>{recommendation}</li>
                  ))}
                </ul>
                
                <div className="disclaimer">
                  <p>
                    This analysis is based on the symptoms you provided and is for informational purposes only.
                    It is not a medical diagnosis.
                  </p>
                </div>
                
                <div className="results-actions">
                  <button className="btn" onClick={resetAnalysis}>Check Different Symptoms</button>
                  <Link to="/consultation" className="btn btn-primary">Book Consultation with a Doctor</Link>

                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      
      <section className="section notice-section">
        <div className="container">
          <div className="notice-container">
            <div className="notice-icon">
              <FaInfoCircle />
            </div>
            <div className="notice-content">
              <h3 className="notice-title">Important Notice</h3>
              <p className="notice-text">
                This symptom checker is for informational purposes only and should not replace professional medical
                advice. If you're experiencing severe symptoms or require immediate attention, please contact
                emergency services or visit your nearest healthcare facility.
              </p>
              <Link to="/consultation" className="btn consultation-btn">
                Book Consultation with a Doctor
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SymptomCheckerPage;
