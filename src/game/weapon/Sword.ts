import SwordProjectile from '../projectiles/SwordProjectile';
import Enemy from '../classes/Enemy';
import Weapon from './Weapon';

export default class Sword extends Weapon {
    private projectiles: SwordProjectile[] = [];
    public lastAttackTime: number;

    constructor() {
        super('sword', 10, 500);
        this.lastAttackTime = 0;
    }

    // Sword slash attack
    public attack(playerX: number, playerY: number, directionX: number, directionY: number) {
        if (!this.canAttack()) return null; // Return null if the weapon is on cooldown
        const now = Date.now();
        // Create a sword slash in the direction the player is facing
        const slash = new SwordProjectile(playerX, playerY, directionX, directionY, this.damage);
        this.lastAttackTime = now;
        return slash;
        
    }

    // Update all sword slashes
    public update(deltaTime: number, enemies: Enemy[], context: CanvasRenderingContext2D) {
        this.projectiles = this.projectiles.filter(p => p.alive); // Remove dead slashes

        for (const slash of this.projectiles) {
            slash.update(deltaTime);
            slash.checkCollision(enemies); // Check for collisions with enemies
            slash.render(context); // Render the slash
        }
    }
}
