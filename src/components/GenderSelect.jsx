import React, { useEffect, useState } from 'react';
import axios from 'axios';

function GenderSelect({ formData, handleChange }) {
  const [sexTypes, setSexTypes] = useState([]);
  const [loading, setLoading] = useState(true); // <-- Track loading state

  useEffect(() => {
    const cachedSexTypes = localStorage.getItem('sexTypes');

    if (cachedSexTypes) {
      setSexTypes(JSON.parse(cachedSexTypes));
      setLoading(false); // Done loading
    } else {
      axios.get('https://curamed-auth-api-973580931654.europe-north1.run.app/sex-types')
        .then((response) => {
          setSexTypes(response.data.sexTypes);
          localStorage.setItem('sexTypes', JSON.stringify(response.data.sexTypes));
        })
        .catch((error) => {
          console.error('Error fetching sex types:', error);
        })
        .finally(() => {
          setLoading(false); // Always hide loader after fetch
        });
    }
  }, []);

  if (loading) {
    return <div className="gender-selector">Loading gender options...</div>;
  }

  return (
    <div className="gender-selector">
      {sexTypes.map((sex) => (
        <label
          key={sex.id}
          className={`gender-option ${formData.gender === sex.id ? 'selected' : ''}`}
        >
          <input
            type="radio"
            name="gender"
            value={sex.id}
            checked={formData.gender === sex.id}
            onChange={(e) =>
              handleChange({
                target: {
                  name: 'gender',
                  value: Number(e.target.value),
                },
              })
            }
          />
          <span>{sex.name}</span>
        </label>
      ))}
    </div>
  );
}

export default GenderSelect;
