export default class Sprite {
    private image: HTMLImageElement;
    public frameWidth: number;
    public frameHeight: number;
    private currentFrame: number;
    private totalFrames: number;
    private frameDuration: number;
    private elapsedTime: number;
    private row: number;
    private column: number;

    constructor(
        imageSrc: string,
        frameWidth: number,
        frameHeight: number,
        totalFrames: number,
        frameDuration: number, // Duration of each frame in milliseconds
        row:number = 0,
        column: number = 0
    ) {
        this.image = new Image();
        this.image.src = imageSrc;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.currentFrame = 0;
        this.totalFrames = totalFrames;
        this.frameDuration = frameDuration;
        this.elapsedTime = 0;
        this.row = row;
        this.column = column;
    }

    // Update the sprite's frame based on the elapsed time
    update() {
        const now = Date.now();

        while (now - this.elapsedTime >= this.frameDuration) {
            this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
            this.elapsedTime = now; // Subtract the frame duration instead of resetting to 0
        }
    }

    // Render the current frame of the sprite on the canvas
    render(context: CanvasRenderingContext2D, x: number, y: number, scale = 1) {
        context.imageSmoothingEnabled = false;
        const sourceX = this.currentFrame * (this.frameWidth) + (this.column * this.totalFrames); // Adjust for column

        // Apply scaling by multiplying the frame width and height by the scale factor
        const scaledWidth = this.frameWidth * scale;
        const scaledHeight = this.frameHeight * scale;

        context.drawImage(
            this.image,
            sourceX, this.frameHeight*this.row, // Source x, y
            this.frameWidth, this.frameHeight, // Source width, height
            x, y, // Destination x, y
            scaledWidth, scaledHeight // Destination width, height
        );
    }

    public isLastFrame() {
        return this.currentFrame === this.totalFrames - 1;
    }
}
