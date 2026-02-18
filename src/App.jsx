import React, { useState, useEffect } from 'react';
import DeckEditor from './components/DeckEditor';
import DeckViewer3D from './components/DeckViewer3D';
import Controls from './components/Controls';
import './App.css';

const App = () => {
    const [deckParams, setDeckParams] = useState({
        width: 10,
        length: 12,
        height: 3,
        boardSpacing: 0.25,
        boardThickness: 0.5,
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

    return (
        <div className={`app ${theme}`}> 
            <header>
                <h1>Deck Planner</h1>
                <button className="theme-toggle" onClick={toggleTheme}>
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>
            </header>
            <Controls 
                deckParams={deckParams} 
                setDeckParams={setDeckParams} 
            />
            <div className="viewers-container">
                <div className="viewer-section">
                    <h2>2D Plan View</h2>
                    <DeckEditor deckParams={deckParams} />
                </div>
                <div className="viewer-section">
                    <h2>3D View</h2>
                    <DeckViewer3D deckParams={deckParams} />
                </div>
            </div>
            <div className="cost-calculator">
                <h2>Estimated Cost: ${calculateCost()}</h2>
            </div>
        </div>
    );
};

export default App;