// DeckViewer3D component
import React, { useRef, useEffect } from 'react';
import './DeckViewer3D.css';

const DeckViewer3D = ({ params }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !params) return;

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        // Clear canvas
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw 3D-style deck representation
        draw3DDeck(ctx, canvas.width, canvas.height, params);
    }, [params]);

    const draw3DDeck = (ctx, width, height, data) => {
        const centerX = width / 2;
        const centerY = height / 2;
        const scale = 15;
        
        // Perspective settings
        const deckWidth = data.width * scale;
        const deckLength = data.length * scale;
        const deckHeight = data.height * scale;
        
        // Draw deck in 3D perspective
        const offsetX = deckWidth * 0.3;
        const offsetY = deckHeight * 0.5;

        // Top face (deck surface)
        ctx.fillStyle = data.color;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX - deckWidth/2, centerY - deckLength/2 - offsetY);
        ctx.lineTo(centerX + deckWidth/2 + offsetX, centerY - deckLength/2 - offsetY);
        ctx.lineTo(centerX + deckWidth/2 + offsetX, centerY + deckLength/2 - offsetY);
        ctx.lineTo(centerX - deckWidth/2, centerY + deckLength/2 - offsetY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Draw boards on top
        const boardSpacing = (data.boardSpacing + data.boardThickness) * scale / 12;
        const numBoards = Math.floor(deckLength / boardSpacing);
        
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= numBoards; i++) {
            const y = centerY - deckLength/2 - offsetY + i * boardSpacing;
            ctx.beginPath();
            ctx.moveTo(centerX - deckWidth/2, y);
            ctx.lineTo(centerX + deckWidth/2 + offsetX, y);
            ctx.stroke();
        }

        // Right face
        const rightColor = adjustBrightness(data.color, -30);
        ctx.fillStyle = rightColor;
        ctx.beginPath();
        ctx.moveTo(centerX + deckWidth/2 + offsetX, centerY - deckLength/2 - offsetY);
        ctx.lineTo(centerX + deckWidth/2 + offsetX, centerY + deckLength/2 - offsetY);
        ctx.lineTo(centerX + deckWidth/2 + offsetX, centerY + deckLength/2);
        ctx.lineTo(centerX + deckWidth/2 + offsetX, centerY - deckLength/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Front face
        const frontColor = adjustBrightness(data.color, -50);
        ctx.fillStyle = frontColor;
        ctx.beginPath();
        ctx.moveTo(centerX - deckWidth/2, centerY + deckLength/2 - offsetY);
        ctx.lineTo(centerX + deckWidth/2 + offsetX, centerY + deckLength/2 - offsetY);
        ctx.lineTo(centerX + deckWidth/2 + offsetX, centerY + deckLength/2);
        ctx.lineTo(centerX - deckWidth/2, centerY + deckLength/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Add text label
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${data.width}' x ${data.length}' x ${data.height}' Deck`, centerX, height - 30);
        ctx.font = '12px Arial';
        ctx.fillText(`Material: ${data.material}`, centerX, height - 10);
    };

    const adjustBrightness = (hex, percent) => {
        // Validate and normalize hex color
        if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) {
            return '#8B4513'; // Return default brown color
        }
        
        let hexValue = hex.replace('#', '');
        
        // Handle 3-character hex codes by expanding them
        if (hexValue.length === 3) {
            hexValue = hexValue.split('').map(char => char + char).join('');
        }
        
        // Validate hex format
        if (hexValue.length !== 6 || !/^[0-9A-Fa-f]{6}$/.test(hexValue)) {
            return '#8B4513'; // Return default brown color
        }
        
        const num = parseInt(hexValue, 16);
        const r = Math.max(0, Math.min(255, (num >> 16) + percent));
        const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + percent));
        const b = Math.max(0, Math.min(255, (num & 0x0000FF) + percent));
        return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
    };

    return (
        <div className="deck-viewer-3d">
            <canvas ref={canvasRef} />
        </div>
    );
};

export default DeckViewer3D;