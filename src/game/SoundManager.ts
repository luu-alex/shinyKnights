// SoundManager.ts
export class SoundManager {
    private sounds: Map<string, HTMLAudioElement>;
    private isMuted: boolean = false;

    constructor() {
        this.sounds = new Map();
    }

    // Load a sound effect and add it to the sounds map
    public loadSound(key: string, src: string) {
        const audio = new Audio(src);
        audio.load();
        this.sounds.set(key, audio);
    }

    // Play a sound by key, with options to loop or set volume
    public playSound(key: string, options: { loop?: boolean; volume?: number } = {}) {
        if (this.isMuted) return; 
        const sound = this.sounds.get(key);
        if (sound) {
            sound.loop = options.loop || false;
            sound.volume = options.volume ?? 1.0;
            sound.currentTime = 0;
            sound.play().catch((error) => console.error("Error playing sound:", error));
        } else {
            console.warn(`Sound with key "${key}" not found.`);
        }
    }

    // Stop a sound by key
    public stopSound(key: string) {
        const sound = this.sounds.get(key);
        if (sound) {
            sound.pause();
            sound.currentTime = 0; // Reset to the beginning
        }
    }

    // Adjust the volume of a sound
    public setVolume(key: string, volume: number) {
        const sound = this.sounds.get(key);
        if (sound) {
            sound.volume = volume;
        }
    }
}
