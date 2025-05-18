import React from 'react';
import Hero from '../components/Hero';
import FeatureCard from '../components/FeatureCard';
import { FaClock, FaGlobe, FaCalendarAlt } from 'react-icons/fa';
import './HomePage.css';

const HomePage = () => {
  const features = [
    {
      icon: <FaClock />,
      title: '24/7 Care',
      description: 'Access medical professionals around the clock'
    },
    {
      icon: <FaGlobe />,
      title: 'Global Access',
      description: 'Connect from anywhere with multilingual support'
    },
    {
      icon: <FaCalendarAlt />,
      title: 'Instant Booking',
      description: 'Schedule appointments with just a few clicks'
    }
  ];

  return (
    <div className="home-page">
      <Hero />
      
      <section className="section features-overview">
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
    </div>
  );
};

export default HomePage;
