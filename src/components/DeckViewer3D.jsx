import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './DeckViewer3D.css';

const DeckViewer3D = ({ deckParams }) => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const deckGroupRef = useRef(null);
    const isDragging = useRef(false);
    const previousMousePosition = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a1a1a);
        sceneRef.current = scene;

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            75,
            mountRef.current.clientWidth / mountRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.set(20, 15, 20);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        mountRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        scene.add(directionalLight);

        const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x8b4513, 0.5);
        scene.add(hemisphereLight);

        // Grid helper
        const gridHelper = new THREE.GridHelper(50, 50, 0x444444, 0x222222);
        scene.add(gridHelper);

        // Deck group
        const deckGroup = new THREE.Group();
        scene.add(deckGroup);
        deckGroupRef.current = deckGroup;

        // Mouse controls
        const handleMouseDown = (e) => {
            isDragging.current = true;
            previousMousePosition.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseMove = (e) => {
            if (!isDragging.current) return;

            const deltaX = e.clientX - previousMousePosition.current.x;
            const deltaY = e.clientY - previousMousePosition.current.y;

            deckGroup.rotation.y += deltaX * 0.01;
            deckGroup.rotation.x += deltaY * 0.01;

            previousMousePosition.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseUp = () => {
            isDragging.current = false;
        };

        const handleWheel = (e) => {
            e.preventDefault();
            const zoomSpeed = 0.5;
            camera.position.z += e.deltaY * 0.01 * zoomSpeed;
            camera.position.z = Math.max(10, Math.min(50, camera.position.z));
        };

        renderer.domElement.addEventListener('mousedown', handleMouseDown);
        renderer.domElement.addEventListener('mousemove', handleMouseMove);
        renderer.domElement.addEventListener('mouseup', handleMouseUp);
        renderer.domElement.addEventListener('wheel', handleWheel);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        // Cleanup
        return () => {
            renderer.domElement.removeEventListener('mousedown', handleMouseDown);
            renderer.domElement.removeEventListener('mousemove', handleMouseMove);
            renderer.domElement.removeEventListener('mouseup', handleMouseUp);
            renderer.domElement.removeEventListener('wheel', handleWheel);
            if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    useEffect(() => {
        if (!deckGroupRef.current || !deckParams) return;

        // Clear existing deck - iterate backwards for efficiency
        for (let i = deckGroupRef.current.children.length - 1; i >= 0; i--) {
            deckGroupRef.current.remove(deckGroupRef.current.children[i]);
        }

        const { width, length, height, boardSpacing, boardThickness, color } = deckParams;

        // Create deck surface with individual boards
        const boardWidth = width;
        const totalBoardThickness = boardThickness / 12; // Convert inches to feet
        const totalBoardSpacing = boardSpacing / 12; // Convert inches to feet
        const numBoards = Math.floor(length / (totalBoardThickness + totalBoardSpacing));

        const deckMaterial = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.7,
            metalness: 0.1
        });

        for (let i = 0; i < numBoards; i++) {
            const boardGeometry = new THREE.BoxGeometry(
                boardWidth,
                0.1,
                totalBoardThickness
            );
            const board = new THREE.Mesh(boardGeometry, deckMaterial);
            board.position.set(
                0,
                height,
                -length / 2 + i * (totalBoardThickness + totalBoardSpacing) + totalBoardThickness / 2
            );
            board.castShadow = true;
            board.receiveShadow = true;
            deckGroupRef.current.add(board);
        }

        // Create support posts
        const postMaterial = new THREE.MeshStandardMaterial({
            color: 0x654321,
            roughness: 0.8,
            metalness: 0.0
        });

        const postPositions = [
            [-width / 3, -length / 3],
            [width / 3, -length / 3],
            [-width / 3, length / 3],
            [width / 3, length / 3]
        ];

        postPositions.forEach(([x, z]) => {
            const postGeometry = new THREE.CylinderGeometry(0.3, 0.3, height, 16);
            const post = new THREE.Mesh(postGeometry, postMaterial);
            post.position.set(x, height / 2, z);
            post.castShadow = true;
            post.receiveShadow = true;
            deckGroupRef.current.add(post);
        });

        // Create frame/joists
        const frameMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.7,
            metalness: 0.0
        });

        // Outer frame
        const frameThickness = 0.3;
        const frameHeight = 0.3;

        // Left and right frame
        for (let side of [-1, 1]) {
            const frameGeometry = new THREE.BoxGeometry(frameThickness, frameHeight, length);
            const frame = new THREE.Mesh(frameGeometry, frameMaterial);
            frame.position.set(side * width / 2, height - frameHeight / 2, 0);
            frame.castShadow = true;
            deckGroupRef.current.add(frame);
        }

        // Front and back frame
        for (let side of [-1, 1]) {
            const frameGeometry = new THREE.BoxGeometry(width, frameHeight, frameThickness);
            const frame = new THREE.Mesh(frameGeometry, frameMaterial);
            frame.position.set(0, height - frameHeight / 2, side * length / 2);
            frame.castShadow = true;
            deckGroupRef.current.add(frame);
        }
    }, [deckParams]);

    return <div ref={mountRef} className="deck-viewer-3d" />;
};

export default DeckViewer3D;