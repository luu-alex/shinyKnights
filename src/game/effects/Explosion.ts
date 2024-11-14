import Sprite from '../Sprite';
import Enemy from '../classes/Enemy';
import { BurningEffect } from '../statusEffect/StatusEffect';
import { checkCollision } from '../utils';

export default class Explosion {
    public x: number;
    public y: number;
    private sprite: Sprite;
    public alive: boolean;
    private duration: number;
    private elapsedTime: number;
    private scale = 1;
    private radius: number;
    public damage: number;
    private hitEnemies: Set<Enemy>;

    constructor(x: number, y: number, sprite: Sprite, duration: number = 100, damage: number) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.alive = true;
        this.duration = duration;  // Total duration of the explosion
        this.elapsedTime = 0;
        this.radius = (this.sprite.frameWidth * this.scale) / 2;
        this.damage = damage;
        this.hitEnemies = new Set();
    }

    public update(deltaTime: number, enemies: Enemy[]) {
        this.elapsedTime += deltaTime;
        if (!this.sprite.isLastFrame()) {
            this.sprite.update();
            this.alive = false;

        }

        // Mark the explosion as finished if the duration has passed
        if (this.elapsedTime >= this.duration) {
            this.alive = false;
        }

        for (const enemy of enemies) {
            if (this.hitEnemies.has(enemy)) continue;
            if (checkCollision(enemy, this.x - (this.sprite.frameWidth/2), this.y - this.sprite.frameHeight/2, this.radius)) {
                enemy.takeDamage(this.damage);
                this.hitEnemies.add(enemy);
                enemy.applyStatusEffect(new BurningEffect(5, 100));
            }
        }
    }

    public render(context: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
        if (this.alive) {// Adjust the explosion's position by half of the scaled sprite's width and height
            // debug
            // context.fillStyle = 'red';
            // context.beginPath();
            // context.arc(this.x, this.y, this.radius, 0, Math.PI * 2); // Visual representation of the explosion
            // context.fill();
            const adjustedX = this.x - (this.sprite.frameWidth * this.scale) / 2 - cameraX;
            const adjustedY = this.y - (this.sprite.frameHeight * this.scale) / 2 - cameraY;

            // Render the sprite with the specified scale
            console.log("explosion frame", this.sprite.isLastFrame())
            if (!this.sprite.isLastFrame())
            this.sprite.render(context, adjustedX, adjustedY, this.scale);
        }
    }
}
