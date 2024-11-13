// import WebApp from '@twa-dev/sdk'
import { Scene } from './Scene';
import { SceneManager } from './SceneManager';
import GameScene from './GameScene';
import { Button } from '../../components/Button';
import { ImageButton } from '../../components/ImageButton';
import  { AssetManager } from '../../assets/assetManager';
import { Settings } from '../../components/Settings';
import { blueBackground, lightBlueButton, primaryColorBackground } from '../colors';
import { MenuHeader } from '../../components/MenuHeader';
import { Footer } from '../../components/Footer';
import { CustomizationComponent } from '../../components/CustomizationComponent';
import { ShopComponent } from '../../components/ShopComponent';
import { UsernameComponent } from '../../components/UsernameComponent';
import { BuyGemsComponent } from '../../components/BuyGemsComponent';
import { OrderComponent } from '../../components/OrderComponent';
import { LoadingComponent } from '../../components/LoadingComponent';
import { orderStatus, createOrder } from '../../apiCalls/aeonCalls';
import { PurchasedGemsComponent } from '../../components/purchasedGemsComponent';
import { InventoryComponent } from '../../components/InventoryComponent';
import { Characters, Weapons, ItemInventory } from '../types';
import { FailedOrderComponent } from '../../components/FailedOrderComponent';
import { drawCenteredText, drawRoundedBox } from '../utils';
import Sprite from '../Sprite';

export default class MenuScene extends Scene {
  private canvas: HTMLCanvasElement | null;
  private context: CanvasRenderingContext2D | null;
  private isRunning: boolean;
  public sceneName: 'MenuScene';
  private devicePixelRatio: number;
  private settingButton: ImageButton | null = null;
  private assetsLoaded: boolean = false;
  private settings: Settings | null = null;
  private menuHeader: MenuHeader | null = null;
  private playButton: Button | null = null;
  private footer: Footer | null = null;
	private mode: "menu" | "shop" | "customize" |"inventory" | "gemShop" = "menu"
  private customizeComponent: CustomizationComponent | null = null;
  private shopComponent: ShopComponent | null = null;
  private lastTouchY: number | null = null;  // For tracking touch movement for shop scrolling
  public gems: number = 0;
  public level: number = 1;
  public username: string = "Player";
  private usernameComponent : UsernameComponent | null = null;
  private purchaseGemsButton: ImageButton | null = null;
  private buyGemsComponent: BuyGemsComponent | null = null;
  private orderComponent: OrderComponent | null = null;
  private isLoading: boolean = true;
  private LoadingComponent: LoadingComponent | null = null;
  private purchasedGemsComponent: PurchasedGemsComponent | null = null;
  private InventoryComponent: InventoryComponent | null = null;
  private gold: number = 0;
  private failOrderComponent: FailedOrderComponent | null = null;
  private assets: AssetManager | null = null;
  



  public currentCharacter: string = "knight";
  public currentWeapon: number = 0;
  public characters: Characters | null  = null;
  public weapons: Weapons = [{
        name: "spear",
        level: 1,
        stats: {
          attack: 10,
          defense: 5,
        },
        rarity: "common"
    }];


  private boundHandleClick: (event: MouseEvent) => void;
  private boundHandleTouchStart: (event: TouchEvent) => void;
  private boundHandleTouchMove: (event: TouchEvent) => void;
  private boundHandleTouchEnd: (event: TouchEvent) => void;

  private fetchProfile: () => {};
  private levelUpWeapon: (weaponID: number) => void;
  private createMenuScene: (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => void;
  private logoSprite: Sprite = new Sprite('characters/MiniSkeletonMage.png', 32, 32, 4, 200);
  private logo2Sprite: Sprite = new Sprite("characters/swordman.png", 32, 32, 4, 200);

  constructor(game: SceneManager, fetchProfile: () => {}, levelUpWeapon: (weaponID: number) => void, createMenuScene: (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => void) {
    super(game, 'MenuScene');
    this.canvas = null;
    this.context = null;
    this.isRunning = false; // Scene running state
    this.sceneName = 'MenuScene';
    this.devicePixelRatio = window.devicePixelRatio || 1;

    this.fetchProfile = fetchProfile;
    this.boundHandleClick = this.handleClick.bind(this);
    this.boundHandleTouchStart = this.handleTouchStart.bind(this);
    this.boundHandleTouchMove = this.handleTouchMove.bind(this);
    this.boundHandleTouchEnd = this.handleTouchEnd.bind(this);
    this.levelUpWeapon = levelUpWeapon;
    this.createMenuScene = createMenuScene;
    
  }

  init(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;
    this.isRunning = true;
    console.log("init menu scene")

    const canvasWidth = this.canvas.width / this.devicePixelRatio;
    const canvasHeight = this.canvas.height / this.devicePixelRatio;

    this.settings = new Settings(canvasWidth, canvasHeight, 'Settings', () => {}, () => {this.page = "menu"});
    this.buyGemsComponent = new BuyGemsComponent(canvasWidth, canvasHeight, () => {this.page = "menu";}, this.handleBuyingGems.bind(this));
    this.orderComponent = new OrderComponent(canvasWidth, canvasHeight, () => {this.page = "menu"},  this.verifyOrder.bind(this));
    
    this.settingButton = new ImageButton(0.87,0.025, 0.1, 0.06, 'ui/settingIcon.png', this.openSettings.bind(this));
    this.purchaseGemsButton = new ImageButton(0.6,0.05, 0.05, 0.03, 'ui/greenlightplus.png', this.openGems.bind(this));
    this.playButton = new Button(
      canvasWidth * 0.2,
      canvasHeight * 0.75,
      canvasWidth * 0.6,
      canvasHeight * 0.1,
      "Play",
      this.startGame.bind(this),
      lightBlueButton,
      canvasHeight * 0.04,
      "black",
    );
    this.LoadingComponent = new LoadingComponent(canvasWidth, canvasHeight);
    this.usernameComponent = new UsernameComponent();
    this.customizeComponent = new CustomizationComponent(canvasWidth, canvasHeight, this.levelUpWeapon, this.fetchProfile);
    this.menuHeader = new MenuHeader(canvasWidth, canvasHeight);
    this.footer = new Footer(canvasWidth, canvasHeight, this.changePage.bind(this));
    this.shopComponent = new ShopComponent(canvasWidth, canvasHeight, this.fetchProfile);
    this.purchasedGemsComponent = new PurchasedGemsComponent(canvasWidth, canvasHeight);
    this.InventoryComponent = new InventoryComponent(canvasWidth, canvasHeight, this.fetchProfile);
    this.failOrderComponent = new FailedOrderComponent(canvasWidth, canvasHeight);

    // Add event listeners to handle interaction with the start button
    this.canvas.addEventListener('click', this.boundHandleClick);
    this.canvas.addEventListener('touchstart', this.boundHandleTouchStart);
    this.canvas.addEventListener('touchmove', this.boundHandleTouchMove);
    this.canvas.addEventListener('touchend', this.boundHandleTouchEnd);

    const assets = new AssetManager(this.onAssetsLoaded.bind(this));
    this.assets = assets;
    assets.loadImage('daggerSprite', 'weapons/dagger.png');
    assets.loadImage('woodenarrow', 'weapons/woodenArrow.png');
    assets.loadImage('spearslash2', 'weapons/spearSlash2.png');
    assets.loadImage('spearslash3', 'weapons/spearSlash3.png');
    assets.loadImage('pause', 'pause1.png');
    assets.loadImage('fireball', 'skills/fireball.png');
    assets.loadImage('firecharge', 'skills/firecharge.png');
    assets.loadImage('fireexplosion', 'skills/fireexplosion.png');
    assets.loadImage('holyBall', 'skills/holyBall.png');
    assets.loadImage('holyCircle', 'skills/holyCircle.png');
    assets.loadImage('thunder', 'skills/thunder.png');
    assets.loadImage('thunderstrike', 'skills/thunderstrike.png');
    assets.loadImage('arthurs', 'skills/arthursSword.png');
    assets.loadImage('bear', 'pets/MiniBear.png');
    assets.loadImage('boar', 'pets/MiniBoar.png');
    assets.loadImage('bunny', 'pets/MiniBunny.png');
    assets.loadImage('skeleton', 'characters/skeletonWarrior.png');
    assets.loadImage('swordman', 'characters/swordman.png');
    assets.loadImage('warden', 'characters/warden.png');
    assets.loadAudioAssets({
      backgroundMusic: 'sounds/strangestThing.mp3',
      attackSFX: 'sounds/slash.mp3',
      enemydeath1: 'sounds/enemyDeath1.mp3',
      monsterProjectile: 'sounds/monsterProjectile.mp3',
  });
    // Start rendering the menu
    
    this.render();
  }
  private onAssetsLoaded() {
    this.assetsLoaded = true; // All assets are now loade
    if (!this.assets) return;
    console.log("All assets loaded");
    this.render(); // Re-render to update the UI
  }
  public changePage (name: string)  {
    if (name === "customize") {
      this.customizeComponent?.updateWeaponPopup({title: this.weapons[this.currentWeapon].name, stats: this.weapons[this.currentWeapon].stats, level: this.weapons[this.currentWeapon].level, currentWeapon: this.currentWeapon, rarity: this.weapons[this.currentWeapon].rarity});
      this.customizeComponent?.updateWeapon(this.weapons, this.currentWeapon);
      if (this.characters) {
        this.customizeComponent?.updateCharacterPopup(this.characters);
        this.customizeComponent?.updateCharacter(this.currentCharacter);
      }
    }
    this.page = name;
  }

  private handleTouchStart(event: TouchEvent) {
    if (this.mode === "shop" && this.shopComponent) {
      const touch = event.touches[0];
      const rect = this.canvas?.getBoundingClientRect();
      if (!rect) return;
      
      const touchY = (touch.clientY - rect.top) * this.devicePixelRatio;
      this.lastTouchY = touchY;  // Save the Y position for tracking vertical movement (scroll)
    }
  }
  private handleTouchMove(event: TouchEvent) {
    if (this.mode === "shop" && this.shopComponent && this.lastTouchY !== null && this.canvas) {
      const touch = event.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      const currentTouchY = (touch.clientY - rect.top) * this.devicePixelRatio;
      const deltaY = this.lastTouchY - currentTouchY;
      this.lastTouchY = currentTouchY;

      // Scroll the shop component
      this.shopComponent.handleScroll(deltaY);  // Assuming `handleScroll` exists in `ShopComponent`

      // Prevent default scrolling behavior
      event.preventDefault();
    }
  }

  private handleTouchEnd() {
    if (this.mode === "shop") {
      this.lastTouchY = null;  // Reset touch tracking after scroll
    }
  }


  private handleClick(event: MouseEvent) {
    if (!this.canvas) return;

    const rect = this.canvas.getBoundingClientRect();
    const mouseX = (event.clientX - rect.left) * this.devicePixelRatio;
    const mouseY = (event.clientY - rect.top) * this.devicePixelRatio;
    // Check if the start button was clicked
    if (this.isLoading) return;
    if (this.page === 'menu') {
      this.playButton?.handleClick(mouseX, mouseY, this.devicePixelRatio);
      this.settingButton?.handleClick(mouseX, mouseY, this.canvas.width, this.canvas.height);
    } 
    this.purchaseGemsButton?.handleClick(mouseX, mouseY, this.canvas.width, this.canvas.height);
    if (this.page === "gemShop" && this.buyGemsComponent?.isVisible) {
      this.buyGemsComponent?.exitButton.handleClick(mouseX, mouseY, this.canvas.width, this.canvas.height);
      this.buyGemsComponent?.buy1000GemsButton.handleClick(mouseX, mouseY, this.devicePixelRatio);
      this.buyGemsComponent.buy500GemsButton.handleClick(mouseX, mouseY, this.devicePixelRatio);
    }
    if (this.page === "pendingOrders") {
      this.orderComponent?.exitButton.handleClick(mouseX, mouseY, this.canvas.width, this.canvas.height);
      this.orderComponent?.purchaseButton.handleClick(mouseX, mouseY, this.devicePixelRatio);
      this.orderComponent?.verifyButton.handleClick(mouseX, mouseY, this.devicePixelRatio);
    };
    if (this.page === "inventory") {
      // this.InventoryComponent?.exitButton.handleClick(mouseX, mouseY, this.canvas.width, this.canvas.height);
      this.InventoryComponent?.handleClick(mouseX, mouseY, this.devicePixelRatio);
    }
    if (this.settings && this.settings.isVisible) {
      this.settings.exitButton.handleClick(mouseX, mouseY, this.canvas.width, this.canvas.height);
      return;
    }
    if (this.page === "customize") {
      this.customizeComponent?.handleClick(mouseX, mouseY, this.devicePixelRatio);
    }
    if (this.purchasedGemsComponent && this.purchasedGemsComponent.isVisible) {
      console.log("clicking exit button")
      this.purchasedGemsComponent.exitButton.handleClick(mouseX, mouseY, this.devicePixelRatio);
      return;
    }
    if (this.failOrderComponent && this.failOrderComponent.isVisible) {
      this.failOrderComponent?.exitButton.handleClick(mouseX, mouseY, this.devicePixelRatio);
      return;
    }
    if (this.mode === "shop") {
      this.shopComponent?.handleClick(mouseX, mouseY, this.devicePixelRatio);
    }
    const clicked = this.footer?.handleClick(mouseX / this.devicePixelRatio, mouseY / this.devicePixelRatio);
    if (clicked) {
      this.mode = clicked;
    }
  }

  private async handleBuyingGems(amount: number) {
    this.isLoading = true;
    this.page = "menu"
    const response = await createOrder(this.username, amount)
    console.log("handlebuying gems response", response)
    if (response && this.orderComponent) {
      this.orderComponent.callBackURL = response.model.webUrl || response.merchantURL;
    }
    this.isLoading = false;
    this.page = "pendingOrders"
  }

  private async verifyOrder() {
    this.isLoading = true;
    this.page = "menu"
    const response = await orderStatus(this.username)
    console.log("VERIFYING order", response)
    if (response.model.orderStatus === "COMPLETED") {
      // need to update the profile
      this.gems += 100;
      this.page = "purchasedGems";
      this.purchasedGemsComponent?.show();
    } else {;
      this.failOrderComponent?.show();
    }
    this.isLoading = false;
    this.fetchProfile();
  }

  private startGame() {
    if (!this.assetsLoaded) return;
    // Show alert using WebApp and transition to the game scene
    // WebApp.showAlert('Hello World!');
    this.isRunning = false; // Stop rendering the menu scene

    if(this.canvas && this.context && this.assets){
      const gameScene = new GameScene(this.game, {currentWeapon: this.currentWeapon, currentCharacter: this.currentCharacter, weapons: this.weapons}, this.fetchProfile, this.levelUpWeapon, this.createMenuScene); 
      gameScene.updateUsername(this.username);
      this.game.changeScene(gameScene, this.canvas, this.context);
    }
  }

  private openSettings() {
    if (!this.settings) return;
    this.settings.show()
    this.page = "settings"
  }
  private openGems() {
    if (!this.buyGemsComponent) return;
    console.log("showing gems")
    this.buyGemsComponent.show()
    this.page = "gemShop"
  }

  render() {
    if (!this.isRunning || !this.context || !this.canvas) return;

    this.context.fillStyle = blueBackground;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (!this.assetsLoaded) {
      this.context.fillText('Loading assets...', this.canvas.width / 2 - 50, 600);
    } else {
      if (this.mode === "menu") {
        this.usernameComponent?.render(this.context, this.canvas.width, this.canvas.height, this.username, this.devicePixelRatio);
        drawRoundedBox(this.context, 0, this.canvas.height * 0.2 / this.devicePixelRatio, this.canvas.width, this.canvas.height * 0.5 / this.devicePixelRatio, 0, primaryColorBackground, 0, true, 0, false);
         // Dynamically size the logo
         const targetWidth = this.canvas.width * 0.3 / this.devicePixelRatio;   // Target width as 30% of canvas width
         const targetHeight = this.canvas.height * 0.4 / this.devicePixelRatio; // Target height as 30% of canvas height
         
         // Calculate a uniform scale to maintain aspect ratio
         const logoScale = Math.min(targetWidth / this.logoSprite.frameWidth, targetHeight / this.logoSprite.frameHeight);
         const logoX = this.canvas.width * 0.005;      // Position 2% from the left
         const logoY = this.canvas.height * 0.17;      // Position 10% from the top
        // Render the logo with uniform scaling
        this.logoSprite.render(this.context, logoX, logoY, logoScale);
        this.logo2Sprite.render(this.context, this.canvas.width * 0.225, this.canvas.height * 0.17, logoScale)
        this.logoSprite?.update();
        this.logo2Sprite?.update();

      }
      this.playButton?.render(this.context);
      if (this.context){
        this.context.fillStyle = "white";
        this.context.font = `${this.canvas.height * 0.025}px depixel`;
        drawCenteredText(this.context, "Shiny Knights", 0.5 * this.canvas.width / this.devicePixelRatio, 0.25 * this.canvas.height / this.devicePixelRatio);


      }
    }


    // CustomizationComponent
    if (this.mode === "customize") {
      this.customizeComponent?.render(this.context);
      this.customizeComponent?.update();
    } else if (this.mode === "shop") {
      this.shopComponent?.render(this.context);
    }
    // create header
    this.menuHeader?.render(this.context, this.gold, this.gems, this.level);
    this.purchaseGemsButton?.render(this.context, this.canvas.width / this.devicePixelRatio, this.canvas.height / this.devicePixelRatio);
    if (this.page === "gemShop" && this.buyGemsComponent?.isVisible) {
      this.buyGemsComponent?.render(this.context);
    }
    if (this.page === "pendingOrders") {
      this.orderComponent?.render(this.context);
    }
    if (this.page === "inventory") {
      this.InventoryComponent?.render(this.context);
    };

    this.footer?.render(this.context);
    this.settingButton?.render(this.context, this.canvas.width / this.devicePixelRatio, this.canvas.height / this.devicePixelRatio);
    // settings render
    if (this.settings && this.settings.isVisible) {
      this.settings.render(this.context);
    }
    if (this.isLoading && this.LoadingComponent) {
      this.LoadingComponent.render(this.context);
    }
    if (this.purchasedGemsComponent?.isVisible && this.purchasedGemsComponent) {
      this.purchasedGemsComponent?.render(this.context);
    }
    if (this.failOrderComponent?.isVisible) {
      this.failOrderComponent?.render(this.context);

    }
    
    // this.gameOverComponent?.render(this.context);
    
  }
  destroy() {
    console.log("destory menu scene")
    if (this.canvas) {
      // Remove event listeners when the scene is destroyed
      this.canvas.removeEventListener('click', this.boundHandleClick);
      this.canvas.removeEventListener('touchstart', this.boundHandleTouchStart);
      this.canvas.removeEventListener('touchmove', this.boundHandleTouchMove);
      this.canvas.removeEventListener('touchend', this.boundHandleTouchEnd);
    }
  }

  updateFromDatabase(profile: {gold?: number, gems?: number, level?: number, username?: string, weapons?: Weapons, characters?: Characters, currentCharacter?: string, currentWeapon?: number, inventory?: ItemInventory[]}) {
    // console.log("updating from database", profile);
    if (profile.gems) this.gems = profile.gems;
    if (profile.level) this.level = profile.level;
    if (profile.username) {
      this.username = profile.username;
      this.customizeComponent?.updateUsername(this.username);
      this.InventoryComponent?.updateUsername(this.username);
    }
    if (profile.currentWeapon?.toString()  && this.customizeComponent) {
      this.customizeComponent.updateWeaponPopup({currentWeapon: profile.currentWeapon})
    }
    // console.log("profile", profile);
    if (profile.weapons && profile.currentWeapon?.toString()) {
      // console.log("menuscene weapons", profile.weapons);
      this.weapons = profile.weapons
      this.customizeComponent?.updateWeapon(this.weapons, profile.currentWeapon);
    };
    if (profile.characters) {
      this.characters = profile.characters
      this.customizeComponent?.updateCharacterPopup(this.characters);
    };
    if (profile.currentCharacter) this.currentCharacter = profile.currentCharacter;
    if (profile.currentWeapon) this.currentWeapon = profile.currentWeapon;
    if (profile.gold) {
      this.gold = profile.gold;
    }
    if (profile.inventory) {
      this.InventoryComponent?.updateInventory(profile.inventory);
    }
    this.isLoading = false;
    this.render();

  }
  updateDailyShop(dailyShop: any, username: string) {
    this.shopComponent?.updateShop(dailyShop, username);

  }
}
