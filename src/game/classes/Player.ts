import Sprite from '../Sprite';
import Weapon from '../weapon/Weapon';
import Enemy from './Enemy';
// import Crossbow from '../weapon/Crossbow';
// import Dagger from '../weapon/Dagger';
import Skill from '../skills/Skill';
import { findClosestEnemy } from '../utils'
import ProjectileManager from '../projectiles/ProjectileManager';

enum PlayerState {
    Idle,
    Walking,
    Dying
}
export default class Player {
    public speed: number;
    x : number;
    y: number;
    private idleSprite: Sprite;
    private walkingSprite: Sprite;
    private dyingSprite: Sprite;
    private currentSprite: Sprite;
    private state: PlayerState;
    private joystickInput: { x: number, y: number };
    private isFacingRight: boolean;
    public currentWeapon: Weapon;
    public width: number;
    public height: number;
    public level: number = 1;
    public skills: Skill[] = [];
    public hp: number = 100;
    public gold = 0;
    public maxHP: number = 100;
    public strength = 0;
    public projectileManager: ProjectileManager;
    
    constructor(sprites: Sprite[], x: number, y: number, speed: number, projectileManager: ProjectileManager, weapon: Weapon) {
        this.idleSprite = sprites[0];
        this.walkingSprite = sprites[1];
        this.dyingSprite = sprites[2];
        this.currentSprite = this.idleSprite;
        this.state = PlayerState.Idle;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.joystickInput = { x: 0, y: 0 };
        this.isFacingRight = true;
        this.currentWeapon = weapon;
        this.width = 32;
        this.height = 32;
        this.projectileManager = projectileManager;

    }

    update(deltaTime: number, mapWidth: number, mapHeight: number) {
        this.x += this.joystickInput.x * this.speed * deltaTime;
        this.y += this.joystickInput.y * this.speed * deltaTime;

        this.x = Math.max(0, Math.min(this.x, mapWidth - this.width));
        this.y = Math.max(0, Math.min(this.y, mapHeight - this.height))

        this.handleAnimation();

        this.handleDirection();

        // Update the sprite animation
        this.currentSprite.update();
    }

    useSkill(skillIndex: number, enemies: Enemy[], currentTime: number) {
        const skill = this.skills[skillIndex];
        skill.activateSkill(enemies, currentTime);
    }
    attack(enemies: Enemy[]) {
        const closestEnemy = findClosestEnemy(enemies, this);

        if (closestEnemy) {
            const spawnPoint = this.getClosestEdgeToEnemy(closestEnemy);
            return this.currentWeapon.attack(spawnPoint.x, spawnPoint.y, closestEnemy.x + closestEnemy.width/2, closestEnemy.y + closestEnemy.height/2);
        }
    }
    render(context: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
        context.save();
        
        // Calculate the scaled width and height of the sprite
        const scaledWidth = this.currentSprite.frameWidth * 2;
        const scaledHeight = this.currentSprite.frameHeight * 2;
        const screenX = this.x - cameraX;
        const screenY = this.y - cameraY;
    
        if (!this.isFacingRight) {
            context.translate(screenX, screenY);  // Move to the sprite center
            context.scale(-1, 1);  // Flip horizontally
            context.translate(-scaledWidth + scaledWidth/3, -scaledHeight / 2);  // Translate back by half width and height
            
            // Render the sprite after applying the transformations
            this.currentSprite.render(context, 0, 0, 2); 
        } else {
            // Render the sprite normally when facing right
            this.currentSprite.render(context, screenX - scaledWidth/3, screenY - scaledHeight/2, 2);
        }
        
        context.restore();
        
        // Debug rectangle (optional)
        // context.strokeStyle = 'red';
        // context.strokeRect(screenX, screenY, this.width, this.height);
    }
    private handleAnimation() {
        switch (this.state) {
            case PlayerState.Idle:
                this.currentSprite = this.idleSprite;
                break;
            case PlayerState.Walking:
                this.currentSprite = this.walkingSprite;
                break;
            case PlayerState.Dying:
                this.currentSprite = this.dyingSprite;
                break;
        }
    }
    private handleDirection() {
        if (this.joystickInput.x > 0) {
            this.isFacingRight = true;  // Moving right
        } else if (this.joystickInput.x < 0) {
            this.isFacingRight = false; // Moving left
        }
    }

    private getClosestEdgeToEnemy(enemy: Enemy): { x: number, y: number } {
        const playerCenterX = this.x + this.width / 2;
        const playerCenterY = this.y + this.height / 2;

        const dx = enemy.x - playerCenterX;
        const dy = enemy.y - playerCenterY;


        // Determine which edge the enemy is closest to
        let spawnX: number = this.x;
        let spawnY: number = this.y;

        // If the enemy is more to the left or right
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) {
                // Enemy is to the right, spawn at the right edge
                spawnX = this.x + this.width;
            } else {
                // Enemy is to the left, spawn at the left edge
                spawnX = this.x;
            }
            spawnY = playerCenterY; // Spawn vertically at the center
        } else {
            // If the enemy is more above or below
            if (dy > 0) {
                // Enemy is below, spawn at the bottom edge
                spawnY = this.y + this.height;
            } else {
                // Enemy is above, spawn at the top edge
                spawnY = this.y;
            }
            spawnX = playerCenterX; // Spawn horizontally at the center
        }

        return { x: spawnX, y: spawnY };
    }

    // Handle joystick or movement input
    handleInput(xInput: number, yInput: number) {
        this.joystickInput = { x: xInput, y: yInput };
        if (xInput !== 0 || yInput !== 0) {
            this.state = PlayerState.Walking;
        } else {
            this.state = PlayerState.Idle;
        }
    }

    public learnSkill(skill: Skill) {
        this.skills.push(skill);
    }

    public upgradeSkill(skillIndex: number) {
        const skill = this.skills[skillIndex];
        skill.upgrade();
    }

    public levelUp() {

        this.level++;
        // give option to upgrade skills or buffs
    }
}