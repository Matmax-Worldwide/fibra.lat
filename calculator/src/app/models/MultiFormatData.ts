// MultiFormatData.ts - Default data for the FIBRA/REIT Multi-format Investment Model
import { 
  FormatOperationalParams, 
  RoomType, 
  CommercialSpaceType, 
  AmenityType, 
  ConversionCosts,
  PropertySegment,
  BuildingType
} from './MultiFormatModel';

// Default operational parameters by format
export const DEFAULT_FORMAT_PARAMS: Record<string, FormatOperationalParams> = {
  hotel: {
    occupancy: 70,
    adrRelative: 100,
    staffRatio: 10, // employees per 1000m²
    opexPercentage: 60, // percentage of revenue
    auxiliaryRevenue: 35, // percentage of room revenue
    capexEquipmentRatio: 100, // percentage
    equipmentLifespan: 6, // years
    managementFee: 3, // percentage of revenue
  },
  serviced: {
    occupancy: 80,
    adrRelative: 85,
    staffRatio: 4, // employees per 1000m²
    opexPercentage: 45, // percentage of revenue
    auxiliaryRevenue: 15, // percentage of room revenue
    capexEquipmentRatio: 115, // percentage
    equipmentLifespan: 5, // years
    managementFee: 4, // percentage of revenue
  },
  airbnb: {
    occupancy: 65,
    adrRelative: 80,
    staffRatio: 1.5, // employees per 1000m²
    opexPercentage: 30, // percentage of revenue
    auxiliaryRevenue: 7.5, // percentage of room revenue
    capexEquipmentRatio: 95, // percentage
    equipmentLifespan: 4, // years
    managementFee: 20, // percentage of revenue
  }
};

// Default room types by segment
export const DEFAULT_ROOM_TYPES: Record<PropertySegment, RoomType[]> = {
  luxury: [
    {
      id: 'standard-luxury',
      name: 'Standard Luxury',
      area: 42.5, // m²
      adrs: {
        hotel: 400,
        serviced: 340,
        airbnb: 325
      },
      capexRemodelCost: 1050, // per m²
      capexEquipmentCost: 30000,
      ratio: 55 // percentage in mix
    },
    {
      id: 'junior-suite',
      name: 'Junior Suite',
      area: 62.5, // m²
      adrs: {
        hotel: 525,
        serviced: 440,
        airbnb: 415
      },
      capexRemodelCost: 1200, // per m²
      capexEquipmentCost: 42500,
      ratio: 28
    },
    {
      id: 'master-suite',
      name: 'Master Suite',
      area: 100, // m²
      adrs: {
        hotel: 750,
        serviced: 625,
        airbnb: 640
      },
      capexRemodelCost: 1350, // per m²
      capexEquipmentCost: 65000,
      ratio: 13
    },
    {
      id: 'presidential-suite',
      name: 'Presidential Suite',
      area: 160, // m²
      adrs: {
        hotel: 1850,
        serviced: 1350,
        airbnb: 1400
      },
      capexRemodelCost: 1850, // per m²
      capexEquipmentCost: 150000,
      ratio: 4
    }
  ],
  upscale: [
    {
      id: 'standard-upscale',
      name: 'Standard Upscale',
      area: 30, // m²
      adrs: {
        hotel: 150,
        serviced: 125,
        airbnb: 125
      },
      capexRemodelCost: 750, // per m²
      capexEquipmentCost: 15000,
      ratio: 70
    },
    {
      id: 'superior-upscale',
      name: 'Superior',
      area: 40, // m²
      adrs: {
        hotel: 185,
        serviced: 155,
        airbnb: 155
      },
      capexRemodelCost: 825, // per m²
      capexEquipmentCost: 18500,
      ratio: 22
    },
    {
      id: 'suite-executive',
      name: 'Suite Executive',
      area: 57.5, // m²
      adrs: {
        hotel: 250,
        serviced: 210,
        airbnb: 220
      },
      capexRemodelCost: 950, // per m²
      capexEquipmentCost: 30000,
      ratio: 7
    },
    {
      id: 'suite-family',
      name: 'Suite Family',
      area: 72.5, // m²
      adrs: {
        hotel: 300,
        serviced: 270,
        airbnb: 265
      },
      capexRemodelCost: 1025, // per m²
      capexEquipmentCost: 35000,
      ratio: 1
    }
  ],
  midscale: [
    {
      id: 'standard-midscale',
      name: 'Standard Midscale',
      area: 24, // m²
      adrs: {
        hotel: 100,
        serviced: 85,
        airbnb: 87.5
      },
      capexRemodelCost: 600, // per m²
      capexEquipmentCost: 10000,
      ratio: 75
    },
    {
      id: 'superior-midscale',
      name: 'Superior',
      area: 31.5, // m²
      adrs: {
        hotel: 125,
        serviced: 110,
        airbnb: 112.5
      },
      capexRemodelCost: 650, // per m²
      capexEquipmentCost: 12500,
      ratio: 20
    },
    {
      id: 'suite-jr',
      name: 'Suite Jr.',
      area: 45, // m²
      adrs: {
        hotel: 170,
        serviced: 145,
        airbnb: 145
      },
      capexRemodelCost: 725, // per m²
      capexEquipmentCost: 18500,
      ratio: 5
    }
  ],
  economy: [
    {
      id: 'standard-economy',
      name: 'Standard Economy',
      area: 18, // m²
      adrs: {
        hotel: 65,
        serviced: 57.5,
        airbnb: 57.5
      },
      capexRemodelCost: 475, // per m²
      capexEquipmentCost: 6500,
      ratio: 85
    },
    {
      id: 'twin-economy',
      name: 'Twin Economy',
      area: 22, // m²
      adrs: {
        hotel: 75,
        serviced: 67.5,
        airbnb: 67.5
      },
      capexRemodelCost: 500, // per m²
      capexEquipmentCost: 7500,
      ratio: 15
    }
  ]
};

// Default commercial spaces
export const DEFAULT_COMMERCIAL_SPACES: CommercialSpaceType[] = [
  {
    id: 'retail-luxury',
    name: 'Retail Luxury',
    baseRent: 60, // per m² per month
    percentageOfSales: 6,
    capexCost: 950, // per m²
    optimalArea: 115, // m²
    synergy: {
      hotel: 3,
      serviced: 1,
      airbnb: 1
    }
  },
  {
    id: 'retail-medium',
    name: 'Retail Medium',
    baseRent: 35, // per m² per month
    percentageOfSales: 4.5,
    capexCost: 650, // per m²
    optimalArea: 90, // m²
    synergy: {
      hotel: 2,
      serviced: 2,
      airbnb: 1
    }
  },
  {
    id: 'convenience',
    name: 'Convenience Store',
    baseRent: 27.5, // per m² per month
    percentageOfSales: 3.5,
    capexCost: 500, // per m²
    optimalArea: 70, // m²
    synergy: {
      hotel: 1,
      serviced: 3,
      airbnb: 3
    }
  },
  {
    id: 'restaurant-fine',
    name: 'Fine Dining Restaurant',
    baseRent: 35, // per m² per month
    percentageOfSales: 10,
    capexCost: 1150, // per m²
    optimalArea: 275, // m²
    synergy: {
      hotel: 3,
      serviced: 1,
      airbnb: 0
    }
  },
  {
    id: 'restaurant-casual',
    name: 'Casual Restaurant',
    baseRent: 27.5, // per m² per month
    percentageOfSales: 8,
    capexCost: 900, // per m²
    optimalArea: 200, // m²
    synergy: {
      hotel: 2,
      serviced: 2,
      airbnb: 1
    }
  },
  {
    id: 'cafe',
    name: 'Café',
    baseRent: 32.5, // per m² per month
    percentageOfSales: 6.5,
    capexCost: 750, // per m²
    optimalArea: 115, // m²
    synergy: {
      hotel: 3,
      serviced: 3,
      airbnb: 3
    }
  },
  {
    id: 'coworking',
    name: 'Coworking Space',
    baseRent: 26.5, // per m² per month
    capexCost: 600, // per m²
    optimalArea: 275, // m²
    synergy: {
      hotel: 1,
      serviced: 3,
      airbnb: 2
    }
  },
  {
    id: 'gym',
    name: 'Gym/Wellness',
    baseRent: 22.5, // per m² per month
    capexCost: 700, // per m²
    optimalArea: 250, // m²
    synergy: {
      hotel: 2,
      serviced: 2,
      airbnb: 2
    }
  }
];

// Default amenities 
export const DEFAULT_AMENITIES: AmenityType[] = [
  {
    id: 'pool',
    name: 'Swimming Pool',
    capexCost: 1750, // per m²
    area: 120, // m²
    isIncluded: false,
    impact: {
      hotel: {
        occupancy: 4,
        adr: 7.5
      },
      serviced: {
        occupancy: 3,
        adr: 4.5
      },
      airbnb: {
        occupancy: 11.5,
        adr: 15
      }
    }
  },
  {
    id: 'spa',
    name: 'Spa',
    capexCost: 1200, // per m²
    area: 100, // m²
    isIncluded: false,
    impact: {
      hotel: {
        occupancy: 2,
        adr: 5.5
      },
      serviced: {
        occupancy: 0.5,
        adr: 2
      },
      airbnb: {
        occupancy: 3.5,
        adr: 10
      }
    }
  },
  {
    id: 'roof-garden',
    name: 'Roof Garden/Terrace',
    capexCost: 850, // per m²
    area: 175, // m²
    isIncluded: false,
    impact: {
      hotel: {
        occupancy: 2,
        adr: 4
      },
      serviced: {
        occupancy: 3.5,
        adr: 5.5
      },
      airbnb: {
        occupancy: 7.5,
        adr: 11.5
      }
    }
  },
  {
    id: 'business-center',
    name: 'Business Center/Coworking',
    capexCost: 600, // per m²
    area: 80, // m²
    isIncluded: false,
    impact: {
      hotel: {
        occupancy: 3.5,
        adr: 2
      },
      serviced: {
        occupancy: 7.5,
        adr: 6
      },
      airbnb: {
        occupancy: 3.5,
        adr: 2
      }
    }
  },
  {
    id: 'gym',
    name: 'Equipped Gym',
    capexCost: 750, // per m²
    area: 60, // m²
    isIncluded: false,
    impact: {
      hotel: {
        occupancy: 3,
        adr: 3.5
      },
      serviced: {
        occupancy: 6,
        adr: 5
      },
      airbnb: {
        occupancy: 4.5,
        adr: 3.5
      }
    }
  }
];

// Building conversion costs by original building type
export const CONVERSION_COSTS: Record<BuildingType, ConversionCosts> = {
  office: {
    hotel: 1100,
    serviced: 925,
    airbnb: 775,
    durationMonths: 13,
    complexity: 'medium'
  },
  residential: {
    hotel: 1000,
    serviced: 650,
    airbnb: 500,
    durationMonths: 11,
    complexity: 'medium'
  },
  hotel: {
    hotel: 700,
    serviced: 775,
    airbnb: 550,
    durationMonths: 9,
    complexity: 'low'
  },
  industrial: {
    hotel: 1500,
    serviced: 1250,
    airbnb: 1050,
    durationMonths: 16,
    complexity: 'high'
  },
  historical: {
    hotel: 1750,
    serviced: 1450,
    airbnb: 1250,
    durationMonths: 19,
    complexity: 'veryHigh'
  }
}; 