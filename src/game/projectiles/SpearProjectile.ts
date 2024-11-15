import Projectile from './Projectile';
import Sprite from '../Sprite';

export default class SwordProjectile extends Projectile {

    constructor(x: number, y: number, targetX: number, targetY: number, damage: number) {
        super(x, y, targetX, targetY, damage, 20, 10, 125, new Sprite('weapons/spearSlash3.png', 63, 35, 1, 50));  // Inherit properties from base Projectile
        this.speed = 150;  // Sword slashes move slower than bullets
    }

    public update(deltaTime: number) {
        super.update(deltaTime);
        // this.sprite.update();

    }

    // Render the sword slash (this can be customized based on your design)
    public render(context: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
        if (this.alive) {
            // Calculate the angle of rotation based on the direction
            const angle = Math.atan2(this.directionY, this.directionX);

            context.save();  // Save the current state of the canvas

            context.scale(1, 1);  // Scale the context to half size
            // Move the origin to the projectile's position
            context.translate(this.x - cameraX, this.y - cameraY);

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
