import Pet from './Pets/Pet';
import Sprite from './Sprite';
import Enemy from './classes/Enemy';
import Player from './classes/Player';

// Helper function to check AABB collision between two enemies
export function isColliding(enemyA: Enemy | Player | Pet, enemyB: Enemy): boolean {
    const enemyHitBox = enemyB.getCollisionBox();
    return (
        enemyA.x < enemyHitBox.x + enemyHitBox.width &&
        enemyA.x + enemyA.width > enemyHitBox.x &&
        enemyA.y < enemyHitBox.y + enemyHitBox.height &&
        enemyA.y + enemyA.height > enemyHitBox.y
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

export function findClosestEnemy(enemies: Enemy[], player: Player | Pet): Enemy | null {
    if (enemies.length === 0) return null;  // No enemies, return null

    let closestEnemy: Enemy | null = null;
    let shortestDistance = Infinity;

    for (const enemy of enemies) {
        const distance = Math.sqrt((enemy.x - player.x) ** 2 + (enemy.y - player.y) ** 2);
        if (distance < shortestDistance) {
            shortestDistance = distance;
            closestEnemy = enemy;
        }
    }

    return closestEnemy;  // Return the closest enemy
}

export function checkCollision(enemy: Enemy, x: number, y: number, radius: number) {
    const enemyCenterX = enemy.x + enemy.width / 2;
    const enemyCenterY = enemy.y + enemy.height / 2;

    // Calculate distance between explosion center and enemy center
    const dx = enemyCenterX - x;
    const dy = enemyCenterY - y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Check if the distance is less than or equal to the explosion radius
    if (distance <= radius) {
        // Collision detected, apply effects or damage
        // enemy.takeDamage(damage);  // Example of applying 50 damage
        // console.log('Explosion hit enemy!');
        return true;
    }
}
export function getRandomElement<T>(array: T[]): T | null {
    return array.length > 0 ? array[Math.floor(Math.random() * array.length)] : null;
}

export function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    let line = '';
    const lines: string[] = [];

    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth && i > 0) {
            lines.push(line.trim());
            line = words[i] + ' ';
        } else {
            line = testLine;
        }
    }

    lines.push(line.trim()); // Push the last line
    return lines;
}

export function drawCenteredText(context: CanvasRenderingContext2D, text: string, centerX: number, y: number) {
    // Measure the width of the text
    const textMetrics = context.measureText(text);
    const textWidth = textMetrics.width;

    // Calculate the x-coordinate to start the text to make it centered
    const startX = centerX - (textWidth / 2);

    // Draw the text
    context.fillText(text, startX, y);
}

export function drawRoundedBox(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    fillColor: string,
    lineWidth: number = 3,
    bottomEdge: boolean = false,
    bottomEdgeLength: number = 3,
    useFillcolor: boolean = false
) {
    context.strokeStyle = useFillcolor ? fillColor : 'black';
    context.lineWidth = lineWidth;  // Make the outline thick

    context.fillStyle = fillColor;

    
    // Begin a new path to draw the rounded box
    context.beginPath();

    // Start at the top-left corner and move around the box, drawing curves at each corner
    context.moveTo(x + radius, y); // Top-left corner
    context.lineTo(x + width - radius, y); // Top edge
    context.quadraticCurveTo(x + width, y, x + width, y + radius); // Top-right corner curve
    context.lineTo(x + width, y + height - radius); // Right edge
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height); // Bottom-right corner curve
    context.lineTo(x + radius, y + height); // Bottom edge
    context.quadraticCurveTo(x, y + height, x, y + height - radius); // Bottom-left corner curve
    context.lineTo(x, y + radius); // Left edge
    context.quadraticCurveTo(x, y, x + radius, y); // Top-left corner curve
    // Close the path and fill the box
    context.closePath();
    context.fill();

    context.stroke();
    if (bottomEdge) {
        // Draw a separate path for the thicker bottom edge with curved corners
        context.strokeStyle = useFillcolor ? fillColor : 'black';
        context.beginPath();
        // Move to the start of the bottom-left corner curve
        context.moveTo(x, y + height);
        // Draw the bottom edge line with curves on both ends
        context.lineTo(x + width - 2, y + height);
        context.quadraticCurveTo(x + width, y + height, x + width, y + height - 2);
        context.moveTo(x + 2, y + height - 2);
        context.quadraticCurveTo(x, y + height, x + 2, y + height);
        // Set the custom line width and stroke color for the bottom edge
        context.lineWidth = bottomEdgeLength;
        context.stroke();
    }
}

export function levelToGold(level: number): number {
    return Math.pow(level, 2);
}

export const getSprite = (name: string) => { 
    if (name === "spear") {
        return new Sprite('weaponIcons/basicSpear.png', 32, 32, 4, 100);
    } else if (name === "chest") {
        return new Sprite('inventoryItems/basicchest.png', 25, 15, 1, 100)
    } else if (name === "swordsmaster") {
        return new Sprite('characters/swordman.png', 32, 32, 4, 100);
    } else if (name === "basicChest") {
        return new Sprite('inventoryItems/basicchest.png', 25, 15, 1, 100);
    } else if (name === "dagger") {
        return new Sprite('weaponIcons/dagger.png', 32, 32, 4, 100);
    }
    return new Sprite('weaponIcons/basicSpear.png', 32, 32, 4, 100);
}

export const getDescription = (name: string) => {
    if (name === "basicChest") {
        return "A basic chest that contains a random item.";
    }
    return "";
}

export const getTitle = (name: string) => {
    if (name === "basicChest") {
        return "Basic Chest"
    }
    return ""
}