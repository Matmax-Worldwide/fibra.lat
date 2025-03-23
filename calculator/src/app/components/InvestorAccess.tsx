import React, { useState } from 'react';
import '../styles.css';

export function InvestorAccess() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Always show error message regardless of email/password validation
      setLoginError('Invalid credentials. Please try again.');
    }, 1500);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setForgotPasswordError('');
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Always show error message regardless of email validation
      setForgotPasswordError('Password not recognized. Please try again or contact support.');
    }, 1500);
  };

  return (
    <div className="investor-access-container">
      <div className="login-container">
        <div className="login-header">
          <div className="logo-container">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="60" height="60" rx="12" fill="#1E40AF"/>
              <path d="M12 20H48M12 30H48M12 40H48" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              <path d="M18 15L18 45M30 15L30 45M42 15V45" stroke="white" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 5"/>
            </svg>
          </div>
          <h1>Member Access</h1>
          <h2>Grupos Societarios Asociados</h2>
        </div>

        {loginSuccess ? (
          <div className="success-container">
            <div className="success-icon">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="28" fill="#10B981" fillOpacity="0.2"/>
                <path d="M20 32L28 40L44 24" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Login Successful</h3>
            <p>Welcome back, {email.split('@')[0]}!</p>
            <p className="redirect-message">You'll be redirected to your dashboard momentarily.</p>
          </div>
        ) : showForgotPassword ? (
          <div className="forgot-password-container">
            {forgotPasswordSuccess ? (
              <div className="success-container">
                <div className="success-icon">
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="32" cy="32" r="28" fill="#10B981" fillOpacity="0.2"/>
                    <path d="M20 32L28 40L44 24" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Reset Email Sent</h3>
                <p>Password reset instructions have been sent to {forgotPasswordEmail}</p>
                <p className="redirect-message">Please check your inbox to continue.</p>
                <button 
                  className="back-to-login-button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordSuccess(false);
                    setForgotPasswordEmail('');
                  }}
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form className="login-form" onSubmit={handleForgotPassword}>
                <h3>Reset Your Password</h3>
                <p className="reset-instructions">Enter your email address and we'll send you instructions to reset your password.</p>
                
                <div className="form-group">
                  <label htmlFor="forgot-password-email">Email Address</label>
                  <div className="input-container">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="input-icon">
                      <path d="M2.5 6.66669L9.0755 10.4583C9.63533 10.8056 10.3647 10.8056 10.9245 10.4583L17.5 6.66669M4.16667 15.8334H15.8333C16.7538 15.8334 17.5 15.0872 17.5 14.1667V5.83335C17.5 4.91288 16.7538 4.16669 15.8333 4.16669H4.16667C3.24619 4.16669 2.5 4.91288 2.5 5.83335V14.1667C2.5 15.0872 3.24619 15.8334 4.16667 15.8334Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <input 
                      type="email"
                      id="forgot-password-email"
                      placeholder="example@gsa.lat"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                {forgotPasswordError && <div className="error-message">{forgotPasswordError}</div>}
                
                <div className="forgot-password-actions">
                  <button 
                    type="submit" 
                    className={`login-button ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="loader"></span>
                    ) : 'Send Reset Link'}
                  </button>
                  
                  <button 
                    type="button"
                    className="back-button"
                    onClick={() => setShowForgotPassword(false)}
                    disabled={isLoading}
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-container">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="input-icon">
                  <path d="M2.5 6.66669L9.0755 10.4583C9.63533 10.8056 10.3647 10.8056 10.9245 10.4583L17.5 6.66669M4.16667 15.8334H15.8333C16.7538 15.8334 17.5 15.0872 17.5 14.1667V5.83335C17.5 4.91288 16.7538 4.16669 15.8333 4.16669H4.16667C3.24619 4.16669 2.5 4.91288 2.5 5.83335V14.1667C2.5 15.0872 3.24619 15.8334 4.16667 15.8334Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input 
                  type="email"
                  id="email"
                  placeholder="example@gsa.lat"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-container">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="input-icon">
                  <path d="M13.3333 9.16669V6.66669C13.3333 4.82574 11.8409 3.33335 10 3.33335C8.15905 3.33335 6.66667 4.82574 6.66667 6.66669V9.16669M6.66667 9.16669H13.3333M6.66667 9.16669H5.83333C5.3731 9.16669 5 9.53978 5 10V15C5 15.4602 5.3731 15.8334 5.83333 15.8334H14.1667C14.6269 15.8334 15 15.4602 15 15V10C15 9.53978 14.6269 9.16669 14.1667 9.16669H13.3333" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input 
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="form-options">
              <div className="remember-me">
                <input 
                  type="checkbox" 
                  id="remember-me" 
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <label htmlFor="remember-me">Remember me</label>
              </div>
              <button 
                type="button" 
                className="forgot-password-link"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot password?
              </button>
            </div>
            
            {loginError && <div className="error-message">{loginError}</div>}
            
            <button 
              type="submit" 
              className={`login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loader"></span>
              ) : 'Sign In'}
            </button>
            
            <div className="secure-login">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.66667 7.33335V5.33335C4.66667 3.49239 6.15905 2.00002 8 2.00002C9.84095 2.00002 11.3333 3.49239 11.3333 5.33335V7.33335M4.66667 7.33335H11.3333M4.66667 7.33335H3.33333C2.96514 7.33335 2.66667 7.63183 2.66667 8.00002V12.6667C2.66667 13.0349 2.96514 13.3334 3.33333 13.3334H12.6667C13.0349 13.3334 13.3333 13.0349 13.3333 12.6667V8.00002C13.3333 7.63183 13.0349 7.33335 12.6667 7.33335H11.3333" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>Secure login with TLS encryption</span>
            </div>
          </form>
        )}
      </div>
      
      <div className="login-sidebar">
        <div className="sidebar-content">
          <h3>Investment Portal Benefits</h3>
          <ul className="benefits-list">
            <li>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 11L12 14L20 6M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Cross-border investment opportunities</span>
            </li>
            <li>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 11L12 14L20 6M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Exclusive market insights</span>
            </li>
            <li>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 11L12 14L20 6M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Personalized investment reports</span>
            </li>
            <li>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 11L12 14L20 6M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Advanced portfolio analytics</span>
            </li>
            <li>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 11L12 14L20 6M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Preferential investment opportunities</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default InvestorAccess; 