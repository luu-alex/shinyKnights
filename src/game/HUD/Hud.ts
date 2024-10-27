import Player from "../classes/Player";
import "../fonts/fonts.module.css";
import { lighterGreenBackground, lightBlack, darkGold, lightGold } from '../colors';
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
        const canvasHeight = canvas.height / devicePixelRatio;
        const canvasWidth = canvas.width / devicePixelRatio;
        // Display Gold
        context.font = `${canvasHeight*0.02}px depixel`;


        // Draw an HP bar
        const maxHpBarWidth = canvasWidth * 0.96;
        const hpBarWidth = (this.player.hp / 100) * maxHpBarWidth;

        context.fillStyle = lightBlack;
        context.fillRect(canvasWidth * 0.02, canvasHeight * 0.01, maxHpBarWidth, canvasHeight * 0.035);

        context.lineWidth = 3;  // Make the outline thick
        context.strokeStyle = 'black';
        context.strokeRect(canvasWidth * 0.02, canvasHeight * 0.01, maxHpBarWidth, canvasHeight * 0.035);

        // hp bar
        context.fillStyle = lighterGreenBackground;
        context.fillRect(canvasWidth * 0.1 , canvasHeight * 0.017, hpBarWidth * 0.90, canvasHeight * 0.02);

        context.fillStyle = '#ffffff';
        context.font = `${canvasHeight*0.02}px depixel`;
		context.fillText(`HP`, canvasWidth * 0.03, canvasHeight * 0.035);

        // Display round number, time and gold
        context.fillStyle = lightBlack;
        context.fillRect(canvasWidth * 0.02, canvasHeight * 0.055, maxHpBarWidth, canvasHeight * 0.04);

        context.lineWidth = 3;  // Make the outline thick
        context.strokeStyle = 'black';
        context.strokeRect(canvasWidth * 0.02, canvasHeight * 0.055, maxHpBarWidth, canvasHeight * 0.04);

        // level and wave

        // wave outline
        context.lineWidth = 3;  // Make the outline thick
        context.strokeStyle = 'black';
        context.strokeRect(canvasWidth * 0.04 , canvasHeight * 0.0625, maxHpBarWidth * 0.15, canvasHeight * 0.025);

        context.fillStyle = "black";
        context.fillRect(canvasWidth * 0.04 , canvasHeight * 0.0625, maxHpBarWidth * 0.15, canvasHeight * 0.025);

        context.fillStyle = "white";
        context.fillRect(canvasWidth * 0.04 + maxHpBarWidth * 0.15 , canvasHeight * 0.0625, maxHpBarWidth * 0.15, canvasHeight * 0.025);
        // wave text
		context.fillStyle = 'white';
		context.font = `${canvasHeight*0.02}px depixel`;
		context.fillText(`Wave `, canvasWidth * 0.041, canvasHeight * 0.084);

        context.fillStyle = "black";
        context.fillText(`${currentRound}`, canvasWidth * 0.05 + maxHpBarWidth * 0.15, canvasHeight * 0.084);

        context.fillStyle = '#ffffff';
        context.font = `${canvasHeight*0.034}px depixel`;
        if (roundTimer < 0) {
            roundTimer = 0;
        }
		context.fillText(`00: ${roundTimer < 10 ? 0 : ""}${roundTimer.toFixed(0)}`, canvasWidth * 0.40, canvasHeight * 0.087);
        

        // wave outline
        context.lineWidth = 3;  // Make the outline thick
        context.strokeStyle = darkGold;
        context.strokeRect(canvasWidth * 0.67 , canvasHeight * 0.0625, maxHpBarWidth * 0.3, canvasHeight * 0.025);

        context.fillStyle = darkGold;
        context.fillRect(canvasWidth * 0.67 , canvasHeight * 0.0625, maxHpBarWidth * 0.15, canvasHeight * 0.025);

        context.fillStyle = lightGold;
        context.fillRect(canvasWidth * 0.67 + maxHpBarWidth * 0.15, canvasHeight * 0.0625, maxHpBarWidth * 0.15, canvasHeight * 0.025);
        // wave text
		context.fillStyle = lightGold;
		context.font = `${canvasHeight*0.02}px depixel`;
		context.fillText(`Gold `, canvasWidth * 0.68, canvasHeight * 0.084);
        
        context.fillStyle = darkGold;
        context.fillText(`${this.player.gold}`, canvasWidth * 0.68 + maxHpBarWidth * 0.15, canvasHeight * 0.084);

        context.restore();
    }
}
