import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaCalendarAlt, FaChartBar } from 'react-icons/fa';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { user, accessToken } = useSelector((state) => state.auth);

  if (!accessToken || !user) {
    navigate('/');
    return null;
  }

  return (
    <div className="doctor-dashboard-container">
      <h1>Doctor Dashboard</h1>

      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-number">0</div>
          <div className="stat-label">Total Patients</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">0</div>
          <div className="stat-label">Upcoming Appointments</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">0</div>
          <div className="stat-label">Completed Appointments</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">4.5</div>
          <div className="stat-label">Avg Rating</div>
        </div>
      </div>

      <div className="main-sections">
        <div className="left-section">
          <h2>Upcoming Appointments</h2>
          <p>No upcoming appointments</p>
        </div>

        <div className="right-section">
          <h2>Quick Actions</h2>
          <ul className="actions-list">
            <li><FaEnvelope /> Message Patients</li>
            <li><FaCalendarAlt /> Manage Schedule</li>
            <li><FaChartBar /> View Analytics</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;