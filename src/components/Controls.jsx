import React from 'react';

const Controls = () => {
    return (
        <div className="controls">
            <button onClick={() => alert('Start clicked!')}>Start</button>
            <button onClick={() => alert('Pause clicked!')}>Pause</button>
            <button onClick={() => alert('Reset clicked!')}>Reset</button>
        </div>
    );
};

export default Controls;