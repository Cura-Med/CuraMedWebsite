import React from 'react';
import FeatureCard from '../components/FeatureCard';
import { 
  FaClock, 
  FaGlobe, 
  FaCalendarAlt, 
  FaBluetooth, 
  FaCommentDots, 
  FaFileAlt,
  FaShieldAlt
} from 'react-icons/fa';
import './FeaturesPage.css';

const FeaturesPage = () => {
  const features = [
    {
      icon: <FaClock />,
      title: '24/7 Healthcare Access',
      description: 'Access medical care anytime, anywhere with our round-the-clock service.'
    },
    {
      icon: <FaGlobe />,
      title: 'Multilingual Support',
      description: 'Break language barriers with real-time translation in multiple languages.'
    },
    {
      icon: <FaCalendarAlt />,
      title: 'Instant Booking',
      description: 'Book appointments with healthcare providers in just a few clicks.'
    },
    {
      icon: <FaBluetooth />,
      title: 'Wearable Integration',
      description: 'Connect your health devices for real-time monitoring and insights.'
    },
    {
      icon: <FaCommentDots />,
      title: 'AI-Powered Chat',
      description: 'Get instant responses to health queries through our AI system.'
    },
    {
      icon: <FaFileAlt />,
      title: 'Digital Health Records',
      description: 'Access and manage your medical records securely online.'
    }
  ];

  const testimonials = [
    {
      quote: 'CuraMed has transformed how I manage my healthcare. The 24/7 access is invaluable.',
      name: 'Sarah Johnson',
      role: 'Patient'
    },
    {
      quote: 'The integration with wearables helps me monitor my patients more effectively.',
      name: 'Dr. Michael Chen',
      role: 'Healthcare Provider'
    },
    {
      quote: 'The multilingual support made it possible for my elderly parents to get care in their native language.',
      name: 'David Kim',
      role: 'Family Member'
    }
  ];

  return (
    <div className="features-page">
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Our Features</h1>
        </div>
      </section>
      
      <section className="section features-section">
        <div className="container">
          <div className="features-grid">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>
      
      <section className="section security-section">
        <div className="container">
          <h2 className="section-title">Security & Privacy</h2>
          <div className="security-content">
            <div className="security-icon">
              <FaShieldAlt />
            </div>
            <p className="security-text">
              Your health data is protected by state-of-the-art encryption and security measures. We are
              fully GDPR compliant and take your privacy seriously.
            </p>
          </div>
        </div>
      </section>
      
      <section className="section testimonials-section">
        <div className="container">
          <h2 className="section-title">What Our Users Say</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <p className="testimonial-quote">{testimonial.quote}</p>
                <div className="testimonial-author">
                  <h3 className="author-name">{testimonial.name}</h3>
                  <p className="author-role">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
