import React from 'react';

interface FinancialParametersProps {
  propertyName: string;
  location: string;
  totalArea: number;
  acquisitionPrice: number;
  equityPercentage: number;
  debtInterestRate: number;
  loanTermYears: number;
  exitCapRate: number;
  targetDistributionYield: number;
  onPropertyNameChange: (name: string) => void;
  onLocationChange: (location: string) => void;
  onTotalAreaChange: (area: number) => void;
  onAcquisitionPriceChange: (price: number) => void;
  onEquityPercentageChange: (percentage: number) => void;
  onDebtInterestRateChange: (rate: number) => void;
  onLoanTermYearsChange: (years: number) => void;
  onExitCapRateChange: (rate: number) => void;
  onTargetDistributionYieldChange: (yield_: number) => void;
}

const FinancialParameters: React.FC<FinancialParametersProps> = ({
  propertyName,
  location,
  totalArea,
  acquisitionPrice,
  equityPercentage,
  debtInterestRate,
  loanTermYears,
  exitCapRate,
  targetDistributionYield,
  onPropertyNameChange,
  onLocationChange,
  onTotalAreaChange,
  onAcquisitionPriceChange,
  onEquityPercentageChange,
  onDebtInterestRateChange,
  onLoanTermYearsChange,
  onExitCapRateChange,
  onTargetDistributionYieldChange
}) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="financial-parameters">
      <div className="input-section-header">
        <h3>Property & Financial Parameters</h3>
      </div>

      <div className="input-grid">
        <div className="input-group">
          <label htmlFor="property-name">Property Name</label>
          <input
            type="text"
            id="property-name"
            value={propertyName}
            onChange={(e) => onPropertyNameChange(e.target.value)}
            placeholder="Property Name"
          />
        </div>

        <div className="input-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="City, Country"
          />
        </div>

        <div className="input-group">
          <label htmlFor="total-area">Total Building Area (m²)</label>
          <input
            type="number"
            id="total-area"
            value={totalArea}
            onChange={(e) => onTotalAreaChange(Number(e.target.value))}
            min="0"
            step="100"
          />
        </div>

        <div className="input-group">
          <label htmlFor="acquisition-price">Acquisition Price</label>
          <input
            type="number"
            id="acquisition-price"
            value={acquisitionPrice}
            onChange={(e) => onAcquisitionPriceChange(Number(e.target.value))}
            min="0"
            step="100000"
          />
          <div className="input-helper">
            {totalArea > 0 ? `${formatCurrency(acquisitionPrice / totalArea)}/m²` : ''}
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="equity-percentage">Equity Percentage</label>
          <div className="input-with-suffix">
            <input
              type="number"
              id="equity-percentage"
              value={equityPercentage}
              onChange={(e) => onEquityPercentageChange(Number(e.target.value))}
              min="0"
              max="100"
              step="1"
            />
            <span className="input-suffix">%</span>
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="debt-interest-rate">Debt Interest Rate</label>
          <div className="input-with-suffix">
            <input
              type="number"
              id="debt-interest-rate"
              value={debtInterestRate}
              onChange={(e) => onDebtInterestRateChange(Number(e.target.value))}
              min="0"
              step="0.25"
            />
            <span className="input-suffix">%</span>
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="loan-term-years">Loan Term</label>
          <div className="input-with-suffix">
            <input
              type="number"
              id="loan-term-years"
              value={loanTermYears}
              onChange={(e) => onLoanTermYearsChange(Number(e.target.value))}
              min="0"
              step="1"
            />
            <span className="input-suffix">years</span>
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="exit-cap-rate">Exit Cap Rate</label>
          <div className="input-with-suffix">
            <input
              type="number"
              id="exit-cap-rate"
              value={exitCapRate}
              onChange={(e) => onExitCapRateChange(Number(e.target.value))}
              min="0"
              step="0.25"
            />
            <span className="input-suffix">%</span>
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="target-distribution-yield">Target Distribution Yield</label>
          <div className="input-with-suffix">
            <input
              type="number"
              id="target-distribution-yield"
              value={targetDistributionYield}
              onChange={(e) => onTargetDistributionYieldChange(Number(e.target.value))}
              min="0"
              step="0.25"
            />
            <span className="input-suffix">%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialParameters; 