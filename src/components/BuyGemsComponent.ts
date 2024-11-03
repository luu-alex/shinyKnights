import { darkGreenText, lightGold, lighterGreenBackground, primaryColorBackground } from "../game/colors";
import { drawRoundedBox } from "../game/utils";
import { ImageButton } from "./ImageButton";
import { Button } from "./Button";

export class BuyGemsComponent {
    public isVisible: boolean;
    private canvasWidth: number;
    private canvasHeight: number;
    public exitButton: ImageButton;
    public buy500GemsButton: Button;
    public buy1000GemsButton: Button;
    public buy2000GemsButton: Button;
    private handleExit : () => void;

    constructor(canvasWidth: number, canvasHeight: number, handleExit: () => void, handlePendingOrders: (amount: number) => void) {
        this.isVisible = false;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.exitButton = new ImageButton(0.81, 0.195, 0.1, 0.06, 'ui/closeIcon.png', this.hide.bind(this));
        this.handleExit = handleExit;
        this.buy500GemsButton = new Button(canvasWidth * 0.6, canvasHeight * 0.35, canvasWidth * 0.2, canvasHeight * 0.05, "Buy", () => { handlePendingOrders(500) }, lightGold, this.canvasHeight * 0.03, "white");
        this.buy1000GemsButton = new Button(canvasWidth * 0.6, canvasHeight * 0.48, canvasWidth * 0.2, canvasHeight * 0.05, "Buy", () => { handlePendingOrders(1000) }, lightGold, this.canvasHeight * 0.03, "white");
        this.buy2000GemsButton = new Button(canvasWidth * 0.6, canvasHeight * 0.61, canvasWidth * 0.2, canvasHeight * 0.05, "Buy", () => { handlePendingOrders(2000) }, lightGold, this.canvasHeight * 0.03, "white");
    }

    render(context: CanvasRenderingContext2D) {
        // Draw the settings box
        drawRoundedBox(context, this.canvasWidth * 0.1, this.canvasHeight * 0.2, this.canvasWidth * 0.8, this.canvasHeight * 0.6, 5, primaryColorBackground);
        this.exitButton.render(context, this.canvasWidth, this.canvasHeight);

        context.fillStyle = darkGreenText;
        context.font = `${this.canvasHeight*0.05}px depixel`;
        const textWidth = context.measureText("Buy Gems").width;

        // Calculate the x position to center the text within the box

        const boxX = this.canvasWidth * 0.1;
        const boxWidth = this.canvasWidth * 0.8;
        const textX = boxX + (boxWidth - textWidth) / 2;

        // Draw the title centered horizontally
        context.fillText("Buy Gems", textX, this.canvasHeight * 0.25);

        // Draw Rows of gems to buy
        drawRoundedBox(context, this.canvasWidth * 0.15, this.canvasHeight * 0.3, this.canvasWidth * 0.7, this.canvasHeight * 0.4, 3, lighterGreenBackground, 3);

        // draw lines of seperation
        context.strokeStyle = "black";
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(this.canvasWidth * 0.15, this.canvasHeight * 0.43);
        context.lineTo(this.canvasWidth * 0.85, this.canvasHeight * 0.43);
        context.stroke();

        context.strokeStyle = "black";
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(this.canvasWidth * 0.15, this.canvasHeight * 0.56);
        context.lineTo(this.canvasWidth * 0.85, this.canvasHeight * 0.56);
        context.stroke();

        this.drawText(context, "500 Gems", 0.25, 0.38, this.canvasHeight * 0.03, "white");
        this.drawText(context, "1000 Gems", 0.25, 0.51, this.canvasHeight * 0.03, "white");
        this.drawText(context, "2000 Gems", 0.25, 0.64, this.canvasHeight * 0.03, "white");
        // create buy gems buttons
        this.buy500GemsButton.render(context);
        this.buy1000GemsButton.render(context);
        this.buy2000GemsButton.render(context);
        
    }

    private drawText(context: CanvasRenderingContext2D, text: string, x: number, y: number, fontSize: number, fillStyle: string) {
        context.fillStyle = fillStyle;
        context.font = `${fontSize}px depixel`;
        const textWidth = context.measureText(text).width;

        // Calculate the x position to center the text within the box

        const boxX = this.canvasWidth * x;
        const boxWidth = this.canvasWidth * x;
        const textX = boxX + (boxWidth - textWidth) / 2;

        // Draw the title centered horizontally
        context.fillText(text, textX, this.canvasHeight * y);
    }
    public show() {
        this.isVisible = true;
    }

    // Hide the shop
    public hide() {
        this.isVisible = false;
        this.handleExit();
    }
    
}