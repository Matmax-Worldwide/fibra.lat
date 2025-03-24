import React from 'react';
import { OperationalFormat, PropertySegment, BuildingType } from '../../models/MultiFormatModel';

interface FormatConfigurationProps {
  hotelPercentage: number;
  servicedPercentage: number;
  airbnbPercentage: number;
  propertySegment: PropertySegment;
  buildingType: BuildingType;
  onFormatChange: (
    format: 'hotel' | 'serviced' | 'airbnb',
    value: number
  ) => void;
  onSegmentChange: (segment: PropertySegment) => void;
  onBuildingTypeChange: (type: BuildingType) => void;
}

const FormatConfiguration: React.FC<FormatConfigurationProps> = ({
  hotelPercentage,
  servicedPercentage,
  airbnbPercentage,
  propertySegment,
  buildingType,
  onFormatChange,
  onSegmentChange,
  onBuildingTypeChange
}) => {
  return (
    <div className="format-configuration">
      <div className="input-section-header">
        <h3>Format Configuration</h3>
      </div>

      <div className="format-sliders">
        <div className="format-slider-container">
          <label htmlFor="hotel-percentage">Traditional Hotel: {hotelPercentage}%</label>
          <input
            type="range"
            id="hotel-percentage"
            min="0"
            max="100"
            step="5"
            value={hotelPercentage}
            onChange={(e) => onFormatChange('hotel', parseInt(e.target.value))}
            className="format-slider"
          />
          <div className="format-info">
            <p>Higher ADR, full services, brand value</p>
          </div>
        </div>

        <div className="format-slider-container">
          <label htmlFor="serviced-percentage">Serviced Apartments: {servicedPercentage}%</label>
          <input
            type="range"
            id="serviced-percentage"
            min="0"
            max="100"
            step="5"
            value={servicedPercentage}
            onChange={(e) => onFormatChange('serviced', parseInt(e.target.value))}
            className="format-slider"
          />
          <div className="format-info">
            <p>Medium-long stays, higher occupancy, lower operational costs</p>
          </div>
        </div>

        <div className="format-slider-container">
          <label htmlFor="airbnb-percentage">Airbnb/Booking: {airbnbPercentage}%</label>
          <input
            type="range"
            id="airbnb-percentage"
            min="0"
            max="100"
            step="5"
            value={airbnbPercentage}
            onChange={(e) => onFormatChange('airbnb', parseInt(e.target.value))}
            className="format-slider"
          />
          <div className="format-info">
            <p>Flexible format, minimal services, highest margin potential</p>
          </div>
        </div>
      </div>

      <div className="supplementary-options">
        <div className="input-group">
          <label htmlFor="property-segment">Property Segment</label>
          <select
            id="property-segment"
            value={propertySegment}
            onChange={(e) => onSegmentChange(e.target.value as PropertySegment)}
          >
            <option value="luxury">Luxury</option>
            <option value="upscale">Upscale</option>
            <option value="midscale">Midscale</option>
            <option value="economy">Economy</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="building-type">Original Building Type</label>
          <select
            id="building-type"
            value={buildingType}
            onChange={(e) => onBuildingTypeChange(e.target.value as BuildingType)}
          >
            <option value="office">Office Building</option>
            <option value="residential">Residential Building</option>
            <option value="hotel">Existing Hotel</option>
            <option value="industrial">Industrial Building</option>
            <option value="historical">Historical Building</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FormatConfiguration; 