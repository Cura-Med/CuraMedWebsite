import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as Icons from 'react-icons/fa';
import { FaMoneyBillWave } from 'react-icons/fa';

const PayoutMethodSelector = ({ formData, setFormData, handleChange }) => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const cached = localStorage.getItem('payoutMethods');
        if (cached) {
          setMethods(JSON.parse(cached));
          setLoading(false);
        } else {
          const res = await axios.get(
            'https://curamed-auth-api-973580931654.europe-north1.run.app/payment-method-types'
          );
          const activeMethods = res.data.paymentMethodTypes.filter((m) => m.isActive);
          localStorage.setItem('payoutMethods', JSON.stringify(activeMethods));
          setMethods(activeMethods);
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch payout methods:', error);
        setLoading(false);
      }
    };

    fetchMethods();
  }, []);

  const selectedMethod = methods.find((m) => m.value === formData.payoutMethod);

  const renderIcon = (iconName) => {
    const Icon = Icons[iconName];
    return Icon ? <Icon className="payout-icon" /> : <FaMoneyBillWave className="payout-icon" />;
  };

  return (
    <div className="form-group form-field">
      <label className="select-label">
        <FaMoneyBillWave className="field-icon" /> Payout Method
      </label>

      {loading ? (
        <p>Loading payout methods...</p>
      ) : (
        <div className="payout-method-selector">
          {methods.map((method) => (
            <label
              key={method.id}
              className={`payout-method-option ${
                formData.payoutMethod === method.value ? 'selected' : ''
              }`}
            >
              <input
                type="radio"
                name="payoutMethod"
                value={method.value}
                checked={formData.payoutMethod === method.value}
                onChange={handleChange}
              />
              {renderIcon(method.icon)}
              <span>{method.label}</span>
            </label>
          ))}
        </div>
      )}

      {/* Dynamic Fields for Selected Method */}
      {selectedMethod?.fields?.map((field) => (
        <div className="form-group form-field" key={field.name}>
          <label htmlFor={field.name} className="select-label">
            {renderIcon(selectedMethod.icon)} {field.label}
            {!field.required && <span className="optional-label"> (optional)</span>}
          </label>
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            required={field.required}
          />
        </div>
      ))}

      {/* Setup message (e.g. Stripe) */}
      {selectedMethod?.setupMessage && (
        <div className="stripe-info">
          <p className="info-text">
            {renderIcon(selectedMethod.icon)} {selectedMethod.setupMessage}
          </p>
        </div>
      )}
    </div>
  );
};

export default PayoutMethodSelector;
