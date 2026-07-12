import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import CountrySelect from '../components/CountrySelect';
import GenderSelect from '../components/GenderSelect';
import TimeZoneSelect from '../components/TimeZoneSelect';
import { FaUser, FaUpload } from 'react-icons/fa';
import { updatePatient } from '../utils/patientRegistration';

const RegistrationComplete = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const email = searchParams.get('email');

  const [formData, setFormData] = useState({
    profilePhoto: null,
    country: '',
    city: '',
    timeZone: '',
  });
  const [userDetailId, setUserDetailId] = useState('');

  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `https://curamed-auth-api-973580931654.europe-north1.run.app/user-details/by-user-id/${userId}/full-details`
        );
        const data = response.data;
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          countryCode: '',
          phoneNumber: '',
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : '',
          gender: data.sexTypeId ? data.sexTypeId.toString() : '',
          profilePhoto: null,
          country: data.countryId ? data.countryId.toString() : '',
          city: data.city || '',
          timeZone: data.timeZoneId ? data.timeZoneId.toString() : '',
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setSubmitError('Failed to load user details. Please try again.');
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (submitError) setSubmitError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profilePhoto: file
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      await updatePatient(userDetailId, formData);
      navigate('/email-verification-pending', {
        state: {
          email: email,
          userType: 'patient',
        },
      });
    } catch (error) {
      console.error('Update failed:', error);
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="registration-complete-page">
      <div className="auth-modal">
        <div className="auth-header">
          <h2>Complete Your Registration</h2>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="profilePhoto" className="select-label">Profile Photo</label>
            <div className="profile-photo-upload">
              <div
                className="profile-photo-preview"
                onClick={() => fileInputRef.current.click()}
              >
                {profilePhotoPreview ? (
                  <img src={profilePhotoPreview} alt="Profile Preview" />
                ) : (
                  <FaUser className="profile-placeholder" />
                )}
              </div>
              <button
                type="button"
                className="upload-button"
                onClick={() => fileInputRef.current.click()}
              >
                <FaUpload className="upload-icon" /> Upload Photo
              </button>
              <input
                type="file"
                id="profilePhoto"
                name="profilePhoto"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="file-input"
              />
            </div>
          </div>

          <CountrySelect
            label="Country"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
          />

          <div className="form-group form-field">
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              required
            />
          </div>

          <TimeZoneSelect value={formData.timeZone} onChange={handleChange} />

          {submitError && (
            <div className="error-message" style={{ marginBottom: '16px', textAlign: 'center' }}>
              {submitError}
            </div>
          )}

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Completing Registration...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationComplete;