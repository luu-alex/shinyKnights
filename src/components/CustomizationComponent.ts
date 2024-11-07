import { upgradeCharacter } from "../apiCalls/serverCalls";
import Sprite from "../game/Sprite";
import { customizeBackground, darkBlueText, darkBrownBackground, primaryBrownBackground, lightBrownBackground, grayBackground, primaryColorBackground, darkGreenText, redText } from "../game/colors";
import { Characters, Stats, Weapons } from "../game/types";
import { drawCenteredText, drawRoundedBox, getSprite } from "../game/utils";
import { BoxComponent } from "./BoxComponent";
import { Button } from "./Button";
import { CharacterPopupComponent } from "./CharacterPopupcomponent";
import { PopupComponent } from "./PopupComponent";

export class CustomizationComponent {
    private canvasWidth;
    private canvasHeight;
    private choosePlayerButton: Button | null = null;
    private choosePetButton: Button | null = null;
    private chooseWeaponBox: BoxComponent | null = null;
    private playerBox: BoxComponent[] =  [];
    private characterPopupVisible: boolean = false;

    // sprites
    private wardenSprite: Sprite;
    private druidSpriteIcon: Sprite;
    private swordsmanIcon: Sprite;
    private swordsmanSprite: Sprite;
    private druidSprite: Sprite;
    private characterData: {sprite: Sprite, name: string, description: string, rarity: string, unlocked: boolean}[] = [];
    private weaponSprite: Sprite;
    private swordIconSprite: Sprite;
    private heartIconSprite: Sprite; 
    private wardenSpriteIcon: Sprite;
    private currentCharacter = "knight";
    private characters: Characters | null = null;
    // popup component
    private itemPopupComponent: PopupComponent | null = null;
    private characterPopupComponent: CharacterPopupComponent | null = null;
    private popupVisible: boolean = false;
    private gold: number = 0;
    private upgradeWeapon: (weaponNumber: number) => void;
    private weapons: Weapons | null = null;
    public currentWeapon: number = 0;
    private fetchProfile: () => void;
    private username: string = "";
    private characterName: string = "";

    constructor(canvasWidth: number, canvasHeight: number, upgradeWeapon: (weaponNumber: number) => void, fetchProfile: () => void) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.fetchProfile = fetchProfile;
        this.upgradeWeapon = upgradeWeapon;
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
            "Weapons",
            () => {
                console.log("Choose Player");
            },
            primaryBrownBackground,
            this.canvasHeight * 0.03
        );
        const squareSize = Math.min(this.canvasWidth, this.canvasHeight) * 0.17;
        this.chooseWeaponBox = new BoxComponent(this.canvasWidth * 0.09, this.canvasHeight * 0.35, squareSize, squareSize, this.showPopup.bind(this));
        this.wardenSprite = new Sprite('characters/warden.png', 32, 32, 4, 200);
        this.swordsmanSprite = new Sprite('characters/swordman.png', 32, 32, 4, 100);
        this.druidSprite = new Sprite('characters/MiniSatyrDruid.png', 32, 32, 4, 100);
        this.weaponSprite = new Sprite('weaponIcons/basicSpear.png', 32, 32, 4, 100);
        this.swordIconSprite = new Sprite('ui/swordIcon2.png', 16, 16, 4, 100);
        this.heartIconSprite = new Sprite('ui/heartIcon2.png', 16, 16, 4, 100);
        this.wardenSpriteIcon = new Sprite('characters/warden.png', 32, 32, 4, 200);
        this.swordsmanIcon = new Sprite('characters/swordman.png', 32, 32, 4, 200);
        this.druidSpriteIcon = new Sprite('characters/MiniSatyrDruid.png', 32, 32, 4, 200);

        // Create the popup component
        this.itemPopupComponent = new PopupComponent(this.canvasWidth, this.canvasHeight, "", this.levelingWeapon.bind(this), this.closePopup.bind(this), "gray", "Level up");
        this.characterPopupComponent = new CharacterPopupComponent(this.canvasWidth, this.canvasHeight, "Character", this.levelingCharacter.bind(this), this.closeCharacterPopup.bind(this), "gray", "Level up");
        this.characterName = this.currentCharacter
        this.characterData = [{sprite: this.wardenSprite, name: "knight", description: "A knight in shining armor", rarity: "Common", unlocked: true }, {sprite:this.swordsmanSprite, name: "swordsmaster", description: "Juggles swords", rarity: "Rare", unlocked: false}, {sprite: this.druidSprite, name: "druid", description: "A druid that can summon animals", unlocked: false, rarity: "Epic"}];
        for (let i = 0; i < this.characterData.length; i++) {
            this.playerBox.push(new BoxComponent(this.canvasWidth * 0.05 + (squareSize * i) + i * this.canvasWidth * 0.01, this.canvasHeight * 0.62, squareSize, squareSize, this.showCharacterPopup.bind(this)));
        }
        
    }
    render(context: CanvasRenderingContext2D) {
        if (!this.characters || !this.weapons) return;
        // Set the font and style for the coin text
        context.fillStyle = darkBlueText;
        context.font = `${this.canvasHeight * 0.06}px depixel`;
    
        drawCenteredText(context, "Customization", this.canvasWidth * 0.51, this.canvasHeight * 0.16);

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
        const characterData = [
            { sprite: this.wardenSpriteIcon, index: 0 },
            { sprite: this.swordsmanIcon, index: 1 },
            { sprite: this.druidSpriteIcon, index: 2 }
        ];
        
        characterData.forEach(({ sprite, index }) => {
            // drawRoundedBox(context, this.canvasWidth * 0.05 + (squareSize * index) + index * this.canvasWidth * 0.01, this.canvasHeight * 0.62, squareSize, squareSize, 10, lightBrownBackground, 2);
            // this.playerBox?[index].render(context);
            this.playerBox[index].render(context, this.canvasWidth * 0.05 + (squareSize * index) + index * this.canvasWidth * 0.01, this.canvasHeight * 0.62, squareSize, squareSize, 10, lightBrownBackground, 2);

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

        // Draw title
        context.fillStyle = "white";
        drawCenteredText(context, this.characterName, this.canvasWidth / 2, this.canvasHeight * 0.27);

        this.wardenSprite.render(context, this.canvasWidth * 0.25, this.canvasHeight * 0.2, 5 * scaleFactor);

        // draw equipment square
        this.chooseWeaponBox?.render(context, this.canvasWidth * 0.09, this.canvasHeight * 0.35, squareSize, squareSize, 5, grayBackground, 3, true, 5);
        // draw weapon in equipment square
        this.weaponSprite.render(context, this.canvasWidth * 0.11, this.canvasHeight * 0.36, 1.5 * scaleFactor);
        context.fillStyle = "white";
        context.font = `${this.canvasHeight * 0.03}px depixel`;
        drawCenteredText(context, "Weapon", this.canvasWidth * 0.2, this.canvasHeight * 0.33);
        context.fillStyle = darkGreenText;
        context.font = `${this.canvasHeight * 0.02}px arial`;
        if (this.weapons)
        drawCenteredText(context, "Lvl " + this.weapons[this.currentWeapon].level, this.canvasWidth * 0.14, this.canvasHeight * 0.37);

        // draw stats
        context.fillStyle = redText;
        context.font = `${this.canvasHeight * 0.025}px depixel`;
        this.heartIconSprite.render(context, this.canvasWidth * 0.6, this.canvasHeight * 0.35, 1.5 * scaleFactor);
        const attack = this.weapons[this.currentWeapon].stats.attack + this.characters[this.currentCharacter as keyof Characters].stats.attack;
        drawCenteredText(context, "HP " + this.characters[this.currentCharacter as keyof Characters].stats.hp, this.canvasWidth * 0.8, this.canvasHeight * 0.38);
        this.swordIconSprite.render(context, this.canvasWidth * 0.59, this.canvasHeight * 0.40, 1.5 * scaleFactor);
        drawCenteredText(context, "ATK " + attack, this.canvasWidth * 0.78, this.canvasHeight * 0.44);


        if (this.popupVisible) {
            // make background darker
            context.fillStyle = "rgba(0, 0, 0, 0.5)";
            context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
            
            this.itemPopupComponent?.render(context);
            return;
        }
        if (this.characterPopupVisible) {
            // make background darker
            context.fillStyle = "rgba(0, 0, 0, 0.5)";
            context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
            
            this.characterPopupComponent?.render(context);
            return;
        }
    }

    update(){
        this.wardenSprite.update();
        this.swordsmanSprite.update();
        this.druidSprite.update();
    }

    handleClick(x: number, y: number, devicePixelRatio: number) {
        this.choosePlayerButton?.handleClick(x, y, devicePixelRatio);
        this.choosePetButton?.handleClick(x, y, devicePixelRatio);
        this.chooseWeaponBox?.handleClick(x, y, devicePixelRatio);

        if (this.characterPopupVisible) {
            this.characterPopupComponent?.handleClick(x, y, devicePixelRatio);
            return
        }
        for (let i = 0; i < this.characterData.length; i++) {
            if (this.playerBox[i].isClicked(x, y, devicePixelRatio)) {
                this.characterPopupVisible = true;
                const { name, sprite, description, rarity, unlocked } = this.characterData[i];
                if (this.characters)
                console.log("characters", this.characters[name as keyof Characters]?.stats)
                if (this.currentCharacter) {
                    this.currentCharacter = name;
                }
                let title = "";
                if (name === "knight") {
                    title = "Knight"
                } else if (name === "swordsmaster") {
                    title = "Swords Master"
                } else if (name === "druid") {
                    title = "Druid"
                }
                console.log("title", title)
                const characterStats = this.characters ? this.characters[name as keyof Characters]?.stats : undefined;
                if (!characterStats) return;
                if (this.characters) {
                    this.characterPopupComponent?.updateInfo(sprite, title, description, characterStats, rarity, this.characters[name as keyof Characters]?.level, unlocked);

                }

            };
        }
        if (this.popupVisible) {
            this.itemPopupComponent?.handleClick(x / devicePixelRatio, y / devicePixelRatio, devicePixelRatio);
        }
        
    }

    showPopup() {
        this.popupVisible = true;
    }
    closePopup() {
        console.log("closing pop up")
        this.popupVisible = false;
    }
    showCharacterPopup() {
        this.characterPopupVisible = true;
    }
    closeCharacterPopup() {
        this.characterPopupVisible = false;
    }

    updateWeaponPopup(inventory : {title: string, description?: string, stats?: Stats, level?: number, currentWeapon?: number, gold?: number}) {
        this.itemPopupComponent?.updateInfo(inventory);
    }
    updateWeapon(weapons: Weapons) {
        this.weapons = weapons;
        this.itemPopupComponent?.updateWeapon(this.weapons[this.currentWeapon]);
        if (weapons[this.currentWeapon]) {
            const sprite = getSprite(this.weapons[this.currentWeapon].name);
            this.weaponSprite = sprite
        }
    }
    updateCharacter(currentCharacter: string) {
        this.currentCharacter = currentCharacter;
    }
    updateCharacterPopup(character : Characters) {
        this.characters = character;
        console.log("update character popup", character)
        if (this.characterPopupComponent) {
            this.characterPopupComponent.playerStats = character[this.currentCharacter as keyof Characters].stats;
            this.characterPopupComponent.level = character[this.currentCharacter as keyof Characters].level;
        }
    };
    updateGold(gold: number) {
        this.gold = gold;
    }
    updateUsername(username: string) {
        this.username = username;
    }

    levelingWeapon() {
        this.upgradeWeapon(this.currentWeapon);
        // this.updateProfile()
    }

    async levelingCharacter() {
        console.log("leveling character")
        await upgradeCharacter(this.username, this.currentCharacter);
        await this.fetchProfile();
        console.log("leveling asdas")
    };
};