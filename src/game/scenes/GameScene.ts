import { Scene } from './Scene';
import { Joystick } from '../Joystick';
import { ImageButton } from '../../components/ImageButton';

export default class GameScene extends Scene {
	private canvas: HTMLCanvasElement | null;
	private context: CanvasRenderingContext2D | null;
	private isRunning: boolean;
	private devicePixelRatio: number;
	private joystick: Joystick | null;
	private pauseButton: ImageButton;

	constructor(game: any) {
		super(game, 'gameScene');
		this.canvas = null;
		this.context = null;
		this.isRunning = false; // Scene running state
		this.sceneName = 'gameScene';
		this.devicePixelRatio = window.devicePixelRatio || 1;
		this.joystick = null; // Initialize joystick as null
		this.pauseButton = new ImageButton(10, 30, 32, 32, 'pause1.png', this.pauseGame.bind(this));
	}

	init(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
		this.canvas = canvas;
		this.context = context;
		this.isRunning = true;
		console.log('canvas', this.canvas);

        const joystickSizePercentage = 0.08;
        const baseRadius = Math.min(this.canvas.width, this.canvas.height) * joystickSizePercentage;
        const handleRadius = baseRadius * 0.5;

		// Initialize the joystick within GameScene
		this.joystick = new Joystick(baseRadius, handleRadius);

		// Add event listeners to handle interaction with the joystick
		this.canvas.addEventListener('mousemove', this.handleInteractionMove.bind(this));
		this.canvas.addEventListener('mousedown', this.handleInteractionStart.bind(this));
		this.canvas.addEventListener('mouseup', this.handleInteractionEnd.bind(this));

        this.canvas.addEventListener('touchstart', this.handleInteractionStart.bind(this));
		this.canvas.addEventListener('touchmove', this.handleInteractionMove.bind(this));
		this.canvas.addEventListener('touchend', this.handleInteractionEnd.bind(this));

		this.render();
	}

	private pauseGame() {
		console.log('pausing game');
	}
	private handleInteractionStart(event: MouseEvent | TouchEvent) {
		event.preventDefault(); // Prevents scrolling/zooming on touch devices
		if (!this.canvas || !this.joystick) return;

		const { x, y } = this.getCoordinatesFromEvent(event);

		const heightBoundary = 0.5 * this.canvas.height / this.devicePixelRatio;
		if (y > heightBoundary) {
			this.joystick.activate(x, y);
			this.joystick.startDrag(x, y);
		}
	}

	// Unified event handler for both mouse and touch move
	private handleInteractionMove(event: MouseEvent | TouchEvent) {
		event.preventDefault(); // Prevents scrolling/zooming on touch devices
		if (!this.canvas || !this.joystick) return;

		const { x, y } = this.getCoordinatesFromEvent(event);
		this.joystick.drag(x, y);
	}

	// Unified event handler for both mouse and touch end
	private handleInteractionEnd() {
		if (!this.joystick) return;
		this.joystick.endDrag();
	}

	// Extracts normalized coordinates (x, y) from both mouse and touch events
	private getCoordinatesFromEvent(event: MouseEvent | TouchEvent) {
		let x = 0, y = 0;

		const rect = this.canvas!.getBoundingClientRect();
        const isTouchEvent = typeof TouchEvent !== 'undefined' && event instanceof TouchEvent;

		if (isTouchEvent) {
			const touch = (event as TouchEvent).touches[0] || (event as TouchEvent).changedTouches[0];
			x = (touch.clientX - rect.left) * this.devicePixelRatio;
			y = (touch.clientY - rect.top) * this.devicePixelRatio;
		} else {
			const mouseEvent = event as MouseEvent;
			x = (mouseEvent.clientX - rect.left) * this.devicePixelRatio;
			y = (mouseEvent.clientY - rect.top) * this.devicePixelRatio;
		}

		return { x, y };
	}

	render() {
		if (!this.isRunning || !this.context || !this.canvas) return;

		// Clear the canvas
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.context.fillStyle = '#1ecbe1';
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
		// Draw game title
		this.context.fillStyle = '#FFFFFF';
		this.context.font = '12px Arial';
		this.context.fillText('My Game Title', this.canvas.width / 2 - 100, 100);

		// Draw start button text
		this.context.fillStyle = '#ffffff';
		this.context.font = '12px Arial';
		this.context.fillText("width w/o device pixel:" + this.canvas.width.toString(), this.canvas.width/this.devicePixelRatio - 200, 20);
		this.context.fillText("height w/o device pixel:" + this.canvas.height.toString(), this.canvas.width/this.devicePixelRatio - 200, 60);

		if (this.joystick) {
			this.joystick.render(this.context, this.devicePixelRatio);
		}
		this.pauseButton.render(this.context, this.devicePixelRatio);
	}

	destroy() {
		if (this.canvas) {
			// Remove event listeners when the scene is destroyed
			this.canvas.removeEventListener('mousemove', this.handleInteractionMove.bind(this));
			this.canvas.removeEventListener('mousedown', this.handleInteractionMove.bind(this));
			this.canvas.removeEventListener('mouseup', this.handleInteractionEnd.bind(this));
			this.canvas.removeEventListener('touchstart', this.handleInteractionStart.bind(this));
			this.canvas.removeEventListener('touchmove', this.handleInteractionMove.bind(this));
			this.canvas.removeEventListener('touchend', this.handleInteractionEnd.bind(this));
		}
	}
}
