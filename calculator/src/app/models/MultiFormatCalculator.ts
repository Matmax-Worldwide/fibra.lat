// MultiFormatCalculator.ts - Core calculation engine for the multi-format investment model
import {
  MultiFormatInputParams,
  MultiFormatResults,
  RoomType,
  CommercialSpaceType,
  AmenityType
} from './MultiFormatModel';
import {
  DEFAULT_FORMAT_PARAMS,
  CONVERSION_COSTS
} from './MultiFormatData';

export class MultiFormatCalculator {
  private params: MultiFormatInputParams;

  constructor(params: MultiFormatInputParams) {
    this.params = { ...params };
  }

  public calculateResults(): MultiFormatResults {
    // Normalize format percentages
    this.normalizeFormatPercentages();

    // Calculate total room count and update room counts
    const roomData = this.calculateRoomMetrics();

    // Calculate costs
    const costData = this.calculateCosts(roomData);

    // Calculate revenue and NOI
    const revenueData = this.calculateRevenue(roomData);

    // Calculate financial metrics
    const financialData = this.calculateFinancialMetrics(costData, revenueData);

    // Return complete results
    return {
      ...roomData,
      ...costData,
      ...revenueData,
      ...financialData,
      
      // Property info
      isOptimal: false,
      optimizationNotes: 'Manual configuration'
    };
  }

  private normalizeFormatPercentages(): void {
    const { hotelPercentage, servicedPercentage, airbnbPercentage } = this.params;
    const total = hotelPercentage + servicedPercentage + airbnbPercentage;

    if (total !== 100) {
      this.params.hotelPercentage = (hotelPercentage / total) * 100;
      this.params.servicedPercentage = (servicedPercentage / total) * 100;
      this.params.airbnbPercentage = (airbnbPercentage / total) * 100;
    }
  }

  private calculateRoomMetrics() {
    const { 
      totalArea, 
      roomTypes, 
      hotelPercentage, 
      servicedPercentage, 
      airbnbPercentage,
      commercialSpacesArea
    } = this.params;
    
    // Calculate available area for rooms (excluding commercial)
    const roomsArea = totalArea - commercialSpacesArea;
    
    // Normalize room type ratios
    const totalRatio = roomTypes.reduce((sum, room) => sum + room.ratio, 0);
    const normalizedRoomTypes = roomTypes.map(room => ({
      ...room,
      ratio: (room.ratio / totalRatio) * 100
    }));

    // Calculate weighted average room size
    const avgRoomSize = normalizedRoomTypes.reduce(
      (sum, room) => sum + (room.area * (room.ratio / 100)), 
      0
    );

    // Calculate total possible rooms in the available area
    const possibleRoomCount = Math.floor(roomsArea / avgRoomSize);
    
    // Assign room counts to each type
    const roomTypesWithCounts = normalizedRoomTypes.map(room => {
      const count = Math.round((room.ratio / 100) * possibleRoomCount);
      return { ...room, count };
    });

    // Adjust to ensure counts sum up to the possible room count
    const totalCalculatedRooms = roomTypesWithCounts.reduce(
      (sum, room) => sum + (room.count || 0), 
      0
    );
    
    const adjustment = possibleRoomCount - totalCalculatedRooms;
    if (adjustment !== 0 && roomTypesWithCounts.length > 0) {
      // Add or subtract rooms from the most common room type
      const mostCommonRoomTypeIndex = roomTypesWithCounts
        .findIndex(room => room.ratio === Math.max(...roomTypesWithCounts.map(r => r.ratio)));
      
      if (mostCommonRoomTypeIndex >= 0) {
        roomTypesWithCounts[mostCommonRoomTypeIndex].count = 
          (roomTypesWithCounts[mostCommonRoomTypeIndex].count || 0) + adjustment;
      }
    }

    // Calculate total rooms by format
    const totalRooms = roomTypesWithCounts.reduce(
      (sum, room) => sum + (room.count || 0), 
      0
    );
    
    const hotelRooms = Math.round(totalRooms * (hotelPercentage / 100));
    const servicedRooms = Math.round(totalRooms * (servicedPercentage / 100));
    const airbnbRooms = totalRooms - hotelRooms - servicedRooms;

    return {
      totalRooms,
      totalArea,
      hotelPercentage,
      servicedPercentage,
      airbnbPercentage,
      roomTypesWithCounts: roomTypesWithCounts
    };
  }

  private calculateCosts(roomData: any) {
    const { 
      buildingType, 
      acquisitionPrice, 
      roomTypes, 
      hotelPercentage,
      servicedPercentage, 
      airbnbPercentage,
      amenities, 
      commercialSpaces,
      commercialSpacesArea
    } = this.params;
    
    const { totalRooms, totalArea, roomTypesWithCounts } = roomData;

    // Calculate acquisition cost
    const acquisitionCost = acquisitionPrice;

    // Calculate renovation costs for each format
    const conversionCosts = CONVERSION_COSTS[buildingType];
    const hotelArea = totalArea * (hotelPercentage / 100);
    const servicedArea = totalArea * (servicedPercentage / 100);
    const airbnbArea = totalArea * (airbnbPercentage / 100);

    const hotelRenovationCost = hotelArea * conversionCosts.hotel;
    const servicedRenovationCost = servicedArea * conversionCosts.serviced;
    const airbnbRenovationCost = airbnbArea * conversionCosts.airbnb;
    const renovationCost = hotelRenovationCost + servicedRenovationCost + airbnbRenovationCost;

    // Calculate FF&E costs
    let ffeCost = 0;
    
    roomTypesWithCounts.forEach((room: RoomType & { count?: number }) => {
      if (room.count) {
        // Distribute room count by format
        const hotelCount = Math.round(room.count * (hotelPercentage / 100));
        const servicedCount = Math.round(room.count * (servicedPercentage / 100));
        const airbnbCount = room.count - hotelCount - servicedCount;
        
        // Get equipment cost by format using the ratios
        const hotelEquipmentCost = room.capexEquipmentCost;
        const servicedEquipmentCost = hotelEquipmentCost * 
          (DEFAULT_FORMAT_PARAMS.serviced.capexEquipmentRatio / 100);
        const airbnbEquipmentCost = hotelEquipmentCost * 
          (DEFAULT_FORMAT_PARAMS.airbnb.capexEquipmentRatio / 100);
        
        // Calculate total equipment cost for this room type
        ffeCost += (hotelCount * hotelEquipmentCost) + 
                   (servicedCount * servicedEquipmentCost) + 
                   (airbnbCount * airbnbEquipmentCost);
      }
    });

    // Calculate amenity costs
    const amenitiesCost = amenities
      .filter(amenity => amenity.isIncluded)
      .reduce((sum, amenity) => sum + (amenity.area * amenity.capexCost), 0);

    // Calculate commercial spaces costs
    const commercialSpacesCost = commercialSpaces.reduce(
      (sum, space) => sum + (space.optimalArea * space.capexCost), 
      0
    );

    // Calculate total investment
    const totalInvestment = acquisitionCost + renovationCost + ffeCost + 
                            amenitiesCost + commercialSpacesCost;

    return {
      acquisitionCost,
      renovationCost,
      ffeCost,
      amenitiesCost,
      commercialSpacesCost,
      totalInvestment,
    };
  }

  private calculateRevenue(roomData: any) {
    const { 
      amenities, 
      commercialSpaces, 
      hotelPercentage, 
      servicedPercentage, 
      airbnbPercentage,
      propertySegment
    } = this.params;
    
    const { totalRooms, roomTypesWithCounts } = roomData;

    // Get base format parameters
    const hotelParams = DEFAULT_FORMAT_PARAMS.hotel;
    const servicedParams = DEFAULT_FORMAT_PARAMS.serviced;
    const airbnbParams = DEFAULT_FORMAT_PARAMS.airbnb;

    // Calculate amenity impact on occupancy and ADR by format
    const amenityImpact = {
      hotel: { occupancy: 0, adr: 0 },
      serviced: { occupancy: 0, adr: 0 },
      airbnb: { occupancy: 0, adr: 0 }
    };

    amenities.forEach(amenity => {
      if (amenity.isIncluded) {
        amenityImpact.hotel.occupancy += amenity.impact.hotel.occupancy;
        amenityImpact.hotel.adr += amenity.impact.hotel.adr;
        
        amenityImpact.serviced.occupancy += amenity.impact.serviced.occupancy;
        amenityImpact.serviced.adr += amenity.impact.serviced.adr;
        
        amenityImpact.airbnb.occupancy += amenity.impact.airbnb.occupancy;
        amenityImpact.airbnb.adr += amenity.impact.airbnb.adr;
      }
    });

    // Calculate effective occupancy and ADR
    const hotelOccupancy = Math.min(hotelParams.occupancy + amenityImpact.hotel.occupancy, 95);
    const servicedOccupancy = Math.min(servicedParams.occupancy + amenityImpact.serviced.occupancy, 95);
    const airbnbOccupancy = Math.min(airbnbParams.occupancy + amenityImpact.airbnb.occupancy, 95);

    // Calculate weighted average ADR for each format
    let hotelAdr = 0;
    let servicedAdr = 0;
    let airbnbAdr = 0;
    let totalRoomCount = 0;

    roomTypesWithCounts.forEach((room: RoomType & { count?: number }) => {
      if (room.count) {
        // Get base ADRs
        const baseHotelAdr = room.adrs.hotel;
        const baseServicedAdr = room.adrs.serviced;
        const baseAirbnbAdr = room.adrs.airbnb;
        
        // Apply amenity impact
        const effectiveHotelAdr = baseHotelAdr * (1 + (amenityImpact.hotel.adr / 100));
        const effectiveServicedAdr = baseServicedAdr * (1 + (amenityImpact.serviced.adr / 100));
        const effectiveAirbnbAdr = baseAirbnbAdr * (1 + (amenityImpact.airbnb.adr / 100));
        
        // Add weighted contribution to format ADRs
        hotelAdr += effectiveHotelAdr * room.count;
        servicedAdr += effectiveServicedAdr * room.count;
        airbnbAdr += effectiveAirbnbAdr * room.count;
        totalRoomCount += room.count;
      }
    });

    // Calculate final weighted average ADRs
    hotelAdr = hotelAdr / totalRoomCount;
    servicedAdr = servicedAdr / totalRoomCount;
    airbnbAdr = airbnbAdr / totalRoomCount;

    // Calculate stabilized weighted average
    const stabilizedOccupancy = 
      (hotelOccupancy * (hotelPercentage / 100)) +
      (servicedOccupancy * (servicedPercentage / 100)) +
      (airbnbOccupancy * (airbnbPercentage / 100));

    const stabilizedAdr = 
      (hotelAdr * (hotelPercentage / 100)) +
      (servicedAdr * (servicedPercentage / 100)) +
      (airbnbAdr * (airbnbPercentage / 100));

    const stabilizedRevPar = stabilizedAdr * (stabilizedOccupancy / 100);

    // Calculate room revenue by format
    const hotelRoomRevenue = 
      totalRooms * (hotelPercentage / 100) * hotelAdr * (hotelOccupancy / 100) * 365;
    
    const servicedRoomRevenue = 
      totalRooms * (servicedPercentage / 100) * servicedAdr * (servicedOccupancy / 100) * 365;
    
    const airbnbRoomRevenue = 
      totalRooms * (airbnbPercentage / 100) * airbnbAdr * (airbnbOccupancy / 100) * 365;
    
    const annualRoomRevenue = hotelRoomRevenue + servicedRoomRevenue + airbnbRoomRevenue;

    // Calculate auxiliary revenue
    const hotelAuxRevenue = hotelRoomRevenue * (hotelParams.auxiliaryRevenue / 100);
    const servicedAuxRevenue = servicedRoomRevenue * (servicedParams.auxiliaryRevenue / 100);
    const airbnbAuxRevenue = airbnbRoomRevenue * (airbnbParams.auxiliaryRevenue / 100);
    
    const annualAuxiliaryRevenue = hotelAuxRevenue + servicedAuxRevenue + airbnbAuxRevenue;

    // Calculate commercial revenue
    const annualCommercialRevenue = commercialSpaces.reduce(
      (sum, space) => sum + (space.baseRent * space.optimalArea * 12), 
      0
    );

    // Calculate total annual revenue
    const totalAnnualRevenue = annualRoomRevenue + annualAuxiliaryRevenue + annualCommercialRevenue;

    // Calculate operating expenses and NOI by format
    const hotelTotalRevenue = hotelRoomRevenue + hotelAuxRevenue;
    const servicedTotalRevenue = servicedRoomRevenue + servicedAuxRevenue;
    const airbnbTotalRevenue = airbnbRoomRevenue + airbnbAuxRevenue;

    const hotelOpex = hotelTotalRevenue * (hotelParams.opexPercentage / 100);
    const servicedOpex = servicedTotalRevenue * (servicedParams.opexPercentage / 100);
    const airbnbOpex = airbnbTotalRevenue * (airbnbParams.opexPercentage / 100);
    
    const operatingExpenses = hotelOpex + servicedOpex + airbnbOpex;

    // Calculate management fee by format
    const hotelMgmtFee = hotelTotalRevenue * (hotelParams.managementFee / 100);
    const servicedMgmtFee = servicedTotalRevenue * (servicedParams.managementFee / 100);
    const airbnbMgmtFee = airbnbTotalRevenue * (airbnbParams.managementFee / 100);
    
    const totalManagementFee = hotelMgmtFee + servicedMgmtFee + airbnbMgmtFee;

    // Calculate NOI by format and total
    const hotelNoi = hotelTotalRevenue - hotelOpex - hotelMgmtFee;
    const servicedNoi = servicedTotalRevenue - servicedOpex - servicedMgmtFee;
    const airbnbNoi = airbnbTotalRevenue - airbnbOpex - airbnbMgmtFee;
    
    const propertyManagementAndExpenses = totalAnnualRevenue * 0.03; // 3% for property management and expenses
    
    const netOperatingIncome = 
      hotelNoi + servicedNoi + airbnbNoi + annualCommercialRevenue - propertyManagementAndExpenses;

    return {
      annualRoomRevenue,
      annualAuxiliaryRevenue,
      annualCommercialRevenue,
      totalAnnualRevenue,
      operatingExpenses,
      netOperatingIncome,
      stabilizedOccupancy,
      stabilizedAdr,
      stabilizedRevPar,
      hotelNoi,
      servicedNoi,
      airbnbNoi
    };
  }

  private calculateFinancialMetrics(costData: any, revenueData: any) {
    const { 
      equityPercentage, 
      debtInterestRate, 
      loanTermYears, 
      exitCapRate,
      targetDistributionYield
    } = this.params;

    const { totalInvestment } = costData;
    const { netOperatingIncome } = revenueData;

    // Calculate cap rate
    const capRate = (netOperatingIncome / totalInvestment) * 100;

    // Calculate ROI on equity
    const equity = totalInvestment * (equityPercentage / 100);
    const returnOnInvestment = (netOperatingIncome / equity) * 100;

    // Calculate payback period
    const paybackPeriod = totalInvestment / netOperatingIncome;

    // Calculate estimated property value
    const estimatedPropertyValue = netOperatingIncome / (exitCapRate / 100);
    const valueCreation = estimatedPropertyValue - totalInvestment;
    const valueCreationPercentage = (valueCreation / totalInvestment) * 100;

    // Calculate debt service
    const financingAmount = totalInvestment * (1 - equityPercentage / 100);
    const monthlyInterestRate = debtInterestRate / 100 / 12;
    const totalPayments = loanTermYears * 12;
    
    const monthlyPayment = financingAmount * 
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments)) /
      (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);
    
    const annualDebtService = monthlyPayment * 12;
    const debtCoverageRatio = netOperatingIncome / annualDebtService;

    // Calculate distributions
    const targetDistribution = equity * (targetDistributionYield / 100);
    const cashFlowAfterDebtService = netOperatingIncome - annualDebtService;
    const actualDistribution = Math.min(cashFlowAfterDebtService, targetDistribution);
    const distributionYield = (actualDistribution / equity) * 100;

    return {
      capRate,
      returnOnInvestment,
      paybackPeriod,
      estimatedPropertyValue,
      valueCreation,
      valueCreationPercentage,
      financingAmount,
      annualDebtService,
      debtCoverageRatio,
      targetDistribution,
      actualDistribution,
      distributionYield
    };
  }

  // Method to run optimization simulation for the best format mix
  public findOptimalMix(): MultiFormatResults {
    const baseResults = this.calculateResults();
    
    // Define format mix combinations to test
    const combinations = [
      { hotel: 100, serviced: 0, airbnb: 0 },
      { hotel: 0, serviced: 100, airbnb: 0 },
      { hotel: 0, serviced: 0, airbnb: 100 },
      { hotel: 50, serviced: 50, airbnb: 0 },
      { hotel: 50, serviced: 0, airbnb: 50 },
      { hotel: 0, serviced: 50, airbnb: 50 },
      { hotel: 33, serviced: 33, airbnb: 34 },
      { hotel: 60, serviced: 20, airbnb: 20 },
      { hotel: 20, serviced: 60, airbnb: 20 },
      { hotel: 20, serviced: 20, airbnb: 60 }
    ];
    
    let bestResult = baseResults;
    let bestScore = this.calculateOptimizationScore(baseResults);
    
    // Test each combination
    combinations.forEach(mix => {
      // Create copy of parameters with new mix
      const testParams = { 
        ...this.params,
        hotelPercentage: mix.hotel,
        servicedPercentage: mix.serviced,
        airbnbPercentage: mix.airbnb
      };
      
      const calculator = new MultiFormatCalculator(testParams);
      const results = calculator.calculateResults();
      const score = this.calculateOptimizationScore(results);
      
      if (score > bestScore) {
        bestScore = score;
        bestResult = results;
        
        // Update the optimal mix
        bestResult.hotelPercentage = mix.hotel;
        bestResult.servicedPercentage = mix.serviced;
        bestResult.airbnbPercentage = mix.airbnb;
        bestResult.isOptimal = true;
        
        // Generate optimization notes
        bestResult.optimizationNotes = this.generateOptimizationNotes(results, mix);
      }
    });
    
    return bestResult;
  }
  
  private calculateOptimizationScore(results: MultiFormatResults): number {
    // Create a weighted score considering various factors
    const noiFactor = results.netOperatingIncome / 1000000; // Scale NOI
    const capRateFactor = results.capRate / 5; // Normalize cap rate
    const dcr = Math.min(results.debtCoverageRatio, 2); // Cap DCR benefit
    const distributionFactor = results.distributionYield;
    
    return (noiFactor * 4) + (capRateFactor * 3) + (dcr * 2) + distributionFactor;
  }
  
  private generateOptimizationNotes(results: MultiFormatResults, mix: any): string {
    // Generate insights based on the optimal mix
    let notes = `Optimal format mix: ${mix.hotel}% Hotel, ${mix.serviced}% Serviced Apartments, ${mix.airbnb}% Airbnb/Booking. `;
    
    // Add insights on financial performance
    notes += `This configuration maximizes NOI (${this.formatCurrency(results.netOperatingIncome)}/year) `;
    notes += `with a cap rate of ${results.capRate.toFixed(2)}% and distribution yield of ${results.distributionYield.toFixed(2)}%. `;
    
    // Add risk assessment
    if (mix.airbnb > 50) {
      notes += 'Note: High Airbnb allocation offers strong returns but higher operational volatility.';
    } else if (mix.serviced > 50) {
      notes += 'Note: Service apartment focus provides stable occupancy with balanced operational costs.';
    } else if (mix.hotel > 50) {
      notes += 'Note: Hotel-focused approach leverages higher ADR but requires more intensive management.';
    } else {
      notes += 'This balanced approach provides diversification across operational formats.';
    }
    
    return notes;
  }
  
  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }
} 