import { drawRoundedBox } from "../game/utils";

export class BoxComponent {
    private width: number;
    private height: number;
    private x: number;
    private y: number;
    private onClick: () => void;
    constructor(x:number, y:number, width: number, height: number, onClick: () => void) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.onClick = onClick;
    }
    render(context: CanvasRenderingContext2D, x: number, y: number, width: number, height:number, radius:number, color: string, lineWidth: number, bottomEdge: boolean = false, bottomEdgeLength: number = 3) {
        drawRoundedBox(context, x, y, width, height, radius, color, lineWidth, bottomEdge, bottomEdgeLength);
    }
    handleClick(mouseX: number, mouseY: number, devicePixelRatio: number) {
		if (
			mouseX >= this.x * devicePixelRatio &&
			mouseX <= (this.x + this.width) * devicePixelRatio &&
			mouseY >= this.y * devicePixelRatio &&
			mouseY <= (this.y + this.height) * devicePixelRatio
		) {
			this.onClick();
		}
	}
    isClicked(mouseX: number, mouseY: number, devicePixelRatio: number) {
        return (
            mouseX >= this.x * devicePixelRatio &&
            mouseX <= (this.x + this.width) * devicePixelRatio &&
            mouseY >= this.y * devicePixelRatio &&
            mouseY <= (this.y + this.height) * devicePixelRatio
        );
    }
}