// src/components/Header.jsx
import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaBars, FaRegUser, FaTimes } from 'react-icons/fa';
import './Header.css';
import { useDispatch, useSelector } from 'react-redux';
import { openAuthModal } from '../features/modal/modalSlice';
import { logout } from '../features/auth/authSlice';
import Avatar from "./atoms/Avatar.jsx";
import HeaderIdentityBox from "./molecules/HeaderIdentityBox.jsx";

const Header = () => {
  const dispatch = useDispatch();
  const { user, accessToken } = useSelector((state) => state.auth);

  const [isMenuOpen, setIsMenuOpen] = useState(false);     // mobile nav
  const [userMenuOpen, setUserMenuOpen] = useState(false); // user dropdown

  const mainTick = useSelector(state => state.utils.mainClick)

  useEffect(() => {
    if (mainTick > 1) {
      setIsMenuOpen(false)
      setUserMenuOpen(false)
    }
  }, [mainTick]);

  const isLoggedIn = Boolean(user?.id || accessToken);

  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const toggleUserMenu = () => setUserMenuOpen((v) => !v);


  const openDashboard = () => {
    if (user?.isDoctor) {
      window.location.href = "/doctor-dashboard";
    } else {
      window.location.href = "/dashboard";
    }
  }

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/';
  };


  useEffect(() => {
    const onResize = () => setUserMenuOpen(false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
      <header className="header">
        <div className="container header-container">
          <Link to="/" className="logo" onClick={() => setIsMenuOpen(false)}>
            CuraMed
          </Link>

          <div style={{ flex: 1 }} />

          <nav className={`nav ${isMenuOpen ? 'active' : ''}`}>
            <ul className="nav-list">
              <li className="nav-item" onClick={() => setIsMenuOpen(false)}>
                <NavLink to="/features" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Features
                </NavLink>
              </li>

              <li className="nav-item" onClick={() => setIsMenuOpen(false)}>
                <NavLink to="/services" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Services
                </NavLink>
              </li>

              <li className="nav-item" onClick={() => setIsMenuOpen(false)}>
                <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
                  About
                </NavLink>
              </li>

              <li className="nav-item" onClick={() => setIsMenuOpen(false)}>
                <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Contact
                </NavLink>
              </li>

              {!isLoggedIn ? (
                  <div
                      className="nav-item hide-from-wide"
                      onClick={() => {
                        dispatch(openAuthModal());
                        setIsMenuOpen(false);
                      }}
                  >
                    <a>Sign in</a>
                  </div>
              ) : (
                  <>
                    <div
                        className="nav-item hide-from-wide"
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleLogout();
                        }}
                    >
                      <a>Logout</a>
                    </div>

                    <div className="nav-item hide-from-wide" onClick={() => setIsMenuOpen(false)}>
                      {user?.isDoctor ? <a onClick={() => openDashboard()}>Doctor Dashboard</a> : <a onClick={() => openDashboard()}>Dashboard</a>}
                    </div>

                  </>
              )}

              {!isLoggedIn ? (
                  <li
                      className="nav-item the-user-icon"
                      style={{ cursor: 'pointer' }}
                      onClick={() => dispatch(openAuthModal())}
                  >
                    <a>Sign in</a>
                  </li>
              ) : (
                  <li
                      className="nav-item the-user-icon"
                      style={{ cursor: 'pointer' }}
                      onClick={toggleUserMenu}
                  >
                    <HeaderIdentityBox/>
                    {/*<Avatar avatar={'mine'} size={'38'}/>*/}
                    {/*<FaRegUser />*/}
                  </li>
              )}
            </ul>

          </nav>


          {isLoggedIn && (
              <div className={`user-nav ${userMenuOpen ? 'active' : ''}`} id="user-div">
                <div
                    className="nav-item user-nav-item"
                    onClick={handleLogout}
                    id="user-inner-div-1"
                >
                  <span>Logout</span>
                </div>

                <div
                    className="nav-item user-nav-item"
                    id="user-inner-div-3"
                    style={{ borderTop: 'solid 1px rgba(0, 0, 0, 0.05)' }}
                    onClick={() => setUserMenuOpen(false)}
                >
                  {user?.isDoctor ? <span onClick={() => openDashboard()}>Doctor Dashboard</span> : <span onClick={() => openDashboard()}>Dashboard</span>}
                </div>

              </div>
          )}

          <div style={{ minWidth: '42px' }} />

          <div className="menu-icon" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>

      </header>
  );
};

export default Header;