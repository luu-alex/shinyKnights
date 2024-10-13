import Skill from './Skill';  // Import the base Skill class
import Enemy from '../classes/Enemy'; // Import Enemy class
import Sprite from '../Sprite'; // Import Sprite for rendering
import Player from '../classes/Player';
import { findClosestEnemy, checkCollision } from '../utils'; // Utility for finding closest enemy and collision detection

export default class ArthurSwordSkill extends Skill {
    private target: Enemy | null;
    private speed: number;
    public x: number;
    public y: number;
    public directionX: number;
    public directionY: number;
    private isFlying: boolean; // To track if the sword is currently flying
    private flightDuration: number; // How long the sword has been flying
    private maxFlightDuration: number; // Maximum flight duration before it disappears

    constructor(player: Player) {
        // Call the parent Skill constructor with a name, base damage, cooldown, and the sprite
        super("ArthurSword", 5, 8000, new Sprite('skills/arthursSword.png', 26, 26, 19, 25), player); // 120 damage, 5 second cooldown
        this.x = player.x;
        this.y = player.y;
        this.speed = 200; // Speed of the sword
        this.directionX = 0;
        this.directionY = 0;
        this.isFlying = false;
        this.flightDuration = 0; // Initialize the flight duration
        this.maxFlightDuration = 4000; // Sword will disappear after 3 seconds (3000 ms)
        this.target = null;
    }

    // Override the activateSkill method to target the nearest enemy
    public activateSkill(enemies: Enemy[], currentTime: number) {
        if (!this.canUseSkill(currentTime)) return; // Check if the skill is off cooldown

        // Find the closest enemy
        this.target = findClosestEnemy(enemies, this.player);
        if (this.target) {
            this.isFlying = true;
            this.flightDuration = 0; // Reset flight duration

            const dx = this.target.x - this.player.x;
            const dy = this.target.y - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Calculate the direction towards the enemy
            this.directionX = (dx / distance) * this.speed;
            this.directionY = (dy / distance) * this.speed;

            this.x = this.player.x;
            this.y = this.player.y;

            // Start the cooldown
            this.lastUsed = currentTime;
        }
    }

    // Update method for handling the sword's movement, collisions, and duration
    public update(deltaTime: number, enemies: Enemy[]) {
        if (this.isFlying && this.target) {
            // Increase the flight duration
            this.flightDuration += deltaTime;

            // Stop the sword after it exceeds the max flight duration
            if (this.flightDuration >= this.maxFlightDuration) {
                this.isFlying = false;
                return;
            }

            // Move the sword toward the target
            this.x += this.directionX * (deltaTime/ 10); // Adjust with deltaTime
            this.y += this.directionY * (deltaTime/ 10);

            // Check if the sword reaches the target (collision detection)
            for (const enemy of enemies) {
                if (checkCollision(enemy, this.x, this.y, this.sprite.frameWidth)) {
                    // Deal damage to the target
                    enemy.takeDamage(this.damage);
                }
            }
        }

        // Call the parent update method to handle cooldown and sprite updates
        super.update(deltaTime, enemies);
    }

    // Render the sword as it flies toward the target
    public render(context: CanvasRenderingContext2D, _: number, __: number) {
        if (this.isFlying) {
            // debug 
            context.fillStyle = 'red';
            context.beginPath();
            context.arc(this.x, this.y, this.sprite.frameWidth, 0, Math.PI * 2);
            context.fill();
            this.sprite.render(context, this.x - this.sprite.frameWidth, this.y - this.sprite.frameHeight, 2);
        }
    }
}
