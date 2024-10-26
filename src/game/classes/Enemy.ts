import Sprite from '../Sprite';
import Player from './Player'; // Assuming you have a Player class
import FloatingDamage from '../HUD/FloatingDamage';
import BleedingDamage from '../HUD/BleedingDamage';
import { StatusEffect } from '../statusEffect/StatusEffect';
import { isColliding } from '../utils';
import Projectile from '../projectiles/Projectile';

export default class Enemy {
    public x: number;
    public y: number;
    public hp: number;
    public maxHp: number;
    public speed: number;
    public currentSprite: Sprite;
    public idleSprite: Sprite;
    public walkSprite: Sprite;
    public attackSprite: Sprite;
    private deathSprite: Sprite;
    public isAlive: boolean;
    public behavior: EnemyBehavior; // Current behavior (Patrolling, Chasing, Attacking)
    private patrolPoints: { x: number, y: number }[]; // Points for patrolling
    private currentPatrolPoint: number;
    public player: Player; // Reference to the player
    public attackRange: number; // Range within which the enemy will attack
    public isFacingRight: boolean;
    private scale: number = 1;
    public width: number;
    public height: number;
    public floatingDamage: FloatingDamage[] = [];
    private statusEffects: StatusEffect[] = [];
    public bleedMultiplier: number = 0;
    public bleedMultipliers: BleedingDamage[] = [];
    public speedMultiplier: number = 1;
    public onHitCooldown: number = 0;
    public name: string;
    public isBuffed: boolean = false;
    public buffSprite: Sprite;
    public buffAnimationCompleted: boolean = false;
    public isAttacking = false;




    constructor(
        idleSprite: Sprite,
        walkSprite: Sprite,
        attackSprite: Sprite,
        deathSprite: Sprite,
        x: number,
        y: number,
        hp: number,
        speed: number,
        player: Player, // Inject player to track their position
        attackRange: number = 50, // Default attack range
        patrolPoints: { x: number, y: number }[] = [],
        scale: number = 1,
        width: number = 32,
        height: number = 32,
        name: string = "Enemy"
    ) {
        this.idleSprite = idleSprite;
        this.walkSprite = walkSprite;
        this.attackSprite = attackSprite;
        this.deathSprite = deathSprite;
        this.currentSprite = idleSprite;
        this.x = x;
        this.y = y;
        this.hp = hp;
        this.maxHp = hp;
        this.speed = speed;
        this.isAlive = true;
        this.behavior = patrolPoints.length > 0 ? EnemyBehavior.Patrolling : EnemyBehavior.Idle;
        this.patrolPoints = patrolPoints;
        this.currentPatrolPoint = 0;
        this.player = player; // Reference to player to track their position
        this.attackRange = attackRange;
        this.isFacingRight = true;
        this.scale = scale;
        this.width = width;
        this.height = height;
        this.name = name
        this.buffSprite = new Sprite('buffs/enemyAura2.png', 64, 64, 18, 100);
    }

    // Method for switching behavior based on conditions
    public handleBehavior(deltaTime: number) {
        if (!this.isAlive) return;
        const distanceToPlayer = this.calculateDistanceToPlayer();

        if (distanceToPlayer <= this.attackRange) {
            this.behavior = EnemyBehavior.Attacking;
            this.speedMultiplier = 0.5;
        } else if (distanceToPlayer <= 3000) {
            this.behavior = EnemyBehavior.Chasing;
            this.speedMultiplier = 1;
        } else if (this.patrolPoints.length > 0) {
            this.behavior = EnemyBehavior.Patrolling;
        } else {
            this.behavior = EnemyBehavior.Idle;
        }

        switch (this.behavior) {
            case EnemyBehavior.Patrolling:
                this.patrol(deltaTime);
                break;
            case EnemyBehavior.Chasing:
                this.chasePlayer(deltaTime);
                break;
            case EnemyBehavior.Attacking:
                this.attack(deltaTime);
                break;
            case EnemyBehavior.Idle:
            default:
                // Stand idle, maybe play idle animation
                this.currentSprite = this.idleSprite;
                break;
        }
    }

    // Patrolling behavior - move between patrol points
    private patrol(deltaTime: number) {
        if (this.patrolPoints.length === 0) return;
        const targetPoint = this.patrolPoints[this.currentPatrolPoint];
        const distanceToPoint = this.calculateDistance(targetPoint.x, targetPoint.y);

        if (distanceToPoint < 5) {
            this.currentPatrolPoint = (this.currentPatrolPoint + 1) % this.patrolPoints.length;
        } else {
            this.moveTowards(targetPoint.x, targetPoint.y, deltaTime);
        }
        this.currentSprite = this.walkSprite; // Set walking animation
    }

    // Chasing behavior - move towards the player
    private chasePlayer(deltaTime: number) {
        this.moveTowards(this.player.x, this.player.y, deltaTime);
        if (!this.isAttacking)
        this.currentSprite = this.walkSprite; // Set walking animation
    }

    // Move towards a target point (common logic for patrolling and chasing)
    private moveTowards(targetX: number, targetY: number, deltaTime: number) {
        const angle = Math.atan2(targetY - this.y, targetX - this.x);
        this.x += Math.cos(angle) * this.speed * deltaTime * this.speedMultiplier;
        this.y += Math.sin(angle) * this.speed * deltaTime * this.speedMultiplier;
        if (targetX > this.x) {
            this.isFacingRight = true;  // Moving right
        } else if (targetX < this.x) {
            this.isFacingRight = false; // Moving left
        }
    }

    public applyStatusEffect(effect: StatusEffect) {
        const existingEffectIndex = this.statusEffects.findIndex(
            existingEffect => existingEffect.constructor === effect.constructor
        );
    
        if (existingEffectIndex !== -1) {
            // Replace the existing effect with the new one
            this.statusEffects[existingEffectIndex] = effect;
        } else {
            // If no matching effect is found, add the new effect
            this.statusEffects.push(effect);
        }
    }

    // Attacking behavior
    public attack(deltaTime: number): void | Projectile[] {
        // this.currentSprite = this.attackSprite; // Play attack animation
        this.moveTowards(this.player.x, this.player.y, deltaTime);
        // Attack logic (e.g., reducing player's HP) can be implemented here
    }

    // Calculate distance to player for behavior decisions
    public calculateDistanceToPlayer(): number {
        return this.calculateDistance(this.player.x, this.player.y);
    }

    // Utility function to calculate distance between two points
    public calculateDistance(targetX: number, targetY: number): number {
        const dx = this.x - targetX;
        const dy = this.y - targetY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Update method to handle behavior and movement
    public update(deltaTime: number, _?: Enemy[]) {
        if (!this.isAlive && !this.currentSprite.isLastFrame()) {
            this.currentSprite.update();
            return;
        }

        this.statusEffects = this.statusEffects.filter(effect => !effect.isExpired());
        for (const effect of this.statusEffects) {
            effect.update(deltaTime);
            if (effect.isDOT) {
                effect.applyEffect(this);
            }
        }

        this.handleBehavior(deltaTime);
        this.floatingDamage = this.floatingDamage.filter(floatingDamage => floatingDamage.lifetime > 0);

        for (const floatingDamage of this.floatingDamage) {
            floatingDamage.update(deltaTime);
        }
        this.bleedMultipliers = this.bleedMultipliers.filter(bleedMultiplier => bleedMultiplier.lifetime > 0);

        for (const bleedMultiplier of this.bleedMultipliers) {
            bleedMultiplier.update(deltaTime);
        }
        // add check death here
        if (this.onHitCooldown > 0) {
            this.onHitCooldown -= deltaTime;
        }

        if (isColliding(this.player, this) && this.onHitCooldown <= 0) {
            this.player.hp -= 5;
            console.log("Player HP: " + this.player.hp, "colliding");
            this.onHitCooldown = 2;
        }

        if (this.isBuffed && !this.buffAnimationCompleted) {
            this.buffSprite.update();

            if (this.buffSprite.isLastFrame()) {
                this.buffAnimationCompleted = true;
            }
        }
        this.checkDeath();

        // Update sprite animations
        this.currentSprite.update();
    }
    public checkDeath() {
        if (this.hp <= 0) {
            this.isAlive = false;
            this.currentSprite = this.deathSprite
        }
    }

    // Render method to draw the enemy on the canvas
    public render(context: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
        if (!this.isAlive && this.currentSprite.isLastFrame()) return;
        
        context.save();  
        
        // Calculate the screen position relative to the camera
        const screenX = this.x - cameraX;
        const screenY = this.y - cameraY;
        
        // Calculate the scaled sprite dimensions
        const scaledWidth = this.currentSprite.frameWidth * this.scale;
        const scaledHeight = this.currentSprite.frameHeight * this.scale;
        
        // Calculate the top-left corner of the sprite based on its dimensions
        const spriteX = screenX - scaledWidth / this.scale;  // Center the sprite horizontally
        const spriteY = screenY - scaledHeight + this.height;  // Align bottom of the sprite with the bottom of the hitbox
    
        // Draw a debug rectangle for the enemy's hitbox (optional for debugging)
        // context.fillStyle = 'red';
        // context.fillRect(spriteX + scaledWidth / 2 - this.width / 2, spriteY + scaledHeight - this.height, this.width, this.height);
    
        // Render buff if the enemy is buffed and animation isn't completed
        if (this.isBuffed && !this.buffAnimationCompleted) {
            this.buffSprite.render(context, spriteX, spriteY, 1);
        }
    
        // Render the enemy sprite based on its facing direction
        if (!this.isFacingRight) {
            // Flip the context horizontally if the enemy is facing left
            context.translate(screenX + this.width, screenY - scaledHeight/this.scale);
            context.scale(-1, 1);  
            this.currentSprite.render(context, 0, 0, this.scale);
        } else {
            // Regular rendering when facing right
            this.currentSprite.render(context, spriteX, spriteY, this.scale);
        }
    
        context.restore();  // Restore the context state
    
        // Render floating damage (if applicable)
        for (const floatingDamage of this.floatingDamage) {
            floatingDamage.render(context, cameraX, cameraY);
        }
        for (const bleedMultiplier of this.bleedMultipliers) {
            bleedMultiplier.render(context, cameraX, cameraY);
        }
    }
    public getCollisionBox() {
        return {
            x: this.x - this.width * 0.1,
            y: this.y - this.height * 0.1,
            width: this.width * 0.9,
            height: this.height * 0.9
        };
    }
    

    public takeDamage(damage: number) {
        const d = damage * (1 +this.bleedMultiplier);
        this.hp -= d;
        const damageText = new FloatingDamage(this.x, this.y, d);
        this.floatingDamage.push(damageText);
        if (this.bleedMultiplier > 0) {
            const bleedText = new BleedingDamage(this.x + 30, this.y, this.bleedMultiplier);
            this.bleedMultipliers.push(bleedText);

        }
    }

    public freeze(duration: number) {
        // Handle freezing logic, like slowing down movement
        console.log(duration);
    }
}

// Enum to manage different behaviors of the enemy
enum EnemyBehavior {
    Idle,
    Patrolling,
    Chasing,
    Attacking
}