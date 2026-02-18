import React from 'react';
import './Controls.css';

const Controls = ({ deckParams, setDeckParams }) => {
    const handleChange = (param, value) => {
        setDeckParams(prev => ({
            ...prev,
            [param]: value
        }));
    };

    return (
        <div className="controls">
            <div className="controls-grid">
                <div className="control-group">
                    <label htmlFor="width">
                        Width: {deckParams.width}ft
                    </label>
                    <input
                        type="range"
                        id="width"
                        min="5"
                        max="30"
                        step="1"
                        value={deckParams.width}
                        onChange={(e) => handleChange('width', parseFloat(e.target.value))}
                    />
                </div>

                <div className="control-group">
                    <label htmlFor="length">
                        Length: {deckParams.length}ft
                    </label>
                    <input
                        type="range"
                        id="length"
                        min="5"
                        max="30"
                        step="1"
                        value={deckParams.length}
                        onChange={(e) => handleChange('length', parseFloat(e.target.value))}
                    />
                </div>

                <div className="control-group">
                    <label htmlFor="height">
                        Height: {deckParams.height}ft
                    </label>
                    <input
                        type="range"
                        id="height"
                        min="1"
                        max="10"
                        step="0.5"
                        value={deckParams.height}
                        onChange={(e) => handleChange('height', parseFloat(e.target.value))}
                    />
                </div>

                <div className="control-group">
                    <label htmlFor="boardSpacing">
                        Board Spacing: {deckParams.boardSpacing}in
                    </label>
                    <input
                        type="range"
                        id="boardSpacing"
                        min="0.125"
                        max="0.5"
                        step="0.125"
                        value={deckParams.boardSpacing}
                        onChange={(e) => handleChange('boardSpacing', parseFloat(e.target.value))}
                    />
                </div>

                <div className="control-group">
                    <label htmlFor="boardThickness">
                        Board Thickness: {deckParams.boardThickness}in
                    </label>
                    <input
                        type="range"
                        id="boardThickness"
                        min="0.25"
                        max="2"
                        step="0.25"
                        value={deckParams.boardThickness}
                        onChange={(e) => handleChange('boardThickness', parseFloat(e.target.value))}
                    />
                </div>

                <div className="control-group">
                    <label htmlFor="material">
                        Material
                    </label>
                    <select
                        id="material"
                        value={deckParams.material}
                        onChange={(e) => handleChange('material', e.target.value)}
                    >
                        <option value="wood">Wood</option>
                        <option value="composite">Composite</option>
                        <option value="vinyl">Vinyl</option>
                        <option value="aluminum">Aluminum</option>
                    </select>
                </div>

                <div className="control-group">
                    <label htmlFor="color">
                        Color
                    </label>
                    <input
                        type="color"
                        id="color"
                        value={deckParams.color}
                        onChange={(e) => handleChange('color', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default Controls;