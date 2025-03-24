import React from 'react';
import { AmenityType } from '../../models/MultiFormatModel';

interface AmenitiesSelectionProps {
  amenities: AmenityType[];
  onAmenityToggle: (id: string, isIncluded: boolean) => void;
}

const AmenitiesSelection: React.FC<AmenitiesSelectionProps> = ({
  amenities,
  onAmenityToggle
}) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="amenities-selection">
      <div className="input-section-header">
        <h3>Amenities</h3>
      </div>

      <div className="amenities-grid">
        <div className="amenities-header">
          <div className="amenity-include">Include</div>
          <div className="amenity-name">Amenity</div>
          <div className="amenity-area">Area (m²)</div>
          <div className="amenity-capex">CAPEX/m²</div>
          <div className="amenity-impact-hotel">Hotel Impact</div>
          <div className="amenity-impact-serviced">Serviced Impact</div>
          <div className="amenity-impact-airbnb">Airbnb Impact</div>
        </div>

        {amenities.map((amenity) => (
          <div className={`amenity-row ${amenity.isIncluded ? 'included' : ''}`} key={amenity.id}>
            <div className="amenity-include">
              <input
                type="checkbox"
                id={`include-${amenity.id}`}
                checked={amenity.isIncluded}
                onChange={(e) => onAmenityToggle(amenity.id, e.target.checked)}
              />
            </div>
            <div className="amenity-name">{amenity.name}</div>
            <div className="amenity-area">{amenity.area}</div>
            <div className="amenity-capex">{formatCurrency(amenity.capexCost)}</div>
            <div className="amenity-impact-hotel">
              <div className="impact-details">
                <div className="impact-item">
                  <span className="impact-label">Occ:</span>
                  <span className="impact-value">+{amenity.impact.hotel.occupancy}%</span>
                </div>
                <div className="impact-item">
                  <span className="impact-label">ADR:</span>
                  <span className="impact-value">+{amenity.impact.hotel.adr}%</span>
                </div>
              </div>
            </div>
            <div className="amenity-impact-serviced">
              <div className="impact-details">
                <div className="impact-item">
                  <span className="impact-label">Occ:</span>
                  <span className="impact-value">+{amenity.impact.serviced.occupancy}%</span>
                </div>
                <div className="impact-item">
                  <span className="impact-label">ADR:</span>
                  <span className="impact-value">+{amenity.impact.serviced.adr}%</span>
                </div>
              </div>
            </div>
            <div className="amenity-impact-airbnb">
              <div className="impact-details">
                <div className="impact-item">
                  <span className="impact-label">Occ:</span>
                  <span className="impact-value">+{amenity.impact.airbnb.occupancy}%</span>
                </div>
                <div className="impact-item">
                  <span className="impact-label">ADR:</span>
                  <span className="impact-value">+{amenity.impact.airbnb.adr}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="amenities-info">
        <p className="info-text">
          Amenities can significantly impact occupancy and ADR depending on the operational format.
          Balance the investment cost against the potential revenue enhancement.
        </p>
      </div>
    </div>
  );
};

export default AmenitiesSelection; 