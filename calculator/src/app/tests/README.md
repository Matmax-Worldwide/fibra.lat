# Investment Calculator Tests

This directory contains tests for the Investment Calculator application, ensuring that financial calculations are accurate and that components integrate correctly.

## Test Files

- `Calculator.test.tsx`: Tests the core financial calculation functions in isolation, including:
  - ROI calculations for both purchased and leased land
  - NPV (Net Present Value) calculations
  - Maximum affordable land price calculations
  - Country-specific calculations (US vs Peru)
  - Edge cases (zero values, etc.)

- `CalculatorComponent.test.tsx`: Contains basic tests of numerical calculations that would be used in the component.

## Running Tests

To run all tests:

```bash
npm test
```

To run tests with continuous watching:

```bash
npm run test:watch
```

To generate coverage reports:

```bash
npm run test:coverage
```

## Test Results

Currently, all tests are passing:
- 6 tests in Calculator.test.tsx testing various financial calculations
- 1 test in CalculatorComponent.test.tsx testing basic numeric calculations

## Understanding the Tests

### Financial Calculation Tests

The financial calculation tests verify that the core mathematical functions correctly calculate:

1. **Return on Investment (ROI)**: Tests both leveraged and unleveraged returns for property investments, with variations for purchased and leased land.

2. **Net Present Value (NPV)**: Ensures present value calculations correctly account for cash flows over time, including terminal value and different land ownership structures.

3. **Maximum Affordable Land Price**: Validates the calculations for determining the maximum price an investor could pay for land while maintaining target REIT yields.

4. **Country-Specific Regulations**: Confirms that different regulatory environments (US REIT vs Peru FIBRA) are correctly factored into investment calculations.

## Test Coverage

Key areas covered by tests include:

- Core financial calculations
- Country-specific regulatory impact
- Land ownership structure differences (purchase vs lease)
- Edge cases and boundary values 