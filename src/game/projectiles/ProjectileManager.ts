import Projectile from './Projectile';
import Enemy from '../classes/Enemy';
import Sprite from '../Sprite';
import Explosion from '../effects/Explosion';

export default class ProjectileManager {
    private projectiles: Projectile[] = [];
    public explosions: Explosion[] = [];

    constructor() {
        this.projectiles = [];
        this.explosions = [];
    }

    // Add a new projectile to the game
    public addProjectile(projectile: Projectile) {
        this.projectiles.push(projectile);
    }

    // Update all projectiles
    public update(deltaTime: number, enemies: Enemy[]) {
        // console.log(this.explosions)
        this.projectiles = this.projectiles.filter(projectile => {
            if (!projectile.alive && projectile.willExplode) {
                this.explosions.push(new Explosion(projectile.x, projectile.y, new Sprite('skills/fireexplosion.png', 32, 42, 6, 60), 1, 10));
            }
            return projectile.alive;
        }); // Remove dead projectiles
        // Update each projectile and check for collisions
        for (const projectile of this.projectiles) {
            projectile.update(deltaTime);
            projectile.checkCollision(enemies); // Check for collisions with enemies
        }

        // Update all explosions
        this.explosions = this.explosions.filter(explosion => explosion.alive);
        for (const explosion of this.explosions) {
            explosion.update(deltaTime, enemies);
        }
    }

    // Render all projectiles
    public render(context: CanvasRenderingContext2D) {
        for (const projectile of this.projectiles) {
            projectile.render(context);
        }

        for (const explosion of this.explosions) {
            explosion.render(context);
        }
    }

    // Clear all projectiles (optional method for resetting)
    public clearProjectiles() {
        this.projectiles = [];
        this.explosions = [];
    }
}
