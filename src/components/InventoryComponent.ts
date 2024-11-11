import { unlockChest } from "../apiCalls/serverCalls";
import Sprite from "../game/Sprite";
import { darkBlueText, grayText, lightBrownBackground, primaryBrownBackground } from "../game/colors";
import { ItemInventory } from "../game/types";
import { drawRoundedBox, getDescription, getSprite, getTitle } from "../game/utils";
import { BoxComponent } from "./BoxComponent";
import { LoadingComponent } from "./LoadingComponent";
import { PopupComponent } from "./PopupComponent";
import { UnlockComponent } from "./UnlockComponent";

export class InventoryComponent {
    private canvasWidth;
    private canvasHeight;
    private inventory: ItemInventory[] = [];
    private itemData: {sprite: Sprite, name: string, description: string, rarity: string, id: number}[] = [];
    private itemBox: BoxComponent[] = [];
    private popup: PopupComponent | null = null;
    private fetchProfile: () => void;
    public username: string = "";
    private loadingComponent: LoadingComponent;
    private isLoading: boolean = false;
    private unlockComponent: UnlockComponent | null = null;


    
    constructor(canvasWidth: number, canvasHeight: number, fetchProfile: () => void) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.fetchProfile = fetchProfile;
        this.loadingComponent = new LoadingComponent(canvasWidth, canvasHeight);
        this.unlockComponent = new UnlockComponent(this.canvasWidth, this.canvasHeight, "Spear", () => {}, () => {});
    }
    updateInventory(inventory: ItemInventory[]) {
        this.inventory = inventory;
        this.itemData = [];
        this.itemBox = [];
        for (let i = 0; i < this.inventory.length; i++) {
            const { name, rarity, id } = this.inventory[i];
            this.itemData.push({
                sprite: getSprite(name),
                name: name,
                description: getDescription(name),
                rarity: rarity,
                id: id
            });
            this.itemBox.push(new BoxComponent(this.canvasWidth * 0.02 + (this.canvasWidth * 0.17 + this.canvasWidth * 0.02) * (i % 5), this.canvasHeight * 0.35 + this.canvasHeight * 0.11 * Math.floor(i / 5), this.canvasWidth * 0.17, this.canvasHeight * 0.17, () => {this.createPopup(this.inventory[i])}));
        }
    }
    render(context: CanvasRenderingContext2D) {
        // Set the font and style for the coin text
        // console.log("inventory component", this.inventory)
        context.fillStyle = darkBlueText;
        context.font = `${this.canvasHeight * 0.06}px depixel`;
    
        // Measure the width of the coin text
        const title = "Inventory";
        const textMetrics = context.measureText(title);
        const textWidth = textMetrics.width;
    
        // Calculate the X position to center the text within the box
        const boxX = this.canvasWidth * 0.05;
        const boxWidth = this.canvasWidth * 0.9;
        const centeredX = boxX + (boxWidth - textWidth) / 2;
        getSprite
    
        // Render the centered text
        context.fillText(title, centeredX, this.canvasHeight * 0.16);

        drawRoundedBox(context, this.canvasWidth * 0, this.canvasHeight * 0.3, this.canvasWidth, this.canvasHeight * 0.8, 1, primaryBrownBackground, 4);

        // draw perfect squares
        const squareSize = Math.min(this.canvasWidth, this.canvasHeight) * 0.17;
        // fit five squares in the canvas
        // should be drawn in a loop for columns and rows
        for (let j = 0; j < 5; j++) {
            for (let i = 0; i < 5; i++) {
                drawRoundedBox(context, this.canvasWidth * 0.02 + (squareSize * i) + i * this.canvasWidth * 0.02, this.canvasHeight * 0.35 + this.canvasHeight * 0.11 * j, squareSize, squareSize, 6, lightBrownBackground, 2);
                // drawRoundedBox(context, this.canvasWidth * 0.05 + (squareSize * i) + i * this.canvasWidth * 0.01, this.canvasHeight * 0.3 + squareSize + this.canvasHeight * 0.02 + this.canvasHeight * 0.02 * j, squareSize, squareSize, 10, darkBrownBackground, 2);
            }
        }
        for (let i = 0; i < this.itemData.length; i++) {
        const column = Math.floor(i / 5);
        const row = i % 5;
        const item = this.itemData[i];
        const box = this.itemBox[i];

        const boxX = this.canvasWidth * 0.02 + (squareSize * row) + row * this.canvasWidth * 0.02;
        const boxY = this.canvasHeight * 0.35 + this.canvasHeight * 0.11 * column;
        const color = item.rarity === "common" ? "gray" : item.rarity === "rare" ? "blue" : item.rarity === "epic" ? "purple" : lightBrownBackground;
        const customScale = 1;
        const translate = {x: 0, y:0}
        // Render the item box
        box.render(context, boxX, boxY, squareSize, squareSize, 6, color, 2);

        // Calculate scale and position for the sprite inside the box
        const targetSpriteSize = 50;
        const baseScaleFactor = targetSpriteSize / Math.max(item.sprite.frameWidth, item.sprite.frameHeight);
        const scaleFactor = baseScaleFactor * (customScale ?? 1);

        const scaledWidth = item.sprite.frameWidth * scaleFactor;
        const scaledHeight = item.sprite.frameHeight * scaleFactor;

        const spriteX = boxX + (squareSize - scaledWidth) / 2 + (translate?.x ?? 0);
        const spriteY = boxY + (squareSize - scaledHeight) / 2 + (translate?.y ?? 0);

        // Render the sprite with scaling and centering
        item.sprite.render(context, spriteX, spriteY, scaleFactor);
    }
        if (this.isLoading) {
            this.loadingComponent.render(context);
        }
        this.popup?.render(context);
        if (this.unlockComponent?.isVisible) {
            this.unlockComponent?.render(context);
        }
        
    }
    handleClick(x: number, y: number, devicePixelRatio: number) {
        if (this.isLoading) return;
        for (let i = 0; i < this.itemBox.length; i++) {
            const box = this.itemBox[i];
            box.handleClick(x, y, devicePixelRatio);
        }
        console.log("handle click inventory")
        console.log(this.unlockComponent?.isVisible)
        if (this.popup) {
            this.popup.handleClick(x / devicePixelRatio, y / devicePixelRatio, devicePixelRatio);
        }
        if (this.unlockComponent?.isVisible) {
            this.unlockComponent?.handleClick(x, y, devicePixelRatio);
        }

    }
    createPopup(item: ItemInventory) {
        const { name, rarity, id, type } = item;
        let buttonAction = "Do something"
        if (id === 1) {
            buttonAction = "Unlock"
        }
        const title = getTitle(name);
        this.popup = new PopupComponent(this.canvasWidth, this.canvasHeight, title, () => {this.handleChest(id)}, () => { this.popup = null; console.log("handle click") }, rarity, buttonAction);
        this.popup.updateInfo({description: getDescription(name), itemSprite: getSprite(name), type});
    }
    async handleChest(chestID: number) {
        this.popup = null;
        this.isLoading = true;
        const unlocked = await unlockChest(this.username, chestID);
        console.log("unlocked", unlocked);
        await this.fetchProfile();
        this.isLoading = false;
        this.unlockComponent?.update(unlocked.name);
        this.unlockComponent?.show();

        

    }
    updateUsername(username: string) {
        this.username = username;
    }

};