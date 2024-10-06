import Sprite from '../Sprite';

enum PlayerState {
    Idle,
    Walking,
    Dying
}
export default class Player {
    public speed: number;
    x : number;
    y: number;
    private idleSprite: Sprite;
    private walkingSprite: Sprite;
    private dyingSprite: Sprite;
    private currentSprite: Sprite;
    private state: PlayerState;
    private joystickInput: { x: number, y: number };
    private isFacingRight: boolean;


    constructor(sprites: Sprite[], x: number, y: number, speed: number,) {
        this.idleSprite = sprites[0];
        this.walkingSprite = sprites[1];
        this.dyingSprite = sprites[2];
        this.currentSprite = this.idleSprite;
        this.state = PlayerState.Idle;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.joystickInput = { x: 0, y: 0 };
        this.isFacingRight = true;

    }

    update(deltaTime: number) {
        this.x += this.joystickInput.x * this.speed * deltaTime;
        this.y += this.joystickInput.y * this.speed * deltaTime;
        this.handleAnimation();

        this.handleDirection();

        // Update the sprite animation
        this.currentSprite.update();
    }
    render(context: CanvasRenderingContext2D) {
        context.save();
        if (!this.isFacingRight) {
            context.scale(-1, 1);  // Flip the context horizontally
            this.currentSprite.render(context, -(this.x + this.currentSprite.frameWidth * 2), this.y, 2); // Adjust x position
        } else {
            this.currentSprite.render(context, this.x, this.y, 2); // Scale the sprite if needed
        }
        context.restore();
    }
    private handleAnimation() {
        switch (this.state) {
            case PlayerState.Idle:
                this.currentSprite = this.idleSprite;
                break;
            case PlayerState.Walking:
                this.currentSprite = this.walkingSprite;
                break;
            case PlayerState.Dying:
                this.currentSprite = this.dyingSprite;
                break;
        }
    }
    private handleDirection() {
        if (this.joystickInput.x > 0) {
            this.isFacingRight = true;  // Moving right
        } else if (this.joystickInput.x < 0) {
            this.isFacingRight = false; // Moving left
        }
    }

    // Handle joystick or movement input
    handleInput(xInput: number, yInput: number) {
        this.joystickInput = { x: xInput, y: yInput };
        if (xInput !== 0 || yInput !== 0) {
            this.state = PlayerState.Walking;
        } else {
            this.state = PlayerState.Idle;
        }
    }
}