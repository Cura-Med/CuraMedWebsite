import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './BookConsultation.css';

const BookConsultation = () => {
  const navigate = useNavigate();
  const { user, accessToken } = useSelector((state) => state.auth);

  if (!accessToken || !user) {
    navigate('/');
    return null;
  }

  return (
    <div className="book-consultation-container">
      <h1>Book a Consultation</h1>
      <form>
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input type="date" id="date" placeholder="mm/dd/yyyy" />
        </div>
        <div className="form-group">
          <label htmlFor="time">Time</label>
          <input type="time" id="time" />
        </div>
        <div className="form-group">
          <label>Consultation Type</label>
          <div className="radio-columns">
            <div className="column">
              <div className="radio-group">
                <input type="radio" id="general" name="consultationType" value="general" />
                <label htmlFor="general">General Consultation</label>
              </div>
              <div className="radio-group">
                <input type="radio" id="pediatric" name="consultationType" value="pediatric" />
                <label htmlFor="pediatric">Pediatric Care</label>
              </div>
            </div>
            <div className="column">
              <div className="radio-group">
                <input type="radio" id="mental" name="consultationType" value="mental" />
                <label htmlFor="mental">Mental Health</label>
              </div>
              <div className="radio-group">
                <input type="radio" id="specialist" name="consultationType" value="specialist" />
                <label htmlFor="specialist">Specialist Consultation</label>
              </div>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label>Preferred Language</label>
          <div className="radio-columns">
            <div className="column">
              <div className="radio-group">
                <input type="radio" id="english" name="language" value="english" defaultChecked />
                <label htmlFor="english">English</label>
              </div>
              <div className="radio-group">
                <input type="radio" id="french" name="language" value="french" />
                <label htmlFor="french">French</label>
              </div>
            </div>
            <div className="column">
              <div className="radio-group">
                <input type="radio" id="spanish" name="language" value="spanish" />
                <label htmlFor="spanish">Spanish</label>
              </div>
              <div className="radio-group">
                <input type="radio" id="german" name="language" value="german" />
                <label htmlFor="german">German</label>
              </div>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="symptoms">Symptoms</label>
          <textarea id="symptoms" placeholder="Describe your symptoms..."></textarea>
        </div>
        <button type="submit" className="book-button">Book Consultation</button>
      </form>
    </div>
  );
};

export default BookConsultation;