import React from 'react';
import { useState, useEffect } from 'react';
import { FaGlobe } from 'react-icons/fa'; // Optional if you're using icons

const CountrySelect = ({
  label,
  id,
  name,
  value,
  onChange,
  required = true,
  placeholder = "Select your country",
  icon: IconComponent = null
}) => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    async function fetchCountries() {
      try {
        const res = await fetch('https://curamed-auth-api-973580931654.europe-north1.run.app/countries');
        const data = await res.json();
        if (data.countries && Array.isArray(data.countries)) {
          setCountries(data.countries);
        } else {
          console.error("Unexpected format:", data);
        }
      } catch (err) {
        console.error("Failed to fetch countries:", err);
      }
    }

    fetchCountries();
  }, []);

  return (
    <div className="form-group form-field">
      <label htmlFor={id} className="select-label">
        {IconComponent && <IconComponent className="field-icon" />} {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="select-input"
        required={required}
      >
        <option value="" disabled>{placeholder}</option>
        {countries.map(country => (
          <option key={country.code || country.id} value={country.code || country.id}>
            {country.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CountrySelect;
