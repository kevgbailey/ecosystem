import React from 'react';
import './PlacementTool.css';

function PlacementTool({ selectedTool, setSelectedTool, placementSight, setPlacementSight, placementSpeed, setPlacementSpeed }) {
  const tools = [
    { type: 'monkey-male', label: 'Monkey (Male)', icon: 'M', color: '#8b4513' },
    { type: 'monkey-female', label: 'Monkey (Female)', icon: 'F', color: '#8b4513' },
    { type: 'jaguar-male', label: 'Jaguar (Male)', icon: 'M', color: '#cc9933' },
    { type: 'jaguar-female', label: 'Jaguar (Female)', icon: 'F', color: '#cc9933' },
    { type: 'food', label: 'Food', icon: '•', color: '#dc3545' },
    { type: 'land', label: 'Land', icon: '■', color: '#28a745' },
    { type: null, label: 'No Tool', icon: '×', color: '#888888' }
  ];
  
  const isAnimalSelected = selectedTool && (selectedTool.includes('monkey') || selectedTool.includes('jaguar'));

  return (
    <div className="placement-tool">
      <h3>Placement Tool</h3>
      <p className="tool-instructions">
        {selectedTool ? `Click on canvas to place ${tools.find(t => t.type === selectedTool)?.label}` : 'Select a tool to place entities'}
      </p>
      <div className="tool-buttons">
        {tools.map(tool => (
          <button
            key={tool.type || 'none'}
            className={`tool-button ${selectedTool === tool.type ? 'selected' : ''}`}
            onClick={() => setSelectedTool(tool.type)}
            data-color={tool.color}
          >
            <span className="tool-icon" style={{ backgroundColor: tool.color }}>
              {tool.icon}
            </span>
            <span className="tool-label">{tool.label}</span>
          </button>
        ))}
      </div>
      
      {isAnimalSelected && (
        <div className="stats-customizer">
          <h4>Customize Stats</h4>
          
          <div className="slider-container">
            <div className="slider-header">
              <label className="slider-label">Sight Range</label>
              <span className="slider-value">{placementSight.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="10"
              max="40"
              step="0.5"
              value={placementSight}
              onChange={(e) => setPlacementSight(parseFloat(e.target.value))}
              className="slider"
            />
            <div className="slider-range">
              <span>10</span>
              <span>40</span>
            </div>
          </div>
          
          <div className="slider-container">
            <div className="slider-header">
              <label className="slider-label">Speed</label>
              <span className="slider-value">{placementSpeed.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.01"
              value={placementSpeed}
              onChange={(e) => setPlacementSpeed(parseFloat(e.target.value))}
              className="slider"
            />
            <div className="slider-range">
              <span>0.1</span>
              <span>1.0</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="tool-help">
        <h4>Quick Info</h4>
        <div className="help-item">
          <span className="help-label">Action:</span>
          <span className="help-text">Click canvas to place</span>
        </div>
        {isAnimalSelected ? (
          <>
            <div className="help-item">
              <span className="help-label">Sight:</span>
              <span className="help-text">{placementSight.toFixed(1)} units</span>
            </div>
            <div className="help-item">
              <span className="help-label">Speed:</span>
              <span className="help-text">{placementSpeed.toFixed(2)}x</span>
            </div>
            <div className="help-item">
              <span className="help-label">Hunger:</span>
              <span className="help-text">Starts full</span>
            </div>
          </>
        ) : (
          <div className="help-item">
            <span className="help-text">Select an animal to customize stats</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlacementTool;

