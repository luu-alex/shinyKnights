import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import MenuScene from './scenes/MenuScene';
// import GameScene from './scenes/GameScene';
import WebApp from '@twa-dev/sdk';
import { TonConnectButton, useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';
import { SceneManager } from './scenes/SceneManager';
// move to gamescene later

const CanvasGame: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null); // Create a ref to the DOM element where context canvas will mount
	const heightRef = useRef<number>(0);
	const widthRef = useRef<number>(0);
	const initdataRef = useRef<string>();
	const wallet = useTonWallet();
	const sceneManagerRef = useRef<SceneManager>(new SceneManager());
    const [ currentScene, setCurrentScene ] = useState<string>('');
	const [tonConnectUI, _] = useTonConnectUI();
	const lastTimeRef = useRef<number>(0); // Use ref for tracking last frame time
    const canvasDimensions = useRef<{width: number, height: number}>({width:0, height: 0});
    
	const fetchData = async () => {
		const result = await axios.get('/api/data');
		console.log(result.data);
	};
	const transaction = {
		messages: [
			{
				address: '0:412410771DA82CBA306A55FA9E0D43C9D245E38133CB58F1457DFB8D5CD8892F', // destination address
				amount: '20000000', //Toncoin in nanotons
			},
		],
		validUntil: Math.floor(Date.now() / 1000) + 3600, // 1 hour
	};
	if (wallet) {
	}

	useEffect(() => {
		// const scale = (context: CanvasRenderingContext2D) => {
		initdataRef.current = WebApp.initDataUnsafe.user?.username;

		// }

		const webHeight = WebApp.viewportStableHeight;
		heightRef.current = webHeight;

		if (canvasRef.current) {
			const canvas = canvasRef.current as HTMLCanvasElement;
			const context = canvas.getContext('2d');

			if (context) {
				const devicePixelRatio = window.devicePixelRatio || 1;
				const canvas = canvasRef.current as HTMLCanvasElement;

				const viewportWidth = window.innerWidth;
				const viewportHeight = window.innerHeight;
				console.log('viewport height', viewportHeight);
				console.log('viewport width', viewportWidth);

				const aspectRatio = 9 / 16;

				let newCanvasWidth: number, newCanvasHeight: number;
				if (viewportWidth / viewportHeight > aspectRatio) {
					newCanvasWidth = viewportHeight * aspectRatio;
					newCanvasHeight = viewportHeight;
				} else {
					newCanvasWidth = viewportWidth;
					newCanvasHeight = viewportWidth / aspectRatio;
				}
				console.log('new canvas sizes:', newCanvasWidth, newCanvasHeight);
				
				

				canvas.style.width = `${newCanvasWidth}px`;
				canvas.style.height = `${newCanvasHeight}px`;

				canvas.width = newCanvasWidth * devicePixelRatio;
				canvas.height = newCanvasHeight * devicePixelRatio;

				widthRef.current = canvas.width;

				context.scale(devicePixelRatio, devicePixelRatio);
				console.log("width",canvas.width)

				// const canvasRect = canvas.getBoundingClientRect();
				canvasDimensions.current = {
					width: newCanvasWidth,
					height: newCanvasHeight,
				}

				const menuScene = new MenuScene(sceneManagerRef.current);
                sceneManagerRef.current.changeScene(menuScene, canvas, context);

				// Update the current scene state
				setCurrentScene(menuScene.sceneName);

                // const fixedDeltaTime = 1 / 120; // Fixed time step of 60 FPS

				// Animation loop to continuously render the current scene
				const animationLoop = (time: number) => {
                    if (lastTimeRef.current === 0) {
                        lastTimeRef.current = time;
                    }
                    const delta = (time - lastTimeRef.current) / 1000; // delta time in seconds
					lastTimeRef.current = time;

					context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
                    if (sceneManagerRef.current.currentScene) {
                        // Update the game logic with a fixed time step
                            sceneManagerRef.current.currentScene.update(delta);
					}
                    if (sceneManagerRef.current.currentScene && sceneManagerRef.current.currentScene.sceneName !== currentScene) {
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
			}
		}
	}, []);
	return (
		<div>
            {sceneManagerRef.current.currentScene && sceneManagerRef.current.currentScene.sceneName === 'MenuScene' ?
				<TonConnectButton
					style={{
						position: 'absolute',
						top: canvasDimensions.current.height * 0.1, // Adjust relative to the canvas top position
						left:  canvasDimensions.current.width * 0.90 - 165, // Adjust relative to the canvas left position
					}}
				/>: <></>
            }
			{/* Wallet: {wallet ? <div>wallet.account </div>: ''} */}
			<canvas ref={canvasRef} />
			<button onClick={() => tonConnectUI.sendTransaction(transaction)}>Send transaction</button>
			<button onClick={fetchData}> API </button>
			<div>Init data: {initdataRef.current}</div>
		</div>
	);
};

export default CanvasGame;
