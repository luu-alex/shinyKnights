import Enemy from '../classes/Enemy';
// Base class or interface for status effects
export interface StatusEffect {
    applyEffect(target: Enemy): void;
    update(deltaTime: number): void;  // For ongoing effects like poison
    isExpired(): boolean;  // Check if effect duration has ended
}

// Example of a Poison effect that applies damage over time
export class PoisonEffect implements StatusEffect {
    private damageOverTime: number;
    private duration: number;

    constructor(damageOverTime: number, duration: number) {
        this.damageOverTime = damageOverTime;
        this.duration = duration;
    }

    applyEffect(target: Enemy): void {
        // Apply poison damage to the target enemy over time
        target.takeDamage(this.damageOverTime);
    }

    update(deltaTime: number): void {
        // Reduce the effect's remaining duration
        this.duration -= deltaTime;
    }

    isExpired(): boolean {
        return this.duration <= 0;
    }
}

export class BleedEffect implements StatusEffect {
    private duration: number;

    constructor(duration: number) {
        this.duration = duration;
    }

    applyEffect(target: Enemy): void {
        // Apply poison damage to the target enemy over time
        target.bleedMultiplier += 1;
    }

    update(deltaTime: number): void {
        // Reduce the effect's remaining duration
        this.duration -= deltaTime/1000;
    }

    isExpired(): boolean {
        return this.duration <= 0;
    }
}

export class FreezeEffect implements StatusEffect {
    private freezeDuration: number;

    constructor(freezeDuration: number) {
        this.freezeDuration = freezeDuration;
    }

    applyEffect(target: Enemy): void {
        target.freeze(this.freezeDuration);  // Custom freeze method on the Enemy
    }

    update(deltaTime: number): void {
        this.freezeDuration -= deltaTime;
    }

    isExpired(): boolean {
        return this.freezeDuration <= 0;
    }
}
