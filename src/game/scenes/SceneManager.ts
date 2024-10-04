import { Scene } from "./Scene";
export class SceneManager {
    public currentScene: any | null;
  
    constructor() {
      this.currentScene = null;
    }
  
    // Initialize a new scene
    changeScene(newScene: Scene, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
      if (this.currentScene) {
        this.currentScene.destroy(); // Clean up the old scene
      }
      this.currentScene = newScene;
      this.currentScene.init(canvas, context); // Initialize the new scene
    }
  
    // Call the render function of the current scene
    render() {
      if (this.currentScene) {
        this.currentScene.render();
      }
    }
  
    // Additional update or tick logic if needed
    update(deltaTime: number) {
      if (this.currentScene && this.currentScene.update) {
        this.currentScene.update(deltaTime);
      }
    }
  }
  