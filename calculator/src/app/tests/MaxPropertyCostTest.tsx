import React, { useEffect } from 'react';

/**
 * Test component for debugging Max Property Cost calculation
 */
export function MaxPropertyCostTest() {
  useEffect(() => {
    runCalculationTest();
  }, []);

  const runCalculationTest = () => {
    // Test parameters - matching our test suite
    const rentalIncome = 33000; // Monthly
    const expenses = 5000; // Monthly
    const occupancyRate = 95; // Percent
    const targetREITYield = 5; // Percent
    const distributionRequirement = 0.9; // 90% for US REITs
    const operatingExpenseRate = 0.03; // 3%
    const adminExpenseRate = 0.015; // 1.5%

    // Calculate with the correct formula
    const annualRentalIncome = rentalIncome * 12 * (occupancyRate / 100);
    const annualOperatingExpenses = expenses * 12;
    const noi = annualRentalIncome - annualOperatingExpenses;
    const targetYield = targetREITYield / 100;
    
    // Adjusted cap rate calculation
    const adjustedCapRate1 = (targetYield / distributionRequirement) + operatingExpenseRate + adminExpenseRate;
    const maxPropertyCost1 = noi / adjustedCapRate1;
    
    // Alternative formula to check
    const adjustedCapRate2 = targetYield * distributionRequirement + operatingExpenseRate + adminExpenseRate;
    const maxPropertyCost2 = noi / adjustedCapRate2;
    
    // Testing a few more variations to identify any issues
    const adjustedCapRate3 = (targetYield * distributionRequirement) + operatingExpenseRate + adminExpenseRate;
    const maxPropertyCost3 = noi / adjustedCapRate3;
    
    const adjustedCapRate4 = targetYield + operatingExpenseRate + adminExpenseRate;
    const maxPropertyCost4 = noi / adjustedCapRate4;
    
    // Direct calculation used in test cases
    const testFormula = annualRentalIncome - annualOperatingExpenses / 
      ((targetYield / distributionRequirement) + operatingExpenseRate + adminExpenseRate);
    
    // Print results
    console.log('MAX PROPERTY COST CALCULATION TEST');
    console.log('=================================');
    console.log(`Monthly Rental Income: $${rentalIncome}`);
    console.log(`Monthly Expenses: $${expenses}`);
    console.log(`Occupancy Rate: ${occupancyRate}%`);
    console.log(`Target REIT Yield: ${targetREITYield}%`);
    console.log(`Distribution Requirement: ${distributionRequirement * 100}%`);
    console.log(`Operating Expense Rate: ${operatingExpenseRate * 100}%`);
    console.log(`Admin Expense Rate: ${adminExpenseRate * 100}%`);
    console.log('----------------------------------');
    console.log(`Annual Rental Income: $${annualRentalIncome}`);
    console.log(`Annual Operating Expenses: $${annualOperatingExpenses}`);
    console.log(`NOI: $${noi}`);
    console.log('----------------------------------');
    console.log('FORMULA 1: (targetYield / distributionRequirement) + operatingExpenseRate + adminExpenseRate');
    console.log(`Adjusted Cap Rate: ${adjustedCapRate1 * 100}%`);
    console.log(`Max Property Cost: $${maxPropertyCost1}`);
    console.log('----------------------------------');
    console.log('FORMULA 2: targetYield * distributionRequirement + operatingExpenseRate + adminExpenseRate');
    console.log(`Adjusted Cap Rate: ${adjustedCapRate2 * 100}%`);
    console.log(`Max Property Cost: $${maxPropertyCost2}`);
    console.log('----------------------------------');
    console.log('FORMULA 3: (targetYield * distributionRequirement) + operatingExpenseRate + adminExpenseRate');
    console.log(`Adjusted Cap Rate: ${adjustedCapRate3 * 100}%`);
    console.log(`Max Property Cost: $${maxPropertyCost3}`);
    console.log('----------------------------------');
    console.log('FORMULA 4: targetYield + operatingExpenseRate + adminExpenseRate');
    console.log(`Adjusted Cap Rate: ${adjustedCapRate4 * 100}%`);
    console.log(`Max Property Cost: $${maxPropertyCost4}`);
    console.log('----------------------------------');
    console.log(`Test Formula Result: $${testFormula}`);
    console.log('=================================');
  };

  return (
    <div>
      <h2>Max Property Cost Test</h2>
      <p>Check console for calculation results</p>
    </div>
  );
}

export default MaxPropertyCostTest; 