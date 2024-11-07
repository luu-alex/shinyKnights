import Sprite from "../game/Sprite";
import { primaryColorBackground, darkGreenText, grayBackground, darkGrayBackground, lightGrayBackground, grayText, lightBlueButton } from "../game/colors";
import { PlayerStats } from "../game/types";
import { drawRoundedBox, wrapText } from "../game/utils";
import { Button } from "./Button";
import { ImageButton } from "./ImageButton";
import { upgradeCharacter } from "../apiCalls/serverCalls";
export class CharacterPopupComponent {
    public isVisible: boolean;
    private canvasWidth: number;
    private canvasHeight: number;
    public exitButton: ImageButton;
    private rarity:string;
    private boxBackground: string;
    private itemBackground: string;
    private descriptionBackground: string;
    private textFont: string;
    private useButton : Button | null = null;
    private title: string;
    private characterSprite: Sprite | null = null;
    private description: string = "Common spear that is easy to use and make. Good weapon for beginners.";
    public playerStats: PlayerStats | null = null;
    public level: number = 1;
    private unlocked: boolean = false;

    constructor(canvasWidth: number, canvasHeight: number, title: string = 'Settings', levelCharacter: () => void, handleExit: () => void, rarity: string = "gray", buttonTitle: string = "Level up") {
        this.isVisible = false;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.title = title;
        this.exitButton = new ImageButton(0.8, 0.21, 0.1, 0.06, 'ui/closeIcon.png', handleExit.bind(this));
        this.rarity = rarity;
        if (rarity === "gray") {
            this.boxBackground = grayBackground;
            this.itemBackground = darkGrayBackground;
            this.descriptionBackground = lightGrayBackground;
            this.textFont = "black";
        } else {
            this.boxBackground = primaryColorBackground;
            this.itemBackground = darkGreenText;
            this.descriptionBackground = darkGreenText;
            this.textFont = darkGreenText
        }
        const buttonT = this.unlocked ? buttonTitle : "Locked";
        this.useButton = new Button(
            canvasWidth * 0.2,
            canvasHeight * 0.675,
            canvasWidth * 0.6,
            canvasHeight * 0.1,
            buttonT,
            levelCharacter,
            lightBlueButton,
            canvasHeight * 0.04,
            "black",
          );
        
    }
    render(context: CanvasRenderingContext2D) {
        const scaleFactor = Math.min(this.canvasWidth / 345, this.canvasHeight / 615);

        // Draw the settings box
        drawRoundedBox(context, this.canvasWidth * 0.1, this.canvasHeight * 0.2, this.canvasWidth * 0.8, this.canvasHeight * 0.6, 5, this.boxBackground);
        // Draw exit button
        this.exitButton.render(context, this.canvasWidth, this.canvasHeight);
        
        // Draw Title
        context.fillStyle = this.textFont;
        context.font = `${this.canvasHeight*0.04}px depixel`;
        const textWidth = context.measureText(this.rarity+this.title).width;

        const boxX = this.canvasWidth * 0.1;
        const boxWidth = this.canvasWidth * 0.8;
        const textX = boxX + (boxWidth - textWidth) / 2;

        // Draw the title centered horizontally
        context.fillText(this.title, textX, this.canvasHeight * 0.25);
        this.rarity;

        // Draw ItemBox
        const squareSize = Math.min(this.canvasWidth, this.canvasHeight) * 0.2;
        drawRoundedBox(context, this.canvasWidth * 0.15, this.canvasHeight * 0.3, squareSize, squareSize, 3, this.itemBackground, 3, false, 1, true);
        this.characterSprite?.render(context, this.canvasWidth * 0.1, this.canvasHeight * 0.25, 3 * scaleFactor);
        context.fillStyle = "black";
        context.font = `${this.canvasHeight * 0.02}px arial`;
        context.fillText("Lvl " + this.level, this.canvasWidth * 0.15, this.canvasHeight * 0.295);

        // Draw item description
        drawRoundedBox(context, this.canvasWidth * 0.4, this.canvasHeight * 0.3, this.canvasWidth * 0.45, squareSize, 3, this.descriptionBackground, 3, false, 1, true);
        // draw description of item
        const lines = wrapText(context, this.description, this.canvasWidth * 0.34);
        // Render each line of the description
        context.fillStyle = this.textFont;
        context.font = `${this.canvasHeight * 0.018}px depixel`;
        for (let i = 0; i < lines.length; i++) {
            context.fillText(lines[i], this.canvasWidth * 0.4, this.canvasHeight * 0.295 + this.canvasHeight * 0.026 * (i + 1));
        }
        
        // Draw Item stats
        drawRoundedBox(context, this.canvasWidth * 0.15, this.canvasHeight * 0.45, this.canvasWidth * 0.7, this.canvasHeight * 0.2, 3, this.descriptionBackground, 3, false, 1, true);
        // use this.stats and turn it into an array of strings
        if (this.playerStats === null) {
            return;
        }
        const properties = Object.entries(this.playerStats).map(([key, value]) => `${key}: ${value}`);
        context.fillStyle = this.textFont;
        for (let i = 0; i < properties.length; i++) {
            context.fillText(properties[i], this.canvasWidth * 0.17, this.canvasHeight * 0.44 + this.canvasHeight * 0.03 * (i + 1));
        }

        this.useButton?.render(context);
    }
    handleClick(x: number, y: number, devicePixelRatio: number) {
        this.exitButton.handleClick(x / devicePixelRatio, y / devicePixelRatio, this.canvasWidth, this.canvasHeight);
        this.useButton?.handleClick(x, y, devicePixelRatio);
    }
    updateInfo(characterSprite: Sprite, title: string, description: string, stats: PlayerStats, rarity: string, level: number, unlocked: boolean) {
        this.characterSprite = characterSprite;
        this.title = title;
        this.description = description;
        this.playerStats = stats;
        this.rarity = rarity;
        this.level = level;
        this.unlocked = unlocked;
    }
};