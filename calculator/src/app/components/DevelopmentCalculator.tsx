import React, { useState, useEffect } from 'react';
import './DevelopmentCalculator.css';

interface DevelopmentCalculatorResults {
  acquisitionCost: number;
  renovationCost: number;
  totalInvestment: number;
  annualRent: number;
  netOperatingIncome: number;
  capRate: number;
  roi: number;
  paybackPeriod: number;
  propertyValueAfterRenovation: number;
  valueCreation: number;
  valueCreationPercentage: number;
  stabilizedOccupancy: number;
  stabilizedADR: number;
  stabilizedRevPAR: number;
  rentCoverageRatio: number;
  ffeCost: number;
  financialCharges: number;
}

export function DevelopmentCalculator() {
  // Property Acquisition
  const [propertyName, setPropertyName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [propertyType, setPropertyType] = useState<string>('full-service');
  const [numberOfRooms, setNumberOfRooms] = useState<number>(120);
  const [acquisitionCostPerRoom, setAcquisitionCostPerRoom] = useState<number>(150000);
  
  // Renovation/CAPEX
  const [renovationCostPerRoom, setRenovationCostPerRoom] = useState<number>(30000);
  const [renovationDuration, setRenovationDuration] = useState<number>(12);
  const [ffeCostPerRoom, setFfeCostPerRoom] = useState<number>(15000);
  const [contingencyPercentage, setContingencyPercentage] = useState<number>(10);
  
  // Hotel Operations
  const [hotelBrand, setHotelBrand] = useState<string>('');
  const [leaseTermYears, setLeaseTermYears] = useState<number>(20);
  const [baseRentPercentage, setBaseRentPercentage] = useState<number>(25);
  const [variableRentPercentage, setVariableRentPercentage] = useState<number>(15);
  const [minimumRentGuaranteePerRoom, setMinimumRentGuaranteePerRoom] = useState<number>(5000);
  
  // Hotel Performance
  const [stabilizedOccupancy, setStabilizedOccupancy] = useState<number>(70);
  const [stabilizedADR, setStabilizedADR] = useState<number>(120);
  const [operatingExpenseRatio, setOperatingExpenseRatio] = useState<number>(60);
  
  // Financing
  const [equityPercentage, setEquityPercentage] = useState<number>(35);
  const [debtInterestRate, setDebtInterestRate] = useState<number>(7);
  const [loanTermYears, setLoanTermYears] = useState<number>(15);
  const [exitCapRate, setExitCapRate] = useState<number>(8);
  
  // Calculation Results
  const [calculationResults, setCalculationResults] = useState<DevelopmentCalculatorResults | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);

  // Calculate Development Project Metrics
  const calculateDevelopment = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      // Calculate acquisition cost
      const acquisitionCost = numberOfRooms * acquisitionCostPerRoom;
      
      // Calculate renovation costs
      const baseRenovationCost = numberOfRooms * renovationCostPerRoom;
      const ffeCost = numberOfRooms * ffeCostPerRoom;
      const contingencyCost = (baseRenovationCost + ffeCost) * (contingencyPercentage / 100);
      const totalRenovationCost = baseRenovationCost + ffeCost + contingencyCost;
      
      // Calculate total investment
      const totalInvestment = acquisitionCost + totalRenovationCost;
      
      // Calculate hotel operating metrics
      const roomRevenue = numberOfRooms * stabilizedADR * (stabilizedOccupancy / 100) * 365;
      const hotelGrossIncome = roomRevenue * 1.35; // Assumption: F&B and other revenue is 35% of room revenue
      const hotelOperatingExpenses = hotelGrossIncome * (operatingExpenseRatio / 100);
      const hotelNOI = hotelGrossIncome - hotelOperatingExpenses;
      
      // Calculate rent to REIT/FIBRA
      const baseRent = hotelGrossIncome * (baseRentPercentage / 100);
      const variableRent = hotelNOI * (variableRentPercentage / 100);
      const minimumRentGuarantee = numberOfRooms * minimumRentGuaranteePerRoom;
      const annualRent = Math.max(baseRent + variableRent, minimumRentGuarantee);
      
      // Calculate REIT/FIBRA NOI
      const propertyTaxes = totalInvestment * 0.01; // Assumption: 1% property tax
      const insurance = totalInvestment * 0.005; // Assumption: 0.5% insurance cost
      const assetManagement = annualRent * 0.03; // Assumption: 3% asset management fee
      const propertyExpenses = propertyTaxes + insurance + assetManagement;
      const netOperatingIncome = annualRent - propertyExpenses;
      
      // Calculate financial metrics
      const capRate = (netOperatingIncome / totalInvestment) * 100;
      const roi = (netOperatingIncome / (totalInvestment * (equityPercentage / 100))) * 100;
      const paybackPeriod = totalInvestment / netOperatingIncome;
      
      // Calculate debt service
      const loanAmount = totalInvestment * (1 - equityPercentage / 100);
      const monthlyRate = debtInterestRate / 100 / 12;
      const numberOfPayments = loanTermYears * 12;
      const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      const annualDebtService = monthlyPayment * 12;
      const financialCharges = annualDebtService;
      
      // Calculate property value creation
      const propertyValueAfterRenovation = netOperatingIncome / (exitCapRate / 100);
      const valueCreation = propertyValueAfterRenovation - totalInvestment;
      const valueCreationPercentage = (valueCreation / totalInvestment) * 100;
      
      // Calculate hotel performance metrics
      const stabilizedRevPAR = stabilizedADR * (stabilizedOccupancy / 100);
      const rentCoverageRatio = hotelNOI / annualRent;
      
      const results: DevelopmentCalculatorResults = {
        acquisitionCost,
        renovationCost: totalRenovationCost,
        totalInvestment,
        annualRent,
        netOperatingIncome,
        capRate,
        roi,
        paybackPeriod,
        propertyValueAfterRenovation,
        valueCreation,
        valueCreationPercentage,
        stabilizedOccupancy,
        stabilizedADR,
        stabilizedRevPAR,
        rentCoverageRatio,
        ffeCost,
        financialCharges
      };
      
      setCalculationResults(results);
      setIsCalculating(false);
      setShowResults(true);
    }, 1200);
  };

  const handleReset = () => {
    // Reset all fields to default values
    setPropertyName('');
    setLocation('');
    setPropertyType('full-service');
    setNumberOfRooms(120);
    setAcquisitionCostPerRoom(150000);
    setRenovationCostPerRoom(30000);
    setRenovationDuration(12);
    setFfeCostPerRoom(15000);
    setContingencyPercentage(10);
    setHotelBrand('');
    setLeaseTermYears(20);
    setBaseRentPercentage(25);
    setVariableRentPercentage(15);
    setMinimumRentGuaranteePerRoom(5000);
    setStabilizedOccupancy(70);
    setStabilizedADR(120);
    setOperatingExpenseRatio(60);
    setEquityPercentage(35);
    setDebtInterestRate(7);
    setLoanTermYears(15);
    setExitCapRate(8);
    
    setCalculationResults(null);
    setShowResults(false);
  };

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format percentage values
  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  };

  return (
    <div className="development-calculator-container">
      <h2>Hotel Acquisition & Renovation Calculator</h2>
      <p className="calculator-description">
        Analyze hotel acquisition and renovation projects that will be leased to hotel operators,
        generating rental income for REITs/FIBRAs while allowing value creation through property improvement.
      </p>
      
      <div className="calculator-content">
        <div className="input-section">
          <div className="input-section-header">
            <h3>Property Acquisition</h3>
          </div>
          
          <div className="input-grid">
            <div className="input-group">
              <label htmlFor="property-name">Property Name</label>
              <input 
                type="text" 
                id="property-name" 
                value={propertyName} 
                onChange={(e) => setPropertyName(e.target.value)}
                placeholder="Hotel Name"
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="location">Location</label>
              <input 
                type="text" 
                id="location" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country"
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="property-type">Hotel Type</label>
              <select 
                id="property-type" 
                value={propertyType} 
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="economy">Economy</option>
                <option value="midscale">Midscale</option>
                <option value="upscale">Upscale</option>
                <option value="full-service">Full-Service</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
            
            <div className="input-group">
              <label htmlFor="number-of-rooms">Number of Rooms</label>
              <input 
                type="number" 
                id="number-of-rooms" 
                value={numberOfRooms} 
                onChange={(e) => setNumberOfRooms(parseInt(e.target.value) || 0)}
                min="1"
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="acquisition-cost">Acquisition Cost (USD/room)</label>
              <input 
                type="number" 
                id="acquisition-cost" 
                value={acquisitionCostPerRoom} 
                onChange={(e) => setAcquisitionCostPerRoom(parseInt(e.target.value) || 0)}
                min="0"
              />
            </div>
          </div>
          
          <div className="input-section-header">
            <h3>Renovation & CAPEX</h3>
          </div>
          
          <div className="input-grid">
            <div className="input-group">
              <label htmlFor="renovation-cost">Renovation Cost (USD/room)</label>
              <input 
                type="number" 
                id="renovation-cost" 
                value={renovationCostPerRoom} 
                onChange={(e) => setRenovationCostPerRoom(parseInt(e.target.value) || 0)}
                min="0"
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="renovation-duration">Renovation Duration (months)</label>
              <input 
                type="number" 
                id="renovation-duration" 
                value={renovationDuration} 
                onChange={(e) => setRenovationDuration(parseInt(e.target.value) || 0)}
                min="1"
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="ffe-cost">FF&E Cost (USD/room)</label>
              <input 
                type="number" 
                id="ffe-cost" 
                value={ffeCostPerRoom} 
                onChange={(e) => setFfeCostPerRoom(parseInt(e.target.value) || 0)}
                min="0"
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="contingency">Contingency (%)</label>
              <input 
                type="number" 
                id="contingency" 
                value={contingencyPercentage} 
                onChange={(e) => setContingencyPercentage(parseFloat(e.target.value) || 0)}
                min="0"
                max="100"
                step="0.1"
              />
            </div>
          </div>
          
          <div className="input-section-header">
            <h3>Hotel Lease Terms</h3>
          </div>
          
          <div className="input-grid">
            <div className="input-group">
              <label htmlFor="hotel-brand">Hotel Brand/Operator</label>
              <input 
                type="text" 
                id="hotel-brand" 
                value={hotelBrand} 
                onChange={(e) => setHotelBrand(e.target.value)}
                placeholder="Hotel Operator"
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="lease-term">Lease Term (years)</label>
              <input 
                type="number" 
                id="lease-term" 
                value={leaseTermYears} 
                onChange={(e) => setLeaseTermYears(parseInt(e.target.value) || 0)}
                min="1"
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="base-rent">Base Rent (% of Total Revenue)</label>
              <input 
                type="number" 
                id="base-rent" 
                value={baseRentPercentage} 
                onChange={(e) => setBaseRentPercentage(parseFloat(e.target.value) || 0)}
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="variable-rent">Variable Rent (% of NOI)</label>
              <input 
                type="number" 
                id="variable-rent" 
                value={variableRentPercentage} 
                onChange={(e) => setVariableRentPercentage(parseFloat(e.target.value) || 0)}
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="minimum-rent">Minimum Rent Guarantee (USD/room/year)</label>
              <input 
                type="number" 
                id="minimum-rent" 
                value={minimumRentGuaranteePerRoom} 
                onChange={(e) => setMinimumRentGuaranteePerRoom(parseInt(e.target.value) || 0)}
                min="0"
              />
            </div>
          </div>
          
          <div className="input-section-header">
            <h3>Hotel Performance</h3>
          </div>
          
          <div className="input-grid">
            <div className="input-group">
              <label htmlFor="occupancy">Stabilized Occupancy (%)</label>
              <input 
                type="number" 
                id="occupancy" 
                value={stabilizedOccupancy} 
                onChange={(e) => setStabilizedOccupancy(parseFloat(e.target.value) || 0)}
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="adr">Stabilized ADR (USD)</label>
              <input 
                type="number" 
                id="adr" 
                value={stabilizedADR} 
                onChange={(e) => setStabilizedADR(parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="operating-expense">Operating Expense Ratio (%)</label>
              <input 
                type="number" 
                id="operating-expense" 
                value={operatingExpenseRatio} 
                onChange={(e) => setOperatingExpenseRatio(parseFloat(e.target.value) || 0)}
                min="0"
                max="100"
                step="0.1"
              />
            </div>
          </div>
          
          <div className="input-section-header">
            <h3>Financing & Exit</h3>
          </div>
          
          <div className="input-grid">
            <div className="input-group">
              <label htmlFor="equity-percentage">Equity Percentage (%)</label>
              <input 
                type="number" 
                id="equity-percentage" 
                value={equityPercentage} 
                onChange={(e) => setEquityPercentage(parseFloat(e.target.value) || 0)}
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="debt-interest">Debt Interest Rate (%)</label>
              <input 
                type="number" 
                id="debt-interest" 
                value={debtInterestRate} 
                onChange={(e) => setDebtInterestRate(parseFloat(e.target.value) || 0)}
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="loan-term">Loan Term (years)</label>
              <input 
                type="number" 
                id="loan-term" 
                value={loanTermYears} 
                onChange={(e) => setLoanTermYears(parseInt(e.target.value) || 0)}
                min="1"
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="exit-cap-rate">Exit Cap Rate (%)</label>
              <input 
                type="number" 
                id="exit-cap-rate" 
                value={exitCapRate} 
                onChange={(e) => setExitCapRate(parseFloat(e.target.value) || 0)}
                min="0.1"
                max="20"
                step="0.1"
              />
            </div>
          </div>
          
          <div className="calculator-actions">
            <button 
              className="calculate-button" 
              onClick={calculateDevelopment}
              disabled={isCalculating}
            >
              {isCalculating ? 'Calculating...' : 'Calculate Hotel Investment Returns'}
            </button>
            <button 
              className="reset-button" 
              onClick={handleReset}
              disabled={isCalculating}
            >
              Reset
            </button>
          </div>
        </div>
        
        {showResults && calculationResults && (
          <div className="results-section">
            <h3>Hotel Investment Analysis</h3>
            
            <div className="result-card">
              <h4>Property Summary</h4>
              {propertyName && <p className="project-name">{propertyName} - {location}</p>}
              <p className="project-type">{propertyType.charAt(0).toUpperCase() + propertyType.slice(1)} Hotel</p>
              <p className="project-size">{numberOfRooms} Rooms</p>
              <p className="project-lease">Leased to {hotelBrand || "Hotel Operator"} for {leaseTermYears} years</p>
            </div>
            
            <div className="results-grid">
              <div className="result-card cost-breakdown">
                <h4>Investment Breakdown</h4>
                <div className="result-item">
                  <span className="result-label">Acquisition Cost:</span>
                  <span className="result-value">{formatCurrency(calculationResults.acquisitionCost)}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Renovation Cost:</span>
                  <span className="result-value">{formatCurrency(calculationResults.renovationCost)}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">FF&E Cost:</span>
                  <span className="result-value">{formatCurrency(calculationResults.ffeCost)}</span>
                </div>
                <div className="result-item total">
                  <span className="result-label">Total Investment:</span>
                  <span className="result-value">{formatCurrency(calculationResults.totalInvestment)}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Cost per Room:</span>
                  <span className="result-value">{formatCurrency(calculationResults.totalInvestment / numberOfRooms)}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Equity Required:</span>
                  <span className="result-value">{formatCurrency(calculationResults.totalInvestment * (equityPercentage / 100))}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Debt Financing:</span>
                  <span className="result-value">{formatCurrency(calculationResults.totalInvestment * (1 - equityPercentage / 100))}</span>
                </div>
              </div>
              
              <div className="result-card financial-metrics">
                <h4>Financial Performance</h4>
                <div className="result-item">
                  <span className="result-label">Annual Rent Income:</span>
                  <span className="result-value">{formatCurrency(calculationResults.annualRent)}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Net Operating Income:</span>
                  <span className="result-value">{formatCurrency(calculationResults.netOperatingIncome)}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Annual Debt Service:</span>
                  <span className="result-value">{formatCurrency(calculationResults.financialCharges)}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Cap Rate:</span>
                  <span className="result-value">{formatPercentage(calculationResults.capRate)}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Return on Investment:</span>
                  <span className="result-value">{formatPercentage(calculationResults.roi)}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Payback Period:</span>
                  <span className="result-value">{calculationResults.paybackPeriod.toFixed(1)} years</span>
                </div>
              </div>
              
              <div className="result-card hotel-metrics">
                <h4>Hotel Performance</h4>
                <div className="result-item">
                  <span className="result-label">Stabilized Occupancy:</span>
                  <span className="result-value">{formatPercentage(calculationResults.stabilizedOccupancy)}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Stabilized ADR:</span>
                  <span className="result-value">{formatCurrency(calculationResults.stabilizedADR)}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Stabilized RevPAR:</span>
                  <span className="result-value">{formatCurrency(calculationResults.stabilizedRevPAR)}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Rent Coverage Ratio:</span>
                  <span className="result-value">{calculationResults.rentCoverageRatio.toFixed(2)}x</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Value After Renovation:</span>
                  <span className="result-value">{formatCurrency(calculationResults.propertyValueAfterRenovation)}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Value Creation:</span>
                  <span className="result-value">{formatCurrency(calculationResults.valueCreation)}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Value Creation (%):</span>
                  <span className="result-value">{formatPercentage(calculationResults.valueCreationPercentage)}</span>
                </div>
              </div>
            </div>
            
            <div className="development-notes">
              <h4>Investment Notes</h4>
              <ul>
                <li>
                  <strong>Value Creation Strategy:</strong> This investment model focuses on acquiring existing hotels, 
                  renovating them to improve performance, and leasing them to hotel operators to generate stable rental income.
                </li>
                <li>
                  <strong>Lease Structure:</strong> The lease includes a base rent (percentage of total revenue), variable rent 
                  (percentage of NOI), and minimum rent guarantee to protect REIT/FIBRA investors.
                </li>
                <li>
                  <strong>Rent Coverage:</strong> A rent coverage ratio above 1.2x is generally considered healthy, indicating 
                  the hotel operator has sufficient income to pay the rent with a comfortable margin of safety.
                </li>
                <li>
                  <strong>REIT/FIBRA Considerations:</strong> Leased hotel properties can provide stable income distributions 
                  while still benefiting from property value appreciation through strategic renovations and market improvements.
                </li>
                <li>
                  <strong>Risk Factors:</strong> Consider hotel market cycles, renovation cost overruns, and potential 
                  disruption to operations during renovation periods. Conservative occupancy and ADR assumptions are recommended.
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DevelopmentCalculator; 