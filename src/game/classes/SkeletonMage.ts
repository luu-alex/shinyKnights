import Enemy from './Enemy';
import Sprite from '../Sprite';
import Player from './Player';
import Projectile from '../projectiles/Projectile';
export default class SkeletonMage extends Enemy {
    private shootCooldown: number;
    private timeSinceLastShot: number = 0;
    attackRange = 400;
    isAttacking = false;
    
    constructor(x: number, y: number, player: Player, scale = 2) {
        const idleSprite = new Sprite('characters/MiniSkeletonMage.png', 32, 32, 4, 100);
        const walkSprite = new Sprite('characters/MiniSkeletonMage.png', 32, 32, 6, 100, 1);
        const attackSprite = new Sprite('characters/MiniSkeletonMage.png', 32, 32, 7, 100, 4);
        const deathSprite = new Sprite('characters/MiniSkeletonMage.png', 32, 32, 8, 100, 6);
        super(idleSprite, walkSprite, attackSprite, deathSprite, x, y, 50, 100, player, 50, [], scale, 32, 32, "SkeletonMage");

        this.shootCooldown = 3;
    }

    public attack(deltaTime: number) {
        this.timeSinceLastShot += deltaTime;

        // Check if cooldown is over
        if (this.timeSinceLastShot >= this.shootCooldown) {
            this.timeSinceLastShot = 0; // Reset the timer
            this.isAttacking = true;
            this.currentSprite = this.attackSprite;

            // Create a new projectile and add it to the projectile manager
            const projectileSprite = new Sprite('weapons/tonsOfBullets.png', 16, 16, 6, 100);
            const projectile = new Projectile(
                this.x, 
                this.y, 
                this.player.x + this.player.width / 2, // Target the center of the player
                this.player.y + this.player.height / 2, 
                10, // Damage
                0,  // Pierce (set to 0 if the projectile doesn't pierce)
                5,  // Radius of the projectile
                700, // Max distance before projectile disappears
                projectileSprite
            );
            return [projectile];

            // Add the projectile to the projectile manager
        }
    }
    public handleBehavior(_: number) {
        return;
    }
    public update(deltaTime: number) {
        if (this.isAttacking) {
            if (this.currentSprite.isLastFrame()) {
                this.isAttacking = false;
                this.currentSprite.update();
                this.currentSprite = this.idleSprite;
            }
            this.currentSprite.update();
            return;
        }
        super.update(deltaTime); // Call the base class's update

        // Handle shooting logic
        if (this.calculateDistanceToPlayer() <= this.attackRange) {
            this.attack(deltaTime);
        }
        
    }

}
