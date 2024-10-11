import Sprite from '../Sprite';
import Enemy from '../classes/Enemy';
import { StatusEffect } from '../statusEffect/StatusEffect';

export default class Projectile {
    public x: number;
    public y: number;
    public speed: number;
    public damage: number;
    public alive: boolean;
    public targetX: number;
    public targetY: number;
    public pierce: number;
    private hitEnemies: Set<Enemy>;
    public radius: number;
    private maxDistance: number;
    private distanceTraveled: number;
    public directionX: number;
    public directionY: number;
    public sprite: Sprite;
    public statusEffects: StatusEffect[] = [];  

    constructor(x: number, y: number, targetX: number, targetY: number, damage: number, pierce: number, radius = 5, maxDistance = 1000, sprite: Sprite, statusEffects: StatusEffect[] = []) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.damage = damage;
        this.speed = 500; // Speed of projectile
        this.alive = true;
        this.pierce = pierce;
        this.hitEnemies = new Set();
        this.radius = radius;
        this.maxDistance = maxDistance;
        this.distanceTraveled = 0;
        // Normalize the direction vector
        const dx = targetX - x;
        const dy = targetY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        this.directionX = dx / distance;  // Normalize X
        this.directionY = dy / distance;  // Normalize Y
        this.sprite = sprite;
        this.statusEffects = statusEffects;
    }

    // Update projectile position
    public update(deltaTime: number) {
        const dx = this.directionX * this.speed * deltaTime;
        const dy = this.directionY * this.speed * deltaTime;

        this.x += dx;
        this.y += dy;

        this.distanceTraveled += Math.sqrt(dx * dx + dy * dy);
        // Check if the projectile is out of bounds or should be removed
        if (this.distanceTraveled >= this.maxDistance) {
            this.alive = false;
        }
    }

    // Check collision with enemies
    public checkCollision(enemies: Enemy[]) {
        for (const enemy of enemies) {
            if (this.hitEnemies.has(enemy)) continue;

            // Check if the projectile has collided with the enemy's hitbox
            if (this.isCollidingWithEnemy(enemy)) {
                enemy.takeDamage(this.damage);  // Deal damage to the enemy
                this.hitEnemies.add(enemy);  // Mark the enemy as hit
                this.onHit(enemy);

                // Decrease pierce count and destroy the projectile if no pierce is left
                if (this.pierce > 0) {
                    this.pierce--;
                } else {
                    this.alive = false;  // Destroy the projectile after it pierces the allowed number of enemies
                    return;
                }
            }
        }
    }


    // Check if the projectile is colliding with the enemy
    private isCollidingWithEnemy(enemy: Enemy): boolean {
        // Check for circular collision (projectile) vs. rectangular hitbox (enemy)
        const distX = Math.abs(this.x - (enemy.x + enemy.width / 2));
        const distY = Math.abs(this.y - (enemy.y + enemy.height / 2));

        // If the distance is greater than half the box + the radius, no collision
        if (distX > (enemy.width / 2 + this.radius)) return false;
        if (distY > (enemy.height / 2 + this.radius)) return false;

        // If the distance is less than half the box, it's definitely colliding
        if (distX <= (enemy.width / 2)) return true;
        if (distY <= (enemy.height / 2)) return true;

        // Check for corner collision (circle vs rectangle)
        const dx = distX - enemy.width / 2;
        const dy = distY - enemy.height / 2;
        return (dx * dx + dy * dy <= this.radius * this.radius);
    }
    public onHit(target: Enemy) {
        for (const effect of this.statusEffects) {
            effect.applyEffect(target);
        }
    }


    // Render the projectile on the canvas
    public render(context: CanvasRenderingContext2D) {
        if (this.alive) {
            context.fillStyle = 'red';
            context.beginPath();
            context.arc(this.x, this.y, 5, 0, Math.PI * 2); // Draw bullet as a circle
            context.fill();
        }
    }
}
