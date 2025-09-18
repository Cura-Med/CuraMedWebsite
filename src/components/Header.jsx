import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {FaBars, FaRegUser, FaTimes } from 'react-icons/fa';
import './Header.css';
import { useDispatch, useSelector } from 'react-redux';
import { openAuthModal } from '../features/modal/modalSlice';
import { logout } from '../features/auth/authSlice';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const toggleUserMenu = () => setUserMenuOpen(v => !v);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/";
  };

  const handleResize = () => {
    setUserMenuOpen(false)
  }

  window.addEventListener("resize", handleResize);


  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          CuraMed
        </Link>

        <div style={{flex: 1}}/>
        
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




            {accessToken ? (
                <div className="nav-item hide-from-wide" onClick={handleLogout}>
                  <a>Logout</a>
                </div>
            ) : (
                <div className="nav-item hide-from-wide"  onClick={() => dispatch(openAuthModal())}>
                  <a>Sign in</a>
                </div>
            )}
            <div className="nav-item hide-from-wide">
              <a>Dashboard</a>
            </div>




            <li className="nav-item the-user-icon" style={{cursor: 'pointer'}} onClick={toggleUserMenu}>
              <FaRegUser />
            </li>

          </ul>
        </nav>


        <div className={`user-nav ${userMenuOpen ? 'active' : ''}`} id="user-div">
          {accessToken ? (
                <div className="nav-item user-nav-item" onClick={handleLogout} id='user-inner-div-1'>
                  <a>Logout</a>
                </div>
          ) : (
                <div className="nav-item user-nav-item"  onClick={() => dispatch(openAuthModal())} id='user-inner-div-2'>
                  <a>Sign in</a>
                </div>
          )}
          <div className="nav-item user-nav-item" id='user-inner-div-3' style={{borderTop: 'solid 1px rgba(0, 0, 0, 0.05)'}}>
            <a>Dashboard</a>
          </div>
        </div>


        <div style={{minWidth: '42px'}} />


        <div className="menu-icon" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>

    </header>
  );
};

export default Header;
