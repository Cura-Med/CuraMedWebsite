import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';

const LanguagesMultiSelect = ({ value, onChange, name = 'languagesSpoken', placeholder = 'Select languages...' }) => {
  const [languageOptions, setLanguageOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLanguages = async () => {
      const cached = localStorage.getItem('languages');

      if (cached) {
        setLanguageOptions(JSON.parse(cached));
        setLoading(false);
      } else {
        try {
          const response = await axios.get('https://curamed-auth-api-973580931654.europe-north1.run.app/languages');
          const data = response.data.languages;

          const formatted = data.map(lang => ({
            value: lang.id,
            label: lang.name,
          }));

          setLanguageOptions(formatted);
          localStorage.setItem('languages', JSON.stringify(formatted));
        } catch (error) {
          console.error('Failed to fetch languages:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchLanguages();
  }, []);

  return (
    <div className="form-group form-field">
      <label htmlFor={name} className="select-label">Languages Spoken</label>
      <Select
        id={name}
        name={name}
        isMulti
        options={languageOptions}
        value={languageOptions.filter(option => value.includes(option.value))}
        onChange={(selectedOptions) => {
          const selectedValues = selectedOptions.map(option => option.value);

          // Call parent's onChange (e.g., handleChange)
          const syntheticEvent = {
            target: {
              name,
              value: selectedValues,
            },
          };

          onChange(syntheticEvent);
        }}
        isDisabled={loading}
        isLoading={loading}
        loadingMessage={() => 'Loading languages...'}
        className="select-input"
        classNamePrefix="react-select"
        placeholder={loading ? 'Please wait...' : placeholder}
      />
    </div>
  );
};

export default LanguagesMultiSelect;
