import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEnvelope, FaCheckCircle, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';
import './EmailVerificationPending.css';

const EmailVerificationPending = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('patient');
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [resendError, setResendError] = useState('');

  useEffect(() => {
    if (location.state) {
      setEmail(location.state.email || '');
      setUserType(location.state.userType || 'patient');
    }
  }, [location.state]);

  const handleBackToLogin = () => {
    navigate('/');
  };

  const handleResendEmail = async () => {
    if (!email) {
      setResendError('Email address is required to resend verification email.');
      return;
    }

    setIsResending(true);
    setResendMessage('');
    setResendError('');

    try {
      console.log('Resending verification email for:', email, 'userType:', userType);
      
      const response = await axios.post(
        'https://curamed-auth-api-973580931654.europe-north1.run.app/users/resend-verification-email',
        {
          email: email,
          userType: userType
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Resend email successful:', response.data);
      setResendMessage('Verification email sent successfully! Please check your inbox.');
      
      // Clear the success message after 5 seconds
      setTimeout(() => {
        setResendMessage('');
      }, 5000);

    } catch (error) {
      console.error('Resend email failed:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                            error.response.data?.error || 
                            `Failed to resend email: ${error.response.status}`;
        setResendError(errorMessage);
      } else if (error.request) {
        setResendError('Network error. Please check your connection and try again.');
      } else {
        setResendError('An unexpected error occurred while resending the email.');
      }
      
      // Clear the error message after 5 seconds
      setTimeout(() => {
        setResendError('');
      }, 5000);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="email-verification-pending">
      <div className="verification-container">
        <div className="verification-header">
          <div className="icon-container">
            <FaEnvelope className="email-icon" />
          </div>
          <h1>Check Your Email</h1>
          <p className="subtitle">We've sent a verification link to your email address</p>
        </div>

        <div className="verification-content">
          {email && (
            <div className="email-display">
              <p>We sent a verification email to:</p>
              <strong>{email}</strong>
            </div>
          )}

          <div className="instructions">
            <h3>What's next?</h3>
            <ol>
              <li>
                <FaEnvelope className="step-icon" />
                <span>Check your email inbox (and spam folder)</span>
              </li>
              <li>
                <FaCheckCircle className="step-icon" />
                <span>Click the verification link in the email</span>
              </li>
              <li>
                <FaSpinner className="step-icon" />
                <span>Complete your {userType === 'doctor' ? 'doctor' : 'account'} verification</span>
              </li>
            </ol>
          </div>

          {/* Success/Error Messages */}
          {resendMessage && (
            <div className="message success-message">
              <FaCheckCircle className="message-icon" />
              <span>{resendMessage}</span>
            </div>
          )}

          {resendError && (
            <div className="message error-message">
              <FaExclamationTriangle className="message-icon" />
              <span>{resendError}</span>
            </div>
          )}

          <div className="verification-actions">
            <button 
              className="primary-button"
              onClick={handleResendEmail}
              disabled={isResending || !email}
            >
              {isResending ? (
                <>
                  <FaSpinner className="spinning" />
                  Sending...
                </>
              ) : (
                'Resend Verification Email'
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
            <div className="help-item">
              <FaExclamationTriangle className="help-icon" />
              <div>
                <h4>Didn't receive the email?</h4>
                <p>Check your spam folder or try resending the verification email. If you continue to have issues, please contact our support team.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPending;
