import Enemy from './Enemy';
import Player from './Player';
import Sprite from '../Sprite';
import SkeletonWarrior from './skeletonWarrior';
import { isColliding, resolveCollision } from '../utils';
import ItemManager from './ItemManager';
import { SoundManager } from '../SoundManager';

export default class EnemyManager {
    public enemies: Enemy[] = []; // Array to store enemies
    private player: Player;
    private itemManager: ItemManager;

    constructor(player: Player, itemManager: ItemManager) {
        this.player = player;
        this.itemManager = itemManager;
    }

    // Add a new enemy
    public addEnemy(enemy: Enemy) {
        this.enemies.push(enemy);
    }

    // Spawner/Factory method to create different enemies
    public spawnEnemy(
        type: string, 
        x: number, 
        y: number, 
        idleSprite: Sprite, 
        walkSprite: Sprite, 
        attackSprite: Sprite, 
        deathSprite: Sprite
    ) {
        let newEnemy: Enemy;

        // Example of creating different types of enemies
        switch (type) {
            case 'SkeletonWarrior':
                newEnemy = new SkeletonWarrior(x, y, this.player);
                break;
            // case 'Zombie':
            //     newEnemy = new Zombie(x, y, this.player, idleSprite, walkSprite, attackSprite, deathSprite);
            //     break;
            default:
                newEnemy = new Enemy(idleSprite, walkSprite, attackSprite, deathSprite, x, y, 100, 100, this.player);
                break;
        }

        this.enemies.push(newEnemy);
    }

    // Update all enemies
    public update(deltaTime: number, soundManager: SoundManager) {
        for (const enemy of this.enemies) {
            enemy.update(deltaTime, this.enemies);
            if (!enemy.isAlive && enemy.currentSprite.isLastFrame()) {
                this.itemManager.dropItem(enemy.x, enemy.y);
                this.removeEnemy(enemy);
                soundManager.playSound('enemydeath1');
            }
        }
        const enemies = this.enemies;
        for (let i = 0; i < enemies.length; i++) {
            for (let j = i + 1; j < enemies.length; j++) {
                const enemyA = enemies[i];
                const enemyB = enemies[j];
    
                if (isColliding(enemyA, enemyB)) {
                    resolveCollision(enemyA, enemyB);
                }
            }
        }
    }

    // Render all enemies
    public render(context: CanvasRenderingContext2D, cameraX: number, cameraY: number) {
        for (const enemy of this.enemies) {
            enemy.render(context, cameraX, cameraY);
            console.log(enemy.hp);
        }
    }

    // Remove a dead enemy from the array
    private removeEnemy(enemy: Enemy) {
        this.enemies = this.enemies.filter(e => e !== enemy);
    }

    // Remove all enemies (optional method)
    public clearEnemies() {
        this.enemies = [];
    }
}
