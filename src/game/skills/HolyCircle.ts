import Skill from './Skill';  // Import the base Skill class
import Enemy from '../classes/Enemy'; // Import Enemy class
import Sprite from '../Sprite'; // Import Sprite for rendering
import Player from '../classes/Player';
import { getRandomElement } from '../utils'; // Utility for random selection

export class HolyCircle extends Skill {
    public x: number;
    public y: number;
    public radius: number;
    public duration: number;
    public currentDuration: number;
    public active: boolean;
    private hitEnemies: Set<Enemy>;

    constructor(player: Player) {
        super("holyCircle", 25, 5000, new Sprite('skills/holyCircle.png', 121, 121, 17, 240), player); // 50 damage, 5 second cooldown
        this.x = 0;
        this.y = 0;
        this.radius = 50; // Radius of the circle
        this.duration = 7; // Duration of the circle (3 seconds)
        this.currentDuration = 0;
        this.active = false;
        this.hitEnemies = new Set();
    }

    // Override the activateSkill method to target a random enemy and create the circle
    public activateSkill(enemies: Enemy[], currentTime: number) {
        if (!this.canUseSkill(currentTime)) return; // Check if the skill is off cooldown
        // Select a random enemy from the list
        const target = getRandomElement(enemies);
        if (target && target.isAlive) {
            this.x = target.x;
            this.y = target.y;
            this.active = true;
            this.currentDuration = 0;

            // Deal initial damage to the target
            target.takeDamage(this.damage);

            // Reset the cooldown
            this.lastUsed = currentTime;
        }
    }

    // Update method to handle the circle's lifetime and damage enemies within it
    public update(deltaTime: number, enemies: Enemy[]) {
        const currentTime = Date.now();

        // If the skill is off cooldown, activate it
        if (this.canUseSkill(currentTime)) {
            this.hitEnemies.clear(); // Clear the set of hit enemies
            this.activateSkill(enemies, currentTime);
        }
        if (this.active) {
            this.currentDuration += deltaTime;

            // Check if the circle's duration has expired
            if (this.currentDuration >= this.duration) {
                this.active = false;
                return;
            }

            // Check if enemies are within the circle and apply damage
            enemies.forEach(enemy => {
                if (this.hitEnemies.has(enemy)) return;
                const distance = Math.sqrt((enemy.x - this.x) ** 2 + (enemy.y - this.y) ** 2);
                if (distance <= this.radius && enemy.isAlive) {
                    enemy.takeDamage(this.damage); // Apply damage over time
                    this.hitEnemies.add(enemy);
                }
            });
        }

        // Update sprite for animation (if necessary)
        this.sprite.update();
    }

    // Render method to draw the circle
    public render(context: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
        if (this.active) {
            // Render the holy circle sprite
            // context.beginPath();
            // context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
            // context.fillStyle = 'rgba(255, 255, 0, 0.3)'; // Light yellow color for the circle
            // context.fill();

            // Optionally, render the sprite for more visual effect
            this.sprite.render(context, (this.x - this.sprite.frameWidth / 2) - cameraX, this.y - cameraY - this.sprite.frameHeight / 2);
        }
    }
}
