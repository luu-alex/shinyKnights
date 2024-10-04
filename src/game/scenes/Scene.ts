import { SceneManager } from './SceneManager';
export class Scene {
    protected game: SceneManager;
    constructor(game: SceneManager) {
      this.game = game;
    }
  
    init(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        console.log(canvas, context)
        console.log(this.game);
      // Initialization logic for the scene
    }
  
    update(deltaTime: number) {
      // Game update logic, called every frame
      console.log(deltaTime);
    }
  
    render(context: CanvasRenderingContext2D) {
        console.log(context);
      // Game rendering logic, called every frame
    }
  
    destroy() {
      // Cleanup logic when the scene is changed or destroyed
    }
  }
  