import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
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
    <div className="doctor-dashboard-container">
      <header className="doctor-dashboard-header">
        <div className="header-content">
          <h1>Doctor Dashboard</h1>
        </div>
      </header>

      <main className="doctor-dashboard-main">
        {/* Profile Section */}
        <section className="dashboard-section doctor-profile-section">
          <h2>Doctor Profile</h2>
          <div className="doctor-profile-card">
            <div className="doctor-avatar">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Doctor Profile" />
              ) : (
                <div className="avatar-placeholder">
                  Dr. {user.fullName?.split(' ')[0]?.charAt(0)}
                </div>
              )}
            </div>
            <div className="doctor-details">
              <h3>Dr. {user.fullName}</h3>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>License ID:</strong> {user.id}</p>
              <p><strong>Specialty:</strong> {user.specialty || 'General Practice'}</p>
            </div>
          </div>
        </section>

        {/* Today's Schedule */}
        <section className="dashboard-section schedule-section">
          <h2>Today's Schedule</h2>
          <div className="schedule-grid">
            <div className="schedule-item">
              <div className="time">09:00 AM</div>
              <div className="appointment">
                <h4>John Smith</h4>
                <p>Regular Check-up</p>
              </div>
            </div>
            <div className="schedule-item">
              <div className="time">10:30 AM</div>
              <div className="appointment">
                <h4>Sarah Johnson</h4>
                <p>Follow-up Consultation</p>
              </div>
            </div>
            <div className="schedule-item">
              <div className="time">02:00 PM</div>
              <div className="appointment">
                <h4>Mike Davis</h4>
                <p>Cardiology Consultation</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="dashboard-section stats-section">
          <h2>Quick Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>24</h3>
              <p>Today's Appointments</p>
            </div>
            <div className="stat-card">
              <h3>156</h3>
              <p>Total Patients</p>
            </div>
            <div className="stat-card">
              <h3>$2,450</h3>
              <p>This Month's Earnings</p>
            </div>
            <div className="stat-card">
              <h3>4.8</h3>
              <p>Average Rating</p>
            </div>
          </div>
        </section>

        {/* Recent Patients */}
        <section className="dashboard-section patients-section">
          <h2>Recent Patients</h2>
          <div className="patients-list">
            <div className="patient-item">
              <div className="patient-info">
                <h4>Emily Chen</h4>
                <p>Last visit: 2 days ago</p>
                <p>Condition: Hypertension</p>
              </div>
              <button className="view-patient-btn">View Details</button>
            </div>
            <div className="patient-item">
              <div className="patient-info">
                <h4>Robert Wilson</h4>
                <p>Last visit: 1 week ago</p>
                <p>Condition: Diabetes Management</p>
              </div>
              <button className="view-patient-btn">View Details</button>
            </div>
            <div className="patient-item">
              <div className="patient-info">
                <h4>Lisa Brown</h4>
                <p>Last visit: 2 weeks ago</p>
                <p>Condition: Annual Physical</p>
              </div>
              <button className="view-patient-btn">View Details</button>
            </div>
          </div>
        </section>

        {/* Earnings Overview */}
        <section className="dashboard-section earnings-section">
          <h2>Earnings Overview</h2>
          <div className="earnings-chart">
            <div className="earnings-summary">
              <div className="earning-item">
                <span className="label">This Week:</span>
                <span className="amount">$1,250</span>
              </div>
              <div className="earning-item">
                <span className="label">This Month:</span>
                <span className="amount">$4,850</span>
              </div>
              <div className="earning-item">
                <span className="label">Total Earnings:</span>
                <span className="amount">$28,450</span>
              </div>
            </div>
            <button className="view-earnings-btn">View Detailed Report</button>
          </div>
        </section>

        {/* Notifications */}
        <section className="dashboard-section notifications-section">
          <h2>Recent Notifications</h2>
          <div className="notifications-list">
            <div className="notification-item">
              <div className="notification-icon">📅</div>
              <div className="notification-content">
                <h4>New appointment scheduled</h4>
                <p>Maria Garcia has booked for tomorrow at 3:00 PM</p>
                <span className="notification-time">2 hours ago</span>
              </div>
            </div>
            <div className="notification-item">
              <div className="notification-icon">💊</div>
              <div className="notification-content">
                <h4>Prescription refill request</h4>
                <p>John Smith requested refill for his medication</p>
                <span className="notification-time">4 hours ago</span>
              </div>
            </div>
            <div className="notification-item">
              <div className="notification-icon">⭐</div>
              <div className="notification-content">
                <h4>New review received</h4>
                <p>You received a 5-star review from Sarah Johnson</p>
                <span className="notification-time">1 day ago</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DoctorDashboard;