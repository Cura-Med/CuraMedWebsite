import React, { useState, useRef } from 'react';
import { FaTimes, FaGoogle, FaCalendarAlt, FaChevronLeft, FaChevronRight, FaUpload, FaUser } from 'react-icons/fa';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState('patient');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    isLicensedProvider: false,
    title: 'Dr.',
    firstName: '',
    lastName: '',
    countryCode: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    profilePhoto: null,
    specialty: '',
    yearsOfExperience: '',
    languagesSpoken: '',
    country: '',
    city: ''
  });
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profilePhoto: file
      }));
      
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would handle authentication logic
    console.log('Form submitted:', formData, 'User type:', userType);
    // For demo purposes, just close the modal
    onClose();
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
    setCurrentStep(1);
    setProfilePhotoPreview(null);
    // Reset form data when switching between forms
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      isLicensedProvider: false,
      title: 'Dr.',
      firstName: '',
      lastName: '',
      countryCode: '',
      phoneNumber: '',
      dateOfBirth: '',
      gender: '',
      profilePhoto: null,
      specialty: '',
      yearsOfExperience: '',
      languagesSpoken: '',
      country: '',
      city: ''
    });
  };

  // Validation for each step
  const validateStep1 = () => {
    const basicValidation = formData.email && formData.password && formData.confirmPassword && 
                           formData.password === formData.confirmPassword;
    
    // If user is a doctor, they must check the licensed provider box
    if (userType === 'doctor') {
      return basicValidation && formData.isLicensedProvider;
    }
    
    return basicValidation;
  };

  const validateStep2 = () => {
    return formData.firstName && formData.lastName && 
           formData.countryCode && formData.phoneNumber && 
           formData.dateOfBirth && formData.gender;
  };

  const validateStep3 = () => {
    if (userType === 'doctor') {
      return formData.profilePhoto && formData.specialty && 
             formData.yearsOfExperience && formData.languagesSpoken &&
             formData.country && formData.city;
    }
    return formData.country && formData.city;
  };

  // Render sign-in form
  const renderSignInForm = () => (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="form-group">
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
      </div>
      
      <div className="form-group">
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
      </div>
      
      <button type="submit" className="submit-button">
        Login
      </button>
      
      <button type="button" className="google-button">
        <FaGoogle className="google-icon" />
        Continue with Google
      </button>
      
      <button type="button" className="guest-button">
        Continue as Guest
      </button>
    </form>
  );

  // Render sign-up step 1
  const renderSignUpStep1 = () => (
    <form className="auth-form">
      <div className="user-type-selector">
        <label className={`user-type-option ${userType === 'patient' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="userType"
            value="patient"
            checked={userType === 'patient'}
            onChange={() => handleUserTypeChange('patient')}
          />
          <span>I'm a patient</span>
        </label>
        <label className={`user-type-option ${userType === 'doctor' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="userType"
            value="doctor"
            checked={userType === 'doctor'}
            onChange={() => handleUserTypeChange('doctor')}
          />
          <span>I'm a doctor</span>
        </label>
      </div>
      
      <div className="form-group">
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
      </div>
      
      <div className="form-group">
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
      </div>
      
      <div className="form-group">
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          required
        />
      </div>
      
      {userType === 'doctor' && (
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="isLicensedProvider"
              checked={formData.isLicensedProvider}
              onChange={handleChange}
            />
            <span>I am a licensed medical provider</span>
          </label>
        </div>
      )}
      
      <button 
        type="button" 
        className="submit-button next-button"
        onClick={nextStep}
        disabled={!validateStep1()}
      >
        Next <FaChevronRight className="button-icon" />
      </button>
      
      <button type="button" className="google-button">
        <FaGoogle className="google-icon" />
        Continue with Google
      </button>
      
      <button type="button" className="guest-button">
        Continue as Guest
      </button>
    </form>
  );

  // Render sign-up step 2
  const renderSignUpStep2 = () => (
    <form className="auth-form">
      {userType === 'doctor' && (
        <div className="form-group">
          <label htmlFor="title" className="select-label">Title</label>
          <select
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="select-input"
          >
            <option value="Dr.">Dr.</option>
            <option value="MD">MD</option>
            <option value="DO">DO</option>
          </select>
        </div>
      )}
      
      <div className="form-group">
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          required
        />
      </div>
      
      <div className="form-group">
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          required
        />
      </div>
      
      <div className="phone-group">
        <div className="form-group code-group">
          <input
            type="text"
            id="countryCode"
            name="countryCode"
            value={formData.countryCode}
            onChange={handleChange}
            placeholder="Code"
            required
          />
        </div>
        <div className="form-group phone-number-group">
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            required
          />
        </div>
      </div>
      
      <div className="form-group date-group">
        <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          placeholder="Date of Birth"
          required
        />
        <FaCalendarAlt className="calendar-icon" />
      </div>
      
      <div className="gender-selector">
        <label className={`gender-option ${formData.gender === 'male' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="gender"
            value="male"
            checked={formData.gender === 'male'}
            onChange={handleChange}
          />
          <span>Male</span>
        </label>
        <label className={`gender-option ${formData.gender === 'female' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="gender"
            value="female"
            checked={formData.gender === 'female'}
            onChange={handleChange}
          />
          <span>Female</span>
        </label>
      </div>
      
      <div className="step-navigation">
        <button 
          type="button" 
          className="prev-button"
          onClick={prevStep}
        >
          <FaChevronLeft className="button-icon" /> Previous
        </button>
        <button 
          type="button" 
          className="next-button"
          onClick={nextStep}
          disabled={!validateStep2()}
        >
          Next <FaChevronRight className="button-icon" />
        </button>
      </div>
    </form>
  );

  // Render sign-up step 3
  const renderSignUpStep3 = () => (
    <form onSubmit={handleSubmit} className="auth-form">
      {userType === 'doctor' && (
        <>
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
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="specialty" className="select-label">Specialty</label>
            <select
              id="specialty"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              className="select-input"
              required
            >
              <option value="" disabled>Select your specialty</option>
              <option value="General Practitioner">General Practitioner</option>
              <option value="Psychologist">Psychologist</option>
              <option value="Internal Medicine Physician">Internal Medicine Physician</option>
              <option value="Pediatrician">Pediatrician</option>
              <option value="Obstetrician-Gynecologist">Obstetrician-Gynecologist</option>
              <option value="Reproductive Endocrinologist">Reproductive Endocrinologist</option>
              <option value="Cardiologist">Cardiologist</option>
              <option value="Pulmonologist">Pulmonologist</option>
              <option value="Gastroenterologist">Gastroenterologist</option>
              <option value="Endocrinologist">Endocrinologist</option>
              <option value="Nephrologist">Nephrologist</option>
              <option value="Rheumatologist">Rheumatologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Ophthalmologist">Ophthalmologist</option>
              <option value="Optometrist">Optometrist</option>
              <option value="ENT Specialist (Otolaryngologist)">ENT Specialist (Otolaryngologist)</option>
              <option value="Allergist/Immunologist">Allergist/Immunologist</option>
              <option value="Oncologist">Oncologist</option>
              <option value="Hematologist">Hematologist</option>
              <option value="Infectious Disease Specialist">Infectious Disease Specialist</option>
              <option value="Psychiatrist">Psychiatrist</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="yearsOfExperience" className="select-label">Years of Experience</label>
            <input
              type="text"
              id="yearsOfExperience"
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleChange}
              placeholder="e.g., 5"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="languagesSpoken" className="select-label">Languages Spoken</label>
            <input
              type="text"
              id="languagesSpoken"
              name="languagesSpoken"
              value={formData.languagesSpoken}
              onChange={handleChange}
              placeholder="e.g., English, Spanish, French"
              required
            />
          </div>
        </>
      )}
      
      <div className="form-group">
        <input
          type="text"
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Country"
          required
        />
      </div>
      
      <div className="form-group">
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
      
      <div className="step-navigation">
        <button 
          type="button" 
          className="prev-button"
          onClick={prevStep}
        >
          <FaChevronLeft className="button-icon" /> Previous
        </button>
        <button 
          type="submit" 
          className="submit-button"
          disabled={!validateStep3()}
        >
          Sign Up
        </button>
      </div>
    </form>
  );

  // Render the appropriate form based on state
  const renderForm = () => {
    if (isSignIn) {
      return renderSignInForm();
    } else {
      switch (currentStep) {
        case 1:
          return renderSignUpStep1();
        case 2:
          return renderSignUpStep2();
        case 3:
          return renderSignUpStep3();
        default:
          return renderSignUpStep1();
      }
    }
  };

  // Get the appropriate title based on state
  const getFormTitle = () => {
    if (isSignIn) {
      return 'Login';
    } else {
      return `Sign Up - Step ${currentStep} of 3`;
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
        
        <div className="auth-header">
          <h2>{getFormTitle()}</h2>
          {!isSignIn && (
            <div className="step-indicator">
              <div className={`step ${currentStep >= 1 ? 'active' : ''}`}></div>
              <div className={`step ${currentStep >= 2 ? 'active' : ''}`}></div>
              <div className={`step ${currentStep >= 3 ? 'active' : ''}`}></div>
            </div>
          )}
        </div>
        
        {renderForm()}
        
        <div className="auth-footer">
          <p>
            {isSignIn 
              ? "Don't have an account? " 
              : "Already have an account? "}
            <button 
              type="button" 
              className="toggle-form-button"
              onClick={toggleForm}
            >
              {isSignIn ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
