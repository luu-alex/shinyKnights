import { Scene } from './Scene';
import { Joystick } from '../Joystick';
import { ImageButton } from '../../components/ImageButton';
import Sprite from '../Sprite';
import Player from '../classes/Player';
import Camera from '../classes/Camera';
import EnemyManager from '../classes/EnemyManager';
import ProjectileManager from '../projectiles/ProjectileManager';
import { getWeapon, isColliding, resolveCollision} from '../utils';
import PetManager from '../Pets/PetManager';
import HUD from '../HUD/Hud';
import EnemySpawner from '../classes/EnemySpawner';
import ItemManager from '../classes/ItemManager';
import { Shop } from '../classes/Shop';
import { Settings } from '../../components/Settings';
import { GameOverComponent } from '../../components/GameOverComponent';
import { gameResults } from '../../apiCalls/serverCalls';
import { SoundManager } from '../SoundManager';

export default class GameScene extends Scene {
	private canvas: HTMLCanvasElement | null;
	private context: CanvasRenderingContext2D | null;
	private isRunning: boolean;
	private devicePixelRatio: number;
	private joystick: Joystick | null;
	private pauseButton: ImageButton | null;
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
	private mapWidth = 1500;
	private mapHeight = 1000;
	private rock: Sprite;
	private roundTime: number = 45;
	private roundTimer: number = 45;
	private currentRound: number = 1;
	private shop: Shop;
	private roundEnd: boolean = false;
	private settings: Settings | null = null;
	private isDead: boolean = false;
	private gameOverComponent: GameOverComponent | null = null;
	private isVictory: boolean = false;
	private boundHandleInteractionStart: (event: MouseEvent | TouchEvent) => void;
    private boundHandleInteractionMove: (event: MouseEvent | TouchEvent) => void;
    private boundHandleInteractionEnd: (event: MouseEvent | TouchEvent) => void;
	private username: string = ""
	private isLoading: boolean = false;
	private soundManager: SoundManager; 

	private fetchProfile: () => {};
	private createMenuScene: (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => void;
	constructor(game: any, profile: any, fetchProfile: () => {}, _ : (weaponId: number) => void, createMenuScene: (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => void) {
		super(game, 'gameScene');
		this.canvas = null;
		this.context = null;
		this.isRunning = false; // Scene running state
		this.sceneName = 'gameScene';
		this.devicePixelRatio = window.devicePixelRatio || 1;
		this.joystick = null; // Initialize joystick as null
		this.pauseButton = null;
		this.fetchProfile = fetchProfile;
		this.createMenuScene = createMenuScene;
		this.soundManager = new SoundManager();
		this.soundManager.loadSound('attackSFX', 'sounds/slash.mp3');
		this.soundManager.loadSound('enemydeath1', 'sounds/enemyDeath1.mp3');
		this.soundManager.loadSound('backgroundMusic', 'sounds/strangestThing.mp3');
		this.soundManager.loadSound('monsterProjectile', 'sounds/monsterProjectile.mp3');
		this.soundManager.playSound('backgroundMusic', {loop: true, volume: 0.3})

		

        const playerIdleSprite = new Sprite('characters/warden.png', 32, 32, 4, 100);
        const playerWalkSprite = new Sprite('characters/warden.png', 32, 32, 6, 100, 1);
        const playerDeathSprite = new Sprite('characters/warden.png', 32, 64, 5, 100, 6);
		this.projectileManager = new ProjectileManager();
		const weapon =  getWeapon(profile.weapons[profile.currentWeapon].name);
        this.player = new Player([playerIdleSprite, playerWalkSprite, playerDeathSprite], this.mapWidth/2, this.mapHeight/2, 300, this.projectileManager, weapon);
		this.HUD = new HUD(this.player);

		this.itemManager = new ItemManager(this.player);
		this.enemyManager = new EnemyManager(this.player, this.itemManager);
		this.petManager = new PetManager();
		this.enemySpawner = new EnemySpawner(this.enemyManager, this.player, 7, 15, 0.3);

		this.shop = new Shop(this.player, this.startNewRound.bind(this), this.petManager, this.itemManager);

		this.camera = new Camera(window.innerWidth, window.innerHeight, this.mapWidth, this.mapHeight);

		// const guardian = new Guardian(this.player);
		// this.player.learnSkill(guardian);
		this.flower1 = new Sprite('background/flower1.png', 10, 10, 1, 100);
		this.flower2 = new Sprite('background/flower2.png', 10, 10, 1, 100);
		this.flower3 = new Sprite('background/flower3.png', 10, 10, 1, 100);
		this.flower4 = new Sprite('background/flower4.png', 10, 10, 1, 100);
		this.wood = new Sprite('background/wood.png', 120, 64, 1, 100);
		this.rock = new Sprite('background/rock.png', 100, 70, 1, 100);

		this.boundHandleInteractionStart = this.handleInteractionStart.bind(this);
        this.boundHandleInteractionMove = this.handleInteractionMove.bind(this);
        this.boundHandleInteractionEnd = this.handleInteractionEnd.bind(this);

	}

	init(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
		this.canvas = canvas;
		this.context = context;
		this.isRunning = true;
		this.camera.canvasHeight = this.canvas.height / this.devicePixelRatio;
		this.camera.canvasWidth = this.canvas.width / this.devicePixelRatio;
		this.settings = new Settings(this.camera.canvasWidth, this.camera.canvasHeight, "Paused", this.exitGame.bind(this), () => {});
		this.gameOverComponent = new GameOverComponent(this.canvas.width / this.devicePixelRatio, this.canvas.height / this.devicePixelRatio, "Game Over", this.exitAndSubmit.bind(this), this.fetchProfile);
		
		this.pauseButton = new ImageButton(0.87,0.1, 0.1, 0.05, 'ui/pauseIcon.png', this.pauseGame.bind(this));

        const joystickSizePercentage = 0.08;
        const baseRadius = Math.min(this.canvas.width, this.canvas.height) * joystickSizePercentage;
        const handleRadius = baseRadius * 0.5;

		// Initialize the joystick within GameScene
		this.joystick = new Joystick(baseRadius, handleRadius);
        this.joystick.onMove = (xInput, yInput) => {
            this.player.handleInput(xInput, yInput);
        };
		this.shop.init(canvas, this.devicePixelRatio);
		console.log("init gamescene")
		// Add event listeners to handle interaction with the joystick
		this.canvas.addEventListener('mousemove', this.boundHandleInteractionMove);
        this.canvas.addEventListener('mousedown', this.boundHandleInteractionStart);
        this.canvas.addEventListener('mouseup', this.boundHandleInteractionEnd);
        this.canvas.addEventListener('touchstart', this.boundHandleInteractionStart);
        this.canvas.addEventListener('touchmove', this.boundHandleInteractionMove);
        this.canvas.addEventListener('touchend', this.boundHandleInteractionEnd);
		
		this.render();
	}

	private async exitAndSubmit() {
		if (this.isLoading) return;
		this.isLoading = true;
		await gameResults(this.username, this.currentRound);
		this.exitGame();
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
	private async endRound() {
		// Reset player stats
		this.player.hp = this.player.maxHP; // Full health
		this.player.x = this.mapWidth / 2; // Spawn at center of the map
		this.player.y = this.mapHeight / 2;
		this.enemySpawner.updateWave(this.currentRound);
		if (this.currentRound === 3) {
			this.enemySpawner.pushSkeletonMage();
		}
		if (this.currentRound === 4) {
			this.enemySpawner.pushBanshee();
		}
		if (this.currentRound === 10 && this.gameOverComponent) {
			this.gameOverComponent.updateWave(this.currentRound);
			this.gameOverComponent.title = "Victory"
			this.gameOverComponent.description = "You have won!"
			this.isVictory = true;
			
		}
	
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
		if (this.isVictory) {
			
			return;
		}
		if(this.roundEnd || this.settings?.isVisible) return;
		if (this.player.hp < 0) {
			this.isDead = true;
			this.gameOverComponent?.updateWave(this.currentRound);
			return;
		}
        this.player.update(delta, 1500, 1000);
		this.enemyManager.update(delta, this.soundManager);
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
					this.soundManager.playSound('monsterProjectile', {volume: 0.5})
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
			this.soundManager.playSound('attackSFX', {volume: 0.3});
            this.projectileManager.addProjectile(projectile); // Add the projectile to the manager
        }
    }

	private pauseGame() {
		this.settings?.show();
	}
	private exitGame() {
		// this is exiting the game to menuScene
		if (this.canvas && this.context) {
			console.log("changin scene")
			this.createMenuScene(this.canvas, this.context);
		}
	}

	private handleInteractionStart(event: MouseEvent | TouchEvent) {
		event.preventDefault(); // Prevents scrolling/zooming on touch devices
		if (!this.canvas || !this.joystick) return;
		if (this.isDead || this.isVictory) return;
		console.log("handling stuff")
		

		const { x, y } = this.getCoordinatesFromEvent(event);

		if (this.shop.isVisible && !this.isVictory) {
			this.shop.handleInteraction(x, y, this.devicePixelRatio);
			return;  // Skip other interactions when the shop is open
		}
		if (this.settings && this.settings.isVisible) {
			this.settings.exitButton.handleClick(x, y, this.canvas!.width, this.canvas!.height);
			this.settings.homeButton.handleClick(x, y, this.canvas!.width, this.canvas!.height);
			return;
		}
		if (this.pauseButton){
			this.pauseButton.handleClick(x, y, this.canvas!.width, this.canvas!.height);
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
		if (!this.joystick) return;
		this.joystick.endDrag();
		if (this.isDead || this.isVictory)
		this.gameOverComponent?.handleClick(x, y, this.devicePixelRatio);
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
		// DEBUG
		// this.context.fillStyle = '#ffffff';
		// this.context.font = '12px Arial';
		// this.context.fillText("width w/o device pixel:" + this.canvas.width.toString(), this.canvas.width/this.devicePixelRatio - 200, 20);
		// this.context.fillText("height w/o device pixel:" + this.canvas.height.toString(), this.canvas.width/this.devicePixelRatio - 200, 60);
		// this.context.fillText("device pixel:" + this.devicePixelRatio, this.canvas.width/this.devicePixelRatio - 200, 100);

		if (this.joystick) {
			this.joystick.render(this.context, this.devicePixelRatio);
		}
		
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
		if (this.shop.isVisible && !this.isVictory)
		this.shop.render(this.context);
		if (this.settings?.isVisible) {
			this.context.font = `${this.camera.canvasHeight * 0.03}px depixel`;
			this.settings.render(this.context);

		}
		if (this.pauseButton)
		this.pauseButton.render(this.context, this.canvas.width / this.devicePixelRatio, this.canvas.height / this.devicePixelRatio);
		if (this.isDead || this.isVictory) {
			this.gameOverComponent?.render(this.context);
		}
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
		console.log("destroy game scene", this.canvas)
		if (this.canvas) {
			// Remove event listeners when the scene is destroyed
			this.canvas.removeEventListener('mousemove', this.boundHandleInteractionMove);
			this.canvas.removeEventListener('mousedown', this.boundHandleInteractionStart);
			this.canvas.removeEventListener('mouseup', this.boundHandleInteractionEnd);
			this.canvas.removeEventListener('touchstart', this.boundHandleInteractionStart);
			this.canvas.removeEventListener('touchmove', this.boundHandleInteractionMove);
			this.canvas.removeEventListener('touchend', this.boundHandleInteractionEnd);
		}
	}
	public updateUsername(username: string) {
		this.username = username
	}
}
