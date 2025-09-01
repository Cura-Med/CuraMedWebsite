import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaSpinner, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { openAuthModal } from '../features/modal/modalSlice';
import axios from 'axios';
import './EmailVerification.css';

const EmailVerification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [isRetrying, setIsRetrying] = useState(false);

  const userId = searchParams.get('userId');
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (userId && token && email) {
      verifyEmail();
    } else {
      setVerificationStatus('error');
      setErrorMessage('Invalid verification link. Missing required parameters (userId, token, or email).');
    }
  }, [userId, token, email]);

  const verifyEmail = async () => {
    try {
      setVerificationStatus('loading');
      
      console.log('Verifying email for user:', userId, 'with email:', email);
      
      const response = await axios.post(
        `https://curamed-auth-api-973580931654.europe-north1.run.app/users/${userId}/complete-registration`,
        {
          email: email
        },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
        }
      );

      console.log('Email verification successful:', response.data);
      setVerificationStatus('success');
      
      setTimeout(() => {
        navigate('/', { 
          state: { 
            message: 'Email verified successfully! You can now log in.',
            email: email 
          } 
        });
      }, 3000);

    } catch (error) {
      console.error('Email verification failed:', error);
      
      setVerificationStatus('error');
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                            error.response.data?.error || 
                            `Verification failed: ${error.response.status}`;
        setErrorMessage(errorMessage);
      } else if (error.request) {
        setErrorMessage('Network error. Please check your connection and try again.');
      } else {
        setErrorMessage('An unexpected error occurred during verification.');
      }
    }
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    await verifyEmail();
    setIsRetrying(false);
  };

  const handleBackToLogin = () => {
    dispatch(openAuthModal());
  };

  const renderLoadingState = () => (
    <div className="verification-state loading-state">
      <div className="icon-container">
        <FaSpinner className="loading-icon spinning" />
      </div>
      <h1>Verifying Your Email</h1>
      <p>Please wait while we verify your email address...</p>
      <div className="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );

  const renderSuccessState = () => (
    <div className="verification-state success-state">
      <div className="icon-container">
        <FaCheckCircle className="success-icon" />
      </div>
      <h1>Email Verified Successfully!</h1>
      <p>Your email has been verified and your account is now active.</p>
      {email && (
        <div className="email-display">
          <strong>{email}</strong>
        </div>
      )}
      <div className="success-message">
        <p>You will be redirected to the login page in a few seconds...</p>
      </div>
      <button 
        className="primary-button"
        onClick={handleBackToLogin}
      >
        Go to Login Now
      </button>
    </div>
  );

  const renderErrorState = () => (
    <div className="verification-state error-state">
      <div className="icon-container">
        <FaExclamationTriangle className="error-icon" />
      </div>
      <h1>Verification Failed</h1>
      <p>We couldn't verify your email address.</p>
      
      <div className="error-details">
        <div className="error-message">
          <FaTimes className="error-detail-icon" />
          <span>{errorMessage}</span>
        </div>
      </div>

      <div className="error-actions">
        <button 
          className="primary-button"
          onClick={handleRetry}
          disabled={isRetrying}
        >
          {isRetrying ? (
            <>
              <FaSpinner className="spinning" />
              Retrying...
            </>
          ) : (
            'Try Again'
          )}
        </button>
        
        <button 
          className="secondary-button"
          onClick={handleBackToLogin}
        >
          Back to Login
        </button>
      </div>

      <div className="help-section">
        <h4>Need help?</h4>
        <p>If you continue to experience issues, please contact our support team or try requesting a new verification email.</p>
      </div>
    </div>
  );

  return (
    <div className="email-verification">
      <div className="verification-container">
        {verificationStatus === 'loading' && renderLoadingState()}
        {verificationStatus === 'success' && renderSuccessState()}
        {verificationStatus === 'error' && renderErrorState()}
      </div>
    </div>
  );
};

export default EmailVerification;
