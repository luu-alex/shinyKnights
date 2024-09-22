import React, { useRef, useEffect } from 'react';
import Phaser from 'phaser';
import MenuScene from './scenes/MenuScene'; // Import your Phaser scenes
import GameScene from './scenes/GameScene'; // Import your Phaser scenes

const PhaserGame: React.FC = () => {
  const phaserRef = useRef<HTMLDivElement | null>(null); // Create a ref to the DOM element where Phaser will mount
  const gameRef = useRef<Phaser.Game | null>(null); // Create a ref for the Phaser game instance

  useEffect(() => {
    if (phaserRef.current && !gameRef.current) {
      // Create the Phaser game instance if it doesn't exist yet
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        backgroundColor: '#000000',
        parent: phaserRef.current, // Attach Phaser to the div
        scene: [MenuScene, GameScene], // Include your scenes
      };

      gameRef.current = new Phaser.Game(config); // Initialize Phaser game
    }

    return () => {
      // Cleanup the Phaser game instance when the component is unmounted
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return <div ref={phaserRef} style={{ width: '800px', height: '600px' }} />;
};

export default PhaserGame;
