export class Button {
	public isHovered: boolean;

	constructor(
		public x: number,
		public y: number,
		public width: number,
		public height: number,
		private text: string,
		private onClick: () => void,
	) {
		this.isHovered = false;
	}

	// Method to render the button
	render(context: CanvasRenderingContext2D) {
		// Draw button with hover effect
		context.fillStyle = this.isHovered ? '#44ff44' : '#ffffff';
		context.fillRect(this.x, this.y, this.width, this.height);

		// Draw button text
		context.fillStyle = '#000000';
		context.font = '12px Arial';
		context.fillText(
			this.text,
			this.x + this.width / 2 - context.measureText(this.text).width / 2,
			this.y + this.height / 2 + 6,
		);
	}

	// Method to check if the mouse is hovering over the button
	handleMouseMove(mouseX: number, mouseY: number, devicePixelRatio: number) {
		this.isHovered =
			mouseX >= this.x * devicePixelRatio &&
			mouseX <= (this.x + this.width) * devicePixelRatio &&
			mouseY >= this.y * devicePixelRatio &&
			mouseY <= (this.y + this.height) * devicePixelRatio;
	}

	// Method to handle button click
	handleClick(mouseX: number, mouseY: number, devicePixelRatio: number) {
		if (
			mouseX >= this.x * devicePixelRatio &&
			mouseX <= (this.x + this.width) * devicePixelRatio &&
			mouseY >= this.y * devicePixelRatio &&
			mouseY <= (this.y + this.height) * devicePixelRatio
		) {
			this.onClick();
		}
	}
}
