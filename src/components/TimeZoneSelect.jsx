import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaClock } from 'react-icons/fa';
import './TimeZoneSelect.css';

const TimeZoneSelect = ({ value, onChange, name = 'timeZone', required = true }) => {
  const [timeZones, setTimeZones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeZones = async () => {
      const cached = localStorage.getItem('timeZones');

      if (cached) {
        setTimeZones(JSON.parse(cached));
        setLoading(false);
      } else {
        try {
          const response = await axios.get('https://curamed-auth-api-973580931654.europe-north1.run.app/timezones');
          const data = response.data.timeZones;

          const sorted = data.sort((a, b) => a.utcOffset.localeCompare(b.utcOffset));
          localStorage.setItem('timeZones', JSON.stringify(sorted));
          setTimeZones(sorted);
        } catch (error) {
          console.error('Failed to fetch time zones:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTimeZones();
  }, []);

  return (
    <div className="form-group form-field">
      <label htmlFor={name} className="select-label">
        <FaClock className="field-icon" /> Time Zone
      </label>

      {loading && (
        <div className="loading-label" style={{ fontSize: '0.9em', color: '#777', marginBottom: '4px' }}>
          Loading time zones...
        </div>
      )}

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="select-input"
        required={required}
        disabled={loading}
      >
        <option value="" disabled>{loading ? 'Loading time zones...' : 'Select your time zone'}</option>
        {timeZones.map((tz) => (
          <option key={tz.id} value={tz.id}>
            ({tz.utcOffset}) {tz.description}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimeZoneSelect;
