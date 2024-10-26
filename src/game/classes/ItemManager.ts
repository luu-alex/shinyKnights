import Item from './Item';
import { ItemType } from './Item';
import Sprite from '../Sprite';
import Player from './Player';

export default class ItemManager {
    private items: Item[] = [];
    private player: Player;

    constructor(player: Player) {
        this.player = player;
    }

    // Add a new item (e.g., when an enemy dies)
    public dropItem(x: number, y: number) {
        const chance = Math.random();
        let item: Item | null = null;

        if (chance < 0.5) { // 50% chance to drop an item (adjust probability as needed)
            const itemType = Math.random() < 0.95 ? ItemType.Coin : ItemType.HealthPotion;
            const itemSprite = new Sprite('items/coin.png', 9, 9, 1, 100); // Use the appropriate sprite
            item = new Item(x, y, itemType, itemSprite, this.player);
        }

        if (item) {
            this.items.push(item);
        }
    }

    // Update all items and check if the player collects any
    public update() {
        this.items = this.items.filter(item => !item.collected); // Remove collected items

        for (const item of this.items) {
            item.update(this.player.x, this.player.y); // Check if player collects the item
        }
    }

    // Render all items on the canvas
    public render(context: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
        for (const item of this.items) {
            item.render(context, cameraX, cameraY);
        }
    }
}
