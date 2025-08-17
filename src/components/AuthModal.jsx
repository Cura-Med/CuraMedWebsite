import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaGoogle, FaCalendarAlt, FaChevronLeft, FaChevronRight, FaUpload, FaUser, FaClock, FaGraduationCap, FaCertificate, FaPaypal, FaCreditCard, FaUniversity, FaGlobe, FaMoneyBillWave, FaFileInvoiceDollar, FaShieldAlt, FaUserMd, FaClipboardCheck, FaIdCard } from 'react-icons/fa';
import Select from 'react-select';
import axios from 'axios';
import CountrySelect from './CountrySelect'; 
import GenderSelect from './GenderSelect'; 
import DoctorTitleSelect from './DoctorTitleSelect';
import SpecialtySelect from './SpecialtySelect';
import LanguagesMultiSelect from './LanguagesMultiSelect';
import TimeZoneSelect from './TimeZoneSelect';
import PayoutMethodSelector from './PayoutMethodSelector';
import CurrencySelect from './CurrencySelect';
import './AuthModal.css';
import {fetchUserMe, loginUser} from '../features/auth/authSlice';
import {useDispatch, useSelector} from "react-redux";

const AuthModal = ({ isOpen = true, onClose }) => {
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const user = useSelector(state => state.auth.user);
  const [isSignIn, setIsSignIn] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState('patient');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
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
    city: '',
    shortBio: '',
    clinicAddress: '',
    timeZone: '',
    availabilitySlots: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    },
    medicalSchool: '',
    graduationYear: '',
    postGraduateTraining: '',
    certifications: '',
    payoutMethod: '',
    paypalEmail: '',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    swiftCode: '',
    taxIdentificationNumber: '',
    billingCurrency: 'USD',
    taxResidenceCountry: '',
    consentTelehealth: false,
    consentHIPAA: false,
    consentPlatformRules: false,
    consentBackgroundCheck: false
  });
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [selectedDay, setSelectedDay] = useState('monday');
  const [timeSlot, setTimeSlot] = useState({ start: '09:00', end: '10:00' });
  const fileInputRef = useRef(null);
  const dateInputRef = useRef(null);

  if (!isOpen) return null;

  // Function to validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Function to get date 18 years ago in YYYY-MM-DD format
  const getDefaultDate = () => {
    const today = new Date();
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    
    const year = eighteenYearsAgo.getFullYear();
    const month = String(eighteenYearsAgo.getMonth() + 1).padStart(2, '0');
    const day = String(eighteenYearsAgo.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  // Handle date input focus to set default date
  const handleDateFocus = () => {
    // Set the default date when the calendar is opened
    if (dateInputRef.current) {
      dateInputRef.current.defaultValue = getDefaultDate();
    }
  };

  // Handle date input blur to reset if no selection was made
  const handleDateBlur = (e) => {
    // If the user didn't select a date (just opened and closed the calendar)
    // and there was no previous selection, reset to empty
    if (!formData.dateOfBirth && dateInputRef.current) {
      //dateInputRef.current.value = '';
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear submit error when user starts typing
    if (submitError) {
      setSubmitError('');
    }
    
    // Validate email field
    if (name === 'email') {
      if (!value.trim()) {
        setFormErrors(prev => ({
          ...prev,
          email: 'Email is required'
        }));
      } else if (!validateEmail(value)) {
        setFormErrors(prev => ({
          ...prev,
          email: 'Please enter a valid email address'
        }));
      } else {
        setFormErrors(prev => ({
          ...prev,
          email: ''
        }));
      }
    }
    
    // Validate password confirmation
    if (name === 'password' || name === 'confirmPassword') {
      if (name === 'password') {
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          setFormErrors(prev => ({
            ...prev,
            confirmPassword: 'Passwords do not match'
          }));
        } else if (formData.confirmPassword) {
          setFormErrors(prev => ({
            ...prev,
            confirmPassword: ''
          }));
        }
      } else if (name === 'confirmPassword') {
        if (value !== formData.password) {
          setFormErrors(prev => ({
            ...prev,
            confirmPassword: 'Passwords do not match'
          }));
        } else {
          setFormErrors(prev => ({
            ...prev,
            confirmPassword: ''
          }));
        }
      }
    }
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

  // Register user function
  const registerUser = async (userData) => {
    try {
      const response = await axios.post(
        'https://curamed-auth-api-973580931654.europe-north1.run.app/users/register',
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || 
                            error.response.data?.error || 
                            `Registration failed: ${error.response.status}`;
        throw new Error(errorMessage);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('Network error. Please check your connection and try again.');
      } else {
        // Something else happened
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email before submission
    if (!validateEmail(formData.email)) {
      setFormErrors(prev => ({
        ...prev,
        email: 'Please enter a valid email address'
      }));
      return;
    }

    // For patient registration, prepare the data according to API format
    if (userType === 'patient') {
      setIsSubmitting(true);
      setSubmitError('');

      try {
        // Convert date format from YYYY-MM-DD to ISO string
        const birthdayISO = new Date(formData.dateOfBirth).toISOString();

        const registrationData = {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          password: formData.password,
          birthday: birthdayISO,
          sexTypeId: parseInt(formData.gender),
          countryId: parseInt(formData.country),
          city: formData.city,
          timeZoneId: parseInt(formData.timeZone)
        };

        console.log('Registering user with data:', registrationData);
        
        const result = await registerUser(registrationData);
        console.log('Registration successful:', result);
        
        // Handle successful registration
        alert('Registration successful! Please check your email for verification.');
        onClose();
        
      } catch (error) {
        console.error('Registration failed:', error);
        setSubmitError(error.message);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // For doctors, just log the data for now (you can implement doctor registration later)
      console.log('Doctor registration not implemented yet:', formData);
      alert('Doctor registration will be implemented soon!');
    }
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
    setSubmitError('');
    // Reset form data and errors when switching between forms
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
      city: '',
      shortBio: '',
      clinicAddress: '',
      timeZone: '',
      availabilitySlots: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
      },
      medicalSchool: '',
      graduationYear: '',
      postGraduateTraining: '',
      certifications: '',
      payoutMethod: '',
      paypalEmail: '',
      bankName: '',
      accountNumber: '',
      routingNumber: '',
      swiftCode: '',
      taxIdentificationNumber: '',
      billingCurrency: 'USD',
      taxResidenceCountry: '',
      consentTelehealth: false,
      consentHIPAA: false,
      consentPlatformRules: false,
      consentBackgroundCheck: false
    });
    setFormErrors({
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const handleDaySelect = (day) => {
    setSelectedDay(day);
  };

  const handleTimeSlotChange = (e) => {
    const { name, value } = e.target;
    setTimeSlot(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addTimeSlot = () => {
    if (timeSlot.start && timeSlot.end) {
      const newSlot = `${timeSlot.start} - ${timeSlot.end}`;
      
      // Check if this slot already exists for the selected day
      if (!formData.availabilitySlots[selectedDay].includes(newSlot)) {
        setFormData(prev => ({
          ...prev,
          availabilitySlots: {
            ...prev.availabilitySlots,
            [selectedDay]: [...prev.availabilitySlots[selectedDay], newSlot]
          }
        }));
      }
    }
  };

  const removeTimeSlot = (day, slot) => {
    setFormData(prev => ({
      ...prev,
      availabilitySlots: {
        ...prev.availabilitySlots,
        [day]: prev.availabilitySlots[day].filter(s => s !== slot)
      }
    }));
  };

  // Validation for each step
  const validateStep1 = () => {
    // Check if email is valid
    const isEmailValid = formData.email && validateEmail(formData.email) && !formErrors.email;
    
    // Check if password fields are valid
    const isPasswordValid = formData.password && formData.confirmPassword && 
                           formData.password === formData.confirmPassword && !formErrors.confirmPassword;
    
    const basicValidation = isEmailValid && isPasswordValid;
    
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
             formData.yearsOfExperience && formData.languagesSpoken;
    }
    // For patients, we need country, city, and timeZone for the API
    return formData.country && formData.city && formData.timeZone;
  };

  const validateStep4 = () => {
    // Require country, city, and short bio for doctors
    // Clinic address is optional
    return formData.country && formData.city && formData.shortBio;
  };

  const validateStep5 = () => {
    // Require time zone, medical school, graduation year
    // At least one availability slot
    const hasTimeSlots = Object.values(formData.availabilitySlots).some(slots => slots.length > 0);
    return formData.timeZone && formData.medicalSchool && 
           formData.graduationYear && hasTimeSlots;
  };

  const validateStep6 = () => {
    // Validate based on selected payout method
    const baseValidation = formData.payoutMethod && formData.taxIdentificationNumber && 
                          formData.billingCurrency && formData.taxResidenceCountry;
    
    if (formData.payoutMethod === 'paypal') {
      return baseValidation && formData.paypalEmail && validateEmail(formData.paypalEmail);
    } else if (formData.payoutMethod === 'bank') {
      return baseValidation && formData.bankName && formData.accountNumber && 
             formData.routingNumber;
    } else if (formData.payoutMethod === 'stripe') {
      // For Stripe, we'll assume additional setup happens later
      return baseValidation;
    }
    
    return false;
  };

  const validateStep7 = () => {
    // All consent checkboxes must be checked
    return formData.consentTelehealth && 
           formData.consentHIPAA && 
           formData.consentPlatformRules && 
           formData.consentBackgroundCheck;
  };

  // Render sign-in form
  const renderSignInForm = () => (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="form-group form-field">
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className={formErrors.email ? 'input-error' : ''}
          required
        />
        {formErrors.email && <div className="error-message">{formErrors.email}</div>}
      </div>
      
      <div className="form-group form-field">
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
      
      <button 
        type="submit" 
        className="submit-button"
        disabled={!formData.email || !formData.password || formErrors.email}
      >
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
      
      <div className="form-group form-field">
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className={formErrors.email ? 'input-error' : ''}
          required
        />
        {formErrors.email && <div className="error-message">{formErrors.email}</div>}
      </div>
      
      <div className="form-group form-field">
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
      
      <div className="form-group form-field">
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          className={formErrors.confirmPassword ? 'input-error' : ''}
          required
        />
        {formErrors.confirmPassword && <div className="error-message">{formErrors.confirmPassword}</div>}
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
        Next
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
        <DoctorTitleSelect
          value={formData.title}
          onChange={handleChange}
          placeholder="Select your title"
          loadingLabel="Loading titles..."
        />
      )}
      
      <div className="form-group form-field">
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
      
      <div className="form-group form-field">
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
      
      <div className="form-group form-field">
        <label className="select-label">Mobile Number (Incl. Country Code)</label>
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
      </div>
      
      <div className="form-group date-group form-field">
        <label htmlFor="dateOfBirth" className="select-label">Date of Birth</label>
        <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          onFocus={handleDateFocus}
          onBlur={handleDateBlur}
          ref={dateInputRef}
          placeholder="Date of Birth"
          required
        />
        <FaCalendarAlt className="calendar-icon" />
      </div>
      
      <GenderSelect formData={formData} handleChange={handleChange} />
      
      <div className="step-navigation">
        <button 
          type="button" 
          className="prev-button"
          onClick={prevStep}
        >
          Previous
        </button>
        <button 
          type="button" 
          className="next-button"
          onClick={nextStep}
          disabled={!validateStep2()}
        >
          Next
        </button>
      </div>
    </form>
  );

  // Render sign-up step 3
  const renderSignUpStep3 = () => (
    <form className="auth-form">
      {userType === 'doctor' ? (
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
          
          <SpecialtySelect id="specialty" name="specialty" value={formData.specialty} onChange={handleChange} />
          
          <div className="form-group form-field">
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
          
          <LanguagesMultiSelect value={formData.languagesSpoken} onChange={handleChange} />

        </>
      ) : (
        <>
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
        </>
      )}
      
      {/* Show error message if registration fails */}
      {submitError && (
        <div className="error-message" style={{ marginBottom: '16px', textAlign: 'center' }}>
          {submitError}
        </div>
      )}
      
      <div className="step-navigation">
        <button 
          type="button" 
          className="prev-button"
          onClick={prevStep}
        >
          Previous
        </button>
        {userType === 'doctor' ? (
          <button 
            type="button" 
            className="next-button"
            onClick={nextStep}
            disabled={!validateStep3()}
          >
            Next
          </button>
        ) : (
          <button 
            type="submit" 
            className="submit-button"
            onClick={handleSubmit}
            disabled={!validateStep3() || isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        )}
      </div>
    </form>
  );

  // Render sign-up step 4 (for doctors only)
  const renderSignUpStep4 = () => (
    <form className="auth-form">
      <div className="form-group form-field">
        <label htmlFor="shortBio" className="select-label">Short biography</label>
        <textarea
          id="shortBio"
          name="shortBio"
          value={formData.shortBio}
          onChange={handleChange}
          placeholder="Tell us about your professional background and approach to patient care..."
          className="textarea-input"
          rows="4"
          required
        ></textarea>
      </div>
      
      <CountrySelect
        label="Practice Location"
        id="practiceCountry"
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
      
      <div className="form-group form-field">
        <label htmlFor="clinicAddress" className="select-label">Clinic Address <span className="optional-label">(optional)</span></label>
        <input
          type="text"
          id="clinicAddress"
          name="clinicAddress"
          value={formData.clinicAddress}
          onChange={handleChange}
          placeholder="Street address of your clinic or practice"
        />
      </div>
      
      <div className="step-navigation">
        <button 
          type="button" 
          className="prev-button"
          onClick={prevStep}
        >
          Previous
        </button>
        <button 
          type="button" 
          className="next-button"
          onClick={nextStep}
          disabled={!validateStep4()}
        >
          Next
        </button>
      </div>
    </form>
  );

  // Render sign-up step 5 (for doctors only)
  const renderSignUpStep5 = () => (
    <form className="auth-form">
      <TimeZoneSelect value={formData.timeZone} onChange={handleChange} />
      
      <div className="form-group form-field">
        <label className="select-label">
          <FaClock className="field-icon" /> Consultation Availability
        </label>
        <div className="availability-container">
          <div className="day-selector">
            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
              <button
                key={day}
                type="button"
                className={`day-button ${selectedDay === day ? 'selected' : ''}`}
                onClick={() => handleDaySelect(day)}
              >
                {day.charAt(0).toUpperCase() + day.slice(1, 3)}
              </button>
            ))}
          </div>
          
          <div className="time-slot-selector">
            <div className="time-inputs">
              <div className="time-input-group">
                <label>Start</label>
                <input
                  type="time"
                  name="start"
                  value={timeSlot.start}
                  onChange={handleTimeSlotChange}
                  className="time-input"
                />
              </div>
              <div className="time-input-group">
                <label>End</label>
                <input
                  type="time"
                  name="end"
                  value={timeSlot.end}
                  onChange={handleTimeSlotChange}
                  className="time-input"
                />
              </div>
              <button
                type="button"
                className="add-slot-button"
                onClick={addTimeSlot}
              >
                Add
              </button>
            </div>
            
            <div className="selected-slots">
              <h4>Selected time slots for {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}</h4>
              {formData.availabilitySlots[selectedDay].length > 0 ? (
                <ul className="slot-list">
                  {formData.availabilitySlots[selectedDay].map((slot, index) => (
                    <li key={index} className="slot-item">
                      <span>{slot}</span>
                      <button
                        type="button"
                        className="remove-slot-button"
                        onClick={() => removeTimeSlot(selectedDay, slot)}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-slots-message">No time slots added yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="form-group form-field">
        <label htmlFor="medicalSchool" className="select-label">
          <FaGraduationCap className="field-icon" /> Medical School
        </label>
        <input
          type="text"
          id="medicalSchool"
          name="medicalSchool"
          value={formData.medicalSchool}
          onChange={handleChange}
          placeholder="e.g., Harvard Medical School"
          required
        />
      </div>
      
      <div className="form-group form-field">
        <label htmlFor="graduationYear" className="select-label">
          <FaGraduationCap className="field-icon" /> Graduation Year
        </label>
        <select
          id="graduationYear"
          name="graduationYear"
          value={formData.graduationYear}
          onChange={handleChange}
          className="select-input"
          required
        >
          <option value="" disabled>Select graduation year</option>
          {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      
      <div className="form-group form-field">
        <label htmlFor="postGraduateTraining" className="select-label">
          <FaGraduationCap className="field-icon" /> Post-Graduate Training <span className="optional-label">(optional)</span>
        </label>
        <textarea
          id="postGraduateTraining"
          name="postGraduateTraining"
          value={formData.postGraduateTraining}
          onChange={handleChange}
          placeholder="e.g., Residency at Mayo Clinic (2015-2018), Fellowship at Johns Hopkins (2018-2020)"
          className="textarea-input"
          rows="3"
        ></textarea>
      </div>
      
      <div className="form-group form-field">
        <label htmlFor="certifications" className="select-label">
          <FaCertificate className="field-icon" /> Certifications <span className="optional-label">(optional)</span>
        </label>
        <textarea
          id="certifications"
          name="certifications"
          value={formData.certifications}
          onChange={handleChange}
          placeholder="e.g., Board Certified in Internal Medicine, Advanced Cardiac Life Support (ACLS)"
          className="textarea-input"
          rows="3"
        ></textarea>
      </div>
      
      <div className="step-navigation">
        <button 
          type="button" 
          className="prev-button"
          onClick={prevStep}
        >
          Previous
        </button>
        <button 
          type="button" 
          className="next-button"
          onClick={nextStep}
          disabled={!validateStep5()}
        >
          Next
        </button>
      </div>
    </form>
  );

  // Render sign-up step 6 (for doctors only - payment and tax info)
  const renderSignUpStep6 = () => (
    <form className="auth-form">
      <PayoutMethodSelector
        formData={formData}
        setFormData={setFormData}
        handleChange={handleChange}
      />
      
      <div className="form-group form-field">
        <label htmlFor="taxIdentificationNumber" className="select-label">
          <FaFileInvoiceDollar className="field-icon" /> Tax Identification Number
        </label>
        <input
          type="text"
          id="taxIdentificationNumber"
          name="taxIdentificationNumber"
          value={formData.taxIdentificationNumber}
          onChange={handleChange}
          placeholder="TIN, SSN, or other tax ID"
          required
        />
        <p className="field-hint">For U.S. doctors, enter your SSN or TIN. For Estonian doctors, enter your Social Security Number.</p>
      </div>
      
      <CountrySelect
        label="Country of Tax Residence"
        id="taxResidenceCountry"
        name="taxResidenceCountry"
        value={formData.taxResidenceCountry}
        onChange={handleChange}
        placeholder="Select your country of tax residence"
        icon={FaGlobe}
      />
      
      <CurrencySelect formData={formData} handleChange={handleChange} />
      
      <div className="tax-disclaimer">
        <p>By submitting this form, you confirm that the tax information provided is accurate and complete. You understand that you are responsible for reporting and paying any applicable taxes on income earned through our platform according to the laws of your country of tax residence.</p>
      </div>
      
      <div className="step-navigation">
        <button 
          type="button" 
          className="prev-button"
          onClick={prevStep}
        >
          Previous
        </button>
        <button 
          type="button" 
          className="next-button"
          onClick={nextStep}
          disabled={!validateStep6()}
        >
          Next
        </button>
      </div>
    </form>
  );

  // Render sign-up step 7 (for doctors only - consent checkboxes)
  const renderSignUpStep7 = () => (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="consent-section">
        <h3 className="consent-title">Legal Agreements and Consents</h3>
        <p className="consent-intro">Please review and agree to the following terms to complete your registration as a healthcare provider on our platform.</p>
        
        <div className="consent-item">
          <div className="consent-header">
            <FaUserMd className="consent-icon" />
            <h4>Telehealth Terms of Service</h4>
          </div>
          <div className="consent-content">
            <p>By checking this box, you agree to our Telehealth Terms of Service, which govern the provision of telehealth services through our platform. This includes guidelines for virtual consultations, patient communication, and documentation requirements.</p>
            <button type="button" className="view-terms-button">View Full Terms</button>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="consentTelehealth"
                  checked={formData.consentTelehealth}
                  onChange={handleChange}
                  required
                />
                <span>I agree to the Telehealth Terms</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="consent-item">
          <div className="consent-header">
            <FaShieldAlt className="consent-icon" />
            <h4>GDPR Compliance</h4>
          </div>
          <div className="consent-content">
            <p>You agree to comply with all applicable privacy laws, including the General Data Protection Regulation (GDPR) applicable in the European Union. This includes ensuring the lawful collection, processing, and storage of personal data, maintaining data subject confidentiality, implementing appropriate security measures to protect personal data, and promptly reporting any personal data breaches to the relevant supervisory authorities and affected individuals, as required by law.</p>
            <button type="button" className="view-terms-button">View Privacy Policy</button>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="consentHIPAA"
                  checked={formData.consentHIPAA}
                  onChange={handleChange}
                  required
                />
                <span>I agree to comply with GDPR</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="consent-item">
          <div className="consent-header">
            <FaClipboardCheck className="consent-icon" />
            <h4>Platform Rules and Patient Care Standards</h4>
          </div>
          <div className="consent-content">
            <p>You agree to adhere to our platform's professional standards, clinical guidelines, and code of conduct. This includes maintaining professional communication, providing evidence-based care, and following best practices for telehealth consultations.</p>
            <button type="button" className="view-terms-button">View Platform Rules</button>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="consentPlatformRules"
                  checked={formData.consentPlatformRules}
                  onChange={handleChange}
                  required
                />
                <span>I agree to platform rules and standards</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="consent-item">
          <div className="consent-header">
            <FaIdCard className="consent-icon" />
            <h4>Background Checks and Verification</h4>
          </div>
          <div className="consent-content">
            <p>You consent to credential verification, background checks, and ongoing monitoring of your professional standing. This includes verification of your medical license, education, professional history, and criminal background check where applicable.</p>
            <button type="button" className="view-terms-button">View Verification Process</button>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="consentBackgroundCheck"
                  checked={formData.consentBackgroundCheck}
                  onChange={handleChange}
                  required
                />
                <span>I agree to background screening </span>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="step-navigation">
        <button 
          type="button" 
          className="prev-button"
          onClick={prevStep}
        >
          Previous
        </button>
        <button 
          type="submit" 
          className="submit-button"
          disabled={!validateStep7()}
        >
          Complete Registration
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
        case 4:
          return renderSignUpStep4();
        case 5:
          return renderSignUpStep5();
        case 6:
          return renderSignUpStep6();
        case 7:
          return renderSignUpStep7();
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
      // For doctors, we have 7 steps, for patients we have 3
      const totalSteps = userType === 'doctor' ? 7 : 3;
      return `Sign Up - Step ${currentStep} of ${totalSteps}`;
    }
  };

  // Get the appropriate step indicators based on user type
  const renderStepIndicators = () => {
    const totalSteps = userType === 'doctor' ? 7 : 3;
    
    return (
      <div className="step-indicator">
        {[...Array(totalSteps)].map((_, index) => (
          <div 
            key={index} 
            className={`step ${currentStep >= index + 1 ? 'active' : ''}`}
          ></div>
        ))}
      </div>
    );
  };

  return (
    <div id={'lool'}>
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
        
        <div className="auth-header">
          <h2>{getFormTitle()}</h2>
          {!isSignIn && renderStepIndicators()}
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
    </div>
  );
};

export default AuthModal;
