import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function App() {
    const [width, setWidth] = useState(12);
    const [length, setLength] = useState(16);
    const [height, setHeight] = useState(3);
    const [material, setMaterial] = useState('wood');
    const [color, setColor] = useState('#8B4513');
    const [viewMode, setViewMode] = useState('3d');

    // Constants for board dimensions
    const BOARD_WIDTH = 0.25; // feet
    const BOARD_SPACING = 0.5; // feet
    const SECTION_HEADER_HEIGHT = '40px'; // Height reserved for section headers

    const canvasRef = useRef(null);
    const threeDivRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const deckGroupRef = useRef(null);
    const mouseDownRef = useRef(false);
    const mouseRef = useRef({ x: 0, y: 0 });
    const rotationRef = useRef({ x: 0.3, y: 0.5 });
    const animationFrameRef = useRef(null);

    const calculateCost = () => {
        const area = width * length;
        const costs = { wood: 5, composite: 8, cedar: 6, redwood: 7 };
        return (area * (costs[material] || 5)).toFixed(2);
    };

    // 2D Canvas Drawing
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || viewMode !== '2d') return;

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        // Clear canvas
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 0.5;
        const gridSize = 30;
        for (let i = 0; i < canvas.width; i += gridSize) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }

        // Draw deck plan
        const scale = Math.min(canvas.width / (width + 4), canvas.height / (length + 4));
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const deckWidth = width * scale;
        const deckLength = length * scale;
        const x = centerX - deckWidth / 2;
        const y = centerY - deckLength / 2;

        // Deck outline
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, deckWidth, deckLength);
        ctx.fillStyle = 'rgba(102, 126, 234, 0.1)';
        ctx.fillRect(x, y, deckWidth, deckLength);

        // Draw boards
        const boardSpacing = BOARD_SPACING * scale;
        const boardWidth = BOARD_WIDTH * scale;
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.7;
        for (let i = 0; i < deckLength; i += boardSpacing + boardWidth) {
            ctx.fillRect(x, y + i, deckWidth, boardWidth);
        }
        ctx.globalAlpha = 1.0;

        // Draw center point
        ctx.fillStyle = '#764ba2';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw dimensions
        ctx.fillStyle = '#333';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${width}ft`, centerX, y - 15);

        ctx.save();
        ctx.translate(x - 30, centerY);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(`${length}ft`, 0, 0);
        ctx.restore();
    }, [width, length, color, viewMode]);

    // 3D Scene Setup and Rendering
    useEffect(() => {
        const container = threeDivRef.current;
        if (!container || viewMode !== '3d') return;

        // Wait for container to have dimensions
        const containerWidth = container.clientWidth || 400;
        const containerHeight = container.clientHeight || 400;
        
        if (containerWidth === 0 || containerHeight === 0) return;

        // Initialize scene (only once)
        if (!sceneRef.current) {
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x1a1a2e);
            sceneRef.current = scene;

            // Camera
            const camera = new THREE.PerspectiveCamera(
                50,
                containerWidth / containerHeight,
                0.1,
                1000
            );
            cameraRef.current = camera;

            // Renderer
            try {
                const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
                renderer.setSize(containerWidth, containerHeight);
                renderer.shadowMap.enabled = true;
                container.appendChild(renderer.domElement);
                rendererRef.current = renderer;
            } catch (error) {
                console.error('WebGL not supported:', error);
                // Create fallback message
                const fallbackDiv = document.createElement('div');
                fallbackDiv.style.cssText = 'display: flex; align-items: center; justify-content: center; height: 100%; color: white; font-size: 16px;';
                fallbackDiv.textContent = '3D Preview (WebGL required)';
                container.appendChild(fallbackDiv);
                return;
            }

            // Lights
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(10, 20, 10);
            directionalLight.castShadow = true;
            scene.add(directionalLight);

            const pointLight = new THREE.PointLight(0xffffff, 0.4);
            pointLight.position.set(-10, 10, -10);
            scene.add(pointLight);

            // Ground plane
            const groundGeometry = new THREE.PlaneGeometry(100, 100);
            const groundMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x2d3748,
                roughness: 0.8 
            });
            const ground = new THREE.Mesh(groundGeometry, groundMaterial);
            ground.rotation.x = -Math.PI / 2;
            ground.position.y = -0.1;
            ground.receiveShadow = true;
            scene.add(ground);
        }

        // Re-attach renderer canvas if it was previously created but detached
        if (rendererRef.current && !container.contains(rendererRef.current.domElement)) {
            container.appendChild(rendererRef.current.domElement);
            // Update renderer size in case container dimensions changed
            rendererRef.current.setSize(containerWidth, containerHeight);
        }

        // Update camera position based on deck dimensions
        if (cameraRef.current) {
            cameraRef.current.position.set(width * 1.5, height * 2, length * 1.5);
            cameraRef.current.lookAt(0, 0, 0);
        }

        // Clear existing deck
        if (deckGroupRef.current) {
            sceneRef.current.remove(deckGroupRef.current);
            deckGroupRef.current.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
        }

        // Create deck group
        const deckGroup = new THREE.Group();
        deckGroupRef.current = deckGroup;

        // Deck material
        const deckMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(color),
            roughness: 0.7,
            metalness: 0.1
        });

        // Create deck boards
        const numBoards = Math.floor(length / (BOARD_WIDTH + BOARD_SPACING));

        for (let i = 0; i < numBoards; i++) {
            const boardGeometry = new THREE.BoxGeometry(width, 0.1, BOARD_WIDTH);
            const board = new THREE.Mesh(boardGeometry, deckMaterial);
            board.position.z = (i - numBoards / 2) * (BOARD_WIDTH + BOARD_SPACING);
            board.position.y = height;
            board.castShadow = true;
            board.receiveShadow = true;
            deckGroup.add(board);
        }

        // Create support posts at corners
        const postMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.9
        });

        const postPositions = [
            [-width / 2 + 0.5, -length / 2 + 0.5],
            [width / 2 - 0.5, -length / 2 + 0.5],
            [-width / 2 + 0.5, length / 2 - 0.5],
            [width / 2 - 0.5, length / 2 - 0.5]
        ];

        postPositions.forEach(([x, z]) => {
            const postGeometry = new THREE.BoxGeometry(0.3, height, 0.3);
            const post = new THREE.Mesh(postGeometry, postMaterial);
            post.position.set(x, height / 2, z);
            post.castShadow = true;
            post.receiveShadow = true;
            deckGroup.add(post);
        });

        sceneRef.current.add(deckGroup);

        // Animation loop (cancel previous if exists)
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        const animate = () => {
            animationFrameRef.current = requestAnimationFrame(animate);

            // Apply rotation
            if (deckGroupRef.current) {
                deckGroupRef.current.rotation.x = rotationRef.current.x;
                deckGroupRef.current.rotation.y = rotationRef.current.y;
            }

            if (rendererRef.current && sceneRef.current && cameraRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }
        };
        animate();

        // Mouse controls
        const handleMouseDown = (e) => {
            mouseDownRef.current = true;
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseMove = (e) => {
            if (!mouseDownRef.current) return;

            const deltaX = e.clientX - mouseRef.current.x;
            const deltaY = e.clientY - mouseRef.current.y;

            rotationRef.current.y += deltaX * 0.01;
            rotationRef.current.x += deltaY * 0.01;

            // Limit x rotation to prevent deck from clipping through ground
            // Keep rotation between -0.2 and 1.0 (roughly 0 to 60 degrees) to keep deck above ground
            rotationRef.current.x = Math.max(-0.2, Math.min(1.0, rotationRef.current.x));

            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseUp = () => {
            mouseDownRef.current = false;
        };

        const handleWheel = (e) => {
            e.preventDefault();
            const camera = cameraRef.current;
            if (!camera) return;

            const zoomSpeed = 0.1;
            const delta = e.deltaY > 0 ? 1 : -1;
            
            camera.position.multiplyScalar(1 + delta * zoomSpeed);
            
            // Limit zoom
            const distance = camera.position.length();
            if (distance < 5) camera.position.normalize().multiplyScalar(5);
            if (distance > 100) camera.position.normalize().multiplyScalar(100);
        };

        container.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        container.addEventListener('wheel', handleWheel, { passive: false });

        // Cleanup
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
            container.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            container.removeEventListener('wheel', handleWheel);
        };
    }, [width, length, height, color, viewMode]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (rendererRef.current) {
                rendererRef.current.dispose();
                if (threeDivRef.current && rendererRef.current.domElement) {
                    threeDivRef.current.removeChild(rendererRef.current.domElement);
                }
            }
        };
    }, []);

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
                <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', overflow: 'hidden' }}>
                    <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'center' }}>
                        <div style={{ 
                            display: 'inline-flex', 
                            borderRadius: '8px', 
                            overflow: 'hidden',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            border: '2px solid #667eea'
                        }}>
                            <button 
                                onClick={() => setViewMode('3d')}
                                style={{ 
                                    background: viewMode === '3d' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                                    color: viewMode === '3d' ? 'white' : '#667eea',
                                    border: 'none',
                                    padding: '10px 24px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    borderRight: '1px solid #667eea'
                                }}
                            >
                                🎨 3D View
                            </button>
                            <button 
                                onClick={() => setViewMode('2d')}
                                style={{ 
                                    background: viewMode === '2d' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                                    color: viewMode === '2d' ? 'white' : '#667eea',
                                    border: 'none',
                                    padding: '10px 24px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                📐 2D View
                            </button>
                        </div>
                    </div>
                    <section style={{ flex: 1, background: 'white', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: viewMode === '2d' ? 'flex' : 'none', flexDirection: 'column' }}>
                        <h2 style={{ marginBottom: '10px' }}>2D Plan View</h2>
                        <canvas ref={canvasRef} style={{ border: '1px solid #ccc', borderRadius: '8px', background: '#f5f5f5', width: '100%', height: `calc(100% - ${SECTION_HEADER_HEIGHT})`, display: 'block' }} />
                    </section>
                    <section style={{ flex: 1, background: 'white', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: viewMode === '3d' ? 'flex' : 'none', flexDirection: 'column' }}>
                        <h2 style={{ marginBottom: '10px' }}>3D Preview</h2>
                        <div ref={threeDivRef} style={{ width: '100%', height: `calc(100% - ${SECTION_HEADER_HEIGHT})`, borderRadius: '8px', overflow: 'hidden', cursor: 'grab' }} />
                    </section>
                </main>
            </div>
        </div>
    );
}