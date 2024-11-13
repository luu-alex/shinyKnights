import Skill from './Skill';  // Import the base Skill class
import Enemy from '../classes/Enemy'; // Import Enemy class
import Sprite from '../Sprite'; // Import Sprite for rendering
import Player from '../classes/Player';
import { getRandomElement } from '../utils'; // Utility for random selection

export class LightningSkill extends Skill {
    public x: number;
    public y: number;
    renderCount = 0;
    constructor(player: Player) {
        // Call the parent Skill constructor with a name, base damage, cooldown, and the sprite
        super("Lightning", 100, 3000, new Sprite('skills/thunderstrike.png', 64, 64, 13, 120), player); // Example: 100 damage, 3 second cooldown
        this.x = 0;
        this.y = 0;
    }

    // Override the activateSkill method to target a random enemy
    public activateSkill(enemies: Enemy[], currentTime: number) {
        if (!this.canUseSkill(currentTime)) return; // Check if the skill is off cooldown

        // Select a random enemy from the list
        const target = getRandomElement(enemies);
        if (target && target.isAlive) {
            // Apply base damage to the selected enemy
            target.takeDamage(this.damage);
            this.x = target.x;
            this.y = target.y;
            this.renderCount = 0;

            // Apply status effects (e.g., burning) to the target
            for (const effect of this.statusEffects) {
                effect.applyEffect(target);
            }

            // Reset the cooldown
            this.lastUsed = currentTime;
        }
    }

    // You can optionally override the render method for custom animations
    public render(context: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
        if (!this.sprite.isLastFrame()) {
            this.sprite.render(context, this.x - cameraX, this.y - cameraY, 1); // Use the base class rendering logic
        }
        // Additional custom rendering for lightning (optional)
    }
}
