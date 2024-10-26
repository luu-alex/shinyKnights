import Sprite from '../Sprite';
import Player from '../classes/Player';
import Pet from './Pet';
import Enemy from '../classes/Enemy';

export default class Bear extends Pet {
    private idleDuration: number;
    private followDuration: number;
    private stateTimer: number;
    public state: 'idle' | 'follow';
    private attackCooldown: number;
    private attackTimer: number;
    private attackPower: number = 10;
    private movingRight: boolean = true;
    private attackTargets = 1;
    upgrades = [
        () => {
            this.attackRange += 10;
            this.attackPower += 5;
        },
        () => {
            this.attackCooldown -= 0.5;
        },
        () => {
            this.attackTargets += 2;
        }
    ];

    constructor(player: Player) {
        const petIdleSprite = new Sprite('pets/MiniBear.png', 32, 32, 4, 100);
        const petWalkSprite = new Sprite('pets/MiniBear.png', 32, 32, 6, 100, 1);
        const petAttackSprite = new Sprite('pets/MiniBear.png', 32, 32, 6, 100, 3);
        super('bear', [petIdleSprite, petWalkSprite, petAttackSprite], player);

        this.idleDuration = 8; // 8 seconds
        this.followDuration = 4; // 4 seconds
        this.stateTimer = this.idleDuration; // Start in idle mode
        this.state = 'idle'; // Initial state
        this.attackCooldown = 2; // Cooldown between attacks (2 seconds)
        this.attackTimer = 0; // Timer to track attack cooldown
        this.attackRange = 35;
        this.upgrade();
        console.log(this.attackPower);
    }

    // Update the bear's state and behavior
    update(delta: number, enemies: Enemy[]) {
        this.stateTimer -= delta;

        // Handle state transitions
        if (this.state === 'idle' && this.stateTimer <= 0) {
            this.state = 'follow'; // Switch to follow player
            this.stateTimer = this.followDuration;
        } else if (this.state === 'follow' && this.stateTimer <= 0) {
            this.state = 'idle'; // Switch back to idle and attack mode
            this.stateTimer = this.idleDuration;
        }

        // Perform actions based on the current state
        if (this.state === 'idle') {
            this.handleIdle(enemies, delta);
        } else if (this.state === 'follow') {
            this.handleFollow(delta);
        }
    }

    // Handle idle and attack behavior
    handleIdle(enemies: Enemy[], delta: number) {
        this.currentSprite = this.sprites[2]; // Idle sprite
        this.currentSprite.update();

        // Attack enemies within range if cooldown has passed
        this.attackTimer -= delta;
        let attacked = 0;
        if (this.attackTimer <= 0) {
            for (const enemy of enemies) {
                if (Math.hypot(enemy.x - this.x, enemy.y - this.y) < this.attackRange) {
                    // Deal damage and reset attack cooldown
                    enemy.takeDamage(this.attackPower);
                    this.attackTimer = this.attackCooldown;
                    this.currentSprite = this.sprites[2]; // Switch to attack sprite
                    attacked += 1;
                    if (attacked >= this.attackTargets)
                    break;
                }
            }
        }
    }

    // Handle following the player behavior
    handleFollow(delta: number) {
        this.currentSprite = this.sprites[1]; // Walking sprite

        // Move towards the player
        const angle = Math.atan2(this.player.y - this.y, this.player.x - this.x);
        this.x += Math.cos(angle) * this.speed * delta;
        this.y += Math.sin(angle) * this.speed * delta;

        this.movingRight = this.player.x > this.x;

        this.currentSprite.update();
    }

    render(context: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
        console.log(this.x, this.y);
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
