import { darkGreenText, darkerGreenBackground, lighterGreenBackground, primaryColorBackground } from "../game/colors";
import { drawRoundedBox, wrapText } from "../game/utils";
import { ImageButton } from "./ImageButton";
import { Button } from "./Button";
import WebApp from '@twa-dev/sdk';

export class OrderComponent {
    public isVisible: boolean;
    private canvasWidth: number;
    private canvasHeight: number;
    public exitButton: ImageButton;
    public purchaseButton: Button;
    public verifyButton: Button;
    private handleExit : () => void;
    public callBackURL : string = "";
    public status : string = "";

    constructor(canvasWidth: number, canvasHeight: number, handleExit: () => void, verifyOrder : () => void) {
        this.isVisible = false;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.exitButton = new ImageButton(0.81, 0.195, 0.1, 0.06, 'ui/closeIcon.png', this.hide.bind(this));
        this.handleExit = handleExit;
        this.purchaseButton = new Button(canvasWidth * 0.4, canvasHeight * 0.45, canvasWidth * 0.25, canvasHeight * 0.05, "Pay", () => { this.handlePay() }, darkerGreenBackground, this.canvasHeight * 0.03, "white");
        this.verifyButton = new Button(canvasWidth * 0.4, canvasHeight * 0.625, canvasWidth * 0.25, canvasHeight * 0.05, "Verify", () => { verifyOrder() }, darkerGreenBackground, this.canvasHeight * 0.03, "white");
    }

    render(context: CanvasRenderingContext2D) {
        // Draw the settings box
        drawRoundedBox(context, this.canvasWidth * 0.1, this.canvasHeight * 0.2, this.canvasWidth * 0.8, this.canvasHeight * 0.6, 5, primaryColorBackground);
        this.exitButton.render(context, this.canvasWidth, this.canvasHeight);

        context.fillStyle = darkGreenText;
        context.font = `${this.canvasHeight*0.035}px depixel`;
        const textWidth = context.measureText("Pending Orders").width;

        // Calculate the x position to center the text within the box

        const boxX = this.canvasWidth * 0.1;
        const boxWidth = this.canvasWidth * 0.8;
        const textX = boxX + (boxWidth - textWidth) / 2;

        // Draw the title centered horizontally
        context.fillText("Pending Orders", textX, this.canvasHeight * 0.25);

        // Draw Rows of gems to buy
        drawRoundedBox(context, this.canvasWidth * 0.15, this.canvasHeight * 0.3, this.canvasWidth * 0.7, this.canvasHeight * 0.4, 3, lighterGreenBackground, 3);

        this.purchaseButton.render(context);
        // description of how to purchase
        const descriptionPurchase = "We use Aeon to handle our transactions securely. Click the Pay button to complete your order.";
        const lines = wrapText(context, descriptionPurchase, this.canvasWidth * 0.85);
        // Render each line of the description
        context.fillStyle = "white";
        context.font = `${this.canvasHeight * 0.025}px depixel`;

        for (let i = 0; i < lines.length; i++) {
            context.fillText(lines[i], this.canvasWidth * 0.17, this.canvasHeight * 0.31 + this.canvasHeight * 0.025 * (i + 1));
        }

        const descriptionVerify = "After you have paid, click the Verify button to complete your order.";
        const linesVerify = wrapText(context, descriptionVerify, this.canvasWidth * 0.7);
        // Render each line of the description
        for (let i = 0; i < linesVerify.length; i++) {
            context.fillText(linesVerify[i], this.canvasWidth * 0.17, this.canvasHeight * 0.53 + this.canvasHeight * 0.025 * (i + 1));
        }

        this.verifyButton.render(context);
        
    }

    public drawText(context: CanvasRenderingContext2D, text: string, x: number, y: number, fontSize: number, fillStyle: string) {
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

    public handlePay() {
        WebApp.openLink(this.callBackURL, {try_instant_view: true});
    }
    
}