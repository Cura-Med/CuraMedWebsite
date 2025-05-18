import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './FAQ.css';

const FAQ = ({ faqs }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleQuestion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      {faqs.map((faq, index) => (
        <div key={index} className="faq-item">
          <div 
            className="faq-question" 
            onClick={() => toggleQuestion(index)}
          >
            <h3>{faq.question}</h3>
            <span className="faq-icon">
              {activeIndex === index ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </div>
          
          {activeIndex === index && (
            <div className="faq-answer">
              <p>{faq.answer}</p>
            </div>
          )}
          
          <div className="faq-divider"></div>
        </div>
      ))}
    </div>
  );
};

export default FAQ;
