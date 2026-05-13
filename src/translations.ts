export type Language = 'en' | 'es';

export const TRANSLATIONS = {
  en: {
    generation: 'Generation',
    coins: 'Coins',
    hp: 'Vitality',
    dead: 'Deceased',
    touchToCarve: 'Touch to carve your destiny...',
    continueLineage: 'Continue Lineage',
    kingIsDead: 'The King is Dead',
    longLiveKing: 'Long live the King.',
    chooseHeir: 'Choose your Heir',
    inheritWill: 'Inherit the Will',
    enterName: 'Enter your Name',
    chooseStartClass: 'Choose your Path',
    startJourney: 'Start Journey',
    namePlaceholder: 'Your Name...',
    gender: {
      male: 'Male',
      female: 'Female',
      choose: 'Choose Gender'
    },
    stats: {
      title: 'Attributes',
      strength: 'Strength',
      erudition: 'Erudition',
      faith: 'Faith',
      constitution: 'Constitution',
      hpMax: 'HP (Max)',
      burden: 'The burden of lineage is heavy.'
    },
    results: {
      success: 'Outcome: Success',
      failure: 'Outcome: Misfortune',
      reward: 'Acquired',
      penalty: 'Gained',
      close: 'Continue'
    },
    events: {
      requires: 'Requires'
    },
    settings: 'Settings',
    succession: {
      title: 'Forced Succession',
      desc: 'Give up your current life to let the next generation rise.'
    },
    hardReset: 'Hard Reset (Erase All)',
    confirmReset: 'Are you sure? This will delete all progress and heritage.',
    reset: 'Reset',
    cancel: 'Cancel',
    tabs: {
      camp: 'Camp',
      forge: 'Forge',
      vault: 'Vault',
      legacy: 'Legacy'
    },
    upgrades: {
      title: 'Improvement & Hordes',
      perClick: 'per Click',
      perSec: 'per Sec',
      lvl: 'Lvl'
    },
    inventory: {
      title: 'Relics & Artifacts',
      noItems: 'No special items found... yet.'
    },
    heritage: {
      title: 'Bloodline Heritage',
      relics: 'Ancient Relics',
      relicsDesc: 'Spend these on permanent generational bonuses.',
      shifting: 'The Hall of Ancestors is currently shifting...'
    },
    classes: {
      Warrior: 'Warrior',
      Mage: 'Mage',
      Priest: 'Priest',
      Vampire: 'Vampire',
      Werewolf: 'Werewolf',
      Paladin: 'Paladin'
    },
    firstAncestor: 'First Ancestor',
    chronicle: 'Chronicle',
    prologue: 'The Beginning',
    startStory: 'Begin Your Story',
    intro: {
      welcome: 'Welcome, Traveler',
      desc: 'You are the first of a long lineage. Every action you take, every stat you gain, and every death you suffer will shape the future of your descendants.',
      howToPlay: 'Tap to gather gold, buy upgrades to grow your power, and survive the events of the world. Prestige allows you to restart with greater strength and reach new heights of legend.',
      ready: "I'm Ready",
      successionTitle: 'Lineage Reborn',
      successionDesc: 'The blood of {name}, the {rank}, pulsed with {class} power. Now, in the {gen} generation, you rise as a {newClass}. Destiny calls once more.',
    },
    shop: {
      title: 'Merchant\'s Stall',
      heal: 'Restore Vitality',
      classHeals: {
        Warrior: { name: 'Use Vial', desc: 'A quick dose of medicine.' },
        Mage: { name: 'Arcane Mending', desc: 'Woven mana stiches your wounds.' },
        Priest: { name: 'Offer Prayer', desc: 'Divine favor restores your body.' },
        Vampire: { name: 'Steal Blood', desc: 'Feed on the innocent. (May attract unwanted attention)' },
        Werewolf: { name: 'Devour Prey', desc: 'Tear into a fresh kill.' },
        Paladin: { name: 'Lay on Hands', desc: 'Pure light heals your spirit.' }
      },
      desc: 'Restores a portion of your HP.'
    },
    stories: {
      warrior: {
        prologue: 'The iron was cold when you first grasped it. Born from the ashes of a burned village, your path is paved with the bones of those who stood against you.',
        milestones: [
          'You found a rusted blade in a muddy ditch. It felt heavy, like destiny.',
          'Your first duel left a scar across your chest, and a fire in your heart.',
          'The local lords begin to whisper your name with a mix of respect and fear.',
          'You have gathered a small band of mercenaries, bound by gold and blood.',
          'During the Siege of Ironhold, you were the first to breach the southern gate.',
          'A mysterious knight challenged you at a crossroads; his defeat earned you his black stallion.',
          'You survived an ambush in the Whispering Woods, leaving ten bandits for the crows.',
          'The people of the borderlands now pay you tribute in exchange for your protection.',
          'You have reforged your ancestors blade, infused with the heat of a fallen star.',
          'In a moment of cold fury, you executed a corrupt lord and took his ancestral seal.'
        ]
      },
      mage: {
        prologue: 'Knowledge is a dangerous flame. You spent years in darkened libraries, hearing whispering shadows that promised power beyond the mortal veil.',
        milestones: [
          'You successfully cast your first spark, nearly burning down the scriptorium.',
          'The stars spoke to you last night. Their messages were cryptic, yet terrifying.',
          'Your eyes now glow with a faint violet hue, a sign of the mana coursing through you.',
          'You have breached the first seal of the Forbidden Library.',
          'A minor demon from the void tried to possess you, but you enslaved its essence instead.',
          'You discovered an ancient scroll detailing the transmutation of lead into dragon-bone.',
          'The Archmages of the Sapphire Citadel have extended an invitation you cannot refuse.',
          'Your meditation allowed you to walk through the Ethereal Plane for a few fleeting minutes.',
          'You have crafted a staff from the branch of a World Tree, pulsing with raw lightning.',
          'The shadows in your room have begun to take physical form to serve your will.'
        ]
      },
      priest: {
        prologue: 'The gods are silent, but their presence is heavy. You were chosen to be their voice in a world that has forgotten how to pray.',
        milestones: [
          'A simple touch healed a dying child. The villagers call it a miracle.',
          'You have restored a ruined chapel, giving the lost a place to find hope.',
          'Visions of a golden city begin to haunt your dreams.',
          'The hierarchy of the church has taken notice of your growing influence.',
          'You performed an exorcism on a possessed prince, earning the eternal gratitude of a kingdom.',
          'A holy light descended upon you during the eclipse, sealing your soul with divine purpose.',
          'You found the Lost Chalice of the First Saint in the depths of a forgotten tomb.',
          'Your sermons have converted an entire legion of hardened soldiers to the faith.',
          'The voices of the martyrs now guide your steps in the darkest of nights.',
          'You successfully mediated a peace treaty between two warring gods—or so you believe.'
        ]
      },
      vampire: {
        prologue: 'Death was not the end, but a cold beginning. You woke with an insatiable hunger and a newfound disdain for the sun.',
        milestones: [
          'You drained your first victim under a blood-red moon. The power was intoxicating.',
          'A group of vampire hunters tracked you to your crypt; none left to tell the tale.',
          'You have learned to command the creatures of the night—bats and rats are your eyes.',
          'The ancient Sanguine Circle has recognized your potential as a noble of the night.',
          'You survived a century of slumber, waking into a world that had forgotten your name.',
          'Your castle now sits atop a cliff, a dark monument to your eternal reign.',
          'You have mastered the art of the Mist Walk, slipping through locked doors unseen.',
          'A mortal king offered you his daughter to appease your wrath.',
          'You discovered the Elder Blood, a forbidden source of primeval vampiric might.',
          'The sun no longer terrifies you; you have willed the clouds to shadow your path.'
        ]
      },
      werewolf: {
        prologue: 'The beast within is restless. You remember the first time the moon pulled at your bones, tearing your skin to reveal the wolf.',
        milestones: [
          'You hunted a stag in the dead of winter, the first kill of your feral life.',
          'A fellow werewolf challenged your right to territory; you left him scarred and broken.',
          'You found a hidden grove where the spirits of the pack still roam.',
          'The Great Pack has invited you to the Gathering of the Fourteen Moons.',
          'You survived a silver bolt to the shoulder, a testament to your rugged vitality.',
          'Your howl can now be heard across three valleys, striking fear into the hearts of men.',
          'You lead a hunt that toppled a corrupt regime, tearing the tyrants to pieces.',
          'An ancient Druid taught you how to bridge the gap between beast and man.',
          'You have become the Alpha of the Hinterlands, a king in all but name.',
          'The spirit of Fenris has touched your soul, granting you boundless rage.'
        ]
      },
      paladin: {
        prologue: 'Justice is not given; it is taken. You swore an oath to be the shield of the weak and the hammer of the wicked.',
        milestones: [
          'You spent three days and nights in prayer, until your armor began to glow with inner light.',
          'Your hammer crushed the skull of a Wight King, ending a century of terror.',
          'The Order has granted you the rank of Oathkeeper after your sacrifice at the Great Bridge.',
          'You spared a repentant thief, teaching him that mercy is the truest form of strength.',
          'Your shield blocked a blast of dragon-fire, saving a caravan of refugees.',
          'You have been tasked with reclaiming the Holy City from the forces of chaos.',
          'An angel appeared in your dreams, gifting you a feather that never loses its warmth.',
          'You purged a corrupt monastery of its hidden cultists, restoring its sanctity.',
          'The commoners call you the Sunwalker, for light follows wherever you tread.',
          'Your very presence inspires hope in the hopeless and terror in the cruel.'
        ]
      }
    },
    prestige: {
      Warrior: ['Squire', 'Knight', 'Feudal Lord', 'King'],
      Mage: ['Apprentice', 'Sorcerer', 'Archmage', 'Hand of the King'],
      Priest: ['Acolyte', 'Bishop', 'Cardinal', 'Pope'],
      Vampire: ['Fledgling', 'Noble', 'Count', 'Overlord of the Bloodline'],
      Werewolf: ['Stray', 'Feral', 'Alpha', 'Alpha of the Great Pack'],
      Paladin: ['Oathkeeper', 'Crusader', 'Grand Master', 'Sovereign of Light']
    },
    upgradeTerms: {
      Warrior: {
        u1: { name: 'Peasant Levies', desc: 'Laborers who gather bronze coins.' },
        u2: { name: 'Iron Forging', desc: 'Stronger tools for higher click value.' },
        u3: { name: 'Barracks', desc: 'Trains soldiers for passive income.' },
        u4: { name: 'Leather Armor', desc: 'Increases max health by +25.' },
        u5: { name: 'Knightly Plate', desc: 'Increases max health by +100.' }
      },
      Mage: {
        u1: { name: 'Acolyte Scribes', desc: 'Transcriptionists who sell basic scrolls.' },
        u2: { name: 'Mana Infusion', desc: 'Enchant your focus for better spellcasting.' },
        u3: { name: 'Astral Observatory', desc: 'Gathers ethereal knowledge passively.' },
        u4: { name: 'Enchanted Robes', desc: 'Increases max health by +25.' },
        u5: { name: 'Archmage Vestments', desc: 'Increases max health by +100.' }
      },
      Priest: {
        u1: { name: 'Monastery Gardens', desc: 'Tended by monks to sell herbs.' },
        u2: { name: 'Holy Reliquary', desc: 'Sacred vessels that amplify your prayers.' },
        u3: { name: 'Cathedral Choir', desc: 'Chants that draw divine favor passively.' },
        u4: { name: 'Blessed Habit', desc: 'Increases max health by +25.' },
        u5: { name: 'Gilded Regalia', desc: 'Increases max health by +100.' }
      },
      Vampire: {
        u1: { name: 'Thrall Servants', desc: 'Enslaved mortals who harvest resources.' },
        u2: { name: 'Blood Forging', desc: 'Coagulated iron for lethal efficiency.' },
        u3: { name: 'Sanguine Vault', desc: 'Stores vital essence for the long night.' },
        u4: { name: 'Noble Cape', desc: 'Increases max health by +25.' },
        u5: { name: 'Bloodlord Mantle', desc: 'Increases max health by +100.' }
      },
      Werewolf: {
        u1: { name: 'Pack Scavengers', desc: 'Younger wolves find scraps and coins.' },
        u2: { name: 'Claw Sharpening', desc: 'Natural weapons made sharper than steel.' },
        u3: { name: 'Lunar Totem', desc: 'Howls that resonate with the moon\'s power.' },
        u4: { name: 'Toughened Hide', desc: 'Increases max health by +25.' },
        u5: { name: 'Great Pack Pelt', desc: 'Increases max health by +100.' }
      },
      Paladin: {
        u1: { name: 'Squire Assistants', desc: 'Assistants in training for the crusade.' },
        u2: { name: 'Consecrated Steel', desc: 'Blessed armaments for divine justice.' },
        u3: { name: 'Bastion of Light', desc: 'A fortress that radiates holiness.' },
        u4: { name: 'Steel Hauberk', desc: 'Increases max health by +25.' },
        u5: { name: 'Holy Sentinel Plate', desc: 'Increases max health by +100.' }
      }
    }
  },
  es: {
    generation: 'Generación',
    coins: 'Monedas',
    hp: 'Vitalidad',
    dead: 'Fallecido',
    touchToCarve: 'Toca para forjar tu destino...',
    continueLineage: 'Continuar Linaje',
    kingIsDead: 'El Rey ha Muerto',
    longLiveKing: 'Larga vida al Rey.',
    chooseHeir: 'Elige a tu Heredero',
    inheritWill: 'Heredar la Voluntad',
    enterName: 'Escribe tu Nombre',
    chooseStartClass: 'Elige tu Senda',
    startJourney: 'Empezar Viaje',
    namePlaceholder: 'Tu nombre...',
    gender: {
      male: 'Varón',
      female: 'Mujer',
      choose: 'Elige Género'
    },
    stats: {
      title: 'Atributos',
      strength: 'Fuerza',
      erudition: 'Erudición',
      faith: 'Fe',
      constitution: 'Constitución',
      hpMax: 'PS (Máx)',
      burden: 'La carga del linaje es pesada.'
    },
    results: {
      success: 'Resultado: Éxito',
      failure: 'Resultado: Infortunio',
      reward: 'Obtenido',
      penalty: 'Sufrido',
      close: 'Continuar'
    },
    events: {
      requires: 'Requiere'
    },
    settings: 'Ajustes',
    succession: {
      title: 'Sucesión Forzada',
      desc: 'Renuncia a tu vida actual para que surja la siguiente generación.'
    },
    hardReset: 'Reinicio Total (Borrar todo)',
    confirmReset: '¿Estás seguro? Esto borrará todo el progreso y herencia.',
    reset: 'Reiniciar',
    cancel: 'Cancelar',
    tabs: {
      camp: 'Campamento',
      forge: 'Forja',
      vault: 'Cámara',
      legacy: 'Legado'
    },
    upgrades: {
      title: 'Mejoras y Hordas',
      perClick: 'por Clic',
      perSec: 'por Seg',
      lvl: 'Nvl'
    },
    inventory: {
      title: 'Reliquias y Artefactos',
      noItems: 'No hay objetos especiales... aún.'
    },
    heritage: {
      title: 'Herencia de Linaje',
      relics: 'Reliquias Ancestrales',
      relicsDesc: 'Gasta estas reliquias en bonos generacionales permanentes.',
      shifting: 'El Salón de los Ancestros está cambiando...'
    },
    classes: {
      Warrior: 'Guerrero',
      Mage: 'Mago',
      Priest: 'Sacerdote',
      Vampire: 'Vampiro',
      Werewolf: 'Hombre Lobo',
      Paladin: 'Paladín'
    },
    firstAncestor: 'Primer Ancestro',
    chronicle: 'Crónica',
    prologue: 'El Comienzo',
    startStory: 'Empezar tu Historia',
    intro: {
      welcome: 'Bienvenido, Viajero',
      desc: 'Eres el primero de un largo linaje. Cada acción que tomes, cada atributo que ganes y cada muerte que sufras moldeará el futuro de tus descendientes.',
      howToPlay: 'Toca para recolectar oro, compra mejoras para aumentar tu poder y sobrevive a los eventos del mundo. El prestigio te permite reiniciar con mayor fuerza y alcanzar nuevas cimas de leyenda.',
      ready: "Estoy Listo",
      successionTitle: 'Linaje Renacido',
      successionDesc: 'La sangre de {name}, el {rank}, pulsaba con el poder de un {class}. Ahora, en la {gen}ª generación, surge un {newClass}. El destino llama una vez más.',
    },
    shop: {
      title: 'Puesto del Mercader',
      heal: 'Restaurar Vitalidad',
      classHeals: {
        Warrior: { name: 'Usar Vial', desc: 'Una dosis rápida de medicina.' },
        Mage: { name: 'Sanar con Hechizo', desc: 'El maná tejido cierra tus heridas.' },
        Priest: { name: 'Rezar Oración', desc: 'El favor divino restaura tu cuerpo.' },
        Vampire: { name: 'Robar Sangre', desc: 'Aliméntate de los inocentes. (Puede tener consecuencias oscuras)' },
        Werewolf: { name: 'Comerte a Alguien', desc: 'Desgarra una presa fresca.' },
        Paladin: { name: 'Imposición de Manos', desc: 'La luz pura sana tu espíritu.' }
      },
      desc: 'Restaura una porción de tus PS.'
    },
    stories: {
      warrior: {
        prologue: 'El hierro estaba frío cuando lo empuñaste por primera vez. Nacido de las cenizas de una aldea quemada, tu camino está pavimentado con los huesos de quienes se te opusieron.',
        milestones: [
          'Encontraste una hoja oxidada en una zanja de barro. Pesaba como el destino.',
          'Tu primer duelo dejó una cicatriz en tu pecho y un fuego en tu corazón.',
          'Los señores locales comienzan a susurrar tu nombre con una mezcla de respeto y miedo.',
          'Has reunido a una pequeña banda de mercenarios, unidos por el oro y la sangre.',
          'Durante el asedio de Bastorrecia, fuiste el primero en romper la puerta sur.',
          'Un caballero misterioso te desafió en un cruce de caminos; su derrota te valió su semental negro.',
          'Sobreviviste a una emboscada en el Bosque de los Susurros, dejando diez bandidos para los cuervos.',
          'La gente de las tierras fronterizas ahora te rinde tributo a cambio de tu protección.',
          'Has forjado de nuevo la hoja de tus ancestros, infundida con el calor de una estrella caída.',
          'En un momento de furia fría, ejecutaste a un señor corrupto y tomaste su sello ancestral.'
        ]
      },
      mage: {
        prologue: 'El conocimiento es una llama peligrosa. Pasaste años en librerías oscurecidas, escuchando sombras que susurraban promesas de poder más allá del velo mortal.',
        milestones: [
          'Lograste lanzar tu primera chispa, casi incendiando el scriptorium.',
          'Las estrellas te hablaron anoche. Sus mensajes eran crípticos, pero aterradores.',
          'Tus ojos ahora brillan con un tono violeta, señal del maná que recorre tus venas.',
          'Has roto el primer sello de la Librería Prohibida.',
          'Un demonio menor del vacío intentó poseerte, pero en su lugar esclavizaste su esencia.',
          'Descubriste un pergamino antiguo que detalla la transmutación del plomo en hueso de dragón.',
          'Los Archimagos de la Ciudadela de Safiro te han extendido una invitación que no puedes rechazar.',
          'Tu meditación te permitió caminar por el Plano Etéreo durante unos breves minutos.',
          'Has fabricado un bastón de la rama de un Árbol del Mundo, que pulsa con rayos puros.',
          'Las sombras de tu habitación han comenzado a tomar forma física para servir a tu voluntad.'
        ]
      },
      priest: {
        prologue: 'Los dioses callan, pero su presencia es pesada. Fuiste elegido para ser su voz en un mundo que ha olvidado cómo rezar.',
        milestones: [
          'Un simple toque curó a un niño moribundo. Los aldeanos lo llaman milagro.',
          'Has restaurado una capilla en ruinas, dando a los perdidos un lugar para hallar esperanza.',
          'Visiones de una ciudad dorada comienzan a acechar tus sueños.',
          'La jerarquía de la iglesia ha tomado nota de tu creciente influencia.',
          'Realizaste un exorcismo a un príncipe poseído, ganándote la gratitud eterna de un reino.',
          'Una luz sagrada descendió sobre ti durante el eclipse, sellando tu alma con un propósito divino.',
          'Encontraste el Cáliz Perdido del Primer Santo en las profundidades de una tumba olvidada.',
          'Tus sermones han convertido a una legión entera de soldados endurecidos a la fe.',
          'Las voces de los mártires ahora guían tus pasos en las noches más oscuras.',
          'Mediaste con éxito en un tratado de paz entre dos dioses en guerra—o eso crees.'
        ]
      },
      vampire: {
        prologue: 'La muerte no fue el fin, sino un frío comienzo. Despertaste con un hambre insaciable y un nuevo desdén por el sol.',
        milestones: [
          'Drenaste a tu primera víctima bajo una luna de sangre. El poder era embriagador.',
          'Un grupo de cazadores de vampiros te rastreó hasta tu cripta; ninguno salió para contarlo.',
          'Has aprendido a comandar las criaturas de la noche: murciélagos y ratas son tus ojos.',
          'El antiguo Círculo Sanguíneo ha reconocido tu potencial como noble de la noche.',
          'Sobreviviste a un siglo de sueño, despertando en un mundo que había olvidado tu nombre.',
          'Tu castillo ahora se asienta sobre un acantilado, un monumento oscuro a tu reinado eterno.',
          'Has dominado el arte del Camino de la Niebla, deslizándote por puertas cerradas sin ser visto.',
          'Un rey mortal te ofreció a su hija para apaciguar tu ira.',
          'Descubriste la Sangre Ancestral, una fuente prohibida de poder vampírico primigenio.',
          'El sol ya no te aterra; has obligado a las nubes a sombrear tu camino.'
        ]
      },
      werewolf: {
        prologue: 'La bestia interior está inquieta. Recuerdas la primera vez que la luna tiró de tus huesos, desgarrando tu piel para revelar al lobo.',
        milestones: [
          'Cazaste un ciervo en pleno invierno, la primera presa de tu vida feral.',
          'Un compañero hombre lobo desafió tu derecho al territorio; lo dejaste marcado y roto.',
          'Encontraste una arboleda oculta donde los espíritus de la manada aún deambulan.',
          'La Gran Manada te ha invitado a la Reunión de las Catorce Lunas.',
          'Sobreviviste a un perno de plata en el hombro, un testimonio de tu vitalidad robusta.',
          'Tu aullido ahora se puede escuchar a través de tres valles, infundiendo miedo en los corazones de los hombres.',
          'Lideraste una caza que derrocó a un régimen corrupto, despedazando a los tiranos.',
          'Un antiguo druida te enseñó cómo cerrar la brecha entre la bestia y el hombre.',
          'Te has convertido en el Alfa de las Tierras Interiores, un rey en todo menos en el nombre.',
          'El espíritu de Fenris ha tocado tu alma, otorgándote una rabia sin límites.'
        ]
      },
      paladin: {
        prologue: 'La justicia no se regala; se toma. Juraste ser el escudo de los débiles y el martillo de los malvados.',
        milestones: [
          'Pasaste tres días y noches en oración, hasta que tu armadura comenzó a brillar con luz interior.',
          'Tu martillo aplastó el cráneo de un Rey Espectro, terminando con un siglo de terror.',
          'La Orden te ha otorgado el rango de Guardián de Votos tras tu sacrificio en el Gran Puente.',
          'Perdonaste a un ladrón arrepentido, enseñándole que la misericordia es la forma más pura de fuerza.',
          'Tu escudo bloqueó una ráfaga de fuego de dragón, salvando a una caravana de refugiados.',
          'Se te ha encomendado la tarea de reclamar la Ciudad Santa de las fuerzas del caos.',
          'Un ángel se apareció en tus sueños, regalándote una pluma que nunca pierde su calor.',
          'Purgaste un monasterio corrupto de sus cultistas ocultos, restaurando su santidad.',
          'Los plebeyos te llaman el Caminante del Sol, pues la luz te sigue dondequiera que pises.',
          'Tu sola presencia inspira esperanza en los desesperados y terror en los crueles.'
        ]
      }
    },
    prestige: {
      Warrior: ['Escudero', 'Caballero', 'Señor Feudal', 'Conde', 'Duque', 'Rey', 'Emperador de las Cenizas'],
      Mage: ['Aprendiz', 'Iniciado', 'Hechicero', 'Archimago', 'Mano del Rey', 'Avatar Arcano', 'Eterno'],
      Priest: ['Acólito', 'Predicador', 'Obispo', 'Cardenal', 'Papa', 'Santo Viviente', 'Voz de los Dioses'],
      Vampire: ['Neófito', 'Cazador', 'Noble', 'Conde', 'Señor Supremo de la Estirpe', 'Primarca', 'Dios de la Noche'],
      Werewolf: ['Vagabundo', 'Rastreador', 'Feral', 'Alfa', 'Alfa de la Gran Manada', 'Ancestro de la Garra', 'Fenris'],
      Paladin: ['Guardián de Votos', 'Caballero Sangrante', 'Cruzado', 'Gran Maestro', 'Soberano de la Luz', 'Heraldo Divino', 'Luz Eterna']
    },
    upgradeTerms: {
      Warrior: {
        u1: { name: 'Levas Campesinas', desc: 'Trabajadores que recolectan monedas de bronce.' },
        u2: { name: 'Forja de Hierro', desc: 'Herramientas más fuertes para mayor valor de clic.' },
        u3: { name: 'Barracas', desc: 'Entrena soldados para ingresos pasivos.' },
        u4: { name: 'Armadura de Cuero', desc: 'Aumenta la vida máxima en +25.' },
        u5: { name: 'Placas de Caballero', desc: 'Aumenta la vida máxima en +100.' }
      },
      Mage: {
        u1: { name: 'Escribas Acólitos', desc: 'Transcriptores que venden pergaminos básicos.' },
        u2: { name: 'Infusión de Maná', desc: 'Encanta tu foco para un mejor lanzamiento de hechizos.' },
        u3: { name: 'Observatorio Astral', desc: 'Recopila conocimiento etéreo pasivamente.' },
        u4: { name: 'Túnicas Encantadas', desc: 'Aumenta la vida máxima en +25.' },
        u5: { name: 'Vestimentas de Archimago', desc: 'Aumenta la vida máxima en +100.' }
      },
      Priest: {
        u1: { name: 'Jardines del Monasterio', desc: 'Tendidos por monjes para vender hierbas.' },
        u2: { name: 'Relicario Sagrado', desc: 'Vasijas sagradas que amplifican tus oraciones.' },
        u3: { name: 'Coro de la Catedral', desc: 'Cantos que atraen el favor divino pasivamente.' },
        u4: { name: 'Hábito Bendecido', desc: 'Aumenta la vida máxima en +25.' },
        u5: { name: 'Regalía Dorada', desc: 'Aumenta la vida máxima en +100.' }
      },
      Vampire: {
        u1: { name: 'Siervos Esclavos', desc: 'Mortales esclavizados que recolectan recursos.' },
        u2: { name: 'Forja de Sangre', desc: 'Hierro coagulado para una eficiencia letal.' },
        u3: { name: 'Bóveda Sanguínea', desc: 'Almacena esencia vital para la larga noche.' },
        u4: { name: 'Capa de Noble', desc: 'Aumenta la vida máxima en +25.' },
        u5: { name: 'Manto del Señor de la Sangre', desc: 'Aumenta la vida máxima en +100.' }
      },
      Werewolf: {
        u1: { name: 'Carroñeros de la Manada', desc: 'Lobos jóvenes encuentran restos y monedas.' },
        u2: { name: 'Afilado de Garras', desc: 'Armas naturales más afiladas que el acero.' },
        u3: { name: 'Tótem Lunar', desc: 'Aullidos que resuenan con el poder de la luna.' },
        u4: { name: 'Piel Endurecida', desc: 'Aumenta la vida máxima en +25.' },
        u5: { name: 'Pelaje de la Gran Manada', desc: 'Aumenta la vida máxima en +100.' }
      },
      Paladin: {
        u1: { name: 'Asistentes Escuderos', desc: 'Ayudantes en entrenamiento para la cruzada.' },
        u2: { name: 'Acero Consagrado', desc: 'Armamentos bendecidos para la justicia divina.' },
        u3: { name: 'Bastión de Luz', desc: 'Una fortaleza que irradia santidad.' },
        u4: { name: 'Cota de Malla', desc: 'Aumenta la vida máxima en +25.' },
        u5: { name: 'Placas de Centinela Sagrado', desc: 'Aumenta la vida máxima en +100.' }
      }
    }
  }
};
