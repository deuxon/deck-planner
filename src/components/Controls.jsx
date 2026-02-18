import React from 'react';
import './Controls.css';

const Controls = ({ params, setParams }) => {
    const handleChange = (field, value) => {
        setParams(prev => ({ ...prev, [field]: parseFloat(value) || value }));
    };

    return (
        <div className="controls">
            <div className="control-group">
                <label htmlFor="width">Width (ft):</label>
                <input
                    type="number"
                    id="width"
                    value={params.width}
                    onChange={(e) => handleChange('width', e.target.value)}
                    min="1"
                    max="50"
                    step="1"
                />
                <input
                    type="range"
                    value={params.width}
                    onChange={(e) => handleChange('width', e.target.value)}
                    min="1"
                    max="50"
                    step="1"
                />
                <span className="value-display">{params.width} ft</span>
            </div>

            <div className="control-group">
                <label htmlFor="length">Length (ft):</label>
                <input
                    type="number"
                    id="length"
                    value={params.length}
                    onChange={(e) => handleChange('length', e.target.value)}
                    min="1"
                    max="50"
                    step="1"
                />
                <input
                    type="range"
                    value={params.length}
                    onChange={(e) => handleChange('length', e.target.value)}
                    min="1"
                    max="50"
                    step="1"
                />
                <span className="value-display">{params.length} ft</span>
            </div>

            <div className="control-group">
                <label htmlFor="height">Height (ft):</label>
                <input
                    type="number"
                    id="height"
                    value={params.height}
                    onChange={(e) => handleChange('height', e.target.value)}
                    min="0.5"
                    max="10"
                    step="0.5"
                />
                <input
                    type="range"
                    value={params.height}
                    onChange={(e) => handleChange('height', e.target.value)}
                    min="0.5"
                    max="10"
                    step="0.5"
                />
                <span className="value-display">{params.height} ft</span>
            </div>

            <div className="control-group">
                <label htmlFor="boardSpacing">Board Spacing (in):</label>
                <input
                    type="number"
                    id="boardSpacing"
                    value={params.boardSpacing}
                    onChange={(e) => handleChange('boardSpacing', e.target.value)}
                    min="0"
                    max="1"
                    step="0.125"
                />
                <input
                    type="range"
                    value={params.boardSpacing}
                    onChange={(e) => handleChange('boardSpacing', e.target.value)}
                    min="0"
                    max="1"
                    step="0.125"
                />
                <span className="value-display">{params.boardSpacing} in</span>
            </div>

            <div className="control-group">
                <label htmlFor="boardThickness">Board Thickness (in):</label>
                <input
                    type="number"
                    id="boardThickness"
                    value={params.boardThickness}
                    onChange={(e) => handleChange('boardThickness', e.target.value)}
                    min="0.5"
                    max="3"
                    step="0.25"
                />
                <input
                    type="range"
                    value={params.boardThickness}
                    onChange={(e) => handleChange('boardThickness', e.target.value)}
                    min="0.5"
                    max="3"
                    step="0.25"
                />
                <span className="value-display">{params.boardThickness} in</span>
            </div>

            <div className="control-group">
                <label htmlFor="material">Material:</label>
                <select
                    id="material"
                    value={params.material}
                    onChange={(e) => handleChange('material', e.target.value)}
                >
                    <option value="wood">Wood</option>
                    <option value="composite">Composite</option>
                    <option value="vinyl">Vinyl</option>
                    <option value="aluminum">Aluminum</option>
                </select>
            </div>

            <div className="control-group">
                <label htmlFor="color">Color:</label>
                <input
                    type="color"
                    id="color"
                    value={params.color}
                    onChange={(e) => handleChange('color', e.target.value)}
                />
                <span className="value-display">{params.color}</span>
            </div>
        </div>
    );
};

export default Controls;