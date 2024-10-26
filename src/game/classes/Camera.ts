export default class Camera {
    public x: number;
    public y: number;
    public canvasWidth: number;
    public canvasHeight: number;
    private mapWidth: number;
    private mapHeight: number;

    constructor(canvasWidth: number, canvasHeight: number, mapWidth: number, mapHeight: number) {
        this.x = 0;
        this.y = 0;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
    }

    // Update the camera to follow the player
    update(playerX: number, playerY: number) {
        // Center the camera on the player
        this.x = playerX - this.canvasWidth / 2;
        this.y = playerY - this.canvasHeight / 2;


        // Ensure the camera stays within the map boundaries
        this.x = Math.max(0, Math.min(this.x, this.mapWidth - this.canvasWidth));
        this.y = Math.max(0, Math.min(this.y, this.mapHeight - this.canvasHeight));

        // console.log("mapWidth",this.mapWidth)
        // console.log("canvasWidth",this.canvasWidth)
        // console.log("x",this.x)
        // console.log("y",this.y)
    }
}
