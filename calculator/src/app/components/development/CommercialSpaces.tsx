import React from 'react';
import { CommercialSpaceType } from '../../models/MultiFormatModel';

interface CommercialSpacesProps {
  commercialSpaces: CommercialSpaceType[];
  commercialSpacesArea: number;
  onCommercialSpaceAreaChange: (area: number) => void;
  onCommercialSpaceToggle: (id: string, isIncluded: boolean) => void;
}

const CommercialSpaces: React.FC<CommercialSpacesProps> = ({
  commercialSpaces,
  commercialSpacesArea,
  onCommercialSpaceAreaChange,
  onCommercialSpaceToggle
}) => {
  // Determine if a commercial space is selected
  const isSelected = (spaceId: string): boolean => {
    const space = commercialSpaces.find(s => s.id === spaceId);
    return space?.optimalArea > 0;
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="commercial-spaces">
      <div className="input-section-header">
        <h3>Commercial Spaces</h3>
      </div>

      <div className="input-group">
        <label htmlFor="commercial-area">Total Commercial Area (m²)</label>
        <input
          type="number"
          id="commercial-area"
          value={commercialSpacesArea}
          onChange={(e) => onCommercialSpaceAreaChange(Number(e.target.value))}
          min="0"
          step="10"
        />
      </div>

      <div className="commercial-spaces-grid">
        <div className="commercial-spaces-header">
          <div className="space-include">Include</div>
          <div className="space-name">Space Type</div>
          <div className="space-rent">Base Rent/m²</div>
          <div className="space-rev">% of Sales</div>
          <div className="space-capex">CAPEX/m²</div>
          <div className="space-synergy">Format Synergy</div>
        </div>

        {commercialSpaces.map((space) => (
          <div className={`commercial-space-row ${isSelected(space.id) ? 'selected' : ''}`} key={space.id}>
            <div className="space-include">
              <input
                type="checkbox"
                id={`include-${space.id}`}
                checked={isSelected(space.id)}
                onChange={(e) => onCommercialSpaceToggle(space.id, e.target.checked)}
              />
            </div>
            <div className="space-name">{space.name}</div>
            <div className="space-rent">{formatCurrency(space.baseRent)}</div>
            <div className="space-rev">{space.percentageOfSales ? `${space.percentageOfSales}%` : 'N/A'}</div>
            <div className="space-capex">{formatCurrency(space.capexCost)}</div>
            <div className="space-synergy">
              <div className="synergy-indicators">
                <span className={`synergy-dot hotel-synergy-${space.synergy.hotel}`} title={`Hotel synergy: ${space.synergy.hotel}/3`}></span>
                <span className={`synergy-dot serviced-synergy-${space.synergy.serviced}`} title={`Serviced synergy: ${space.synergy.serviced}/3`}></span>
                <span className={`synergy-dot airbnb-synergy-${space.synergy.airbnb}`} title={`Airbnb synergy: ${space.synergy.airbnb}/3`}></span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="commercial-spaces-info">
        <p className="info-text">
          Commercial spaces can enhance overall project returns and provide amenities for guests.
          Select spaces that complement your operational format mix.
        </p>
        <div className="synergy-legend">
          <span className="legend-item">
            <span className="legend-dot hotel-dot"></span> Hotel
          </span>
          <span className="legend-item">
            <span className="legend-dot serviced-dot"></span> Serviced
          </span>
          <span className="legend-item">
            <span className="legend-dot airbnb-dot"></span> Airbnb
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommercialSpaces; 