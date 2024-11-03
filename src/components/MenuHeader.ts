import { darkGold, darkerGreenBackground, lightGold, primaryBrownBackground, primaryColorBackground, redBackground, redText } from "../game/colors";
import { drawRoundedBox } from "../game/utils";
import Sprite from "../game/Sprite";

export class MenuHeader {
    private canvasWidth;
    private canvasHeight;
    private coinSprite: Sprite = new Sprite('ui/coinIcon.png', 28, 29, 1, 100);
    private gemSprite: Sprite = new Sprite('ui/gemIcon.png', 30, 29, 1, 100);
    constructor(canvasWidth: number, canvasHeight: number) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight
    }
    render(context: CanvasRenderingContext2D, coins: number, gems: number, level: number) {
        drawRoundedBox(context, this.canvasWidth * 0.0, this.canvasHeight * 0, this.canvasWidth, this.canvasHeight * 0.1, 5, primaryBrownBackground, 2, true);
        // render coins
        // fill rect
        
        this.renderCoins(context, coins);
        this.renderGems(context, gems);
        this.renderLevel(context, level);
    }

    renderCoins(context: CanvasRenderingContext2D, coins: number) {
        // Render the coin sprite
        

        context.fillStyle = darkGold;
        drawRoundedBox(context, this.canvasWidth * 0.30, this.canvasHeight * 0.035, this.canvasWidth * 0.25, this.canvasHeight * 0.03, 5, darkGold, 2, true);

        const maxSpriteSize = this.canvasHeight * 0.06;  // Set max height for the sprite
        const scaleFactor = this.calculateScale(this.coinSprite, maxSpriteSize, maxSpriteSize);
        this.coinSprite.render(context, this.canvasWidth * 0.25, this.canvasHeight * 0.02, scaleFactor);
    
        // Set the font and style for the coin text
        context.fillStyle = lightGold;
        context.font = `${this.canvasHeight * 0.02}px depixel`;
    
        // Measure the width of the coin text
        const coinText = `${coins}`;
        const textMetrics = context.measureText(coinText);
        const textWidth = textMetrics.width;
    
        // Calculate the X position to center the text within the box
        const boxX = this.canvasWidth * 0.32;
        const boxWidth = this.canvasWidth * 0.25;
        const centeredX = boxX + (boxWidth - textWidth) / 2;
    
        // Render the centered text
        context.fillText(coinText, centeredX, this.canvasHeight * 0.058);
    }

    renderGems(context: CanvasRenderingContext2D, gems: number) {
        context.fillStyle = redBackground;
        drawRoundedBox(context, this.canvasWidth * 0.60, this.canvasHeight * 0.035, this.canvasWidth * 0.25, this.canvasHeight * 0.03, 5, redBackground, 2, true);
        // Render the gem sprite
        const maxSpriteSize = this.canvasHeight * 0.06;  // Set max height for the sprite
        const scaleFactor = this.calculateScale(this.coinSprite, maxSpriteSize, maxSpriteSize);
        this.gemSprite.render(context, this.canvasWidth * 0.55, this.canvasHeight * 0.02, scaleFactor);
    
        // Set the font and style for the gem text
        context.fillStyle = redText;
        context.font = `${this.canvasHeight * 0.02}px depixel`;
    
        // Measure the width of the gem text
        const gemText = `${gems}`;
        const textMetrics = context.measureText(gemText);
        const textWidth = textMetrics.width;
    
        // Calculate the X position to center the text within the box
        const boxX = this.canvasWidth * 0.59;
        const boxWidth = this.canvasWidth * 0.25;
        const centeredX = boxX + (boxWidth - textWidth) / 2;
    
        // Render the centered text
        context.fillText(gemText, centeredX, this.canvasHeight * 0.059);
    };

    renderLevel(context: CanvasRenderingContext2D, level: number) {
        // Define circle properties
        const circleRadius = this.canvasHeight * 0.03; // Adjust the size based on canvas height
        const circleX = this.canvasWidth * 0.1;  // X position for the circle
        const circleY = this.canvasHeight * 0.05; // Y position for the circle

        // Draw the circle (level indicator)
        context.beginPath();
        context.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
        context.fillStyle = darkerGreenBackground;  // Color of the circle
        context.fill();
        context.lineWidth = 2; // Outline thickness
        context.strokeStyle = 'black'; // Outline color
        context.stroke();
        context.closePath();

        // Set the font for the level text inside the circle
        context.fillStyle = primaryColorBackground;
        context.font = `${this.canvasHeight * 0.03}px depixel`;

        // Render the level number inside the circle
        context.fillText(level.toString(), circleX - this.canvasWidth * 0.015, circleY + this.canvasWidth * 0.02);
    }
    private calculateScale(sprite: Sprite, maxWidth: number, maxHeight: number): number {
        const widthScale = maxWidth / sprite.frameWidth;
        const heightScale = maxHeight / sprite.frameHeight;
        return Math.min(widthScale, heightScale);  // Ensure the sprite fits within the bounds
    }
    
} 