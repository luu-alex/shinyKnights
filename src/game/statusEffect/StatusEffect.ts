import Enemy from '../classes/Enemy';
// Base class or interface for status effects
export interface StatusEffect {
    applyEffect(target: Enemy): void;
    update(deltaTime: number): void;  // For ongoing effects like poison
    isExpired(): boolean;  // Check if effect duration has ended
    isDOT: boolean;
}

// Example of a Poison effect that applies damage over time
export class PoisonEffect implements StatusEffect {
    private damageOverTime: number;
    private duration: number;
    public isDOT: boolean = true;
    private cooldownDuration: number;
    private cooldownTimer: number;

    constructor(damageOverTime: number, duration: number, cooldownDuration: number = 1000) {
        this.damageOverTime = damageOverTime;
        this.duration = duration;
        this.cooldownDuration = cooldownDuration;
        this.cooldownTimer = 0;
    }

    applyEffect(target: Enemy): void {
        // Apply poison damage to the target enemy over time
        if (this.cooldownTimer <= 0) {
            // Apply damage only if the cooldown has finished
            target.takeDamage(this.damageOverTime);
            this.cooldownTimer = this.cooldownDuration; // Reset the cooldown
        }
    }

    update(deltaTime: number): void {
        // Reduce the effect's remaining duration
        this.duration -= deltaTime;

        // Decrease the cooldown timer as time passes
        if (this.cooldownTimer > 0) {
            this.cooldownTimer -= deltaTime;
        }
    }

    isExpired(): boolean {
        return this.duration <= 0;
    }
}

export class BleedEffect implements StatusEffect {
    private duration: number;
    public isDOT: boolean = false;

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
    public isDOT: boolean = false;

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

export class BurningEffect implements StatusEffect {
    private damagePerSecond: number;
    private duration: number;
    public isDOT: boolean = true;
    private cooldownDuration: number;
    private cooldownTimer: number;

    constructor(damagePerSecond: number, duration: number, cooldownDuration: number = 2) {
        this.damagePerSecond = damagePerSecond;
        this.duration = duration;
        this.cooldownDuration = cooldownDuration;
        this.cooldownTimer = 0;
    }

    // Apply the burning effect to the target enemy
    applyEffect(target: Enemy): void {
        if (this.cooldownTimer <= 0) {
            // Apply damage only if the cooldown has finished
            target.takeDamage(this.damagePerSecond);
            this.cooldownTimer = this.cooldownDuration; // Reset the cooldown
        }
    }

    update(deltaTime: number): void {
        // Reduce duration as time passes
        this.duration -= deltaTime;

        // Decrease the cooldown timer as time passes
        if (this.cooldownTimer > 0) {
            this.cooldownTimer -= deltaTime;
        }
    }

    isExpired(): boolean {
        return this.duration <= 0;
    }
}