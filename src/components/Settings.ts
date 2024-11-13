import { primaryColorBackground, darkGreenText, lighterGreenBackground } from "../game/colors";
import { drawCenteredText, drawRoundedBox } from "../game/utils";
import { ImageButton } from "./ImageButton";
export class Settings {
    public isVisible: boolean;
    private canvasWidth: number;
    private canvasHeight: number;
    public exitButton: ImageButton;
    public homeButton: ImageButton;
    private handleExit: () => void;
    private title: string;
    constructor(canvasWidth: number, canvasHeight: number, title: string = 'Settings', homeFN: () => void, handleExit: () => void) {
        this.isVisible = false;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.title = title;
        this.exitButton = new ImageButton(0.8, 0.15, 0.1, 0.06, 'ui/closeIcon.png', this.hide.bind(this));
        this.handleExit = handleExit;
        
        this.homeButton = new ImageButton(0.425, 0.6, 0.1, 0.06, 'ui/homeIcon.png', homeFN.bind(this));
    }
    render(context: CanvasRenderingContext2D) {
        // Draw the settings box
        drawRoundedBox(context, this.canvasWidth * 0.1, this.canvasHeight * 0.15, this.canvasWidth * 0.8, this.canvasHeight * 0.6, 5, primaryColorBackground);
        drawRoundedBox(context, this.canvasWidth * 0.2, this.canvasHeight * 0.3, this.canvasWidth * 0.6, this.canvasHeight * 0.2, 5, lighterGreenBackground);
        drawRoundedBox(context, this.canvasWidth * 0.2, this.canvasHeight * 0.3, this.canvasWidth * 0.6, this.canvasHeight * 0.1, 5, lighterGreenBackground);
        context.fillStyle = "white";
        drawCenteredText(context, "Sound", this.canvasWidth * 0.35, this.canvasHeight * 0.365);
        drawCenteredText(context, "Music", this.canvasWidth * 0.35, this.canvasHeight * 0.46);
        
        this.drawToggleCircle(context, this.canvasWidth * 0.72, this.canvasHeight * 0.35, true);
        this.drawToggleCircle(context, this.canvasWidth * 0.72, this.canvasHeight * 0.45, true);

        
        // Draw exit button
        this.exitButton.render(context, this.canvasWidth, this.canvasHeight);
        if (this.title === "Paused") 
        this.homeButton.render(context, this.canvasWidth, this.canvasHeight);
        
        context.fillStyle = darkGreenText;
        context.font = `${this.canvasHeight*0.05}px depixel`;
        const textWidth = context.measureText(this.title).width;

        // Calculate the x position to center the text within the box

        const boxX = this.canvasWidth * 0.1;
        const boxWidth = this.canvasWidth * 0.8;
        const textX = boxX + (boxWidth - textWidth) / 2;

        // Draw the title centered horizontally
        context.fillText(this.title, textX, this.canvasHeight * 0.25);
    }
    public show() {
        this.isVisible = true;
    }
    private drawToggleCircle(context: CanvasRenderingContext2D, x: number, y: number, isOn: boolean) {
        const radius = this.canvasHeight * 0.02;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fillStyle = isOn ? primaryColorBackground : "transparent"; // Filled for "On" state
        context.fill();
        context.strokeStyle = "white";
        context.lineWidth = 2;
        context.stroke();
    }

    // Hide the shop
    public hide() {
        this.isVisible = false;
        if (this.title === "Settings") {
            this.handleExit();
        }
    }
};