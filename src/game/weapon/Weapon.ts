import Projectile from "../projectiles/Projectile";

export default class Weapon {
    public name: string;
    public damage: number;
    public cooldown: number; // Time between attacks
    public lastAttackTime: number;

    constructor(name: string, damage: number, cooldown: number) {
        this.name = name;
        this.damage = damage;
        this.cooldown = cooldown;
        this.lastAttackTime = 0;
    }

    // Method to attack (to be overridden by specific weapons)
    public attack(_: number, __: number, ___: number, ____: number): Projectile | null {
        // Base attack logic (for melee or ranged)
        return null;
    }

    // Check if the weapon is ready to attack (based on cooldown)
    public canAttack(): boolean {
        const now = Date.now();
        return (now - this.lastAttackTime) >= this.cooldown;
    }
}
