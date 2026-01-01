import React from 'react';
import { FaCheck } from 'react-icons/fa';
import './PricingCard.css';

const PricingCard = ({ title, price, features, onClick }) => {
  return (
    <div className="pricing-card">
      <h3 className="pricing-title">{title}</h3>
      <div className="pricing-price">€{price}/month</div>
      
      <ul className="pricing-features">
        {features.map((feature, index) => (
          <li key={index} className="pricing-feature">
            <FaCheck className="check-icon" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <button className="btn pricing-btn" onClick={onClick}>Choose Plan</button>
    </div>
  );
};

export default PricingCard;
