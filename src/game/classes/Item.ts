import Sprite from '../Sprite';
import Player from './Player';

export enum ItemType {
    Coin,
    HealthPotion,
    PowerUp,
}

export default class Item {
    public x: number;
    public y: number;
    public type: ItemType;
    public sprite: Sprite;
    public collected: boolean = false;
    public player: Player;

    constructor(x: number, y: number, type: ItemType, sprite: Sprite, player: Player) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.sprite = sprite;
        this.player = player;
    }

    update(playerX: number, playerY: number) {
        // Check if player is close enough to pick up the item (using a threshold distance)
        const distance = Math.sqrt((this.x - playerX) ** 2 + (this.y - playerY) ** 2);
        if (distance < 30) { // Adjust the threshold distance for pickup
            this.collected = true; // Mark the item as collected
            this.applyEffect(); // Apply item effect (e.g., health increase, coin collection)
        }
    }

    // Apply the effect of the item (e.g., increase player's health, give coins)
    private applyEffect() {
        console.log("applying type", this.type);
        switch (this.type) {
            case ItemType.Coin:
                // Add coins to the player's currency
                this.player.gold += 1;
                break;
            case ItemType.HealthPotion:
                // Restore health to the player
                console.log('Player restored health!');
                break;
            case ItemType.PowerUp:
                // Apply a power-up to the player
                console.log('Player received a power-up!');
                break;
        }
    }

    // Render the item on the canvas
    render(context: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
        this.sprite.render(context, this.x - cameraX, this.y - cameraY, 2);
    }
}
