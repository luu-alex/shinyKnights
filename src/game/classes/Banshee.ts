import Enemy from './Enemy';
import Sprite from '../Sprite';
import Player from './Player';
import Projectile from '../projectiles/Projectile';
export default class Banshee extends Enemy {
    private shootCooldown: number;
    private buffRange: number = 200;
    private timeSinceLastShot: number = 0;
    isAttacking = false;
    name = "Banshee";
    private castingSprite: Sprite;
    constructor(x: number, y: number, player: Player, scale = 4) {
        const idleSprite = new Sprite('characters/MiniBansheeQueen.png', 32, 32, 4, 100);
        const walkSprite = new Sprite('characters/MiniBansheeQueen.png', 32, 32, 4, 100, 1);
        const attackSprite = new Sprite('characters/MiniBansheeQueen.png', 32, 32, 8, 200, 2);
        const deathSprite = new Sprite('characters/MiniBansheeQueen.png', 32, 32, 12, 100, 5);
        super(idleSprite, walkSprite, attackSprite, deathSprite, x, y, 400, 100, player, 1000, [], scale, 75, 90);
        this.shootCooldown = 3;
        this.castingSprite = new Sprite('characters/MiniBansheeQueen.png', 32, 32, 6, 100, 3);
    }

    // Buff nearby enemies
    private buffNearbyEnemies(enemies: Enemy[]) {
        enemies.forEach(enemy => {
            const distanceToEnemy = this.calculateDistance(enemy.x, enemy.y);
            if (distanceToEnemy <= this.buffRange) {
                enemy.isBuffed = true; // Apply buff
            }
        });
    }

    public update(deltaTime: number, enemies: Enemy[]) {
        if (this.isAttacking) {
            if (this.currentSprite.isLastFrame()) {
                this.isAttacking = false;
                this.currentSprite.update();
                this.currentSprite = this.idleSprite;
            }
            this.currentSprite.update();
            return;
        }
        super.update(deltaTime);
        this.buffNearbyEnemies(enemies);
        
    }

    public handleBehavior(_: number): void {
        return;
    }

    // Goblins may have a special attack
    public attack(deltaTime: number) {
        this.timeSinceLastShot += deltaTime;
        super.attack(deltaTime);
        if (this.timeSinceLastShot >= this.shootCooldown) {
            this.timeSinceLastShot = 0; // Reset the timer
            this.isAttacking = true;
            this.currentSprite = this.castingSprite;

            // Create a new projectile and add it to the projectile manager
             // Number of projectiles to shoot around the Banshee
        const numberOfProjectiles = 8;
        const angleStep = (2 * Math.PI) / numberOfProjectiles; // 360 degrees divided by the number of projectiles

        const projectiles = [];
        for (let i = 0; i < numberOfProjectiles; i++) {
            // Calculate the angle for this projectile
            const angle = i * angleStep;

            // Calculate the target position based on the angle
            const targetX = this.x + Math.cos(angle) * 100; // 100 is the arbitrary distance from the center
            const targetY = this.y + Math.sin(angle) * 100;

            // Create a new projectile
            const projectileSprite = new Sprite('weapons/combatSheet.png', 64, 64, 1, 100, 9);
            const projectile = new Projectile(
                this.x + this.width/2, // Start from Banshee's position
                this.y + this.height/2,
                targetX, // Target position based on the angle
                targetY,
                10,      // Damage
                0,       // Pierce (set to 0 if the projectile doesn't pierce)
                5,       // Radius of the projectile
                700,     // Max distance before projectile disappears
                projectileSprite
            );

            // Add the projectile to the array
            projectiles.push(projectile);
        }

        return projectiles; // Return an array of projectiles to be handled by the projectile manager
            // Add the projectile to the projectile manager
        }
    }
    
}
