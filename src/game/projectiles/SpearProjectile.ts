import Projectile from './Projectile';
import Sprite from '../Sprite';

export default class SwordProjectile extends Projectile {

    constructor(x: number, y: number, targetX: number, targetY: number, damage: number) {
        super(x, y, targetX, targetY, damage, 20, 10, 125, new Sprite('weapons/spearSlash3.png', 63, 35, 5, 50));  // Inherit properties from base Projectile
        this.speed = 150;  // Sword slashes move slower than bullets
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

            context.scale(1, 1);  // Scale the context to half size
            // Move the origin to the projectile's position
            context.translate(this.x/ 1, this.y / 1);

            // Rotate the canvas around the current origin (the projectile's position)
            context.rotate(angle);

            // Render the sprite at the projectile's position (after translation and rotation)
            this.sprite.render(context, -this.sprite.frameWidth / 2, -this.sprite.frameHeight / 2);

            // debug
            context.restore();  // Restore the canvas state
        }
    }
}
