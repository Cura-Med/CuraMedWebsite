import React from 'react';
import ServiceCard from '../components/ServiceCard';
import PricingCard from '../components/PricingCard';
import FAQ from '../components/FAQ';
import { 
  FaCalendarAlt, 
  FaPills, 
  FaHeartbeat, 
  FaUser, 
  FaFileAlt, 
  FaBuilding 
} from 'react-icons/fa';
import './ServicesPage.css';

const ServicesPage = () => {
  const services = [
    {
      icon: <FaCalendarAlt />,
      title: 'Virtual Consultations',
      description: 'Connect with healthcare providers through secure video calls.'
    },
    {
      icon: <FaPills />,
      title: 'E-Prescriptions',
      description: 'Receive and manage prescriptions electronically.'
    },
    {
      icon: <FaHeartbeat />,
      title: 'Chronic Care Management',
      description: 'Comprehensive care plans for chronic conditions.'
    },
    {
      icon: <FaUser />,
      title: 'Mental Health Support',
      description: 'Access to licensed therapists and counselors.'
    },
    {
      icon: <FaFileAlt />,
      title: 'Digital Health Records',
      description: 'Secure storage and access to your medical history.'
    },
    {
      icon: <FaBuilding />,
      title: 'Corporate Wellness',
      description: 'Health programs for organizations and employees.'
    }
  ];

  const pricingPlans = [
    {
      title: 'Basic',
      price: '29',
      features: [
        '24/7 Virtual Consultations',
        'E-Prescriptions',
        'Basic Health Monitoring',
        'Email Support'
      ]
    },
    {
      title: 'Premium',
      price: '59',
      features: [
        'All Basic Features',
        'Priority Appointments',
        'Mental Health Support',
        '24/7 Priority Support'
      ]
    },
    {
      title: 'Family',
      price: '99',
      features: [
        'All Premium Features',
        'Up to 4 Family Members',
        'Pediatric Care',
        'Family Health Dashboard'
      ]
    }
  ];

  const faqs = [
    {
      question: 'How do virtual consultations work?',
      answer: 'Virtual consultations are conducted through our secure video platform. Simply book an appointment, and you\'ll receive a link to join the video call at the scheduled time.'
    },
    {
      question: 'Are e-prescriptions legally valid?',
      answer: 'Yes, all e-prescriptions issued through CuraMed are legally valid and can be used at any pharmacy.'
    },
    {
      question: 'How secure is my health data?',
      answer: 'We use state-of-the-art encryption and security measures to protect your health data. We are fully GDPR compliant and follow strict privacy protocols.'
    },
    {
      question: 'Can I use my health insurance?',
      answer: 'Yes, we work with many major insurance providers. Contact your insurance company to verify coverage for telemedicine services.'
    }
  ];

  return (
    <div className="services-page">
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Our Services</h1>
        </div>
      </section>
      
      <section className="section services-section">
        <div className="container">
          <div className="services-grid">
            {services.map((service, index) => (
              <ServiceCard 
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
              />
            ))}
          </div>
        </div>
      </section>
      
      <section className="section pricing-section">
        <div className="container">
          <h2 className="section-title">Pricing Plans</h2>
          <div className="pricing-grid">
            {pricingPlans.map((plan, index) => (
              <PricingCard 
                key={index}
                title={plan.title}
                price={plan.price}
                features={plan.features}
              />
            ))}
          </div>
        </div>
      </section>
      
      <section className="section faq-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <FAQ faqs={faqs} />
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
