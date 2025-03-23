// Example case to check if operating expenses are reasonable
const rentalIncome = 19995;
const operatingExpenseRatio = 0.035; // 3.5% for Peru
const capRate = 0.07; // 7% cap rate
const occupancyRate = 95;

// 1. Calculate annual rental income
const annualRentalIncome = rentalIncome * 12 * (occupancyRate / 100);
console.log(`Annual Rental Income: $${annualRentalIncome.toFixed(2)}`);

// 2. Estimate property value using income approach
const estimatedPropertyValue = annualRentalIncome / capRate;
console.log(`Estimated Property Value (based on gross income): $${estimatedPropertyValue.toFixed(2)}`);

// 3. Calculate annual operating expenses using percentage method
const annualOperatingExpenses = estimatedPropertyValue * operatingExpenseRatio;
console.log(`Annual Operating Expenses: $${annualOperatingExpenses.toFixed(2)}`);

// 4. Calculate monthly operating expenses
const monthlyOperatingExpenses = annualOperatingExpenses / 12;
console.log(`Monthly Operating Expenses: $${monthlyOperatingExpenses.toFixed(2)}`);

// 5. Calculate expense ratio (operating expenses as % of rental income)
const expenseRatio = (annualOperatingExpenses / annualRentalIncome) * 100;
console.log(`Expense Ratio (% of rental income): ${expenseRatio.toFixed(2)}%`);

// 6. Calculate the typical range for operating expenses (30-45% of rental income)
const typicalLowerBound = annualRentalIncome * 0.30;
const typicalUpperBound = annualRentalIncome * 0.45;
console.log(`Typical Range for Annual Operating Expenses: $${typicalLowerBound.toFixed(2)} to $${typicalUpperBound.toFixed(2)}`);
console.log(`Typical Range for Monthly Operating Expenses: $${(typicalLowerBound/12).toFixed(2)} to $${(typicalUpperBound/12).toFixed(2)}`);

// 7. Check if 8310 (the example expense value) is reasonable
const exampleExpense = 8310;
const exampleAnnualExpense = exampleExpense * 12;
const exampleExpenseRatio = (exampleAnnualExpense / annualRentalIncome) * 100;
console.log(`\nEXAMPLE EXPENSE ANALYSIS:`)
console.log(`Example Monthly Expense: $${exampleExpense.toFixed(2)}`);
console.log(`Example Annual Expense: $${exampleAnnualExpense.toFixed(2)}`);
console.log(`Example Expense as % of Annual Rental Income: ${exampleExpenseRatio.toFixed(2)}%`);

// 8. Compare with industry benchmarks
if (exampleExpenseRatio < 30) {
  console.log(`ASSESSMENT: The expense ratio of ${exampleExpenseRatio.toFixed(2)}% is BELOW the typical range of 30-45% of rental income. This may be unrealistically low.`);
} else if (exampleExpenseRatio > 45) {
  console.log(`ASSESSMENT: The expense ratio of ${exampleExpenseRatio.toFixed(2)}% is ABOVE the typical range of 30-45% of rental income. This may be unusually high.`);
} else {
  console.log(`ASSESSMENT: The expense ratio of ${exampleExpenseRatio.toFixed(2)}% is WITHIN the typical range of 30-45% of rental income. This appears reasonable.`);
}

// 9. Check expense-to-value ratio
const exampleExpenseToValueRatio = (exampleAnnualExpense / estimatedPropertyValue) * 100;
console.log(`Example Expense as % of Property Value: ${exampleExpenseToValueRatio.toFixed(2)}%`);

if (exampleExpenseToValueRatio < 2) {
  console.log(`ASSESSMENT: The expense-to-value ratio of ${exampleExpenseToValueRatio.toFixed(2)}% is BELOW the typical range of 2-5% of property value. This may be unrealistically low.`);
} else if (exampleExpenseToValueRatio > 5) {
  console.log(`ASSESSMENT: The expense-to-value ratio of ${exampleExpenseToValueRatio.toFixed(2)}% is ABOVE the typical range of 2-5% of property value. This may be unusually high.`);
} else {
  console.log(`ASSESSMENT: The expense-to-value ratio of ${exampleExpenseToValueRatio.toFixed(2)}% is WITHIN the typical range of 2-5% of property value. This appears reasonable.`);
}

// 10. Calculate based on the fixed values from the test
const testRentalIncome = 19995;
const testExpenses = 8310;
const testTargetREITYield = 5;
const testCountry = 'peru';
const testOccupancyRate = 95;

// Test calculation (following the same formula as in the app)
const testAnnualRentalIncome = testRentalIncome * 12 * (testOccupancyRate / 100);
const testAnnualOperatingExpenses = testExpenses * 12;
const testNOI = testAnnualRentalIncome - testAnnualOperatingExpenses;

console.log(`\nTEST CASE ANALYSIS:`)
console.log(`Test Annual Rental Income: $${testAnnualRentalIncome.toFixed(2)}`);
console.log(`Test Annual Operating Expenses: $${testAnnualOperatingExpenses.toFixed(2)}`);
console.log(`Test NOI: $${testNOI.toFixed(2)}`);
console.log(`Test Expense Ratio: ${((testAnnualOperatingExpenses / testAnnualRentalIncome) * 100).toFixed(2)}%`);

// Calculate property value based on NOI and cap rate
const propertyValueBasedOnNOI = testNOI / (capRate);
console.log(`Property Value (based on NOI): $${propertyValueBasedOnNOI.toFixed(2)}`);

// Calculate cap rate based on purchase price
console.log(`\nREIT INVESTMENT METRICS:`)

// Distribution requirement and expense rates from the app
const distributionFactor = testCountry === 'us' ? 0.9 : 0.95;
const operatingExpenseRate = testCountry === 'us' ? 0.03 : 0.035;
const adminExpenseRate = testCountry === 'us' ? 0.015 : 0.02;

// Target yield as decimal
const targetYield = testTargetREITYield / 100;

// Calculate the adjusted cap rate using the formula from the app
const adjustedCapRate = (targetYield / distributionFactor) + operatingExpenseRate + adminExpenseRate;

// Calculate the max property cost for REIT
const maxPropertyCost = testNOI / adjustedCapRate;

console.log(`NOI: $${testNOI.toFixed(2)}`);
console.log(`Base Cap Rate (without REIT adjustments): ${(capRate * 100).toFixed(2)}%`);
console.log(`Target REIT Yield: ${(targetYield * 100).toFixed(2)}%`);
console.log(`Distribution Factor: ${(distributionFactor * 100).toFixed(2)}%`);
console.log(`Operating Expense Rate: ${(operatingExpenseRate * 100).toFixed(2)}%`);
console.log(`Admin Expense Rate: ${(adminExpenseRate * 100).toFixed(2)}%`);
console.log(`Adjusted Cap Rate for REIT: ${(adjustedCapRate * 100).toFixed(2)}%`);
console.log(`Max Property Cost for REIT: $${maxPropertyCost.toFixed(2)}`);

// Compare to the value in the test
const testValue = 1191314;
console.log(`\nCOMPARISON WITH TEST VALUES:`)
console.log(`Calculated Max Property Cost: $${maxPropertyCost.toFixed(2)}`);
console.log(`Test Value: $${testValue.toFixed(2)}`);
console.log(`Difference: $${Math.abs(maxPropertyCost - testValue).toFixed(2)}`);
console.log(`Difference Percentage: ${((Math.abs(maxPropertyCost - testValue) / testValue) * 100).toFixed(2)}%`);

// App calculation value
const appValue = 1302730;
console.log(`\nCOMPARISON WITH APP CALCULATION:`)
console.log(`Calculated Max Property Cost: $${maxPropertyCost.toFixed(2)}`);
console.log(`App Calculation Value: $${appValue.toFixed(2)}`);
console.log(`Difference: $${Math.abs(maxPropertyCost - appValue).toFixed(2)}`);
console.log(`Difference Percentage: ${((Math.abs(maxPropertyCost - appValue) / appValue) * 100).toFixed(2)}%`); 