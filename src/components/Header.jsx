import React, { useState } from 'react';

const Header = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: isDarkTheme ? '#333' : '#fff', color: isDarkTheme ? '#fff' : '#000' }}>
      <h1>🏗️ Deck Planner Pro</h1>
      <button onClick={toggleTheme} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
        {isDarkTheme ? 'Light Mode' : 'Dark Mode'}
      </button>
    </header>
  );
};

export default Header;