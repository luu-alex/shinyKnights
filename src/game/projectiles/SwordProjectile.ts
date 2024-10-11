import Projectile from './Projectile';
import Sprite from '../Sprite';

export default class SwordProjectile extends Projectile {

    constructor(x: number, y: number, targetX: number, targetY: number, damage: number) {
        super(x, y, targetX, targetY, damage, 5, 25, 25, new Sprite('weapons/whiteSlash.png', 256, 256, 5, 50));  // Inherit properties from base Projectile
        this.speed = 50;  // Sword slashes move slower than bullets
    }


    // Check for collision with enemies
    // public checkCollision(enemies: Enemy[]) {
    //     for (const enemy of enemies) {
    //         const distance = Math.sqrt((enemy.x - this.x) ** 2 + (enemy.y - this.y) ** 2);
    //         if (distance < 20) {  // Sword slash collision radius
    //             enemy.takeDamage(this.damage);
    //             this.alive = false;  // Destroy the slash after hitting an enemy
    //             break;
    //         }
    //     }
    // }
    public update(deltaTime: number) {
        super.update(deltaTime);
        this.sprite.update();

    }

    // Render the sword slash (this can be customized based on your design)
    public render(context: CanvasRenderingContext2D) {
        if (this.alive) {
            // Calculate the angle of rotation based on the direction
            const angle = Math.atan2(this.directionY, this.directionX);

            context.save();  // Save the current state of the canvas

            context.scale(0.25, 0.25);  // Scale the context to half size
            // Move the origin to the projectile's position
            context.translate(this.x/ 0.25, this.y / 0.25);

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
