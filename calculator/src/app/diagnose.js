// Calculate with the given parameters
const params = {
  rentalIncome: 19995,
  expenses: 8310,
  targetREITYield: 5,
  country: 'peru',
  occupancyRate: 95
};

// Calculate NOI
const annualRentalIncome = params.rentalIncome * 12 * (params.occupancyRate / 100);
const annualOperatingExpenses = params.expenses * 12;
const noi = annualRentalIncome - annualOperatingExpenses;

// Get distribution factor, operating and admin expense rates based on country
const distributionFactor = params.country === 'us' ? 0.9 : 0.95;
const operatingExpenseRate = params.country === 'us' ? 0.03 : 0.035;
const adminExpenseRate = params.country === 'us' ? 0.015 : 0.02;

// Calculate adjusted cap rate
const targetYield = params.targetREITYield / 100;
const adjustedCapRate = (targetYield / distributionFactor) + operatingExpenseRate + adminExpenseRate;

// Calculate max property cost
const maxPropertyCost = noi / adjustedCapRate;

console.log('CALCULATION DETAILS:');
console.log(`Annual Rental Income: $${annualRentalIncome.toFixed(2)}`);
console.log(`Annual Operating Expenses: $${annualOperatingExpenses.toFixed(2)}`);
console.log(`NOI: $${noi.toFixed(2)}`);
console.log(`Target Yield: ${(targetYield * 100).toFixed(2)}%`);
console.log(`Distribution Factor: ${(distributionFactor * 100).toFixed(2)}%`);
console.log(`Operating Expense Rate: ${(operatingExpenseRate * 100).toFixed(2)}%`);
console.log(`Admin Expense Rate: ${(adminExpenseRate * 100).toFixed(2)}%`);
console.log(`Adjusted Cap Rate: ${(adjustedCapRate * 100).toFixed(2)}%`);
console.log(`Max Property Cost: $${maxPropertyCost.toFixed(2)}`);

// Now let's simulate the calculation from TestCalculations.ts
const testMaxPropertyCost = () => {
  // Annual rental income and expenses
  const annualRentalIncomeTest = params.rentalIncome * 12 * (params.occupancyRate / 100);
  const annualOperatingExpensesTest = params.expenses * 12;
  
  // NOI
  const noiTest = annualRentalIncomeTest - annualOperatingExpensesTest;
  
  // Target yield
  const targetYieldTest = params.targetREITYield / 100;
  
  // Get distribution factor, operating and admin expense rates
  const distributionFactorTest = params.country === 'us' ? 0.9 : 0.95;
  const operatingExpenseRateTest = params.country === 'us' ? 0.03 : 0.035;
  const adminExpenseRateTest = params.country === 'us' ? 0.015 : 0.02;
  
  // Adjusted cap rate 
  const adjustedCapRateTest = (targetYieldTest / distributionFactorTest) + operatingExpenseRateTest + adminExpenseRateTest;
  
  // Max property cost
  const maxPropertyCostTest = noiTest / adjustedCapRateTest;
  
  return maxPropertyCostTest;
};

const testResult = testMaxPropertyCost();
console.log('\nTEST CALCULATION:');
console.log(`Test Max Property Cost: $${testResult.toFixed(2)}`);
console.log(`Difference: $${Math.abs(maxPropertyCost - testResult).toFixed(2)}`);

// Now let's calculate the value using direct cap rate method (without REIT adjustments)
// This might be what the app is actually doing
const directCapRateMethod = () => {
  const annualRentalIncomeDirect = params.rentalIncome * 12 * (params.occupancyRate / 100);
  const annualOperatingExpensesDirect = params.expenses * 12;
  const noiDirect = annualRentalIncomeDirect - annualOperatingExpensesDirect;
  
  // Use target yield directly as cap rate (no REIT adjustments)
  const directCapRate = params.targetREITYield / 100;
  
  return noiDirect / directCapRate;
};

const directCapRateResult = directCapRateMethod();
console.log('\nDIRECT CAP RATE METHOD:');
console.log(`Direct Cap Rate Property Cost: $${directCapRateResult.toFixed(2)}`);
console.log(`Difference from Test: $${Math.abs(directCapRateResult - testResult).toFixed(2)}`);

// Let's try another approach where we might be factoring in the operating expense rate differently
const alternateMethod = () => {
  const annualRentalIncomeAlt = params.rentalIncome * 12 * (params.occupancyRate / 100);
  const annualOperatingExpensesAlt = params.expenses * 12;
  const noiAlt = annualRentalIncomeAlt - annualOperatingExpensesAlt;
  
  // Target yield
  const targetYieldAlt = params.targetREITYield / 100;
  
  // Get distribution factor
  const distributionFactorAlt = params.country === 'us' ? 0.9 : 0.95;
  
  // Simplified cap rate (just yield / distribution)
  const simplifiedCapRate = targetYieldAlt / distributionFactorAlt;
  
  return noiAlt / simplifiedCapRate;
};

const alternateResult = alternateMethod();
console.log('\nALTERNATE METHOD:');
console.log(`Alternate Method Property Cost: $${alternateResult.toFixed(2)}`);
console.log(`Difference from Test: $${Math.abs(alternateResult - testResult).toFixed(2)}`); 