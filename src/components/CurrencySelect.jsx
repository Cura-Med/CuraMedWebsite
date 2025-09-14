import React, { useEffect, useState } from 'react';
import { FaMoneyBillWave } from 'react-icons/fa';

const CURRENCY_API = 'https://curamed-auth-api-973580931654.europe-north1.run.app/currencies';
const LOCAL_STORAGE_KEY = 'currencies';

const CurrencySelect = ({ formData, handleChange }) => {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch and cache currencies
  useEffect(() => {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      setCurrencies(JSON.parse(cached));
      setLoading(false);
    } else {
      fetch(CURRENCY_API)
        .then(res => res.json())
        .then(data => {
          if (data.currencies) {
            setCurrencies(data.currencies);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.currencies));
          }
        })
        .catch(err => {
          console.error('Failed to fetch currencies:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  return (
    <div className="form-group form-field">
      <label htmlFor="billingCurrency" className="select-label">
        <FaMoneyBillWave className="field-icon" /> Billing Currency
      </label>
      <select
        id="billingCurrency"
        name="billingCurrency"
        value={formData.billingCurrency}
        onChange={handleChange}
        className="select-input"
        required
      >
        {loading ? (
          <option>Loading currencies...</option>
        ) : (
          <>
            <option value="">Select a currency</option>
            {currencies.map(currency => (
              <option key={currency.id} value={currency.id}>
                {currency.code} - {currency.name}
              </option>
            ))}
          </>
        )}
      </select>
    </div>
  );
};

export default CurrencySelect;
