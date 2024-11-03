import { primaryColorBackground } from "../game/colors";
import { drawRoundedBox } from "../game/utils";

    export class LoadingComponent {
        private canvasWidth: number;
        private canvasHeight: number;
        public isVisible: boolean;

        constructor(canvasWidth: number, canvasHeight: number) {
            this.isVisible = false;
            this.canvasWidth = canvasWidth;
            this.canvasHeight = canvasHeight;
        }

        render(context: CanvasRenderingContext2D) {
            drawRoundedBox(context, this.canvasWidth * 0.1, this.canvasHeight * 0.4, this.canvasWidth * 0.8, this.canvasHeight * 0.175, 5, primaryColorBackground);
            let fontSize = this.canvasHeight * 0.04;
            context.font = `${fontSize}px depixel`;
            context.fillStyle = 'white';
            const text = "Loading...";
            const textWidth = context.measureText(text).width;
            const textX = (this.canvasWidth - textWidth) / 2;
            context.fillText(text, textX, this.canvasHeight * 0.5);


        }
        show() {
            this.isVisible = true;
        }
        hide() {
            this.isVisible = false;
        }
    }
