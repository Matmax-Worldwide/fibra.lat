import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

// EmailJS configuration - These values need to be correct from your EmailJS account
const EMAILJS_SERVICE_ID = 'service_4x72cnk'; 
const EMAILJS_TEMPLATE_ID = 'template_kqtl0ko'; 
const EMAILJS_USER_ID = 'zB2yQcVZfGABQvVLx'; 

const About: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Initialize EmailJS - no longer needed with the new package
  // useEffect(() => {
  //   emailjs.init(EMAILJS_USER_ID);
  // }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    setErrorMessage('');
    
    // For debugging - add to browser console
    console.log('Sending email with config:', {
      serviceId: EMAILJS_SERVICE_ID,
      templateId: EMAILJS_TEMPLATE_ID,
      userId: EMAILJS_USER_ID,
      formData
    });
    
    try {
      // Create form reference - using EmailJS newer API pattern
      const form = e.target as HTMLFormElement;
      
      // Send the email using newer EmailJS API which is more reliable
      const result = await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        form,
        EMAILJS_USER_ID
      );
      
      console.log('Email sent successfully:', result.text);
      
      // Handle successful submission
      setFormStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Reset form status after 5 seconds
      setTimeout(() => {
        setFormStatus('idle');
      }, 5000);
    } catch (error: any) {
      // Enhanced error logging
      console.error('Error sending email:', error);
      if (error.text) console.error('Error details:', error.text);
      
      setFormStatus('error');
      setErrorMessage(`There was an error sending your message (${error.text || 'Unknown error'}). Please try again later or email us directly.`);
    }
  };

  return (
    <div className="container">
      <h1>About FIBRA/REIT Investment Calculator</h1>
      
      <section>
        <h2>Our Mission</h2>
        <p>
          The FIBRA/REIT Investment Calculator provides sophisticated analysis tools for real estate 
          investors looking to evaluate opportunities in both US REITs and Peru FIBRAs. Our goal is to 
          democratize access to professional-grade investment analysis tools, making them accessible
          to individual investors and small firms.
        </p>
      </section>
      
      <section>
        <h2>Features</h2>
        <ul>
          <li><strong>Standard Calculator:</strong> Evaluate income-producing properties</li>
          <li><strong>Development Calculator:</strong> Analyze hotel acquisition and renovation projects</li>
          <li><strong>Cross-Border Investment Guide:</strong> Compare tax structures between markets</li>
          <li><strong>Property Search:</strong> Find available properties (coming soon)</li>
          <li><strong>Investor Access:</strong> Secure login for premium features (coming soon)</li>
        </ul>
      </section>
      
      <section>
        <h2>About the Creator</h2>
        <p>
          The FIBRA/REIT Investment Calculator was created by Alberto Saco Puntriano and powered by GSA LATAM, to address the lack of specialized calculators for the unique considerations in REIT and FIBRA investments, particularly for cross-border investment strategies.
        </p>
      </section>
      
      <section>
        <h2>Contact Us</h2>
        <div className="contact-form-wrapper">
          {formStatus === 'success' ? (
            <div className="contact-success">
              <h3>Thank you for your message!</h3>
              <p>We will get back to you as soon as possible.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="from_name">Name</label>
                <input
                  type="text"
                  id="from_name"
                  name="from_name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="Your name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="reply_to">Email</label>
                <input
                  type="email"
                  id="reply_to"
                  name="reply_to"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  placeholder="Your email address"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                  placeholder="Your message"
                ></textarea>
              </div>
              
              {/* Hidden field for recipient email */}
              <input 
                type="hidden" 
                name="to_email" 
                value="asp@gsa.lat" 
              />
              
              {formStatus === 'error' && (
                <div className="error-message">
                  {errorMessage}
                </div>
              )}
              
              <button 
                type="submit" 
                className="submit-button"
                disabled={formStatus === 'submitting'}
              >
                {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
          
          <div className="contact-info">
            <p>You can also reach us directly at:</p>
            <a href="mailto:asp@gsa.lat" className="email-link">asp@gsa.lat</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 