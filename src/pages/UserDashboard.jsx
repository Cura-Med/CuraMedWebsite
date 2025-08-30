import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, accessToken } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  if (!accessToken || !user) {
    navigate('/');
    return null;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Welcome to Your Dashboard</h1>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {/* Profile Section */}
        <section className="dashboard-section profile-section">
          <h2>Profile Information</h2>
          <div className="profile-card">
            <div className="profile-avatar">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Profile" />
              ) : (
                <div className="avatar-placeholder">
                  {user.fullName?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="profile-details">
              <h3>{user.fullName}</h3>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>User ID:</strong> {user.id}</p>
            </div>
          </div>
        </section>

        {/* Appointments Section */}
        <section className="dashboard-section appointments-section">
          <h2>Appointment History</h2>
          <div className="section-content">
            <div className="placeholder-card">
              <h3>No Appointments Yet</h3>
              <p>Your appointment history will appear here once you schedule consultations.</p>
              <button className="action-button">Schedule Appointment</button>
            </div>
          </div>
        </section>

        {/* Health Records Section */}
        <section className="dashboard-section health-records-section">
          <h2>Health Records</h2>
          <div className="section-content">
            <div className="placeholder-card">
              <h3>Health Records</h3>
              <p>Your medical records and health information will be displayed here.</p>
              <button className="action-button">View Records</button>
            </div>
          </div>
        </section>

        {/* Symptom Tracking Section */}
        <section className="dashboard-section symptom-tracking-section">
          <h2>Symptom Tracking</h2>
          <div className="section-content">
            <div className="placeholder-card">
              <h3>Track Your Symptoms</h3>
              <p>Monitor and log your symptoms for better health management.</p>
              <button className="action-button">Log Symptoms</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserDashboard;