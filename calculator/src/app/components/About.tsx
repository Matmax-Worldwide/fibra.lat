import React, { useState } from 'react';

const About: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Simulate form submission - in a real app, you would send this to a server
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setFormStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Reset form status after 5 seconds
      setTimeout(() => {
        setFormStatus('idle');
      }, 5000);
    }, 1000);
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