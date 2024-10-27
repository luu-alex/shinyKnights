// import WebApp from '@twa-dev/sdk'
import { Scene } from './Scene';
import { SceneManager } from './SceneManager';
import GameScene from './GameScene';
import { Button } from '../../components/Button';
import { ImageButton } from '../../components/ImageButton';
import  { AssetManager } from '../../assets/assetManager';
import { Settings } from '../../components/Settings';

export default class MenuScene extends Scene {
  private canvas: HTMLCanvasElement | null;
  private context: CanvasRenderingContext2D | null;
  private startButton: Button;
  private isRunning: boolean;
  public sceneName: 'MenuScene';
  private devicePixelRatio: number;
  private settingButton: ImageButton | null = null;
  private assetsLoaded: boolean = false;
  private settings: Settings | null = null;

  // Store bound event handlers
  private boundHandleMouseMove: (event: MouseEvent) => void;
  private boundHandleClick: (event: MouseEvent) => void;

  constructor(game: SceneManager) {
    super(game, 'MenuScene');
    this.canvas = null;
    this.context = null;
    this.isRunning = false; // Scene running state
    this.sceneName = 'MenuScene';
    this.devicePixelRatio = window.devicePixelRatio || 1;
    this.startButton = new Button(150, 300, 150, 100, 'Start', this.startGame.bind(this), '#FFFFF', 32);

    this.boundHandleMouseMove = this.handleMouseMove.bind(this);
    this.boundHandleClick = this.handleClick.bind(this);
  }

  init(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;
    this.isRunning = true;

    const canvasWidth = this.canvas.width / this.devicePixelRatio;
    const canvasHeight = this.canvas.height / this.devicePixelRatio;

    this.settings = new Settings(canvasWidth, canvasHeight);
    
    this.settingButton = new ImageButton(canvasWidth * 0.9, canvasHeight * 0.03, 32, 32, 'ui/settingIcon.png', this.openSettings.bind(this));

    // Add event listeners to handle interaction with the start button
    this.canvas.addEventListener('mousemove', this.boundHandleMouseMove);
    this.canvas.addEventListener('click', this.boundHandleClick);

    const assets = new AssetManager(this.onAssetsLoaded.bind(this));
    assets.loadImage('daggerSprite', 'weapons/dagger.png');
    assets.loadImage('woodenarrow', 'weapons/woodenArrow.png');
    assets.loadImage('spearslash2', 'weapons/spearSlash2.png');
    assets.loadImage('spearslash3', 'weapons/spearSlash3.png');
    assets.loadImage('whiteslash', 'weapons/whiteSlash.png');
    assets.loadImage('pause', 'pause1.png');
    assets.loadImage('fireball', 'skills/fireball.png');
    assets.loadImage('firecharge', 'skills/firecharge.png');
    assets.loadImage('fireexplosion', 'skills/fireexplosion.png');
    assets.loadImage('holyBall', 'skills/holyBall.png');
    assets.loadImage('holyCircle', 'skills/holyCircle.png');
    assets.loadImage('thunder', 'skills/thunder.png');
    assets.loadImage('thunderstrike', 'skills/thunderstrike.png');
    assets.loadImage('arthurs', 'skills/arthursSword.png');
    assets.loadImage('bear', 'pets/MiniBear.png');
    assets.loadImage('boar', 'pets/MiniBoar.png');
    assets.loadImage('bunny', 'pets/MiniBunny.png');
    assets.loadImage('skeleton', 'characters/skeletonWarrior.png');
    assets.loadImage('swordman', 'characters/swordman.png');
    assets.loadImage('warden', 'characters/warden.png');

    // Start rendering the menu
    this.render();
  }
  private onAssetsLoaded() {
    this.assetsLoaded = true; // All assets are now loaded
    console.log("All assets loaded");
    this.render(); // Re-render to update the UI
  }

  private handleMouseMove(event: MouseEvent) {
    if (!this.canvas) return;

    const rect = this.canvas.getBoundingClientRect();
    const mouseX = (event.clientX - rect.left) * this.devicePixelRatio;
    const mouseY = (event.clientY - rect.top) * this.devicePixelRatio;

    // Check if mouse is over the button
    this.startButton.handleMouseMove(mouseX, mouseY, this.devicePixelRatio);
    this.render();
  }

  private handleClick(event: MouseEvent) {
    if (!this.canvas) return;

    const rect = this.canvas.getBoundingClientRect();
    const mouseX = (event.clientX - rect.left) * this.devicePixelRatio;
    const mouseY = (event.clientY - rect.top) * this.devicePixelRatio;
    // Check if the start button was clicked
    this.startButton.handleClick(mouseX, mouseY, this.devicePixelRatio);
    this.settingButton?.handleClick(mouseX, mouseY, this.devicePixelRatio);
    if (this.settings && this.settings.isVisible) {
      this.settings.exitButton.handleClick(mouseX, mouseY, this.devicePixelRatio);
    }
  }

  private startGame() {
    if (!this.assetsLoaded) return;
    // Show alert using WebApp and transition to the game scene
    // WebApp.showAlert('Hello World!');
    this.isRunning = false; // Stop rendering the menu scene

    if(this.canvas && this.context){
      const gameScene = new GameScene(this.game); 
      this.game.changeScene(gameScene, this.canvas, this.context);
    }
  }

  private openSettings() {
    if (!this.settings) return;
    this.settings.show()
  }

  render() {
    if (!this.isRunning || !this.context || !this.canvas) return;
    // Clear the canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.fillStyle = '#000000';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw start button

    if (!this.assetsLoaded) {
      this.context.fillText('Loading assets...', this.canvas.width / 2 - 50, 600);
    } else {
      // Draw start button
      this.startButton.render(this.context);
    }
    this.settingButton?.render(this.context, this.devicePixelRatio);
    if (this.settings && this.settings.isVisible) {
      this.settings.render(this.context, this.devicePixelRatio);
    }

    // Continue rendering in the next frame
  }

  destroy() {
    if (this.canvas) {
      // Remove event listeners when the scene is destroyed
      this.canvas.removeEventListener('mousemove', this.boundHandleMouseMove);
      this.canvas.removeEventListener('click', this.boundHandleClick);
    }
  }
}