import React from 'react';

const MainContent = () => {
    return (
        <div className="main-content">
            <div className="canvas-2d-viewer">
                {/* Placeholder for 2D deck viewer canvas */}
                <canvas id="deckCanvas" width="800" height="600"></canvas>
            </div>
            <div className="three-d-preview">
                {/* Placeholder for 3D preview section */}
                <div id="threeDPreview">
                    {/* 3D content will be rendered here */}
                </div>
            </div>
        </div>
    );
};

export default MainContent;