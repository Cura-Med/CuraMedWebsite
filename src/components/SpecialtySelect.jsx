import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SpecialtySelect = ({ 
    value, 
    onChange,
    id = "specialty",
    required = true 
}) => {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecialties = async () => {
      const cached = localStorage.getItem('doctorSpecialties');

      if (cached) {
        setSpecialties(JSON.parse(cached));
        setLoading(false);
      } else {
        try {
          const response = await axios.get(
            'https://curamed-auth-api-973580931654.europe-north1.run.app/doctor-specialties'
          );
          const data = response.data.doctorSpecialties;
          localStorage.setItem('doctorSpecialties', JSON.stringify(data));
          setSpecialties(data);
        } catch (error) {
          console.error('Failed to fetch specialties:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSpecialties();
  }, []);

  return (
    <div className="form-group form-field">
      <label htmlFor="specialty" className="select-label">Specialty</label>
      <select
        id={id}
        name="specialty"
        value={value}
        onChange={onChange}
        className="select-input"
        required={required}
        disabled={loading}
      >
        <option value="" disabled>Select your specialty</option>
        {specialties.map((specialty) => (
          <option key={specialty.id} value={specialty.id}>
            {specialty.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SpecialtySelect;
