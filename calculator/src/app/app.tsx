import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useLocation, Link, Navigate } from 'react-router-dom';
import styled from 'styled-components';
// Import the Calculator component from the local components directory
import { Calculator } from './components/Calculator';
import { InvestorAccess } from './components/InvestorAccess';
import './styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PropertySearch from './components/PropertySearch';
import DevelopmentCalculator from './components/DevelopmentCalculator';
import CrossBorderInvestment from './components/CrossBorderInvestment';
import About from './components/About';

// Main App component - Updated with CI/CD pipeline test
export function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Check for success message in URL
  const showSuccessMessage = new URLSearchParams(location.search).get('message') === 'success';

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">FIBRA/REIT Calculator</h1>
          <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation menu">
            <span className={`hamburger ${menuOpen ? 'open' : ''}`}></span>
          </button>
        </div>
        <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Calculator
          </NavLink>
          <NavLink to="/development-calculator" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Development REITs/FIRBI
          </NavLink>
          <NavLink to="/property-search" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Property Search
          </NavLink>
          <NavLink to="/cross-border" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Cross-Border Investments
          </NavLink>
          <NavLink to="/investor-access" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Investor Access
          </NavLink>
          <NavLink to="/about" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            About
          </NavLink>
        </nav>
      </header>

      <main className="app-content">
        <Routes>
          <Route path="/" element={<Calculator />} />
          <Route path="/development-calculator" element={<DevelopmentCalculator />} />
          <Route path="/property-search" element={<PropertySearch />} />
          <Route path="/investor-access" element={<InvestorAccess />} />
          <Route path="/cross-border" element={
            <div className="cross-border-page">
              <h2>Cross-Border Investments: US REITs & Peru FIBRAs</h2>
              
              <section className="about-section">
                <h3>Tax Comparison Overview (2025)</h3>
                <p>
                  Understanding the tax implications of cross-border real estate investments between 
                  the United States and Peru is critical for investors seeking international diversification.
                  Below is a comprehensive comparison of the tax treatments for US REITs and Peru FIBRAs.
                </p>

                <div className="tax-comparison-container">
                  <table className="tax-comparison-table">
                    <thead>
                      <tr>
                        <th>Feature</th>
                        <th>US REITs</th>
                        <th>Peru FIBRAs</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Entity-Level Tax</strong></td>
                        <td>No entity-level tax if 90% of income is distributed to shareholders; otherwise taxed at 21% federal rate</td>
                        <td>No entity-level tax on rental income; income attributed directly to investors regardless of distribution</td>
                      </tr>
                      <tr>
                        <td><strong>Distribution Requirements</strong></td>
                        <td>Must distribute at least 90% of taxable income annually to maintain REIT status</td>
                        <td>No specific distribution percentage requirement in law; pass-through occurs via income attribution</td>
                      </tr>
                      <tr>
                        <td><strong>Domestic Investor Taxation</strong></td>
                        <td>Ordinary income rates (up to 37%); 20% deduction available through 2025 (effective top rate ~29.6%)</td>
                        <td>Preferential 5% rate on rental income; 29.5% on capital gains from property sales</td>
                      </tr>
                      <tr>
                        <td><strong>Foreign Investor Taxation</strong></td>
                        <td>30% withholding (often reduced to 15% by treaty); FIRPTA applies to capital gains at 21% rate</td>
                        <td>5% rate on rental income for qualifying foreign investors; 30% on capital gains from property sales</td>
                      </tr>
                      <tr>
                        <td><strong>Asset Requirements</strong></td>
                        <td>At least 75% of assets must be real estate, cash, or government securities</td>
                        <td>At least 70% of assets must be income-producing real estate</td>
                      </tr>
                      <tr>
                        <td><strong>Income Tests</strong></td>
                        <td>75% from real estate sources; 95% from that plus passive income</td>
                        <td>No specific income source tests; focus is on asset composition</td>
                      </tr>
                      <tr>
                        <td><strong>Property Holding Period</strong></td>
                        <td>No mandatory minimum holding period for properties</td>
                        <td>Properties must be held for at least 4 years from acquisition or construction</td>
                      </tr>
                      <tr>
                        <td><strong>Ownership Requirements</strong></td>
                        <td>Minimum 100 shareholders; no five or fewer individuals may own {'>'} 50% (5/50 test)</td>
                        <td>Must be publicly offered and traded; no specific shareholder count requirement</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="about-section">
                <h3>For US Investors Considering Peru FIBRAs</h3>
                <ul className="advantages-list">
                  <li>
                    <strong>Favorable Tax Rate:</strong> Peru offers a preferential 5% tax rate on FIBRA rental income distributions 
                    to qualifying foreign investors, significantly lower than the US ordinary income rates.
                  </li>
                  <li>
                    <strong>Capital Gains Consideration:</strong> Higher 30% withholding tax applies to capital gains from property sales,
                    making FIBRAs more advantageous for rental income than capital appreciation strategies.
                  </li>
                  <li>
                    <strong>US Tax Reporting:</strong> US investors must report foreign financial accounts (FBAR) if total value exceeds $10,000.
                  </li>
                  <li>
                    <strong>Foreign Tax Credit:</strong> Peru-source income is generally eligible for US foreign tax credit.
                  </li>
                  <li>
                    <strong>No Treaty Benefits:</strong> No US-Peru tax treaty currently in force to reduce withholding rates.
                  </li>
                  <li>
                    <strong>Income Attribution:</strong> FIBRAs attribute income to investors even if not distributed, 
                    creating potential tax liability without corresponding cash receipt.
                  </li>
                </ul>
              </section>

              <section className="about-section">
                <h3>For Peruvian Investors Considering US REITs</h3>
                <ul className="advantages-list">
                  <li>
                    <strong>Withholding Tax:</strong> 30% US withholding tax applies to ordinary REIT dividends (without treaty benefits).
                  </li>
                  <li>
                    <strong>FIRPTA Considerations:</strong> FIRPTA withholding (21%) applies to capital gain distributions from US real estate sales.
                  </li>
                  <li>
                    <strong>Small Investor Exemption:</strong> Foreign investors with less than 10% ownership in publicly-traded REITs are exempt 
                    from FIRPTA on share sales.
                  </li>
                  <li>
                    <strong>Market Advantages:</strong> Greater liquidity, sector specialization options, and market depth in US REIT markets.
                  </li>
                  <li>
                    <strong>Currency Diversification:</strong> Exposure to US dollar-denominated assets provides potential hedge against local currency fluctuations.
                  </li>
                  <li>
                    <strong>Mandatory Distributions:</strong> US REITs must distribute 90% of income annually, ensuring regular cash flows to investors.
                  </li>
                </ul>
              </section>
              
              <section className="about-section">
                <h3>Key Advantages</h3>
                <ul className="advantages-list">
                  <li>
                    <strong>Portfolio Diversification:</strong> Peru's real estate market cycles often differ from 
                    the US market, offering true geographical diversification for US REIT portfolios.
                  </li>
                  <li>
                    <strong>Growth Potential:</strong> Peru's economy has shown strong growth fundamentals with a 
                    real estate market that is less saturated than developed markets.
                  </li>
                  <li>
                    <strong>Yield Enhancement:</strong> FIBRAs in Peru typically offer 100-200 basis points higher 
                    yields compared to similar US REIT assets, enhancing overall portfolio returns.
                  </li>
                  <li>
                    <strong>Currency Opportunity:</strong> Strategic timing of investments can capitalize on 
                    favorable USD/PEN exchange rate movements, potentially enhancing returns.
                  </li>
                </ul>
              </section>
              
              <section className="about-section">
                <h3>Disclaimer</h3>
                <p className="disclaimer-text">
                  Tax laws and regulations are subject to change. This information is provided for educational 
                  purposes only and should not be considered tax or legal advice. Consult with qualified tax 
                  professionals for guidance on your specific situation.
                </p>
                <p className="disclaimer-text">
                  The information presented reflects provisions in effect as of March 2025. Future legislative 
                  changes may impact the accuracy of this information.
                </p>
              </section>
              
              <section className="about-section contact-section">
                <h3>Learn More</h3>
                <p>
                  For detailed information about cross-border investment opportunities between US REITs and Peru FIBRAs,
                  please contact our advisory team at <a href="mailto:asp@gsa.lat" className="contact-email">asp@gsa.lat</a>.
                </p>
              </section>
            </div>
          } />
          <Route path="/about" element={
            <div className="about-page">
              <h2>About This Calculator</h2>
              
              {showSuccessMessage && (
                <div className="success-message">
                  Your message has been sent successfully. We'll get back to you soon!
                </div>
              )}

              <section className="about-section">
                <h3>Purpose</h3>
                <p>
                  This calculator helps real estate investors make informed decisions 
                  by analyzing potential investments through various financial metrics.
                </p>
              </section>
              
              <section className="about-section">
                <h3>Features</h3>
                <ul className="features-list">
                  <li>Calculates maximum property value based on desired REIT yield</li>
                  <li>Supports multiple countries (US REITs and Peru FIBRAs)</li>
                  <li>Calculates key metrics including ROI</li>
                </ul>
              </section>
              
              <section className="about-section">
                <h3>REIT Calculations</h3>
                <p>
                  REITs (Real Estate Investment Trusts) are companies that own, operate, or finance 
                  income-producing real estate. This calculator specifically addresses:
                </p>
                <ul className="reit-info">
                  <li>
                    <strong>Maximum Property Cost:</strong> Based on Net Operating Income (NOI)
                    divided by Capitalization Rate, adjusted for distribution requirements.
                  </li>
                  <li>
                    <strong>US REITs:</strong> Required to distribute at least 90% of taxable income.
                  </li>
                  <li>
                    <strong>Peru FIBRAs:</strong> Required to distribute at least 95% of taxable income.
                  </li>
      </ul>
              </section>

              <section className="about-section">
                <h3>Contact</h3>
                <p>
                  For more information about Peruvian investment opportunities, contact the author: 
                  <a href="mailto:asp@gsa.lat" className="author-email">asp@gsa.lat</a>
                </p>
                
                <div className="contact-form-container">
                  <h4>Send a Message</h4>
                  <form 
                    className="contact-form"
                    action="https://formsubmit.co/asp@gsa.lat" 
                    method="POST"
                  >
                    <div className="form-group">
                      <label htmlFor="name">Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        placeholder="Your name" 
                        required 
                      />
    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        placeholder="Your email address" 
                        required 
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="subject">Subject</label>
                      <input 
                        type="text" 
                        id="subject" 
                        name="_subject" 
                        placeholder="Message subject" 
                        required 
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="message">Message</label>
                      <textarea 
                        id="message" 
                        name="message" 
                        rows={5} 
                        placeholder="Your message" 
                        required 
                      ></textarea>
                    </div>
                    
                    {/* Honeypot field to prevent spam */}
                    <input type="text" name="_honey" style={{display: 'none'}} />
                    
                    {/* Disable captcha */}
                    <input type="hidden" name="_captcha" value="false" />
                    
                    {/* Redirect after submission */}
                    <input type="hidden" name="_next" value={window.location.origin + "/about?message=success"} />
                    
                    <button type="submit" className="submit-button">
                      Send Message
                    </button>
                  </form>
                </div>
              </section>
            </div>
          } />
    </Routes>
      </main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} FIBRA/REIT Calculator</p>
        <div className="footer-credits">
          <span>Created by </span>
          <a 
            href="https://www.linkedin.com/in/albertosaco/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="author-link"
          >
            Alberto Saco Puntriano
          </a>
          <span> powered by </span>
          <a 
            href="/investor-access" 
            className="company-link"
          >
            GSA LATAM
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;


