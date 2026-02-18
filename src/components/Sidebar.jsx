import React, { useState } from 'react';

const Sidebar = () => {
  const [width, setWidth] = useState(0);
  const [length, setLength] = useState(0);
  const [height, setHeight] = useState(0);
  const [material, setMaterial] = useState('');
  const [color, setColor] = useState('#ffffff');

  const calculateCost = () => {
    // Example cost calculation logic based on parameters
    const baseCost = 100; // Base cost example
    const volume = width * length * height;
    const materialCost = material === 'wood' ? 1.5 : 2.0; // Example material cost
    return (baseCost + (volume * materialCost)).toFixed(2);
  };

  return (
    <div className="sidebar">
      <h2>Parameter Controls</h2>
      <label>
        Width:
        <input type="number" value={width} onChange={(e) => setWidth(+e.target.value)} />
      </label>
      <label>
        Length:
        <input type="number" value={length} onChange={(e) => setLength(+e.target.value)} />
      </label>
      <label>
        Height:
        <input type="number" value={height} onChange={(e) => setHeight(+e.target.value)} />
      </label>
      <label>
        Material:
        <select value={material} onChange={(e) => setMaterial(e.target.value)}>
          <option value="">Select Material</option>
          <option value="wood">Wood</option>
          <option value="metal">Metal</option>
          <option value="plastic">Plastic</option>
        </select>
      </label>
      <label>
        Color:
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
      </label>
      <div>
        <h3>Total Cost: ${calculateCost()}</h3>
      </div>
    </div>
  );
};

export default Sidebar;