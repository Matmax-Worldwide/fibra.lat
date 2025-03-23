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

/**
 * Test implementation of the maximum property cost for REIT calculation
 * This matches the implementation in Calculator.test.tsx
 */
export const calculateTestMaxPropertyCostForREIT = (params: TestParams): number => {
  // Calculate annual rental income and expenses
  const annualRentalIncome = params.rentalIncome * 12 * (params.occupancyRate / 100);
  const annualOperatingExpenses = params.expenses * 12;
  
  // Calculate Net Operating Income (NOI)
  const noi = annualRentalIncome - annualOperatingExpenses;
  
  // Target yield as decimal
  const targetYield = params.targetREITYield / 100;
  
  // Account for distribution requirements and expenses - exact match with Calculator.tsx implementation
  const distributionFactor = getDistributionFactor(params.country);
  const operatingExpenseRate = getOperatingExpenseRate(params.country);
  const adminExpenseRate = getAdminExpenseRate(params.country);
  
  // Adjusted cap rate based on REIT requirements - CORRECTED FORMULA
  const adjustedCapRate = (targetYield / distributionFactor) + operatingExpenseRate + adminExpenseRate;
  
  // Maximum property cost (V = NOI / Cap Rate)
  const maxPropertyCost = noi / adjustedCapRate;
  
  // Log intermediate values for debugging
  console.log(`Test Calculation - REIT Property Cost:`);
  console.log(`Annual Rental Income: $${annualRentalIncome.toFixed(2)}`);
  console.log(`Annual Operating Expenses: $${annualOperatingExpenses.toFixed(2)}`);
  console.log(`NOI: $${noi.toFixed(2)}`);
  console.log(`Target Yield: ${(targetYield * 100).toFixed(2)}%`);
  console.log(`Distribution Factor: ${(distributionFactor * 100).toFixed(2)}%`);
  console.log(`Operating Expense Rate: ${(operatingExpenseRate * 100).toFixed(2)}%`);
  console.log(`Admin Expense Rate: ${(adminExpenseRate * 100).toFixed(2)}%`);
  console.log(`Adjusted Cap Rate: ${(adjustedCapRate * 100).toFixed(2)}%`);
  console.log(`Max Property Cost: $${maxPropertyCost.toFixed(2)}`);
  
  return maxPropertyCost;
};

// Helper functions to exactly match app implementation
function getDistributionFactor(country: string): number {
  return country.toLowerCase() === 'us' ? 0.9 : 0.95;
}

function getOperatingExpenseRate(country: string): number {
  return country.toLowerCase() === 'us' ? 0.03 : 0.035;
}

function getAdminExpenseRate(country: string): number {
  return country.toLowerCase() === 'us' ? 0.015 : 0.02;
}

/**
 * Test implementation of the maximum land price calculation
 * This matches the implementation in Calculator.tsx exactly
 */
export const calculateTestMaxLandPrice = (params: TestParams): number => {
  if (params.landOwnership === 'lease') {
    return 0; // Not applicable for leased land
  }
  
  // Calculate annual rental income and expenses
  const annualRentalIncome = params.rentalIncome * 12 * (params.occupancyRate / 100);
  const annualOperatingExpenses = params.expenses * 12;
  
  // Calculate Net Operating Income (NOI)
  const noi = annualRentalIncome - annualOperatingExpenses;
  
  // Get regulation rates based on country
  const distributionFactor = params.country === 'us' ? 0.9 : 0.95;
  const operatingExpenseRate = params.country === 'us' ? 0.03 : 0.035;
  const adminExpenseRate = params.country === 'us' ? 0.015 : 0.02;
  
  // Calculate adjusted cap rate based on REIT requirements
  const targetYield = params.targetREITYield / 100;
  
  // Adjusted cap rate = (target yield / distribution factor) + expense rates
  const adjustedCapRate = (targetYield / distributionFactor) + operatingExpenseRate + adminExpenseRate;
  
  // Calculate maximum property value (V = NOI / Cap Rate)
  let maxPropertyValue = noi / adjustedCapRate;
  
  // Calculate the annual debt service based on the max property value
  // Assuming standard LTV ratio (typically 65-75% for commercial properties)
  const ltv = 60 / 100; // Default 60% LTV
  const maxLoanAmount = maxPropertyValue * ltv;
  
  // Calculate annual debt service on the maximum loan
  const monthlyRate = params.interestRate / 100 / 12;
  const totalPayments = params.loanTerm * 12;
  let annualDebtService = 0;
  
  if (monthlyRate > 0) {
    const monthlyPayment = maxLoanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
      (Math.pow(1 + monthlyRate, totalPayments) - 1);
    annualDebtService = monthlyPayment * 12;
  }
  
  // Ensure the property generates enough income to cover debt service
  const dscr = 1.25; // Default DSCR
  const maxPropertyValueBasedOnDSCR = annualDebtService > 0 ? 
    (noi * dscr / annualDebtService) * maxLoanAmount : Number.MAX_VALUE;
  
  // Use the lower of the two values to be conservative
  if (maxPropertyValueBasedOnDSCR > 0 && maxPropertyValueBasedOnDSCR < maxPropertyValue) {
    maxPropertyValue = maxPropertyValueBasedOnDSCR;
  }
  
  // Maximum land price = Maximum property value - Construction cost - Other costs
  const maxLandPrice = maxPropertyValue - params.constructionCost - params.otherCosts;
  
  // Log intermediate values for debugging
  console.log(`Test Calculation - Max Land Price:`);
  console.log(`Annual Rental Income: $${annualRentalIncome.toFixed(2)}`);
  console.log(`Annual Operating Expenses: $${annualOperatingExpenses.toFixed(2)}`);
  console.log(`NOI: $${noi.toFixed(2)}`);
  console.log(`Target Yield: ${(targetYield * 100).toFixed(2)}%`);
  console.log(`Distribution Factor: ${(distributionFactor * 100).toFixed(2)}%`);
  console.log(`Adjusted Cap Rate: ${(adjustedCapRate * 100).toFixed(2)}%`);
  console.log(`Max Property Value: $${maxPropertyValue.toFixed(2)}`);
  console.log(`Max Land Price: $${Math.max(maxLandPrice, 0).toFixed(2)}`);
  
  return Math.max(maxLandPrice, 0);
}; 