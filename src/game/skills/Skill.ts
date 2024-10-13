import Sprite from '../Sprite'
import { StatusEffect } from '../statusEffect/StatusEffect';
import Enemy from '../classes/Enemy';
import Player from '../classes/Player';
export default class Skill {
    public name: string;
    public baseDamage: number;
    public damage: number;
    public cooldown: number;
    public lastUsed: number;
    public sprite: Sprite; // Sprite for rendering the skill
    private level: number;
    private upgrades: ((skill: Skill) => void)[]; // List of possible upgrades
    public player: Player;
    public statusEffects: StatusEffect[] = [];

    constructor(name: string, baseDamage: number, cooldown: number, sprite: Sprite, player: Player) {
        this.name = name;
        this.baseDamage = baseDamage;
        this.damage = baseDamage;
        this.cooldown = cooldown;
        this.lastUsed = -Infinity;  // Initialize last used to a very early time
        this.sprite = sprite;
        this.level = 1;
        this.upgrades = [];
        this.player = player;
    }

    // Add status effects to the skill (applied on attack)
    public addStatusEffect(effect: StatusEffect) {
        this.statusEffects.push(effect);
    }

    // Check if the skill is off cooldown
    public canUseSkill(currentTime: number): boolean {
        return currentTime >= this.lastUsed + this.cooldown;
    }

    // Activate the skill, applying its effects
    public activateSkill(_: Enemy[], currentTime: number) {
        if (!this.canUseSkill(currentTime)) return;

        // Start the cooldown
        this.lastUsed = currentTime;
    }

    // Render the skill animation
    public render(context: CanvasRenderingContext2D, x: number, y: number) {
        this.sprite.render(context, x, y);
    }

    // Upgrade the skill with new abilities or more damage
    public upgrade() {
        if (this.upgrades.length > 0) {
            // Apply the next available upgrade
            const upgradeFn = this.upgrades.shift();  // Get the next upgrade
            if (upgradeFn) {
                upgradeFn(this);
            }
            this.level++;
        }
    }

    // Add possible upgrades
    public addUpgrade(upgradeFn: (skill: Skill) => void) {
        this.upgrades.push(upgradeFn);
    }

    update(_: number, enemies: Enemy[]) {
        const currentTime = Date.now();

        // If the skill is off cooldown, activate it
        if (this.canUseSkill(currentTime)) {
            this.activateSkill(enemies, currentTime);
        }

        // Update sprite for animation (if necessary)
        this.sprite.update();
    }
}
