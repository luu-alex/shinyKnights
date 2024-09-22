import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    // Add a simple text display to indicate the game has started
    this.add.text(100, 100, 'Game Started!', {
      fontSize: '32px',
      color: '#ffffff'
    });
  }
}
