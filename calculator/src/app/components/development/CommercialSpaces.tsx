import React from 'react';

// Define the actual commercial space type format used in the calculator
interface CommercialSpaceProps {
  id: number;
  name: string;
  area: number;
  rent: number;
  revenue: number;
  capex: number;
  isIncluded: boolean;
  hotelSynergy: number;
  servicedSynergy: number;
  airbnbSynergy: number;
}

interface CommercialSpacesProps {
  spaces: CommercialSpaceProps[];
  onToggleSpace: (id: number) => void;
  onSpaceChange?: (id: number, field: string, value: number) => void;
}

const CommercialSpaces: React.FC<CommercialSpacesProps> = ({
  spaces,
  onToggleSpace,
  onSpaceChange = () => {} // Default no-op function if not provided
}) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleNumberChange = (id: number, field: string, value: string) => {
    const numValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (!isNaN(numValue)) {
      onSpaceChange(id, field, numValue);
    }
  };

  const handleSynergyChange = (id: number, field: string, value: number) => {
    if (value >= 0 && value <= 3) {
      onSpaceChange(id, field, value);
    }
  };

  return (
    <div className="commercial-spaces">
      <div className="input-section-header">
        <h3>Commercial Spaces</h3>
      </div>

      <div className="commercial-spaces-grid">
        <div className="commercial-spaces-header">
          <div className="space-include">Include</div>
          <div className="space-name">Space Type</div>
          <div className="space-area">Area (m²)</div>
          <div className="space-rent">Rent/m²</div>
          <div className="space-rev">Annual Revenue</div>
          <div className="space-capex">CAPEX</div>
          <div className="space-synergy">Format Synergy</div>
        </div>

        {spaces.map((space) => (
          <div className={`commercial-space-row ${space.isIncluded ? 'selected' : ''}`} key={space.id}>
            <div className="space-include">
              <input
                type="checkbox"
                id={`include-${space.id}`}
                checked={space.isIncluded}
                onChange={() => onToggleSpace(space.id)}
              />
            </div>
            <div className="space-name">
              <input
                type="text"
                value={space.name}
                onChange={(e) => onSpaceChange(space.id, 'name', 0)}
                className="text-input"
                disabled
              />
            </div>
            <div className="space-area">
              <input
                type="number"
                min="10"
                max="1000"
                value={space.area}
                onChange={(e) => handleNumberChange(space.id, 'area', e.target.value)}
                className="number-input"
              />
            </div>
            <div className="space-rent">
              <input
                type="text"
                value={formatCurrency(space.rent).replace('$', '')}
                onChange={(e) => handleNumberChange(space.id, 'rent', e.target.value)}
                className="currency-input"
              />
            </div>
            <div className="space-rev">
              <input
                type="text"
                value={formatCurrency(space.revenue).replace('$', '')}
                onChange={(e) => handleNumberChange(space.id, 'revenue', e.target.value)}
                className="currency-input"
              />
            </div>
            <div className="space-capex">
              <input
                type="text"
                value={formatCurrency(space.capex).replace('$', '')}
                onChange={(e) => handleNumberChange(space.id, 'capex', e.target.value)}
                className="currency-input"
              />
            </div>
            <div className="space-synergy">
              <div className="synergy-controls">
                <div className="synergy-group">
                  <span className="synergy-label">H</span>
                  <input
                    type="number"
                    min="0"
                    max="3"
                    value={space.hotelSynergy}
                    onChange={(e) => handleSynergyChange(space.id, 'hotelSynergy', parseInt(e.target.value))}
                    className="synergy-input"
                  />
                </div>
                <div className="synergy-group">
                  <span className="synergy-label">S</span>
                  <input
                    type="number"
                    min="0"
                    max="3"
                    value={space.servicedSynergy}
                    onChange={(e) => handleSynergyChange(space.id, 'servicedSynergy', parseInt(e.target.value))}
                    className="synergy-input"
                  />
                </div>
                <div className="synergy-group">
                  <span className="synergy-label">A</span>
                  <input
                    type="number"
                    min="0"
                    max="3"
                    value={space.airbnbSynergy}
                    onChange={(e) => handleSynergyChange(space.id, 'airbnbSynergy', parseInt(e.target.value))}
                    className="synergy-input"
                  />
                </div>
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
            <span className="legend-dot hotel-dot"></span> H: Hotel
          </span>
          <span className="legend-item">
            <span className="legend-dot serviced-dot"></span> S: Serviced
          </span>
          <span className="legend-item">
            <span className="legend-dot airbnb-dot"></span> A: Airbnb
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommercialSpaces; 