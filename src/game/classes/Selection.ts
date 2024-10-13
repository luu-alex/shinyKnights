
import Sword from '../weapon/Sword';
import Spear from '../weapon/Spear';
import Crossbow from '../weapon/Crossbow';
import Dagger from '../weapon/Dagger';

export function chooseWeapon(weaponName: string) {
    switch (weaponName) {
        case 'Sword':
            return new Sword();
        case 'Spear':
            return new Spear();
        case 'Crossbow':
            return new Crossbow();
        case 'Dagger':
            return new Dagger();
        default:
            // return new Weapon('Fists', 10, 500);
            console.log('Invalid weapon name');
    }
}