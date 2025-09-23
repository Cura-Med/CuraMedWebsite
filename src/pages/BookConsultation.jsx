import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './BookConsultation.css';
import axios from '../api/axios';

const BookConsultation = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [groupedSlots, setGroupedSlots] = useState({});
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [symptoms, setSymptoms] = useState('');

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await axios.get('/doctor-specialties/scheduled');
        setSpecialties(response.data.doctorSpecialties);
      } catch (error) {
        console.error('Error fetching specialties:', error);
      }
    };
    fetchSpecialties();
  }, []);

  useEffect(() => {
    const fetchSlots = async () => {
      if (selectedSpecialty && selectedDate) {
        try {
          const response = await axios.get(`/appointments/available-slots?SpecialtyId=${selectedSpecialty}&AppointmentDate=${selectedDate}`);
          setAvailableSlots(response.data.availableSlots);
        } catch (error) {
          console.error('Error fetching slots:', error);
        }
      }
    };
    fetchSlots();
  }, [selectedSpecialty, selectedDate]);

  useEffect(() => {
    const grouped = availableSlots.reduce((acc, slot) => {
      if (!acc[slot.doctorId]) {
        acc[slot.doctorId] = {
          doctorId: slot.doctorId,
          doctorName: slot.doctorName,
          doctorAvatar: slot.doctorAvatar,
          slots: []
        };
      }
      acc[slot.doctorId].slots.push({ slotStart: slot.slotStart, slotEnd: slot.slotEnd });
      return acc;
    }, {});

    // Sort slots by start time for each doctor
    Object.values(grouped).forEach(doctor => {
      doctor.slots.sort((a, b) => a.slotStart.localeCompare(b.slotStart));
    });

    setGroupedSlots(grouped);
  }, [availableSlots]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      alert('Please select a slot');
      return;
    }
    try {
      await axios.post('/appointments/' + selectedSlot.doctorId + '/make-appointment', {
        specialtyId: selectedSpecialty,
        patientId: user.id,
        appointmentDate: selectedDate,
        doctorId: selectedSlot.doctorId,
        startTime: selectedSlot.slotStart,
        endTime: selectedSlot.slotEnd,
        language: selectedLanguage,
        notes: symptoms
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };

  const selectedSpecialtyName = specialties.find(s => s.id === selectedSpecialty)?.name || '';

  const takeBack = () => {
    window.history.back();
  }

  // Temporarily bypass auth for verification
  // if (!accessToken || !user) {
  //   navigate('/');
  //   return null;
  // }

  if (!user?.id) {
    return null
  }

  return (
    <div className="book-consultation-container">
      <h1>Book a Consultation</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Consultation Type</label>
          {specialties.map((spec) => (
            <div className="radio-group" key={spec.id}>
              <input
                type="radio"
                id={`spec-${spec.id}`}
                name="consultationType"
                value={spec.id}
                style={{maxWidth: 20}}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              />
              <label style={{marginBottom: -1}} htmlFor={`spec-${spec.id}`}>{spec.name}</label>
            </div>
          ))}
        </div>
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        {selectedSpecialty && selectedDate && (
          <div className="slots-section">
            <h2>Available Slots for {selectedSpecialtyName} on {new Date(selectedDate).toLocaleDateString()}</h2>
            {Object.values(groupedSlots).length > 0 ? (
              Object.values(groupedSlots).map((doctor) => (
                <div key={doctor.doctorId} className="doctor-group">
                  <h3 className="doctor-header">
                    <img src={doctor.doctorAvatar} alt={doctor.doctorName} className="doctor-avatar" />
                    {doctor.doctorName}
                  </h3>
                  <div className="slots">
                    {doctor.slots.map((slot) => (
                      <button
                        type="button"
                        key={slot.slotStart}
                        className={`slot-button ${
                          selectedSlot &&
                          selectedSlot.doctorId === doctor.doctorId &&
                          selectedSlot.slotStart === slot.slotStart
                            ? 'selected'
                            : ''
                        }`}
                        onClick={() =>
                          setSelectedSlot({
                            doctorId: doctor.doctorId,
                            slotStart: slot.slotStart,
                            slotEnd: slot.slotEnd
                          })
                        }
                      >
                        🕘 {slot.slotStart.slice(0, 5)} - {slot.slotEnd.slice(0, 5)}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p>No available slots for this date and specialty.</p>
            )}
          </div>
        )}
        <div className="form-group">
          <label>Preferred Language</label>
          <div className="radio-columns">
            <div className="column">
              <div className="radio-group">
                <input
                  type="radio"
                  id="english"
                  name="language"
                  value="english"
                  checked={selectedLanguage === 'english'}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                />
                <label htmlFor="english">English</label>
              </div>
              <div className="radio-group">
                <input
                  type="radio"
                  id="french"
                  name="language"
                  value="french"
                  checked={selectedLanguage === 'french'}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                />
                <label htmlFor="french">French</label>
              </div>
            </div>
            <div className="column">
              <div className="radio-group">
                <input
                  type="radio"
                  id="spanish"
                  name="language"
                  value="spanish"
                  checked={selectedLanguage === 'spanish'}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                />
                <label htmlFor="spanish">Spanish</label>
              </div>
              <div className="radio-group">
                <input
                  type="radio"
                  id="german"
                  name="language"
                  value="german"
                  checked={selectedLanguage === 'german'}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                />
                <label htmlFor="german">German</label>
              </div>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="symptoms">Symptoms</label>
          <textarea
            id="symptoms"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Describe your symptoms..."
          ></textarea>
        </div>

        <div className='bottom-buttons'>
          <button type="submit" disabled={!selectedSlot}
                  className={`book-button ${!selectedSlot ? "book-button--disabled" : ""}`}
          >Book Consultation</button>
          {window.history.length > 1 &&
              <>
                <div style={{width: '12px'}}/>
                <div onClick={takeBack} className="book-button book-button__div">Back</div>
              </>
          }
        </div>

      </form>
    </div>
  );
};

export default BookConsultation;