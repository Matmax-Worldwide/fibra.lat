import React from 'react';
import './PropertySearch.css';

const PropertySearch = () => {
  return (
    <div className="property-search-container">
      <h2>Property Search</h2>
      <p className="search-description">
        Search for properties available for investment through REITs and FIBRAs.
      </p>
      
      <div className="search-content">
        <div className="search-form">
          <h3>Search Criteria</h3>
          
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input type="text" id="location" placeholder="City, Country or Region" />
          </div>
          
          <div className="form-group">
            <label htmlFor="property-type">Property Type</label>
            <select id="property-type">
              <option value="">All Property Types</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="retail">Retail</option>
              <option value="industrial">Industrial</option>
              <option value="hotel">Hotel</option>
              <option value="mixed-use">Mixed-Use</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="price-range">Price Range</label>
            <div className="range-inputs">
              <input type="number" id="min-price" placeholder="Min" />
              <span>to</span>
              <input type="number" id="max-price" placeholder="Max" />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="size-range">Size (sqm)</label>
            <div className="range-inputs">
              <input type="number" id="min-size" placeholder="Min" />
              <span>to</span>
              <input type="number" id="max-size" placeholder="Max" />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="investment-vehicle">Investment Vehicle</label>
            <select id="investment-vehicle">
              <option value="">All Vehicles</option>
              <option value="reit">REIT</option>
              <option value="fibra">FIBRA</option>
              <option value="firbi">FIRBI</option>
            </select>
          </div>
          
          <button className="search-button">Search Properties</button>
        </div>
        
        <div className="search-results">
          <h3>Results</h3>
          <p className="coming-soon-message">
            Property search functionality is coming soon. This feature will allow investors to find specific properties 
            within REITs, FIBRAs, and FIRBIs that match their investment criteria.
          </p>
          
          <div className="placeholder-properties">
            <div className="property-card placeholder">
              <div className="property-image-placeholder"></div>
              <div className="property-info-placeholder">
                <div className="placeholder-line"></div>
                <div className="placeholder-line"></div>
                <div className="placeholder-line short"></div>
              </div>
            </div>
            
            <div className="property-card placeholder">
              <div className="property-image-placeholder"></div>
              <div className="property-info-placeholder">
                <div className="placeholder-line"></div>
                <div className="placeholder-line"></div>
                <div className="placeholder-line short"></div>
              </div>
            </div>
            
            <div className="property-card placeholder">
              <div className="property-image-placeholder"></div>
              <div className="property-info-placeholder">
                <div className="placeholder-line"></div>
                <div className="placeholder-line"></div>
                <div className="placeholder-line short"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertySearch; 