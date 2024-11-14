import Projectile from './Projectile';
import Enemy from '../classes/Enemy';
import Sprite from '../Sprite';
import Explosion from '../effects/Explosion';
import Player from '../classes/Player';

export default class ProjectileManager {
    private projectiles: Projectile[] = [];
    public explosions: Explosion[] = [];
    private enemyProjectiles: Projectile[] = [];

    constructor() {
        this.projectiles = [];
        this.explosions = [];
    }

    // Add a new projectile to the game
    public addProjectile(projectile: Projectile) {
        this.projectiles.push(projectile);
    }

    public addEnemyProjectile(projectile: Projectile) {
        this.enemyProjectiles.push(projectile);
    };

    // Update all projectiles
    public update(deltaTime: number, enemies: Enemy[], player: Player) {
        // console.log(this.explosions)
        this.projectiles = this.projectiles.filter(projectile => {
            if (!projectile.alive && projectile.willExplode) {
                this.explosions.push(new Explosion(projectile.x, projectile.y, new Sprite('skills/fireexplosion.png', 64, 55, 8, 60), 1, 10));
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

        this.enemyProjectiles = this.enemyProjectiles.filter(projectile => projectile.alive);
        for (const projectile of this.enemyProjectiles) {
            projectile.update(deltaTime);
            if (projectile.isCollidingWithEnemy(player)) { // Check collision with player
                player.hp -= projectile.damage;
                projectile.alive = false;
        
            }
        }
    }

    // Render all projectiles
    public render(context: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
        for (const projectile of this.projectiles) {
            projectile.render(context, cameraX, cameraY);
        }

        for (const projectile of this.enemyProjectiles) {
            projectile.render(context, cameraX, cameraY);
        }

        for (const explosion of this.explosions) {
            explosion.render(context, cameraX, cameraY);
        }
    }

    // Clear all projectiles (optional method for resetting)
    public clearProjectiles() {
        this.projectiles = [];
        this.explosions = [];
    }
}
