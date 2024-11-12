export class AssetManager {
    private assets: Map<string, HTMLImageElement>;
    private totalAssets: number;
    private loadedAssets: number;
    private onAllAssetsLoaded: () => void;
    private audioFiles: Map<string, HTMLAudioElement>;

    constructor(onAllAssetsLoaded: () => void) {
        this.assets = new Map();
        this.totalAssets = 0;
        this.loadedAssets = 0;
        this.onAllAssetsLoaded = onAllAssetsLoaded;
        this.audioFiles = new Map();
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
    public loadAudioAssets(audioPaths: { [key: string]: string }): void {
        const audioKeys = Object.keys(audioPaths);
        this.totalAssets += audioKeys.length;

        audioKeys.forEach((key) => {
            const audio = new Audio(audioPaths[key]);
            this.audioFiles.set(key, audio);

            // Preload audio and update when loaded
            this.preloadAudio(audio, () => {
                this.loadedAssets++;
                this.checkAllAssetsLoaded();
            });
        });
    }

    // Preload a single audio file and execute callback on load
    private preloadAudio(audio: HTMLAudioElement, callback: () => void): void {
        audio.addEventListener('canplaythrough', callback, { once: true });
        audio.load(); // Start loading the audio
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
    public getAudio(key: string): HTMLAudioElement | undefined {
        return this.audioFiles.get(key);
    }
}

