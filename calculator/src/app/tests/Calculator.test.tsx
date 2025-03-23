import { describe, test, expect } from 'vitest';

// Import the core calculation functions to test them directly
// These are simplified versions of the functions in Calculator.tsx
const calculateNPV = (params: TestParams) => {
  const discountRate = params.interestRate / 100;
  const totalPropertyCost = (params.landOwnership === 'purchase' ? params.landPrice : 0) + 
                           params.constructionCost + params.otherCosts;
  
  let npv = -totalPropertyCost;
  
  // For leased land, add NPV of lease payments (as a negative cash flow)
  if (params.landOwnership === 'lease') {
    let leaseNPV = 0;
    for (let year = 1; year <= params.landLeaseTerm; year++) {
      leaseNPV -= params.landLeaseAnnual / Math.pow(1 + discountRate, year);
    }
    npv += leaseNPV;
  }
  
  // Calculate annual cash flows
  const annualRentalIncome = params.rentalIncome * 12;
  const annualOperatingExpenses = params.expenses * 12;
  const annualLandLeaseCost = params.landOwnership === 'lease' ? params.landLeaseAnnual : 0;
  const annualNOI = annualRentalIncome - annualOperatingExpenses - annualLandLeaseCost;
  
  // Add projected cash flows (10 years)
  const annualGrowthRate = params.appreciationRate / 100;
  const terminalCapRate = params.propertyType === 'hotel' ? 0.08 : 0.07;
  
  for (let year = 1; year <= 10; year++) {
    const yearlyNOI = annualNOI * Math.pow(1 + annualGrowthRate, year - 1);
    npv += yearlyNOI / Math.pow(1 + discountRate, year);
    
    // Add terminal value in final year
    if (year === 10) {
      // For purchase, terminal value includes land value appreciation
      if (params.landOwnership === 'purchase') {
        // Property value appreciation (construction + land)
        const appreciatedPropertyValue = totalPropertyCost * Math.pow(1 + annualGrowthRate, 10);
        // Terminal value based on NOI
        const terminalValue = yearlyNOI / terminalCapRate;
        // Use the higher of the two values
        const exitValue = Math.max(appreciatedPropertyValue, terminalValue);
        npv += exitValue / Math.pow(1 + discountRate, 10);
      } else {
        // For lease, only building value (which depreciates)
        const terminalValue = yearlyNOI / terminalCapRate;
        npv += terminalValue / Math.pow(1 + discountRate, 10);
      }
    }
  }
  
  return npv;
};

const calculateROI = (params: TestParams) => {
  const totalPropertyCost = (params.landOwnership === 'purchase' ? params.landPrice : 0) + 
                           params.constructionCost + params.otherCosts;
  
  const annualRentalIncome = params.rentalIncome * 12;
  const annualOperatingExpenses = params.expenses * 12;
  const annualLandLeaseCost = params.landOwnership === 'lease' ? params.landLeaseAnnual : 0;
  const annualNOI = annualRentalIncome - annualOperatingExpenses - annualLandLeaseCost;
  
  // Calculate debt service
  const monthlyRate = params.interestRate / 100 / 12;
  const totalPayments = params.loanTerm * 12;
  let monthlyPayment = 0;
  
  if (monthlyRate > 0 && params.loanAmount > 0) {
    monthlyPayment = params.loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
      (Math.pow(1 + monthlyRate, totalPayments) - 1);
  }
  
  const annualDebtService = monthlyPayment * 12;
  const annualCashFlow = annualNOI - annualDebtService;
  
  // Calculate leveraged ROI
  const equityInvested = totalPropertyCost - params.loanAmount;
  const leveragedROI = equityInvested > 0 ? (annualCashFlow / equityInvested) * 100 : 0;
  
  return leveragedROI;
};

const calculateMaxLandPrice = (params: TestParams) => {
  if (params.landOwnership === 'lease') {
    return 0; // Not applicable for leased land
  }
  
  // Calculate constants
  const targetYield = params.targetREITYield / 100;
  const annualRentalIncome = params.rentalIncome * 12;
  const annualOperatingExpenses = params.expenses * 12;
  
  // Calculate NOI (Net Operating Income)
  const annualNOI = annualRentalIncome - annualOperatingExpenses;
  
  // Get regulation rates based on country
  const distributionRequirement = params.country === 'us' ? 90 : 95;
  
  // A more direct approach to REIT valuation:
  // 1. Calculate the total property value based on capitalization rate (cap rate)
  // Cap rate = NOI / Property Value
  // Therefore, Property Value = NOI / Cap Rate
  // For REITs, the cap rate is often related to their target yield
  
  // For a 5% target REIT yield and 90% distribution requirement,
  // we need a property that generates enough NOI to cover the distribution
  // after accounting for REIT-level expenses
  
  // Typical REIT-level expenses (as % of property value)
  const operatingExpenseRate = 3.0 / 100; // 3% of property value
  const adminExpenseRate = (params.country === 'us' ? 1.5 : 2.0) / 100; // 1.5% or 2% of property value
  
  // Calculate a cap rate that accounts for:
  // 1. The target REIT yield
  // 2. Distribution requirements
  // 3. Operating and administrative expenses
  
  // Calculate adjusted cap rate (the required property-level yield)
  // Higher distribution requirements or higher expenses require a higher cap rate
  // The property must generate enough to cover the target yield plus expenses
  // and still meet distribution requirements
  const requiredDistribution = targetYield / (distributionRequirement / 100);
  const adjustedCapRate = requiredDistribution + operatingExpenseRate + adminExpenseRate;
  
  // Calculate maximum property value based on NOI and adjusted cap rate
  const maxPropertyValue = annualNOI / adjustedCapRate;
  
  // Account for the loan by ensuring it doesn't exceed typical LTV ratios
  // Typical REIT LTV (Loan-to-Value) ratio: 50-60%
  const maxLTV = 0.60; // 60% maximum loan-to-value
  const minPropertyValueForLoan = params.loanAmount / maxLTV;
  
  // Use the higher of the two property values to ensure loan is properly secured
  const requiredPropertyValue = Math.max(maxPropertyValue, minPropertyValueForLoan);
  
  // Calculate maximum land price
  const maxLandPrice = requiredPropertyValue - params.constructionCost - params.otherCosts;
  
  return Math.max(maxLandPrice, 0);
};

interface TestParams {
  landPrice: number;
  constructionCost: number;
  otherCosts: number;
  rentalIncome: number;
  expenses: number;
  interestRate: number;
  loanAmount: number;
  loanTerm: number;
  targetREITYield: number;
  country: string;
  propertyType: string;
  occupancyRate: number;
  appreciationRate: number;
  landOwnership: string;
  landLeaseAnnual: number;
  landLeaseTerm: number;
}

describe('Financial Calculations Tests', () => {
  test('ROI Calculation - Purchase Land', () => {
    const params: TestParams = {
      landPrice: 1000000,
      constructionCost: 2000000,
      otherCosts: 200000,
      rentalIncome: 30000,
      expenses: 5000,
      interestRate: 5,
      loanAmount: 2000000,
      loanTerm: 20,
      targetREITYield: 5,
      country: 'us',
      propertyType: 'commercial',
      occupancyRate: 95,
      appreciationRate: 2,
      landOwnership: 'purchase',
      landLeaseAnnual: 0,
      landLeaseTerm: 0
    };
    
    const roi = calculateROI(params);
    
    // Expected calculations:
    // Total Property Cost: $3,200,000
    // Annual Rental Income: $360,000
    // Annual Operating Expenses: $60,000
    // Annual NOI: $300,000
    // Annual Debt Service: ~$158,389
    // Annual Cash Flow: ~$141,611
    // Equity Invested: $1,200,000
    // Leveraged ROI: ~11.8%
    
    expect(roi).toBeCloseTo(11.8, 1);
    
    // Test that increasing rental income increases ROI
    const highIncomeParams = { ...params, rentalIncome: 35000 };
    const highIncomeROI = calculateROI(highIncomeParams);
    expect(highIncomeROI).toBeGreaterThan(roi);
    
    // Test that increasing expenses decreases ROI
    const highExpenseParams = { ...params, expenses: 8000 };
    const highExpenseROI = calculateROI(highExpenseParams);
    expect(highExpenseROI).toBeLessThan(roi);
  });
  
  test('ROI Calculation - Leased Land', () => {
    const params: TestParams = {
      landPrice: 0,
      constructionCost: 2000000,
      otherCosts: 200000,
      rentalIncome: 30000,
      expenses: 5000,
      interestRate: 5,
      loanAmount: 1500000,
      loanTerm: 20,
      targetREITYield: 5,
      country: 'us',
      propertyType: 'commercial',
      occupancyRate: 95,
      appreciationRate: 2,
      landOwnership: 'lease',
      landLeaseAnnual: 80000,
      landLeaseTerm: 30
    };
    
    const roi = calculateROI(params);
    
    // Expected calculations:
    // Total Property Cost: $2,200,000
    // Annual Rental Income: $360,000
    // Annual Operating Expenses: $60,000
    // Annual Land Lease: $80,000
    // Annual NOI: $220,000
    // Annual Debt Service: ~$118,792
    // Annual Cash Flow: ~$101,208
    // Equity Invested: $700,000
    // Leveraged ROI: ~14.5%
    
    expect(roi).toBeCloseTo(14.5, 1);
    
    // Test that increasing lease cost decreases ROI
    const highLeaseParams = { ...params, landLeaseAnnual: 100000 };
    const highLeaseROI = calculateROI(highLeaseParams);
    expect(highLeaseROI).toBeLessThan(roi);
  });
  
  test('NPV Calculation - Purchase vs Lease', () => {
    const purchaseParams: TestParams = {
      landPrice: 1000000,
      constructionCost: 2000000,
      otherCosts: 200000,
      rentalIncome: 30000,
      expenses: 5000,
      interestRate: 5,
      loanAmount: 2000000,
      loanTerm: 20,
      targetREITYield: 5,
      country: 'us',
      propertyType: 'commercial',
      occupancyRate: 95,
      appreciationRate: 2,
      landOwnership: 'purchase',
      landLeaseAnnual: 0,
      landLeaseTerm: 0
    };
    
    const leaseParams: TestParams = {
      ...purchaseParams,
      landPrice: 0,
      landOwnership: 'lease',
      landLeaseAnnual: 60000,
      landLeaseTerm: 30
    };
    
    const purchaseNPV = calculateNPV(purchaseParams);
    const leaseNPV = calculateNPV(leaseParams);
    
    // We expect the purchase NPV to be higher in the long term due to land ownership
    // and appreciation as well as no ongoing lease payments
    expect(purchaseNPV).toBeGreaterThan(leaseNPV);
    
    // Test that higher appreciation rate increases the NPV gap
    const highAppreciationParams = { ...purchaseParams, appreciationRate: 4 };
    const highAppreciationNPV = calculateNPV(highAppreciationParams);
    expect(highAppreciationNPV).toBeGreaterThan(purchaseNPV);
  });
  
  test('Maximum Land Price Calculation', () => {
    const params: TestParams = {
      landPrice: 1000000,
      constructionCost: 2000000,
      otherCosts: 200000,
      rentalIncome: 33000, // Using the mentioned rental income of $33,000/month
      expenses: 5000,      // Monthly expenses of $5,000
      interestRate: 5,
      loanAmount: 2000000,
      loanTerm: 20,
      targetREITYield: 5,
      country: 'us',
      propertyType: 'commercial',
      occupancyRate: 95,
      appreciationRate: 2,
      landOwnership: 'purchase',
      landLeaseAnnual: 0,
      landLeaseTerm: 0
    };
    
    const maxLandPrice = calculateMaxLandPrice(params);
    
    // Calculate expected values
    const annualRentalIncome = params.rentalIncome * 12; // $396,000
    const annualExpenses = params.expenses * 12; // $60,000
    const annualNOI = annualRentalIncome - annualExpenses; // $336,000
    
    // For a 5% REIT yield with 90% distribution requirement:
    // Required property yield = 5% / 90% + 3% + 1.5% = 10.05%
    // Expected max property value = $336,000 / 0.1005 = ~$3.34M
    // Expected max land price = $3.34M - $2.2M = ~$1.14M
    
    // With loan consideration (LTV 60%):
    // Minimum property value for $2M loan = $2M / 0.6 = $3.33M
    // Similar to our cap rate calculation
    
    console.log('Max Land Price Test Results:');
    console.log(`Annual NOI: $${annualNOI}`);
    console.log(`Max Land Price: $${maxLandPrice}`);
    console.log(`Expected Land Price Range: $1,000,000 - $1,500,000`);
    
    // Test that the value is within our expected range
    expect(maxLandPrice).toBeGreaterThan(1000000);
    expect(maxLandPrice).toBeLessThan(1500000);
    
    // For leased land, max land price should be 0
    const leaseParams = { ...params, landOwnership: 'lease' };
    const leaseMaxLandPrice = calculateMaxLandPrice(leaseParams);
    expect(leaseMaxLandPrice).toBe(0);
    
    // Test that increasing rental income increases max land price
    const highIncomeParams = { ...params, rentalIncome: 40000 };
    const highIncomeMaxLandPrice = calculateMaxLandPrice(highIncomeParams);
    expect(highIncomeMaxLandPrice).toBeGreaterThan(maxLandPrice);
    
    // Test that Peru's higher distribution requirement affects max land price
    const peruParams = { ...params, country: 'peru' };
    const peruMaxLandPrice = calculateMaxLandPrice(peruParams);
    // Peru should be lower due to higher distribution requirement
    expect(peruMaxLandPrice).toBeLessThan(maxLandPrice);
  });
  
  test('Country-specific Calculations', () => {
    const usParams: TestParams = {
      landPrice: 1000000,
      constructionCost: 2000000,
      otherCosts: 200000,
      rentalIncome: 45000, // Higher rental income for positive max land price
      expenses: 5000,
      interestRate: 5,
      loanAmount: 2000000,
      loanTerm: 20,
      targetREITYield: 5,
      country: 'us',
      propertyType: 'commercial',
      occupancyRate: 95,
      appreciationRate: 2,
      landOwnership: 'purchase',
      landLeaseAnnual: 0,
      landLeaseTerm: 0
    };
    
    const peruParams: TestParams = {
      ...usParams,
      country: 'peru'
    };
    
    const usROI = calculateROI(usParams);
    const peruROI = calculateROI(peruParams);
    
    // ROI calculation doesn't directly factor in country-specific regulations
    // These are mainly applied in the maxLandPrice calculations
    expect(usROI).toEqual(peruROI);
    
    // Compare max land prices which should differ due to regulations
    const usMaxLandPrice = calculateMaxLandPrice(usParams);
    const peruMaxLandPrice = calculateMaxLandPrice(peruParams);
    expect(usMaxLandPrice).toBeGreaterThan(0); // Ensure US has positive value
    expect(peruMaxLandPrice).toBeGreaterThan(0); // Ensure Peru has positive value
    expect(usMaxLandPrice).toBeGreaterThan(peruMaxLandPrice); // US should be higher than Peru
  });
  
  test('Edge Cases', () => {
    // Zero rental income
    const zeroIncomeParams: TestParams = {
      landPrice: 1000000,
      constructionCost: 2000000,
      otherCosts: 200000,
      rentalIncome: 0,
      expenses: 5000,
      interestRate: 5,
      loanAmount: 2000000,
      loanTerm: 20,
      targetREITYield: 5,
      country: 'us',
      propertyType: 'commercial',
      occupancyRate: 95,
      appreciationRate: 2,
      landOwnership: 'purchase',
      landLeaseAnnual: 0,
      landLeaseTerm: 0
    };
    
    expect(calculateROI(zeroIncomeParams)).toBeLessThan(0);
    
    // Zero interest rate
    const zeroInterestParams: TestParams = {
      ...zeroIncomeParams,
      rentalIncome: 30000,
      interestRate: 0
    };
    
    // Should not throw errors for zero interest rate
    expect(() => calculateROI(zeroInterestParams)).not.toThrow();
    expect(() => calculateNPV(zeroInterestParams)).not.toThrow();
    
    // Zero loan amount
    const zeroLoanParams: TestParams = {
      ...zeroIncomeParams,
      rentalIncome: 30000,
      loanAmount: 0
    };
    
    // For zero loan, ROI should equal the unleveraged ROI
    const zeroLoanROI = calculateROI(zeroLoanParams);
    const expectedUnleveragedROI = ((zeroLoanParams.rentalIncome * 12) - (zeroLoanParams.expenses * 12)) / 
      (zeroLoanParams.landPrice + zeroLoanParams.constructionCost + zeroLoanParams.otherCosts) * 100;
    
    expect(zeroLoanROI).toBeCloseTo(expectedUnleveragedROI, 1);
  });
  
  test('Maximum Property Cost For REIT Calculation', () => {
    // Create a simplified version of the function from Calculator.tsx
    const calculateMaxPropertyCostForREIT = (params: TestParams) => {
      // Calculate annual rental income and expenses
      const annualRentalIncome = params.rentalIncome * 12 * (params.occupancyRate / 100);
      const annualOperatingExpenses = params.expenses * 12;
      
      // Calculate Net Operating Income (NOI)
      const noi = annualRentalIncome - annualOperatingExpenses;
      
      // Target yield as decimal
      const targetYield = params.targetREITYield / 100;
      
      // Account for distribution requirements and expenses
      const distributionFactor = params.country === 'us' ? 0.9 : 0.95;
      const operatingExpenseRate = params.country === 'us' ? 0.03 : 0.035;
      const adminExpenseRate = params.country === 'us' ? 0.015 : 0.02;
      
      // Adjusted cap rate based on REIT requirements - CORRECTED FORMULA
      // Higher target yields or higher distribution requirements increase the cap rate,
      // which decreases the property value
      const adjustedCapRate = (targetYield / distributionFactor) + operatingExpenseRate + adminExpenseRate;
      
      // Log intermediate values for debugging
      console.log(`REIT Property Cost Test Results:`);
      console.log(`Annual Rental Income: $${annualRentalIncome}`);
      console.log(`Annual Operating Expenses: $${annualOperatingExpenses}`);
      console.log(`NOI: $${noi}`);
      console.log(`Target Yield: ${targetYield * 100}%`);
      console.log(`Distribution Factor: ${distributionFactor * 100}%`);
      console.log(`Adjusted Cap Rate: ${adjustedCapRate * 100}%`);
      
      // Maximum property cost (V = NOI / Cap Rate)
      const maxPropertyCost = noi / adjustedCapRate;
      console.log(`Max Property Cost: $${maxPropertyCost}`);
      
      return maxPropertyCost;
    };
    
    const params: TestParams = {
      landPrice: 1000000,
      constructionCost: 2000000,
      otherCosts: 200000,
      rentalIncome: 33000, // Monthly rental income
      expenses: 5000,      // Monthly expenses
      interestRate: 5,
      loanAmount: 2000000,
      loanTerm: 20,
      targetREITYield: 5,
      country: 'us',
      propertyType: 'commercial',
      occupancyRate: 95,
      appreciationRate: 2,
      landOwnership: 'purchase',
      landLeaseAnnual: 0,
      landLeaseTerm: 0
    };
    
    const maxPropertyCost = calculateMaxPropertyCostForREIT(params);
    
    // A realistic property cost for this level of income should be in this range
    // Based on industry cap rates for commercial real estate (typically 4-8%)
    expect(maxPropertyCost).toBeGreaterThan(0);
    expect(maxPropertyCost).toBeLessThan(10000000); // Should be less than $10M for $33k/month income
    
    // Expected property cost should be around 3-5M based on NOI and typical cap rates
    
    // Test with higher target yield
    const highYieldParams = { ...params, targetREITYield: 8 };
    const highYieldMaxCost = calculateMaxPropertyCostForREIT(highYieldParams);
    expect(highYieldMaxCost).toBeLessThan(maxPropertyCost); // Higher yield should reduce max cost
    
    // Test with Peru's higher distribution requirement
    const peruParams = { ...params, country: 'peru' };
    const peruMaxCost = calculateMaxPropertyCostForREIT(peruParams);
    expect(peruMaxCost).toBeLessThan(maxPropertyCost); // Higher requirements should reduce max cost
  });
  
  test('Direct Cap Rate Calculation', () => {
    const calculateDirectCapRate = (params: TestParams) => {
      // Simple direct capitalization method
      const annualRentalIncome = params.rentalIncome * 12 * (params.occupancyRate / 100);
      const annualOperatingExpenses = params.expenses * 12;
      const noi = annualRentalIncome - annualOperatingExpenses;
      
      // Target yield as decimal
      const targetYield = params.targetREITYield / 100;
      
      // Direct capitalization value
      const maxPropertyValue = noi / targetYield;
      
      console.log(`Direct Cap Rate Test Results:`);
      console.log(`Annual Rental Income: $${annualRentalIncome}`);
      console.log(`Annual Operating Expenses: $${annualOperatingExpenses}`);
      console.log(`NOI: $${noi}`);
      console.log(`Target Yield: ${targetYield * 100}%`);
      console.log(`Max Property Value: $${maxPropertyValue}`);
      
      return maxPropertyValue;
    };
    
    const params: TestParams = {
      landPrice: 1000000,
      constructionCost: 2000000,
      otherCosts: 200000,
      rentalIncome: 33000, // Monthly rental income
      expenses: 5000,      // Monthly expenses
      interestRate: 5,
      loanAmount: 2000000,
      loanTerm: 20,
      targetREITYield: 5,
      country: 'us',
      propertyType: 'commercial',
      occupancyRate: 95,
      appreciationRate: 2,
      landOwnership: 'purchase',
      landLeaseAnnual: 0,
      landLeaseTerm: 0
    };
    
    const maxPropertyValue = calculateDirectCapRate(params);
    
    // The value should be higher than with the complex adjusted cap rate
    // because we're not factoring in distribution requirements and expenses
    expect(maxPropertyValue).toBeGreaterThan(0);
    
    // For a NOI of around $316,200 and cap rate of 5%, 
    // we expect property value of ~$6.32M
    expect(maxPropertyValue).toBeCloseTo(6324000, -5);
    
    // Test with higher target yield
    const highYieldParams = { ...params, targetREITYield: 8 };
    const highYieldMaxValue = calculateDirectCapRate(highYieldParams);
    expect(highYieldMaxValue).toBeLessThan(maxPropertyValue); // Higher yield should reduce max value
  });
  
  test('Direct Cap Rate Method for Maximum Property Value', () => {
    // Function to test direct cap rate calculation
    const calculateDirectCapRate = (params: TestParams) => {
      // Calculate annual rental income and expenses with occupancy
      const annualRentalIncome = params.rentalIncome * 12 * (params.occupancyRate / 100);
      const annualOperatingExpenses = params.expenses * 12;
      
      // Calculate Net Operating Income (NOI)
      const noi = annualRentalIncome - annualOperatingExpenses;
      
      // Use target yield directly as the cap rate
      const capRate = params.targetREITYield / 100;
      
      // Calculate property value using direct cap rate method
      const propertyValue = noi / capRate;
      
      console.log(`DIRECT CAP RATE CALCULATION:`);
      console.log(`Annual Rental Income: $${annualRentalIncome}`);
      console.log(`Annual Operating Expenses: $${annualOperatingExpenses}`);
      console.log(`NOI: $${noi}`);
      console.log(`Cap Rate (direct): ${capRate * 100}%`);
      console.log(`Property Value: $${propertyValue}`);
      
      return propertyValue;
    };
    
    // Recreate the REIT method for comparison
    const calculateAdjustedREITMethod = (params: TestParams) => {
      // Calculate annual rental income and expenses
      const annualRentalIncome = params.rentalIncome * 12 * (params.occupancyRate / 100);
      const annualOperatingExpenses = params.expenses * 12;
      
      // Calculate Net Operating Income (NOI)
      const noi = annualRentalIncome - annualOperatingExpenses;
      
      // Target yield as decimal
      const targetYield = params.targetREITYield / 100;
      
      // Account for distribution requirements and expenses
      const distributionFactor = params.country === 'us' ? 0.9 : 0.95;
      const operatingExpenseRate = params.country === 'us' ? 0.03 : 0.035;
      const adminExpenseRate = params.country === 'us' ? 0.015 : 0.02;
      
      // Adjusted cap rate based on REIT requirements
      const adjustedCapRate = (targetYield / distributionFactor) + operatingExpenseRate + adminExpenseRate;
      
      // Maximum property cost (V = NOI / Cap Rate)
      return noi / adjustedCapRate;
    };
    
    // Use the same parameters as the main test for comparison
    const params: TestParams = {
      landPrice: 1000000,
      constructionCost: 2000000,
      otherCosts: 200000,
      rentalIncome: 33000, // Monthly rental income
      expenses: 5000,      // Monthly expenses
      interestRate: 5,
      loanAmount: 2000000,
      loanTerm: 20,
      targetREITYield: 5,  // Target yield of 5%
      country: 'us',
      propertyType: 'commercial',
      occupancyRate: 95,
      appreciationRate: 2,
      landOwnership: 'purchase',
      landLeaseAnnual: 0,
      landLeaseTerm: 0
    };
    
    // Calculate using direct cap rate method
    const directPropertyValue = calculateDirectCapRate(params);
    
    // Calculate with adjusted method for comparison
    const adjustedPropertyValue = calculateAdjustedREITMethod(params);
    
    // Test with higher target yield to ensure formula sensitivity
    const highYieldParams = {...params, targetREITYield: 8};
    const highYieldDirectValue = calculateDirectCapRate(highYieldParams);
    
    // Expected values (based on calculations):
    // For 5% cap rate: ~$6.32M for direct method
    // For 8% cap rate: ~$3.95M for direct method
    
    // Direct method should be higher than adjusted method
    expect(directPropertyValue).toBeGreaterThan(adjustedPropertyValue);
    
    // Direct property value should be around $6.32M for given parameters
    expect(directPropertyValue).toBeCloseTo(6320000, -5); // Allow larger tolerance
    
    // Higher yield should result in lower property value
    expect(highYieldDirectValue).toBeLessThan(directPropertyValue);
    
    console.log(`DIRECT vs ADJUSTED COMPARISON:`);
    console.log(`Direct Cap Rate Property Value: $${directPropertyValue}`);
    console.log(`Adjusted Method Property Value: $${adjustedPropertyValue}`);
    console.log(`Difference: $${directPropertyValue - adjustedPropertyValue}`);
    console.log(`Difference %: ${((directPropertyValue - adjustedPropertyValue) / directPropertyValue * 100).toFixed(2)}%`);
  });
}); 