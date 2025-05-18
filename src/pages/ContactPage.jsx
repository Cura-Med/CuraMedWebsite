import React from 'react';
import ContactForm from '../components/ContactForm';
import { FaEnvelope, FaPhone, FaComments } from 'react-icons/fa';
import './ContactPage.css';

const ContactPage = () => {
  const contactInfo = [
    {
      icon: <FaEnvelope />,
      title: 'Email',
      details: 'support@curamed.com'
    },
    {
      icon: <FaPhone />,
      title: 'Phone',
      details: '+1 (555) 123-4567'
    },
    {
      icon: <FaComments />,
      title: 'Live Chat',
      details: 'Available 24/7'
    }
  ];

  return (
    <div className="contact-page">
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Contact Us</h1>
        </div>
      </section>
      
      <section className="section contact-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2 className="contact-subtitle">Get in Touch</h2>
              
              <div className="info-cards">
                {contactInfo.map((info, index) => (
                  <div className="info-card" key={index}>
                    <div className="info-icon">{info.icon}</div>
                    <div className="info-content">
                      <h3 className="info-title">{info.title}</h3>
                      <p className="info-details">{info.details}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="social-links">
                <h3 className="social-title">Follow Us</h3>
                <div className="social-buttons">
                  <a href="#" className="social-link">Twitter</a>
                  <a href="#" className="social-link">LinkedIn</a>
                  <a href="#" className="social-link">Facebook</a>
                </div>
              </div>
            </div>
            
            <div className="contact-form-section">
              <h2 className="contact-subtitle">Send us a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
