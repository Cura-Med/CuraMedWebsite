import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {FaEnvelope, FaCalendarAlt, FaChartBar, FaUserMd} from 'react-icons/fa';
import './DoctorDashboard.css';
import axios from "../api/axios.js";
import Appointments from "../components/organisms/Appointments.jsx";
import Schedules from "../components/organisms/Schedules.jsx";


const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { user, accessToken } = useSelector((state) => state.auth);
  const [schedules, setSchedules] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [leftSectionSelection, setLeftSectionSelection] = useState('appointments')

  const setLeftSectionSelectionSchedules = () => { setLeftSectionSelection('schedules') }
  const setLeftSectionSelectionAppointments = () => { setLeftSectionSelection('appointments') }

  useEffect( () => {
    const fetchSchedules = async () => {
      if (user.id.length > 1 && accessToken) {
        try {
          const response = await axios.get(`/doctor-schedules?DoctorId=${user.id}`);
          console.log('Schedules: ', response)
          setSchedules(response.doctorSchedules)
        } catch (e) {}
      }
    }
    fetchSchedules().then(r => {})
  }, [user]);

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
          {leftSectionSelection === 'appointments' &&
              <Appointments appointments={appointments}/>
          }
          {leftSectionSelection === 'schedules' &&
              <Schedules schedules={schedules}/>
          }
        </div>

        <div className="right-section">
          <h2>Quick Actions</h2>
          <ul className="actions-list">
            <li><FaEnvelope /> Message Patients</li>
            <li onClick={setLeftSectionSelectionAppointments}><FaUserMd  /> Manage Appointments</li>
            <li onClick={setLeftSectionSelectionSchedules}><FaCalendarAlt /> Manage Schedule</li>
            <li><FaChartBar /> View Analytics</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;