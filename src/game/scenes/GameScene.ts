import { Scene } from './Scene';
import { Joystick } from '../Joystick';
import { ImageButton } from '../../components/ImageButton';
import MenuScene from './MenuScene';
import Sprite from '../Sprite';
import Player from '../classes/Player';
import Camera from '../classes/Camera';
import EnemyManager from '../classes/EnemyManager';
import ProjectileManager from '../projectiles/ProjectileManager';
import { isColliding, resolveCollision} from '../utils';
import PetManager from '../Pets/PetManager';
import HUD from '../HUD/Hud';
import EnemySpawner from '../classes/EnemySpawner';

// import { Fireball } from '../skills/Fireball';
// import { LightningSkill } from '../skills/lightning';
// import Arthur from '../skills/Arthur';
// import { Guardian } from '../skills/Gaurdian';
import ItemManager from '../classes/ItemManager';
import { Shop } from '../classes/Shop';
// import { HolyCircle } from '../skills/HolyCircle';
// import SkeletonWarrior from '../classes/SkeletonWarrior';
// import SkeletonMage from '../classes/SkeletonMage';
// import Ghoul from '../classes/Ghoul';
// import Banshee from '../classes/Banshee';

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
	private itemManager: ItemManager;
	private HUD: HUD;
	private enemySpawner: EnemySpawner;
	private camera: Camera;
	private flower1: Sprite;
	private flower2: Sprite;
	private flower3: Sprite;
	private flower4: Sprite;
	private wood: Sprite;
	private mapWidth = 3000;
	private mapHeight = 2000;
	private rock: Sprite;
	private roundTime: number = 30;
	private roundTimer: number = 2;
	private currentRound: number = 1;
	private shop: Shop;
	private roundEnd: boolean = false;


    

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
		this.projectileManager = new ProjectileManager();
        this.player = new Player([playerIdleSprite, playerWalkSprite, playerDeathSprite], this.mapWidth/2, this.mapHeight/2, 300, this.projectileManager);
		this.HUD = new HUD(this.player);

		this.itemManager = new ItemManager(this.player);
		this.enemyManager = new EnemyManager(this.player, this.itemManager);
		this.petManager = new PetManager();
		this.enemySpawner = new EnemySpawner(this.enemyManager, this.player, 3, 50, 0.001);

		this.shop = new Shop(this.player, this.startNewRound.bind(this), this.petManager);

		// const bunny = new Bunny(this.player);
		// const boar = new Boar(this.player);
		// this.petManager.addPet(bear);
		// this.petManager.addPet(bunny);
		// this.petManager.addPet(boar);
		this.camera = new Camera(window.innerWidth, window.innerHeight, this.mapWidth, this.mapHeight);
		// const holycircle = new HolyCircle(this.player);
		// this.player.learnSkill(holycircle);
		// const fireball = new Fireball(this.player, this.projectileManager);
		// this.player.learnSkill(fireball);
		// const lightning = 
		// this.lightning = new LightningSkill(this.player);
		// this.player.learnSkill(this.lightning);

		// const guardian = new Guardian(this.player);
		// this.player.learnSkill(guardian);
		// const artur = new Arthur(this.player);
		// this.player.learnSkill(artur);
		this.flower1 = new Sprite('background/flower1.png', 10, 10, 1, 100);
		this.flower2 = new Sprite('background/flower2.png', 10, 10, 1, 100);
		this.flower3 = new Sprite('background/flower3.png', 10, 10, 1, 100);
		this.flower4 = new Sprite('background/flower4.png', 10, 10, 1, 100);
		this.wood = new Sprite('background/wood.png', 120, 64, 1, 100);
		this.rock = new Sprite('background/rock.png', 100, 70, 1, 100);

	}

	init(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
		this.canvas = canvas;
		this.context = context;
		this.isRunning = true;
		console.log('canvas', this.canvas);
		this.camera.canvasHeight = this.canvas.height / this.devicePixelRatio;
		this.camera.canvasWidth = this.canvas.width / this.devicePixelRatio;

        const joystickSizePercentage = 0.08;
        const baseRadius = Math.min(this.canvas.width, this.canvas.height) * joystickSizePercentage;
        const handleRadius = baseRadius * 0.5;

		// Initialize the joystick within GameScene
		this.joystick = new Joystick(baseRadius, handleRadius);
        this.joystick.onMove = (xInput, yInput) => {
            this.player.handleInput(xInput, yInput);
        };
		this.shop.init(canvas, this.devicePixelRatio);

		// Add event listeners to handle interaction with the joystick
		this.canvas.addEventListener('mousemove', this.handleInteractionMove.bind(this));
		this.canvas.addEventListener('mousedown', this.handleInteractionStart.bind(this));
		this.canvas.addEventListener('mouseup', this.handleInteractionEnd.bind(this));

        this.canvas.addEventListener('touchstart', this.handleInteractionStart.bind(this));
		this.canvas.addEventListener('touchmove', this.handleInteractionMove.bind(this));
		this.canvas.addEventListener('touchend', this.handleInteractionEnd.bind(this));
		
		// this.enemyManager.addEnemy(new SkeletonWarrior(200, 200, this.player));
		// this.enemyManager.addEnemy(new SkeletonWarrior(250, 200, this.player));
		// this.enemyManager.addEnemy(new SkeletonWarrior(250, 250, this.player));
		// this.enemyManager.addEnemy(new SkeletonWarrior(200, 200, this.player));
		// this.enemyManager.addEnemy(new SkeletonMage(100,100, this.player));
		// this.enemyManager.addEnemy(new Ghoul(100, 100, this.player));
		// this.enemyManager.addEnemy(new Banshee(100, 100, this.player));

		this.render();
	}
	private startNewRound() {
		this.roundEnd = false;
		this.shop.isVisible = false;
		this.currentRound++;
		this.roundTimer = this.roundTime; // Reset timer for the new round
		console.log(`Starting Round ${this.currentRound}`);
		this.player.x = this.mapHeight / 2;
		this.player.y = this.mapWidth / 2;
	}
	private endRound() {
		// Reset player stats
		this.player.hp = this.player.maxHP; // Full health
		this.player.x = this.mapWidth / 2; // Spawn at center of the map
		this.player.y = this.mapHeight / 2;
	
		// Reset enemies
		this.enemyManager.clearEnemies();
		
		// Reset projectiles
		this.projectileManager.clearProjectiles();
		
		// Reset pets, if needed
		// this.petManager.resetPets();
	
		// Reset the timer and start a new round
		this.shop.randomizeItems();
		this.shop.show();
		this.roundEnd = true;
		// this.startNewRound();

	}
	

    public update(delta: number) {
		if (this)
		if(this.roundEnd) return;
        this.deltaTime = delta;
        this.player.update(delta, 3000, 2000);
		this.enemyManager.update(delta);
		this.itemManager.update();
		this.HUD.update();
		this.enemySpawner.update(delta);

		// keep track of round
		this.roundTimer -= delta;
		if (this.roundTimer <= 0) {
			this.endRound();
		}

		this.projectileManager.update(delta, this.enemyManager.enemies, this.player);

		this.petManager.update(delta, this.enemyManager.enemies);
		this.camera.update(this.player.x, this.player.y);
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

			if (enemyA.name === "SkeletonMage") {
				const attacks = enemyA.attack(delta);
				if (attacks) {
					for (const attack of attacks) {
						this.projectileManager.addEnemyProjectile(attack);
					}
				}
			} else if (enemyA.name === "Banshee") {
				const attacks = enemyA.attack(delta);
				if (attacks) {
					for (const attack of attacks) {
						this.projectileManager.addEnemyProjectile(attack);
					}
				}
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
		if (this.shop.isVisible) {
			this.shop.handleInteraction(x, y, this.devicePixelRatio);
			return;  // Skip other interactions when the shop is open
		}

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

		this.renderBackground();

		// Draw start button text
		this.context.fillStyle = '#ffffff';
		this.context.font = '12px Arial';
		this.context.fillText("width w/o device pixel:" + this.canvas.width.toString(), this.canvas.width/this.devicePixelRatio - 200, 20);
		this.context.fillText("height w/o device pixel:" + this.canvas.height.toString(), this.canvas.width/this.devicePixelRatio - 200, 60);
		this.context.fillText("device pixel:" + this.devicePixelRatio, this.canvas.width/this.devicePixelRatio - 200, 100);

		if (this.joystick) {
			this.joystick.render(this.context, this.devicePixelRatio);
		}
		this.pauseButton.render(this.context, this.devicePixelRatio);
        this.player.render(this.context, this.camera.x, this.camera.y);
		this.enemyManager.render(this.context, this.camera.x, this.camera.y);
		this.projectileManager.render(this.context, this.camera.x, this.camera.y);
		this.petManager.render(this.context, this.camera.x, this.camera.y);
		this.itemManager.render(this.context, this.camera.x, this.camera.y);
		// render skills
		for (const skill of this.player.skills) {
			skill.render(this.context, this.camera.x, this.camera.y);
		}
		this.HUD.render(this.context, this.canvas, this.currentRound, this.roundTimer, this.devicePixelRatio);
		// this.lightning.render(this.context, 100, 100, this.devicePixelRatio);
		if (this.shop.isVisible)
		this.shop.render(this.context);
	}
	private renderBackground() {
		if (!this.context) return;
		// draw flowers on the map
		// should be drawn relative to camera position

		if (this.canvas) {
			this.context.fillStyle = '#30cf51';
			this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
		}

		for (let i = 0; i < this.mapWidth; i += 500) {
			for (let j = 0; j < this.mapHeight; j += 600) {
				if (i === 0){
					this.flower1.render(this.context, i - this.camera.x, j - this.camera.y, 2);
				} else if (i === 500) {
					this.flower2.render(this.context, i - this.camera.x, j - this.camera.y, 2);
					this.wood.render(this.context, i - this.camera.x + j/3, j - this.camera.y + 200, 0.4);
			} else if (i === 1000) {
				this.flower3.render(this.context, i - this.camera.x, j - this.camera.y, 2);
				this.rock.render(this.context, i - this.camera.x + j, j - this.camera.y + 100, 0.7)
		} else {
			this.flower4.render(this.context, i - this.camera.x, j - this.camera.y, 2);
				}
			}
		}
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
