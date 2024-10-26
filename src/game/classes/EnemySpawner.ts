import EnemyManager from './EnemyManager';
import Player from './Player';
import SkeletonWarrior from './SkeletonWarrior';
import Ghoul from './Ghoul';
// import Banshee from './Banshee';
import SkeletonMage from './SkeletonMage';

export default class EnemySpawner {
    private enemyManager: EnemyManager;
    private player: Player;
    private spawnInterval: number;
    private timeSinceLastSpawn: number;
    private maxEnemies: number;
    private difficultyIncreaseRate: number;
    private enemyTypes: any[];

    constructor(enemyManager: EnemyManager, player: Player, initialSpawnInterval: number, maxEnemies: number, difficultyIncreaseRate: number) {
        this.enemyManager = enemyManager;
        this.player = player;
        this.spawnInterval = initialSpawnInterval;  // Initial time between spawns (in seconds)
        this.timeSinceLastSpawn = 0;
        this.maxEnemies = maxEnemies;
        this.difficultyIncreaseRate = difficultyIncreaseRate; // Decrease interval over time to increase difficulty

        // Different enemy types to randomly choose from
        this.enemyTypes = [SkeletonWarrior, Ghoul, SkeletonMage];
    }

    // Update the spawner every frame
    public update(deltaTime: number) {
        this.timeSinceLastSpawn += deltaTime;

        // If enough time has passed, spawn a new enemy
        if (this.timeSinceLastSpawn >= this.spawnInterval && this.enemyManager.enemies.length < this.maxEnemies) {
            this.spawnEnemy();
            this.timeSinceLastSpawn = 0;
        }

        // Increase difficulty over time by reducing spawn interval
        if (this.spawnInterval > 1) {
            this.spawnInterval -= this.difficultyIncreaseRate * deltaTime;
        }
    }

    // Spawn a new enemy at a random location
    private spawnEnemy() {
        const randomTypeIndex = Math.floor(Math.random() * this.enemyTypes.length);
        const EnemyClass = this.enemyTypes[randomTypeIndex];

        // Random spawn position around the map
        const spawnX = Math.random() * 3000;  // Example: within 800px width
        const spawnY = Math.random() * 2000;  // Example: within 600px height

        const newEnemy = new EnemyClass(spawnX, spawnY, this.player);
        this.enemyManager.addEnemy(newEnemy);
    }
}
