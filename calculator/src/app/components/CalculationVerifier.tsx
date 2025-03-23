import React, { useState, useEffect } from 'react';
import './CalculationVerifier.css';

interface VerifierProps {
  calculationName: string;
  calculatedValue: number;
  testValue: number;
  parameters: Record<string, any>;
  tolerancePercentage?: number;
}

export function CalculationVerifier({
  calculationName,
  calculatedValue,
  testValue,
  parameters,
  tolerancePercentage = 5
}: VerifierProps) {
  const [expanded, setExpanded] = useState(false);
  const difference = Math.abs(calculatedValue - testValue);
  const percentageDifference = testValue ? (difference / testValue) * 100 : 0;
  const isWithinTolerance = percentageDifference <= tolerancePercentage;
  
  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  return (
    <div className={`calculation-verifier ${isWithinTolerance ? 'valid' : 'invalid'}`}>
      <div className="verifier-header" onClick={() => setExpanded(!expanded)}>
        <h3>{calculationName} Verification</h3>
        <div className="status-indicator">
          {isWithinTolerance ? (
            <span className="valid-indicator">✓ Validated</span>
          ) : (
            <span className="invalid-indicator">✗ Values Do Not Match</span>
          )}
          <span className="toggle-icon">{expanded ? '▼' : '▶'}</span>
        </div>
      </div>
      
      {expanded && (
        <div className="verifier-details">
          <div className="comparison">
            <div className="value-display">
              <label>App Calculation:</label>
              <span className="value">{formatCurrency(calculatedValue)}</span>
            </div>
            <div className="value-display">
              <label>Test Value:</label>
              <span className="value">{formatCurrency(testValue)}</span>
            </div>
            <div className="value-display">
              <label>Difference:</label>
              <span className={`value ${isWithinTolerance ? 'valid-diff' : 'invalid-diff'}`}>
                {formatCurrency(difference)} ({percentageDifference.toFixed(2)}%)
              </span>
            </div>
          </div>
          
          <div className="parameters">
            <h4>Calculation Parameters</h4>
            <table>
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(parameters).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{typeof value === 'number' ? value.toString() : String(value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalculationVerifier; 