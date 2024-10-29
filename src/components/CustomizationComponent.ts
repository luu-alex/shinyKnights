import { customizeBackground, darkBlueText, darkBrownBackground, primaryBrownBackground } from "../game/colors";
import { drawRoundedBox } from "../game/utils";
import { Button } from "./Button";

export class CustomizationComponent {
    private canvasWidth;
    private canvasHeight;
    private choosePlayerButton: Button | null = null;
    private choosePetButton: Button | null = null;
    constructor(canvasWidth: number, canvasHeight: number) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.choosePlayerButton = new Button(
            this.canvasWidth * 0.05,
            this.canvasHeight * 0.54,
            this.canvasWidth * 0.45,
            this.canvasHeight * 0.055,
            "Characters",
            () => {
                console.log("Choose Player");
            },
            darkBrownBackground,
            this.canvasHeight * 0.03
        );
        this.choosePetButton = new Button(
            this.canvasWidth * 0.5,
            this.canvasHeight * 0.54,
            this.canvasWidth * 0.45,
            this.canvasHeight * 0.055,
            "Pets",
            () => {
                console.log("Choose Player");
            },
            primaryBrownBackground,
            this.canvasHeight * 0.03
        );
    }
    render(context: CanvasRenderingContext2D) {
        // Set the font and style for the coin text
        context.fillStyle = darkBlueText;
        context.font = `${this.canvasHeight * 0.06}px depixel`;
    
        // Measure the width of the coin text
        const title = "Customization";
        const textMetrics = context.measureText(title);
        const textWidth = textMetrics.width;
    
        // Calculate the X position to center the text within the box
        const boxX = this.canvasWidth * 0.05;
        const boxWidth = this.canvasWidth * 0.9;
        const centeredX = boxX + (boxWidth - textWidth) / 2;
    
        // Render the centered text
        context.fillText(title, centeredX, this.canvasHeight * 0.16);

        drawRoundedBox(context, this.canvasWidth * 0.05, this.canvasHeight * 0.2, this.canvasWidth * 0.9, this.canvasHeight * 0.3, 7, "white", 10);

        context.fillStyle = customizeBackground;
        context.fillRect(this.canvasWidth * 0.05, this.canvasHeight * 0.2, this.canvasWidth * 0.9, this.canvasHeight * 0.3);

        context.fillStyle = primaryBrownBackground;
        context.fillRect(this.canvasWidth * 0.00, this.canvasHeight * 0.52, this.canvasWidth, this.canvasHeight * 0.6);

        // draw a black line
        context.strokeStyle = "black";
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(this.canvasWidth * 0.00, this.canvasHeight * 0.52);
        context.lineTo(this.canvasWidth, this.canvasHeight * 0.52);
        context.stroke();

        this.choosePlayerButton?.render(context);
        this.choosePetButton?.render(context);

        // draw perfect squares
        const squareSize = Math.min(this.canvasWidth, this.canvasHeight) * 0.17;
        // fit five squares in the canvas
        for (let i = 0; i < 5; i++) {
            drawRoundedBox(context, this.canvasWidth * 0.05 + (squareSize * i) + i * this.canvasWidth * 0.01, this.canvasHeight * 0.62, squareSize, squareSize, 10, darkBrownBackground, 2);
            drawRoundedBox(context, this.canvasWidth * 0.05 + (squareSize * i) + i * this.canvasWidth * 0.01, this.canvasHeight * 0.62 + squareSize + this.canvasHeight * 0.02, squareSize, squareSize, 10, darkBrownBackground, 2);
        }
        // drawRoundedBox(context, this.canvasWidth * 0.05, this.canvasHeight * 0.62, squareSize, squareSize, 10, primaryBrownBackground, 2);


    }

};