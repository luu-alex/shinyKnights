import Enemy from './Enemy';
import Sprite from '../Sprite';
import Player from './Player';
export default class SkeletonWarrior extends Enemy {
    constructor(x: number, y: number, player: Player, scale = 2) {
        const idleSprite = new Sprite('characters/skeletonWarrior.png', 32, 32, 4, 100);
        const walkSprite = new Sprite('characters/skeletonWarrior.png', 32, 32, 6, 100, 1);
        const attackSprite = new Sprite('characters/skeletonWarrior.png', 32, 32, 5, 100, 3);
        const deathSprite = new Sprite('characters/skeletonWarrior.png', 32, 32, 6, 100, 6);
        super(idleSprite, walkSprite, attackSprite, deathSprite, x, y, 50, 100, player, 50, [], scale);
    }

    // Goblins may have a special attack
    public attack(deltaTime: number) {
        super.attack(deltaTime);
        // skeleton's unique attack logic here
    }
}
