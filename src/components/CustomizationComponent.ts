import Sprite from "../game/Sprite";
import { customizeBackground, darkBlueText, darkBrownBackground, primaryBrownBackground, lightBrownBackground } from "../game/colors";
import { drawCenteredText, drawRoundedBox, wrapText } from "../game/utils";
import { Button } from "./Button";

export class CustomizationComponent {
    private canvasWidth;
    private canvasHeight;
    private choosePlayerButton: Button | null = null;
    private choosePetButton: Button | null = null;
    private wardenSprite: Sprite;
    private swordsmanSprite: Sprite;
    private druidSprite: Sprite;
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
        this.wardenSprite = new Sprite('characters/warden.png', 32, 32, 4, 100);
        this.swordsmanSprite = new Sprite('characters/swordman.png', 32, 32, 4, 100);
        this.druidSprite = new Sprite('characters/MiniSatyrDruid.png', 32, 32, 4, 100);
    }
    render(context: CanvasRenderingContext2D) {
        // Set the font and style for the coin text
        context.fillStyle = darkBlueText;
        context.font = `${this.canvasHeight * 0.06}px depixel`;
    
        // Measure the width of the coin text
    
        // Calculate the X position to center the text within the box
        drawCenteredText(context, "Customization", this.canvasWidth / 2, this.canvasHeight * 0.16);

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
            drawRoundedBox(context, this.canvasWidth * 0.05 + (squareSize * i) + i * this.canvasWidth * 0.01, this.canvasHeight * 0.62, squareSize, squareSize, 10, lightBrownBackground, 2);
            drawRoundedBox(context, this.canvasWidth * 0.05 + (squareSize * i) + i * this.canvasWidth * 0.01, this.canvasHeight * 0.62 + squareSize + this.canvasHeight * 0.02, squareSize, squareSize, 10, lightBrownBackground, 2);
        }
        // draw sprites in the squares
        // adjust for sprite size and scaling
        const scaleFactor = Math.min(this.canvasWidth / 345, this.canvasHeight / 615);

        // Loop through and draw each sprite centered in its square
        const spriteData = [
            { sprite: this.wardenSprite, index: 0 },
            { sprite: this.swordsmanSprite, index: 1 },
            { sprite: this.druidSprite, index: 2 }
        ];
        
        spriteData.forEach(({ sprite, index }) => {
            const xPosition = this.canvasWidth * 0.07 + (squareSize * index) + index * this.canvasWidth * 0.01;
            const yPosition = this.canvasHeight * 0.62;
            
            // Calculate the sprite's scaled dimensions
            const scaledWidth = sprite.frameWidth * 2.5 * scaleFactor;
            const scaledHeight = sprite.frameHeight * 2.5 * scaleFactor;
        
            // Calculate the offset to center the sprite within the square
            const offsetX = (squareSize - scaledWidth);
            const offsetY = (squareSize - scaledHeight);
        
            // Render the sprite centered in the square
            sprite.render(
                context,
                xPosition + offsetX,
                yPosition + offsetY,
                2.5 * scaleFactor
            );
        });

        // draw character in main customize square
        context.fillStyle = darkBlueText;
        context.font = `${this.canvasHeight * 0.06}px depixel`;

        // Draw centered text
        context.fillStyle = "white";
        drawCenteredText(context, "Knight", this.canvasWidth / 2, this.canvasHeight * 0.27);
        // Render each line of the description
        context.fillStyle = "white";
        context.font = `${this.canvasHeight * 0.025}px depixel`;

        this.wardenSprite.render(context, this.canvasWidth * 0.25, this.canvasHeight * 0.2, 5 * scaleFactor);
    }

};