import Sprite from '../Sprite';
import Player from './Player'; // Assuming you have a Player class

export default class Enemy {
    public x: number;
    public y: number;
    public hp: number;
    public maxHp: number;
    public speed: number;
    private currentSprite: Sprite;
    private idleSprite: Sprite;
    private walkSprite: Sprite;
    private attackSprite: Sprite;
    private deathSprite: Sprite;
    private isAlive: boolean;
    private behavior: EnemyBehavior; // Current behavior (Patrolling, Chasing, Attacking)
    private patrolPoints: { x: number, y: number }[]; // Points for patrolling
    private currentPatrolPoint: number;
    private player: Player; // Reference to the player
    private attackRange: number; // Range within which the enemy will attack
    private isFacingRight: boolean;

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
        patrolPoints: { x: number, y: number }[] = []
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
    }

    // Method for switching behavior based on conditions
    private handleBehavior(deltaTime: number) {
        const distanceToPlayer = this.calculateDistanceToPlayer();

        if (distanceToPlayer <= this.attackRange) {
            this.behavior = EnemyBehavior.Attacking;
        } else if (distanceToPlayer <= 200) {
            this.behavior = EnemyBehavior.Chasing;
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
                this.attack();
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
        this.currentSprite = this.walkSprite; // Set walking animation
    }

    // Move towards a target point (common logic for patrolling and chasing)
    private moveTowards(targetX: number, targetY: number, deltaTime: number) {
        const angle = Math.atan2(targetY - this.y, targetX - this.x);
        this.x += Math.cos(angle) * this.speed * deltaTime;
        this.y += Math.sin(angle) * this.speed * deltaTime;
        if (targetX > this.x) {
            this.isFacingRight = true;  // Moving right
        } else if (targetX < this.x) {
            this.isFacingRight = false; // Moving left
        }
    }

    // Attacking behavior
    public attack() {
        this.currentSprite = this.attackSprite; // Play attack animation
        // Attack logic (e.g., reducing player's HP) can be implemented here
    }

    // Calculate distance to player for behavior decisions
    private calculateDistanceToPlayer(): number {
        return this.calculateDistance(this.player.x, this.player.y);
    }

    // Utility function to calculate distance between two points
    private calculateDistance(targetX: number, targetY: number): number {
        const dx = this.x - targetX;
        const dy = this.y - targetY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Update method to handle behavior and movement
    public update(deltaTime: number) {
        if (!this.isAlive) return;

        this.handleBehavior(deltaTime);

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
    public render(context: CanvasRenderingContext2D, scale = 1) {
        if (!this.isAlive) return;
        context.save();  // Save the current context state

        if (!this.isFacingRight) {
            // Flip the context horizontally if the enemy is facing left
            context.scale(-1, 1);  
            this.currentSprite.render(context, -(this.x + this.currentSprite.frameWidth * 2), this.y, scale);
        } else {
            // Regular rendering when facing right
            this.currentSprite.render(context, this.x, this.y, scale);
        }

        context.restore();  // Restore the context state
    }
}

// Enum to manage different behaviors of the enemy
enum EnemyBehavior {
    Idle,
    Patrolling,
    Chasing,
    Attacking
}

// enum EnemyState {
//     Idle,
//     Walking,
//     Attacking,
//     Dying
// }
