import { Scene } from './Scene';
import { Joystick } from '../Joystick';
import { ImageButton } from '../../components/ImageButton';
import MenuScene from './MenuScene';
import Sprite from '../Sprite';
import Player from '../classes/Player';
import SkeletonWarrior from '../classes/SkeletonWarrior';
import EnemyManager from '../classes/EnemyManager';
import ProjectileManager from '../projectiles/ProjectileManager';
import { isColliding, resolveCollision} from '../utils';
import PetManager from '../Pets/PetManager';
// import { Fireball } from '../skills/Fireball';
// import { LightningSkill } from '../skills/lightning';
import Arthur from '../skills/Arthur';
// import { Guardian } from '../skills/Gaurdian';
import Bear from '../Pets/Bear';
import Bunny from '../Pets/Bunny';
import Boar from '../Pets/Boar';
import { HolyCircle } from '../skills/HolyCircle';

export default class GameScene extends Scene {
	private canvas: HTMLCanvasElement | null;
	private context: CanvasRenderingContext2D | null;
	private isRunning: boolean;
	private devicePixelRatio: number;
	private joystick: Joystick | null;
	private pauseButton: ImageButton;
    private deltaTime: number;
    private player: Player;
	private enemyManager: EnemyManager;
	private projectileManager: ProjectileManager;
	private petManager: PetManager;
    

	constructor(game: any) {
		super(game, 'gameScene');
		this.canvas = null;
		this.context = null;
		this.isRunning = false; // Scene running state
		this.sceneName = 'gameScene';
		this.devicePixelRatio = window.devicePixelRatio || 1;
		this.joystick = null; // Initialize joystick as null
		this.pauseButton = new ImageButton(10, 30, 32, 32, 'pause1.png', this.pauseGame.bind(this));
        this.deltaTime = 0;

        const playerIdleSprite = new Sprite('characters/warden.png', 32, 32, 4, 100);
        const playerWalkSprite = new Sprite('characters/warden.png', 32, 32, 6, 100, 1);
        const playerDeathSprite = new Sprite('characters/warden.png', 32, 64, 5, 100, 6);
        this.player = new Player([playerIdleSprite, playerWalkSprite, playerDeathSprite], 300, 500, 200);

		this.enemyManager = new EnemyManager(this.player);
		this.projectileManager = new ProjectileManager();

		this.petManager = new PetManager();

		// const petIdleSprite = new Sprite('pets/MiniBear.png', 32, 32, 4, 100);
		// const petWalkSprite = new Sprite('pets/MiniBear.png', 32, 32, 6, 100, 1);
		// const petAttackSprite = new Sprite('pets/MiniBear.png', 32, 32, 6, 100, 3);

		// const pet = new Pet([petIdleSprite, petWalkSprite, petAttackSprite], this.player);
		const bear = new Bear(this.player);
		const bunny = new Bunny(this.player);
		const boar = new Boar(this.player);
		this.petManager.addPet(bear);
		this.petManager.addPet(bunny);
		this.petManager.addPet(boar);
		const holycircle = new HolyCircle(this.player);
		this.player.learnSkill(holycircle);
		// const fireball = new Fireball(this.player, this.projectileManager);
		// this.player.learnSkill(fireball);
		// const lightning = 
		// this.lightning = new LightningSkill(this.player);
		// this.player.learnSkill(this.lightning);

		// const guardian = new Guardian(this.player);
		// this.player.learnSkill(guardian);
		const artur = new Arthur(this.player);
		this.player.learnSkill(artur);

	}

	init(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
		this.canvas = canvas;
		this.context = context;
		this.isRunning = true;
		console.log('canvas', this.canvas);

        const joystickSizePercentage = 0.08;
        const baseRadius = Math.min(this.canvas.width, this.canvas.height) * joystickSizePercentage;
        const handleRadius = baseRadius * 0.5;

		// Initialize the joystick within GameScene
		this.joystick = new Joystick(baseRadius, handleRadius);
        this.joystick.onMove = (xInput, yInput) => {
            this.player.handleInput(xInput, yInput);
        };

		// Add event listeners to handle interaction with the joystick
		this.canvas.addEventListener('mousemove', this.handleInteractionMove.bind(this));
		this.canvas.addEventListener('mousedown', this.handleInteractionStart.bind(this));
		this.canvas.addEventListener('mouseup', this.handleInteractionEnd.bind(this));

        this.canvas.addEventListener('touchstart', this.handleInteractionStart.bind(this));
		this.canvas.addEventListener('touchmove', this.handleInteractionMove.bind(this));
		this.canvas.addEventListener('touchend', this.handleInteractionEnd.bind(this));
		
		this.enemyManager.addEnemy(new SkeletonWarrior(200, 200, this.player));
		this.enemyManager.addEnemy(new SkeletonWarrior(250, 200, this.player));
		this.enemyManager.addEnemy(new SkeletonWarrior(250, 250, this.player));
		this.enemyManager.addEnemy(new SkeletonWarrior(200, 200, this.player));

		this.render();
	}

    public update(delta: number) {
        this.deltaTime = delta;
        this.player.update(delta);
		this.enemyManager.update(delta);

		this.projectileManager.update(delta, this.enemyManager.enemies);

		this.petManager.update(delta, this.enemyManager.enemies);

		this.handlePlayerAttack();
		// const skill = this.player.skills[0] as Fireball
		// skill.update(delta, this.enemyManager.enemies);
		for (const skill of this.player.skills) {
			skill.update(delta, this.enemyManager.enemies);
		}
		for (let i = 0; i < this.enemyManager.enemies.length; i++) {
			const enemyA = this.enemyManager.enemies[i];
	
			// Check for enemy-to-enemy collisions and resolve them
			for (let j = i + 1; j < this.enemyManager.enemies.length; j++) {
				const enemyB = this.enemyManager.enemies[j];
				if (isColliding(enemyA, enemyB)) {
					resolveCollision(enemyA, enemyB);
				}
			}
	
			// Check for player-to-enemy collisions and resolve them
			if (isColliding(this.player, enemyA)) {
				resolveCollision(this.player, enemyA);
			}
		}
		// this.lightning.update();
    };

	public handlePlayerAttack() {
        const projectile = this.player.attack(this.enemyManager.enemies); // Player attack returns a new projectile
        if (projectile) {
            this.projectileManager.addProjectile(projectile); // Add the projectile to the manager
        }
    }

	private pauseGame() {
        console.log("should transiction")
        const menuScene = new MenuScene(this.game);
        this.game.changeScene(menuScene, this.canvas!, this.context!);
	}
	private handleInteractionStart(event: MouseEvent | TouchEvent) {
		event.preventDefault(); // Prevents scrolling/zooming on touch devices
		if (!this.canvas || !this.joystick) return;

		const { x, y } = this.getCoordinatesFromEvent(event);

		const heightBoundary = 0.5 * this.canvas.height / this.devicePixelRatio;
		if (y > heightBoundary) {
			this.joystick.activate(x, y);
			this.joystick.startDrag(x, y);
		}
	}

	// Unified event handler for both mouse and touch move
	private handleInteractionMove(event: MouseEvent | TouchEvent) {
		event.preventDefault(); // Prevents scrolling/zooming on touch devices
		if (!this.canvas || !this.joystick) return;

		const { x, y } = this.getCoordinatesFromEvent(event);
		this.joystick.drag(x, y);
	}

	// Unified event handler for both mouse and touch end
	private handleInteractionEnd(event: MouseEvent | TouchEvent) {
        const { x, y } = this.getCoordinatesFromEvent(event);
        this.pauseButton.handleClick(x, y, this.devicePixelRatio);
		if (!this.joystick) return;
		this.joystick.endDrag();
	}

	// Extracts normalized coordinates (x, y) from both mouse and touch events
	private getCoordinatesFromEvent(event: MouseEvent | TouchEvent) {
		let x = 0, y = 0;

		const rect = this.canvas!.getBoundingClientRect();
        const isTouchEvent = typeof TouchEvent !== 'undefined' && event instanceof TouchEvent;

		if (isTouchEvent) {
			const touch = (event as TouchEvent).touches[0] || (event as TouchEvent).changedTouches[0];
			x = (touch.clientX - rect.left) * this.devicePixelRatio;
			y = (touch.clientY - rect.top) * this.devicePixelRatio;
		} else {
			const mouseEvent = event as MouseEvent;
			x = (mouseEvent.clientX - rect.left) * this.devicePixelRatio;
			y = (mouseEvent.clientY - rect.top) * this.devicePixelRatio;
		}

		return { x, y };
	}

	render() {
		if (!this.isRunning || !this.context || !this.canvas) return;
        this.context.imageSmoothingEnabled = false;

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
		this.context.fillText("width w/o device pixel:" + this.canvas.width.toString(), this.canvas.width/this.devicePixelRatio - 200, 20);
		this.context.fillText("height w/o device pixel:" + this.canvas.height.toString(), this.canvas.width/this.devicePixelRatio - 200, 60);
		this.context.fillText("device pixel:" + this.devicePixelRatio, this.canvas.width/this.devicePixelRatio - 200, 100);
		this.context.fillText("delta:" + this.deltaTime, this.canvas.width/this.devicePixelRatio - 200, 140);

		if (this.joystick) {
			this.joystick.render(this.context, this.devicePixelRatio);
		}
		this.pauseButton.render(this.context, this.devicePixelRatio);
        this.player.render(this.context);
		this.enemyManager.render(this.context);
		this.projectileManager.render(this.context);
		this.petManager.render(this.context);
		// render skills
		for (const skill of this.player.skills) {
			skill.render(this.context, this.player.x, this.player.y);
		}
		// this.lightning.render(this.context, 100, 100, this.devicePixelRatio);
	}

	destroy() {
		if (this.canvas) {
			// Remove event listeners when the scene is destroyed
			this.canvas.removeEventListener('mousemove', this.handleInteractionMove.bind(this));
			this.canvas.removeEventListener('mousedown', this.handleInteractionStart.bind(this));
			this.canvas.removeEventListener('mouseup', this.handleInteractionEnd.bind(this));
			this.canvas.removeEventListener('touchstart', this.handleInteractionStart.bind(this));
			this.canvas.removeEventListener('touchmove', this.handleInteractionMove.bind(this));
			this.canvas.removeEventListener('touchend', this.handleInteractionEnd.bind(this));
		}
	}
}
