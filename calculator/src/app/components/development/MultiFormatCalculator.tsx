import React, { useState, useCallback } from 'react';
import FormatConfiguration from './FormatConfiguration';
import RoomConfiguration from './RoomConfiguration';
import CommercialSpaces from './CommercialSpaces';
import AmenitiesSelection from './AmenitiesSelection';
import FinancialParameters from './FinancialParameters';
import ResultsDisplay from './ResultsDisplay';
import './MultiFormatCalculator.css';

// Define types for the multi-format calculator
export interface CalculationResults {
  propertyMetrics: {
    totalArea: number;
    buildingCost: number;
    landCost: number;
    totalInvestment: number;
    hotelRooms: number;
    servicedRooms: number;
    airbnbUnits: number;
  };
  investmentMetrics: {
    roi: number;
    cap: number;
    cashOnCash: number;
    irr: number;
    paybackPeriod: number;
    npv: number;
  };
  annualRevenue: {
    hotelRevenue: number;
    servicedRevenue: number;
    airbnbRevenue: number;
    commercialRevenue: number;
    totalRevenue: number;
  };
  formatPerformance: {
    hotelOccupancy: number;
    servicedOccupancy: number;
    airbnbOccupancy: number;
    hotelAdr: number;
    servicedAdr: number;
    airbnbAdr: number;
    hotelRevpar: number;
    servicedRevpar: number;
    airbnbRevpar: number;
  };
  financialMetrics: {
    grossOperatingProfit: number;
    netOperatingIncome: number;
    operatingExpenses: number;
    debtService: number;
    cashFlow: number;
    ebitda: number;
  };
  financingDistribution: {
    equityAmount: number;
    debtAmount: number;
    equityReturn: number;
    debtReturn: number;
    weightedReturn: number;
  };
  optimizationInsights?: {
    isOptimal: boolean;
    recommendations: string[];
    potentialImprovement: number;
  };
}

// Default room types for the calculator
const defaultRoomTypes = [
  {
    id: 1,
    name: 'Economy Room',
    area: 20,
    hotelAdr: 80,
    servicedAdr: 70,
    airbnbAdr: 65,
    ratio: 20,
  },
  {
    id: 2,
    name: 'Standard Room',
    area: 25,
    hotelAdr: 100,
    servicedAdr: 90,
    airbnbAdr: 85,
    ratio: 40,
  },
  {
    id: 3,
    name: 'Deluxe Room',
    area: 30,
    hotelAdr: 130,
    servicedAdr: 120,
    airbnbAdr: 110,
    ratio: 30,
  },
  {
    id: 4,
    name: 'Suite',
    area: 45,
    hotelAdr: 200,
    servicedAdr: 180,
    airbnbAdr: 170,
    ratio: 10,
  },
];

// Default commercial spaces for the calculator
const defaultCommercialSpaces = [
  {
    id: 1,
    name: 'Restaurant',
    area: 150,
    rent: 25,
    revenue: 250000,
    capex: 120000,
    isIncluded: false,
    hotelSynergy: 3,
    servicedSynergy: 2,
    airbnbSynergy: 1,
  },
  {
    id: 2,
    name: 'Retail Shop',
    area: 80,
    rent: 30,
    revenue: 180000,
    capex: 70000,
    isIncluded: false,
    hotelSynergy: 1,
    servicedSynergy: 1,
    airbnbSynergy: 0,
  },
  {
    id: 3,
    name: 'Coffee Shop',
    area: 60,
    rent: 28,
    revenue: 150000,
    capex: 50000,
    isIncluded: false,
    hotelSynergy: 2,
    servicedSynergy: 3,
    airbnbSynergy: 2,
  },
  {
    id: 4,
    name: 'Coworking Space',
    area: 120,
    rent: 22,
    revenue: 200000,
    capex: 90000,
    isIncluded: false,
    hotelSynergy: 1,
    servicedSynergy: 3,
    airbnbSynergy: 2,
  },
  {
    id: 5,
    name: 'Gym',
    area: 100,
    rent: 20,
    revenue: 120000,
    capex: 85000,
    isIncluded: false,
    hotelSynergy: 2,
    servicedSynergy: 3,
    airbnbSynergy: 1,
  },
];

// Default amenities for the calculator
const defaultAmenities = [
  {
    id: 1,
    name: 'Swimming Pool',
    area: 120,
    capex: 150000,
    isIncluded: false,
    hotelImpact: { adr: 5, occupancy: 2 },
    servicedImpact: { adr: 3, occupancy: 1 },
    airbnbImpact: { adr: 8, occupancy: 4 },
  },
  {
    id: 2,
    name: 'Spa & Wellness',
    area: 80,
    capex: 120000,
    isIncluded: false,
    hotelImpact: { adr: 7, occupancy: 1 },
    servicedImpact: { adr: 2, occupancy: 0 },
    airbnbImpact: { adr: 5, occupancy: 2 },
  },
  {
    id: 3,
    name: 'Conference Room',
    area: 60,
    capex: 70000,
    isIncluded: false,
    hotelImpact: { adr: 3, occupancy: 5 },
    servicedImpact: { adr: 1, occupancy: 3 },
    airbnbImpact: { adr: 0, occupancy: 0 },
  },
  {
    id: 4,
    name: 'Rooftop Terrace',
    area: 100,
    capex: 90000,
    isIncluded: false,
    hotelImpact: { adr: 6, occupancy: 2 },
    servicedImpact: { adr: 4, occupancy: 1 },
    airbnbImpact: { adr: 12, occupancy: 5 },
  },
  {
    id: 5,
    name: 'Kids Area',
    area: 40,
    capex: 50000,
    isIncluded: false,
    hotelImpact: { adr: 2, occupancy: 3 },
    servicedImpact: { adr: 3, occupancy: 4 },
    airbnbImpact: { adr: 4, occupancy: 7 },
  },
];

const MultiFormatCalculator: React.FC = () => {
  // State for property details
  const [propertyName, setPropertyName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  
  // State for format configuration
  const [formatDistribution, setFormatDistribution] = useState({
    hotel: 33,
    serviced: 33,
    airbnb: 34,
  });
  
  const [allowsShortStay, setAllowsShortStay] = useState<boolean>(true);
  const [allowsSubdivision, setAllowsSubdivision] = useState<boolean>(false);
  
  // State for room configuration
  const [roomTypes, setRoomTypes] = useState(defaultRoomTypes);
  
  // State for commercial spaces
  const [commercialSpaces, setCommercialSpaces] = useState(defaultCommercialSpaces);
  
  // State for amenities
  const [amenities, setAmenities] = useState(defaultAmenities);
  
  // State for financial parameters
  const [financialParams, setFinancialParams] = useState({
    totalArea: 2000,
    landCost: 1000000,
    buildingCostPerSqm: 2000,
    equityRatio: 30,
    interestRate: 5.5,
    loanTerm: 20,
    discountRate: 8,
    exitCapRate: 6,
    holdingPeriod: 10,
  });
  
  // Calculation and results state
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [results, setResults] = useState<CalculationResults | null>(null);

  // Handle property details change
  const handlePropertyDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'propertyName') {
      setPropertyName(value);
    } else if (name === 'location') {
      setLocation(value);
    }
  };

  // Handle format distribution change
  const handleFormatChange = useCallback((formatType: 'hotel' | 'serviced' | 'airbnb', value: number) => {
    setFormatDistribution(prev => {
      // Calculate total without the changed format
      const total = Object.values(prev).reduce((sum, val) => sum + val, 0);
      const currentValue = prev[formatType];
      const diff = value - currentValue;
      
      // Calculate how much needs to be adjusted from other formats
      const otherFormats = Object.keys(prev).filter(key => key !== formatType) as Array<'hotel' | 'serviced' | 'airbnb'>;
      const totalOthers = otherFormats.reduce((sum, key) => sum + prev[key], 0);
      
      if (totalOthers === 0 || diff === 0) return prev;
      
      // Create new distribution by adjusting other formats proportionally
      const newDistribution = { ...prev, [formatType]: value };
      
      otherFormats.forEach(format => {
        const ratio = prev[format] / totalOthers;
        newDistribution[format] = Math.max(0, prev[format] - (diff * ratio));
      });
      
      // Normalize to ensure the total is exactly 100
      const newTotal = Object.values(newDistribution).reduce((sum, val) => sum + val, 0);
      const normalizationFactor = 100 / newTotal;
      
      Object.keys(newDistribution).forEach(key => {
        newDistribution[key as 'hotel' | 'serviced' | 'airbnb'] = 
          Math.round(newDistribution[key as 'hotel' | 'serviced' | 'airbnb'] * normalizationFactor);
      });
      
      // Adjust for rounding errors to ensure total is exactly 100
      const finalTotal = Object.values(newDistribution).reduce((sum, val) => sum + val, 0);
      if (finalTotal !== 100) {
        const diff = 100 - finalTotal;
        // Add the difference to the largest value
        const largestFormat = Object.keys(newDistribution).reduce((a, b) => 
          newDistribution[a as 'hotel' | 'serviced' | 'airbnb'] > newDistribution[b as 'hotel' | 'serviced' | 'airbnb'] ? a : b
        ) as 'hotel' | 'serviced' | 'airbnb';
        
        newDistribution[largestFormat] += diff;
      }
      
      return newDistribution;
    });
  }, []);

  // Handle room type change
  const handleRoomTypeChange = (id: number, field: string, value: number) => {
    setRoomTypes(prevRoomTypes => 
      prevRoomTypes.map(room => 
        room.id === id ? { ...room, [field]: value } : room
      )
    );
  };

  // Handle commercial space toggle
  const handleCommercialSpaceToggle = (id: number) => {
    setCommercialSpaces(prevSpaces => 
      prevSpaces.map(space => 
        space.id === id ? { ...space, isIncluded: !space.isIncluded } : space
      )
    );
  };

  // Handle commercial space field change
  const handleCommercialSpaceChange = (id: number, field: string, value: number) => {
    setCommercialSpaces(prevSpaces => 
      prevSpaces.map(space => 
        space.id === id ? { ...space, [field]: value } : space
      )
    );
  };

  // Handle amenity toggle
  const handleAmenityToggle = (id: number) => {
    setAmenities(prevAmenities => 
      prevAmenities.map(amenity => 
        amenity.id === id ? { ...amenity, isIncluded: !amenity.isIncluded } : amenity
      )
    );
  };

  // Handle financial parameter change
  const handleFinancialParamChange = (field: string, value: number) => {
    setFinancialParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Simulate calculation process
  const handleCalculate = () => {
    setIsCalculating(true);
    
    // Simulate API call or complex calculation
    setTimeout(() => {
      // Example calculation result - in a real app, this would be based on actual calculations
      const mockResults: CalculationResults = {
        propertyMetrics: {
          totalArea: financialParams.totalArea,
          buildingCost: financialParams.totalArea * financialParams.buildingCostPerSqm,
          landCost: financialParams.landCost,
          totalInvestment: financialParams.landCost + (financialParams.totalArea * financialParams.buildingCostPerSqm),
          hotelRooms: Math.round((financialParams.totalArea * formatDistribution.hotel / 100) / 30),
          servicedRooms: Math.round((financialParams.totalArea * formatDistribution.serviced / 100) / 35),
          airbnbUnits: Math.round((financialParams.totalArea * formatDistribution.airbnb / 100) / 40),
        },
        investmentMetrics: {
          roi: 12.5,
          cap: 7.8,
          cashOnCash: 9.2,
          irr: 15.3,
          paybackPeriod: 7.4,
          npv: 2500000,
        },
        annualRevenue: {
          hotelRevenue: 1800000 * formatDistribution.hotel / 100,
          servicedRevenue: 1500000 * formatDistribution.serviced / 100,
          airbnbRevenue: 1300000 * formatDistribution.airbnb / 100,
          commercialRevenue: commercialSpaces.filter(space => space.isIncluded).reduce((sum, space) => sum + space.revenue, 0),
          totalRevenue: 0, // Will be calculated below
        },
        formatPerformance: {
          hotelOccupancy: 75 + amenities.filter(a => a.isIncluded).reduce((sum, a) => sum + a.hotelImpact.occupancy, 0),
          servicedOccupancy: 80 + amenities.filter(a => a.isIncluded).reduce((sum, a) => sum + a.servicedImpact.occupancy, 0),
          airbnbOccupancy: 70 + amenities.filter(a => a.isIncluded).reduce((sum, a) => sum + a.airbnbImpact.occupancy, 0),
          hotelAdr: 120 + amenities.filter(a => a.isIncluded).reduce((sum, a) => sum + a.hotelImpact.adr, 0),
          servicedAdr: 100 + amenities.filter(a => a.isIncluded).reduce((sum, a) => sum + a.servicedImpact.adr, 0),
          airbnbAdr: 85 + amenities.filter(a => a.isIncluded).reduce((sum, a) => sum + a.airbnbImpact.adr, 0),
          hotelRevpar: 0, // Will be calculated below
          servicedRevpar: 0, // Will be calculated below
          airbnbRevpar: 0, // Will be calculated below
        },
        financialMetrics: {
          grossOperatingProfit: 0, // Will be calculated below
          netOperatingIncome: 0, // Will be calculated below
          operatingExpenses: 0, // Will be calculated below
          debtService: 0, // Will be calculated below
          cashFlow: 0, // Will be calculated below
          ebitda: 0, // Will be calculated below
        },
        financingDistribution: {
          equityAmount: 0, // Will be calculated below
          debtAmount: 0, // Will be calculated below
          equityReturn: 15.5,
          debtReturn: financialParams.interestRate,
          weightedReturn: 0, // Will be calculated below
        },
      };

      // Calculate derived metrics
      mockResults.formatPerformance.hotelRevpar = mockResults.formatPerformance.hotelAdr * (mockResults.formatPerformance.hotelOccupancy / 100);
      mockResults.formatPerformance.servicedRevpar = mockResults.formatPerformance.servicedAdr * (mockResults.formatPerformance.servicedOccupancy / 100);
      mockResults.formatPerformance.airbnbRevpar = mockResults.formatPerformance.airbnbAdr * (mockResults.formatPerformance.airbnbOccupancy / 100);
      
      mockResults.annualRevenue.totalRevenue = 
        mockResults.annualRevenue.hotelRevenue + 
        mockResults.annualRevenue.servicedRevenue + 
        mockResults.annualRevenue.airbnbRevenue + 
        mockResults.annualRevenue.commercialRevenue;
      
      mockResults.financialMetrics.operatingExpenses = mockResults.annualRevenue.totalRevenue * 0.45;
      mockResults.financialMetrics.grossOperatingProfit = mockResults.annualRevenue.totalRevenue - mockResults.financialMetrics.operatingExpenses;
      mockResults.financialMetrics.ebitda = mockResults.financialMetrics.grossOperatingProfit * 0.9;
      mockResults.financialMetrics.netOperatingIncome = mockResults.financialMetrics.ebitda * 0.85;
      
      mockResults.financingDistribution.equityAmount = mockResults.propertyMetrics.totalInvestment * (financialParams.equityRatio / 100);
      mockResults.financingDistribution.debtAmount = mockResults.propertyMetrics.totalInvestment - mockResults.financingDistribution.equityAmount;
      
      const monthlyRate = financialParams.interestRate / 1200;
      const numPayments = financialParams.loanTerm * 12;
      const monthlyPayment = mockResults.financingDistribution.debtAmount * 
        (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
        (Math.pow(1 + monthlyRate, numPayments) - 1);
      
      mockResults.financialMetrics.debtService = monthlyPayment * 12;
      mockResults.financialMetrics.cashFlow = mockResults.financialMetrics.netOperatingIncome - mockResults.financialMetrics.debtService;
      
      mockResults.financingDistribution.weightedReturn = 
        (mockResults.financingDistribution.equityReturn * financialParams.equityRatio +
         mockResults.financingDistribution.debtReturn * (100 - financialParams.equityRatio)) / 100;
      
      // Add optimization insights if amenities and commercial spaces configuration seems suboptimal
      if (amenities.filter(a => a.isIncluded).length < 2 || commercialSpaces.filter(s => s.isIncluded).length < 2) {
        mockResults.optimizationInsights = {
          isOptimal: false,
          recommendations: [
            'Adding a swimming pool could increase ADR by 5-8% across all formats',
            'Including a restaurant space would create synergy with the hotel format',
            'A combination of gym and coworking space would boost serviced apartment performance'
          ],
          potentialImprovement: 12.5,
        };
      }
      
      setResults(mockResults);
      setIsCalculating(false);
    }, 2000);
  };

  // Handle reset
  const handleReset = () => {
    setPropertyName('');
    setLocation('');
    setFormatDistribution({ hotel: 33, serviced: 33, airbnb: 34 });
    setAllowsShortStay(true);
    setAllowsSubdivision(false);
    setRoomTypes(defaultRoomTypes);
    setCommercialSpaces(defaultCommercialSpaces.map(space => ({ ...space, isIncluded: false })));
    setAmenities(defaultAmenities.map(amenity => ({ ...amenity, isIncluded: false })));
    setFinancialParams({
      totalArea: 2000,
      landCost: 1000000,
      buildingCostPerSqm: 2000,
      equityRatio: 30,
      interestRate: 5.5,
      loanTerm: 20,
      discountRate: 8,
      exitCapRate: 6,
      holdingPeriod: 10,
    });
    setResults(null);
  };

  return (
    <div className="multi-format-calculator">
      <h2>Mixed-Use Property Investment Calculator</h2>
      <p className="calculator-description">
        Model different combinations of hotel rooms, serviced apartments, and Airbnb units to optimize your real estate investment strategy.
      </p>
      
      <div className="calculator-content">
        {/* Property Details Section */}
        <div className="input-section">
          <div className="input-section-header">
            <h3>Property Details</h3>
          </div>
          <div className="input-grid">
            <div className="input-group">
              <label htmlFor="propertyName">Property Name</label>
              <input
                type="text"
                id="propertyName"
                name="propertyName"
                value={propertyName}
                onChange={handlePropertyDetailsChange}
                placeholder="e.g. Lotus Residences"
              />
            </div>
            <div className="input-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={location}
                onChange={handlePropertyDetailsChange}
                placeholder="e.g. Miraflores, Lima"
              />
            </div>
          </div>
        </div>
        
        {/* Format Configuration */}
        <FormatConfiguration
          formatDistribution={formatDistribution}
          onFormatChange={handleFormatChange}
          allowsShortStay={allowsShortStay}
          allowsSubdivision={allowsSubdivision}
          onAllowsShortStayChange={() => setAllowsShortStay(!allowsShortStay)}
          onAllowsSubdivisionChange={() => setAllowsSubdivision(!allowsSubdivision)}
        />
        
        {/* Room Configuration */}
        <RoomConfiguration
          roomTypes={roomTypes}
          onRoomTypeChange={handleRoomTypeChange}
        />
        
        {/* Commercial Spaces */}
        <CommercialSpaces
          spaces={commercialSpaces}
          onToggleSpace={handleCommercialSpaceToggle}
          onSpaceChange={handleCommercialSpaceChange}
        />
        
        {/* Amenities Selection */}
        <AmenitiesSelection
          amenities={amenities}
          onToggleAmenity={handleAmenityToggle}
        />
        
        {/* Financial Parameters */}
        <FinancialParameters
          financialParams={financialParams}
          onParamChange={handleFinancialParamChange}
        />
        
        {/* Action Buttons */}
        <div className="calculator-actions">
          <button className="calculate-button" onClick={handleCalculate} disabled={isCalculating}>
            {isCalculating ? (
              <>
                <span className="spinner-small"></span>
                Calculating...
              </>
            ) : (
              <>Calculate Investment</>
            )}
          </button>
          <button className="reset-button" onClick={handleReset} disabled={isCalculating}>
            Reset All
          </button>
        </div>
        
        {/* Results Section */}
        {(isCalculating || results) && (
          <div className="results-section">
            <ResultsDisplay
              results={results}
              propertyName={propertyName}
              location={location}
              isLoading={isCalculating}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiFormatCalculator; 