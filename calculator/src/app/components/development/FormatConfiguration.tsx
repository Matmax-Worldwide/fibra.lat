import React from 'react';

interface FormatConfigurationProps {
  formatDistribution: {
    hotel: number;
    serviced: number;
    airbnb: number;
  };
  allowsShortStay: boolean;
  allowsSubdivision: boolean;
  onFormatChange: (format: 'hotel' | 'serviced' | 'airbnb', value: number) => void;
  onAllowsShortStayChange: () => void;
  onAllowsSubdivisionChange: () => void;
}

const FormatConfiguration: React.FC<FormatConfigurationProps> = ({
  formatDistribution,
  allowsShortStay,
  allowsSubdivision,
  onFormatChange,
  onAllowsShortStayChange,
  onAllowsSubdivisionChange
}) => {
  return (
    <div className="format-configuration">
      <div className="input-section-header">
        <h3>Format Configuration</h3>
      </div>

      <div className="format-sliders">
        <div className="format-slider-container">
          <label htmlFor="hotel-percentage">Traditional Hotel: {formatDistribution.hotel}%</label>
          <input
            type="range"
            id="hotel-percentage"
            min="0"
            max="100"
            step="5"
            value={formatDistribution.hotel}
            onChange={(e) => onFormatChange('hotel', parseInt(e.target.value))}
            className="format-slider"
          />
          <div className="format-info">
            <p>Higher ADR, full services, brand value</p>
          </div>
        </div>

        <div className="format-slider-container">
          <label htmlFor="serviced-percentage">Serviced Apartments: {formatDistribution.serviced}%</label>
          <input
            type="range"
            id="serviced-percentage"
            min="0"
            max="100"
            step="5"
            value={formatDistribution.serviced}
            onChange={(e) => onFormatChange('serviced', parseInt(e.target.value))}
            className="format-slider"
          />
          <div className="format-info">
            <p>Medium-long stays, higher occupancy, lower operational costs</p>
          </div>
        </div>

        <div className="format-slider-container">
          <label htmlFor="airbnb-percentage">Airbnb/Booking: {formatDistribution.airbnb}%</label>
          <input
            type="range"
            id="airbnb-percentage"
            min="0"
            max="100"
            step="5"
            value={formatDistribution.airbnb}
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
          <label>
            <input
              type="checkbox"
              checked={allowsShortStay}
              onChange={onAllowsShortStayChange}
            />
            Allows Short-Term Stays (&lt; 30 days)
          </label>
          <div className="input-helper">
            May impact zoning requirements and licensing
          </div>
        </div>

        <div className="input-group">
          <label>
            <input
              type="checkbox"
              checked={allowsSubdivision}
              onChange={onAllowsSubdivisionChange}
            />
            Can be subdivided into separate units
          </label>
          <div className="input-helper">
            Enables individual unit sales or separate format operations
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormatConfiguration; 