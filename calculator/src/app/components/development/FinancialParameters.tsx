import React from 'react';

interface FinancialParamsType {
  totalArea: number;
  landCost: number;
  buildingCostPerSqm: number;
  equityRatio: number;
  interestRate: number;
  loanTerm: number;
  discountRate: number;
  exitCapRate: number;
  holdingPeriod: number;
}

interface FinancialParametersProps {
  financialParams: FinancialParamsType;
  onParamChange: (field: string, value: number) => void;
}

const FinancialParameters: React.FC<FinancialParametersProps> = ({
  financialParams,
  onParamChange
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
        <h3>Financial Parameters</h3>
      </div>

      <div className="input-grid">
        <div className="input-group">
          <label htmlFor="total-area">Total Building Area (m²)</label>
          <input
            type="number"
            id="total-area"
            value={financialParams.totalArea}
            onChange={(e) => onParamChange('totalArea', Number(e.target.value))}
            min="0"
            step="100"
          />
        </div>

        <div className="input-group">
          <label htmlFor="land-cost">Land Cost</label>
          <input
            type="number"
            id="land-cost"
            value={financialParams.landCost}
            onChange={(e) => onParamChange('landCost', Number(e.target.value))}
            min="0"
            step="10000"
          />
          <div className="input-helper">
            {financialParams.totalArea > 0 ? `${formatCurrency(financialParams.landCost / financialParams.totalArea)}/m²` : ''}
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="building-cost">Building Cost Per m²</label>
          <input
            type="number"
            id="building-cost"
            value={financialParams.buildingCostPerSqm}
            onChange={(e) => onParamChange('buildingCostPerSqm', Number(e.target.value))}
            min="0"
            step="50"
          />
          <div className="input-helper">
            Total: {formatCurrency(financialParams.buildingCostPerSqm * financialParams.totalArea)}
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="equity-ratio">Equity Percentage</label>
          <div className="input-with-suffix">
            <input
              type="number"
              id="equity-ratio"
              value={financialParams.equityRatio}
              onChange={(e) => onParamChange('equityRatio', Number(e.target.value))}
              min="0"
              max="100"
              step="1"
            />
            <span className="input-suffix">%</span>
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="interest-rate">Debt Interest Rate</label>
          <div className="input-with-suffix">
            <input
              type="number"
              id="interest-rate"
              value={financialParams.interestRate}
              onChange={(e) => onParamChange('interestRate', Number(e.target.value))}
              min="0"
              step="0.25"
            />
            <span className="input-suffix">%</span>
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="loan-term">Loan Term</label>
          <div className="input-with-suffix">
            <input
              type="number"
              id="loan-term"
              value={financialParams.loanTerm}
              onChange={(e) => onParamChange('loanTerm', Number(e.target.value))}
              min="0"
              step="1"
            />
            <span className="input-suffix">years</span>
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="discount-rate">Discount Rate</label>
          <div className="input-with-suffix">
            <input
              type="number"
              id="discount-rate"
              value={financialParams.discountRate}
              onChange={(e) => onParamChange('discountRate', Number(e.target.value))}
              min="0"
              step="0.25"
            />
            <span className="input-suffix">%</span>
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="exit-cap-rate">Exit Cap Rate</label>
          <div className="input-with-suffix">
            <input
              type="number"
              id="exit-cap-rate"
              value={financialParams.exitCapRate}
              onChange={(e) => onParamChange('exitCapRate', Number(e.target.value))}
              min="0"
              step="0.25"
            />
            <span className="input-suffix">%</span>
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="holding-period">Holding Period</label>
          <div className="input-with-suffix">
            <input
              type="number"
              id="holding-period"
              value={financialParams.holdingPeriod}
              onChange={(e) => onParamChange('holdingPeriod', Number(e.target.value))}
              min="0"
              step="1"
            />
            <span className="input-suffix">years</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialParameters; 