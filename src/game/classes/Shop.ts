import Player from "./Player";
import { primaryColorBackground, lightBlueButton, darkGreenText, whiteText, darkerGreenBackground, lighterGreenBackground } from "../colors";
import { wrapText } from '../utils';
import Sprite from "../Sprite";
import { Button } from "../../components/Button";
import { Fireball } from "../skills/Fireball";
import { LightningSkill } from "../skills/Lightning";
import ArthurSwordSkill from "../skills/Arthur";
import { HolyCircle } from "../skills/HolyCircle";
import PetManager from "../Pets/PetManager";
import Bear from "../Pets/Bear";
import Bunny from "../Pets/Bunny";
import Boar from "../Pets/Boar";
import ItemManager from "./ItemManager";
import "../fonts/fonts.module.css";
export class Shop {
    private player: Player;
    private itemsToBuy: { name: string, cost: number, description: string, sprite: Sprite, bought: boolean, scale?: number, translate?: { x: number, y: number} }[] = [];
    private items: { name: string, cost: number, description: string, sprite: Sprite, bought: boolean, unique: boolean, scale?: number, translate?: { x: number, y: number} }[] = [
        { name: "Worn out Shoes", cost: 3, description: "+3 speed", sprite: new Sprite('shopIcons/wornShoes.png', 16, 16, 1, 100), bought: false, unique: true },
        { name: "Tooth Necklace", cost: 2, description: "+5 Pet Damage", sprite: new Sprite('shopIcons/toothNecklace.png', 16, 16, 1, 100), bought: false, unique: false },
        { name: "Topaz", cost: 3, description: "+1 monster drop rate.", sprite: new Sprite('shopIcons/topaz.png', 16, 16, 1, 100), bought: false, unique: false},
        { name: "Arthurs Sword", cost: 10, description: "Skill: Summon Arthurs sword. Scales with Strength ", sprite: new Sprite('shopIcons/arthurSword.png', 16, 16, 1, 100), bought: false, unique: true },
        { name: "Buckler", cost: 1, description: "+10 HP", sprite: new Sprite('shopIcons/buckler.png', 16, 16, 1, 100), bought: false, unique: false },
        { name: "Blue Necklace", cost: 1, description: "+2 Magic damage, will be added next update :)", sprite: new Sprite('shopIcons/saphireNecklace.png', 16, 16, 1, 100), bought: false, unique: false },
        { name: "Lightning", cost: 3, description: "Skill: Casts a powerful magic spell. ", sprite: new Sprite('shopIcons/lightningScroll.png', 16, 16, 1, 100), bought: false, unique: true },
        { name: "Holy Circle", cost: 0, description: "A ranged weapon", sprite: new Sprite('shopIcons/holyCircle.png', 16, 16, 1, 100), bought: false, unique: true },
        { name: "Witches Apple", cost: 2, description: "+3 HP gained from consumables. +2 Magic damage.", sprite: new Sprite('shopIcons/apple.png', 16, 16, 1, 100), bought: false, unique: false },
        { name: "War Helmet", cost: 3, description: "+3 Strength. +10 HP", sprite: new Sprite('shopIcons/warHelmet.png', 16, 16, 1, 100), bought: false, unique: false },
        { name: "Fireball", cost: 3, description: "A skill", sprite: new Sprite('shopIcons/fireballScroll.png', 16, 16, 1, 100), bought: false, unique: true},
        { name: "Bear", cost: 3, description: "A pet bear will fight for you!", sprite: new Sprite('pets/MiniBear.png', 32, 32, 1, 100), bought: false, unique: true, scale: 1.5, translate: { x: 0, y: -26 } },
        { name: "Bunny", cost: 3, description: "A bunny will help dig and find items for you!", sprite: new Sprite('pets/MiniBunny.png', 32, 32, 1, 100), bought: false, unique: true, scale: 2, translate: { x: 0, y: -32 } },
        { name: "Boar", cost: 2, description: "A boar that will charge at enemies and attack.", sprite: new Sprite('pets/MiniBoar.png', 32, 32, 1, 100), bought: false, unique: true, scale: 1.7, translate: { x: 0, y: -32 } },
        
    ];
    public isVisible: boolean = false;
    private continueButton: Button | null = null;
    public canvas: HTMLCanvasElement | null = null;
    private nextRoundCallback: () => void = () => { };
    private devicePixelRatio: number = window.devicePixelRatio || 1;
    private buyButtons: Button[] = [];
    private reRollButton: Button | null = null;
    private petManager: PetManager;
    private itemManager: ItemManager;

    constructor(player: Player, nextRound: () => void, petManager: PetManager, itemManager: ItemManager) {
        this.player = player;
        this.nextRoundCallback = nextRound;
        this.petManager = petManager;
        this.itemManager = itemManager;
    }
    public init(canvas: HTMLCanvasElement, devicePixelRatio: number) {
        this.canvas = canvas;
        this.devicePixelRatio = devicePixelRatio;
        const adjustedWidth = canvas.width / devicePixelRatio;
        const adjustedHeight = canvas.height / devicePixelRatio;

        // Create the "Continue" button
        this.continueButton = new Button(
            adjustedWidth * 0.2,
            adjustedHeight * 0.85,
            adjustedWidth * 0.6,
            adjustedHeight * 0.1,
            "Continue",
            this.nextRoundCallback,
            lightBlueButton,
            adjustedHeight * 0.04
        );

        this.buyButtons = this.items.map((item, i) => {
            const buttonX = adjustedWidth * 0.08 + adjustedWidth * 0.29 * i;
            const buttonY = adjustedHeight * 0.74;
            const buttonWidth = adjustedWidth * 0.27;
            const buttonHeight = adjustedHeight * 0.05;
            return new Button(
                buttonX,
                buttonY,
                buttonWidth,
                buttonHeight,
                `Buy: ${item.cost}`,
                () => this.buyItem(item),
                darkGreenText,
                adjustedHeight * 0.02
            );
        });

        this.reRollButton = new Button(
            adjustedWidth * 0.65,
            adjustedHeight * 0.26,
            adjustedWidth * 0.27,
            adjustedHeight * 0.05,
            "Re-roll: 1",
            () => { this.rerollItems()},
            darkGreenText,
            adjustedHeight * 0.02
        );
        
    }

    

    // Show the shop
    public show() {
        this.isVisible = true;
    }

    // Hide the shop
    public hide() {
        this.isVisible = false;
    }

    // Render the shop UI

    private renderItemNameBox(context: CanvasRenderingContext2D, itemName: string, itemX: number, itemY: number, boxWidth: number, boxHeight: number, canvasHeight: number) {

        context.fillStyle = lighterGreenBackground;
        const radius = 5; // Radius for rounded corners, adjust as needed

        context.beginPath();
        context.moveTo(itemX + radius, itemY);
        context.lineTo(itemX + boxWidth - radius, itemY);
        context.quadraticCurveTo(itemX + boxWidth, itemY, itemX + boxWidth, itemY + radius);
        context.lineTo(itemX + boxWidth, itemY + boxHeight - radius);
        context.quadraticCurveTo(itemX + boxWidth, itemY + boxHeight, itemX + boxWidth - radius, itemY + boxHeight);
        context.lineTo(itemX + radius, itemY + boxHeight);
        context.quadraticCurveTo(itemX, itemY + boxHeight, itemX, itemY + boxHeight - radius);
        context.lineTo(itemX, itemY + radius);
        context.quadraticCurveTo(itemX, itemY, itemX + radius, itemY);
        context.closePath();
        context.fill();

        context.fillStyle = whiteText;
        context.font = `700 ${canvasHeight * 0.0125}px DePixelHalbfett`;
        const textWidth = context.measureText(itemName).width;

        // Calculate the X position to center the text inside the box
        const textX = itemX + (boxWidth - textWidth) / 2;

        // Calculate the Y position for the text to vertically center it (approximation)
        const textY = itemY + (boxHeight / 2) + (canvasHeight * 0.01); // Adjust slightly for vertical centering

        // Render the text
        context.fillText(itemName, textX, textY);
    };

    public renderItemBox( context: CanvasRenderingContext2D, itemX: number, itemY: number, boxWidth: number, boxHeight: number, canvasHeight: number, description: string, sprite: Sprite, customScale?: number, translate?: { x: number, y: number }) {

        const radius = 5; // Radius for rounded corners, adjust as needed
        context.fillStyle = lighterGreenBackground;

        context.beginPath();
        context.moveTo(itemX + radius, itemY);
        context.lineTo(itemX + boxWidth - radius, itemY);
        context.quadraticCurveTo(itemX + boxWidth, itemY, itemX + boxWidth, itemY + radius);
        context.lineTo(itemX + boxWidth, itemY + boxHeight - radius);
        context.quadraticCurveTo(itemX + boxWidth, itemY + boxHeight, itemX + boxWidth - radius, itemY + boxHeight);
        context.lineTo(itemX + radius, itemY + boxHeight);
        context.quadraticCurveTo(itemX, itemY + boxHeight, itemX, itemY + boxHeight - radius);
        context.lineTo(itemX, itemY + radius);
        context.quadraticCurveTo(itemX, itemY, itemX + radius, itemY);
        context.closePath();
        context.fill();

        // create a smaller box for the picture of the item
        const itemBoxWidth = boxWidth * 0.9;
        const itemBoxHeight = boxHeight * 0.5;
        const itemBoxX = itemX + (boxWidth - itemBoxWidth) / 2;
        const itemBoxY = itemY + boxHeight * 0.025;

        context.fillStyle = darkerGreenBackground;

        context.beginPath();
        context.moveTo(itemBoxX + radius, itemBoxY);
        context.lineTo(itemBoxX + itemBoxWidth - radius, itemBoxY);
        context.quadraticCurveTo(itemBoxX + itemBoxWidth, itemBoxY, itemBoxX + itemBoxWidth, itemBoxY + radius);
        context.lineTo(itemBoxX + itemBoxWidth, itemBoxY + itemBoxHeight - radius);
        context.quadraticCurveTo(itemBoxX + itemBoxWidth, itemBoxY + itemBoxHeight, itemBoxX + itemBoxWidth - radius, itemBoxY + itemBoxHeight);
        context.lineTo(itemBoxX + radius, itemBoxY + itemBoxHeight);
        context.quadraticCurveTo(itemBoxX, itemBoxY + itemBoxHeight, itemBoxX, itemBoxY + itemBoxWidth - radius);
        context.lineTo(itemBoxX, itemBoxY + radius);
        context.quadraticCurveTo(itemBoxX, itemBoxY, itemBoxX + radius, itemBoxY);
        context.closePath();
        context.fill();

        // Render description below the image
        const descriptionX = itemX + (boxWidth * 0.05);
        const descriptionY = itemY + boxHeight * 0.6;
        const maxDescriptionWidth = boxWidth * 0.9;
        const lineHeight = canvasHeight * 0.02;
        
        // Calculate the scaling factor and the new size of the sprite
        // Calculate the scaling factor and the new size of the sprite
    const targetSpriteSize = 80;
    const baseScaleFactor = targetSpriteSize / Math.max(sprite.frameWidth, sprite.frameHeight);

    // If a custom scale is provided (e.g., for Bunny), apply it; otherwise, use base scaling
    const scaleFactor = customScale ? baseScaleFactor * customScale : baseScaleFactor;

    const scaledWidth = sprite.frameWidth * scaleFactor;
    const scaledHeight = sprite.frameHeight * scaleFactor;

    const translateY = translate ? translate.y : 0;
    const translateX = translate ? translate.x : 0;

    // Center the sprite inside the image box, both horizontally and vertically
    const spriteX = itemBoxX + translateX + (itemBoxWidth - scaledWidth) / 2;
    // Adjust the Y-axis to ensure the scaled sprite is properly centered vertically
    const spriteY = itemBoxY + translateY + (itemBoxHeight - scaledHeight) / 2;

    // Render the sprite with the calculated scaling factor
    sprite.render(context, spriteX, spriteY, scaleFactor);

        // Use the wrapText utility to get the lines
        const lines = wrapText(context, description, maxDescriptionWidth);

        // Render each line of the description
        context.fillStyle = whiteText;
        context.font = `${canvasHeight * 0.015}px depixel`;

        for (let i = 0; i < lines.length && i < 3; i++) { // Limit to 3 lines
            context.fillText(lines[i], descriptionX, descriptionY + i * lineHeight);
        }

    }

    public renderBuyButton(context: CanvasRenderingContext2D, itemX: number, itemY: number, boxWidth: number, boxHeight: number, canvasHeight: number, cost: number) {
        context.fillStyle = darkGreenText;
        const radius = 5; // Radius for rounded corners, adjust as needed

        context.beginPath();
        context.moveTo(itemX + radius, itemY);
        context.lineTo(itemX + boxWidth - radius, itemY);
        context.quadraticCurveTo(itemX + boxWidth, itemY, itemX + boxWidth, itemY + radius);
        context.lineTo(itemX + boxWidth, itemY + boxHeight - radius);
        context.quadraticCurveTo(itemX + boxWidth, itemY + boxHeight, itemX + boxWidth - radius, itemY + boxHeight);
        context.lineTo(itemX + radius, itemY + boxHeight);
        context.quadraticCurveTo(itemX, itemY + boxHeight, itemX, itemY + boxHeight - radius);
        context.lineTo(itemX, itemY + radius);
        context.quadraticCurveTo(itemX, itemY, itemX + radius, itemY);
        context.closePath();
        context.fill();

        context.fillStyle = whiteText;
        context.font = `${canvasHeight * 0.02}px depixel`;
        const textWidth = context.measureText("Buy: " + cost.toString()).width;

        // Calculate the X position to center the text inside the box
        const textX = itemX + (boxWidth - textWidth) / 2;

        // Calculate the Y position for the text to vertically center it (approximation)
        const textY = itemY + (boxHeight / 2) + (canvasHeight * 0.01); // Adjust slightly for vertical centering

        // Render the text
        context.fillText("Cost: " + cost, textX, textY);
    };
    public render(context: CanvasRenderingContext2D) {
        if (!this.isVisible) return;
        if (!this.canvas) return;
        const canvasWidth = this.canvas.width / this.devicePixelRatio;
        const canvasHeight = this.canvas.height / this.devicePixelRatio;

        const shopWidth = canvasWidth * 0.9;
        const shopHeight = canvasHeight * 0.6;
        const shopX = canvasWidth * 0.05;
        const shopY = canvasHeight * 0.2;

        context.shadowColor = 'rgba(0, 0, 0, 0.5)';
        context.shadowBlur = 15;
        context.shadowOffsetX = 5;
        context.shadowOffsetY = 5;



        context.fillStyle = primaryColorBackground; // Dark background
        context.fillRect(shopX, shopY, shopWidth, shopHeight);

        context.shadowBlur = 0;  // Disable shadow for the outline
        context.strokeStyle = 'black';
        context.lineWidth = 3;  // Make the outline thick
        context.strokeRect(shopX, shopY, shopWidth, shopHeight);


        context.shadowBlur = 0;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;

        context.fillStyle = darkGreenText;
        context.font = `${canvasHeight * 0.04}px depixel`;
        context.fillText('Shop', shopX + shopWidth / 2 - canvasWidth*0.10, shopY + canvasHeight * 0.05);
        // context.fillText(`Gold: ${this.player.gold}`, shopX + canvasWidth*0.05, shopY + canvasHeight * 0.1);

        // Layout for items: column-based display
        for (let i = 0; i < this.itemsToBuy.length; i++) {
            this.renderItemNameBox(context, this.itemsToBuy[i].name, shopX + canvasWidth * 0.03 + canvasWidth * 0.29 * i  , shopY + canvasHeight * 0.12, canvasWidth * 0.27 , canvasHeight * 0.05, canvasHeight);
            this.renderItemBox(context, shopX + canvasWidth * 0.03 + canvasWidth * 0.29 * i, shopY + canvasHeight * 0.12 + canvasHeight * 0.05 + canvasHeight * 0.01, canvasWidth * 0.27 , canvasHeight * 0.35, canvasHeight, this.itemsToBuy[i].description, this.itemsToBuy[i].sprite, this.itemsToBuy[i].scale, this.itemsToBuy[i].translate);
            // this.renderBuyButton(context, shopX + canvasWidth * 0.03 + canvasWidth * 0.29 * i, shopY + canvasHeight * 0.12 + canvasHeight * 0.05 + canvasHeight * 0.01 + canvasHeight * 0.35 + canvasHeight * 0.01, canvasWidth * 0.27 , canvasHeight * 0.05, canvasHeight, this.items[i].cost);
            if (!this.itemsToBuy[i].bought) {
                this.buyButtons[i].render(context);
            }
        }
        this.reRollButton?.render(context);

        context.font = `${canvasHeight * 0.02}px depixel`;


        this.continueButton?.render(context);
        
    }

    public handleInteraction(x: number, y: number, devicePixelRatio: number) {
        this.continueButton?.handleClick(x, y, devicePixelRatio);
        this.buyButtons.forEach(button => button.handleClick(x, y, devicePixelRatio));
        this.reRollButton?.handleClick(x, y, devicePixelRatio);
    }

    private buyItem(item: { name: string, cost: number }) {
        console.log(item.name)
        // check if item is already bought
        if (this.itemsToBuy.some(thisItem => thisItem.name === item.name && thisItem.bought)) {
            return;
        }
        if (this.player.gold >= item.cost ) {
            this.player.gold -= item.cost;
            this.applyItemEffect(item.name);
            console.log(`Bought ${item.name}`);
            this.itemsToBuy.forEach(itemToBuy => {
                if (itemToBuy.name === item.name) {
                    itemToBuy.bought = true;
                }
            });
            this.items.forEach(thisItem => {
                if (thisItem.name === item.name && thisItem.unique) {
                    thisItem.bought = true;
                }
            })
        } else {
            console.log('Not enough gold!');
        }
    }

    // Apply the item's effect to the player
    private applyItemEffect(itemName: string) {
        switch (itemName) {
            case 'Buckler':
                this.player.hp += 10; // Increase player HP
                break;
            case 'War Helmet':
                this.player.strength += 3;
                this.player.currentWeapon.damage += 3;
                this.player.maxHP += 10; // Increase player HP
                break;
            case 'Speed Boost':
                this.player.speed += 10; // Increase player speed
                break;
            case 'Fireball':
                const fireball = new Fireball(this.player, this.player.projectileManager);
                this.player.learnSkill(fireball);
                break;
            case 'Lightning':
                const lightning = new LightningSkill(this.player);
                this.player.learnSkill(lightning);
                break;
            case 'Arthurs Sword':
                const arthurs = new ArthurSwordSkill(this.player);
                this.player.learnSkill(arthurs);
                break;
            case 'Holy Circle':
                const holyCircle = new HolyCircle(this.player);
                this.player.learnSkill(holyCircle);
                break;
            case 'Bear':
                const bear = new Bear(this.player);
                this.petManager.addPet(bear);
                break; 
            case 'Bunny':
                const bunny = new Bunny(this.player, this.itemManager);
                this.petManager.addPet(bunny);
                break;
            case 'Boar':
                const boar = new Boar(this.player);
                this.petManager.addPet(boar);
                break;
            case 'Topaz':
                // Increase monster drop rate
                break;
            default:
                break;
        }
    }
    public randomizeItems() {
        // Select a random subset of items from the item pool
        const shuffledItems = this.items.sort(() => 0.5 - Math.random());
        // remove bought items from this.items
        const newShuffledItems = shuffledItems.filter(item => !item.bought);

        this.itemsToBuy = newShuffledItems.slice(0, 3); // Select 3 random items, you can adjust this number

        this.updateBuyButtons(); // Reinitialize the buy buttons based on the new items
    }
    private rerollItems() {
        if (this.player.gold === 0) {
            return;
        }
        this.player.gold -=1;
        this.randomizeItems();
    }
    private updateBuyButtons() {
        if (!this.canvas) return;
        
        const canvasWidth = this.canvas.width / this.devicePixelRatio;
        const canvasHeight = this.canvas.height / this.devicePixelRatio;
    
        // Clear the current buttons
        this.buyButtons = [];
    
        // Create buy buttons for the items to buy (randomized items)
        this.buyButtons = this.itemsToBuy.map((item, i) => {
            const buttonX = canvasWidth * 0.08 + canvasWidth * 0.29 * i;
            const buttonY = canvasHeight * 0.74;
            const buttonWidth = canvasWidth * 0.27;
            const buttonHeight = canvasHeight * 0.05;
    
            return new Button(
                buttonX,
                buttonY,
                buttonWidth,
                buttonHeight,
                `Buy: ${item.cost}`,
                () => this.buyItem(item),
                darkGreenText,
                canvasHeight * 0.02
            );
        });
    }
}    
