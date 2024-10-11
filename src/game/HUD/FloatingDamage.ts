export default class FloatingDamage {
    public x: number;
    public y: number;
    public damage: number;
    public lifetime: number;
    public alpha: number;

    constructor(x: number, y: number, damage: number, lifetime = 3) {
        this.x = x;
        this.y = y;
        this.damage = damage;
        this.lifetime = lifetime; // Time in ms to show the damage text
        this.alpha = 3; // Opacity for fade-out effect
    }

    // Update the position and lifetime of the floating damage text
    public update(deltaTime: number) {
        this.y -= 0.5 * deltaTime*10; // Float upward
        this.lifetime -= deltaTime;
        this.alpha = Math.max(0, this.lifetime / 3); // Gradually fade out
    }

    // Render the floating damage text
    public render(context: CanvasRenderingContext2D) {
        if (this.lifetime > 0) {
            context.save();
            context.globalAlpha = this.alpha; // Apply transparency
            context.font = "16px Arial";
            context.fillStyle = "yellow"; // Color of the damage text
            context.fillText(this.damage.toString(), this.x, this.y);
            context.restore();
        }
    }
}
