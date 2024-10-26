import Player from "../classes/Player";

export default class HUD {
    private player: Player;

    constructor(player: Player) {
        this.player = player;
    }

    // Update HUD values (if necessary, though for now it's just rendering)
    update() {
        // You can add logic here if the HUD needs to react to certain events
    }

    // Render the HUD on the screen
    render(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement, currentRound: number, roundTimer: number, devicePixelRatio: number) {
        context.save();
        // Display HP

        // Display Gold
        context.fillText(`Gold: ${this.player.gold}`, 20, 100);

        // Optional: Draw an HP bar
        const maxHpBarWidth = 100;
        const hpBarWidth = (this.player.hp / 100) * maxHpBarWidth;
        context.fillStyle = 'red';
        context.fillRect(20, 60, hpBarWidth, 20);
        context.strokeStyle = 'white';
        context.strokeRect(20, 60, maxHpBarWidth, 20);
        // console.log(canvas.width, devicePixelRatio)
        // console.log("canvas", canvas.width/ devicePixelRatio/ 2)

		context.fillStyle = '#ffffff';
		context.font = '12px Arial';
		context.fillText(`Round: ${currentRound}`, 20, 40);
		context.fillText(`Time: ${roundTimer.toFixed(0)}`, canvas.width / devicePixelRatio / 2 - 20, 40);

        context.restore();
    }
}
