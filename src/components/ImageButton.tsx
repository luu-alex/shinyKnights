export class ImageButton {
	public isHovered: boolean;
	private image: HTMLImageElement;

	constructor(
		public x: number,
		public y: number,
		public width: number,
		public height: number,
		imageSrc: string,
		private onClick: () => void,
	) {
		this.isHovered = false;
		this.image = new Image();
		this.image.src = imageSrc;
	}

	// Method to render the button
	render(context: CanvasRenderingContext2D, devicePixelRatio: number) {
		// Draw the image button
		context.drawImage(this.image, this.x, this.y, this.width, this.height);

		// Draw hover effect
		if (this.isHovered) {
			context.strokeStyle = '#44ff44';
			context.lineWidth = 5;
			context.strokeRect(
				this.x * devicePixelRatio,
				this.y * devicePixelRatio,
				this.width * devicePixelRatio,
				this.height * devicePixelRatio,
			);
		}
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
