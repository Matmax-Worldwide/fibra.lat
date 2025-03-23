import { useState, ChangeEvent } from 'react';
import './Calculator.css';

interface InvestmentParams {
  landPrice: number;
  constructionCost: number;
  otherCosts: number;
  rentalIncome: number;
  expenses: number;
  interestRate: number;
  loanAmount: number;
  loanTerm: number;
}

interface CalculationResult {
  totalInvestment: number;
  annualNetIncome: number;
  actualROI: number;
  breakEvenPoint: number;
  netPresentValue: number;
  internalRateOfReturn: number;
  debtServiceCoverageRatio: number;
  maxAffordableLandPrice: number;
}

export function Calculator() {
  // State for investment parameters
  const [params, setParams] = useState<InvestmentParams>({
    landPrice: 0,
    constructionCost: 0,
    otherCosts: 0,
    rentalIncome: 0,
    expenses: 0,
    interestRate: 5,
    loanAmount: 0,
    loanTerm: 20
  });

  // State for calculation results
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [showReport, setShowReport] = useState(false);

  // Calculate investment metrics
  const calculateInvestment = () => {
    // Calculate total investment cost
    const totalInvestment = params.landPrice + params.constructionCost + params.otherCosts;
    
    // Calculate annual net income
    const annualNetIncome = (params.rentalIncome * 12) - (params.expenses * 12);
    
    // Calculate ROI
    const actualROI = (annualNetIncome / totalInvestment) * 100;
    
    // Calculate break-even point (in years)
    const breakEvenPoint = totalInvestment / annualNetIncome;
    
    // Calculate Net Present Value (NPV)
    const calculateNPV = () => {
      const discountRate = params.interestRate / 100;
      let npv = -totalInvestment;
      
      // Assume 10-year investment horizon
      for (let year = 1; year <= 10; year++) {
        npv += annualNetIncome / Math.pow(1 + discountRate, year);
      }
      
      return npv;
    };
    
    // Calculate Internal Rate of Return (IRR)
    // Using a simple approximation method
    const calculateIRR = () => {
      let irr = 0;
      const step = 0.01;
      
      // Find the discount rate that makes NPV close to zero
      while (irr < 1) {
        let npv = -totalInvestment;
        
        for (let year = 1; year <= 10; year++) {
          npv += annualNetIncome / Math.pow(1 + irr, year);
        }
        
        if (Math.abs(npv) < 1000) {
          break;
        }
        
        irr += step;
      }
      
      return irr * 100; // Convert to percentage
    };
    
    // Calculate Debt Service Coverage Ratio
    const calculateDSCR = () => {
      // Monthly payment calculation
      const monthlyInterestRate = params.interestRate / 100 / 12;
      const totalPayments = params.loanTerm * 12;
      
      const monthlyPayment = params.loanAmount * 
        (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments)) / 
        (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);
      
      const annualDebtService = monthlyPayment * 12;
      
      return annualNetIncome / annualDebtService;
    };
    
    // Calculate maximum affordable land price
    const calculateMaxLandPrice = () => {
      // Target ROI (assume 8% as a reasonable investment target)
      const targetROI = 0.08;
      
      // Maximum investment based on target ROI
      const maxInvestment = annualNetIncome / targetROI;
      
      // Maximum affordable land price
      return maxInvestment - params.constructionCost - params.otherCosts;
    };
    
    // Set results
    const calculationResults: CalculationResult = {
      totalInvestment,
      annualNetIncome,
      actualROI,
      breakEvenPoint,
      netPresentValue: calculateNPV(),
      internalRateOfReturn: calculateIRR(),
      debtServiceCoverageRatio: calculateDSCR(),
      maxAffordableLandPrice: calculateMaxLandPrice()
    };
    
    setResults(calculationResults);
    setShowReport(true);
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof InvestmentParams;
    const value = e.target.value;
    
    setParams(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  };

  return (
    <div className="calculator">
      <h1>Real Estate Investment Calculator</h1>
      <p>Analyze the viability of your real estate investment project</p>
      
      <div className="calculator-container">
        <div className="input-section">
          <h2>Investment Parameters</h2>
          
          <div className="input-group">
            <div className="input-field">
              <label htmlFor="landPrice">Land Price ($)</label>
              <input
                type="number"
                id="landPrice"
                name="landPrice"
                value={params.landPrice || ''}
                onChange={handleInputChange}
                placeholder="0"
              />
            </div>
            
            <div className="input-field">
              <label htmlFor="constructionCost">Construction Cost ($)</label>
              <input
                type="number"
                id="constructionCost"
                name="constructionCost"
                value={params.constructionCost || ''}
                onChange={handleInputChange}
                placeholder="0"
              />
            </div>
            
            <div className="input-field">
              <label htmlFor="otherCosts">Other Costs ($)</label>
              <input
                type="number"
                id="otherCosts"
                name="otherCosts"
                value={params.otherCosts || ''}
                onChange={handleInputChange}
                placeholder="0"
              />
            </div>
            
            <div className="input-field">
              <label htmlFor="rentalIncome">Monthly Rental Income ($)</label>
              <input
                type="number"
                id="rentalIncome"
                name="rentalIncome"
                value={params.rentalIncome || ''}
                onChange={handleInputChange}
                placeholder="0"
              />
            </div>
            
            <div className="input-field">
              <label htmlFor="expenses">Monthly Expenses ($)</label>
              <input
                type="number"
                id="expenses"
                name="expenses"
                value={params.expenses || ''}
                onChange={handleInputChange}
                placeholder="0"
              />
            </div>
            
            <div className="input-field">
              <label htmlFor="interestRate">Interest Rate (%)</label>
              <input
                type="number"
                id="interestRate"
                name="interestRate"
                value={params.interestRate || ''}
                onChange={handleInputChange}
                placeholder="5"
                step="0.1"
              />
            </div>
            
            <div className="input-field">
              <label htmlFor="loanAmount">Loan Amount ($)</label>
              <input
                type="number"
                id="loanAmount"
                name="loanAmount"
                value={params.loanAmount || ''}
                onChange={handleInputChange}
                placeholder="0"
              />
            </div>
            
            <div className="input-field">
              <label htmlFor="loanTerm">Loan Term (years)</label>
              <input
                type="number"
                id="loanTerm"
                name="loanTerm"
                value={params.loanTerm || ''}
                onChange={handleInputChange}
                placeholder="20"
              />
            </div>
          </div>
          
          <button className="calculate-button" onClick={calculateInvestment}>
            Calculate Investment
          </button>
        </div>
        
        {results && (
          <div className="results-section">
            <h2>Investment Results</h2>
            
            <div className="result-cards">
              <div className="result-card">
                <span>Total Investment</span>
                <strong>{formatCurrency(results.totalInvestment)}</strong>
              </div>
              
              <div className="result-card">
                <span>Annual Net Income</span>
                <strong>{formatCurrency(results.annualNetIncome)}</strong>
              </div>
              
              <div className="result-card">
                <span>Return on Investment</span>
                <strong className={results.actualROI >= 8 ? 'positive' : 'negative'}>
                  {formatPercentage(results.actualROI)}
                </strong>
              </div>
              
              <div className="result-card">
                <span>Break-even Point</span>
                <strong>{results.breakEvenPoint.toFixed(1)} years</strong>
              </div>
              
              <div className="result-card">
                <span>Net Present Value</span>
                <strong className={results.netPresentValue >= 0 ? 'positive' : 'negative'}>
                  {formatCurrency(results.netPresentValue)}
                </strong>
              </div>
              
              <div className="result-card">
                <span>Internal Rate of Return</span>
                <strong className={results.internalRateOfReturn >= params.interestRate ? 'positive' : 'negative'}>
                  {formatPercentage(results.internalRateOfReturn)}
                </strong>
              </div>
              
              <div className="result-card">
                <span>Debt Service Coverage Ratio</span>
                <strong className={results.debtServiceCoverageRatio >= 1.2 ? 'positive' : 'negative'}>
                  {results.debtServiceCoverageRatio.toFixed(2)}
                </strong>
              </div>
              
              <div className="result-card">
                <span>Max Affordable Land Price</span>
                <strong>{formatCurrency(results.maxAffordableLandPrice)}</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 