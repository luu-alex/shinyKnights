import Sprite from "../game/Sprite";
import { primaryColorBackground, darkGreenText, grayBackground, lightGrayBackground, lightBlueButton } from "../game/colors";
import { Stats, WeaponStats } from "../game/types";
import { drawRoundedBox, wrapText, levelToGold, drawCenteredText, getSprite, getBackgroundRarity } from "../game/utils";
import { Button } from "./Button";
import { ImageButton } from "./ImageButton";
export class PopupComponent {
    public isVisible: boolean;
    private canvasWidth: number;
    private canvasHeight: number;
    public exitButton: ImageButton;
    private rarity:string;
    private boxBackground: string;
    private descriptionBackground: string;
    private textFont: string;
    private useButton : Button | null = null;
    private itemSprite: Sprite | null = null;
    private title: string;
    private type: string = "weapon";
    private description: string = "Common spear that is easy to use and make. Good weapon for beginners.";
    private weaponStat: WeaponStats = {
        level: 1,
        stats : {
            attack: 10,
            defense: 5,
        },
        name: "Basic Spear",
        rarity: "common"
      };
    private buttonTitle: string = "";

    public levelUpWeapon: () => void;

    constructor(canvasWidth: number, canvasHeight: number, title: string = 'Settings', levelUpWeapon: () => void, handleExit: () => void, rarity: string = "gray", buttonTitle: string = "Level up") {
        this.isVisible = false;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.title = title;
        this.levelUpWeapon = levelUpWeapon;
        this.exitButton = new ImageButton(0.8, 0.21, 0.1, 0.06, 'ui/closeIcon.png', handleExit.bind(this));
        this.rarity = rarity;
        this.buttonTitle = buttonTitle;
        if (this.rarity === "gray" || "common") {
            this.boxBackground = grayBackground;
            this.descriptionBackground = lightGrayBackground;
            this.textFont = "black";
        } else {
            this.boxBackground = primaryColorBackground;
            this.descriptionBackground = darkGreenText;
            this.textFont = darkGreenText
        }
        this.useButton = new Button(
            canvasWidth * 0.2,
            canvasHeight * 0.675,
            canvasWidth * 0.6,
            canvasHeight * 0.1,
            buttonTitle,
            levelUpWeapon.bind(this),
            lightBlueButton,
            canvasHeight * 0.04,
            "black",
        );
          this.itemSprite = new Sprite('weaponIcons/basicSpear.png', 32, 32, 4, 100);
        
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
        const textWidth = context.measureText(this.title).width;

        const boxX = this.canvasWidth * 0.1;
        const boxWidth = this.canvasWidth * 0.8;
        const textX = boxX + (boxWidth - textWidth) / 2;

        // Draw the title centered horizontally
        context.fillText(this.title, textX, this.canvasHeight * 0.25);

        // Draw ItemBox
        const squareSize = Math.min(this.canvasWidth, this.canvasHeight) * 0.2;
        const background = getBackgroundRarity(this.rarity);
        drawRoundedBox(context, this.canvasWidth * 0.15, this.canvasHeight * 0.3, squareSize, squareSize, 3, background, 3, false, 1, true);
        this.itemSprite?.render(context, this.canvasWidth * 0.18, this.canvasHeight * 0.32, 1.5 * scaleFactor);
        context.fillStyle = "black";
        context.font = `${this.canvasHeight * 0.02}px arial`;
        if (this.type === "weapon") {
            drawCenteredText(context, "Lvl " + this.weaponStat.level, this.canvasWidth * 0.2, this.canvasHeight * 0.315);
        }

        // Draw item description
        drawRoundedBox(context, this.canvasWidth * 0.4, this.canvasHeight * 0.3, this.canvasWidth * 0.45, squareSize, 3, this.descriptionBackground, 3, false, 1, true);
        // draw description of item
        const lines = wrapText(context, this.description, this.canvasWidth * 0.35);
        // Render each line of the description
        context.fillStyle = this.textFont;
        context.font = `${this.canvasHeight * 0.018}px depixel`;
        for (let i = 0; i < lines.length; i++) {
            context.fillText(lines[i], this.canvasWidth * 0.4, this.canvasHeight * 0.295 + this.canvasHeight * 0.026 * (i + 1));
        }
        
        // Draw Item stats
        drawRoundedBox(context, this.canvasWidth * 0.15, this.canvasHeight * 0.45, this.canvasWidth * 0.7, this.canvasHeight * 0.2, 3, this.descriptionBackground, 3, false, 1, true);
        // use this.stats and turn it into an array of strings
            context.fillStyle = this.textFont;
        if (this.type === "item") {
            context.fillText("Costs 100 gems to open.", this.canvasWidth * 0.17, this.canvasHeight * 0.44 + this.canvasHeight * 0.03 * (1));

        }
        if (this.type === "weapon") {
            const properties = Object.entries(this.weaponStat.stats).map(([key, value]) => `${key}: ${value}`);
            for (let i = 0; i < properties.length; i++) {
                context.fillText(properties[i], this.canvasWidth * 0.17, this.canvasHeight * 0.44 + this.canvasHeight * 0.03 * (i + 1));
            }
        }

        this.useButton?.render(context);
    }
    handleClick(x: number, y: number, devicePixelRatio: number) {
        this.exitButton.handleClick(x, y, this.canvasWidth, this.canvasHeight);
        this.useButton?.handleClick(x * devicePixelRatio, y * devicePixelRatio, devicePixelRatio);
    }
    updateInfo(inventory : {rarity?: string, title?: string, description?: string, stats?: Stats, level?: number, currentWeapon?: number, itemSprite?: Sprite, type?: string, index?: number, updateFN? : () => {}}) {
        console.log("item popup component", inventory)
        if (inventory.title) {
            this.title = inventory.title;
        }
        if (inventory.description) {
            this.description = inventory.description;
        }
        if (inventory.stats) {
            this.weaponStat.stats = inventory.stats;
        }
        if (inventory.level) {
            this.weaponStat.level = inventory.level;
            const cost = levelToGold(inventory.level);
            if (this.useButton)
            this.useButton.text = this.buttonTitle === "Equip" ? this.buttonTitle : this.buttonTitle + ":" + cost;

        }
        if (inventory.itemSprite) {
            this.itemSprite = inventory.itemSprite;
        }
        if (inventory.type) {
            this.type = inventory.type;
        }
        if (inventory.updateFN && this.useButton) {
            this.levelUpWeapon = inventory.updateFN;
            this.useButton.onClick = inventory.updateFN;
        }
        if (inventory.rarity) {
            this.rarity = inventory.rarity;
        }
    }
    // levelUp() {
    //     console.log("leveling up")
    //     this.updateProfile({weapon: this.weaponStat.level + 1});
    // }
    updateWeapon (weapons: WeaponStats) {
        this.weaponStat = weapons;
        const sprite = getSprite(weapons.name);
        this.itemSprite = sprite;

    }
    
};