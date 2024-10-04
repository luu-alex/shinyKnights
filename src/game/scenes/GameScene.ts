import { Scene } from './Scene';
import { Joystick } from '../Joystick';
import { ImageButton } from '../../components/ImageButton';

export default class GameScene extends Scene {
    private canvas: HTMLCanvasElement | null;
    private context: CanvasRenderingContext2D | null;
    private isRunning: boolean;
    public sceneName: 'MenuScene';
    private devicePixelRatio: number;
    private joystick: Joystick | null;
    private pauseButton: ImageButton;

    constructor(game: any) {
        super(game);
        this.canvas = null;
        this.context = null;
        this.isRunning = false; // Scene running state
        this.sceneName = 'MenuScene';
        this.devicePixelRatio = window.devicePixelRatio || 1;
        this.joystick = null; // Initialize joystick as null
        this.pauseButton = new ImageButton(100, 100, 32, 32, 'pause1.png', this.pauseGame.bind(this));
      }

      init(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.context = context;
        this.isRunning = true;
        // context.scale(this.devicePixelRatio, this.devicePixelRatio);
        console.log("canvas", this.canvas);

        const baseRadius = 50 * this.devicePixelRatio;
        const handleRadius = 20 * this.devicePixelRatio;

        // Initialize the joystick within GameScene
        this.joystick = new Joystick(baseRadius, handleRadius);

        // Add event listeners to handle interaction with the joystick
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));

        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
    
    
        this.render();
      }

    private pauseGame() {
        console.log("pausing game");

    }

      private handleMouseDown(event: MouseEvent) {
        if (!this.canvas || !this.joystick) return;
    
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left) * this.devicePixelRatio;
        const mouseY = (event.clientY - rect.top) * this.devicePixelRatio;
    
        // Activate joystick at the touch location
        this.joystick.activate(mouseX, mouseY);
        this.joystick.startDrag(mouseX, mouseY);
      }

      private handleMouseMove(event: MouseEvent) {
        if (!this.canvas || !this.joystick) return;
    
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left) * this.devicePixelRatio;
        const mouseY = (event.clientY - rect.top) * this.devicePixelRatio;
    
        // Move joystick handle
        this.joystick.drag(mouseX, mouseY);
      }
      private handleTouchMove(event: TouchEvent) {
        if (!this.canvas || !this.joystick) return;
    
        const rect = this.canvas.getBoundingClientRect();
        const touch = event.touches[0];
        const touchX = (touch.clientX - rect.left) * this.devicePixelRatio;
        const touchY = (touch.clientY - rect.top) * this.devicePixelRatio;
    
        // Move joystick handle
        this.joystick.drag(touchX, touchY);
      }

      private handleMouseUp() {
        if (!this.joystick) return;
    
        // Release joystick handle
        this.joystick.endDrag();
      }
      private handleTouchEnd() {
        if (!this.joystick) return;
    
        // Release joystick handle
        this.joystick.endDrag();
      }

      private handleTouchStart(event: TouchEvent) {
        if (!this.canvas || !this.joystick) return;
    
        const rect = this.canvas.getBoundingClientRect();
        const touch = event.touches[0];
        const touchX = (touch.clientX - rect.left) * this.devicePixelRatio;
        const touchY = (touch.clientY - rect.top) * this.devicePixelRatio;
    
        // Activate joystick at the touch location
        this.joystick.activate(touchX, touchY);
        this.joystick.startDrag(touchX, touchY);
      }

    //   private handleClick(event: MouseEvent) {
    //     if (!this.canvas) return;
    
    //     const rect = this.canvas.getBoundingClientRect();
    //     const mouseX = (event.clientX - rect.left) * this.devicePixelRatio;
    //     const mouseY = (event.clientY - rect.top) * this.devicePixelRatio;
    
        // Check if the start button was clicked
        // if (
        //   mouseX >= this.startButton.x &&
        //   mouseX <= this.startButton.x + this.startButton.width &&
        //   mouseY >= this.startButton.y &&
        //   mouseY <= this.startButton.y + this.startButton.height
        // ) {
        //   this.startGame(); // Trigger the game start logic
        // }
    //   }


      render() {
        if (!this.isRunning || !this.context || !this.canvas) return;
    
        // Clear the canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
        this.context.fillStyle = '#1ecbe1';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // Draw game title
        this.context.fillStyle = '#FFFFFF';
        this.context.font = '12px Arial';
        this.context.fillText('My Game Title', this.canvas.width / 2 - 100, 100);
    
    
        // Draw start button text
        this.context.fillStyle = '#ffffff';
        this.context.font = '12px Arial';
        this.context.fillText(
          'Start',
          50,
          50
        );
        if (this.joystick){
            this.joystick.render(this.context, this.devicePixelRatio);
        }
        this.pauseButton.render(this.context, this.devicePixelRatio);
      }
    
      destroy() {
        if (this.canvas) {
          // Remove event listeners when the scene is destroyed
            this.canvas.removeEventListener('mousemove', this.handleMouseMove.bind(this));
            this.canvas.removeEventListener('mousedown', this.handleMouseDown.bind(this));
            this.canvas.removeEventListener('mouseup', this.handleMouseUp.bind(this));
            this.canvas.removeEventListener('touchstart', this.handleTouchStart.bind(this));
            this.canvas.removeEventListener('touchmove', this.handleTouchMove.bind(this));
            this.canvas.removeEventListener('touchend', this.handleTouchEnd.bind(this));
        
        }
      }
};