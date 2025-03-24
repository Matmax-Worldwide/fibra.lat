import React from 'react';

interface CalculationResults {
  propertyMetrics: {
    totalArea: number;
    buildingCost: number;
    landCost: number;
    totalInvestment: number;
    hotelRooms: number;
    servicedRooms: number;
    airbnbUnits: number;
  };
  investmentMetrics: {
    roi: number;
    cap: number;
    cashOnCash: number;
    irr: number;
    paybackPeriod: number;
    npv: number;
  };
  annualRevenue: {
    hotelRevenue: number;
    servicedRevenue: number;
    airbnbRevenue: number;
    commercialRevenue: number;
    totalRevenue: number;
  };
  formatPerformance: {
    hotelOccupancy: number;
    servicedOccupancy: number;
    airbnbOccupancy: number;
    hotelAdr: number;
    servicedAdr: number;
    airbnbAdr: number;
    hotelRevpar: number;
    servicedRevpar: number;
    airbnbRevpar: number;
  };
  financialMetrics: {
    grossOperatingProfit: number;
    netOperatingIncome: number;
    operatingExpenses: number;
    debtService: number;
    cashFlow: number;
    ebitda: number;
  };
  financingDistribution: {
    equityAmount: number;
    debtAmount: number;
    equityReturn: number;
    debtReturn: number;
    weightedReturn: number;
  };
  optimizationInsights?: {
    isOptimal: boolean;
    recommendations: string[];
    potentialImprovement: number;
  };
}

interface ResultsDisplayProps {
  results: CalculationResults | null;
  propertyName: string;
  location: string;
  isLoading: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  results,
  propertyName,
  location,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="results-loading">
        <div className="spinner"></div>
        <p className="loading-text">Calculating comprehensive investment model...</p>
      </div>
    );
  }

  if (!results) {
    return null;
  }

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

  const formatNumber = (value: number, digits: number = 1): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    }).format(value);
  };

  return (
    <>
      <div className="results-header">
        <h3>Investment Analysis Results</h3>
        <div className="project-details">
          <div className="project-name">{propertyName || 'Mixed-Use Property'}</div>
          <div className="project-location">{location || 'Location not specified'}</div>
        </div>
      </div>

      <div className="results-grid">
        <div className="result-card">
          <h4>Property Configuration</h4>
          <div className="result-item">
            <div className="result-label">Total Building Area</div>
            <div className="result-value">{formatNumber(results.propertyMetrics.totalArea)} m²</div>
          </div>
          <div className="result-item">
            <div className="result-label">Hotel Rooms</div>
            <div className="result-value">{results.propertyMetrics.hotelRooms}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Serviced Apartments</div>
            <div className="result-value">{results.propertyMetrics.servicedRooms}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Airbnb Units</div>
            <div className="result-value">{results.propertyMetrics.airbnbUnits}</div>
          </div>
          <div className="result-item total">
            <div className="result-label">Total Rooms/Units</div>
            <div className="result-value">
              {results.propertyMetrics.hotelRooms + 
               results.propertyMetrics.servicedRooms + 
               results.propertyMetrics.airbnbUnits}
            </div>
          </div>
        </div>

        <div className="result-card">
          <h4>Investment Metrics</h4>
          <div className="result-item">
            <div className="result-label">Total Investment</div>
            <div className="result-value">{formatCurrency(results.propertyMetrics.totalInvestment)}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Return on Investment</div>
            <div className="result-value">{formatPercentage(results.investmentMetrics.roi)}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Cap Rate</div>
            <div className="result-value">{formatPercentage(results.investmentMetrics.cap)}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Cash on Cash</div>
            <div className="result-value">{formatPercentage(results.investmentMetrics.cashOnCash)}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Payback Period</div>
            <div className="result-value">{formatNumber(results.investmentMetrics.paybackPeriod)} years</div>
          </div>
          <div className="result-item total">
            <div className="result-label">IRR (10 years)</div>
            <div className="result-value">{formatPercentage(results.investmentMetrics.irr)}</div>
          </div>
        </div>

        <div className="result-card">
          <h4>Annual Revenue</h4>
          <div className="result-item">
            <div className="result-label">Hotel Revenue</div>
            <div className="result-value">{formatCurrency(results.annualRevenue.hotelRevenue)}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Serviced Revenue</div>
            <div className="result-value">{formatCurrency(results.annualRevenue.servicedRevenue)}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Airbnb Revenue</div>
            <div className="result-value">{formatCurrency(results.annualRevenue.airbnbRevenue)}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Commercial Revenue</div>
            <div className="result-value">{formatCurrency(results.annualRevenue.commercialRevenue)}</div>
          </div>
          <div className="result-item total">
            <div className="result-label">Total Annual Revenue</div>
            <div className="result-value">{formatCurrency(results.annualRevenue.totalRevenue)}</div>
          </div>
        </div>

        <div className="result-card">
          <h4>Format Performance</h4>
          <div className="result-item">
            <div className="result-label">Hotel Occupancy</div>
            <div className="result-value">{formatPercentage(results.formatPerformance.hotelOccupancy)}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Hotel ADR</div>
            <div className="result-value">{formatCurrency(results.formatPerformance.hotelAdr)}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Hotel RevPAR</div>
            <div className="result-value">{formatCurrency(results.formatPerformance.hotelRevpar)}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Serviced Occupancy</div>
            <div className="result-value">{formatPercentage(results.formatPerformance.servicedOccupancy)}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Serviced ADR</div>
            <div className="result-value">{formatCurrency(results.formatPerformance.servicedAdr)}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Serviced RevPAR</div>
            <div className="result-value">{formatCurrency(results.formatPerformance.servicedRevpar)}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Airbnb Occupancy</div>
            <div className="result-value">{formatPercentage(results.formatPerformance.airbnbOccupancy)}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Airbnb ADR</div>
            <div className="result-value">{formatCurrency(results.formatPerformance.airbnbAdr)}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Airbnb RevPAR</div>
            <div className="result-value">{formatCurrency(results.formatPerformance.airbnbRevpar)}</div>
          </div>
        </div>

        <div className="result-card">
          <h4>Financial Metrics</h4>
          <div className="result-item">
            <div className="result-label">Gross Operating Profit</div>
            <div className="result-value">{formatCurrency(results.financialMetrics.grossOperatingProfit)}</div>
          </div>
          <div className="result-item">
            <div className="result-label">EBITDA</div>
            <div className="result-value">{formatCurrency(results.financialMetrics.ebitda)}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Net Operating Income</div>
            <div className="result-value">{formatCurrency(results.financialMetrics.netOperatingIncome)}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Operating Expenses</div>
            <div className="result-value">{formatCurrency(results.financialMetrics.operatingExpenses)}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Annual Debt Service</div>
            <div className="result-value">{formatCurrency(results.financialMetrics.debtService)}</div>
          </div>
          <div className="result-item total">
            <div className="result-label">Cash Flow</div>
            <div className="result-value">{formatCurrency(results.financialMetrics.cashFlow)}</div>
          </div>
        </div>

        <div className="result-card">
          <h4>Financing Distribution</h4>
          <div className="result-item">
            <div className="result-label">Equity Amount</div>
            <div className="result-value">{formatCurrency(results.financingDistribution.equityAmount)}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Debt Amount</div>
            <div className="result-value">{formatCurrency(results.financingDistribution.debtAmount)}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Equity Return</div>
            <div className="result-value">{formatPercentage(results.financingDistribution.equityReturn)}</div>
          </div>
          <div className="result-item">
            <div className="result-label">Debt Return</div>
            <div className="result-value">{formatPercentage(results.financingDistribution.debtReturn)}</div>
          </div>
          <div className="result-item total">
            <div className="result-label">Weighted Return</div>
            <div className="result-value">{formatPercentage(results.financingDistribution.weightedReturn)}</div>
          </div>
        </div>
      </div>

      {results.optimizationInsights && !results.optimizationInsights.isOptimal && (
        <div className="optimization-notes">
          <h4>Optimization Recommendations</h4>
          <p>Our analysis suggests that your current format configuration may not be optimal. Consider these recommendations to improve your returns by up to {formatPercentage(results.optimizationInsights.potentialImprovement)}:</p>
          <ul>
            {results.optimizationInsights.recommendations.map((recommendation, index) => (
              <li key={index}>{recommendation}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default ResultsDisplay; 