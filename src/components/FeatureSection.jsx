import React from 'react';
import { FaMedkit, FaHeartbeat, FaStethoscope, FaUserMd } from 'react-icons/fa';
import './FeatureSection.css';

const features = [
  {
    icon: <FaMedkit />,
    title: 'Quality Equipment',
    description: 'We provide only the highest quality medical equipment that meets international standards.'
  },
  {
    icon: <FaHeartbeat />,
    title: 'Patient Care',
    description: 'Our products are designed to improve patient care and clinical outcomes.'
  },
  {
    icon: <FaStethoscope />,
    title: 'Professional Support',
    description: 'Our team of experts provides professional support and training for all our products.'
  },
  {
    icon: <FaUserMd />,
    title: 'Healthcare Solutions',
    description: 'We offer comprehensive healthcare solutions tailored to your specific needs.'
  }
];

const FeatureSection = () => {
  return (
    <section className="section feature-section">
      <div className="container">
        <h2 className="section-title">Why Choose Cura-Med</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
