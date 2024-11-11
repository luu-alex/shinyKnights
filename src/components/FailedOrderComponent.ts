
import { darkerGreenBackground, lighterGreenBackground, primaryColorBackground } from "../game/colors";
import { drawRoundedBox, wrapText } from "../game/utils";
import { Button } from "./Button";

export class FailedOrderComponent {
    private canvasWidth: number;
    private canvasHeight: number;
    public isVisible: boolean;
    public exitButton: Button;

    constructor(canvasWidth: number, canvasHeight: number) {
        this.isVisible = false;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.exitButton = new Button(canvasWidth * 0.4, canvasHeight * 0.72, canvasWidth * 0.25, canvasHeight * 0.05, "Exit", this.hide.bind(this), darkerGreenBackground, this.canvasHeight * 0.03, "white");
    }

    render(context: CanvasRenderingContext2D) {
        drawRoundedBox(context, this.canvasWidth * 0.1, this.canvasHeight * 0.2, this.canvasWidth * 0.8, this.canvasHeight * 0.6, 5, primaryColorBackground);
        drawRoundedBox(context, this.canvasWidth * 0.15, this.canvasHeight * 0.3, this.canvasWidth * 0.7, this.canvasHeight * 0.4, 3, lighterGreenBackground, 3);
        let fontSize = this.canvasHeight * 0.035;
        context.font = `${fontSize}px depixel`;
        context.fillStyle = 'white';
        const text = "Verification Failed";
        const textWidth = context.measureText(text).width;
        const textX = (this.canvasWidth - textWidth) / 2;
        context.fillText(text, textX, this.canvasHeight * 0.25);

        const descriptionPurchase = "Unable to process order, if you have purchased, please wait and try again";
        const lines = wrapText(context, descriptionPurchase, this.canvasWidth * 0.85);
        // Render each line of the description
        context.fillStyle = "white";
        context.font = `${this.canvasHeight * 0.025}px depixel`;

        for (let i = 0; i < lines.length; i++) {
            context.fillText(lines[i], this.canvasWidth * 0.17, this.canvasHeight * 0.31 + this.canvasHeight * 0.025 * (i + 1));
        }

        this.exitButton.render(context);


    }
    show() {
        this.isVisible = true;
    }
    hide() {
        this.isVisible = false;
    }
}
