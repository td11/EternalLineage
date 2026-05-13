export type CharacterClass = 'Warrior' | 'Mage' | 'Priest' | 'Vampire' | 'Werewolf' | 'Paladin';

export interface Stats {
  strength: number;
  erudition: number;
  faith: number;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: 'weapon' | 'armor' | 'relic' | 'artifact';
  rarity: 'common' | 'rare' | 'legendary' | 'primordial';
  bonus?: Partial<Stats> & { clickMult?: number; passiveMult?: number };
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  perLevelGain: number;
  type: 'passive' | 'click' | 'stat' | 'armor';
  level: number;
}

export interface Talent {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'might' | 'arcane' | 'divinity';
  locked: boolean;
  purchased: boolean;
}

export interface PlayerData {
  id: string;
  generation: number;
  name: string;
  currentClass: CharacterClass;
  prestigeLevel: number;
  gold: number;
  ancientRelics: number; // Currency for permanent talents
  hp: number;
  maxHp: number;
  clickPower: number;
  stats: Stats;
  inventory: Item[];
  upgrades: Record<string, number>; // upgradeId: level
  activeTalents: string[];
  isAlive: boolean;
  language: 'en' | 'es';
  gender: 'male' | 'female';
  history: string[];
  hasSeenIntro?: boolean;
  healthPurchased?: number;
  clicksToEvent: number;
  ancestorLegacy?: {
    name: string;
    rank: string;
    class: string;
    gen: number;
  };
  lineageVault: {
    name: string;
    class: string;
    gen: number;
    prestige: number;
    gender: 'male' | 'female';
  }[];
  deathCause?: string;
  lastSave: number;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: 'dialog' | 'combat' | 'choice';
  options: EventOption[];
  targetClicks?: number;
  timeLimit?: number;
}

export interface EventOption {
  text: string;
  requirement?: { stat: keyof Stats; value: number };
  onSuccess: (player: PlayerData) => { message: string; reward?: Partial<PlayerData> };
  onFailure?: (player: PlayerData) => { message: string; penalty?: Partial<PlayerData> };
  difficultyThreshold?: number;
}
