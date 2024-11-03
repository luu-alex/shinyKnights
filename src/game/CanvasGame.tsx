import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import MenuScene from './scenes/MenuScene';
import WebApp from '@twa-dev/sdk';
import { useTonConnectUI, THEME } from '@tonconnect/ui-react';
import { SceneManager } from './scenes/SceneManager';
import { lighterGreenBackground } from './colors';
// import { updateProfile } from '../api/serverCalls';
const serverURL = import.meta.env.VITE_SERVER_URL || "http://localhost:5001";
// console.log("server url ", serverURL);
// const localURL = "http://localhost:5001"

const CanvasGame: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null); // Create a ref to the DOM element where context canvas will mount
	const heightRef = useRef<number>(0);
	const widthRef = useRef<number>(0);
	// const wallet = useTonWallet();
	const sceneManagerRef = useRef<SceneManager>(new SceneManager());
	const menuSceneRef = useRef<MenuScene | null>(null); // Ref to store MenuScene instance
	const [currentScene, setCurrentScene] = useState<string>('');
	const [tonConnectUI, _] = useTonConnectUI();
	const lastTimeRef = useRef<number>(0); // Use ref for tracking last frame time
	const canvasDimensions = useRef<{ width: number, height: number }>({ width: 0, height: 0 });

	const initdataRef = useRef<string>();
	const userNameRef = useRef<string>();
	const [profile, setProfile] = useState<any>(null); // profile state
	

	const fetchOrCreateProfile = async () => {
		try {
			console.log(userNameRef.current)
			const response = await axios.post(serverURL + '/api/profile', { username: userNameRef.current });
			setProfile(response.data); // Set the profile data
			console.log(response.data)
		} catch (err) {
			console.error('Error fetching or creating profile.', err);
		}
	};

	useEffect(() => {
		// Set or update TonConnect UI options dynamically
		tonConnectUI.uiOptions = {
			uiPreferences: {
				theme: THEME.DARK, // Use dark theme, you can also use 'SYSTEM'
				borderRadius: 's', // Small border radius,
				colorsSet: {
					[THEME.DARK]: {
						connectButton: {
							background: lighterGreenBackground, // Custom background color for dark theme,
						},
					},
					[THEME.LIGHT]: {
						connectButton: {
							background: '#FF5722', // Custom background color for light theme
						},
					},
				},
			},
		};
	}, [tonConnectUI]);

	// Fetch profile when the component mounts
	useEffect(() => {
		initdataRef.current = WebApp.initDataUnsafe.user?.username;
		userNameRef.current = initdataRef.current ? initdataRef.current : 'user1';
		fetchOrCreateProfile();
	}, []); // Runs only once on mount

	// Initialize the game once, when the profile is loaded and canvas is available
	useEffect(() => {
		if (!profile || !canvasRef.current) return; // Wait for profile and canvas to load

		const webHeight = WebApp.viewportStableHeight;
		heightRef.current = webHeight;

		const canvas = canvasRef.current as HTMLCanvasElement;
		const context = canvas.getContext('2d');

		if (context) {
			const devicePixelRatio = window.devicePixelRatio || 1;

			const viewportWidth = window.innerWidth;
			const viewportHeight = window.innerHeight;

			const aspectRatio = 9 / 16;

			let newCanvasWidth: number, newCanvasHeight: number;
			if (viewportWidth / viewportHeight > aspectRatio) {
				newCanvasWidth = viewportHeight * aspectRatio;
				newCanvasHeight = viewportHeight;
			} else {
				newCanvasWidth = viewportWidth;
				newCanvasHeight = viewportWidth / aspectRatio;
			}

			canvas.style.width = `${newCanvasWidth}px`;
			canvas.style.height = `${newCanvasHeight}px`;

			canvas.width = newCanvasWidth * devicePixelRatio;
			canvas.height = newCanvasHeight * devicePixelRatio;

			widthRef.current = canvas.width;

			context.scale(devicePixelRatio, devicePixelRatio);

			canvasDimensions.current = {
				width: newCanvasWidth,
				height: newCanvasHeight,
			};

			// Initialize MenuScene only once
			if (!menuSceneRef.current) {
				const menuScene = new MenuScene(sceneManagerRef.current);
				menuSceneRef.current = menuScene;
				sceneManagerRef.current.changeScene(menuScene, canvas, context);
				setCurrentScene(menuScene.sceneName);
			}
		}
	}, [profile]); // Run only when profile is loaded

	// Update the menuScene's properties when profile updates (don't recreate the scene)
	useEffect(() => {
		if (menuSceneRef.current && profile) {
			menuSceneRef.current.gems = profile.gems;
			menuSceneRef.current.coins = profile.coins;
			menuSceneRef.current.level = profile.level;
			menuSceneRef.current.username = profile.username;
		}
	}, [profile]);

	// Animation loop
	useEffect(() => {
		if (!canvasRef.current || !menuSceneRef.current) return;

		const canvas = canvasRef.current as HTMLCanvasElement;
		const context = canvas.getContext('2d');

		const animationLoop = (time: number) => {
			if (lastTimeRef.current === 0) {
				lastTimeRef.current = time;
			}
			const delta = (time - lastTimeRef.current) / 1000; // delta time in seconds
			lastTimeRef.current = time;

			context?.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

			if (sceneManagerRef.current.currentScene) {
				// Update the game logic with a fixed time step
				sceneManagerRef.current.currentScene.update(delta);
			}
			if (
				sceneManagerRef.current.currentScene &&
				sceneManagerRef.current.currentScene.sceneName !== currentScene
			) {
				setCurrentScene(sceneManagerRef.current.currentScene.sceneName);
			}
			sceneManagerRef.current.render(); // Render the current scene

			requestAnimationFrame(animationLoop); // Continue the animation loop
		};

		requestAnimationFrame(animationLoop); // Start the animation loop

		// Cleanup on component unmount
		return () => {
			sceneManagerRef.current.currentScene?.destroy();
		};
	}, [currentScene]);

	return (
		<div>
			{/* If the profile is still loading, display loading message */}
			{!profile ? <div>Loading profile...</div> : null}
			<canvas ref={canvasRef} />
		</div>
	);
};

export default CanvasGame;
