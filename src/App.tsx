import React from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Coins, Skull, Shield, Zap, Book, Hammer, Sword, Crown, Scroll, Menu, Languages, 
  Sparkles, Eye, Settings, X, RefreshCw, BookOpen, Ghost, Heart, Flame, Moon, Sun, 
  Axe, PawPrint, Castle, Landmark, Trophy, Gem, Wand2, Hand, Bell, Church, 
  Infinity, Droplets, Users, Mountain, ShieldCheck, Star, User, UserRound, Wind, Cross,
  Swords, ShieldAlert, BadgeCheck, Medal, Clapperboard, Compass, Construction, Bot
} from 'lucide-react';
import { INITIAL_UPGRADES, PRESTIGE_NAMES, BASE_CLASSES } from './constants';
import { TRANSLATIONS } from './translations';
import { cn } from './lib/utils';
import { CharacterClass } from './types';

const RankIcon = ({ charClass, prestige, gender, size = 28, className = "" }: { charClass: CharacterClass, prestige: number, gender: 'male' | 'female', size?: number, className?: string }) => {
  const iconMap: Record<string, any[]> = {
    Warrior: [Shield, Sword, User, Castle, Landmark, Trophy, Crown],
    Mage: [Sparkles, Scroll, Wand2, BookOpen, Hand, Sun, Infinity],
    Priest: [Bell, Cross, Heart, Church, Star, Sun, Infinity],
    Vampire: [Droplets, Axe, Gem, Castle, Crown, Skull, Moon],
    Werewolf: [Wind, PawPrint, Zap, Axe, Users, Mountain, Skull],
    Paladin: [ShieldCheck, Swords, Hammer, Star, Sun, Zap, Star]
  };

  // Thematic overrides based on rank titles
  // Warrior: Squire (0), Knight (1), Lord (2), Count (3), Duke (4), King (5), Emperor (6)
  if (charClass === 'Warrior') {
    if (prestige === 0) return <Shield size={size} className={cn("text-[#c5a059]", className)} />;
    if (prestige === 1) return <Sword size={size} className={cn("text-[#c5a059]", className)} />; 
    if (prestige === 2) {
      return gender === 'male' ? <User size={size} className={cn("text-[#c5a059]", className)} /> : <UserRound size={size} className={cn("text-[#c5a059]", className)} />;
    }
  }

  // Mage: Apprentice, Initiate, Sorcerer, Archmage, Hand, Avatar, Eternal
  if (charClass === 'Mage') {
    if (prestige === 4) return <Hand size={size} className={cn("text-[#c5a059]", className)} />;
    if (prestige === 5) return <Zap size={size} className={cn("text-[#c5a059]", className)} />;
  }

  const IconComponent = iconMap[charClass]?.[Math.min(prestige, 10)] || Crown;
  return <IconComponent size={size} className={cn("text-[#c5a059]", className)} />;
};

export default function App() {
  const { 
    player, handleManualClick, message, setMessage, 
    activeEvent, resolveEvent, buyUpgrade, buyHealth, 
    markIntroAsSeen, succeedLineage, clickPopups, 
    changeLanguage, setName, hardReset, lastResult, 
    closeResult, handleCombatClick, combatClicks, combatTimeLeft 
  } = useGameEngine();
  const [activeTab, setActiveTab] = React.useState<'main' | 'upgrades' | 'inventory' | 'heritage'>('main');
  const [showSuccession, setShowSuccession] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);
  const [newName, setNewName] = React.useState('');
  const [selectedClass, setSelectedClass] = React.useState<CharacterClass>('Warrior');
  const [selectedGender, setSelectedGender] = React.useState<'male' | 'female'>('male');
  const [showStats, setShowStats] = React.useState(false);
  const [showProgress, setShowProgress] = React.useState(false);

  if (!player) return <div className="bg-black h-screen flex items-center justify-center text-red-900 font-serif">Loading Destiny...</div>;

  const t = TRANSLATIONS[player.language || 'es'] || TRANSLATIONS.es;
  const prestigeList = (t.prestige as any)[player.currentClass] || (t.prestige as any).Warrior;
  const currentTitle = player.isAlive ? (prestigeList[Math.min(player.prestigeLevel, prestigeList.length - 1)]) : t.dead;
  const themeColor = player.isAlive ? BASE_CLASSES[player.currentClass].color : '#555';

  // Initial Naming & Class Selection Screen
  if (!player.name && player.isAlive) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4 sm:p-8 text-center vignette overflow-y-auto relative font-serif">
        {/* Background Texture Overlay */}
        <div className="absolute inset-0 opacity-40 pointer-events-none z-0" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/dust.png')" }} />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full space-y-6 sm:space-y-8 dd-panel p-6 sm:p-10 z-10 relative bg-black/95 backdrop-blur-xl border-t-4 border-[#c5a059]"
        >
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-4xl font-black text-[#c5a059] uppercase tracking-[0.2em] sm:tracking-[0.3em] font-display italic drop-shadow-[0_0_25px_rgba(197,160,89,0.3)]">
              {t.enterName}
            </h2>
            <div className="h-1 w-20 sm:w-24 bg-red-900 mx-auto" />
            <input 
              type="text" 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)}
              placeholder={t.namePlaceholder}
              autoFocus
              className="w-full bg-black/90 border-2 border-[#3d3d3d] p-4 sm:p-5 text-center text-lg sm:text-2xl font-black text-[#d2c1a8] focus:border-[#c5a059] outline-none transition-all uppercase tracking-[0.2em] italic shadow-[inset_0_0_30px_rgba(0,0,0,0.9)]"
            />
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-[10px] sm:text-[11px] font-black text-[#c5a059] uppercase tracking-[0.2em] sm:tracking-[0.3em] border-b border-slate-900/50 pb-2 font-display">{t.gender.choose}</h3>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {(['male', 'female'] as const).map(g => (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g)}
                  className={cn(
                    "dd-button py-3 sm:py-4",
                    selectedGender === g ? "border-[#c5a059] bg-red-950/20 text-[#c5a059]" : "text-[#4a4a4a]"
                  )}
                >
                   {t.gender[g]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-[10px] sm:text-[11px] font-black text-[#c5a059] uppercase tracking-[0.2em] sm:tracking-[0.3em] border-b border-slate-900/50 pb-2 font-display">{t.chooseStartClass}</h3>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {(['Warrior', 'Mage', 'Priest'] as CharacterClass[]).map(cls => (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={cn(
                    "dd-button p-3 sm:p-5 flex flex-col items-center gap-2 sm:gap-3 transition-all",
                    selectedClass === cls ? "border-[#c5a059] bg-red-950/20 text-[#c5a059] scale-105 sm:scale-110 z-10" : "text-[#4a4a4a]"
                  )}
                >
                  <RankIcon charClass={cls} prestige={0} gender={selectedGender} size={20} />
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest">{t.classes[cls]}</span>
                </button>
              ))}
            </div>
          </div>

          <button 
            disabled={!newName.trim()}
            onClick={() => {
              setName(newName.trim(), selectedClass, selectedGender);
              setNewName('');
            }}
            className="w-full py-3 sm:py-4 dd-button text-red-600 hover:text-red-400 disabled:opacity-30 disabled:grayscale transition-all shadow-[0_0_20px_rgba(220,38,38,0.2)] bg-red-900/5 mt-2 sm:mt-4"
          >
            {t.startJourney}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen font-serif overflow-hidden select-none vignette relative" style={{ '--theme-color': themeColor } as any}>
      {/* Background Texture Overlay */}
      <div className="absolute inset-0 opacity-40 pointer-events-none z-0" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/dust.png')" }} />
      {/* Top Header */}
      <div className="bg-black/95 border-b-2 border-[#3d3d3d] p-3 sm:p-5 flex justify-between items-center z-20 shadow-[0_10px_30px_rgba(0,0,0,0.9)] gap-4">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="hidden sm:flex p-3 border-2 border-[#c5a059]/30 bg-[#c5a059]/5 rounded-sm shrink-0 shadow-[0_0_15px_rgba(197,160,89,0.1)]">
             <RankIcon charClass={player.currentClass} prestige={player.prestigeLevel} gender={player.gender} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.3em] text-red-700 font-black drop-shadow-[0_0_5px_rgba(0,0,0,1)] truncate">
              {t.generation} {player.generation}
            </span>
          <h1 className="text-lg sm:text-3xl font-black text-[#d2c1a8] tracking-widest uppercase italic font-display truncate">
            {player.name || t.firstAncestor}
          </h1>
          <span className="text-[10px] sm:text-sm text-[#c5a059] font-black tracking-[0.2em] uppercase truncate">
            {currentTitle}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="flex items-center gap-1 sm:gap-2">
            <button 
              onClick={() => setShowProgress(true)}
              className="p-1.5 sm:p-2 border border-slate-800 hover:border-[#c5a059]/50 rounded-sm text-slate-500 hover:text-[#c5a059] transition-all"
            >
              <Scroll size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
            <button 
              onClick={() => setShowStats(!showStats)}
              className={cn(
                "p-1.5 sm:p-2 border border-slate-800 hover:border-red-900/50 rounded-sm transition-all",
                showStats ? "text-red-500 bg-red-900/10" : "text-slate-500 hover:text-red-500"
              )}
            >
              <Book size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="p-1.5 sm:p-2 border border-slate-800 hover:border-red-900/50 rounded-sm text-slate-500 hover:text-red-500 transition-all font-bold"
            >
              <Settings size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>
             <div className="flex flex-col items-end min-w-[80px] sm:min-w-[120px]">
               <div className="flex items-center gap-1 text-amber-500 font-black drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]">
                 <Coins size={14} className="sm:w-[18px] sm:h-[18px]" />
                 <span className="text-base sm:text-xl">{Math.floor(player.gold).toLocaleString()}</span>
               </div>
               <div className="flex flex-col gap-1 w-full">
                 <div className="flex items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1">
                   <span className="text-[10px] sm:text-[12px] font-black text-red-600 italic drop-shadow-[0_0_3px_rgba(220,38,38,0.4)]">PS</span>
                   <div className="w-16 sm:w-36 h-2 sm:h-3 bg-slate-950 rounded-none overflow-hidden border border-slate-800 relative shadow-inner">
                     <div className="h-full bg-gradient-to-r from-red-900 to-red-600 transition-all duration-300 relative z-10" style={{ width: `${(player.hp / player.maxHp) * 100}%` }}>
                        <div className="absolute inset-0 bg-white/10 animate-pulse" />
                     </div>
                   </div>
                 </div>
                 {/* Prestige Progress Bar */}
                 <div className="flex items-center gap-1 sm:gap-2">
                   <span className="text-[10px] sm:text-[12px] font-black text-amber-600 italic">PR</span>
                   <div className="w-16 sm:w-36 h-1 sm:h-1.5 bg-slate-950 rounded-none overflow-hidden border border-slate-900/50 relative">
                     <div 
                       className="h-full bg-amber-500/80 transition-all duration-500" 
                       style={{ 
                         width: `${Math.min(100, ((player.stats.strength + player.stats.erudition + player.stats.faith) / ((player.prestigeLevel + 1) * 30)) * 100)}%` 
                       }} 
                     />
                   </div>
                 </div>
                 {/* Event Progress Bar */}
                 <div className="flex items-center gap-1 sm:gap-2">
                    <span className={cn(
                      "text-[10px] sm:text-[12px] font-black italic transition-colors",
                      player.clicksToEvent >= 90 ? "text-yellow-500 animate-pulse" : "text-slate-600"
                    )}>EV</span>
                    <div className="w-16 sm:w-36 h-1 sm:h-1.5 bg-slate-950 rounded-none overflow-hidden border border-slate-900/50 relative">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-red-950 via-red-600 to-red-400" 
                        initial={{ width: 0 }}
                        animate={{ width: `${player.clicksToEvent}%` }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                      />
                    </div>
                  </div>
               </div>
             </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'main' && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center p-6"
            >
              {/* Character Background Aura */}
              <div 
                className="absolute w-64 h-64 rounded-full blur-[80px] opacity-20 transition-colors duration-1000" 
                style={{ backgroundColor: themeColor }}
              />

              {/* Character Area */}
              <motion.div 
                className={cn(
                  "relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center cursor-pointer active:scale-95 transition-transform",
                  !player.isAlive && "grayscale opacity-50 sepia-[0.5]"
                )}
                onClick={(e) => handleManualClick(e as any)}
                whileTap={{ scale: 0.98 }}
              >
                {/* Character Portrait Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-black/80 border-[3px] border-double border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] rotate-45 scale-[0.7] transform overflow-hidden">
                   <div className="w-full h-full bg-black/40 -rotate-45 scale-[1.4] transform" />
                </div>

                {/* Character Portrait Container */}
                <div className="relative z-10 flex flex-col items-center">
                    <motion.div 
                     key={`${player.prestigeLevel}-${player.currentClass}-${player.id}`}
                     initial={{ scale: 0.9, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     className="relative"
                   >
                     {/* The Icon evolving with prestige */}
                     <div className="relative group p-0">
                        <div className="absolute inset-0 bg-red-900/10 blur-[60px] group-active:bg-red-600/20 transition-all rounded-full" />
                        
                        <div className="relative flex items-center justify-center w-48 h-48 sm:w-64 sm:h-64">
                          {/* Outer Glow Ring */}
                          <div 
                            className="absolute inset-0 rounded-full border border-white/5 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]"
                            style={{ 
                              boxShadow: `inset 0 0 60px ${themeColor}20, 0 0 20px ${themeColor}10`
                            }}
                          />

                          {/* Dynamic Central Icon */}
                          <div className="relative flex items-center justify-center">
                            {/* Class Specific Background Flourishes */}
                            {player.currentClass === 'Mage' && (
                              <div className="absolute inset-0 animate-pulse">
                                <Sparkles size={160} strokeWidth={0.5} className="text-purple-600/20 absolute -top-20 -right-20" />
                                <Sparkles size={120} strokeWidth={0.5} className="text-indigo-400/10 absolute -bottom-10 -left-10" />
                              </div>
                            )}
                            {player.currentClass === 'Priest' && (
                              <Sun size={140} strokeWidth={0.5} className="text-amber-600/10 absolute animate-spin-slow" />
                            )}
                            {player.currentClass === 'Vampire' && (
                              <Moon size={130} strokeWidth={0.5} className="text-red-900/20 absolute" />
                            )}
                            {player.currentClass === 'Werewolf' && (
                              <Moon size={130} strokeWidth={0.5} className="text-slate-800/30 absolute animate-pulse" />
                            )}
                            {player.currentClass === 'Warrior' && (
                              <div className="absolute inset-0 opacity-10">
                                <Shield size={150} strokeWidth={0.5} className="absolute -rotate-12 -translate-x-10" />
                                <Sword size={150} strokeWidth={0.5} className="absolute rotate-12 translate-x-10" />
                              </div>
                            )}
                            {player.currentClass === 'Paladin' && (
                              <div className="absolute inset-0 opacity-10">
                                <ShieldCheck size={160} strokeWidth={0.5} />
                              </div>
                            )}

                            {/* Main Character/Rank Icon */}
                            <RankIcon 
                              charClass={player.currentClass} 
                              prestige={player.prestigeLevel} 
                              gender={player.gender} 
                              size={100} 
                              className="relative drop-shadow-[0_0_20px_rgba(197,160,89,0.3)] filter brightness-110"
                            />
                          </div>

                          {/* Extra Prestige Flair */}
                          {player.prestigeLevel > 2 && (
                            <motion.div 
                              animate={{ rotate: 360 }}
                              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                              className="absolute inset-0 border border-dashed border-white/10 rounded-full"
                            />
                          )}
                        </div>
                     </div>
                   </motion.div>
                </div>

                {/* Prestige Glow Effects */}
                {player.prestigeLevel > 0 && (
                  <div 
                    className="absolute inset-0 opacity-20 border-[2px] rounded-full animate-pulse blur-md"
                    style={{ borderColor: themeColor }}
                  />
                )}
              </motion.div>

              {!player.isAlive && (
                <button 
                  onClick={() => setShowSuccession(true)}
                  className="mt-8 bg-red-950/80 border border-red-600 text-red-200 px-8 py-3 rounded-sm font-bold shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:bg-red-900 transition-all uppercase tracking-[0.3em] text-sm"
                >
                  {t.continueLineage}
                </button>
              )}

              {player.isAlive && (
                <p className="mt-8 text-amber-500/90 text-xs sm:text-sm uppercase font-black tracking-[0.4em] animate-pulse text-center drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                  {t.touchToCarve}
                </p>
              )}

              {/* Health Shop */}
              {player.isAlive && (
                <div className="mt-auto w-full max-w-xs space-y-3">
                  <div className="flex justify-between items-center border-b border-red-900/40 pb-2">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{(t as any).shop.title}</h3>
                    <div className="flex items-center gap-1 text-slate-600 text-[10px] font-bold">
                      <Heart size={10} className="text-red-500" /> {Math.floor(player.hp)} / {player.maxHp}
                    </div>
                  </div>
                  {(() => {
                    const baseCost = 50 * (player.prestigeLevel + 1);
                    const cost = Math.floor(baseCost * Math.pow(1.3, player.healthPurchased || 0));
                    const canAfford = player.gold >= cost && player.hp < player.maxHp;
                    const shopT = (t as any).shop;
                    const classKey = player.currentClass;
                    const healInfo = shopT.classHeals[classKey] || shopT.classHeals.Warrior;

                    return (
                      <button 
                        onClick={buyHealth}
                        disabled={!canAfford}
                        className={cn(
                          "w-full p-4 border flex items-center justify-between transition-all group",
                          canAfford ? "bg-red-950/10 border-red-900/50 hover:bg-red-900 hover:border-red-600" : "bg-black/40 border-slate-900 opacity-40 cursor-not-allowed"
                        )}
                      >
                        <div className="text-left">
                          <div className={cn("text-xs font-black uppercase tracking-widest", canAfford ? "text-red-200" : "text-slate-600")}>
                            {healInfo.name}
                          </div>
                          <div className="text-[9px] text-slate-500 italic lowercase">{healInfo.desc}</div>
                        </div>
                        <div className={cn("text-xs font-black", canAfford ? "text-amber-500" : "text-slate-800")}>
                          {cost.toLocaleString()}
                        </div>
                      </button>
                    );
                  })()}
                </div>
              )}

              {/* Floating Click Numbers */}
              <AnimatePresence>
                {clickPopups.map(p => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 1, y: p.y - 20, x: p.x - 20 }}
                    animate={{ opacity: 0, y: p.y - 100 }}
                    transition={{ duration: 0.8 }}
                    className="fixed pointer-events-none text-amber-500 font-bold text-lg z-[999]"
                    style={{ left: 0, top: 0 }}
                  >
                    {p.val}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {activeTab === 'upgrades' && (
            <motion.div 
              initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}
              className="h-full overflow-y-auto p-4 space-y-6 pb-24 scroll-smooth"
            >
              {/* Stat Training Section */}
              <div className="space-y-4">
                <h2 className="text-sm font-black border-b-2 border-[#c5a059]/30 pb-2 mb-4 flex items-center gap-2 uppercase tracking-[0.2em] text-[#c5a059] italic">
                  <Zap size={18} className="text-[#c5a059]" /> {player.language === 'es' ? 'Entrenamiento' : 'Training'}
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {(['strength', 'erudition', 'faith'] as const).map(stat => {
                    const currentVal = player.stats[stat];
                    const cost = Math.floor(500 * Math.pow(1.5, currentVal - 1));
                    const canAfford = player.gold >= cost;
                    const statName = (t.stats as any)[stat];
                    
                    return (
                      <div key={stat} className={cn(
                        "p-4 border-l-4 rounded-none flex justify-between items-center transition-all bg-black/40",
                        canAfford ? "border-[#c5a059]" : "border-slate-900 opacity-50"
                      )}>
                        <div>
                           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{statName}</div>
                           <div className="text-lg font-black text-white">{currentVal}</div>
                        </div>
                        <button 
                          onClick={() => buyUpgrade(`tome_${stat}`)}
                          disabled={!canAfford}
                          className={cn(
                            "px-4 py-2 dd-button text-[10px] font-black",
                            canAfford ? "text-[#c5a059] border-[#c5a059]" : "text-slate-700 border-slate-900"
                          )}
                        >
                          {cost.toLocaleString()}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>

              <h2 className="text-sm font-black border-b-2 border-red-900/30 pb-2 mb-6 flex items-center gap-2 uppercase tracking-[0.2em] text-red-500 italic">
                <Hammer size={18} className="text-red-700" /> {t.upgrades.title}
              </h2>
              {INITIAL_UPGRADES.map(u => {
                const level = player.upgrades[u.id] || 0;
                const cost = Math.floor(u.baseCost * Math.pow(1.15, level));
                const canAfford = player.gold >= cost;

                const classKey = player.currentClass;
                const upgradeTrans = (t.upgradeTerms as any)[classKey]?.[u.id];
                const name = upgradeTrans?.name || u.name;
                const description = upgradeTrans?.desc || u.description;

                return (
                  <motion.div 
                    key={u.id}
                    whileHover={canAfford ? { x: 5 } : {}}
                    className={cn(
                      "p-4 border-l-4 rounded-none flex justify-between items-center transition-all relative overflow-hidden",
                      canAfford ? "bg-slate-900/30 border-red-700 shadow-[2px_0_10px_rgba(139,0,0,0.1)]" : "bg-black/40 border-slate-900 opacity-40"
                    )}
                  >
                    <div className="flex flex-col z-10">
                      <span className="font-black text-slate-200 uppercase tracking-widest text-xs italic">{name} ({t.upgrades.lvl} {level})</span>
                      <span className="text-[10px] text-slate-600 mt-1 max-w-[200px] leading-tight font-bold italic">"{description}"</span>
                      <span className="text-[9px] mt-2 text-red-500/80 font-black uppercase tracking-tighter">
                        +{u.perLevelGain * (level + 1)} {
                          u.type === 'click' ? t.upgrades.perClick : 
                          u.type === 'armor' ? (player.language === 'es' ? 'PS Máximos' : 'Max HP') :
                          t.upgrades.perSec
                        }
                      </span>
                    </div>
                    <button 
                      onClick={() => buyUpgrade(u.id)}
                      disabled={!canAfford}
                      className={cn(
                        "ml-4 px-4 py-3 rounded-none text-[10px] font-black transition-all uppercase tracking-widest z-10 border-2",
                        canAfford ? "bg-red-950/20 border-red-700 text-red-200 shadow-[0_0_10px_rgba(139,0,0,0.3)]" : "bg-black text-slate-700 border-slate-900"
                      )}
                    >
                      {cost.toLocaleString()}
                    </button>
                    {/* Darker background texture/overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 pointer-events-none" />
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {activeTab === 'inventory' && (
            <motion.div 
               initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}
               className="h-full p-4 overflow-y-auto"
            >
               <h2 className="text-sm font-black border-b-2 border-red-900/30 pb-2 mb-6 flex items-center gap-2 uppercase tracking-[0.2em] text-red-500">
                <Shield size={18} className="text-red-700" /> {t.inventory.title}
              </h2>
              {player.inventory.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-slate-700 italic">
                  <Scroll size={48} className="opacity-10 mb-4" />
                  <span className="text-xs uppercase tracking-widest font-black opacity-30">{t.inventory.noItems}</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {player.inventory.map((item, idx) => (
                    <div key={idx} className="p-4 bg-slate-950/50 border border-red-900/30 rounded-none border-l-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-black text-white uppercase italic text-xs tracking-wider">{item.name}</span>
                        <span className="text-[8px] uppercase text-red-500 font-black border border-red-900/50 px-1">{item.rarity}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 italic mt-1 leading-tight">"{item.description}"</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'heritage' && (
             <motion.div 
              initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}
              className="h-full p-4 space-y-6 overflow-y-auto pb-24"
            >
               <h2 className="text-sm font-black border-b-2 border-red-900/30 pb-2 mb-6 flex items-center gap-2 uppercase tracking-[0.2em] text-red-500">
                <Crown size={18} className="text-red-700" /> {t.heritage.title}
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="dd-panel p-4 text-center">
                   <span className="text-[10px] text-slate-500 uppercase font-black">{t.stats.generation}</span>
                   <div className="text-2xl font-black text-white">{player.generation}</div>
                </div>
                <div className="dd-panel p-4 text-center">
                   <span className="text-[10px] text-slate-500 uppercase font-black">Prestigio</span>
                   <div className="text-2xl font-black text-amber-500">{player.prestigeLevel}</div>
                </div>
              </div>

              <div className="dd-panel p-6 bg-gradient-to-br from-red-950/20 to-black border-red-900/30">
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={18} className="text-amber-500" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-amber-500">
                    {player.language === 'es' ? 'Objetivo Legendario' : 'Legendary Goal'}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 italic mb-4 leading-relaxed">
                  {player.language === 'es' 
                    ? 'Alcanza el Nivel de Prestigio 10 para enfrentar el Juicio Final y trascender la mortalidad.' 
                    : 'Reach Prestige Level 10 to face the Final Reckoning and transcend mortality.'
                  }
                </p>
                <div className="h-2 bg-black/50 border border-red-950 overflow-hidden">
                   <motion.div 
                     className="h-full bg-amber-600"
                     animate={{ width: `${Math.min(100, (player.prestigeLevel / 10) * 100)}%` }}
                   />
                </div>
                <div className="flex justify-between mt-1">
                   <span className="text-[9px] text-slate-600 uppercase font-black">
                     {player.language === 'es' ? 'Progreso' : 'Progress'}
                   </span>
                   <span className="text-[9px] text-amber-500 font-black">{player.prestigeLevel} / 10</span>
                </div>
              </div>

              <div className="dd-panel p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-900/50 pb-2">
                  <Skull size={18} className="text-red-700" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-red-500 font-display italic">Cripta de las Almas</h3>
                </div>
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {(!player.lineageVault || player.lineageVault.length === 0) ? (
                    <div className="text-center py-8 space-y-3">
                      <Ghost size={32} className="mx-auto text-slate-800" />
                      <p className="text-[10px] text-slate-600 italic uppercase tracking-widest ">No hay registros de ancestros aún...</p>
                    </div>
                  ) : (
                    player.lineageVault.map((anc, i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={`${anc.name}-${anc.gen}-${i}`} 
                        className="bg-black/40 border border-slate-900 p-4 flex justify-between items-center group hover:border-[#c5a059]/40 transition-all shadow-inner"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 border border-[#c5a059]/30 bg-[#c5a059]/5 rounded-sm shrink-0">
                             <RankIcon charClass={anc.class as CharacterClass} prestige={anc.prestige} gender={anc.gender || 'male'} size={18} />
                          </div>
                          <div>
                            <div className="text-sm font-black text-slate-200 uppercase italic font-display group-hover:text-[#c5a059] transition-colors">{anc.name}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 flex items-center gap-2">
                               <span className="text-red-900 font-bold">Gen {anc.gen}</span>
                               <span className="w-1 h-1 rounded-full bg-slate-800" />
                               <span>{(t.classes as any)[anc.class] || anc.class}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <div className="text-xs font-black text-[#c5a059] flex items-center gap-1">
                            <Crown size={12} /> PR {anc.prestige}
                          </div>
                          <div className="text-[9px] text-slate-700 uppercase font-black mt-1">Ancestror</div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              <div className="dd-panel p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-900/50 pb-2">
                  <BookOpen size={18} className="text-[#c5a059]" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-[#c5a059] font-display italic">{(t as any).chronicle}</h3>
                </div>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {player.history.map((entry, i) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      transition={{ delay: i * 0.05 }}
                      key={i} 
                      className="relative pl-4 border-l-2 border-red-900/30 py-2"
                    >
                      <div className="absolute -left-[5px] top-4 w-2 h-2 rounded-full bg-red-900 shadow-[0_0_5px_rgba(153,27,27,0.5)]" />
                      <p className="text-xs text-slate-400 italic leading-relaxed">"{entry}"</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="bg-red-950/20 border border-red-900/30 p-6 rounded-none mb-8 relative group overflow-hidden">
                <div className="relative z-10">
                  <span className="text-[10px] uppercase text-red-400 font-black tracking-widest block mb-2">{t.heritage.relics}</span>
                  <div className="text-4xl font-black flex items-center gap-3 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] uppercase">
                    <Sparkles className="text-red-500 animate-pulse" /> {player.ancientRelics}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-4 leading-relaxed font-bold italic">{t.heritage.relicsDesc}</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/5 to-transparent pointer-events-none" />
              </div>

              <button 
                onClick={() => setShowSuccession(true)}
                disabled={player.prestigeLevel < 1 && player.isAlive}
                className="dd-button w-full py-4 text-red-600 disabled:opacity-20 transition-all flex items-center justify-center gap-2"
              >
                <Crown size={20} />
                {t.succession.title}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Feedback Notifications */}
        <AnimatePresence>
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              onClick={() => setMessage(null)}
              className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/90 border border-red-600/50 px-6 py-2 rounded-full text-sm text-red-200 shadow-2xl z-50 whitespace-nowrap cursor-pointer hover:bg-red-900/40 transition-colors flex items-center gap-2"
            >
              <Zap size={14} className="text-red-500 animate-pulse" />
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Event Modal Overlay */}
        <AnimatePresence>
          {activeEvent && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className={cn(
                "absolute inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm transition-colors duration-1000",
                activeEvent.type === 'combat' ? "bg-red-950/40" : "bg-black/90"
              )}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} 
                animate={{ scale: 1, y: 0 }} 
                className={cn(
                  "bg-[#121214] border-2 p-8 rounded-sm max-w-md w-full relative overflow-hidden transition-all duration-500",
                  activeEvent.type === 'combat' ? "border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.3)] animate-pulse-slow" : "border-slate-800"
                )}
              >
                {/* Decorative Elements */}
                <div className={cn(
                  "absolute top-0 left-0 w-2 h-full opacity-50",
                  activeEvent.type === 'combat' ? "bg-red-600" : "bg-slate-700"
                )} />
                <div className={cn(
                  "absolute top-0 right-0 w-2 h-full opacity-50",
                  activeEvent.type === 'combat' ? "bg-red-600" : "bg-slate-700"
                )} />
                
                <div className="flex items-center gap-3 mb-4">
                  {activeEvent.type === 'combat' ? (
                    <Skull size={24} className="text-red-500" />
                  ) : (
                    <Scroll size={24} className="text-amber-500" />
                  )}
                  <h3 className={cn(
                    "text-xl font-bold tracking-wide uppercase italic border-b pb-2 flex-1",
                    activeEvent.type === 'combat' ? "text-red-500 border-red-900/50" : "text-white border-slate-800"
                  )}>
                    {activeEvent?.title}
                  </h3>
                </div>
                
                <p className="text-slate-400 text-sm italic mb-8 leading-relaxed">"{activeEvent?.description}"</p>
                
                <div className="space-y-4">
                  {activeEvent.targetClicks ? (
                    <div className="relative group">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] font-black uppercase text-red-600 tracking-[0.2em]">Combat Progress</span>
                        <span className="text-xl font-black italic text-red-500">{combatClicks} / {activeEvent.targetClicks}</span>
                      </div>
                      
                      <div className="h-4 bg-slate-950 border border-red-900/50 rounded-none overflow-hidden mb-8 relative">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-red-950 via-red-600 to-red-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${(combatClicks / activeEvent.targetClicks) * 100}%` }}
                        />
                        {/* Pulse effect when low on time */}
                        {combatTimeLeft < 3 && (
                          <motion.div 
                            className="absolute inset-0 bg-red-500/20"
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.5 }}
                          />
                        )}
                      </div>

                      <div className="flex justify-between items-center mb-6">
                         <div className="flex flex-col">
                           <span className="text-[10px] text-slate-500 uppercase tracking-widest leading-none">Time Left</span>
                           <span className={cn(
                             "text-2xl font-black italic tabular-nums leading-none",
                             combatTimeLeft < 3 ? "text-red-500 animate-pulse" : "text-white"
                           )}>
                             {combatTimeLeft.toFixed(1)}s
                           </span>
                         </div>
                         <div className="flex gap-1">
                           {[...Array(3)].map((_, i) => (
                             <div key={i} className="w-1 h-3 bg-red-900/30" />
                           ))}
                         </div>
                      </div>

                      <button 
                        onClick={handleCombatClick}
                        className="w-full aspect-square sm:aspect-video bg-red-950/20 border-4 border-red-900/50 hover:border-red-500 hover:bg-red-900/10 transition-all flex flex-col items-center justify-center group relative active:scale-95"
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.1),transparent)] group-hover:opacity-100 opacity-0 transition-opacity" />
                        <Sword size={48} className="text-red-600 group-hover:text-red-400 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-black uppercase tracking-[0.3em] text-red-500 group-hover:text-red-200">Strike!</span>
                        
                        {/* Decorative corners */}
                        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-red-900" />
                        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-red-900" />
                        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-red-900" />
                        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-red-900" />
                      </button>
                    </div>
                  ) : (
                    activeEvent?.options.map((opt, i) => (
                      <button 
                        key={i}
                        onClick={() => resolveEvent(i)}
                        className={cn(
                          "w-full p-4 border transition-all text-left flex flex-col group relative overflow-hidden",
                          activeEvent.type === 'combat' 
                            ? "hover:border-red-400 hover:bg-red-900/40 bg-red-950/20 border-red-900/50" 
                            : "hover:border-red-600 hover:bg-red-950/20 bg-black/40 border-slate-800"
                        )}
                      >
                        <span className="text-slate-200 font-bold group-hover:text-white relative z-10">{opt.text}</span>
                        {opt.requirement && (
                           <span className="text-[10px] text-slate-500 uppercase tracking-tighter flex items-center gap-1 mt-1 relative z-10">
                             <Sword size={10} /> {(t as any).events.requires} {opt.requirement.stat} {opt.requirement.value}+
                           </span>
                        )}
                        
                        {/* Combat button flash effect */}
                        {activeEvent.type === 'combat' && (
                          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Overlay */}
        <AnimatePresence>
          {showStats && (
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
               className="fixed inset-4 sm:absolute sm:left-4 sm:top-24 sm:bottom-28 sm:w-72 sm:inset-auto dd-panel z-[400] p-6 flex flex-col pointer-events-auto shadow-[0_20px_50px_rgba(0,0,0,1)] bg-black/95 backdrop-blur-md"
            >
               <div className="flex justify-between items-center mb-6 border-b-2 border-red-900/30 pb-2">
                 <h2 className="text-sm font-black text-red-500 uppercase tracking-widest italic">{t.stats.title}</h2>
                 <button onClick={() => setShowStats(false)} className="text-slate-600 hover:text-white p-2"><X size={20} /></button>
               </div>
               
               <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                  <div className="bg-black/40 p-4 border-l-2 border-red-700">
                    <span className="text-[10px] uppercase text-slate-500 block mb-1 font-black tracking-widest">{t.stats.strength}</span>
                    <span className="text-2xl font-black text-slate-200">{player.stats.strength}</span>
                  </div>
                  <div className="bg-black/40 p-4 border-l-2 border-purple-700">
                    <span className="text-[10px] uppercase text-slate-500 block mb-1 font-black tracking-widest">{t.stats.erudition}</span>
                    <span className="text-2xl font-black text-slate-200">{player.stats.erudition}</span>
                  </div>
                  <div className="bg-black/40 p-4 border-l-2 border-amber-500">
                    <span className="text-[10px] uppercase text-slate-500 block mb-1 font-black tracking-widest">{t.stats.faith}</span>
                    <span className="text-2xl font-black text-slate-200">{player.stats.faith}</span>
                  </div>
                  <div className="bg-black/40 p-4 border-l-2 border-slate-500">
                    <span className="text-[10px] uppercase text-slate-500 block mb-1 font-black tracking-widest">{t.stats.hpMax}</span>
                    <span className="text-2xl font-black text-slate-200">{player.maxHp}</span>
                  </div>
               </div>

               <div className="mt-6 pt-6 opacity-30 text-center border-t border-slate-900">
                 <p className="text-[9px] uppercase font-black tracking-tighter text-slate-600 leading-tight">
                    {t.stats.burden} <br/>
                    {player.language === 'es' ? 'Cada cicatriz es una historia.' : 'Every scar is a story.'}
                  </p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Character Progress Modal */}
        <AnimatePresence>
          {showProgress && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 z-[500] flex items-center justify-center p-6 backdrop-blur-xl"
              onClick={() => setShowProgress(false)}
            >
              <div 
                className="dd-panel p-8 max-w-md w-full space-y-8 relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute top-0 right-0 p-4">
                  <button onClick={() => setShowProgress(false)} className="text-slate-600 hover:text-white"><X size={24} /></button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-[#c5a059] uppercase tracking-[0.3em] font-display italic">
                    {player.language === 'es' ? 'Camino al Poder' : 'Road to Power'}
                  </h3>
                  <div className="h-1 w-20 bg-red-900" />
                </div>

                <div className="space-y-6">
                  {/* Next Title */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {player.language === 'es' ? 'Siguiente Rango' : 'Next Rank'}
                      </span>
                      <span className="text-sm font-black text-amber-500 uppercase italic">
                        {prestigeList[Math.min(player.prestigeLevel + 1, prestigeList.length - 1)]}
                      </span>
                    </div>
                    
                    {/* Progress Bar Rendering */}
                    {(() => {
                      const totalStats = player.stats.strength + player.stats.erudition + player.stats.faith;
                      const currentThreshold = player.prestigeLevel * 30;
                      const nextThreshold = (player.prestigeLevel + 1) * 30;
                      const progress = ((totalStats - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
                      
                      return (
                        <div className="space-y-2">
                          <div className="h-4 bg-slate-950 border border-slate-900 relative">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                              className="h-full bg-gradient-to-r from-amber-900 to-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-[9px] font-black text-white mix-blend-difference">
                                {totalStats} / {nextThreshold} STATS
                              </span>
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-500 italic text-right">
                            {player.language === 'es' 
                              ? `Faltan ${nextThreshold - totalStats} puntos de habilidad para el siguiente hito.` 
                              : `${nextThreshold - totalStats} skill points remaining for the next milestone.`}
                          </p>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Milestones List */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest border-b border-slate-900/50 pb-1">
                      {player.language === 'es' ? 'Hitos de Linaje' : 'Lineage Milestones'}
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 opacity-80">
                        <div className="w-5 h-5 rounded-full border border-[#c5a059] flex items-center justify-center shrink-0 mt-0.5">
                          <Crown size={12} className="text-[#c5a059]" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-200">Prestigio de Clase</span>
                          <span className="text-[10px] text-slate-500 italic">
                            {player.language === 'es' 
                              ? 'Mejora tus atributos para ascender en la jerarquía social.' 
                              : 'Improve your attributes to rise in the social hierarchy.'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 opacity-60">
                        <div className="w-5 h-5 rounded-full border border-red-900 flex items-center justify-center shrink-0 mt-0.5">
                          <Skull size={12} className="text-red-900" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-200">Encuentros Legendarios</span>
                          <span className="text-[10px] text-slate-500 italic">
                            {player.language === 'es' 
                              ? 'Derrota a jefes mundiales como el Titán Caído para ganar prestigio instantáneo.' 
                              : 'Defeat world bosses like the Fallen Titan to gain instant prestige.'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 opacity-60">
                        <div className="w-5 h-5 rounded-full border border-purple-900 flex items-center justify-center shrink-0 mt-0.5">
                          <Sparkles size={12} className="text-purple-900" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-200">La Sucesión</span>
                          <span className="text-[10px] text-slate-500 italic">
                            {player.language === 'es' 
                              ? 'Alcanza el nivel 1 de prestigio para desbloquear la sucesión y heredar el poder.' 
                              : 'Reach prestige level 1 to unlock succession and inherit power.'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12">
                   <Crown size={200} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 z-[300] flex items-center justify-center p-6 backdrop-blur-md"
            >
              <div className="bg-[#0f0f12] border-2 border-slate-800 p-8 w-full max-w-sm relative">
                <button 
                  onClick={() => setShowSettings(false)}
                  className="absolute top-4 right-4 text-slate-500 hover:text-white"
                >
                  <X size={24} />
                </button>
                <h2 className="text-xl font-black text-white uppercase tracking-widest mb-8 border-b border-slate-800 pb-2">{t.settings}</h2>
                
                <div className="space-y-6">
                  {/* Language Toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-2">
                      <Languages size={14} /> Language / Idioma
                    </span>
                    <button 
                      onClick={() => changeLanguage(player.language === 'es' ? 'en' : 'es')}
                      className="px-4 py-2 bg-slate-900 border border-slate-700 text-xs font-black uppercase text-white hover:border-red-900"
                    >
                      {player.language === 'es' ? 'Español' : 'English'}
                    </button>
                  </div>

                  {/* Hard Reset */}
                  <div className="pt-8 border-t border-slate-900">
                    <button 
                      onClick={() => setShowResetConfirm(true)}
                      className="w-full p-4 border border-red-900/50 bg-red-950/10 text-red-600 hover:bg-red-900 hover:text-white transition-all flex items-center justify-center gap-2 group"
                    >
                      <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{t.hardReset}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hard Reset Confirmation */}
        <AnimatePresence>
          {showResetConfirm && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/98 z-[400] flex items-center justify-center p-6 backdrop-blur-xl"
            >
              <div className="dd-panel p-8 max-w-sm w-full text-center space-y-6">
                <Skull size={48} className="mx-auto text-red-700 animate-pulse" />
                <h3 className="text-xl font-black text-red-600 uppercase tracking-widest">{t.reset}</h3>
                <p className="text-sm text-slate-400 italic">"{t.confirmReset}"</p>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => {
                      hardReset();
                      setShowResetConfirm(false);
                      setShowSettings(false);
                    }}
                    className="dd-button bg-red-900/20 border-red-700 text-red-500 hover:bg-red-700 hover:text-white"
                  >
                    {t.reset}
                  </button>
                  <button 
                    onClick={() => setShowResetConfirm(false)}
                    className="dd-button"
                  >
                    {t.cancel}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Succession Modal */}
        <AnimatePresence>
          {showSuccession && (
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-black z-[200] flex flex-col items-center justify-center p-8 text-center overflow-y-auto"
            >
               {/* Gritty overlay */}
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 pointer-events-none" />
               
               <h2 className="text-3xl sm:text-4xl font-black text-red-700 mb-2 uppercase tracking-[0.3em] italic drop-shadow-[0_0_20px_rgba(185,28,28,0.5)] leading-tight">
                 {t.kingIsDead}
               </h2>
               <p className="text-slate-600 mb-8 uppercase tracking-[0.5em] text-[10px] font-black">{t.longLiveKing}</p>
               
               <div className="w-full max-w-sm space-y-6 relative z-10">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">{t.enterName}</span>
                    <input 
                      type="text" 
                      value={newName} 
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder={t.namePlaceholder}
                      className="w-full bg-slate-900/30 border border-slate-800 p-3 text-center text-lg font-bold text-white focus:border-red-900 outline-none transition-all uppercase tracking-widest"
                    />
                  </div>

                  <h3 className="text-red-900 uppercase text-[9px] tracking-[0.4em] font-black mb-4">{t.chooseHeir}</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {(['Warrior', 'Mage', 'Priest', 'Vampire', 'Werewolf', 'Paladin'] as CharacterClass[]).map(cls => (
                      <button 
                        key={cls}
                        disabled={!newName.trim()}
                        onClick={() => {
                          succeedLineage(newName.trim(), cls);
                          setNewName('');
                          setShowSuccession(false);
                        }}
                        className="p-4 border-2 border-slate-900 bg-slate-950/50 hover:bg-red-950/20 hover:border-red-900 transition-all flex items-center justify-between group relative overflow-hidden disabled:opacity-20"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-black/40 border border-white/5 rounded-sm text-slate-400 group-hover:text-red-500 transition-colors">
                            <RankIcon charClass={cls} prestige={player.prestigeLevel + 1} gender={player.gender} size={20} />
                          </div>
                          <div className="text-left">
                            <span className="text-base font-black text-white uppercase tracking-widest block">{t.classes[cls]}</span>
                            <span className="text-[8px] text-slate-600 uppercase tracking-[0.3em] font-bold group-hover:text-red-500 transition-colors">
                              {t.inheritWill}
                            </span>
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-red-700 group-hover:w-full transition-all duration-500" />
                      </button>
                    ))}
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Event Result Modal */}
        <AnimatePresence>
          {lastResult && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 bg-black/90 z-[600] flex items-center justify-center p-6 backdrop-blur-md"
              onClick={closeResult}
            >
              <div 
                className="dd-panel p-8 max-w-sm w-full text-center space-y-6 border-t-4" 
                style={{ borderColor: lastResult?.type === 'success' ? '#c5a059' : '#8b0000' }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-2">
                  <div className="flex justify-center mb-4">
                    {lastResult?.type === 'success' ? (
                      <Sparkles size={48} className="text-[#c5a059] animate-pulse" />
                    ) : (
                      <Skull size={48} className="text-red-700 animate-bounce" />
                    )}
                  </div>
                  <h3 className={cn(
                    "text-xl font-black uppercase tracking-[0.2em] font-display",
                    lastResult?.type === 'success' ? "text-[#c5a059]" : "text-red-700"
                  )}>
                    {(t as any).results?.success || 'Success'}
                  </h3>
                  <p className="text-slate-300 italic text-sm leading-relaxed">"{lastResult?.message}"</p>
                </div>

                <div className="py-4 border-y border-slate-900/50 space-y-2">
                  {lastResult?.rewardDesc && (
                    <div className="flex items-center justify-center gap-2 text-[#c5a059] font-black uppercase text-xs tracking-widest">
                      <Sparkles size={14} />
                      {(t as any).results?.reward || 'Reward'}: {lastResult?.rewardDesc}
                    </div>
                  )}
                  {lastResult?.penaltyDesc && (
                    <div className="flex items-center justify-center gap-2 text-red-600 font-black uppercase text-xs tracking-widest">
                      <Skull size={14} />
                      {(t as any).results?.penalty || 'Penalty'}: {lastResult?.penaltyDesc}
                    </div>
                  )}
                </div>

                <button 
                  onClick={closeResult}
                  className="dd-button w-full py-4 text-[#c5a059] cursor-pointer hover:bg-white/5 active:scale-95 transition-all"
                >
                  {(t as any).results?.close || 'Continue'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Introductory Modal */}
        <AnimatePresence>
          {!player.hasSeenIntro && player.name && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/99 z-[1000] flex items-center justify-center p-4 backdrop-blur-[40px] overflow-y-auto"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                className="dd-panel p-6 sm:p-10 max-w-lg w-full space-y-8 sm:space-y-10 text-center relative border-t-8 border-amber-600 bg-black border-2 border-slate-900 shadow-[0_0_100px_rgba(0,0,0,1)] my-auto"
              >
                <div className="space-y-4">
                  <h2 className="text-2xl sm:text-4xl font-black text-[#c5a059] uppercase tracking-[0.2em] sm:tracking-[0.3em] italic font-display drop-shadow-[0_0_20px_rgba(197,160,89,0.4)]">
                    {player.ancestorLegacy ? (t as any).intro.successionTitle : (t as any).intro.welcome}
                  </h2>
                  <div className="h-1 sm:h-1.5 w-24 sm:w-32 bg-red-900 mx-auto" />
                </div>
                
                <div className="space-y-6 sm:space-y-8 text-slate-100 italic text-sm sm:text-base leading-relaxed font-medium">
                  {player.ancestorLegacy ? (
                    <p className="drop-shadow-sm">
                      {(t as any).intro.successionDesc
                        .replace('{name}', player.ancestorLegacy.name)
                        .replace('{rank}', player.ancestorLegacy.rank)
                        .replace('{class}', (t.classes as any)[player.ancestorLegacy.class] || player.ancestorLegacy.class)
                        .replace('{gen}', player.generation.toString())
                        .replace('{newClass}', (t.classes as any)[player.currentClass] || player.currentClass)}
                    </p>
                  ) : (
                    <p className="drop-shadow-sm">{(t as any).intro.desc}</p>
                  )}
                  <div className="pt-6 sm:pt-8 border-t border-slate-900/50">
                    <p className="text-[#c5a059] text-[10px] sm:text-[12px] uppercase tracking-[0.4em] not-italic font-black mb-2 opacity-60">
                      {player.language === 'es' ? 'Instrucciones del Linaje' : 'Lineage Instructions'}
                    </p>
                    <p className="text-slate-500 text-xs sm:text-sm italic font-normal">
                      {(t as any).intro.howToPlay}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={markIntroAsSeen}
                  className="w-full py-5 dd-button text-[#c5a059] border-[#c5a059] hover:bg-[#c5a059]/10 text-xl font-display tracking-[0.2em]"
                >
                  {(t as any).intro.ready}
                </button>

                <div className="absolute -top-16 -left-16 opacity-5 rotate-12 pointer-events-none">
                   <Scroll size={300} />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-black border-t-2 border-red-950 grid grid-cols-4 h-24 shadow-[0_-4px_20px_rgba(0,0,0,0.8)] z-30">
        <button 
          onClick={() => setActiveTab('main')}
          className={cn("flex flex-col items-center justify-center gap-1 transition-all h-full relative", activeTab === 'main' ? "text-red-500 scale-110" : "text-slate-700 hover:text-red-900")}
        >
          <Menu size={24} />
          <span className="text-[9px] uppercase font-black tracking-widest mt-1">{t.tabs.camp}</span>
          {activeTab === 'main' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]" />}
        </button>
        <button 
          onClick={() => setActiveTab('upgrades')}
          className={cn("flex flex-col items-center justify-center gap-1 transition-all h-full relative", activeTab === 'upgrades' ? "text-red-500 scale-110" : "text-slate-700 hover:text-red-900")}
        >
          <Hammer size={24} />
          <span className="text-[9px] uppercase font-black tracking-widest mt-1">{t.tabs.forge}</span>
          {activeTab === 'upgrades' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]" />}
        </button>
        <button 
          onClick={() => setActiveTab('inventory')}
          className={cn("flex flex-col items-center justify-center gap-1 transition-all h-full relative", activeTab === 'inventory' ? "text-red-500 scale-110" : "text-slate-700 hover:text-red-900")}
        >
          <Shield size={24} />
          <span className="text-[9px] uppercase font-black tracking-widest mt-1">{t.tabs.vault}</span>
          {activeTab === 'inventory' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]" />}
        </button>
        <button 
          onClick={() => setActiveTab('heritage')}
          className={cn("flex flex-col items-center justify-center gap-1 transition-all h-full relative", activeTab === 'heritage' ? "text-red-500 scale-110" : "text-slate-700 hover:text-red-900")}
        >
          <Crown size={24} />
          <span className="text-[9px] uppercase font-black tracking-widest mt-1">{t.tabs.legacy}</span>
          {activeTab === 'heritage' && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]" />}
        </button>
      </div>
    </div>
  );
}
