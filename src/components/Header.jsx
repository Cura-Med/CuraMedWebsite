import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Header.css';
import AuthModal from './AuthModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          CuraMed
        </Link>
        
        <div className="menu-icon" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
        
        <nav className={`nav ${isMenuOpen ? 'active' : ''}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink to="/features" className={({isActive}) => isActive ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
                Features
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/services" className={({isActive}) => isActive ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
                Services
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/about" className={({isActive}) => isActive ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/contact" className={({isActive}) => isActive ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>
        
        <button className="sign-in-btn" onClick={openAuthModal}>
          Sign in
        </button>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </header>
  );
};

export default Header;
