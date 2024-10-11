import Enemy from './classes/Enemy';
import Player from './classes/Player';

// Helper function to check AABB collision between two enemies
export function isColliding(enemyA: Enemy | Player, enemyB: Enemy): boolean {
    return (
        enemyA.x < enemyB.x + enemyB.width &&
        enemyA.x + enemyA.width > enemyB.x &&
        enemyA.y < enemyB.y + enemyB.height &&
        enemyA.y + enemyA.height > enemyB.y
    );
}


// Helper function to resolve the collision by separating the enemies
export function resolveCollision(enemyA: Enemy | Player, enemyB: Enemy) {
    // Calculate overlap on both axes
    const overlapX = (enemyA.x + enemyA.width / 2) - (enemyB.x + enemyB.width / 2);
    const overlapY = (enemyA.y + enemyA.height / 2) - (enemyB.y + enemyB.height / 2);

    // Determine the smallest overlap axis to resolve collision
    if (Math.abs(overlapX) > Math.abs(overlapY)) {
        // Resolve collision on the Y axis (move vertically)
        if (overlapY > 0) {
            // Move enemyA down, enemyB up
            enemyA.y += 1;
            enemyB.y -= 1;
        } else {
            // Move enemyA up, enemyB down
            enemyA.y -= 1;
            enemyB.y += 1;
        }
    } else {
        // Resolve collision on the X axis (move horizontally)
        if (overlapX > 0) {
            // Move enemyA right, enemyB left
            enemyA.x += 1;
            enemyB.x -= 1;
        } else {
            // Move enemyA left, enemyB right
            enemyA.x -= 1;
            enemyB.x += 1;
        }
    }
}
