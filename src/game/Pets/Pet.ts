import Sprite from '../Sprite';
import { isColliding } from '../utils';
import Player from '../classes/Player';
import Enemy from '../classes/Enemy';

class Pet {
    public sprites: Sprite[];
    public x: number;
    public y: number;
    public speed: number;
    public state: string;
    public player: Player;
    public currentSprite: Sprite;
    public attackRange: number;
    public width: number;
    public height: number;
    public name: string;
    public upgrades: ((pet: Pet) => void)[];

    constructor(name: string, sprites: Sprite[], player: Player) {
        this.sprites = sprites;
        this.x = player.x; // Pet will initially be near the player
        this.y = player.y;
        this.speed = 100; // Adjust speed accordingly
        this.state = 'idle';
        this.player = player;
        this.currentSprite = this.sprites[0]; // Start with idle animation
        this.attackRange = 50; // Example attack range
        this.width = this.sprites[0].frameWidth;
        this.height = this.sprites[0].frameHeight;
        this.name = name;
        this.upgrades = []

    }

    // Update the pet behavior each frame
    update(delta: number, enemies: Enemy[]) {
        switch (this.state) {
            case 'idle':
                this.handleIdle(enemies, delta);
                break;
            case 'walk':
                this.handleWalk(delta);
                break;
            case 'attack':
                this.handleAttack(enemies, delta);
                break;
        }
        
        // Follow player loosely
        if (Math.hypot(this.player.x - this.x, this.player.y - this.y) > 50) {
            this.state = 'walk';
        } else {
            this.state = 'idle';
        }
    }

    public upgrade() {
        if (this.upgrades.length > 0) {
            // Apply the next available upgrade
            const upgradeFn = this.upgrades.shift();  // Get the next upgrade
            if (upgradeFn) {
                upgradeFn(this);
            }
        }
    }

    handleIdle(_ : Enemy[], __ : number) {
        this.currentSprite = this.sprites[0]; // Idle animation sprite
        this.currentSprite.update();
    }

    handleWalk(delta: number) {
        this.currentSprite = this.sprites[1]; // Walking animation sprite

        // Move towards the player
        const angle = Math.atan2(this.player.y - this.y, this.player.x - this.x);
        this.x += Math.cos(angle) * this.speed * delta;
        this.y += Math.sin(angle) * this.speed * delta;

        this.currentSprite.update();
}

    public addUpgrade(upgradeFn: (pet: Pet) => void) {
        this.upgrades.push(upgradeFn);
    }

    handleAttack(enemies: Enemy[], _: number) {
        this.currentSprite = this.sprites[2]; // Attack animation sprite
        for (const enemy of enemies) {
            if (isColliding(this, enemy) && Math.hypot(enemy.x - this.x, enemy.y - this.y) < this.attackRange) {
                // Deal damage to the enemy
                enemy.takeDamage(10); // Example damage
                break;
            }
        }
        this.currentSprite.update();
    }

    render(context: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
        this.currentSprite.render(context, this.x - cameraX, this.y - cameraY);
    }
}

export default Pet;
