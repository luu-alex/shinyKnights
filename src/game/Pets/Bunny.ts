import Sprite from '../Sprite';
import Player from '../classes/Player';
import Pet from './Pet';

export default class Bunny extends Pet {
    private itemFindCooldown: number;  // Time between finding items
    private itemFindTimer: number;     // Tracks when the bunny will find the next item

    constructor(player: Player) {
        const petIdleSprite = new Sprite('pets/MiniBunny.png', 32, 32, 4, 100);
        const petWalkSprite = new Sprite('pets/MiniBunny.png', 32, 32, 4, 100, 1); // Assuming Bunny might walk in future
        super('bunny', [petIdleSprite, petWalkSprite], player);

        this.itemFindCooldown = 30;  // 5 seconds cooldown for finding items
        this.itemFindTimer = this.itemFindCooldown;  // Start with full timer
    }

    // Update the bunny's state and behavior
    update(delta: number) {
        this.itemFindTimer -= delta;
        if (this.state === 'findItem' && this.itemFindTimer <= 25) {
            this.state = 'idle';
        } 

        // Check if it's time to find an item
        if (this.itemFindTimer <= 0) {
            this.state = 'findItem';
            this.currentSprite = this.sprites[1];
            this.findItem();
            this.itemFindTimer = this.itemFindCooldown;  // Reset the timer
        }

        // Handle idle behavior (could be more complex in the future)
        if (this.state === 'idle') {
            this.handleIdle();
        }
        this.currentSprite.update();
    }

    // Handle idle state
    handleIdle() {
        this.currentSprite = this.sprites[0];  // Idle sprite
    }

    // This will be the placeholder for finding items
    findItem() {
        // Future logic for finding an item will go here
    }

    render(context: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
        this.currentSprite.render(context, this.x - cameraX, this.y - cameraY, 2);

        // Debug rectangle (optional)
        // context.strokeStyle = 'green';
        // context.strokeRect(this.x + this.sprites[0].frameWidth, this.y + this.sprites[0].frameHeight, this.width, this.height);
        // context.stroke();
    }
}
