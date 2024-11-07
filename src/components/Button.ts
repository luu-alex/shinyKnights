import '../game/fonts/fonts.module.css';
export class Button {
	public isHovered: boolean;
	private color: string;
	private fontSize: number;
	private fontColor = 'white';

	constructor(
		public x: number,
		public y: number,
		public width: number,
		public height: number,
		public text: string,
		private onClick: () => void,
		color: string,
		fontSize: number,
		fontColor?: string,
	) {
		this.isHovered = false;
		this.color = color;
		this.fontSize = fontSize;
		if (fontColor) {
			this.fontColor = fontColor;
		}
	}

	// Method to render the button
	render(context: CanvasRenderingContext2D) {
		// debug
		// console.log("this.x", this.x)
		// console.log("this.y", this.y)
        // Draw the button rectangle
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
        context.fillStyle = 'white';


		context.fillStyle = this.color; // Blue button for continuing
        context.fillRect(this.x, this.y, this.width, this.height);

        context.shadowBlur = 0;  // Disable shadow for the outline
        context.strokeStyle = 'black';
        context.lineWidth = 3;  // Make the outline thick
        context.strokeRect(this.x, this.y, this.width, this.height);


        context.shadowBlur = 0;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;


        // Draw the button text
        context.fillStyle = this.fontColor;
        context.font = `${this.fontSize}px depixel`;

        const textWidth = context.measureText(this.text).width;
        const textX = this.x + (this.width - textWidth) / 2;
        const textY = this.y + (this.height / 2) + (this.height * 0.15);
        context.fillText(this.text, textX, textY,);
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
