import React, { useMemo, useState } from 'react';

// Define the actual room type format used in the calculator
interface RoomTypeProps {
  id: number;
  name: string;
  area: number;
  hotelAdr: number;
  servicedAdr: number;
  airbnbAdr: number;
  ratio: number;
}

interface RoomConfigurationProps {
  roomTypes: RoomTypeProps[];
  onRoomTypeChange: (id: number, field: string, value: number) => void;
}

const RoomConfiguration: React.FC<RoomConfigurationProps> = ({
  roomTypes,
  onRoomTypeChange
}) => {
  // State to track if we're in advanced mode (showing numeric inputs for ratio)
  const [advancedMode, setAdvancedMode] = useState<boolean>(false);

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
      onRoomTypeChange(id, field, numValue);
    }
  };

  // Calculate totals and averages
  const totals = useMemo(() => {
    const initialTotals = {
      totalRatio: 0,
      totalArea: 0,
      totalHotelAdr: 0,
      totalServicedAdr: 0,
      totalAirbnbAdr: 0,
      weightedArea: 0,
      weightedHotelAdr: 0,
      weightedServicedAdr: 0,
      weightedAirbnbAdr: 0,
    };

    return roomTypes.reduce((acc, room) => {
      acc.totalRatio += room.ratio;
      acc.totalArea += room.area;
      acc.totalHotelAdr += room.hotelAdr;
      acc.totalServicedAdr += room.servicedAdr;
      acc.totalAirbnbAdr += room.airbnbAdr;
      
      // Weighted calculations
      acc.weightedArea += room.area * (room.ratio / 100);
      acc.weightedHotelAdr += room.hotelAdr * (room.ratio / 100);
      acc.weightedServicedAdr += room.servicedAdr * (room.ratio / 100);
      acc.weightedAirbnbAdr += room.airbnbAdr * (room.ratio / 100);
      
      return acc;
    }, initialTotals);
  }, [roomTypes]);

  // Handle ratio adjustment to ensure total is 100%
  const handleRatioChange = (id: number, newRatio: number) => {
    // Get current total for all other room types
    const otherTypesTotal = roomTypes
      .filter(room => room.id !== id)
      .reduce((sum, room) => sum + room.ratio, 0);
    
    // Calculate new value ensuring it doesn't go negative or make others negative
    let adjustedRatio = newRatio;
    if (otherTypesTotal + adjustedRatio > 100) {
      adjustedRatio = 100 - otherTypesTotal;
    }
    if (adjustedRatio < 0) {
      adjustedRatio = 0;
    }
    
    onRoomTypeChange(id, 'ratio', adjustedRatio);
    
    // If total now doesn't equal 100%, proportionally adjust other values
    const newTotal = otherTypesTotal + adjustedRatio;
    if (newTotal !== 100 && otherTypesTotal > 0) {
      const adjustmentFactor = (100 - adjustedRatio) / otherTypesTotal;
      
      roomTypes.forEach(room => {
        if (room.id !== id) {
          const newRoomRatio = Math.round(room.ratio * adjustmentFactor);
          onRoomTypeChange(room.id, 'ratio', newRoomRatio);
        }
      });
    }
  };

  // Distribute the ratios evenly among all room types
  const handleEvenDistribution = () => {
    const evenRatio = Math.floor(100 / roomTypes.length);
    const remainder = 100 - (evenRatio * roomTypes.length);
    
    roomTypes.forEach((room, index) => {
      // Add the remainder to the first room
      const ratio = index === 0 ? evenRatio + remainder : evenRatio;
      onRoomTypeChange(room.id, 'ratio', ratio);
    });
  };

  // Reset other ratios to 0 and set selected room type to 100%
  const handleFullAllocation = (id: number) => {
    roomTypes.forEach(room => {
      const ratio = room.id === id ? 100 : 0;
      onRoomTypeChange(room.id, 'ratio', ratio);
    });
  };

  return (
    <div className="room-configuration">
      <div className="input-section-header">
        <h3>Room Types Configuration</h3>
        <div className="section-controls">
          <button 
            type="button" 
            className="control-button" 
            onClick={handleEvenDistribution}
            title="Distribute ratios evenly among all room types"
          >
            Even Mix
          </button>
          <button
            type="button"
            className="control-button"
            onClick={() => setAdvancedMode(!advancedMode)}
            title={advancedMode ? "Switch to slider controls" : "Switch to numeric inputs"}
          >
            {advancedMode ? "Simple Mode" : "Advanced Mode"}
          </button>
        </div>
      </div>

      <div className="room-types-grid">
        <div className="room-types-header">
          <div className="room-name">Room Type</div>
          <div className="room-area">Area (m²)</div>
          <div className="room-adr">Hotel ADR</div>
          <div className="room-adr">Serviced ADR</div>
          <div className="room-adr">Airbnb ADR</div>
          <div className="room-ratio">% in Mix</div>
          <div className="room-actions">Actions</div>
        </div>

        {roomTypes.map((room) => (
          <div className="room-type-row" key={room.id}>
            <div className="room-name">
              <input
                type="text"
                value={room.name}
                onChange={(e) => onRoomTypeChange(room.id, 'name', 0)}
                className="text-input"
                disabled
              />
            </div>
            <div className="room-area">
              <input
                type="number"
                min="10"
                max="500"
                value={room.area}
                onChange={(e) => handleNumberChange(room.id, 'area', e.target.value)}
                className="number-input"
              />
            </div>
            <div className="room-adr">
              <input
                type="text"
                value={formatCurrency(room.hotelAdr).replace('$', '')}
                onChange={(e) => handleNumberChange(room.id, 'hotelAdr', e.target.value)}
                className="currency-input"
              />
            </div>
            <div className="room-adr">
              <input
                type="text"
                value={formatCurrency(room.servicedAdr).replace('$', '')}
                onChange={(e) => handleNumberChange(room.id, 'servicedAdr', e.target.value)}
                className="currency-input"
              />
            </div>
            <div className="room-adr">
              <input
                type="text"
                value={formatCurrency(room.airbnbAdr).replace('$', '')}
                onChange={(e) => handleNumberChange(room.id, 'airbnbAdr', e.target.value)}
                className="currency-input"
              />
            </div>
            <div className="room-ratio">
              {advancedMode ? (
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={room.ratio}
                  onChange={(e) => handleRatioChange(room.id, parseInt(e.target.value || '0'))}
                  className="ratio-input"
                />
              ) : (
                <>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={room.ratio}
                    onChange={(e) => handleRatioChange(room.id, parseInt(e.target.value))}
                    className="ratio-slider"
                  />
                  <span className={`ratio-value ${room.ratio === 0 ? 'ratio-zero' : ''}`}>
                    {room.ratio}%
                  </span>
                </>
              )}
            </div>
            <div className="room-actions">
              <button
                type="button"
                className="action-button"
                onClick={() => handleFullAllocation(room.id)}
                title="Set this room type to 100%"
              >
                100%
              </button>
            </div>
          </div>
        ))}
        
        {/* Totals and averages row */}
        <div className="room-type-row totals-row">
          <div className="room-name">
            <strong>Totals & Averages</strong>
          </div>
          <div className="room-area">
            <span title="Average Area">Avg: {Math.round(totals.weightedArea)} m²</span>
          </div>
          <div className="room-adr">
            <span title="Average Hotel ADR">{formatCurrency(Math.round(totals.weightedHotelAdr))}</span>
          </div>
          <div className="room-adr">
            <span title="Average Serviced ADR">{formatCurrency(Math.round(totals.weightedServicedAdr))}</span>
          </div>
          <div className="room-adr">
            <span title="Average Airbnb ADR">{formatCurrency(Math.round(totals.weightedAirbnbAdr))}</span>
          </div>
          <div className="room-ratio">
            <span className={`total-ratio ${totals.totalRatio !== 100 ? 'ratio-error' : ''}`}>
              {totals.totalRatio}%
            </span>
          </div>
          <div className="room-actions">
            {totals.totalRatio !== 100 && (
              <button
                type="button"
                className="action-button fix-button"
                onClick={handleEvenDistribution}
                title="Fix the mix to equal 100%"
              >
                Fix
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="room-configuration-info">
        <p className="info-text">
          Adjust the room specifications and the percentage mix of room types based on your market analysis.
          The optimal mix varies by segment, location, and operational format.
          <span className={`mix-validation ${totals.totalRatio !== 100 ? 'validation-error' : 'validation-success'}`}>
            {totals.totalRatio !== 100 
              ? `⚠️ Room type mix must equal 100% (current: ${totals.totalRatio}%)` 
              : `✓ Room type mix equals 100%`}
          </span>
        </p>
      </div>
    </div>
  );
};

export default RoomConfiguration; 