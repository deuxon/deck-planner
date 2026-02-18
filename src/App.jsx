import React, { useState } from 'react';

export default function App() {
    const [width, setWidth] = useState(12);
    const [length, setLength] = useState(16);
    const [height, setHeight] = useState(3);
    const [material, setMaterial] = useState('wood');
    const [color, setColor] = useState('#8B4513');

    const calculateCost = () => {
        const area = width * length;
        const costs = { wood: 5, composite: 8, cedar: 6, redwood: 7 };
        return (area * (costs[material] || 5)).toFixed(2);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'system-ui' }}>
            <header style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ margin: 0 }}>🏗️ Deck Planner Pro</h1>
                <button style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer' }}>Dark Mode</button>
            </header>
            <div style={{ display: 'flex', flex: 1 }}>
                <aside style={{ width: '300px', padding: '20px', background: 'white', borderRight: '1px solid #ddd', overflowY: 'auto' }}>
                    <h2>Specifications</h2>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Width: {width}ft</label>
                        <input type="range" min="4" max="20" value={width} onChange={(e) => setWidth(parseFloat(e.target.value))} style={{ width: '100%' }} />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Length: {length}ft</label>
                        <input type="range" min="6" max="30" value={length} onChange={(e) => setLength(parseFloat(e.target.value))} style={{ width: '100%' }} />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Height: {height}ft</label>
                        <input type="range" min="1" max="6" value={height} onChange={(e) => setHeight(parseFloat(e.target.value))} style={{ width: '100%' }} />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Material:</label>
                        <select value={material} onChange={(e) => setMaterial(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
                            <option value="wood">Wood ($5/sqft)</option>
                            <option value="composite">Composite ($8/sqft)</option>
                            <option value="cedar">Cedar ($6/sqft)</option>
                            <option value="redwood">Redwood ($7/sqft)</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Color:</label>
                        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: '100%', height: '40px', borderRadius: '4px', cursor: 'pointer' }} />
                    </div>
                    <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
                        <h3 style={{ marginBottom: '10px' }}>💰 Estimated Cost</h3>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>${calculateCost()}</p>
                    </div>
                </aside>
                <main style={{ flex: 1, display: 'flex', gap: '15px', padding: '20px', overflow: 'hidden' }}>
                    <section style={{ flex: 1, background: 'white', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ marginBottom: '10px' }}>2D Plan View</h2>
                        <canvas width={500} height={400} style={{ border: '1px solid #ccc', borderRadius: '8px', background: '#f5f5f5' }} />
                    </section>
                    <section style={{ flex: 1, background: 'white', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ marginBottom: '10px' }}>3D Preview</h2>
                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px', fontWeight: 'bold' }}>🎬 3D Deck Viewer</div>
                    </section>
                </main>
            </div>
        </div>
    );
}