import { primaryColorBackground, darkGreenText, blueBackground, lighterGreenBackground } from "../game/colors";
import { drawCenteredText, drawRoundedBox, wrapText } from "../game/utils";
import { Button } from "./Button";
export class GameOverComponent {
    public isVisible: boolean;
    private canvasWidth: number;
    private canvasHeight: number;
    private handleExit: () => void;
    public title: string;
    private wave: number = 0;
    private continueButton: Button;
    public description: string = "You have been defeated by the enemy."

    constructor(canvasWidth: number, canvasHeight: number, title: string = 'Settings', homeFN: () => void, _: () => void) {
        this.isVisible = false;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.title = title;
        this.handleExit = homeFN;
        this.continueButton = new Button(
            canvasWidth * 0.2,
            canvasHeight * 0.675,
            canvasWidth * 0.6,
            canvasHeight * 0.1,
            "Continue",
            homeFN,
            blueBackground,
            canvasHeight * 0.04,
            "black",
        )
        
        // this.homeButton = new ImageButton(0.425, 0.7, 0.1, 0.06, 'ui/homeIcon.png', homeFN.bind(this));
    }
    render(context: CanvasRenderingContext2D) {
        // Draw the settings box
        drawRoundedBox(context, this.canvasWidth * 0.1, this.canvasHeight * 0.2, this.canvasWidth * 0.8, this.canvasHeight * 0.6, 5, primaryColorBackground);
        
        context.fillStyle = darkGreenText;
        context.font = `${this.canvasHeight*0.05}px depixel`;
        const textWidth = context.measureText(this.title).width;

        // Calculate the x position to center the text within the box

        const boxX = this.canvasWidth * 0.1;
        const boxWidth = this.canvasWidth * 0.8;
        const textX = boxX + (boxWidth - textWidth) / 2;

        // Draw the title centered horizontally
        context.fillText(this.title, textX, this.canvasHeight * 0.25);
        this.continueButton.render(context);
        // draw wave
        // drawRoundedBox(context, this.canvasWidth * 0.15, this.canvasHeight * 0.3, this.canvasWidth * 0.7, this.canvasHeight * 0.03, 5, lighterGreenBackground, 3 , false, 1, true);
        context.fillStyle = "white";
        drawCenteredText(context, "Wave " + this.wave, this.canvasWidth * 0.5, this.canvasHeight * 0.33)
        drawRoundedBox(context, this.canvasWidth * 0.15, this.canvasHeight * 0.35, this.canvasWidth * 0.7, this.canvasHeight * 0.3, 5, lighterGreenBackground, 3 , false, 1, true);

        context.font = `${this.canvasHeight*0.025}px depixel`;
        context.fillStyle = "white";
        
        const linesVerify = wrapText(context, this.description + " You have reached wave " + this.wave + ". You have gained " + this.wave*100 + " gold. " + "and " + this.wave * 3 + " experience.", this.canvasWidth * 0.7);
        for (let i = 0; i < linesVerify.length; i++) {
            context.fillText(linesVerify[i], this.canvasWidth * 0.17, this.canvasHeight * 0.35 + this.canvasHeight * 0.025 * (i + 1));
        }
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
    updateWave(wave: number) {
        this.wave = wave;
    }
    handleClick(x: number, y: number, devicePixelRatio: number) {
        this.continueButton.handleClick(x, y, devicePixelRatio);
    }
};