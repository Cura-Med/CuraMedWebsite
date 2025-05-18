import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-column">
          <Link to="/" className="footer-logo">
            CuraMed
          </Link>
          <p className="footer-description">
            Healthcare reimagined for the digital age. Access medical professionals anytime, anywhere.
          </p>
        </div>
        
        <div className="footer-column">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/features">Features</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h3 className="footer-title">Legal</h3>
          <ul className="footer-links">
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/cookies">Cookie Policy</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="copyright">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} CuraMed. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
