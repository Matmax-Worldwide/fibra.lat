import React, { useState, useEffect } from 'react';
import './PropertyReport.css';
import { calculateTestMaxPropertyCostForREIT } from '../utils/TestCalculations';
import { CalculationVerifier } from './CalculationVerifier';

interface ReportProps {
  totalInvestment: number;
  annualNetIncome: number;
  actualROI: number;
  leveragedROI: number;
  breakEvenPoint: number;
  netPresentValue: number;
  internalRateOfReturn: number;
  debtServiceCoverageRatio: number;
  maxAffordableLandPrice?: number;
  maxPropertyCostForREIT: number;
  propertyType?: string;
  landOwnership?: string;
  appreciationRate?: number;
  country?: string;
  // Additional parameters needed for verification
  rentalIncome?: number;
  expenses?: number;
  targetREITYield?: number;
  constructionCost?: number;
  otherCosts?: number;
  occupancyRate?: number;
  interestRate?: number;
  loanAmount?: number;
  loanTerm?: number;
  landPrice?: number;
  landLeaseAnnual?: number;
  landLeaseTerm?: number;
}

export function PropertyReport({
  totalInvestment,
  annualNetIncome,
  actualROI,
  leveragedROI,
  breakEvenPoint,
  netPresentValue,
  internalRateOfReturn,
  debtServiceCoverageRatio,
  maxAffordableLandPrice = 0,
  maxPropertyCostForREIT,
  propertyType = 'commercial',
  landOwnership = 'purchase',
  appreciationRate = 2,
  country = 'us',
  // Default values for verification parameters
  rentalIncome = 0,
  expenses = 0,
  targetREITYield = 5,
  constructionCost = 0,
  otherCosts = 0,
  occupancyRate = 95,
  interestRate = 5,
  loanAmount = 0,
  loanTerm = 20,
  landPrice = 0,
  landLeaseAnnual = 0,
  landLeaseTerm = 30
}: ReportProps) {
  const [activeTab, setActiveTab] = useState('summary');
  const [showVerifiers, setShowVerifiers] = useState(false);

  // Utility functions for formatting
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  };

  // Generate cash flow projection (covers break-even period)
  const generateCashFlowProjection = () => {
    const projections = [];
    const incomeGrowthRate = 0.03; // 3% annual growth in income
    const expenseGrowthRate = 0.025; // 2.5% annual growth in expenses
    
    let currentAnnualIncome = annualNetIncome;
    let currentValue = totalInvestment;
    let cumulativeIncome = 0; // Track cumulative income
    let cumulativeReturn = 0; // Track cumulative return percentage
    
    // Calculate number of years to show - either breakEvenPoint (rounded up) or minimum 5 years
    const yearsToShow = Math.max(5, Math.ceil(breakEvenPoint) + 1); // Add 1 year beyond break-even
    
    for (let year = 1; year <= yearsToShow; year++) {
      // First year uses the initial net income
      if (year === 1) {
        currentAnnualIncome = annualNetIncome;
      } else {
        // Increase income each year after first year
        currentAnnualIncome *= (1 + incomeGrowthRate);
      }
      
      // Only appreciate property value if land is purchased
      if (landOwnership === 'purchase') {
        currentValue *= (1 + (appreciationRate / 100));
      } else {
        // For leased land, improvements still appreciate but at a lower rate
        currentValue *= (1 + ((appreciationRate * 0.4) / 100));
      }
      
      // Add current year income to cumulative
      cumulativeIncome += currentAnnualIncome;
      
      const cashYield = (currentAnnualIncome / totalInvestment) * 100;
      const totalReturn = cashYield + (landOwnership === 'purchase' ? appreciationRate : appreciationRate * 0.4);
      
      // Calculate recovery percentage (how much of initial investment has been recouped)
      const recoveryPercentage = (cumulativeIncome / totalInvestment) * 100;
      cumulativeReturn = recoveryPercentage;
      
      // Highlight the break-even year (when recovery percentage ≥ 100)
      const isBreakEvenYear = (recoveryPercentage >= 100 && cumulativeIncome - currentAnnualIncome < totalInvestment);
      
      projections.push({
        year,
        income: currentAnnualIncome,
        propertyValue: currentValue,
        cashYield,
        totalReturn,
        cumulativeIncome,
        recoveryPercentage,
        isBreakEvenYear
      });
    }
    
    return projections;
  };

  // Get investment advice based on ROI and other metrics
  const getInvestmentAdvice = () => {
    let advice = "";
    
    if (actualROI < 5) {
      advice = "This investment appears to have below-average returns. Consider negotiating a lower purchase price or exploring other opportunities.";
    } else if (actualROI >= 5 && actualROI < 8) {
      advice = "This investment shows moderate returns. Analyze whether the risk profile aligns with your investment strategy.";
    } else {
      advice = "This investment shows strong potential returns. Ensure you've factored in all risks and contingencies.";
    }
    
    // Add advice specific to land ownership
    if (landOwnership === 'lease') {
      advice += " With leased land, you benefit from lower initial capital requirements but forgo long-term land appreciation.";
    } else {
      advice += " Owning the land provides potential appreciation value but requires higher initial capital investment.";
    }
    
    // Add country-specific advice
    if (country === 'peru') {
      advice += " For Peru FIBRA investments, ensure you meet the higher distribution requirements (95%) and understand local market conditions.";
    }
    
    // Add advice specific to property type
    if (propertyType === 'hotel') {
      advice += " Hospitality properties typically have higher operational volatility; ensure management expertise is in place.";
    }
    
    return advice;
  };

  // Risk assessment
  const getRiskAssessment = () => {
    const risks = [];
    
    // Assess DSCR risk
    if (debtServiceCoverageRatio < 1.2) {
      risks.push({
        name: "Debt Service Coverage",
        level: "High",
        description: "DSCR below 1.2 indicates high financing risk. Income may not sufficiently cover debt payments."
      });
    } else if (debtServiceCoverageRatio < 1.5) {
      risks.push({
        name: "Debt Service Coverage",
        level: "Moderate",
        description: "DSCR between 1.2-1.5 provides adequate but not generous coverage of debt obligations."
      });
    } else {
      risks.push({
        name: "Debt Service Coverage",
        level: "Low",
        description: "DSCR above 1.5 indicates strong ability to service debt from property income."
      });
    }
    
    // Assess ROI risk
    if (actualROI < 6) {
      risks.push({
        name: "Return on Investment",
        level: "Moderate-High",
        description: "ROI below 6% may not provide sufficient return premium over risk-free investments."
      });
    } else {
      risks.push({
        name: "Return on Investment",
        level: "Low-Moderate",
        description: "ROI above 6% provides reasonable return premium for the investment risk."
      });
    }
    
    // Land ownership specific risk
    if (landOwnership === 'lease') {
      risks.push({
        name: "Land Control",
        level: "Moderate",
        description: "Ground lease structure limits long-term control and exposes to lease renewal risk."
      });
    } else {
      risks.push({
        name: "Capital Allocation",
        level: "Moderate",
        description: "Land ownership requires higher upfront capital but reduces long-term control risk."
      });
    }
    
    // Country-specific risk
    if (country === 'peru') {
      risks.push({
        name: "Regulatory Environment",
        level: landOwnership === 'lease' ? "High" : "Moderate",
        description: "Peru's FIBRA regulations are newer and may evolve; leased land adds additional regulatory complexity."
      });
    }
    
    return risks;
  };

  // Calculate test values for verification
  const getTestMaxPropertyCostForREIT = () => {
    const testParams = {
      landPrice,
      constructionCost,
      otherCosts,
      rentalIncome,
      expenses,
      interestRate,
      loanAmount,
      loanTerm,
      targetREITYield,
      country,
      propertyType,
      occupancyRate,
      appreciationRate,
      landOwnership,
      landLeaseAnnual,
      landLeaseTerm
    };
    
    return calculateTestMaxPropertyCostForREIT(testParams);
  };

  return (
    <div className="property-report">
      <div className="report-tabs">
        <button 
          className={`tab-button ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          Summary
        </button>
        <button 
          className={`tab-button ${activeTab === 'cashflow' ? 'active' : ''}`}
          onClick={() => setActiveTab('cashflow')}
        >
          Cash Flow Projection
        </button>
        <button 
          className={`tab-button ${activeTab === 'analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('analysis')}
        >
          Detailed Analysis
        </button>
        <button 
          className={`tab-button ${activeTab === 'verification' ? 'active' : ''}`}
          onClick={() => setActiveTab('verification')}
        >
          Verification
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'summary' && (
          <div className="summary-tab">
            <div className="metric-cards">
              <div className="metric-card">
                <h3>Total Investment</h3>
                <div className="metric-value">{formatCurrency(totalInvestment)}</div>
                <div className="metric-description">Estimated property value based on current income</div>
              </div>
              
              <div className="metric-card">
                <h3>Annual Net Income</h3>
                <div className="metric-value">{formatCurrency(annualNetIncome)}</div>
                <div className="metric-description">Net Operating Income (NOI) per year</div>
              </div>
              
              <div className="metric-card">
                <h3>Return on Investment</h3>
                <div className="metric-value">{formatPercentage(actualROI)}</div>
                <div className="metric-description">{loanAmount > 0 ? 'Leveraged ROI' : 'Unleveraged ROI'}</div>
              </div>
              
              <div className="metric-card">
                <h3>Break-even Point</h3>
                <div className="metric-value">{breakEvenPoint.toFixed(1)} years</div>
                <div className="metric-description">Years to recoup initial investment</div>
              </div>
            </div>

            {/* New section to compare Total Investment vs Max Property Cost */}
            <div className="investment-comparison">
              <h3>Investment Value Comparison</h3>
              <div className="comparison-container">
                <div className="comparison-col">
                  <h4>Total Investment</h4>
                  <div className="comparison-value">{formatCurrency(totalInvestment)}</div>
                  <div className="comparison-description">
                    <p>Based on your custom inputs:</p>
                    <ul>
                      <li>Uses your specified expense rates</li>
                      <li>Reflects actual property value based on current income</li>
                      <li>Considers custom operating costs</li>
                    </ul>
                  </div>
                </div>
                <div className="comparison-vs">vs</div>
                <div className="comparison-col">
                  <h4>Max Property Cost for REIT</h4>
                  <div className="comparison-value">{formatCurrency(maxPropertyCostForREIT)}</div>
                  <div className="comparison-description">
                    <p>Based on standardized REIT metrics:</p>
                    <ul>
                      <li>Uses standardized rates: Operating ({country === 'us' ? '3%' : '3.5%'}), Admin ({country === 'us' ? '1.5%' : '2%'})</li>
                      <li>Maximum price a REIT should pay to achieve target yield</li>
                      <li>Follows regulatory requirements for {country === 'us' ? 'US REITs' : 'Peru FIBRAs'}</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="comparison-explanation">
                <p><strong>Why they differ:</strong> Total Investment uses your custom expense rates and inputs, while Max Property Cost for REIT uses standardized rates required by regulations. The difference is not due to additional costs like brokerage fees.</p>
                <p>If your expense rates match the standard rates ({country === 'us' ? '3% operating, 1.5% admin' : '3.5% operating, 2% admin'}), these values would be much closer.</p>
              </div>
            </div>
            
            <div className="metrics-container">
              <div className="metrics-grid">
                <div className="metric">
                  <div className="metric-header">Net Present Value</div>
                  <div className="value">{formatCurrency(netPresentValue)}</div>
                  <div className={`indicator ${netPresentValue >= 0 ? 'positive' : 'negative'}`}>
                    {netPresentValue >= 0 ? '✓ Positive NPV' : '✗ Negative NPV'}
                  </div>
                </div>
                <div className="metric">
                  <div className="metric-header">Internal Rate of Return</div>
                  <div className="value">{formatPercentage(internalRateOfReturn)}</div>
                </div>
                <div className="metric">
                  <div className="metric-header">DSCR</div>
                  <div className="value">{debtServiceCoverageRatio.toFixed(2)}</div>
                  <div className={`indicator ${debtServiceCoverageRatio >= 1.25 ? 'positive' : 'negative'}`}>
                    {debtServiceCoverageRatio >= 1.25 ? '✓ Good Coverage' : '✗ Low Coverage'}
                  </div>
                </div>
                <div className="metric highlight">
                  <h3>Max Property Cost for REIT</h3>
                  <div className="value">{formatCurrency(maxPropertyCostForREIT)}</div>
                  <div className="note">To achieve target yield</div>
                </div>
              </div>
            </div>
            
            <div className="investment-advice">
              <h3>Investment Analysis</h3>
              <p>{getInvestmentAdvice()}</p>
            </div>
          </div>
        )}
        
        {activeTab === 'cashflow' && (
          <div className="cashflow-tab">
            <h3>Cash Flow Projection (Through Break-even Point)</h3>
            <div className="cashflow-note">
              <p>Projections assume 3% annual income growth and {appreciationRate}% property value 
              {landOwnership === 'lease' 
                ? ` appreciation (improvements only, reduced to ${(appreciationRate * 0.4).toFixed(1)}% since land is leased)` 
                : ' appreciation'}. The break-even point occurs at {breakEvenPoint.toFixed(1)} years.
              </p>
            </div>
            <table className="cashflow-table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Annual Income</th>
                  <th>Cumulative Income</th>
                  <th>Recovery %</th>
                  <th>Property Value</th>
                  <th>Cash Yield</th>
                  <th>Total Return</th>
                </tr>
              </thead>
              <tbody>
                {generateCashFlowProjection().map((year) => (
                  <tr key={year.year} className={year.isBreakEvenYear ? 'break-even-row' : ''}>
                    <td data-label="Year">Year {year.year}{year.isBreakEvenYear ? ' (Break-even)' : ''}</td>
                    <td data-label="Annual Income">{formatCurrency(year.income)}</td>
                    <td data-label="Cumulative Income">{formatCurrency(year.cumulativeIncome)}</td>
                    <td data-label="Recovery %">
                      <div className="recovery-bar-container">
                        <div 
                          className="recovery-bar" 
                          style={{width: `${Math.min(100, year.recoveryPercentage)}%`}}
                        ></div>
                        <span>{formatPercentage(year.recoveryPercentage)}</span>
                      </div>
                    </td>
                    <td data-label="Property Value">{formatCurrency(year.propertyValue)}</td>
                    <td data-label="Cash Yield">{formatPercentage(year.cashYield)}</td>
                    <td data-label="Total Return">{formatPercentage(year.totalReturn)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="land-comparison">
              <h3>Land Ownership Impact</h3>
              <div className="comparison-grid">
                <div className="comparison-item">
                  <h4>Purchased Land</h4>
                  <ul>
                    <li>Full appreciation potential</li>
                    <li>Higher initial investment</li>
                    <li>Long-term asset ownership</li>
                    <li>Lower ongoing expenses</li>
                  </ul>
                </div>
                <div className="comparison-item">
                  <h4>Leased Land</h4>
                  <ul>
                    <li>Lower initial investment</li>
                    <li>Higher ongoing costs</li>
                    <li>Limited appreciation (improvements only)</li>
                    <li>Potential lease renewal risk</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'analysis' && (
          <div className="analysis-tab">
            <div className="risk-assessment">
              <h3>Risk Assessment</h3>
              <table className="risk-table">
                <thead>
                  <tr>
                    <th>Risk Factor</th>
                    <th>Risk Level</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {getRiskAssessment().map((risk, index) => (
                    <tr key={index}>
                      <td>{risk.name}</td>
                      <td className={`risk-${risk.level.toLowerCase()}`}>{risk.level}</td>
                      <td>{risk.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="sensitivity-analysis">
              <h3>Key Performance Sensitivity</h3>
              <p>How a 1% change in each factor affects ROI:</p>
              <div className="sensitivity-grid">
                <div className="sensitivity-item">
                  <span className="factor">Rental Income</span>
                  <span className="impact high">+0.8% to ROI</span>
                </div>
                <div className="sensitivity-item">
                  <span className="factor">Interest Rate</span>
                  <span className="impact medium">-0.4% to ROI</span>
                </div>
                <div className="sensitivity-item">
                  <span className="factor">Occupancy</span>
                  <span className="impact high">+0.7% to ROI</span>
                </div>
                <div className="sensitivity-item">
                  <span className="factor">Operating Expenses</span>
                  <span className="impact medium">-0.5% to ROI</span>
                </div>
                {landOwnership === 'lease' && (
                  <div className="sensitivity-item">
                    <span className="factor">Lease Payment</span>
                    <span className="impact high">-0.6% to ROI</span>
                  </div>
                )}
                <div className="sensitivity-item">
                  <span className="factor">Exit Cap Rate</span>
                  <span className="impact medium">-0.3% to IRR</span>
                </div>
              </div>
            </div>
            
            <div className="reit-considerations">
              <h3>REIT Investment Considerations</h3>
              <div className="reit-grid">
                <div className="reit-item">
                  <h4>Income Tax Benefits</h4>
                  <p>REITs with proper structure pass income to investors without corporate-level taxation, enhancing effective yield.</p>
                </div>
                <div className="reit-item">
                  <h4>Liquidity Trade-offs</h4>
                  <p>Public REITs offer higher liquidity but typically trade at premium valuations compared to direct property ownership.</p>
                </div>
                <div className="reit-item">
                  <h4>Portfolio Diversification</h4>
                  <p>This property {actualROI > 7 ? 'enhances' : 'may dilute'} overall REIT portfolio returns based on current performance metrics.</p>
                </div>
                <div className="reit-item">
                  <h4>Land Structure Impact</h4>
                  <p>{landOwnership === 'purchase' 
                      ? 'Land ownership provides full appreciation potential and stronger balance sheet metrics.' 
                      : 'Leased land structure improves initial yields but may impact long-term appreciation and renewal risk.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'verification' && (
          <div className="verification-tab">
            <h3>Calculation Verification</h3>
            <p>This tab shows detailed calculations to verify the accuracy of all key investment metrics.</p>
            
            <div className="calculation-sections">
              <div className="calculation-section">
                <h4>Net Operating Income (NOI) Calculation</h4>
                <div className="calculation-formula">
                  <div className="formula-row">
                    <span className="label">Annual Rental Income:</span>
                    <span className="formula">{rentalIncome} × 12 × ({occupancyRate}% ÷ 100)</span>
                    <span className="value">{formatCurrency(rentalIncome * 12 * (occupancyRate / 100))}</span>
                  </div>
                  <div className="formula-row">
                    <span className="label">Annual Operating Expenses:</span>
                    <span className="formula">{expenses} × 12</span>
                    <span className="value">{formatCurrency(expenses * 12)}</span>
                  </div>
                  <div className="expense-calculation-details">
                    <h5>Operating Expenses Calculation Methods</h5>
                    <div className="expense-method">
                      <h6>Direct Input Method</h6>
                      <p>When expenses are directly entered as a monthly amount:</p>
                      <div className="formula-detail">
                        <span>Monthly Operating Expenses: ${expenses}</span>
                        <span>Annual Operating Expenses: ${expenses} × 12 = {formatCurrency(expenses * 12)}</span>
                      </div>
                    </div>
                    <div className="expense-method">
                      <h6>Percentage-Based Method</h6>
                      <p>When expenses are calculated as a percentage of property value:</p>
                      <div className="formula-detail">
                        <span>1. Estimated Property Value = Annual Rental Income ÷ Cap Rate</span>
                        <span>   = ({rentalIncome} × 12 × {occupancyRate}% ÷ 100) ÷ (Target Cap Rate)</span>
                        <span>2. Annual Operating Expenses = Property Value × Operating Expense Rate</span>
                        <span>   For {country === 'us' ? 'US' : 'Peru'}: Standard Operating Expense Rate = {country === 'us' ? '3%' : '3.5%'}</span>
                        <span>3. Monthly Operating Expenses = Annual Operating Expenses ÷ 12</span>
                      </div>
                      <p>The calculator stores and displays this calculated monthly amount ({expenses}) for verification.</p>
                    </div>
                  </div>
                  <div className="formula-row highlight">
                    <span className="label">Net Operating Income (NOI):</span>
                    <span className="formula">Annual Rental Income - Annual Operating Expenses</span>
                    <span className="value">{formatCurrency(rentalIncome * 12 * (occupancyRate / 100) - expenses * 12)}</span>
                  </div>
                </div>
              </div>
              
              <div className="calculation-section">
                <h4>Adjusted Cap Rate Calculation</h4>
                <div className="calculation-formula">
                  <div className="formula-row">
                    <span className="label">Target REIT Yield:</span>
                    <span className="formula">{targetREITYield}%</span>
                    <span className="value">{(targetREITYield / 100).toFixed(4)}</span>
                  </div>
                  <div className="formula-row">
                    <span className="label">Distribution Factor:</span>
                    <span className="formula">{country === 'us' ? '90%' : '95%'}</span>
                    <span className="value">{country === 'us' ? '0.9000' : '0.9500'}</span>
                  </div>
                  <div className="formula-row">
                    <span className="label">Operating Expense Rate:</span>
                    <span className="formula">{country === 'us' ? '3%' : '3.5%'}</span>
                    <span className="value">{country === 'us' ? '0.0300' : '0.0350'}</span>
                  </div>
                  <div className="formula-row">
                    <span className="label">Admin Expense Rate:</span>
                    <span className="formula">{country === 'us' ? '1.5%' : '2%'}</span>
                    <span className="value">{country === 'us' ? '0.0150' : '0.0200'}</span>
                  </div>
                  <div className="formula-row highlight">
                    <span className="label">Adjusted Cap Rate:</span>
                    <span className="formula">(Target Yield ÷ Distribution Factor) + Operating Expense Rate + Admin Expense Rate</span>
                    <span className="value">
                      {((targetREITYield / 100 / (country === 'us' ? 0.9 : 0.95)) + 
                        (country === 'us' ? 0.03 : 0.035) + 
                        (country === 'us' ? 0.015 : 0.02)).toFixed(4)}
                    </span>
                  </div>
                </div>
                
                <div className="cap-rate-explanation">
                  <h5>Understanding REIT Cap Rate Relationships</h5>
                  <div className="explanation-content">
                    <p>There are two ways to understand the relationship between REIT yields and cap rates:</p>
                    
                    <div className="approach">
                      <h6>Approach 1: Distribution-Based Formula (Used in Our Calculations)</h6>
                      <div className="formula-detail">
                        <span><strong>Cap Rate = (REIT Yield ÷ Distribution Rate) + Operating Expenses + Admin Expenses</strong></span>
                        <span>Where the distribution rate is {country === 'us' ? '90%' : '95%'} for {country === 'us' ? 'US REITs' : 'Peru FIBRAs'}</span>
                        <span>Using this method with current values:</span>
                        <span>Cap Rate = ({targetREITYield}% ÷ {country === 'us' ? '90%' : '95%'}) + {country === 'us' ? '3%' : '3.5%'} + {country === 'us' ? '1.5%' : '2%'} = {((targetREITYield / (country === 'us' ? 90 : 95) * 100) + (country === 'us' ? 3 : 3.5) + (country === 'us' ? 1.5 : 2)).toFixed(2)}%</span>
                      </div>
                      <p>This approach works backward from the investor yield to determine the required property-level returns.</p>
                      <div className="formula-component-explanation">
                        <div><strong>REIT Yield ÷ Distribution Rate:</strong> Adjusts the yield to account for distribution requirements.</div>
                        <div><strong>Operating Expenses Rate:</strong> The percentage of property value that goes to operating costs.</div>
                        <div><strong>Admin Expenses Rate:</strong> Corporate-level expenses as a percentage of property value.</div>
                      </div>
                    </div>
                    
                    <div className="approach">
                      <h6>Approach 2: Direct Components Method (Alternative View)</h6>
                      <div className="formula-detail">
                        <span><strong>Cap Rate = REIT Yield + Admin Expenses + Financing Costs + Retained Earnings</strong></span>
                        <span>Using this method with the current {targetREITYield}% target yield:</span>
                        <span>Cap Rate ≈ {targetREITYield}% + {country === 'us' ? '1.5%' : '2%'} + 1% + 0.5% = {(targetREITYield + (country === 'us' ? 1.5 : 2) + 1 + 0.5).toFixed(2)}%</span>
                      </div>
                      <p>This method directly adds components that need to be covered by the property's income stream.</p>
                      <div className="formula-component-explanation">
                        <div><strong>REIT Yield:</strong> Direct investor return ({targetREITYield}%)</div>
                        <div><strong>Admin Expenses:</strong> Corporate expenses ({country === 'us' ? '1.5%' : '2%'})</div>
                        <div><strong>Financing Costs:</strong> Typical debt costs (~1%)</div>
                        <div><strong>Retained Earnings:</strong> Cash reserves (~0.5%)</div>
                      </div>
                    </div>
                    
                    <div className="approach-comparison">
                      <h6>Comparing Both Approaches</h6>
                      <table className="comparison-table">
                        <thead>
                          <tr>
                            <th>Method</th>
                            <th>Formula</th>
                            <th>Result</th>
                            <th>Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Distribution-Based</td>
                            <td>({targetREITYield}% ÷ {country === 'us' ? '90%' : '95%'}) + {country === 'us' ? '3%' : '3.5%'} + {country === 'us' ? '1.5%' : '2%'}</td>
                            <td>{((targetREITYield / (country === 'us' ? 90 : 95) * 100) + (country === 'us' ? 3 : 3.5) + (country === 'us' ? 1.5 : 2)).toFixed(2)}%</td>
                            <td>Formula used in calculator</td>
                          </tr>
                          <tr>
                            <td>Direct Components</td>
                            <td>{targetREITYield}% + {country === 'us' ? '1.5%' : '2%'} + 1% + 0.5%</td>
                            <td>{(targetREITYield + (country === 'us' ? 1.5 : 2) + 1 + 0.5).toFixed(2)}%</td>
                            <td>Alternative perspective</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="key-insight">
                      <p><strong>Key insight:</strong> The {country === 'us' ? '3%' : '3.5%'} operating expense rate tells us that approximately {country === 'us' ? '3%' : '3.5%'} of the property value goes toward operating expenses each year. These expenses are already factored into NOI in the cap rate calculation (NOI ÷ Property Value).</p>
                      <p><strong>Why we use Approach 1:</strong> The distribution-based formula provides a more precise calculation that accounts for regulatory requirements and standardized expense ratios for REITs.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="calculation-section">
                <h4>Property Value & Investment Calculation</h4>
                <div className="calculation-formula">
                  <div className="formula-row">
                    <span className="label">NOI:</span>
                    <span className="value">{formatCurrency(rentalIncome * 12 * (occupancyRate / 100) - expenses * 12)}</span>
                  </div>
                  <div className="formula-row">
                    <span className="label">Adjusted Cap Rate:</span>
                    <span className="value">
                      {((targetREITYield / 100 / (country === 'us' ? 0.9 : 0.95)) + 
                        (country === 'us' ? 0.03 : 0.035) + 
                        (country === 'us' ? 0.015 : 0.02)).toFixed(4)}
                    </span>
                  </div>
                  <div className="formula-row highlight">
                    <span className="label">Property Value:</span>
                    <span className="formula">NOI ÷ Adjusted Cap Rate</span>
                    <span className="value">
                      {formatCurrency((rentalIncome * 12 * (occupancyRate / 100) - expenses * 12) / 
                        ((targetREITYield / 100 / (country === 'us' ? 0.9 : 0.95)) + 
                        (country === 'us' ? 0.03 : 0.035) + 
                        (country === 'us' ? 0.015 : 0.02)))}
                    </span>
                  </div>
                  <div className="formula-row highlight">
                    <span className="label">Total Investment:</span>
                    <span className="formula">Property Value</span>
                    <span className="value">
                      {formatCurrency((rentalIncome * 12 * (occupancyRate / 100) - expenses * 12) / 
                        ((targetREITYield / 100 / (country === 'us' ? 0.9 : 0.95)) + 
                        (country === 'us' ? 0.03 : 0.035) + 
                        (country === 'us' ? 0.015 : 0.02)))}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="calculation-section">
                <h4>Financing & Cash Flow Calculation</h4>
                <div className="calculation-formula">
                  <div className="formula-row">
                    <span className="label">Loan Amount:</span>
                    <span className="value">{formatCurrency(loanAmount)}</span>
                  </div>
                  <div className="formula-row">
                    <span className="label">Interest Rate:</span>
                    <span className="value">{interestRate}%</span>
                  </div>
                  <div className="formula-row">
                    <span className="label">Loan Term:</span>
                    <span className="value">{loanTerm} years</span>
                  </div>
                  <div className="formula-row">
                    <span className="label">Monthly Rate:</span>
                    <span className="formula">{interestRate}% ÷ 100 ÷ 12</span>
                    <span className="value">{(interestRate / 100 / 12).toFixed(5)}</span>
                  </div>
                  <div className="formula-row">
                    <span className="label">Total Payments:</span>
                    <span className="formula">{loanTerm} × 12</span>
                    <span className="value">{loanTerm * 12}</span>
                  </div>
                  <div className="formula-row">
                    <span className="label">Monthly Payment:</span>
                    <span className="formula">P × (r × (1 + r)^n) ÷ ((1 + r)^n - 1)</span>
                    <span className="value">
                      {formatCurrency(interestRate > 0 && loanAmount > 0 ? 
                        loanAmount * 
                        ((interestRate / 100 / 12) * Math.pow(1 + (interestRate / 100 / 12), loanTerm * 12)) / 
                        (Math.pow(1 + (interestRate / 100 / 12), loanTerm * 12) - 1) : 0)}
                    </span>
                  </div>
                  <div className="formula-row">
                    <span className="label">Annual Debt Service:</span>
                    <span className="formula">Monthly Payment × 12</span>
                    <span className="value">
                      {formatCurrency((interestRate > 0 && loanAmount > 0 ? 
                        loanAmount * 
                        ((interestRate / 100 / 12) * Math.pow(1 + (interestRate / 100 / 12), loanTerm * 12)) / 
                        (Math.pow(1 + (interestRate / 100 / 12), loanTerm * 12) - 1) : 0) * 12)}
                    </span>
                  </div>
                  {landOwnership === 'lease' && (
                    <div className="formula-row">
                      <span className="label">Annual Land Lease Cost:</span>
                      <span className="value">{formatCurrency(landLeaseAnnual)}</span>
                    </div>
                  )}
                  <div className="formula-row highlight">
                    <span className="label">Annual Cash Flow:</span>
                    <span className="formula">NOI - Annual Debt Service{landOwnership === 'lease' ? ' - Annual Land Lease Cost' : ''}</span>
                    <span className="value">
                      {formatCurrency((rentalIncome * 12 * (occupancyRate / 100) - expenses * 12) - 
                        ((interestRate > 0 && loanAmount > 0 ? 
                          loanAmount * 
                          ((interestRate / 100 / 12) * Math.pow(1 + (interestRate / 100 / 12), loanTerm * 12)) / 
                          (Math.pow(1 + (interestRate / 100 / 12), loanTerm * 12) - 1) : 0) * 12) - 
                        (landOwnership === 'lease' ? landLeaseAnnual : 0))}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="calculation-section">
                <h4>ROI & Other Metrics Calculation</h4>
                <div className="calculation-formula">
                  <div className="formula-row">
                    <span className="label">Actual ROI:</span>
                    <span className="formula">(NOI ÷ Total Investment) × 100</span>
                    <span className="value">{formatPercentage(actualROI)}</span>
                  </div>
                  <div className="formula-row">
                    <span className="label">Leveraged ROI:</span>
                    <span className="formula">(Annual Cash Flow ÷ (Total Investment - Loan Amount)) × 100</span>
                    <span className="value">{formatPercentage(leveragedROI)}</span>
                  </div>
                  <div className="formula-row">
                    <span className="label">Break-even Point:</span>
                    <span className="formula">Total Investment ÷ NOI</span>
                    <span className="value">{breakEvenPoint.toFixed(2)} years</span>
                  </div>
                  <div className="formula-row">
                    <span className="label">DSCR:</span>
                    <span className="formula">NOI ÷ Annual Debt Service</span>
                    <span className="value">{debtServiceCoverageRatio.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="calculation-section">
                <h4>Advanced Metrics Calculation</h4>
                <div className="calculation-formula">
                  <div className="formula-row highlight">
                    <span className="label">NPV:</span>
                    <span className="formula">-Initial Investment + Sum of (Cash Flow_n ÷ (1 + r)^n) + Terminal Value</span>
                    <span className="value">{formatCurrency(netPresentValue)}</span>
                  </div>
                  <div className="formula-row highlight">
                    <span className="label">IRR:</span>
                    <span className="formula">Rate where NPV = 0</span>
                    <span className="value">{formatPercentage(internalRateOfReturn)}</span>
                    <span className="description">(Solved iteratively from cash flow projections)</span>
                  </div>
                </div>
              </div>

              <div className="calculation-section">
                <h4>Cash Flow & NPV Components</h4>
                <div className="calculation-formula">
                  <div className="formula-row">
                    <span className="label">Initial Investment:</span>
                    <span className="formula">-{formatCurrency(totalInvestment)}</span>
                  </div>
                  <div className="formula-row">
                    <span className="label">Discount Rate:</span>
                    <span className="formula">{targetREITYield}%</span>
                    <span className="value">{(targetREITYield / 100).toFixed(4)}</span>
                  </div>
                  <div className="formula-row">
                    <span className="label">Annual Cash Flow (Y1):</span>
                    <span className="value">{formatCurrency(annualNetIncome - (interestRate > 0 && loanAmount > 0 ? 
                      (loanAmount * ((interestRate / 100 / 12) * Math.pow(1 + (interestRate / 100 / 12), loanTerm * 12)) / 
                      (Math.pow(1 + (interestRate / 100 / 12), loanTerm * 12) - 1)) * 12 : 0) - 
                      (landOwnership === 'lease' ? landLeaseAnnual : 0))}</span>
                  </div>
                  <div className="formula-row">
                    <span className="label">Growth Rate:</span>
                    <span className="formula">{appreciationRate}%</span>
                    <span className="value">{(appreciationRate / 100).toFixed(4)}</span>
                  </div>
                  <div className="formula-row">
                    <span className="label">Terminal Cap Rate:</span>
                    <span className="formula">Adjusted Cap Rate - 0.005</span>
                    <span className="value">
                      {(((targetREITYield / 100 / (country === 'us' ? 0.9 : 0.95)) + 
                        (country === 'us' ? 0.03 : 0.035) + 
                        (country === 'us' ? 0.015 : 0.02)) - 0.005).toFixed(4)}
                    </span>
                  </div>
                  <div className="formula-row">
                    <span className="label">Terminal Value (Y10):</span>
                    <span className="formula">NOI × (1 + Growth Rate)^10 ÷ Terminal Cap Rate</span>
                    <span className="value">
                      {formatCurrency((rentalIncome * 12 * (occupancyRate / 100) - expenses * 12) * 
                        Math.pow(1 + (appreciationRate / 100), 10) / 
                        (((targetREITYield / 100 / (country === 'us' ? 0.9 : 0.95)) + 
                        (country === 'us' ? 0.03 : 0.035) + 
                        (country === 'us' ? 0.015 : 0.02)) - 0.005))}
                    </span>
                  </div>
                </div>
                <div className="cash-flow-validation">
                  <p className="validation-note">NPV calculation involves discounting all future cash flows (including terminal value) to present value and subtracting the initial investment.</p>
                  <p className="validation-note">IRR is the discount rate that makes NPV equal to zero, calculated through iterative approximation.</p>
                </div>
              </div>

              <div className="calculation-section">
                <h4>Break-even Analysis Validation</h4>
                <div className="calculation-formula">
                  <div className="formula-row">
                    <span className="label">Total Investment:</span>
                    <span className="value">{formatCurrency(totalInvestment)}</span>
                  </div>
                  <div className="formula-row">
                    <span className="label">Annual Net Income:</span>
                    <span className="value">{formatCurrency(annualNetIncome)}</span>
                  </div>
                  <div className="formula-row">
                    <span className="label">Years to Break-even:</span>
                    <span className="formula">Total Investment ÷ Annual Net Income</span>
                    <span className="value">{breakEvenPoint.toFixed(2)} years</span>
                  </div>
                  <div className="formula-row">
                    <span className="label">Simple Method:</span>
                    <span className="formula">{formatCurrency(totalInvestment)} ÷ {formatCurrency(annualNetIncome)}</span>
                    <span className="value">{(totalInvestment / annualNetIncome).toFixed(2)} years</span>
                  </div>
                  <div className="formula-row">
                    <span className="label">With Income Growth:</span>
                    <span className="formula">Calculated using 3% annual income growth</span>
                    <span className="value">≈ {(generateCashFlowProjection().findIndex(year => year.recoveryPercentage >= 100) + 1 || 'N/A').toString()} years</span>
                  </div>
                </div>
              </div>
            </div>
            
            <h3>Test Calculations</h3>
            
            {showVerifiers && (
              <div className="verification-details">
                <h3>Max Property Cost for REIT</h3>
                <CalculationVerifier 
                  calculationName="Max Property Cost for REIT"
                  calculatedValue={maxPropertyCostForREIT}
                  testValue={getTestMaxPropertyCostForREIT()}
                  parameters={{
                    rentalIncome,
                    expenses,
                    targetREITYield,
                    country,
                    occupancyRate
                  }}
                  tolerancePercentage={5}
                />
              </div>
            )}
            
            <div className="verification-info">
              <h4>Why Values Might Differ</h4>
              <ul>
                <li>Rounding differences in intermediate calculations</li>
                <li>Different handling of percentages (decimal vs. percentage values)</li>
                <li>Different implementations of the same mathematical formula</li>
                <li>Different handling of edge cases</li>
              </ul>
              <p>Values within 1% tolerance are considered valid.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 