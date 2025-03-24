import React, { useState } from 'react';

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_4lgty7j';
const EMAILJS_TEMPLATE_ID = 'template_mktd5uz';
const EMAILJS_USER_ID = 'ihlFVMmEGfwbvhlaj';

const About: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

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
    
    // Use the direct REST API approach as documented in EmailJS API docs
    try {
      // Prepare data exactly as shown in the API documentation
      const data = {
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_USER_ID,
        template_params: {
          // Use the variable names expected by your template
          from_name: formData.name,
          reply_to: formData.email,
          message: formData.message
          // No to_email here as it should be set in the EmailJS template
        }
      };
      
      console.log('Sending email with:', data);
      
      // Send using the exact API format from the documentation
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        console.log('Email sent successfully!', response);
        setFormStatus('success');
        setFormData({ name: '', email: '', message: '' });
        
        // Reset form status after 5 seconds
        setTimeout(() => {
          setFormStatus('idle');
        }, 5000);
      } else {
        const errorText = await response.text();
        console.error('EmailJS Error:', errorText);
        throw new Error(errorText);
      }
    } catch (error: any) {
      console.error('Error sending email:', error);
      setFormStatus('error');
      setErrorMessage('There was an error sending your message. Please try again later.');
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
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  onChange={handleChange}
                  required
                  placeholder="Your message"
                ></textarea>
              </div>
              
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
        </div>
      </section>
    </div>
  );
};

export default About; 