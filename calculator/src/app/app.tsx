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
// Import icons for the menu
import { FaCalculator, FaBuilding, FaSearch, FaGlobeAmericas, FaUserLock, FaInfoCircle, FaTimes } from 'react-icons/fa';

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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (menuOpen && !target.closest('.main-nav') && !target.closest('.menu-toggle')) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  // Close menu when route changes
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

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
          {menuOpen && (
            <button className="mobile-close-btn" onClick={closeMenu}>
              <FaTimes />
            </button>
          )}
          <NavLink to="/" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <div className="nav-icon"><FaCalculator /></div>
            <span className="nav-text">Calculator</span>
          </NavLink>
          <NavLink to="/development-calculator" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <div className="nav-icon"><FaBuilding /></div>
            <span className="nav-text">Development REITs/FIRBI</span>
          </NavLink>
          <NavLink to="/property-search" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <div className="nav-icon"><FaSearch /></div>
            <span className="nav-text">Property Search</span>
          </NavLink>
          <NavLink to="/cross-border" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <div className="nav-icon"><FaGlobeAmericas /></div>
            <span className="nav-text">Cross-Border Investments</span>
          </NavLink>
          <NavLink to="/investor-access" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <div className="nav-icon"><FaUserLock /></div>
            <span className="nav-text">Investor Access</span>
          </NavLink>
          <NavLink to="/about" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <div className="nav-icon"><FaInfoCircle /></div>
            <span className="nav-text">About</span>
          </NavLink>
        </nav>
      </header>

      <main className="app-content">
        {showSuccessMessage && (
          <div className="success-message">
            Form submission successful! Thank you for your message.
          </div>
        )}
        <Routes>
          <Route path="/" element={<Calculator />} />
          <Route path="/development-calculator" element={<DevelopmentCalculator />} />
          <Route path="/property-search" element={<PropertySearch />} />
          <Route path="/cross-border" element={<CrossBorderInvestment />} />
          <Route path="/investor-access" element={<InvestorAccess />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>FIBRA/REIT Investment Calculator | A tool for real estate investors</p>
          <p className="footer-credits">
            Created by <a href="https://albertosaco.com" className="author-link">Alberto Saco Puntriano</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;


