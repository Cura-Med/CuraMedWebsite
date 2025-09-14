import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaStethoscope, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';
import './UserDashboard.css';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, accessToken } = useSelector((state) => state.auth);

  if (!accessToken || !user) {
    navigate('/');
    return null;
  }

  return (
    <div className="user-dashboard-container">
      <h1>Welcome back, {user.fullName}</h1>
      <p>Patient Portal</p>

      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-number">2</div>
          <div className="stat-label">Appointments</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">4</div>
          <div className="stat-label">Total Consultations</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">Active</div>
          <div className="stat-label">Account</div>
        </div>
      </div>

      <div className="main-sections">
        <div className="left-section">
          <h2>Upcoming Consultations</h2>
          <ul className="consultations-list">
            <li className="consultation-item">
              <span className="category">General</span>
              <span className="date">Jun 10, 10:00 AM</span>
            </li>
            <li className="consultation-item">
              <span className="category">Mental Health</span>
              <span className="date">Jun 15, 2:00 PM</span>
            </li>
          </ul>
          <a href="#" className="view-all">View All</a>

          <h2>Track Your Vitals</h2>
        </div>

        <div className="right-section">
          <h2>Quick Actions</h2>
          <ul className="actions-list">
            <li><FaCalendarAlt /> Book Consultation</li>
            <li><FaUser /> Update Profile</li>
            <li><FaStethoscope /> Symptom Checker</li>
            <li><FaEnvelope /> Message Doctor</li>
          </ul>
          <div className="chat-bot">Chat with CuraBot</div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;