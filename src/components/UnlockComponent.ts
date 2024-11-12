import Sprite from "../game/Sprite";
import { primaryColorBackground, darkGreenText, lightBlueButton } from "../game/colors";
import { drawCenteredText, drawRoundedBox, getSprite } from "../game/utils";
import { Button } from "./Button";
export class UnlockComponent {
    public isVisible: boolean;
    private canvasWidth: number;
    private canvasHeight: number;
    private useButton : Button;
    private title: string;
    private itemBackground: string = darkGreenText;
    private itemSprite: Sprite;
    constructor(canvasWidth: number, canvasHeight: number, title: string = 'Spear', _: () => void, __: () => void) {
        this.isVisible = false;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.title = title;
        this.useButton = new Button(
            canvasWidth * 0.2,
            canvasHeight * 0.55,
            canvasWidth * 0.6,
            canvasHeight * 0.1,
            "Continue",
            () => {this.hide()},
            lightBlueButton,
            canvasHeight * 0.04,
            "black",
          );
          this.itemSprite = new Sprite('weaponIcons/basicSpear.png', 32, 32, 4, 100);
    }
    render(context: CanvasRenderingContext2D) {
        // Draw the settings box
        drawRoundedBox(context, this.canvasWidth * 0.1, this.canvasHeight * 0.2, this.canvasWidth * 0.8, this.canvasHeight * 0.5, 5, primaryColorBackground);
        // Draw exit button
        this.useButton?.render(context);
        
        context.fillStyle = darkGreenText;
        context.font = `${this.canvasHeight*0.05}px depixel`;
        const textWidth = context.measureText("Unlocked!").width;

        // Calculate the x position to center the text within the box

        const boxX = this.canvasWidth * 0.1;
        const boxWidth = this.canvasWidth * 0.8;
        const textX = boxX + (boxWidth - textWidth) / 2;

        // Draw the title centered horizontally
        context.fillText("Unlocked!", textX, this.canvasHeight * 0.25);

        context.fillStyle = "white";
        context.font = `${this.canvasHeight*0.04}px depixel`;
        drawCenteredText(context, this.title, this.canvasWidth * 0.5, this.canvasHeight * 0.325);



        const squareSize = Math.min(this.canvasWidth, this.canvasHeight) * 0.2;
        drawRoundedBox(context, this.canvasWidth * 0.375, this.canvasHeight * 0.375, squareSize, squareSize, 3, this.itemBackground, 3, false, 1, true);
        const scaleFactor = Math.min(this.canvasWidth / 345, this.canvasHeight / 615);

        this.itemSprite?.render(context, this.canvasWidth * 0.41, this.canvasHeight * 0.39, 1.5 * scaleFactor);
        
    }
    public show() {
        this.isVisible = true;
    }

    // Hide the shop
    public hide() {
        this.isVisible = false;
    }
    handleClick(x:number, y:number, devicePixelRatio:number) {
        this.useButton.handleClick(x, y, devicePixelRatio);
    }
    update(title: string) {
        this.title = title;
        const sprite = getSprite(title);
        this.itemSprite = sprite;
    }
 };