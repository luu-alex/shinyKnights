import Projectile from './Projectile';
import Enemy from '../classes/Enemy';

export default class ProjectileManager {
    private projectiles: Projectile[] = [];

    constructor() {
        this.projectiles = [];
    }

    // Add a new projectile to the game
    public addProjectile(projectile: Projectile) {
        this.projectiles.push(projectile);
        console.log('Projectile added', this.projectiles);
    }

    // Update all projectiles
    public update(deltaTime: number, enemies: Enemy[]) {
        this.projectiles = this.projectiles.filter(projectile => projectile.alive); // Remove dead projectiles
        // Update each projectile and check for collisions
        for (const projectile of this.projectiles) {
            projectile.update(deltaTime);
            projectile.checkCollision(enemies); // Check for collisions with enemies
        }
    }

    // Render all projectiles
    public render(context: CanvasRenderingContext2D) {
        for (const projectile of this.projectiles) {
            projectile.render(context);
        }
    }

    // Clear all projectiles (optional method for resetting)
    public clearProjectiles() {
        this.projectiles = [];
    }
}
