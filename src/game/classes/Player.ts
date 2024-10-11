import Sprite from '../Sprite';
import Weapon from '../weapon/Weapon';
import Enemy from './Enemy';
// import Sword from '../weapon/Sword';
// import Spear from '../weapon/Spear';
// import Crossbow from '../weapon/Crossbow';
import Dagger from '../weapon/Dagger';

enum PlayerState {
    Idle,
    Walking,
    Dying
}
export default class Player {
    public speed: number;
    x : number;
    y: number;
    private idleSprite: Sprite;
    private walkingSprite: Sprite;
    private dyingSprite: Sprite;
    private currentSprite: Sprite;
    private state: PlayerState;
    private joystickInput: { x: number, y: number };
    private isFacingRight: boolean;
    private currentWeapon: Weapon;
    public width: number;
    public height: number;


    constructor(sprites: Sprite[], x: number, y: number, speed: number,) {
        this.idleSprite = sprites[0];
        this.walkingSprite = sprites[1];
        this.dyingSprite = sprites[2];
        this.currentSprite = this.idleSprite;
        this.state = PlayerState.Idle;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.joystickInput = { x: 0, y: 0 };
        this.isFacingRight = true;
        this.currentWeapon = new Dagger();
        this.width = 32;
        this.height = 32;

    }

    update(deltaTime: number) {
        this.x += this.joystickInput.x * this.speed * deltaTime;
        this.y += this.joystickInput.y * this.speed * deltaTime;
        this.handleAnimation();

        this.handleDirection();

        // Update the sprite animation
        this.currentSprite.update();
    }
    private findClosestEnemy(enemies: Enemy[]): Enemy | null {
        if (enemies.length === 0) return null;  // No enemies, return null

        let closestEnemy: Enemy | null = null;
        let shortestDistance = Infinity;

        for (const enemy of enemies) {
            const distance = Math.sqrt((enemy.x - this.x) ** 2 + (enemy.y - this.y) ** 2);
            if (distance < shortestDistance) {
                shortestDistance = distance;
                closestEnemy = enemy;
            }
        }

        return closestEnemy;  // Return the closest enemy
    }

    attack(enemies: Enemy[]) {
        const closestEnemy = this.findClosestEnemy(enemies);

        if (closestEnemy) {
            const spawnPoint = this.getClosestEdgeToEnemy(closestEnemy);
            return this.currentWeapon.attack(spawnPoint.x + this.width/2, spawnPoint.y + this.height, closestEnemy.x + closestEnemy.width/2, closestEnemy.y + closestEnemy.height/2);
        }
    }
    render(context: CanvasRenderingContext2D) {
        context.save();
        if (!this.isFacingRight) {
            context.scale(-1, 1);  // Flip the context horizontally
            this.currentSprite.render(context, -(this.x + this.currentSprite.frameWidth * 2), this.y, 2); // Adjust x position
        } else {
            this.currentSprite.render(context, this.x, this.y, 2); // Scale the sprite if needed
        }
        context.restore();
    }
    private handleAnimation() {
        switch (this.state) {
            case PlayerState.Idle:
                this.currentSprite = this.idleSprite;
                break;
            case PlayerState.Walking:
                this.currentSprite = this.walkingSprite;
                break;
            case PlayerState.Dying:
                this.currentSprite = this.dyingSprite;
                break;
        }
    }
    private handleDirection() {
        if (this.joystickInput.x > 0) {
            this.isFacingRight = true;  // Moving right
        } else if (this.joystickInput.x < 0) {
            this.isFacingRight = false; // Moving left
        }
    }

    private getClosestEdgeToEnemy(enemy: Enemy): { x: number, y: number } {
        const playerCenterX = this.x + this.width / 2;
        const playerCenterY = this.y + this.height / 2;

        const dx = enemy.x - playerCenterX;
        const dy = enemy.y - playerCenterY;


        // Determine which edge the enemy is closest to
        let spawnX: number = this.x;
        let spawnY: number = this.y;

        // If the enemy is more to the left or right
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) {
                // Enemy is to the right, spawn at the right edge
                spawnX = this.x + this.width;
            } else {
                // Enemy is to the left, spawn at the left edge
                spawnX = this.x;
            }
            spawnY = playerCenterY; // Spawn vertically at the center
        } else {
            // If the enemy is more above or below
            if (dy > 0) {
                // Enemy is below, spawn at the bottom edge
                spawnY = this.y + this.height;
            } else {
                // Enemy is above, spawn at the top edge
                spawnY = this.y;
            }
            spawnX = playerCenterX; // Spawn horizontally at the center
        }

        return { x: spawnX, y: spawnY };
    }

    // Handle joystick or movement input
    handleInput(xInput: number, yInput: number) {
        this.joystickInput = { x: xInput, y: yInput };
        if (xInput !== 0 || yInput !== 0) {
            this.state = PlayerState.Walking;
        } else {
            this.state = PlayerState.Idle;
        }
    }
}