import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PlayerData, CharacterClass, GameEvent, Item, Upgrade } from '../types';
import { INITIAL_UPGRADES, BASE_CLASSES } from '../constants';

const SAVE_KEY = 'eternal_lineage_save_v1';

const getInitialPlayer = (name: string = '', charClass: CharacterClass = 'Warrior', hasSeenIntro: boolean = false): PlayerData => {
  const stats = {
    Warrior: { strength: 8, erudition: 2, faith: 2 },
    Mage: { strength: 2, erudition: 8, faith: 2 },
    Priest: { strength: 2, erudition: 2, faith: 8 },
    Paladin: { strength: 6, erudition: 2, faith: 6 },
    Vampire: { strength: 7, erudition: 5, faith: 0 },
    Werewolf: { strength: 10, erudition: 1, faith: 1 }
  }[charClass] || { strength: 5, erudition: 5, faith: 5 };

  return {
    id: Math.random().toString(36).substr(2, 9),
    generation: 1,
    name: name, 
    currentClass: charClass,
    gender: 'male',
    prestigeLevel: 0,
    gold: 0,
    ancientRelics: 0,
    hp: 100,
    maxHp: 100,
    clickPower: 1,
    stats,
    inventory: [],
    upgrades: {},
    activeTalents: [],
    isAlive: true,
    language: 'es',
    history: [],
    hasSeenIntro: hasSeenIntro,
    healthPurchased: 0,
    clicksToEvent: 0,
    lineageVault: [],
    lastSave: Date.now()
  };
};

import { TRANSLATIONS as translations } from '../translations';

export function useGameEngine() {
  const [player, setPlayer] = useState<PlayerData | null>(null);
  const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);
  const [combatClicks, setCombatClicks] = useState(0);
  const [combatTimeLeft, setCombatTimeLeft] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  // Auto-clear message
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);
  const [lastResult, setLastResult] = useState<{
    type: 'success' | 'failure';
    message: string;
    rewardDesc?: string;
    penaltyDesc?: string;
  } | null>(null);
  const [clickPopups, setClickPopups] = useState<{ id: number; x: number; y: number; val: string }[]>([]);

  // Load game on start
  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const loadedPlayer = JSON.parse(saved);
        if (loadedPlayer && !loadedPlayer.language) {
          loadedPlayer.language = 'es';
        }
        // Force naming screen if it's a legacy or empty name
        if (loadedPlayer && (!loadedPlayer.name || loadedPlayer.name === 'First Ancestor' || loadedPlayer.name === 'Primer Ancestro')) {
          loadedPlayer.name = '';
        }
        if (loadedPlayer && !loadedPlayer.history) {
          loadedPlayer.history = [];
        }
        if (loadedPlayer && loadedPlayer.hasSeenIntro === undefined) {
          loadedPlayer.hasSeenIntro = false;
        }
        if (loadedPlayer && loadedPlayer.healthPurchased === undefined) {
          loadedPlayer.healthPurchased = 0;
        }
        if (loadedPlayer && loadedPlayer.clicksToEvent === undefined) {
          loadedPlayer.clicksToEvent = 0;
        }
        if (loadedPlayer && !loadedPlayer.lineageVault) {
          loadedPlayer.lineageVault = [];
        }
        setPlayer(loadedPlayer);
      } catch (e) {
        console.error("Failed to load save", e);
        setPlayer(getInitialPlayer());
      }
    } else {
      setPlayer(getInitialPlayer());
    }
  }, []);

  // Combat Timer
  useEffect(() => {
    if (!activeEvent || activeEvent.type !== 'combat' || !activeEvent.timeLimit) return;

    if (combatTimeLeft <= 0) {
      // Time out! Force failure by resolving the first (and usually only) option
      // But we need to know if they succeeded. 
      // Actually, if time runs out and they haven't reached target, it's a failure.
      if (combatClicks < (activeEvent.targetClicks || 0)) {
        resolveEvent(0, true); // Force fail
      }
      return;
    }

    const timer = setInterval(() => {
      setCombatTimeLeft(prev => Math.max(0, prev - 0.1));
    }, 100);

    return () => clearInterval(timer);
  }, [activeEvent, combatTimeLeft, combatClicks]);

  const handleCombatClick = useCallback(() => {
    if (!activeEvent || activeEvent.type !== 'combat' || !activeEvent.targetClicks) return;
    
    setCombatClicks(prev => {
      const next = prev + 1;
      if (next >= (activeEvent.targetClicks || 0)) {
        setTimeout(() => resolveEvent(0, false), 0);
      }
      return next;
    });
  }, [activeEvent]);

  // Automatic Prestige Check
  useEffect(() => {
    if (!player || !player.isAlive) return;
    const totalStats = player.stats.strength + player.stats.erudition + player.stats.faith;
    const threshold = (player.prestigeLevel + 1) * 30; // Threshold increases with level

    if (totalStats >= threshold) {
      const isEs = player.language === 'es';
      const tStories = (isEs ? translations.es.stories : translations.en.stories) as any;
      const classKey = player.currentClass.toLowerCase() as 'warrior' | 'mage' | 'priest' | 'paladin' | 'vampire' | 'werewolf';
      const milestones = tStories[classKey]?.milestones || tStories.warrior.milestones;
      const newEntry = milestones[Math.floor(Math.random() * milestones.length)] || "...";

      setPlayer(prev => {
        if (!prev) return null;
        return { 
          ...prev, 
          prestigeLevel: prev.prestigeLevel + 1,
          history: [...prev.history, newEntry],
          upgrades: {}, // Reset upgrades on prestige
          healthPurchased: 0
        };
      });
      setMessage(isEs ? "¡Has alcanzado un nuevo hito de prestigio!" : "You've reached a new prestige milestone!");
      setTimeout(() => setMessage(null), 3000);
    }
  }, [player?.stats.strength, player?.stats.erudition, player?.stats.faith]);

  // Instant Save
  useEffect(() => {
    if (player) {
      localStorage.setItem(SAVE_KEY, JSON.stringify(player));
    }
  }, [player]);

  // Passive Gold Interval & Random Events
  useEffect(() => {
    if (!player || !player.isAlive) return;

    const interval = setInterval(() => {
      setPlayer(current => {
        if (!current) return null;
        
        let passive = 0;
        INITIAL_UPGRADES.forEach(u => {
          const level = current.upgrades[u.id] || 0;
          if (u.type === 'passive') {
            passive += u.perLevelGain * level;
          }
        });

        // Transformations transformations
        if (current.currentClass === 'Vampire') passive *= 1.5;
        if (current.currentClass === 'Werewolf') passive += 5;

        current.inventory.forEach(item => {
          if (item.bonus?.passiveMult) passive *= item.bonus.passiveMult;
        });

        // Special/Mysterious Events (Rarer)
        if (Math.random() < 0.002 && !activeEvent) triggerRandomEvent(current, true);

        if (passive === 0) return current;

        // Health drain for Vampires
        let newHp = current.hp;
        if (current.currentClass === 'Vampire' && Math.random() < 0.1) {
          newHp = Math.max(1, current.hp - 1);
        }

        return { ...current, gold: current.gold + passive, hp: newHp };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [player?.isAlive, activeEvent]);

   const handleManualClick = useCallback((e?: React.MouseEvent) => {
    if (!player || !player.isAlive) return;

    setPlayer(current => {
      if (!current) return null;

      let clickValue = 1;
      INITIAL_UPGRADES.forEach(u => {
        const level = current.upgrades[u.id] || 0;
        if (u.type === 'click') clickValue += u.perLevelGain * level;
      });

      if (current.currentClass === 'Warrior') clickValue += current.stats.strength * 0.5;
      if (current.currentClass === 'Mage') clickValue += current.stats.erudition * 0.2;
      if (current.currentClass === 'Werewolf') clickValue += 10;
      if (current.currentClass === 'Paladin') clickValue += (current.stats.strength + current.stats.faith) * 0.25;
      
      current.inventory.forEach(item => {
        if (item.bonus?.clickMult) clickValue *= item.bonus.clickMult;
      });

      const finalClickVal = Math.floor(clickValue);

      if (e) {
        const id = `popup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        setClickPopups(prev => [...prev, { id, x: e.clientX, y: e.clientY, val: '+' + finalClickVal }]);
        setTimeout(() => setClickPopups(prev => prev.filter(p => p.id !== id)), 1000);
      }

      // Stat training through intense clicking
      const clickCountKey = '_clicks_since_stat';
      const clicks = ((current as any)[clickCountKey] || 0) + 1;
      
      // Progress Event every 100 clicks
      let nextClicksToEvent = (current.clicksToEvent || 0) + 1;
      let shouldTriggerEvent = false;
      if (nextClicksToEvent >= 100) {
        nextClicksToEvent = 0;
        shouldTriggerEvent = true;
      }

      // Random Skirmish Chance (3% per click)
      if (Math.random() < 0.03) {
        shouldTriggerEvent = true;
      }

      let newStats = { ...current.stats };
      
      if (clicks >= 50) {
        const statsKeys = ['strength', 'erudition', 'faith'] as const;
        const randStat = statsKeys[Math.floor(Math.random() * statsKeys.length)];
        newStats[randStat] += 1;
        
        const isEs = current.language === 'es';
        const statName = (translations[isEs ? 'es' : 'en'].stats as any)[randStat];
        setMessage(isEs ? `¡Tu entrenamiento da frutos! +1 ${statName}` : `Your training bears fruit! +1 ${statName}`);
        
        if (shouldTriggerEvent) {
          setTimeout(() => setPlayer(p => {
             if (p && !activeEvent) triggerRandomEvent(p, false);
             return p;
          }), 0);
        }

        return { 
          ...current, 
          gold: current.gold + finalClickVal, 
          clickPower: finalClickVal, 
          stats: newStats, 
          [clickCountKey]: 0,
          clicksToEvent: nextClicksToEvent
        };
      }

      if (shouldTriggerEvent) {
        setTimeout(() => setPlayer(p => {
           if (p && !activeEvent) triggerRandomEvent(p, false);
           return p;
        }), 0);
      }

      return { ...current, gold: current.gold + finalClickVal, clickPower: finalClickVal, [clickCountKey]: clicks, clicksToEvent: nextClicksToEvent };
    });
  }, [player]);

  const triggerRandomEvent = (curr: PlayerData, isSpecial: boolean = false) => {
    const isEs = curr.language === 'es';
    
    // Algorithmic event pool
    const getEvent = (): GameEvent => {
      const roll = Math.random();

      // BOSS/SPECIAL EVENTS If triggered by interval or low chance
      if (isSpecial || roll < 0.20) {
        const specialTitle = isEs ? '¡EVENTO ESPECIAL!' : 'SPECIAL EVENT!';
        
        // COMBAT EVENTS PRIORITY (85% chance if special)
        const combatRoll = Math.random();

        // 1. THE FINAL RECKONING (Ultra Boss - 5% chance at Prestige 10+)
        if (curr.prestigeLevel >= 10 && combatRoll > 0.95) {
          return {
            id: 'event_final_reckoning_' + Date.now() + Math.random(),
            title: isEs ? 'EL JUICIO FINAL' : 'THE FINAL RECKONING',
            description: (isSpecial ? `[${specialTitle}] ` : '') + (isEs ? 'El velo se rasga. El heraldo del olvido reclama tu linaje. ¡Lucha por la eternidad!' : 'The veil tears. The herald of oblivion claims your lineage. Fight for eternity!'),
            type: 'combat',
            targetClicks: 200 + (curr.generation * 25),
            timeLimit: 15,
            options: [
              {
                text: isEs ? 'ALCANZAR LA DIVINIDAD' : 'REACH DIVINITY',
                onSuccess: (p) => ({ 
                  message: isEs ? "¡Has derrotado al heraldo! Tu linaje es ahora eterno." : "You have defeated the herald! Your lineage is now eternal.", 
                  reward: { ...p, gold: p.gold + 50000, prestigeLevel: p.prestigeLevel + 5 } 
                }),
                onFailure: (p) => ({ 
                  message: isEs ? "El olvido te consume." : "Oblivion consumes you.", 
                  penalty: { ...p, hp: 0 } 
                })
              }
            ]
          };
        }

        // 2. Fallen Titan (Boss)
        if (combatRoll < 0.20) {
          return {
            id: 'boss_titan_' + Date.now() + Math.random(),
            title: isEs ? 'EL TITÁN CAÍDO' : 'THE FALLEN TITAN',
            description: (isSpecial ? `[${specialTitle}] ` : '') + (isEs ? 'Una mole de piedra y odio bloquea el camino. ¡Derritelo a golpes!' : 'A mass of stone and hate blocks the way. Smash it to pieces!'),
            type: 'combat',
            targetClicks: 40 + (curr.generation * 10),
            timeLimit: 10,
            options: [
              {
                text: isEs ? 'Luchar con todas tus fuerzas' : 'Fight with all your might',
                onSuccess: (p) => ({ 
                  message: isEs ? "¡Derrotas al coloso! Tu nombre resuena en las crónicas." : "You defeat the colossus! Your name echoes in the chronicles.", 
                  reward: { ...p, gold: p.gold + 1500, prestigeLevel: p.prestigeLevel + 1 } 
                }),
                onFailure: (p) => {
                  const damage = 70 + (p.prestigeLevel * 25);
                  return { 
                    message: isEs ? `El titán te aplasta. ¡Has sufrido ${damage} de daño!` : `The titan crushes you. You suffered ${damage} damage!`, 
                    penalty: { ...p, hp: p.hp - damage } 
                  };
                }
              }
            ]
          };
        }

        // 2. Bone Legion
        if (combatRoll < 0.40) {
          return {
            id: 'combat_legion_' + Date.now() + Math.random(),
            title: isEs ? 'LEGION DE HUESOS' : 'BONE LEGION',
            description: (isSpecial ? `[${specialTitle}] ` : '') + (isEs ? 'Cientos de esqueletos emergen de la tierra. ¡Derríbalos a todos!' : 'Hundreds of skeletons emerge from the ground. Strike them all down!'),
            type: 'combat',
            targetClicks: 25 + (curr.prestigeLevel * 15),
            timeLimit: 8,
            options: [
              {
                text: isEs ? 'Mantener la posición' : 'Hold your ground',
                onSuccess: (p) => ({ 
                  message: isEs ? "Abres un camino de huesos rotos y sales victorioso." : "You carve a path of broken bones and emerge victorious.", 
                  reward: { ...p, gold: p.gold + 500, stats: { ...p.stats, strength: p.stats.strength + 1 } } 
                }),
                onFailure: (p) => {
                  const damage = 40 + (p.prestigeLevel * 15);
                  return { 
                    message: isEs ? `Las garras de los muertos te desgarran. ¡Has sufrido ${damage} de daño!` : `The claws of the dead tear your flesh. You suffered ${damage} damage!`, 
                    penalty: { ...p, hp: p.hp - damage } 
                  };
                }
              }
            ]
          };
        }

        // 3. Shadow Assassin
        if (combatRoll < 0.60) {
          return {
            id: 'combat_assassin_' + Date.now() + Math.random(),
            title: isEs ? 'ASESINO DE SOMBRAS' : 'SHADOW ASSASSIN',
            description: (isSpecial ? `[${specialTitle}] ` : '') + (isEs ? 'Un asesino surge de la oscuridad. ¡Es demasiado rápido!' : 'An assassin leaps from the dark. He is too fast!'),
            type: 'combat',
            targetClicks: 15 + (curr.prestigeLevel * 10),
            timeLimit: 4,
            options: [
              {
                text: isEs ? 'Contraatacar' : 'Counter-attack',
                onSuccess: (p) => ({ 
                  message: isEs ? "Desvías su daga y le atraviesas el corazón." : "You deflect his dagger and pierce his heart.", 
                  reward: { ...p, gold: p.gold + 600, stats: { ...p.stats, strength: p.stats.strength + 2 } } 
                }),
                onFailure: (p) => {
                  const damage = 50 + (p.prestigeLevel * 20);
                  return { 
                    message: isEs ? `La hoja envenenada te corta profundo. ¡Has sufrido ${damage} de daño!` : `The poisoned blade cuts you deeply. You suffered ${damage} damage!`, 
                    penalty: { ...p, hp: p.hp - damage } 
                  };
                }
              }
            ]
          };
        }

        // 4. Cursed Knight
        if (combatRoll < 0.85) {
          return {
            id: 'combat_cursed_knight_' + Date.now() + Math.random(),
            title: isEs ? 'CABALLERO MALDITO' : 'CURSED KNIGHT',
            description: (isSpecial ? `[${specialTitle}] ` : '') + (isEs ? 'Un caballero de armadura negra te desafía. Su fuerza es sobrehumana.' : 'A knight in black armor challenges you. His strength is superhuman.'),
            type: 'combat',
            targetClicks: 50 + (curr.generation * 15),
            timeLimit: 12,
            options: [
              {
                text: isEs ? 'Duelo a muerte' : 'Duel to the death',
                onSuccess: (p) => ({ 
                  message: isEs ? "Tras un épico intercambio de golpes, el caballero cae." : "After an epic exchange of blows, the knight falls.", 
                  reward: { ...p, gold: p.gold + 1200, stats: { ...p.stats, strength: p.stats.strength + 3 } } 
                }),
                onFailure: (p) => {
                  const damage = 60 + (p.prestigeLevel * 25);
                  return { 
                    message: isEs ? `Su maza destroza tu defensa. ¡Has sufrido ${damage} de daño!` : `His mace shatters your defense. You suffered ${damage} damage!`, 
                    penalty: { ...p, hp: p.hp - damage } 
                  };
                }
              }
            ]
          };
        }

        // 4. Dire Wolf Combat
        if (combatRoll < 0.5) {
          return {
            id: 'combat_dire_wolf_' + Date.now() + Math.random(),
            title: isEs ? 'LOBO HUARGO' : 'DIRE WOLF',
            description: (isSpecial ? `[${specialTitle}] ` : '') + (isEs ? 'Una bestia hambrienta salta sobre ti. ¡Lucha por tu vida!' : 'A hungry beast leaps at you. Fight for your life!'),
            type: 'combat',
            targetClicks: 20 + (curr.generation * 5),
            timeLimit: 6,
            options: [
              {
                text: isEs ? 'Defenderse' : 'Defend yourself',
                onSuccess: (p) => ({ 
                  message: isEs ? "Logras ahuyentar a la bestia tras una dura lucha." : "You manage to drive away the beast after a tough struggle.", 
                  reward: { ...p, gold: p.gold + 300, stats: { ...p.stats, strength: p.stats.strength + 1 } } 
                }),
                onFailure: (p) => ({ 
                  message: isEs ? "Los colmillos del lobo se hunden en tu hombro." : "The wolf's fangs sink into your shoulder.", 
                  penalty: { ...p, hp: p.hp - (30 + (p.generation * 5)) } 
                })
              }
            ]
          };
        }

        // Shadow Assassin Combat
        if (roll < 0.7) {
          return {
            id: 'combat_assassin_' + Date.now() + Math.random(),
            title: isEs ? 'ASESINO DE SOMBRAS' : 'SHADOW ASSASSIN',
            description: (isSpecial ? `[${specialTitle}] ` : '') + (isEs ? 'Un asesino surge de la oscuridad. ¡Es demasiado rápido!' : 'An assassin leaps from the dark. He is too fast!'),
            type: 'combat',
            targetClicks: 15 + (curr.prestigeLevel * 10),
            timeLimit: 4,
            options: [
              {
                text: isEs ? 'Contraatacar' : 'Counter-attack',
                onSuccess: (p) => ({ 
                  message: isEs ? "Desvías su daga y le atraviesas el corazón." : "You deflect his dagger and pierce his heart.", 
                  reward: { ...p, gold: p.gold + 600, stats: { ...p.stats, strength: p.stats.strength + 2 } } 
                }),
                onFailure: (p) => ({ 
                  message: isEs ? "La hoja envenenada te corta profundamente." : "The poisoned blade cuts you deeply.", 
                  penalty: { ...p, hp: p.hp - (50 + (p.prestigeLevel * 10)) } 
                })
              }
            ]
          };
        }

        // Cursed Knight Combat
        if (roll < 0.85) {
          return {
            id: 'combat_cursed_knight_' + Date.now() + Math.random(),
            title: isEs ? 'CABALLERO MALDITO' : 'CURSED KNIGHT',
            description: (isSpecial ? `[${specialTitle}] ` : '') + (isEs ? 'Un caballero de armadura negra te desafía. Su fuerza es sobrehumana.' : 'A knight in black armor challenges you. His strength is superhuman.'),
            type: 'combat',
            targetClicks: 50 + (curr.generation * 15),
            timeLimit: 12,
            options: [
              {
                text: isEs ? 'Duelo a muerte' : 'Duel to the death',
                onSuccess: (p) => ({ 
                  message: isEs ? "Tras un épico intercambio de golpes, el caballero cae." : "After an epic exchange of blows, the knight falls.", 
                  reward: { ...p, gold: p.gold + 1200, stats: { ...p.stats, strength: p.stats.strength + 3 } } 
                }),
                onFailure: (p) => ({ 
                  message: isEs ? "Su maza destroza tu defensa." : "His mace shatters your defense.", 
                  penalty: { ...p, hp: p.hp - (60 + (p.generation * 10)) } 
                })
              }
            ]
          };
        }

        // Relic Hunter
        if (roll < 0.7) {
          return {
            id: 'relic_hunter_' + Date.now() + Math.random(),
            title: isEs ? 'EL CAZADOR DE RELIQUIAS' : 'THE RELIC HUNTER',
            description: (isSpecial ? `[${specialTitle}] ` : '') + (isEs ? 'Un viajero interdimensional te ofrece una pieza de historia por un precio justo.' : 'An interdimensional traveler offers you a piece of history for a fair price.'),
            type: 'choice',
            options: [
              {
                text: isEs ? 'Comprar Reliquia (1000 Oro)' : 'Buy Relic (1000 Gold)',
                requirement: { stat: 'erudition', value: 10 },
                onSuccess: (p) => ({ 
                   message: isEs ? "Has adquirido un artefacto de eras pasadas." : "You have acquired an artifact from past eras.",
                   reward: { ...p, gold: Math.max(0, p.gold - 1000), ancientRelics: p.ancientRelics + 3 }
                }),
                onFailure: (p) => ({ message: isEs ? "No tienes suficiente oro o el cazador no confía en ti." : "You don't have enough gold or the hunter doesn't trust you." }),
                difficultyThreshold: 12
              },
              { text: isEs ? 'Pasar de largo' : 'Move along', onSuccess: () => ({ message: "..." }) }
            ]
          };
        }
      }

      // Class transformations
      if (curr.hp < 30 && roll < 0.25 && curr.currentClass !== 'Vampire' && curr.currentClass !== 'Werewolf') {
        return {
          id: 'trans_001_' + Date.now() + Math.random(),
          title: isEs ? 'El Beso del Vástago' : 'The Scion\'s Kiss',
          description: isEs ? 'Una criatura pálida te ofrece vida eterna a cambio de tu humanidad.' : 'A pale creature offers eternal life in exchange for your humanity.',
          type: 'choice',
          options: [
            {
              text: isEs ? 'Aceptar (Vampiro)' : 'Accept (Vampire)',
              onSuccess: (p) => ({ 
                message: isEs ? "Tu corazón deja de latir. Ahora eres un depredador." : "Your heart stops beating. You are now a predator.",
                reward: { ...p, currentClass: 'Vampire', hp: p.maxHp }
              })
            },
            { text: isEs ? 'Rechazar' : 'Refuse', onSuccess: () => ({ message: isEs ? "Mueres como un hombre." : "You die as a man." }) }
          ]
        };
      }

      const primaryStat = BASE_CLASSES[curr.currentClass].primaryStat;
      
      const pool = [
        { t: isEs ? 'Un altar de sangre' : 'A Blood Altar', d: isEs ? 'Un monumento antiguo que gotea un líquido purpúreo. Sientes una atracción malsana.' : 'An ancient monument dripping with purple liquid. You feel an unholy attraction.', s: 'faith', rw: '+Gold', pl: '-HP' },
        { t: isEs ? 'Mercader de Sombras' : 'Shadow Merchant', d: isEs ? 'Un tipo encapuchado ofrece tratos que harían temblar a un santo.' : 'A hooded man offers deals that would make a saint tremble.', s: 'erudition', rw: '+Relic', pl: '-Gold' },
        { t: isEs ? 'Pozo de Necrosis' : 'Pool of Necrosis', d: isEs ? 'Un líquido negro burbujea en un pozo profundo. Sientes que tu fuerza vital se escapa.' : 'A black liquid bubbles in a deep pit. You feel your life force draining away.', s: 'faith', rw: '+Relics', pl: '-HP' },
        { t: isEs ? 'Trampa de Cuchillas' : 'Blade Trap', d: isEs ? 'Al pisar una losa, docenas de cuchillas surgen de las paredes. Reacciona rápido.' : 'Stepping on a floor tile triggers dozens of blades from the walls. React fast.', s: 'strength', rw: '+Gold', pl: '-HP' },
        { t: isEs ? 'Maldición de la Bruja' : 'Witch\'s Curse', d: isEs ? 'Una anciana te señala con un dedo huesudo. Sientes un frío mortal en tus huesos.' : 'An old woman points at you with a bony finger. You feel a deathly chill in your bones.', s: 'faith', rw: '+Stats', pl: '-HP' },
        { t: isEs ? 'Emboscada Nocturna' : 'Night Ambush', d: isEs ? 'Un asesino surge de las sombras con una daga envenenada.' : 'An assassin leaps from the shadows with a poisoned dagger.', s: 'strength', rw: '+Gold', pl: '-HP' },
        { t: isEs ? 'Llamarada de Dragón' : 'Dragon Fire', d: isEs ? 'Un dragón joven sobrevuela la zona escupiendo fuego. Debes buscar refugio.' : 'A young dragon flies overhead spitting fire. You must seek cover.', s: 'strength', rw: '+Relic', pl: '-HP' },
        { t: isEs ? 'Un grupo de bandidos' : 'A Group of Bandits', d: isEs ? 'Te exigen tributo o tu vida. Sus hojas están oxidadas pero afiladas.' : 'They demand tribute or your life. Their blades are rusty but sharp.', s: 'strength', rw: '+Gold', pl: '-HP' },
        { t: isEs ? 'Niebla espesa' : 'Thick Mist', d: isEs ? 'Sientes ojos que te observan desde las sombras. El aire pesa como el plomo.' : 'You feel eyes watching you from the shadows. The air feels heavy like lead.', s: 'faith', rw: '+Relic', pl: '-HP' },
        { t: isEs ? 'Cofre Olvidado' : 'Forgotten Chest', d: isEs ? 'Un cofre cubierto de moho y cadenas bendecidas.' : 'A chest covered in mold and blessed chains.', s: 'erudition', rw: '+Gold', pl: '-HP' },
        { t: isEs ? 'Eco de Ancestros' : 'Echo of Ancestors', d: isEs ? 'Oyes voces de tus antepasados susurrando secretos del linaje.' : 'You hear the voices of your ancestors whispering lineage secrets.', s: 'faith', rw: '+Relics', pl: '-Gold' },
        { t: isEs ? 'Entrenamiento Espartano' : 'Spartan Training', d: isEs ? 'Encuentras un foso de entrenamiento militar abandonado.' : 'You find an abandoned military training pit.', s: 'strength', rw: '+Stats', pl: '-HP' },
        { t: isEs ? 'Biblioteca de Cenizas' : 'Library of Ashes', d: isEs ? 'Libros que arden sin consumirse. Conocimiento prohibido al alcance.' : 'Books that burn without being consumed. Forbidden knowledge within reach.', s: 'erudition', rw: '+Stats', pl: '-HP' },
        { t: isEs ? 'El Pozo de Sapiencia' : 'The Well of Sapience', d: isEs ? 'Un pozo cristalino que refleja el cosmos.' : 'A crystalline well reflecting the cosmos.', s: 'erudition', rw: '+Stats', pl: '-HP' }
      ];

      // Weight towards primary stat
      const weightedPool = pool.flatMap(ev => ev.s === primaryStat ? [ev, ev] : [ev]);
      const ev = weightedPool[Math.floor(Math.random() * weightedPool.length)];

      const isStatReward = ev.rw === '+Stats';
      const isRelicReward = ev.rw === '+Relic' || ev.rw === '+Relics';

      return {
        id: 'rand_' + Math.random(),
        title: ev.t,
        description: ev.d,
        type: 'choice',
        options: [
          {
            text: isEs ? 'Enfrentar' : 'Confront',
            requirement: { stat: ev.s as any, value: Math.max(5, 4 + curr.generation + (curr.prestigeLevel)) },
            onSuccess: (p) => {
              let reward = { ...p, gold: p.gold + 150 + (p.generation * 50) };
              if (isStatReward) {
                const s = ev.s as keyof typeof p.stats;
                reward.stats[s] += 2;
              }
              if (isRelicReward) {
                reward.ancientRelics += (ev.rw === '+Relics' ? 3 : 1);
              }
              return { 
                message: isEs ? "¡Has superado el desafío!" : "You have overcome the challenge!", 
                reward 
              };
            },
            onFailure: (p) => {
              const damage = 25 + (p.generation * 5) + (p.prestigeLevel * 10);
              return { 
                message: isEs ? `¡Has sufrido ${damage} de daño por tus heridas!` : `You have suffered ${damage} damage from your wounds!`, 
                penalty: { ...p, hp: p.hp - damage } 
              };
            },
            difficultyThreshold: Math.max(10, 8 + curr.generation + (curr.prestigeLevel * 2))
          },
          { text: isEs ? 'Huir' : 'Flee', onSuccess: () => ({ message: isEs ? "Escapas por los pelos." : "You escape by the skin of your teeth." }) }
        ]
      };
    };

    setActiveEvent(getEvent());
    if (getEvent().type === 'combat') {
      setCombatClicks(0);
      setCombatTimeLeft(getEvent().timeLimit || 10);
    }
  };

  const resolveEvent = (optionIndex: number, forceFail: boolean = false) => {
    if (!activeEvent || !player) return;

    const option = activeEvent.options[optionIndex];
    const isEs = player.language === 'es';
    let result;

    if (activeEvent.type === 'combat' && !forceFail) {
      // If it's a combat click battle and we reached here, it's a success
      result = option.onSuccess(player);
      setLastResult({
        type: 'success',
        message: result.message,
        rewardDesc: result.reward ? (result.reward.prestigeLevel && result.reward.prestigeLevel > player.prestigeLevel ? (isEs ? "+1 Nivel de Prestigio" : "+1 Prestige Level") : `+1500 Gold`) : undefined
      });
    } else if (forceFail) {
       result = option.onFailure ? option.onFailure(player) : { message: isEs ? "Has sido derrotado." : "You have been defeated." };
       setLastResult({
         type: 'failure',
         message: result.message,
         penaltyDesc: result.penalty ? (isEs ? "Gravemente herido" : "Critically wounded") : undefined
       });
    } else if (option.requirement) {
      const playerStat = player.stats[option.requirement.stat];
      const roll = Math.random() * 20 + playerStat;
      if (roll >= (option.difficultyThreshold || 10)) {
        result = option.onSuccess(player);
        setLastResult({
          type: 'success',
          message: result.message,
          rewardDesc: result.reward ? (result.reward.prestigeLevel && result.reward.prestigeLevel > player.prestigeLevel ? (isEs ? "+1 Nivel de Prestigio" : "+1 Prestige Level") : `+150 Gold`) : undefined
        });
      } else {
        result = option.onFailure ? option.onFailure(player) : { message: isEs ? "No pasó nada." : "Nothing happened." };
        setLastResult({
          type: 'failure',
          message: result.message,
          penaltyDesc: result.penalty ? `-15 HP` : undefined
        });
      }
    } else {
      result = option.onSuccess(player);
      // For transformations or non-dice-roll choice outcomes
      setLastResult({
        type: 'success',
        message: result.message,
        rewardDesc: result.reward ? (result.reward.currentClass !== player.currentClass ? (isEs ? "Clase Cambiada" : "Class Changed") : (isEs ? "Poder Desbloqueado" : "Power Unlocked")) : undefined
      });
    }

    if (result.reward) setPlayer(result.reward as PlayerData);
    if (result.penalty) {
      const penalty = result.penalty as PlayerData;
      if (penalty.hp <= 0) {
        penalty.isAlive = false;
        penalty.hp = 0;
      }
      setPlayer(penalty);
    }
    
    setMessage(result.message);
    setTimeout(() => setMessage(null), 3000);
    setActiveEvent(null);
  };

  const buyHealth = () => {
    setPlayer(current => {
      if (!current) return null;
      const baseCost = 50 * (current.prestigeLevel + 1);
      const cost = Math.floor(baseCost * Math.pow(1.3, current.healthPurchased || 0));
      const canAfford = current.gold >= cost && current.hp < current.maxHp;

      if (canAfford) {
        let newHp = Math.min(current.maxHp, current.hp + (current.maxHp * 0.25));
        let newGold = current.gold - cost;
        let newStats = { ...current.stats };
        let newHistory = [...current.history];

        // Specific consequences
        if (current.currentClass === 'Vampire') {
          // 15% chance of being caught
          if (Math.random() < 0.15) {
            const isEs = current.language === 'es';
            setMessage(isEs ? "¡Te atraparon alimentándote! Una turba te ha debilitado." : "You were caught feeding! A mob has weakened you.");
            newHp = Math.max(1, newHp - 20);
            newHistory.push(isEs ? "Fuiste perseguido por una turba tras alimentarte." : "You were hunted by a mob after feeding.");
          }
        }

        if (current.currentClass === 'Werewolf') {
          // Eating someone might actually give a strength boost occasionally?
          if (Math.random() < 0.1) {
            newStats.strength += 1;
            const isEs = current.language === 'es';
            setMessage(isEs ? "¡La carne fresca te ha dado vigor bárbaro!" : "Fresh meat has given you barbaric vigor!");
          }
        }

        return {
          ...current,
          gold: newGold,
          hp: newHp,
          stats: newStats,
          history: newHistory,
          healthPurchased: (current.healthPurchased || 0) + 1
        };
      }
      return current;
    });
  };

  const markIntroAsSeen = () => {
    setPlayer(current => current ? { ...current, hasSeenIntro: true } : null);
  };

  const closeResult = () => setLastResult(null);

  const buyUpgrade = (upgradeId: string) => {
    setPlayer(current => {
      if (!current) return null;

      // Handle Stat Upgrades (Tomos)
      if (upgradeId.startsWith('tome_')) {
        const stat = upgradeId.replace('tome_', '') as keyof typeof current.stats;
        const currentVal = current.stats[stat];
        const cost = Math.floor(500 * Math.pow(1.5, currentVal - 1));
        if (current.gold >= cost) {
          const newStats = { ...current.stats, [stat]: currentVal + 1 };
          return { ...current, gold: current.gold - cost, stats: newStats };
        }
        return current;
      }

      const upgrade = INITIAL_UPGRADES.find(u => u.id === upgradeId);
      if (!upgrade) return current;

      const currentLevel = current.upgrades[upgradeId] || 0;
      const cost = Math.floor(upgrade.baseCost * Math.pow(1.15, currentLevel));

      if (current.gold >= cost) {
        const newUpgrades = { ...current.upgrades, [upgradeId]: currentLevel + 1 };
        let newMaxHp = current.maxHp;
        let newHp = current.hp;

        if (upgrade.type === 'armor') {
          newMaxHp += upgrade.perLevelGain;
          newHp += upgrade.perLevelGain; // Heal by the same amount to maintain health
        }

        return { 
          ...current, 
          gold: current.gold - cost, 
          upgrades: newUpgrades,
          maxHp: newMaxHp,
          hp: newHp
        };
      }
      return current;
    });
  };

  const succumbToDeath = () => {
    setPlayer(current => {
      if (!current) return null;
      return { ...current, isAlive: false, deathCause: 'Fallen in service of the lineage.' };
    });
  };

  const succeedLineage = (newName: string, newClass: CharacterClass) => {
    setPlayer(current => {
      if (!current) return null;
      const inheritedRelics = current.inventory.filter(i => i.rarity === 'primordial');
      const base = getInitialPlayer(newName, newClass, false);
      
      const isEs = current.language === 'es';
      const prologueKey = newClass.toLowerCase() as 'warrior' | 'mage' | 'priest' | 'paladin' | 'vampire' | 'werewolf';
      const tStories = (isEs ? translations.es.stories : translations.en.stories) as any;
      const prologue = tStories[prologueKey]?.prologue || tStories.warrior.prologue;

      const prestigeList = (isEs ? translations.es.prestige : translations.en.prestige) as any;
      const currentClassKey = current.currentClass;
      const rank = prestigeList[currentClassKey]?.[Math.min(current.prestigeLevel, 6)] || "Hero";

      const newVaultEntry: any = {
        name: current.name,
        class: current.currentClass,
        gen: current.generation,
        prestige: current.prestigeLevel,
        gender: current.gender
      };

      return {
        ...base,
        generation: current.generation + 1,
        ancientRelics: current.ancientRelics + Math.floor(current.gold / 1000), 
        inventory: inheritedRelics,
        language: current.language,
        history: [prologue],
        lineageVault: [newVaultEntry, ...(current.lineageVault || [])],
        ancestorLegacy: {
          name: current.name,
          rank: rank,
          class: current.currentClass,
          gen: current.generation
        },
        stats: {
          strength: base.stats.strength + (current.currentClass === 'Warrior' ? 1 : 0),
          erudition: base.stats.erudition + (current.currentClass === 'Mage' ? 1 : 0),
          faith: base.stats.faith + (current.currentClass === 'Priest' ? 1 : 0),
        }
      };
    });
  };

  const setName = (name: string, charClass?: CharacterClass, gender?: 'male' | 'female') => {
    setPlayer(current => {
      if (!current) return null;
      
      const finalClass = charClass || current.currentClass;
      const isEs = current.language === 'es';
      const prologueKey = finalClass.toLowerCase() as 'warrior' | 'mage' | 'priest' | 'paladin' | 'vampire' | 'werewolf';
      const tStories = (isEs ? translations.es.stories : translations.en.stories) as any;
      const prologue = tStories[prologueKey]?.prologue || tStories.warrior.prologue;

      return { 
        ...current, 
        name, 
        currentClass: finalClass,
        gender: gender || current.gender,
        history: [prologue]
      };
    });
  };

  const hardReset = () => {
    localStorage.removeItem(SAVE_KEY);
    window.location.reload(); // Hard reload for clean state
  };

  const changeLanguage = (lang: 'en' | 'es') => {
    setPlayer(current => current ? { ...current, language: lang } : null);
  };

  return {
    player,
    activeEvent,
    combatClicks,
    combatTimeLeft,
    message,
    setMessage,
    lastResult,
    clickPopups,
    handleManualClick,
    handleCombatClick,
    resolveEvent,
    closeResult,
    buyUpgrade,
    buyHealth,
    markIntroAsSeen,
    succumbToDeath,
    succeedLineage,
    changeLanguage,
    setName,
    hardReset
  };
}
