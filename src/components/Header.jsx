// src/components/Header.jsx
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Header.css';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { openAuthModal } from '../features/modal/modalSlice';
import { logout } from '../features/auth/authSlice';
import HeaderIdentityBox from "./molecules/HeaderIdentityBox.jsx";
import { useNavigate } from 'react-router-dom';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Select ONLY primitives (no user object refs)
  const { isLoggedIn, isDoctor, authReady } = useSelector(
      s => ({
        isLoggedIn: Boolean(s.auth.accessToken),
        isDoctor: Boolean(s.auth.user?.isDoctor),
        authReady: s.auth.status === 'succeeded' || s.auth.status === 'failed',
      }),
      shallowEqual
  );

  // LOCAL UI STATE
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const rootRef = useRef(null);


  // EFFECTS
  useEffect(() => {
    const onResize = () => {
      setIsMenuOpen(false);
      setUserMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) {
        setIsMenuOpen(false);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('pointerdown', onDocClick);
    return () => document.removeEventListener('pointerdown', onDocClick);
  }, []);


  // HANDLERS (stable via useCallback)
  const toggleMenu = useCallback(() => setIsMenuOpen(v => !v), []);
  const toggleUserMenu = useCallback(() => setUserMenuOpen(v => !v), []);
  const signInClick = useCallback(() => dispatch(openAuthModal()), [dispatch]);

  const openSettings = useCallback(() => {
    navigate(isDoctor ? '/doctor-settings' : '/settings');
  }, [navigate, isDoctor]);

  const openDashboard = useCallback(() => {
    navigate(isDoctor ? '/doctor-dashboard' : '/dashboard');
  }, [navigate, isDoctor]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate('/');
  }, [dispatch, navigate]);

  const naviFeatures = useCallback(() => {
    navigate('/features')
  }, [navigate])
  const naviServices = useCallback(() => {
    navigate('/services')
  }, [navigate])
  const naviAbout = useCallback(() => {
    navigate('/about')
  }, [navigate])
  const naviContact = useCallback(() => {
    navigate('/contact')
  }, [navigate])

  return (
      <header className="header" ref={rootRef}>
        <div className="container header-container">
          <h2>CuraMed</h2>
          <div style={{ flex: 1 }} />

          {isMenuOpen && (
              <nav className="nav active">
                <ul className="nav-list">
                  <li className="nav-item" onClick={naviFeatures}><span>Features</span></li>
                  <li className="nav-item" onClick={naviServices}><span>Services</span></li>
                  <li className="nav-item" onClick={naviAbout}><span>About</span></li>
                  <li className="nav-item" onClick={naviContact}><span>Contact</span></li>

                  {!isLoggedIn ? (
                      <li className="nav-item" onClick={signInClick}>
                        <span className="no-bottom-border">Sign in</span>
                      </li>
                  ) : (
                      <>
                        <li className="nav-item" onClick={() => { setIsMenuOpen(false); handleLogout(); }}>
                          <span>Logout</span>
                        </li>
                        <li className="nav-item" onClick={() => { setIsMenuOpen(false); openDashboard(); }}>
                          <span>{isDoctor ? 'Doctor Dashboard' : 'Dashboard'}</span>
                        </li>
                        <li className="nav-item" onClick={() => { setIsMenuOpen(false); openSettings(); }}>
                          <span className="no-bottom-border">Settings</span>
                        </li>
                      </>
                  )}
                </ul>
              </nav>
          )}

          {!isMenuOpen && (
              <nav className="temp-hidden-fix nav">
                <ul className="nav-list">
                  <div style={{ flex: 1 }} />
                  <li className="nav-item top-line-item" onClick={naviFeatures}><span>Features</span></li>
                  <li className="nav-item top-line-item" onClick={naviServices}><span>Services</span></li>
                  <li className="nav-item top-line-item" onClick={naviAbout}><span>About</span></li>
                  <li className="nav-item top-line-item" onClick={naviContact}><span>Contact</span></li>

                  {!isLoggedIn ? (
                      <div className="nav-item top-line-item" onClick={signInClick}>
                        <span>Sign in</span>
                      </div>
                  ) : (
                      <li
                          className="nav-item the-user-icon"
                          style={{ cursor: 'pointer' }}
                          onClick={toggleUserMenu}
                      >
                        <HeaderIdentityBox />
                      </li>
                  )}
                </ul>
              </nav>
          )}

          <div className="menu-icon" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>

        {isLoggedIn && userMenuOpen && (
            <nav className="user-nav">
              <ul className="user-nav-list">
                <li className="user-nav-item" onClick={handleLogout}><span>Logout</span></li>
                <li className="user-nav-item" onClick={openDashboard}>
                  <span>{isDoctor ? 'Doctor Dashboard' : 'Dashboard'}</span>
                </li>
                <li className="user-nav-item" onClick={openSettings}>
                  <span className="no-bottom-border">Settings</span>
                </li>
              </ul>
            </nav>
        )}
      </header>
  );
}

export default React.memo(Header);