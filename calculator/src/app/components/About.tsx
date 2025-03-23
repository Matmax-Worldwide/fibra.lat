import React from 'react';

const About: React.FC = () => {
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
          The FIBRA/REIT Investment Calculator was created by Alberto Saco Puntriano, a real estate 
          investment professional with experience across multiple markets. Alberto developed this tool
          to address the lack of specialized calculators for the unique considerations in REIT and FIBRA
          investments, particularly for cross-border investment strategies.
        </p>
      </section>
      
      <section>
        <h2>Contact</h2>
        <p>
          For questions, feedback, or partnership inquiries, please contact:
          <br />
          <a href="mailto:info@fibra.lat">info@fibra.lat</a>
        </p>
      </section>
      
      <footer>
        <p>© 2025 Alberto Saco Puntriano. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default About; 