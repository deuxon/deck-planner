import React, { useEffect, useRef } from 'react';
import './DeckEditor.css';

const DeckEditor = ({ deckParams }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !deckParams) return;

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        ctx.fillStyle = '#f9f9f9';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawGrid(ctx, canvas.width, canvas.height);
        drawDeckPlan(ctx, canvas.width, canvas.height, deckParams);
        drawDimensions(ctx, canvas.width, canvas.height, deckParams);
    }, [deckParams]);

    const drawGrid = (ctx, width, height) => {
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 0.5;
        const gridSize = 30;
        for (let i = 0; i < width; i += gridSize) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
        }
        for (let i = 0; i < height; i += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
            ctx.stroke();
        }
    };

    const drawDeckPlan = (ctx, width, height, data) => {
        const scale = 20;
        const centerX = width / 2;
        const centerY = height / 2;
        const deckWidth = data.width * scale;
        const deckLength = data.length * scale;
        const x = centerX - deckWidth / 2;
        const y = centerY - deckLength / 2;

        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, deckWidth, deckLength);
        ctx.fillStyle = 'rgba(102, 126, 234, 0.1)';
        ctx.fillRect(x, y, deckWidth, deckLength);

        const boardSpacing = data.boardSpacing * scale;
        const boardThickness = data.boardThickness * scale;
        ctx.strokeStyle = data.color;
        ctx.lineWidth = 2;
        for (let i = 0; i < deckLength; i += boardSpacing + boardThickness) {
            ctx.fillStyle = data.color;
            ctx.globalAlpha = 0.7;
            ctx.fillRect(x, y + i, deckWidth, boardThickness);
            ctx.globalAlpha = 1.0;
        }
        ctx.fillStyle = '#764ba2';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
        ctx.fill();
    };

    const drawDimensions = (ctx, width, height, data) => {
        const scale = 20;
        const centerX = width / 2;
        const centerY = height / 2;
        const deckWidth = data.width * scale;
        const deckLength = data.length * scale;
        const x = centerX - deckWidth / 2;
        const y = centerY - deckLength / 2;

        ctx.fillStyle = '#333';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${data.width}'`, centerX, y - 15);

        ctx.save();
        ctx.translate(x - 30, centerY);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(`${data.length}'`, 0, 0);
        ctx.restore();
    };

    return <canvas ref={canvasRef} className="deck-editor-canvas" />;
};

export default DeckEditor;