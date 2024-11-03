import { primaryColorBackground, darkGreenText } from "../game/colors";
import { drawRoundedBox } from "../game/utils";
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
        this.exitButton = new ImageButton(0.8, 0.21, 0.1, 0.06, 'ui/closeIcon.png', this.hide.bind(this));
        this.handleExit = handleExit;
        
        this.homeButton = new ImageButton(0.425, 0.7, 0.1, 0.06, 'ui/homeIcon.png', homeFN.bind(this));
    }
    render(context: CanvasRenderingContext2D) {
        // Draw the settings box
        drawRoundedBox(context, this.canvasWidth * 0.1, this.canvasHeight * 0.2, this.canvasWidth * 0.8, this.canvasHeight * 0.6, 5, primaryColorBackground);
        // Draw exit button
        this.exitButton.render(context, this.canvasWidth, this.canvasHeight);
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

    // Hide the shop
    public hide() {
        this.isVisible = false;
        if (this.title === "Settings") {
            this.handleExit();
        }
    }
};