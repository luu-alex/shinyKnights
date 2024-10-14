import Pet from './Pet';
import Player from '../classes/Player';
import Enemy from '../classes/Enemy';

class PetManager {
    private pets: Pet[];

    constructor() {
        this.pets = [];
    }

    // Add a new pet to the manager
    addPet(pet: Pet) {
        this.pets.push(pet);
    }

    // Update all pets
    update(delta: number, enemies: Enemy[]) {
        for (const pet of this.pets) {
            pet.update(delta, enemies);
        }
    }

    // Render all pets
    render(context: CanvasRenderingContext2D) {
        for (const pet of this.pets) {
            pet.render(context);
        }
    }

    // If you need a method to remove pets (e.g., if they die or are unsummoned)
    removePet(pet: Pet) {
        const index = this.pets.indexOf(pet);
        if (index > -1) {
            this.pets.splice(index, 1);
        }
    }

    // Other utility functions, such as finding a specific pet, managing pet health, etc.
    getPets() {
        return this.pets;
    }
}

export default PetManager;
