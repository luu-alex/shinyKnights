import Sprite from '../Sprite';
import Player from '../classes/Player';
import Pet from './Pet';
import Enemy from '../classes/Enemy';
import { isColliding, findClosestEnemy } from '../utils'; // Assuming you have a collision utility

export default class Boar extends Pet {
    private attackCooldown: number;  // Cooldown between attacks (in milliseconds)
    private attackTimer: number;     // Timer to track cooldown between attacks
    private currentTarget: Enemy | null;  // Current enemy target
    public attackRange: number;     // Range within which the boar will attack
    public attackPower: number = 10; // Damage dealt per attack
    private movingRight: boolean = true;

    constructor(player: Player) {
        const petIdleSprite = new Sprite('pets/MiniBoar.png', 32, 32, 4, 100);
        const petWalkSprite = new Sprite('pets/MiniBoar.png', 32, 32, 4, 100, 1);
        const petAttackSprite = new Sprite('pets/MiniBoar.png', 32, 32, 5, 200, 3);
        super('boar', [petIdleSprite, petWalkSprite, petAttackSprite], player);

        this.attackCooldown = 1.5;  // 2 seconds cooldown between attacks
        this.attackTimer = 0;        // Initialize with no cooldown
        this.currentTarget = null;   // No target initially
        this.attackRange = 1000;      // Attack range, adjust as needed
        this.speed = 200;
    }

    // Update the boar's state and behavior
    update(delta: number, enemies: Enemy[]) {
        this.attackTimer -= delta;

        // Find the nearest enemy if not currently targeting
        if (!this.currentTarget || !isColliding(this, this.currentTarget)) {
            this.currentTarget = findClosestEnemy(enemies, this);
        }

        // If there's a target and within range, attack
        if (this.currentTarget && this.isInRange(this.currentTarget)) {
            this.handleAttack(enemies, delta);
        } else {
            this.handleIdle(); // If no valid target, remain idle
        }
    }

    // Handle idle behavior
    handleIdle() {
        this.currentSprite = this.sprites[1]; // Idle sprite
        this.currentSprite.update();
    }

    // Handle attacking the nearest enemy
    handleAttack(_ : Enemy[], delta: number) {
        // this.currentSprite = this.sprites[1]; // Switch to attack sprite
        this.currentSprite.update();
        // make sure the target is still valid
        if (this.currentTarget && this.currentTarget.hp <= 0) {
            this.currentTarget = null; // Reset target if dead
            return;
        }

        
        if (this.currentTarget && this.attackTimer <= 0) {
            // Calculate the distance between the Boar and the enemy
            const distance = Math.hypot(this.currentTarget.x - this.x, this.currentTarget.y - this.y);
    
            if (distance > 1) { // Continue moving towards enemy until close enough (tolerance 1 pixel)
                // Move towards the enemy
                const angle = Math.atan2(this.currentTarget.y - this.y, this.currentTarget.x - this.x);
                this.x += Math.cos(angle) * this.speed * delta;
                this.y += Math.sin(angle) * this.speed * delta;
                this.movingRight = this.player.x > this.x;
            } else {
                // If the Boar is directly on top of the enemy, deal damage
                this.currentTarget.takeDamage(this.attackPower); // Deal damage
                this.attackTimer = this.attackCooldown;  // Reset cooldown
                this.currentSprite = this.sprites[2]; // Switch to attack sprite
            }
        }
    }

    // Check if the target is within attack range
    isInRange(target: Enemy): boolean {
        return Math.hypot(target.x - this.x, target.y - this.y) < this.attackRange;
    }

    // Render the boar on the canvas
    render(context: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
        context.save(); // Save the current state of the canvas
    
        const screenX = this.x - cameraX;
        const screenY = this.y - cameraY;
    
        if (!this.movingRight) {
            // Flip the canvas horizontally when moving left
            context.scale(-1, 1);
            // Adjust the x position because we flipped the canvas and incorporate camera position
            this.currentSprite.render(context, -(screenX + this.sprites[0].frameWidth * 2), screenY, 2);
        } else {
            // Render normally when moving right and incorporate camera position
            this.currentSprite.render(context, screenX, screenY, 2);
        }
    
        context.restore(); // Restore the canvas state to avoid affecting other elements
    
        // Debug rectangle (optional)
        // context.strokeStyle = 'orange';
        // context.strokeRect(screenX + this.sprites[0].frameWidth, screenY + this.sprites[0].frameHeight, this.width, this.height);
        // context.stroke();
    }
}
