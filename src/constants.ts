import { CharacterClass, Item, Upgrade, Talent } from './types';

export const BASE_CLASSES: Record<CharacterClass, { title: string; primaryStat: string; color: string }> = {
  Warrior: { title: 'Squire', primaryStat: 'strength', color: '#8b0000' },
  Mage: { title: 'Apprentice', primaryStat: 'erudition', color: '#4b0082' },
  Priest: { title: 'Acolyte', primaryStat: 'faith', color: '#daa520' },
  Vampire: { title: 'Fledgling', primaryStat: 'erudition', color: '#660000' },
  Werewolf: { title: 'Stray', primaryStat: 'strength', color: '#3b2f2f' },
  Paladin: { title: 'Oathkeeper', primaryStat: 'faith', color: '#fffaf0' }
};

export const PRESTIGE_NAMES: Record<CharacterClass, string[]> = {
  Warrior: ['Squire', 'Knight', 'Feudal Lord', 'King'],
  Mage: ['Apprentice', 'Sorcerer', 'Archmage', 'Hand of the King'],
  Priest: ['Acolyte', 'Bishop', 'Cardinal', 'Pope'],
  Vampire: ['Fledgling', 'Noble', 'Count', 'Overlord of the Bloodline'],
  Werewolf: ['Stray', 'Feral', 'Alpha', 'Alpha of the Great Pack'],
  Paladin: ['Oathkeeper', 'Crusader', 'Grand Master', 'Sovereign of Light']
};

export const INITIAL_UPGRADES: Upgrade[] = [
  { id: 'u1', name: 'Peasant Levies', description: 'Laborers who gather bronze coins.', baseCost: 15, perLevelGain: 1, type: 'passive', level: 0 },
  { id: 'u2', name: 'Iron Forging', description: 'Stronger tools for higher click value.', baseCost: 50, perLevelGain: 2, type: 'click', level: 0 },
  { id: 'u3', name: 'Altar of Souls', description: 'Generates passive essence.', baseCost: 150, perLevelGain: 5, type: 'passive', level: 0 },
  { id: 'u4', name: 'Leather Armor', description: 'Basic protection for your body.', baseCost: 300, perLevelGain: 25, type: 'armor', level: 0 },
  { id: 'u5', name: 'Plate Armor', description: 'Heavier protection from fatal blows.', baseCost: 2000, perLevelGain: 100, type: 'armor', level: 0 }
];

export const PRIMORDIAL_RELICS: Item[] = [
  { id: 'relic_hammer', name: 'Hammer of Faith', description: 'Forged from the nails of a martyr.', type: 'relic', rarity: 'primordial', bonus: { faith: 50, clickMult: 10 } },
  { id: 'relic_excalibur', name: 'Excalibur', description: 'The sovereign blade of destiny.', type: 'relic', rarity: 'primordial', bonus: { strength: 50, clickMult: 15 } },
  { id: 'relic_merlin', name: 'Book of Merlin', description: 'Ancient knowledge beyond time.', type: 'relic', rarity: 'primordial', bonus: { erudition: 50, passiveMult: 5 } },
  { id: 'relic_crown', name: 'Crown of the Undead', description: 'Worn by those who refused the grave.', type: 'relic', rarity: 'primordial', bonus: { erudition: 25, faith: 25, clickMult: 5 } }
];
