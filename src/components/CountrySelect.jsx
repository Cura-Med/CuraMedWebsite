import React, { useState, useEffect } from 'react';
import { FaGlobe } from 'react-icons/fa';
import { getCountries } from '../services/countryService.js'; // Adjust path as needed

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
    let isMounted = true;

    getCountries()
      .then(data => {
        if (isMounted) setCountries(data);
      })
      .catch(err => {
        console.error("Failed to load countries:", err);
      });

    return () => { isMounted = false };
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
        disabled={countries.length === 0}
      >
        {countries.length === 0 ? (
          <option value="" disabled>
            Loading countries...
          </option>
        ) : (
        <>
          <option value="" disabled>
            {placeholder}
          </option>
          {countries.map((country) => (
            <option key={country.code || country.id} value={country.code || country.id}>
              {country.name}
            </option>
        ))}
        </>
      )}
      </select>
    </div>
  );
};

export default CountrySelect;
