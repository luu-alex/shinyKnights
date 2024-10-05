export class Joystick {
	private baseX: number;
	private baseY: number;
	private handleX: number;
	private handleY: number;
	private baseRadius: number;
	private handleRadius: number;
	private isDragging: boolean;
	private active: boolean; // New flag to indicate if the joystick is active

	constructor(baseRadius: number, handleRadius: number) {
		this.baseX = 0;
		this.baseY = 0;
		this.baseRadius = baseRadius;
		this.handleRadius = handleRadius;
		this.handleX = this.baseX;
		this.handleY = this.baseY;
		this.isDragging = false;
		this.active = false; // Joystick starts as inactive
	}

	// Set the base position and activate the joystick
	activate(x: number, y: number) {
		this.baseX = x;
		this.baseY = y;
		this.handleX = x;
		this.handleY = y;
		this.active = true;
	}

	// Deactivate the joystick
	deactivate() {
		this.active = false;
		this.isDragging = false;
	}

	// Method to render the joystick
	render(context: CanvasRenderingContext2D, devicePixelRatio: number) {
		if (!this.active) return; // Only render if the joystick is active

		// Draw the joystick base
		context.beginPath();
		context.arc(
			this.baseX / devicePixelRatio,
			this.baseY / devicePixelRatio,
			this.baseRadius,
			0,
			Math.PI * 2,
		);
		context.fillStyle = 'rgba(0, 0, 0, 0.3)';
		context.fill();

		// Draw the joystick handle
		context.beginPath();
		context.arc(
			this.handleX / devicePixelRatio,
			this.handleY / devicePixelRatio,
			this.handleRadius,
			0,
			Math.PI * 2,
		);
		context.fillStyle = 'rgba(0, 0, 0, 0.7)';
		context.fill();
	}

	// Method to handle mouse/touch start
	startDrag(x: number, y: number) {
		const dist = Math.hypot(x - this.handleX, y - this.handleY);
		if (dist <= this.handleRadius) {
			this.isDragging = true;
		}
	}

	// Method to handle mouse/touch movement
	drag(x: number, y: number) {
		if (!this.isDragging) return;

		// Calculate the distance from the base to the touch/mouse position
		const dist = Math.hypot(x - this.baseX, y - this.baseY);
		const maxDist = this.baseRadius;

		// Calculate the new handle position within the base's boundaries
		if (dist < maxDist) {
			this.handleX = x;
			this.handleY = y;
		} else {
			const angle = Math.atan2(y - this.baseY, x - this.baseX);
			this.handleX = this.baseX + Math.cos(angle) * maxDist;
			this.handleY = this.baseY + Math.sin(angle) * maxDist;
		}
	}

	// Method to handle mouse/touch end
	endDrag() {
		this.isDragging = false;
		this.deactivate(); // Optionally deactivate joystick on release
	}

	// Method to calculate the joystick direction
	getDirection(): { x: number; y: number } {
		const directionX = (this.handleX - this.baseX) / this.baseRadius;
		const directionY = (this.handleY - this.baseY) / this.baseRadius;
		return { x: directionX, y: directionY };
	}
}
