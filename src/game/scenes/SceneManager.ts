import { Scene } from './Scene';
export class SceneManager {
	public currentScene: Scene | null;

	constructor() {
		this.currentScene = null;
	}

	// Initialize a new scene
	changeScene(newScene: Scene, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
		if (this.currentScene === newScene) return; // Prevent re-setting the same scene
    	console.log("Scene change to", newScene.sceneName);
		if (this.currentScene) {
			console.log("calling destroy", this.currentScene)
			this.currentScene.destroy();
			this.currentScene = null; // Clear the reference
		}
		this.currentScene = newScene;
		this.currentScene.init(canvas, context);
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
