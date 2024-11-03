import { darkGold, lightGold } from "../game/colors";
import { drawRoundedBox } from "../game/utils";

export class UsernameComponent {

    public render(context: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, username: string) {
        const boxWidth = canvasWidth * 0.2;
        const boxHeight = canvasHeight * 0.03;
        drawRoundedBox(context, canvasWidth * 0.01, canvasHeight * 0.06, boxWidth, boxHeight, 1, lightGold, 2);
        // Set the font and style for the username text and center it
        // Set the initial font size
        let fontSize = canvasHeight * 0.02;
        context.font = `${fontSize}px depixel`;

        // Measure the width of the username text
        let textWidth = context.measureText(username).width;

        // If the text is too wide, reduce the font size until it fits
        while (textWidth > boxWidth * 0.9) { // Leave some padding (90% of the box width)
            fontSize -= 1; // Decrease font size
            context.font = `${fontSize}px depixel`;
            textWidth = context.measureText(username).width;
        }

        // Set the fill color for the username text
        context.fillStyle = darkGold;

        // Calculate the x-position to center the text within the box
        const textX = (boxWidth - textWidth) / 2 + canvasWidth * 0.01;

        // Draw the text inside the box
        context.fillText(username, textX, canvasHeight * 0.08);


    }
}