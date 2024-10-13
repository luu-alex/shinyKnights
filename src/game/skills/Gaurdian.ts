import Skill from './Skill';
import Sprite from '../Sprite';
import Player from '../classes/Player';
import { checkCollision } from '../utils';
import Enemy from '../classes/Enemy';

export class Guardian extends Skill {
    private angle: number; // Angle around the player
    private radius: number; // Radius of the circle
    private speed: number; // Speed of rotation
    private isActive: boolean; // Whether the Holyball is active
    public x : number;
    public y: number;
    private hitEnemies: Map<Enemy, number>; // Track enemies and last hit time
    private hitCooldown: number;
    private activeDuration: number; // How long the skill has been active
    private maxActiveDuration: number;

    constructor(player: Player) {
        const holyballSprite = new Sprite('skills/holyBall.png', 48, 48, 10, 100); // Holyball sprite
        super("Guardian", 50, 8000, holyballSprite, player); // Example: 50 damage, 2 seconds cooldown
        this.angle = 0; // Start angle
        this.radius = 100; // Circle radius around the player
        this.speed = 2 * Math.PI / 3; // Speed in radians per second (1 full circle in 3 seconds)
        this.isActive = false;
        this.x = player.x;
        this.y = player.y;
        this.hitEnemies = new Map(); // Store hit enemies and their last hit time
        this.hitCooldown = 1000;
        this.activeDuration = 0;
        this.maxActiveDuration = 8; // 5 seconds active duration
    }

    // Activate the Holyball, making it circle around the player
    public activateSkill(_: any[], currentTime: number) {
        if (!this.canUseSkill(currentTime)) return;

        // Start the Holyball around the player
        this.isActive = true;
        this.angle = 0; // Reset the angle to start the rotation
        this.lastUsed = currentTime; // Start cooldown
    }

    // Update method to handle circular movement
    public update(deltaTime: number, enemies: any[]) {
        if (!this.isActive) {
            const currentTime = Date.now();
    
            // If the skill is off cooldown, activate it
            if (this.canUseSkill(currentTime)) {
                this.activateSkill(enemies, currentTime);
            }
        }

        if (this.isActive) {
            // Update angle for circular motion (radians per second)
            this.activeDuration += deltaTime;
            if (this.activeDuration >= this.maxActiveDuration) {
                this.isActive = false;
                this.activeDuration = 0;
                return;
            }
            this.angle += this.speed * deltaTime/2;

            // Keep angle within 0 to 2π range
            if (this.angle > 2 * Math.PI) {
                this.angle -= 2 * Math.PI;
            }

            // Calculate new position based on the angle and player's current position
            this.x = this.player.x + this.radius * Math.cos(this.angle);
            this.y = this.player.y + this.radius * Math.sin(this.angle);

            for (const enemy of enemies) {
                // Check if enemy has been hit before and if enough time has passed to hit again
                const lastHitTime = this.hitEnemies.get(enemy) || 0;
                const currentTime = Date.now();

                if (currentTime - lastHitTime >= this.hitCooldown) {
                    // Check for collision with the enemy
                    if (checkCollision(enemy, this.x + (this.sprite.frameWidth / 2), this.y + (this.sprite.frameHeight / 2), this.sprite.frameWidth / 2)) {
                        enemy.takeDamage(this.damage); // Deal damage
                        this.hitEnemies.set(enemy, currentTime); // Update the last hit time
                    }
                }
        }

            // Render the Holyball at the calculated position
            this.sprite.update();
        }
    }

    // Render the Holyball at the updated position
    public render(context: CanvasRenderingContext2D, _: number, __: number) {
        // Render the holyball sprite at the calculated position
        if (this.isActive) {
            this.sprite.render(context, this.x, this.y);
            //debug circle
            context.beginPath();
            context.arc(this.x + (this.sprite.frameWidth/2), this.y + (this.sprite.frameHeight /2), this.sprite.frameWidth/2, 0, 2 * Math.PI);
            context.stroke();

        }

    }
}
