import Phaser from 'phaser';
import WebApp from '@twa-dev/sdk'

export default class MenuScene extends Phaser.Scene {
  private startButton!: Phaser.GameObjects.Image;

  constructor() {
    super({ key: 'MenuScene' });
  }

  preload(): void {
    // Preload assets such as buttons or background images
    this.load.image('startButton', 'path/to/start-button.png');
  }

  create(): void {
    // Add game title
    this.add.text(this.scale.width / 2, 100, 'My Game Title', {
      fontSize: '48px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Create and center the start button
    this.startButton = this.add.image(this.scale.width / 2, 300, 'startButton').setInteractive();
    this.startButton.setScale(0.5);

    // Add event listeners to the start button
    this.startButton.on('pointerdown', () => {
      // this.startGame();
      WebApp.showAlert('Hello World!')
    });

    this.startButton.on('pointerover', () => {
      this.startButton.setTint(0x44ff44);
    });

    this.startButton.on('pointerout', () => {
      this.startButton.clearTint();
    });
  }

  startGame(): void {
    // Transition to the GameScene
    this.scene.start('GameScene');
  }
}
