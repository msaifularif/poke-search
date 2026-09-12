// Type color maps and effectiveness calculator for Pokémon types

export const TYPE_COLORS = {
  normal: {
    bg: 'bg-[#A8A77A]',
    text: 'text-white',
    badge: 'bg-[#A8A77A] text-white',
    border: 'border-[#A8A77A]',
    hex: '#A8A77A',
    light: 'bg-[#A8A77A]/15 text-[#6D6D4E] dark:text-[#C6C6A7]',
  },
  fire: {
    bg: 'bg-[#EE8130]',
    text: 'text-white',
    badge: 'bg-[#EE8130] text-white',
    border: 'border-[#EE8130]',
    hex: '#EE8130',
    light: 'bg-[#EE8130]/15 text-[#B8530B] dark:text-[#FFAE70]',
  },
  water: {
    bg: 'bg-[#6390F0]',
    text: 'text-white',
    badge: 'bg-[#6390F0] text-white',
    border: 'border-[#6390F0]',
    hex: '#6390F0',
    light: 'bg-[#6390F0]/15 text-[#2E63D8] dark:text-[#90B3FF]',
  },
  electric: {
    bg: 'bg-[#F7D02C]',
    text: 'text-slate-900',
    badge: 'bg-[#F7D02C] text-slate-900',
    border: 'border-[#F7D02C]',
    hex: '#F7D02C',
    light: 'bg-[#F7D02C]/20 text-[#9E8104] dark:text-[#FFE366]',
  },
  grass: {
    bg: 'bg-[#7AC74C]',
    text: 'text-white',
    badge: 'bg-[#7AC74C] text-white',
    border: 'border-[#7AC74C]',
    hex: '#7AC74C',
    light: 'bg-[#7AC74C]/15 text-[#4E8C25] dark:text-[#A7E682]',
  },
  ice: {
    bg: 'bg-[#96D9D6]',
    text: 'text-slate-900',
    badge: 'bg-[#96D9D6] text-slate-900',
    border: 'border-[#96D9D6]',
    hex: '#96D9D6',
    light: 'bg-[#96D9D6]/20 text-[#2B7D79] dark:text-[#BCECEC]',
  },
  fighting: {
    bg: 'bg-[#C22E28]',
    text: 'text-white',
    badge: 'bg-[#C22E28] text-white',
    border: 'border-[#C22E28]',
    hex: '#C22E28',
    light: 'bg-[#C22E28]/15 text-[#8A1A15] dark:text-[#E8736E]',
  },
  poison: {
    bg: 'bg-[#A33EA1]',
    text: 'text-white',
    badge: 'bg-[#A33EA1] text-white',
    border: 'border-[#A33EA1]',
    hex: '#A33EA1',
    light: 'bg-[#A33EA1]/15 text-[#731E71] dark:text-[#D57BD3]',
  },
  ground: {
    bg: 'bg-[#E2BF65]',
    text: 'text-slate-900',
    badge: 'bg-[#E2BF65] text-slate-900',
    border: 'border-[#E2BF65]',
    hex: '#E2BF65',
    light: 'bg-[#E2BF65]/20 text-[#8C6F19] dark:text-[#F0D998]',
  },
  flying: {
    bg: 'bg-[#A98FF3]',
    text: 'text-white',
    badge: 'bg-[#A98FF3] text-white',
    border: 'border-[#A98FF3]',
    hex: '#A98FF3',
    light: 'bg-[#A98FF3]/15 text-[#6240C9] dark:text-[#C7B5F8]',
  },
  psychic: {
    bg: 'bg-[#F95587]',
    text: 'text-white',
    badge: 'bg-[#F95587] text-white',
    border: 'border-[#F95587]',
    hex: '#F95587',
    light: 'bg-[#F95587]/15 text-[#BC1549] dark:text-[#FBA3BE]',
  },
  bug: {
    bg: 'bg-[#A6B91A]',
    text: 'text-white',
    badge: 'bg-[#A6B91A] text-white',
    border: 'border-[#A6B91A]',
    hex: '#A6B91A',
    light: 'bg-[#A6B91A]/15 text-[#6B790D] dark:text-[#CBE037]',
  },
  rock: {
    bg: 'bg-[#B6A136]',
    text: 'text-white',
    badge: 'bg-[#B6A136] text-white',
    border: 'border-[#B6A136]',
    hex: '#B6A136',
    light: 'bg-[#B6A136]/15 text-[#736315] dark:text-[#DACB6B]',
  },
  ghost: {
    bg: 'bg-[#735797]',
    text: 'text-white',
    badge: 'bg-[#735797] text-white',
    border: 'border-[#735797]',
    hex: '#735797',
    light: 'bg-[#735797]/15 text-[#4A3464] dark:text-[#A791C4]',
  },
  dragon: {
    bg: 'bg-[#6F35FC]',
    text: 'text-white',
    badge: 'bg-[#6F35FC] text-white',
    border: 'border-[#6F35FC]',
    hex: '#6F35FC',
    light: 'bg-[#6F35FC]/15 text-[#4413B8] dark:text-[#A37BFA]',
  },
  dark: {
    bg: 'bg-[#705746]',
    text: 'text-white',
    badge: 'bg-[#705746] text-white',
    border: 'border-[#705746]',
    hex: '#705746',
    light: 'bg-[#705746]/15 text-[#463225] dark:text-[#A99180]',
  },
  steel: {
    bg: 'bg-[#B7B7CE]',
    text: 'text-slate-900',
    badge: 'bg-[#B7B7CE] text-slate-900',
    border: 'border-[#B7B7CE]',
    hex: '#B7B7CE',
    light: 'bg-[#B7B7CE]/20 text-[#5F5F7A] dark:text-[#D8D8E8]',
  },
  fairy: {
    bg: 'bg-[#D685AD]',
    text: 'text-white',
    badge: 'bg-[#D685AD] text-white',
    border: 'border-[#D685AD]',
    hex: '#D685AD',
    light: 'bg-[#D685AD]/15 text-[#9E3E6F] dark:text-[#E7B0CA]',
  },
};

// Complete Generation definitions
export const GENERATIONS = [
  { id: 'all', name: 'All Generations', offset: 0, limit: 1025 },
  { id: '1', name: 'Gen I (Kanto)', offset: 0, limit: 151, range: [1, 151] },
  { id: '2', name: 'Gen II (Johto)', offset: 151, limit: 100, range: [152, 251] },
  { id: '3', name: 'Gen III (Hoenn)', offset: 251, limit: 135, range: [252, 386] },
  { id: '4', name: 'Gen IV (Sinnoh)', offset: 386, limit: 107, range: [387, 493] },
  { id: '5', name: 'Gen V (Unova)', offset: 493, limit: 156, range: [494, 649] },
  { id: '6', name: 'Gen VI (Kalos)', offset: 649, limit: 72, range: [650, 721] },
  { id: '7', name: 'Gen VII (Alola)', offset: 721, limit: 88, range: [722, 809] },
  { id: '8', name: 'Gen VIII (Galar)', offset: 809, limit: 96, range: [810, 905] },
  { id: '9', name: 'Gen IX (Paldea)', offset: 905, limit: 120, range: [906, 1025] },
];

export const ALL_TYPES = Object.keys(TYPE_COLORS);

// Standard Gen 6+ Type effectiveness chart (Defending type damage multipliers)
// Attacking type -> { defending type: multiplier }
const TYPE_DEFENSE_MATRIX = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};

/**
 * Calculates defensive effectiveness against all 18 attacking types for given Pokémon type(s).
 * @param {string[]} defenderTypes - Array of type names, e.g. ['fire', 'flying']
 * @returns {{ superWeak: Array, weak: Array, normal: Array, resistant: Array, superResistant: Array, immune: Array }}
 */
export function calculateTypeMatchups(defenderTypes = []) {
  const normalizedTypes = defenderTypes.map(t => t.toLowerCase());
  const multipliers = {};

  // Default each attacking type to 1x
  ALL_TYPES.forEach(atkType => {
    multipliers[atkType] = 1;
  });

  // Multiply defending multipliers
  ALL_TYPES.forEach(atkType => {
    normalizedTypes.forEach(defType => {
      const match = TYPE_DEFENSE_MATRIX[atkType]?.[defType];
      if (match !== undefined) {
        multipliers[atkType] *= match;
      }
    });
  });

  const superWeak = [];       // 4x
  const weak = [];            // 2x
  const normal = [];          // 1x
  const resistant = [];       // 0.5x
  const superResistant = [];  // 0.25x
  const immune = [];          // 0x

  Object.entries(multipliers).forEach(([type, multiplier]) => {
    if (multiplier >= 4) {
      superWeak.push({ type, multiplier });
    } else if (multiplier > 1) {
      weak.push({ type, multiplier });
    } else if (multiplier === 0) {
      immune.push({ type, multiplier });
    } else if (multiplier <= 0.25) {
      superResistant.push({ type, multiplier });
    } else if (multiplier < 1) {
      resistant.push({ type, multiplier });
    } else {
      normal.push({ type, multiplier });
    }
  });

  return { superWeak, weak, normal, resistant, superResistant, immune };
}

export function getTypeStyle(typeName) {
  const normalized = (typeName || '').toLowerCase();
  return TYPE_COLORS[normalized] || {
    bg: 'bg-slate-400',
    text: 'text-white',
    badge: 'bg-slate-400 text-white',
    border: 'border-slate-400',
    hex: '#94A3B8',
    light: 'bg-slate-200 text-slate-700',
  };
}
