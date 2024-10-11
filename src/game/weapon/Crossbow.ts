import Weapon from './Weapon';
import { ArrowProjectile } from '../projectiles/ArrowProjectile';

export default class Crossbow extends Weapon {
    private projectiles: ArrowProjectile[] = []; // Store bullets fired

    constructor() {
        super('crossbow', 10, 500); // crossbow does 10 damage, fires every 0.5 seconds
    }

    // Fire a bullet
    public attack(playerX: number, playerY: number, targetX: number, targetY: number) {
        if (this.canAttack()) {
            const bullet = new ArrowProjectile(playerX, playerY, targetX, targetY, this.damage, 1);
            this.lastAttackTime = Date.now(); // Record the last attack time
            return bullet;
        }
        return null; // Return null if the weapon is on cooldown
    }

    // Update and render bullets
    public update(deltaTime: number, context: CanvasRenderingContext2D) {
        this.projectiles.forEach(projectile => {
            projectile.update(deltaTime);
            projectile.render(context);
        });
    }
}
