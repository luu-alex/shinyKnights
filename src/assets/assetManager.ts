export class AssetManager {
    private assets: Map<string, HTMLImageElement>;
    private totalAssets: number;
    private loadedAssets: number;
    private onAllAssetsLoaded: () => void;

    constructor(onAllAssetsLoaded: () => void) {
        this.assets = new Map();
        this.totalAssets = 0;
        this.loadedAssets = 0;
        this.onAllAssetsLoaded = onAllAssetsLoaded;
    }

    // Load an image asset and track it
    public loadImage(key: string, src: string) {
        const img = new Image();
        this.totalAssets++;
        img.src = src;

        // When the image is loaded, update the progress
        img.onload = () => {
            this.assets.set(key, img);
            this.loadedAssets++;
            this.checkAllAssetsLoaded();
        };

        // Optionally, handle errors
        img.onerror = () => {
            console.error(`Failed to load asset: ${src}`);
            this.loadedAssets++;
            this.checkAllAssetsLoaded();
        };
    }

    // Get the loaded asset (image)
    public getImage(key: string): HTMLImageElement {
        return this.assets.get(key)!;
    }

    // Check if all assets are loaded
    private checkAllAssetsLoaded() {
        if (this.loadedAssets === this.totalAssets) {
            this.onAllAssetsLoaded(); // Call the callback when all assets are loaded
        }
    }
}
