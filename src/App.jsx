import React, { useState, useEffect } from 'react';
import DeckEditor from './DeckEditor';
import DeckViewer3D from './DeckViewer3D';
import Controls from './Controls';

const App = () => {
    const [deckParams, setDeckParams] = useState({});
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
            <Controls toggleTheme={toggleTheme} />
            <DeckEditor deckParams={deckParams} setDeckParams={setDeckParams} />
            <DeckViewer3D deckParams={deckParams} />
            <div className="cost-calculator">
                <h2>Total Cost: ${calculateCost()}</h2>
            </div>
        </div>
    );
};

export default App;