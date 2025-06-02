import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaGoogle, FaCalendarAlt, FaChevronLeft, FaChevronRight, FaUpload, FaUser, FaClock, FaGraduationCap, FaCertificate, FaPaypal, FaCreditCard, FaUniversity, FaGlobe, FaMoneyBillWave, FaFileInvoiceDollar, FaShieldAlt, FaUserMd, FaClipboardCheck, FaIdCard } from 'react-icons/fa';
import './AuthModal.css';

const AuthModal = ({ isOpen = true, onClose }) => {
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

  // List of countries with their codes
  const countries = [
    { name: "Afghanistan", code: "AF" },
    { name: "Albania", code: "AL" },
    { name: "Algeria", code: "DZ" },
    { name: "Andorra", code: "AD" },
    { name: "Angola", code: "AO" },
    { name: "Antigua and Barbuda", code: "AG" },
    { name: "Argentina", code: "AR" },
    { name: "Armenia", code: "AM" },
    { name: "Australia", code: "AU" },
    { name: "Austria", code: "AT" },
    { name: "Azerbaijan", code: "AZ" },
    { name: "Bahamas", code: "BS" },
    { name: "Bahrain", code: "BH" },
    { name: "Bangladesh", code: "BD" },
    { name: "Barbados", code: "BB" },
    { name: "Belarus", code: "BY" },
    { name: "Belgium", code: "BE" },
    { name: "Belize", code: "BZ" },
    { name: "Benin", code: "BJ" },
    { name: "Bhutan", code: "BT" },
    { name: "Bolivia", code: "BO" },
    { name: "Bosnia and Herzegovina", code: "BA" },
    { name: "Botswana", code: "BW" },
    { name: "Brazil", code: "BR" },
    { name: "Brunei", code: "BN" },
    { name: "Bulgaria", code: "BG" },
    { name: "Burkina Faso", code: "BF" },
    { name: "Burundi", code: "BI" },
    { name: "Cabo Verde", code: "CV" },
    { name: "Cambodia", code: "KH" },
    { name: "Cameroon", code: "CM" },
    { name: "Canada", code: "CA" },
    { name: "Central African Republic", code: "CF" },
    { name: "Chad", code: "TD" },
    { name: "Chile", code: "CL" },
    { name: "China", code: "CN" },
    { name: "Colombia", code: "CO" },
    { name: "Comoros", code: "KM" },
    { name: "Congo", code: "CG" },
    { name: "Costa Rica", code: "CR" },
    { name: "Croatia", code: "HR" },
    { name: "Cuba", code: "CU" },
    { name: "Cyprus", code: "CY" },
    { name: "Czech Republic", code: "CZ" },
    { name: "Denmark", code: "DK" },
    { name: "Djibouti", code: "DJ" },
    { name: "Dominica", code: "DM" },
    { name: "Dominican Republic", code: "DO" },
    { name: "Ecuador", code: "EC" },
    { name: "Egypt", code: "EG" },
    { name: "El Salvador", code: "SV" },
    { name: "Equatorial Guinea", code: "GQ" },
    { name: "Eritrea", code: "ER" },
    { name: "Estonia", code: "EE" },
    { name: "Eswatini", code: "SZ" },
    { name: "Ethiopia", code: "ET" },
    { name: "Fiji", code: "FJ" },
    { name: "Finland", code: "FI" },
    { name: "France", code: "FR" },
    { name: "Gabon", code: "GA" },
    { name: "Gambia", code: "GM" },
    { name: "Georgia", code: "GE" },
    { name: "Germany", code: "DE" },
    { name: "Ghana", code: "GH" },
    { name: "Greece", code: "GR" },
    { name: "Grenada", code: "GD" },
    { name: "Guatemala", code: "GT" },
    { name: "Guinea", code: "GN" },
    { name: "Guinea-Bissau", code: "GW" },
    { name: "Guyana", code: "GY" },
    { name: "Haiti", code: "HT" },
    { name: "Honduras", code: "HN" },
    { name: "Hungary", code: "HU" },
    { name: "Iceland", code: "IS" },
    { name: "India", code: "IN" },
    { name: "Indonesia", code: "ID" },
    { name: "Iran", code: "IR" },
    { name: "Iraq", code: "IQ" },
    { name: "Ireland", code: "IE" },
    { name: "Israel", code: "IL" },
    { name: "Italy", code: "IT" },
    { name: "Jamaica", code: "JM" },
    { name: "Japan", code: "JP" },
    { name: "Jordan", code: "JO" },
    { name: "Kazakhstan", code: "KZ" },
    { name: "Kenya", code: "KE" },
    { name: "Kiribati", code: "KI" },
    { name: "Korea, North", code: "KP" },
    { name: "Korea, South", code: "KR" },
    { name: "Kosovo", code: "XK" },
    { name: "Kuwait", code: "KW" },
    { name: "Kyrgyzstan", code: "KG" },
    { name: "Laos", code: "LA" },
    { name: "Latvia", code: "LV" },
    { name: "Lebanon", code: "LB" },
    { name: "Lesotho", code: "LS" },
    { name: "Liberia", code: "LR" },
    { name: "Libya", code: "LY" },
    { name: "Liechtenstein", code: "LI" },
    { name: "Lithuania", code: "LT" },
    { name: "Luxembourg", code: "LU" },
    { name: "Madagascar", code: "MG" },
    { name: "Malawi", code: "MW" },
    { name: "Malaysia", code: "MY" },
    { name: "Maldives", code: "MV" },
    { name: "Mali", code: "ML" },
    { name: "Malta", code: "MT" },
    { name: "Marshall Islands", code: "MH" },
    { name: "Mauritania", code: "MR" },
    { name: "Mauritius", code: "MU" },
    { name: "Mexico", code: "MX" },
    { name: "Micronesia", code: "FM" },
    { name: "Moldova", code: "MD" },
    { name: "Monaco", code: "MC" },
    { name: "Mongolia", code: "MN" },
    { name: "Montenegro", code: "ME" },
    { name: "Morocco", code: "MA" },
    { name: "Mozambique", code: "MZ" },
    { name: "Myanmar", code: "MM" },
    { name: "Namibia", code: "NA" },
    { name: "Nauru", code: "NR" },
    { name: "Nepal", code: "NP" },
    { name: "Netherlands", code: "NL" },
    { name: "New Zealand", code: "NZ" },
    { name: "Nicaragua", code: "NI" },
    { name: "Niger", code: "NE" },
    { name: "Nigeria", code: "NG" },
    { name: "North Macedonia", code: "MK" },
    { name: "Norway", code: "NO" },
    { name: "Oman", code: "OM" },
    { name: "Pakistan", code: "PK" },
    { name: "Palau", code: "PW" },
    { name: "Palestine", code: "PS" },
    { name: "Panama", code: "PA" },
    { name: "Papua New Guinea", code: "PG" },
    { name: "Paraguay", code: "PY" },
    { name: "Peru", code: "PE" },
    { name: "Philippines", code: "PH" },
    { name: "Poland", code: "PL" },
    { name: "Portugal", code: "PT" },
    { name: "Qatar", code: "QA" },
    { name: "Romania", code: "RO" },
    { name: "Russia", code: "RU" },
    { name: "Rwanda", code: "RW" },
    { name: "Saint Kitts and Nevis", code: "KN" },
    { name: "Saint Lucia", code: "LC" },
    { name: "Saint Vincent and the Grenadines", code: "VC" },
    { name: "Samoa", code: "WS" },
    { name: "San Marino", code: "SM" },
    { name: "Sao Tome and Principe", code: "ST" },
    { name: "Saudi Arabia", code: "SA" },
    { name: "Senegal", code: "SN" },
    { name: "Serbia", code: "RS" },
    { name: "Seychelles", code: "SC" },
    { name: "Sierra Leone", code: "SL" },
    { name: "Singapore", code: "SG" },
    { name: "Slovakia", code: "SK" },
    { name: "Slovenia", code: "SI" },
    { name: "Solomon Islands", code: "SB" },
    { name: "Somalia", code: "SO" },
    { name: "South Africa", code: "ZA" },
    { name: "South Sudan", code: "SS" },
    { name: "Spain", code: "ES" },
    { name: "Sri Lanka", code: "LK" },
    { name: "Sudan", code: "SD" },
    { name: "Suriname", code: "SR" },
    { name: "Sweden", code: "SE" },
    { name: "Switzerland", code: "CH" },
    { name: "Syria", code: "SY" },
    { name: "Taiwan", code: "TW" },
    { name: "Tajikistan", code: "TJ" },
    { name: "Tanzania", code: "TZ" },
    { name: "Thailand", code: "TH" },
    { name: "Timor-Leste", code: "TL" },
    { name: "Togo", code: "TG" },
    { name: "Tonga", code: "TO" },
    { name: "Trinidad and Tobago", code: "TT" },
    { name: "Tunisia", code: "TN" },
    { name: "Turkey", code: "TR" },
    { name: "Turkmenistan", code: "TM" },
    { name: "Tuvalu", code: "TV" },
    { name: "Uganda", code: "UG" },
    { name: "Ukraine", code: "UA" },
    { name: "United Arab Emirates", code: "AE" },
    { name: "United Kingdom", code: "GB" },
    { name: "United States", code: "US" },
    { name: "Uruguay", code: "UY" },
    { name: "Uzbekistan", code: "UZ" },
    { name: "Vanuatu", code: "VU" },
    { name: "Vatican City", code: "VA" },
    { name: "Venezuela", code: "VE" },
    { name: "Vietnam", code: "VN" },
    { name: "Yemen", code: "YE" },
    { name: "Zambia", code: "ZM" },
    { name: "Zimbabwe", code: "ZW" }
  ];

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
      dateInputRef.current.value = '';
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate email before submission
    if (!validateEmail(formData.email)) {
      setFormErrors(prev => ({
        ...prev,
        email: 'Please enter a valid email address'
      }));
      return;
    }
    
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
    return formData.country && formData.city;
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
        <div className="form-group form-field">
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
          
          <div className="form-group form-field">
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
          
          <div className="form-group form-field">
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
      ) : (
        <>
          <div className="form-group form-field">
            <label htmlFor="country" className="select-label">Country</label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="select-input"
              required
            >
              <option value="" disabled>Select your country</option>
              {countries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          
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
        </>
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
            disabled={!validateStep3()}
          >
            Sign Up
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
      
      <div className="form-group form-field">
        <label htmlFor="country" className="select-label">Practice Location</label>
        <select
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          className="select-input"
          required
        >
          <option value="" disabled>Select your country</option>
          {countries.map(country => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>
      
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
      <div className="form-group form-field">
        <label htmlFor="timeZone" className="select-label">
          <FaClock className="field-icon" /> Time Zone
        </label>
        <select
          id="timeZone"
          name="timeZone"
          value={formData.timeZone}
          onChange={handleChange}
          className="select-input"
          required
        >
          <option value="" disabled>Select your time zone</option>
          <option value="UTC-12:00">(UTC-12:00) International Date Line West</option>
          <option value="UTC-11:00">(UTC-11:00) Coordinated Universal Time-11</option>
          <option value="UTC-10:00">(UTC-10:00) Hawaii</option>
          <option value="UTC-09:00">(UTC-09:00) Alaska</option>
          <option value="UTC-08:00">(UTC-08:00) Pacific Time (US & Canada)</option>
          <option value="UTC-07:00">(UTC-07:00) Mountain Time (US & Canada)</option>
          <option value="UTC-06:00">(UTC-06:00) Central Time (US & Canada)</option>
          <option value="UTC-05:00">(UTC-05:00) Eastern Time (US & Canada)</option>
          <option value="UTC-04:00">(UTC-04:00) Atlantic Time (Canada)</option>
          <option value="UTC-03:00">(UTC-03:00) Brasilia</option>
          <option value="UTC-02:00">(UTC-02:00) Coordinated Universal Time-02</option>
          <option value="UTC-01:00">(UTC-01:00) Azores</option>
          <option value="UTC+00:00">(UTC+00:00) London, Dublin, Edinburgh</option>
          <option value="UTC+01:00">(UTC+01:00) Berlin, Paris, Rome, Madrid</option>
          <option value="UTC+02:00">(UTC+02:00) Athens, Istanbul, Helsinki</option>
          <option value="UTC+03:00">(UTC+03:00) Moscow, St. Petersburg</option>
          <option value="UTC+04:00">(UTC+04:00) Dubai, Abu Dhabi</option>
          <option value="UTC+05:00">(UTC+05:00) Islamabad, Karachi</option>
          <option value="UTC+05:30">(UTC+05:30) New Delhi, Mumbai</option>
          <option value="UTC+06:00">(UTC+06:00) Dhaka</option>
          <option value="UTC+07:00">(UTC+07:00) Bangkok, Jakarta</option>
          <option value="UTC+08:00">(UTC+08:00) Beijing, Hong Kong, Singapore</option>
          <option value="UTC+09:00">(UTC+09:00) Tokyo, Seoul</option>
          <option value="UTC+10:00">(UTC+10:00) Sydney, Melbourne</option>
          <option value="UTC+11:00">(UTC+11:00) Vladivostok</option>
          <option value="UTC+12:00">(UTC+12:00) Auckland, Wellington</option>
        </select>
      </div>
      
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
      <div className="form-group form-field">
        <label className="select-label">
          <FaMoneyBillWave className="field-icon" /> Payout Method
        </label>
        <div className="payout-method-selector">
          <label className={`payout-method-option ${formData.payoutMethod === 'paypal' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="payoutMethod"
              value="paypal"
              checked={formData.payoutMethod === 'paypal'}
              onChange={handleChange}
            />
            <FaPaypal className="payout-icon" />
            <span>PayPal</span>
          </label>
          <label className={`payout-method-option ${formData.payoutMethod === 'stripe' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="payoutMethod"
              value="stripe"
              checked={formData.payoutMethod === 'stripe'}
              onChange={handleChange}
            />
            <FaCreditCard className="payout-icon" />
            <span>Stripe</span>
          </label>
          <label className={`payout-method-option ${formData.payoutMethod === 'bank' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="payoutMethod"
              value="bank"
              checked={formData.payoutMethod === 'bank'}
              onChange={handleChange}
            />
            <FaUniversity className="payout-icon" />
            <span>Bank</span>
          </label>
        </div>
      </div>
      
      {formData.payoutMethod === 'paypal' && (
        <div className="form-group form-field">
          <label htmlFor="paypalEmail" className="select-label">
            <FaPaypal className="field-icon" /> PayPal Email
          </label>
          <input
            type="email"
            id="paypalEmail"
            name="paypalEmail"
            value={formData.paypalEmail}
            onChange={handleChange}
            placeholder="Enter your PayPal email address"
            required
          />
          {formData.paypalEmail && !validateEmail(formData.paypalEmail) && (
            <div className="error-message">Please enter a valid email address</div>
          )}
        </div>
      )}
      
      {formData.payoutMethod === 'bank' && (
        <>
          <div className="form-group form-field">
            <label htmlFor="bankName" className="select-label">
              <FaUniversity className="field-icon" /> Bank Name
            </label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              placeholder="Enter your bank name"
              required
            />
          </div>
          
          <div className="form-group form-field">
            <label htmlFor="accountNumber" className="select-label">
              <FaUniversity className="field-icon" /> Account Number
            </label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              placeholder="Enter your account number"
              required
            />
          </div>
          
          <div className="form-group form-field">
            <label htmlFor="routingNumber" className="select-label">
              <FaUniversity className="field-icon" /> Routing Number / IBAN
            </label>
            <input
              type="text"
              id="routingNumber"
              name="routingNumber"
              value={formData.routingNumber}
              onChange={handleChange}
              placeholder="Enter routing number or IBAN"
              required
            />
          </div>
          
          <div className="form-group form-field">
            <label htmlFor="swiftCode" className="select-label">
              <FaUniversity className="field-icon" /> SWIFT/BIC Code <span className="optional-label">(for international transfers)</span>
            </label>
            <input
              type="text"
              id="swiftCode"
              name="swiftCode"
              value={formData.swiftCode}
              onChange={handleChange}
              placeholder="Enter SWIFT/BIC code if applicable"
            />
          </div>
        </>
      )}
      
      {formData.payoutMethod === 'stripe' && (
        <div className="stripe-info">
          <p className="info-text">
            <FaCreditCard className="info-icon" /> You'll be redirected to set up your Stripe account after completing registration.
          </p>
        </div>
      )}
      
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
      
      <div className="form-group form-field">
        <label htmlFor="taxResidenceCountry" className="select-label">
          <FaGlobe className="field-icon" /> Country of Tax Residence
        </label>
        <select
          id="taxResidenceCountry"
          name="taxResidenceCountry"
          value={formData.taxResidenceCountry}
          onChange={handleChange}
          className="select-input"
          required
        >
          <option value="" disabled>Select your country of tax residence</option>
          {countries.map(country => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>
      
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
          <option value="USD">USD - US Dollar</option>
          <option value="EUR">EUR - Euro</option>
          <option value="GBP">GBP - British Pound</option>
          <option value="CAD">CAD - Canadian Dollar</option>
          <option value="AUD">AUD - Australian Dollar</option>
          <option value="JPY">JPY - Japanese Yen</option>
          <option value="CHF">CHF - Swiss Franc</option>
          <option value="CNY">CNY - Chinese Yuan</option>
          <option value="INR">INR - Indian Rupee</option>
          <option value="SGD">SGD - Singapore Dollar</option>
          <option value="AED">AED - UAE Dirham</option>
        </select>
      </div>
      
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
