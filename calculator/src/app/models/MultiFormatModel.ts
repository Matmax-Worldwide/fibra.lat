// MultiFormatModel.ts - Interfaces and types for FIBRA/REIT Multi-format Investment Model

export type OperationalFormat = 'hotel' | 'serviced' | 'airbnb' | 'mixed';
export type PropertySegment = 'luxury' | 'upscale' | 'midscale' | 'economy';
export type BuildingType = 'office' | 'residential' | 'hotel' | 'industrial' | 'historical';

// Room configuration interfaces
export interface RoomType {
  id: string;
  name: string;
  area: number; // in square meters
  adrs: {
    hotel: number;
    serviced: number;
    airbnb: number;
  };
  capexRemodelCost: number; // per square meter
  capexEquipmentCost: number; // total per room
  ratio: number; // percentage in the mix (0-100)
  count?: number; // calculated count of rooms
}

// Format operational characteristics
export interface FormatOperationalParams {
  occupancy: number; // percentage
  adrRelative: number; // percentage of hotel base
  staffRatio: number; // employees per 1000m²
  opexPercentage: number; // percentage of revenue
  auxiliaryRevenue: number; // percentage of room revenue
  capexEquipmentRatio: number; // percentage of hotel base
  equipmentLifespan: number; // years
  managementFee: number; // percentage of revenue
}

// Commercial space type
export interface CommercialSpaceType {
  id: string;
  name: string;
  baseRent: number; // per m² per month
  percentageOfSales?: number; // percentage
  capexCost: number; // per m²
  optimalArea: number; // m²
  synergy: {
    hotel: number; // synergy score 1-3
    serviced: number;
    airbnb: number;
  };
}

// Amenity type
export interface AmenityType {
  id: string;
  name: string;
  capexCost: number; // per m²
  area: number; // m²
  isIncluded: boolean;
  impact: {
    hotel: {
      occupancy: number; // percentage points
      adr: number; // percentage increase
    };
    serviced: {
      occupancy: number;
      adr: number;
    };
    airbnb: {
      occupancy: number;
      adr: number;
    };
  };
}

// Building conversion costs
export interface ConversionCosts {
  hotel: number; // per m²
  serviced: number; // per m²
  airbnb: number; // per m²
  durationMonths: number;
  complexity: 'low' | 'medium' | 'high' | 'veryHigh';
}

// Calculated results interface
export interface MultiFormatResults {
  // Basic counts
  totalRooms: number;
  totalArea: number; // m²
  
  // Format configuration
  hotelPercentage: number;
  servicedPercentage: number;
  airbnbPercentage: number;
  
  // Investment
  acquisitionCost: number;
  renovationCost: number;
  ffeCost: number;
  amenitiesCost: number;
  commercialSpacesCost: number;
  totalInvestment: number;
  
  // Revenue and NOI
  annualRoomRevenue: number;
  annualAuxiliaryRevenue: number;
  annualCommercialRevenue: number;
  totalAnnualRevenue: number;
  operatingExpenses: number;
  netOperatingIncome: number;
  
  // Financial metrics
  capRate: number;
  returnOnInvestment: number;
  paybackPeriod: number;
  estimatedPropertyValue: number;
  valueCreation: number;
  valueCreationPercentage: number;
  stabilizedOccupancy: number;
  stabilizedAdr: number;
  stabilizedRevPar: number;
  
  // Format-specific metrics
  hotelNoi: number;
  servicedNoi: number;
  airbnbNoi: number;
  
  // Debt service
  financingAmount: number;
  annualDebtService: number;
  debtCoverageRatio: number;
  
  // Distributions
  targetDistribution: number;
  actualDistribution: number;
  distributionYield: number;
  
  // Optimal configuration
  isOptimal: boolean;
  optimizationNotes: string;
}

// Main model input parameters
export interface MultiFormatInputParams {
  // Property details
  propertyName: string;
  location: string;
  buildingType: BuildingType;
  totalArea: number; // m²
  acquisitionPrice: number;
  
  // Format mix
  hotelPercentage: number;
  servicedPercentage: number;
  airbnbPercentage: number;
  
  // Segments and rooms
  propertySegment: PropertySegment;
  roomTypes: RoomType[];
  
  // Commercial spaces
  commercialSpaces: CommercialSpaceType[];
  commercialSpacesArea: number; // m²
  
  // Amenities
  amenities: AmenityType[];
  
  // Financial parameters
  equityPercentage: number;
  debtInterestRate: number;
  loanTermYears: number;
  exitCapRate: number;
  targetDistributionYield: number;
  
  // Simulation
  simulateOptimalMix: boolean;
} 