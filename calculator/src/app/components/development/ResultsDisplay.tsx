import React from 'react';
import { MultiFormatResults } from '../../models/MultiFormatModel';

interface ResultsDisplayProps {
  results: MultiFormatResults | null;
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
    <div className="results-display">
      <div className="results-header">
        <h3>Investment Analysis Results</h3>
        <div className="project-details">
          <div className="project-name">{propertyName || 'Unnamed Project'}</div>
          <div className="project-location">{location || 'Location not specified'}</div>
        </div>
      </div>

      <div className="results-grid">
        <div className="result-card property-metrics">
          <h4>Property Metrics</h4>
          <div className="result-item">
            <span className="result-label">Total Rooms:</span>
            <span className="result-value">{results.totalRooms}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Total Area:</span>
            <span className="result-value">{formatNumber(results.totalArea)} m²</span>
          </div>
          <div className="result-item">
            <span className="result-label">Format Mix:</span>
            <span className="result-value">
              {results.hotelPercentage}% Hotel / {results.servicedPercentage}% Serviced / {results.airbnbPercentage}% Airbnb
            </span>
          </div>
          <div className="result-item">
            <span className="result-label">Stabilized Occupancy:</span>
            <span className="result-value">{formatPercentage(results.stabilizedOccupancy)}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Stabilized ADR:</span>
            <span className="result-value">{formatCurrency(results.stabilizedAdr)}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Stabilized RevPAR:</span>
            <span className="result-value">{formatCurrency(results.stabilizedRevPar)}</span>
          </div>
        </div>

        <div className="result-card investment-metrics">
          <h4>Investment</h4>
          <div className="result-item">
            <span className="result-label">Acquisition Cost:</span>
            <span className="result-value">{formatCurrency(results.acquisitionCost)}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Renovation Cost:</span>
            <span className="result-value">{formatCurrency(results.renovationCost)}</span>
          </div>
          <div className="result-item">
            <span className="result-label">FF&E Cost:</span>
            <span className="result-value">{formatCurrency(results.ffeCost)}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Amenities Cost:</span>
            <span className="result-value">{formatCurrency(results.amenitiesCost)}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Commercial Spaces Cost:</span>
            <span className="result-value">{formatCurrency(results.commercialSpacesCost)}</span>
          </div>
          <div className="result-item total">
            <span className="result-label">Total Investment:</span>
            <span className="result-value">{formatCurrency(results.totalInvestment)}</span>
          </div>
        </div>

        <div className="result-card revenue-metrics">
          <h4>Annual Revenue</h4>
          <div className="result-item">
            <span className="result-label">Room Revenue:</span>
            <span className="result-value">{formatCurrency(results.annualRoomRevenue)}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Auxiliary Revenue:</span>
            <span className="result-value">{formatCurrency(results.annualAuxiliaryRevenue)}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Commercial Revenue:</span>
            <span className="result-value">{formatCurrency(results.annualCommercialRevenue)}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Total Revenue:</span>
            <span className="result-value">{formatCurrency(results.totalAnnualRevenue)}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Operating Expenses:</span>
            <span className="result-value">{formatCurrency(results.operatingExpenses)}</span>
          </div>
          <div className="result-item total">
            <span className="result-label">Net Operating Income:</span>
            <span className="result-value">{formatCurrency(results.netOperatingIncome)}</span>
          </div>
        </div>

        <div className="result-card format-metrics">
          <h4>Format Performance</h4>
          <div className="result-item">
            <span className="result-label">Hotel NOI:</span>
            <span className="result-value">{formatCurrency(results.hotelNoi)}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Serviced Apts NOI:</span>
            <span className="result-value">{formatCurrency(results.servicedNoi)}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Airbnb NOI:</span>
            <span className="result-value">{formatCurrency(results.airbnbNoi)}</span>
          </div>
        </div>

        <div className="result-card financial-metrics">
          <h4>Financial Metrics</h4>
          <div className="result-item">
            <span className="result-label">Cap Rate:</span>
            <span className="result-value">{formatPercentage(results.capRate)}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Return on Investment:</span>
            <span className="result-value">{formatPercentage(results.returnOnInvestment)}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Payback Period:</span>
            <span className="result-value">{formatNumber(results.paybackPeriod)} years</span>
          </div>
          <div className="result-item">
            <span className="result-label">Estimated Property Value:</span>
            <span className="result-value">{formatCurrency(results.estimatedPropertyValue)}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Value Creation:</span>
            <span className="result-value">{formatCurrency(results.valueCreation)} ({formatPercentage(results.valueCreationPercentage)})</span>
          </div>
        </div>

        <div className="result-card financing-metrics">
          <h4>Financing & Distributions</h4>
          <div className="result-item">
            <span className="result-label">Debt Financing:</span>
            <span className="result-value">{formatCurrency(results.financingAmount)}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Annual Debt Service:</span>
            <span className="result-value">{formatCurrency(results.annualDebtService)}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Debt Coverage Ratio:</span>
            <span className="result-value">{formatNumber(results.debtCoverageRatio)}x</span>
          </div>
          <div className="result-item">
            <span className="result-label">Target Distribution:</span>
            <span className="result-value">{formatCurrency(results.targetDistribution)}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Actual Distribution:</span>
            <span className="result-value">{formatCurrency(results.actualDistribution)}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Distribution Yield:</span>
            <span className="result-value">{formatPercentage(results.distributionYield)}</span>
          </div>
        </div>
      </div>

      {results.isOptimal && (
        <div className="optimization-notes">
          <h4>Optimization Insights</h4>
          <p>{results.optimizationNotes}</p>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay; 