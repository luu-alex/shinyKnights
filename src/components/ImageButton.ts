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

    // Method to render the button with scaling support
    render(context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
        // Adjust width, height, x, and y based on the canvas size to make it responsive
        const scaledX = this.x * canvasWidth;
        const scaledY = this.y * canvasHeight;
        const scaledWidth = this.width * canvasWidth;
        const scaledHeight = this.height * canvasHeight;

        // Draw the image button
        context.drawImage(this.image, scaledX, scaledY, scaledWidth, scaledHeight);

        // Draw hover effect
        if (this.isHovered) {
            context.strokeStyle = '#44ff44';
            context.lineWidth = 5;
            context.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
        }
    }

    // Method to check if the mouse is hovering over the button
    handleMouseMove(mouseX: number, mouseY: number, canvasWidth: number, canvasHeight: number) {
        const scaledX = this.x * canvasWidth;
        const scaledY = this.y * canvasHeight;
        const scaledWidth = this.width * canvasWidth;
        const scaledHeight = this.height * canvasHeight;

        this.isHovered =
            mouseX >= scaledX &&
            mouseX <= scaledX + scaledWidth &&
            mouseY >= scaledY &&
            mouseY <= scaledY + scaledHeight;
    }

    // Method to handle button click
    handleClick(mouseX: number, mouseY: number, canvasWidth: number, canvasHeight: number) {
        
        const scaledX = this.x * canvasWidth;
        const scaledY = this.y * canvasHeight;
        const scaledWidth = this.width * canvasWidth;
        const scaledHeight = this.height * canvasHeight;
        if (
            mouseX >= scaledX &&
            mouseX <= scaledX + scaledWidth &&
            mouseY >= scaledY &&
            mouseY <= scaledY + scaledHeight
        ) {
            this.onClick();
        }
    }
}
