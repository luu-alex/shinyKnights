import { darkBlueText, lightBrownBackground, primaryBrownBackground } from "../game/colors";
import { drawRoundedBox } from "../game/utils";

export class InventoryComponent {
    private canvasWidth;
    private canvasHeight;
    constructor(canvasWidth: number, canvasHeight: number) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }
    render(context: CanvasRenderingContext2D) {
        // Set the font and style for the coin text
        context.fillStyle = darkBlueText;
        context.font = `${this.canvasHeight * 0.06}px depixel`;
    
        // Measure the width of the coin text
        const title = "Inventory";
        const textMetrics = context.measureText(title);
        const textWidth = textMetrics.width;
    
        // Calculate the X position to center the text within the box
        const boxX = this.canvasWidth * 0.05;
        const boxWidth = this.canvasWidth * 0.9;
        const centeredX = boxX + (boxWidth - textWidth) / 2;
    
        // Render the centered text
        context.fillText(title, centeredX, this.canvasHeight * 0.16);

        drawRoundedBox(context, this.canvasWidth * 0, this.canvasHeight * 0.3, this.canvasWidth, this.canvasHeight * 0.8, 1, primaryBrownBackground, 2);

        // context.fillStyle = customizeBackground;
        // context.fillRect(this.canvasWidth * 0.05, this.canvasHeight * 0.2, this.canvasWidth * 0.9, this.canvasHeight * 0.3);

        // context.fillStyle = primaryBrownBackground;
        // context.fillRect(this.canvasWidth * 0.00, this.canvasHeight * 0.52, this.canvasWidth, this.canvasHeight * 0.6);

        // draw a black line
        // context.strokeStyle = "black";
        // context.lineWidth = 2;
        // context.beginPath();
        // context.moveTo(this.canvasWidth * 0.00, this.canvasHeight * 0.52);
        // context.lineTo(this.canvasWidth, this.canvasHeight * 0.52);
        // context.stroke();

        // this.choosePlayerButton?.render(context);
        // this.choosePetButton?.render(context);

        // draw perfect squares
        const squareSize = Math.min(this.canvasWidth, this.canvasHeight) * 0.17;
        // fit five squares in the canvas
        // should be drawn in a loop for columns and rows
        for (let j = 0; j < 5; j++) {
            for (let i = 0; i < 5; i++) {
                drawRoundedBox(context, this.canvasWidth * 0.02 + (squareSize * i) + i * this.canvasWidth * 0.02, this.canvasHeight * 0.35 + this.canvasHeight * 0.11 * j, squareSize, squareSize, 10, lightBrownBackground, 2);
                // drawRoundedBox(context, this.canvasWidth * 0.05 + (squareSize * i) + i * this.canvasWidth * 0.01, this.canvasHeight * 0.3 + squareSize + this.canvasHeight * 0.02 + this.canvasHeight * 0.02 * j, squareSize, squareSize, 10, darkBrownBackground, 2);
            }
        }
        // drawRoundedBox(context, this.canvasWidth * 0.05, this.canvasHeight * 0.62, squareSize, squareSize, 10, primaryBrownBackground, 2);


    }

};