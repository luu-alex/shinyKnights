import Skill from './Skill';
import Sprite from '../Sprite';
import { BurningEffect } from '../statusEffect/StatusEffect';
import Enemy from '../classes/Enemy';
import Projectile from '../projectiles/Projectile';
import Player from '../classes/Player';
import ProjectileManager from '../projectiles/ProjectileManager';
import { findClosestEnemy } from '../utils';

export class Fireball extends Skill {
    private fireballSprite: Sprite;
    private projectileManager: ProjectileManager;
    public chargeDuration: number;
    public charging: boolean;
    public chargeTime: number;
    public chargeSprite: Sprite;
    private chargeX = 0;
    private chargeY = 0;
    constructor(player: Player, projectileManager: ProjectileManager) {
        const fireballSprite = new Sprite('skills/fireball.png', 32, 42, 6, 240);  // Fireball animation
        super('Fireball', 5, 1000, fireballSprite, player);  // 100 damage, 3 second cooldown
        this.fireballSprite = fireballSprite;
        this.projectileManager = projectileManager;
        this.chargeDuration = 1.5; // Fireball will charge for 1.5 seconds
        this.charging = false;
        this.chargeTime = 0;
        this.chargeSprite = new Sprite('skills/firecharge.png', 32, 42, 6, 120);  // Charge animation
 
        // Add a burning effect upgrade to the fireball skill
        this.addUpgrade((skill: Skill) => {
            skill.addStatusEffect(new BurningEffect(5, 100));  // 5 damage per second for 5 seconds
            console.log(`${skill.name} upgraded to apply BurningEffect!`);
        });
        this.statusEffects = [];
        
    }

    // Activate the fireball skill (deal damage + apply burning)
    public activateSkill(enemies: Enemy[], currentTime: number) {
        if (!this.canUseSkill(currentTime)) return;
        const target = findClosestEnemy(enemies, this.player);
        if (!target) return;
        if (this.charging) {
            return
        }

        this.charging = true;
        this.chargeTime = 0;
        this.chargeX = this.player.x;
        this.chargeY = this.player.y;
    }
    public update(deltaTime: number, enemies: Enemy[]) {
        if (this.charging) {
            this.chargeTime += deltaTime;

            this.chargeSprite.update();

            // Check if charging is done
            if (this.chargeTime >= this.chargeDuration) {
                // Launch the projectile after charging is done
                this.launchProjectile(enemies);
            }
        } else {
            this.activateSkill(enemies, Date.now());
        }
    }

    private launchProjectile(enemies: Enemy[]) {
        this.charging = false;  // End charging state

        const target = findClosestEnemy(enemies, this.player);
        if (!target) return;

        // Create the projectile after charging
        const fireballProjectile = new Projectile(
            this.chargeX,  // Starting x position (player's position)
            this.chargeY,  // Starting y position
            target.x + target.width / 2,  // Target x (center of enemy)
            target.y + target.height / 2,  // Target y (center of enemy)
            this.damage,  // Fireball damage
            0,  // Fireball doesn't pierce enemies
            5,  // Fireball radius
            1000,  // Max distance
            this.fireballSprite,  // Sprite for the fireball
            [],  // Apply burning effect
            true
        );
        fireballProjectile.speed = 100;

        fireballProjectile.render = (context: CanvasRenderingContext2D) => {
            if (fireballProjectile.alive) {
                // Calculate the angle of rotation based on the direction
                const angle = Math.atan2(fireballProjectile.directionY, fireballProjectile.directionX);
    
                context.save();  // Save the current state of the canvas
    
                // Move the origin to the projectile's position
                context.translate(fireballProjectile.x, fireballProjectile.y);
    
                // Rotate the canvas around the current origin (the projectile's position)
                context.rotate(angle);
    
                // Render the sprite at the projectile's position (after translation and rotation)
                this.sprite.render(context, -this.sprite.frameWidth / 2, -this.sprite.frameHeight / 2);
    
                context.restore();  // Restore the canvas state
            }
        };

        // Add the fireball to the projectile manager
        this.projectileManager.addProjectile(fireballProjectile);

        // Start the cooldown timer
        this.lastUsed = Date.now();
    }
    public render (context: CanvasRenderingContext2D) {
        if (this.charging) {
            this.chargeSprite.render(context, this.chargeX - this.chargeSprite.frameWidth, this.chargeY - this.chargeSprite.frameHeight, 2);
        }
    }
}
