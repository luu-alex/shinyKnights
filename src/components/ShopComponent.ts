import { blueBackground, darkBlueText, darkerGreenBackground, lighterGreenBackground, primaryColorBackground } from "../game/colors";
import { drawRoundedBox } from "../game/utils";

export class ShopComponent {
    private canvasWidth: number;
    private canvasHeight: number;
    private scrollY: number;  // Current scroll position
    private maxScrollY: number;  // Maximum scroll position
    private lastTouchY: number | null = null;  // Last touch position

    constructor(canvasWidth: number, canvasHeight: number) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.scrollY = 0;  // Start at the top
        this.maxScrollY = 10000;  // Will be calculated based on content height
    }

    // Handle touch start to record the initial touch position
    handleTouchStart(event: TouchEvent) {
        const touch = event.touches[0];  // Get the first touch point
        this.lastTouchY = touch.clientY;  // Store the initial Y position
    }

    // Handle touch move to scroll
    handleTouchMove(event: TouchEvent) {
        if (this.lastTouchY === null) return;  // Ensure we have a valid touch position

        const touch = event.touches[0];
        const deltaY = touch.clientY - this.lastTouchY;  // Calculate the distance moved

        this.scrollY = Math.min(this.maxScrollY, Math.max(0, this.scrollY - deltaY));  // Adjust scroll position
        this.lastTouchY = touch.clientY;  // Update the last touch position
    }
    handleScroll(deltaY: number) {
        const scrollAmount = deltaY * 0.5;  // Adjust scrolling speed
        this.scrollY = Math.min(this.maxScrollY, Math.max(0, this.scrollY + scrollAmount));
    }

    // Handle touch end (clear last touch position)
    handleTouchEnd() {
        this.lastTouchY = null;  // Reset when touch ends
    }

    render(context: CanvasRenderingContext2D) {
        // Clear the canvas before rendering
        context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        context.fillStyle = blueBackground;
        context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        // Save the current context state
        context.save();

        // Translate the context based on the current scroll position
        context.translate(0, -this.scrollY);

        // Render shop content
        context.fillStyle = darkBlueText;
        context.font = `${this.canvasHeight * 0.05}px depixel`;

        const title = "Shop Deals";
        const textMetrics = context.measureText(title);
        const textWidth = textMetrics.width;
        const boxX = this.canvasWidth * 0.05;
        const boxWidth = this.canvasWidth * 0.9;
        const centeredX = boxX + (boxWidth - textWidth) / 2;

        // Render the centered text
        context.fillText(title, centeredX, this.canvasHeight * 0.2);

        // Render special deals box
        drawRoundedBox(context, this.canvasWidth * 0.05, this.canvasHeight * 0.25, this.canvasWidth * 0.9, this.canvasHeight * 0.35, 7, primaryColorBackground, 3);

        // Render sub-title
        context.fillStyle = darkBlueText;
        context.font = `${this.canvasHeight * 0.04}px depixel`;
        const title2 = "Special Deals";
        const textMetrics2 = context.measureText(title2);
        const textWidth2 = textMetrics2.width;
        const boxX2 = this.canvasWidth * 0.1;
        const boxWidth2 = this.canvasWidth * 0.8;
        const centeredX2 = boxX2 + (boxWidth2 - textWidth2) / 2;
        context.fillText(title2, centeredX2, this.canvasHeight * 0.3);

        // Render three boxes for special deals
        for (let i = 0; i < 3; i++) {
            drawRoundedBox(context, this.canvasWidth * 0.1 + i * this.canvasWidth * 0.28, this.canvasHeight * 0.33, this.canvasWidth * 0.25, this.canvasHeight * 0.22, 3, lighterGreenBackground, 1);
            drawRoundedBox(context, this.canvasWidth * 0.12 + i * this.canvasWidth * 0.28, this.canvasHeight * 0.34, this.canvasWidth * 0.21, this.canvasHeight * 0.15, 1, darkerGreenBackground, 0);
        }

        // Calculate total content height and max scroll limit
        const contentHeight = this.canvasHeight * 1.2;  // Example content height (bigger than canvas)
        this.maxScrollY = Math.max(0, contentHeight - this.canvasHeight);

        // Restore the context (undo the translation)
        context.restore();
    }
}
