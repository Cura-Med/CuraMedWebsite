import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  const milestones = [
    {
      year: '2023',
      event: 'CuraMed founded by Dr. Jenny Smith'
    },
    {
      year: '2023',
      event: 'Launched AI-powered symptom checker'
    },
    {
      year: '2024',
      event: 'Expanded to multiple countries'
    },
    {
      year: '2024',
      event: 'Introduced real-time translation support'
    }
  ];

  return (
    <div className="about-page">
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">About CuraMed</h1>
        </div>
      </section>
      
      <section className="section mission-section">
        <div className="container">
          <h2 className="section-subtitle">Our Mission</h2>
          <div className="mission-content">
            <p className="mission-text">
              At CuraMed, we're on a mission to make healthcare accessible to everyone, anywhere, at any
              time. We believe that quality healthcare should not be limited by location, language, or
              traditional office hours.
            </p>
            <p className="mission-text">
              Through innovative technology and a commitment to excellence, we're building the future of
              healthcare delivery - one that's more convenient, more efficient, and more patient-centered
              than ever before.
            </p>
          </div>
        </div>
      </section>
      
      <section className="section story-section">
        <div className="container">
          <div className="story-container">
            <div className="story-content">
              <h2 className="section-subtitle">Our Story</h2>
              <p className="story-text">
                Founded in 2023 by Dr. Jenny Smith, CuraMed emerged from a simple
                observation: healthcare needed to evolve to meet the needs of our increasingly
                connected world.
              </p>
              <p className="story-text">
                What started as a small telemedicine platform has grown into a comprehensive
                healthcare solution, serving patients and providers across multiple countries.
              </p>
            </div>
            
            <div className="milestones-container">
              <h3 className="milestones-title">Key Milestones</h3>
              <ul className="milestones-list">
                {milestones.map((milestone, index) => (
                  <li key={index} className="milestone-item">
                    <span className="milestone-year">{milestone.year}</span>
                    <span className="milestone-event">{milestone.event}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
