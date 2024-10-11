import Sprite from "../Sprite";
import Projectile from "./Projectile";
import { BleedEffect } from '../statusEffect/StatusEffect';

export default class DaggerProjectile extends Projectile {
    constructor(x: number, y: number, targetX: number, targetY: number, damage: number, pierce: number) {
        super(x, y, targetX, targetY, damage, pierce, 5, 1000, new Sprite('weapons/dagger.png', 31, 20, 5, 50));
        this.speed = 100
        this.statusEffects = [new BleedEffect(1000)]
    }
    public render(context: CanvasRenderingContext2D) {
        if (this.alive) {
            // Calculate the angle of rotation based on the direction
            const angle = Math.atan2(this.directionY, this.directionX);

            context.save();  // Save the current state of the canvas

            // Move the origin to the projectile's position
            context.translate(this.x, this.y);

            // Rotate the canvas around the current origin (the projectile's position)
            context.rotate(angle);

            // Render the sprite at the projectile's position (after translation and rotation)
            this.sprite.render(context, -this.sprite.frameWidth / 2, -this.sprite.frameHeight / 2);

            // debug
            context.restore();  // Restore the canvas state
            // context.fillStyle = 'yellow';
            // context.beginPath();
            // context.arc(this.x, this.y, this.radius, 0, Math.PI * 2); // Visual representation of the slash
            // context.fill();
        }
    }
}