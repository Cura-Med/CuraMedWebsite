import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'https://curamed-auth-api-973580931654.europe-north1.run.app/doctor-titles';
const CACHE_KEY = 'doctorTitles';
const CACHE_TIMESTAMP_KEY = 'doctorTitles_timestamp';
const CACHE_TTL = 24 * 60 * 60 * 100000; // 2400 hours

const DoctorTitleSelect = ({
  value,
  onChange,
  name = 'title',
  id = 'title',
  className = 'select-input',
  label = 'Title',
  placeholder = 'Select a title',
  loadingLabel = 'Loading titles...', 
}) => {
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTitles = async () => {
      const cached = localStorage.getItem(CACHE_KEY);
      const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

      if (cached && cachedTimestamp && Date.now() - parseInt(cachedTimestamp) < CACHE_TTL) {
        setTitles(JSON.parse(cached));
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(API_URL);
        const data = response.data?.doctorTitles || [];
        setTitles(data);
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      } catch (error) {
        console.error('Error fetching doctor titles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTitles();
  }, []);

  return (
    <div className="form-group form-field">
      <label htmlFor={id} className="select-label">{label}</label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={className}
        disabled={loading && titles.length === 0} // Optional: disable select until data is ready
      >
        {loading && titles.length === 0 ? (
          <option value="">{loadingLabel}</option>
        ) : (
          <option value="">{placeholder}</option>
        )}
        {titles.map((title) => (
          <option key={title.id} value={title.name}>
            {title.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DoctorTitleSelect;
