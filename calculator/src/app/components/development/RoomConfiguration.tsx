import React from 'react';
import { RoomType } from '../../models/MultiFormatModel';

interface RoomConfigurationProps {
  roomTypes: RoomType[];
  onRoomRatioChange: (id: string, ratio: number) => void;
}

const RoomConfiguration: React.FC<RoomConfigurationProps> = ({
  roomTypes,
  onRoomRatioChange
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
    <div className="room-configuration">
      <div className="input-section-header">
        <h3>Room Types Configuration</h3>
      </div>

      <div className="room-types-grid">
        <div className="room-types-header">
          <div className="room-name">Room Type</div>
          <div className="room-area">Area (m²)</div>
          <div className="room-adr">Hotel ADR</div>
          <div className="room-adr">Serviced ADR</div>
          <div className="room-adr">Airbnb ADR</div>
          <div className="room-ratio">% in Mix</div>
        </div>

        {roomTypes.map((room) => (
          <div className="room-type-row" key={room.id}>
            <div className="room-name">{room.name}</div>
            <div className="room-area">{room.area}</div>
            <div className="room-adr">{formatCurrency(room.adrs.hotel)}</div>
            <div className="room-adr">{formatCurrency(room.adrs.serviced)}</div>
            <div className="room-adr">{formatCurrency(room.adrs.airbnb)}</div>
            <div className="room-ratio">
              <input
                type="range"
                min="0"
                max="100"
                value={room.ratio}
                onChange={(e) => onRoomRatioChange(room.id, parseInt(e.target.value))}
                className="ratio-slider"
              />
              <span className="ratio-value">{room.ratio}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="room-configuration-info">
        <p className="info-text">
          Adjust the percentage mix of room types based on your market analysis.
          The optimal mix varies by segment, location, and operational format.
        </p>
      </div>
    </div>
  );
};

export default RoomConfiguration; 