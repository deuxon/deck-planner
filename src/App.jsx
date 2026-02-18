import React, { useState, useEffect } from 'react';
import DeckEditor from './components/DeckEditor';
import DeckViewer3D from './components/DeckViewer3D';
import Controls from './components/Controls';
import './App.css';

const App = () => {
    const [deckParams, setDeckParams] = useState({
        width: 12,
        length: 16,
        height: 2,
        boardSpacing: 0.25,
        boardThickness: 1,
        material: 'wood',
        color: '#8B4513'
    });
    const [theme, setTheme] = useState('light');
    const [savedDesigns, setSavedDesigns] = useState([]);

    useEffect(() => {
        // Load designs from localStorage
        const designs = JSON.parse(localStorage.getItem('designs')) || [];
        setSavedDesigns(designs);
    }, []);

    useEffect(() => {
        // Save designs to localStorage whenever savedDesigns changes
        localStorage.setItem('designs', JSON.stringify(savedDesigns));
    }, [savedDesigns]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const calculateCost = () => {
        // Placeholder for cost calculation logic
        // Implement cost calculation based on deckParams
        return 0;
    };

    const saveDesign = () => {
        const name = prompt('Enter design name:');
        if (name) {
            setSavedDesigns([...savedDesigns, { name, params: deckParams }]);
        }
    };

    const loadDesign = (design) => {
        setDeckParams(design.params);
    };

    return (
        <div className={`app ${theme}`}> 
            <header className="app-header">
                <h1>Deck Planner</h1>
                <button onClick={toggleTheme} className="theme-toggle">
                    {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
                </button>
            </header>
            <div className="app-container">
                <aside className="sidebar">
                    <div className="sidebar-section">
                        <h2>Controls</h2>
                        <Controls params={deckParams} setParams={setDeckParams} />
                    </div>
                    <div className="sidebar-section">
                        <h2>Save/Load</h2>
                        <button onClick={saveDesign} className="button">Save Design</button>
                        {savedDesigns.length > 0 && (
                            <div className="saved-designs">
                                <h3>Saved Designs</h3>
                                {savedDesigns.map((design, idx) => (
                                    <button key={idx} onClick={() => loadDesign(design)} className="button">
                                        {design.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="sidebar-section">
                        <h2>Cost</h2>
                        <div className="cost-calculator">
                            <p>Total Cost: ${calculateCost()}</p>
                        </div>
                    </div>
                </aside>
                <main className="main-content">
                    <section className="editor-section">
                        <h2>2D View</h2>
                        <DeckEditor deckParams={deckParams} />
                    </section>
                    <section className="viewer-section">
                        <h2>3D View</h2>
                        <DeckViewer3D params={deckParams} />
                    </section>
                </main>
            </div>
        </div>
    );
};

export default App;