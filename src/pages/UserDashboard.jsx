import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaStethoscope, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';
import './UserDashboard.css';
import axios from "../api/axios.js";
import Appointment from "../components/atoms/Appointment.jsx";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, accessToken } = useSelector((state) => state.auth);

  const [appointments, setAppointments] = useState([]);


  useEffect(() => {
    if (!user || !accessToken) return;
    getMyAppointments().then(() => {});
  }, [user, accessToken]);

  const getMyAppointments = async () => {
    try {
      const response = await axios.get('/appointments/by-patient/' + user.id);
      console.log(response)
      setAppointments(response.data.appointments)
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };


  if (!accessToken || !user) {
    return null;
  }

  return (
      <div className="user-dashboard-container">
        <h1>Welcome back, {user.fullName}</h1>
        <p>Patient Portal</p>

        <div className="stats-row">
          <div className="stat-box">
            <div className="stat-number">{appointments.length}</div>
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

              {appointments.map((appointment, index) => (
                  <Appointment
                      key={index}
                      appointment={appointment}
                  />
              ))}

            </ul>

            <h2>Track Your Vitals</h2>
          </div>

          <div className="right-section">
            <h2>Quick Actions</h2>
            <ul className="actions-list">
              <li onClick={() => navigate('/book-consultation')} style={{cursor: 'pointer'}}><FaCalendarAlt /> Book Consultation</li>
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