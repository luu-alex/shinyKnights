import Sprite from "../game/Sprite";
import { blueBackground, darkerGreenBackground, lighterGreenBackground } from "../game/colors";
import { drawCenteredText, drawRoundedBox } from "../game/utils";
import { Button } from "./Button";


export class ShopItemComponent {
    private canvasWidth: number;
    private canvasHeight: number;
    private buyButton: Button | null = null;
    private shopIcon: Sprite;
    private title: string;
    private currency: string;
    private cost: number;
    private bought: boolean;
    // private itemType: string;
    // private rarity: string;
    // private index: number;

    constructor(canvasWidth: number, canvasHeight: number, shopIcon: Sprite, title: string, currency: string, cost: number, bought: boolean, buyFunction: () => void, _: string, __: string, index: number) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.shopIcon = shopIcon;
        this.title = title;
        this.currency = currency;
        this.cost = cost;
        this.bought = bought; 
        // this.itemType = itemType;
        // this.rarity = rarity;
        // this.index = index;
        this.buyButton = new Button(
            this.canvasWidth * 0.1 + index * this.canvasWidth * 0.28,
            this.canvasHeight * 0.555,
            this.canvasWidth * 0.25,
            this.canvasHeight * 0.04,
            "Buy",
            () => {
                console.log("Buy button clicked");
                buyFunction();
            },
            blueBackground,
            this.canvasHeight * 0.02,
            "black",
          );

    }

    render(context: CanvasRenderingContext2D, i: number) {
        const boxX = this.canvasWidth * 0.1 + i * this.canvasWidth * 0.28;
        const boxY = this.canvasHeight * 0.33;
        const boxWidth = this.canvasWidth * 0.25;
        const boxHeight = this.canvasHeight * 0.22;


        drawRoundedBox(context, boxX, boxY, boxWidth, boxHeight,  3, lighterGreenBackground, 1, false, 1, true);
        drawRoundedBox(
            context,
            boxX + this.canvasWidth * 0.02,
            boxY + this.canvasHeight * 0.01,
            this.canvasWidth * 0.21,
            this.canvasHeight * 0.15,
            1,
            darkerGreenBackground,
            0,
            false,
            1,
            true
        );

        const maxSpriteWidth = this.canvasWidth * 0.21 * 0.8;
        const maxSpriteHeight = this.canvasHeight * 0.15 * 0.8;

        // Get sprite's natural dimensions
        const spriteNaturalWidth = this.shopIcon.frameWidth;
        const spriteNaturalHeight = this.shopIcon.frameHeight;
        
        const scaleX = maxSpriteWidth / spriteNaturalWidth;
        const scaleY = maxSpriteHeight / spriteNaturalHeight;
        const scale = Math.min(scaleX, scaleY);

        const spriteWidthScaled = spriteNaturalWidth * scale;
        const spriteHeightScaled = spriteNaturalHeight * scale;
        const spriteX =
            boxX +
            this.canvasWidth * 0.02 +
            (this.canvasWidth * 0.21 - spriteWidthScaled) / 2;
        const spriteY =
            boxY +
            this.canvasHeight * 0.01 +
            (this.canvasHeight * 0.15 - spriteHeightScaled) / 2;

        // Render the sprite with calculated scale and position
        this.shopIcon.render(context, spriteX, spriteY, scale);
        context.fillStyle = "white";
        context.font = `${this.canvasHeight * 0.017}px depixel`;
        
        drawCenteredText(context, this.title, boxX + boxWidth/2, this.canvasHeight * 0.36);
        // context.fillText(this.title, this.canvasWidth * 0.17 + i * this.canvasWidth * 0.28, this.canvasHeight * 0.37);
        context.fillText(this.currency + ": " + this.cost, this.canvasWidth * 0.13 + i * this.canvasWidth * 0.28, this.canvasHeight * 0.53);
        if (!this.bought && this.buyButton) {
            this.buyButton.render(context);
        } else {
            context.fillStyle = "black";
            context.font = `${this.canvasHeight * 0.03}px depixel`;
            drawCenteredText(context, "Bought", boxX + boxWidth/2, this.canvasHeight * 0.58);
        }
    }

    handleClick(mouseX: number, mouseY: number, devicePixelRatio: number) {
        this.buyButton?.handleClick(mouseX, mouseY, devicePixelRatio);

    }
}