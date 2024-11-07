
export type profileData = {
    username: string;
    characters: {
        unlocked: boolean
    },
    level: number,   
}

export type Characters = {
    knight: {
        unlocked: boolean,
        level: number,
        stats: PlayerStats
    },
    druid: {
        unlocked: boolean,
        level: number,
        stats: PlayerStats
    },
    swordsmaster: {
        unlocked: boolean,
        level: number,
        stats: PlayerStats
    }
}

export type Weapons = WeaponStats[]

export type WeaponStats = {
    level: number,
    stats: Stats,
    rarity: string,
    name: string
}

export type Stats = {
    attack: number,
    defense: number,
}

export type PopupInfo = {
    title: string,
    description: string,
    stats: string[],
    rarity: string,
    level: number,
}

export type PlayerStats = {
    attack: number,
    defense: number,
    attackSpeed: number,
    hp: number,
}

export type ShopData = {
    type: ItemType,
    item: ShopItem
}

export type ShopItem = {
    title: string,
    currency: string,
    cost: number,
    bought: boolean,
    index:number,
    type: string,
    itemType: ItemType,
    rarity: string,
}

export type ItemType = "weapon" | "character" | "item";

export type Shop = {
    date: string;
    items: ShopItem[];
};

export type Weapon = {
    level: number;
    stats: {
        attack: number;
        defense: number;
    };
    name: string;
    rarity: string;
}

export type ItemInventory = {
    name: string,
    id: number,
    type: ItemType,
    rarity: string,
};