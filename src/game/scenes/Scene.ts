import { SceneManager } from './SceneManager';
export class Scene {
	protected game: SceneManager;
  public sceneName: string;
	constructor(game: SceneManager, sceneName: string) {
		this.game = game;
    this.sceneName = sceneName
	}

	init(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
		console.log(canvas, context);
		console.log(this.game);
		// Initialization logic for the scene
	}

	update(_: number) {
	}

	render() {
		// Game rendering logic, called every frame
	}

	destroy() {
		// Cleanup logic when the scene is changed or destroyed
	}
}
