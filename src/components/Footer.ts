import Sprite from "../game/Sprite";
import { primaryColorBackground } from "../game/colors";

class FooterButtons {
    public x: number
    public y: number
    public width: number
    public height: number
    private sprite: Sprite;

    constructor(x: number, y: number, width: number, height: number, sprite: Sprite) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.sprite = sprite;
    }

    render(context: CanvasRenderingContext2D) {
        context.fillStyle = primaryColorBackground;
        context.fillRect(this.x, this.y, this.width, this.height);
        // create lines to seperate the buttons
        context.beginPath();
        context.moveTo(this.x + this.width, this.y);
        context.lineTo(this.x + this.width, this.y + this.height);
        context.strokeStyle = "black";
        context.lineWidth = 2;
        context.stroke();
        // draw sprite in the middle of the button
        // Calculate the scaling factor for the sprite to fit inside the button
        const padding = 10;  // Padding inside the button
        const iconWidth = this.width - padding * 2;  // Available width for the sprite
        const iconHeight = this.height - padding * 2;  // Available height for the sprite

        // Calculate the scale based on the smallest dimension
        const scale = Math.min(iconWidth / this.sprite.frameWidth, iconHeight / this.sprite.frameHeight);

        // Calculate the centered position for the sprite
        const spriteX = this.x + (this.width - this.sprite.frameWidth * scale) / 2;
        const spriteY = this.y + (this.height - this.sprite.frameHeight * scale) / 2;

        // Draw the sprite at the calculated position and scaled size
        this.sprite.render(context, spriteX, spriteY, scale);

    }
    handleClick(mouseX: number, mouseY: number, buttonName: string) {
        if (mouseX >= this.x && mouseX <= this.x + this.width && mouseY >= this.y && mouseY <= this.y + this.height) {
            return buttonName;
        }
    }

}

export class Footer {
    private canvasWidth;
    private canvasHeight;
    public HomeButton: FooterButtons;
    public playerButton: FooterButtons;
    public shoppingButton: FooterButtons;
    public inventoryButton: FooterButtons;
    private changePage: (page: string) => void;
    constructor(canvasWidth: number, canvasHeight: number, changePage: (page: string) => void) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.changePage = changePage;
        this.shoppingButton = new FooterButtons(0, this.canvasHeight * 0.9, this.canvasWidth * 0.25, this.canvasHeight * 0.1, new Sprite('ui/shoppingIcon.png', 65, 50, 1, 100));
        
        this.HomeButton = new FooterButtons(this.canvasWidth * 0.25, this.canvasHeight * 0.9, this.canvasWidth * 0.25, this.canvasHeight * 0.1, new Sprite('ui/homeIcon.png', 55, 50, 1, 100));
        this.playerButton = new FooterButtons(this.canvasWidth * 0.5, this.canvasHeight * 0.9, this.canvasWidth * 0.25, this.canvasHeight * 0.1, new Sprite('ui/playerIcon.png', 55, 50, 1, 100));
        this.inventoryButton = new FooterButtons(this.canvasWidth * 0.75, this.canvasHeight * 0.9, this.canvasWidth * 0.25, this.canvasHeight * 0.1, new Sprite('ui/inventoryIcon.png', 60, 50, 1, 100));

    }
    render(context: CanvasRenderingContext2D) {
        //instead of drawing a box, i only want to draw a line from left to right
        context.beginPath();

        this.HomeButton.render(context);
        this.playerButton.render(context);
        this.shoppingButton.render(context);
        this.inventoryButton.render(context);

        // drawRoundedBox(context, this.canvasWidth * 0.0, this.canvasHeight * 0.9, this.canvasWidth, this.canvasHeight * 0.1, 5, primaryColorBackground, 2, true);
        context.moveTo(0, this.canvasHeight * 0.9);
        context.lineTo(this.canvasWidth, this.canvasHeight * 0.9);
        context.strokeStyle = "black";
        // change stroke length
        context.lineWidth = 4;
        context.stroke();
    }
    handleClick(mouseX: number, mouseY: number): "menu" | "customize" | "shop" | "inventory" | undefined {
        const home = this.HomeButton.handleClick(mouseX, mouseY, "menu");
        if (home) {
            this.changePage(home);
            return "menu";
        }
        const player = this.playerButton.handleClick(mouseX, mouseY, "customize");
        if (player) {
            this.changePage(player);
            return "customize";
        }
        const shop = this.shoppingButton.handleClick(mouseX, mouseY, "shop");
        if (shop) {
            this.changePage(shop);
            return "shop";
        }
        const inventory = this.inventoryButton.handleClick(mouseX, mouseY, "inventory");
        if (inventory) {
            this.changePage(inventory);
            return "inventory";
        }
    }
}