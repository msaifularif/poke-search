// PokéAPI Client with in-memory caching and response normalizers

const BASE_URL = 'https://pokeapi.co/api/v2';

// In-memory caches to prevent redundant network calls
const cache = {
  allPokemon: null,
  pokemonDetail: new Map(),
  pokemonSpecies: new Map(),
  evolutionChain: new Map(),
  typesList: new Map(),
};

/**
 * Format Pokemon ID as 3 or 4 digit string, e.g., 25 -> "#025"
 */
export function formatPokemonId(id) {
  if (!id) return '#000';
  return `#${String(id).padStart(3, '0')}`;
}

/**
 * Capitalize first letter of words
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Get the official artwork URL directly by Pokémon ID
 */
export function getOfficialArtworkUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

/**
 * Get animated Showdown sprite URL by Pokémon ID
 */
export function getShowdownSpriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`;
}

/**
 * Fetch all Pokémon summary (names and IDs up to Gen 9: 1025).
 * Cached permanently in memory for instant client-side filtering.
 */
export async function getAllPokemonSummary() {
  if (cache.allPokemon) {
    return cache.allPokemon;
  }

  try {
    const res = await fetch(`${BASE_URL}/pokemon?limit=1025&offset=0`);
    if (!res.ok) throw new Error(`PokéAPI returned ${res.status}`);
    const data = await res.json();

    const list = data.results.map((item) => {
      const parts = item.url.split('/').filter(Boolean);
      const id = parseInt(parts[parts.length - 1], 10);
      return {
        id,
        name: item.name,
        displayName: capitalize(item.name.replace(/-/g, ' ')),
        url: item.url,
        formattedId: formatPokemonId(id),
        sprite: getOfficialArtworkUrl(id),
      };
    });

    cache.allPokemon = list;
    return list;
  } catch (err) {
    console.error('Failed to fetch all Pokémon list:', err);
    throw err;
  }
}

/**
 * Normalizes stat names into clean abbreviations
 */
const STAT_LABELS = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
};

const STAT_SHORT = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'SPA',
  'special-defense': 'SPD',
  speed: 'SPD',
};

/**
 * Fetch detailed Pokémon profile by ID or name
 */
export async function getPokemonDetail(idOrName) {
  const key = String(idOrName).toLowerCase().trim();
  if (cache.pokemonDetail.has(key)) {
    return cache.pokemonDetail.get(key);
  }

  try {
    const res = await fetch(`${BASE_URL}/pokemon/${encodeURIComponent(key)}`);
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error(`Pokémon "${idOrName}" not found`);
      }
      throw new Error(`Failed to load Pokémon (HTTP ${res.status})`);
    }
    const raw = await res.json();

    const heightMeters = raw.height / 10;
    const heightFeet = (heightMeters * 3.28084).toFixed(1);
    const weightKg = raw.weight / 10;
    const weightLbs = (weightKg * 2.20462).toFixed(1);

    const stats = raw.stats.map(s => ({
      name: s.stat.name,
      label: STAT_LABELS[s.stat.name] || capitalize(s.stat.name),
      short: STAT_SHORT[s.stat.name] || s.stat.name.toUpperCase(),
      base_stat: s.base_stat,
      effort: s.effort,
      percentage: Math.min(100, Math.round((s.base_stat / 255) * 100)),
    }));

    const totalStats = stats.reduce((acc, curr) => acc + curr.base_stat, 0);

    const types = raw.types.map(t => ({
      name: t.type.name,
      displayName: capitalize(t.type.name),
      slot: t.slot,
    }));

    const abilities = raw.abilities.map(a => ({
      name: a.ability.name,
      displayName: capitalize(a.ability.name.replace(/-/g, ' ')),
      is_hidden: a.is_hidden,
      slot: a.slot,
    }));

    const officialArtwork = raw.sprites?.other?.['official-artwork']?.front_default || getOfficialArtworkUrl(raw.id);
    const animatedSprite = raw.sprites?.other?.showdown?.front_default || null;
    const defaultFront = raw.sprites?.front_default || officialArtwork;
    const shinyFront = raw.sprites?.front_shiny || null;
    const cryUrl = raw.cries?.latest || raw.cries?.legacy || null;

    const normalized = {
      id: raw.id,
      name: raw.name,
      displayName: capitalize(raw.name.replace(/-/g, ' ')),
      formattedId: formatPokemonId(raw.id),
      height: {
        meters: heightMeters,
        feet: heightFeet,
      },
      weight: {
        kg: weightKg,
        lbs: weightLbs,
      },
      baseExperience: raw.base_experience,
      types,
      typeNames: types.map(t => t.name),
      stats,
      totalStats,
      abilities,
      sprites: {
        artwork: officialArtwork,
        animated: animatedSprite,
        front: defaultFront,
        shiny: shinyFront,
      },
      cries: {
        latest: cryUrl,
      },
      speciesUrl: raw.species?.url,
    };

    cache.pokemonDetail.set(key, normalized);
    cache.pokemonDetail.set(String(raw.id), normalized);
    cache.pokemonDetail.set(raw.name.toLowerCase(), normalized);

    return normalized;
  } catch (err) {
    console.error(`Error loading detail for ${idOrName}:`, err);
    throw err;
  }
}

/**
 * Fetch Pokémon species information (genus, flavor text, evolution chain url)
 */
export async function getPokemonSpecies(idOrName) {
  const key = String(idOrName).toLowerCase().trim();
  if (cache.pokemonSpecies.has(key)) {
    return cache.pokemonSpecies.get(key);
  }

  try {
    const res = await fetch(`${BASE_URL}/pokemon-species/${encodeURIComponent(key)}`);
    if (!res.ok) throw new Error(`Species for "${idOrName}" not found`);
    const raw = await res.json();

    // Get English flavor text
    const englishEntries = (raw.flavor_text_entries || []).filter(e => e.language?.name === 'en');
    const latestFlavor = englishEntries.length > 0
      ? englishEntries[englishEntries.length - 1].flavor_text.replace(/[\f\n\r]/g, ' ')
      : 'No Pokédex entry available.';

    // English genus
    const genusObj = (raw.genera || []).find(g => g.language?.name === 'en');
    const genus = genusObj ? genusObj.genus : 'Pokémon';

    const normalized = {
      id: raw.id,
      name: raw.name,
      genus,
      flavorText: latestFlavor,
      generation: raw.generation?.name ? raw.generation.name.toUpperCase() : 'Unknown',
      growthRate: raw.growth_rate?.name ? capitalize(raw.growth_rate.name.replace(/-/g, ' ')) : 'Medium',
      captureRate: raw.capture_rate,
      genderRate: raw.gender_rate,
      isLegendary: raw.is_legendary || raw.is_mythical,
      evolutionChainUrl: raw.evolution_chain?.url || null,
    };

    cache.pokemonSpecies.set(key, normalized);
    cache.pokemonSpecies.set(String(raw.id), normalized);
    return normalized;
  } catch (err) {
    console.error(`Error loading species for ${idOrName}:`, err);
    return {
      id: idOrName,
      name: idOrName,
      genus: 'Pokémon',
      flavorText: 'Pokédex description currently unavailable.',
      evolutionChainUrl: null,
    };
  }
}

/**
 * Recursively parse an evolution chain tree from PokéAPI
 */
function parseChainNode(node, parentSpecies = null) {
  const parts = node.species.url.split('/').filter(Boolean);
  const id = parseInt(parts[parts.length - 1], 10);

  const evolutionDetails = node.evolution_details && node.evolution_details.length > 0
    ? node.evolution_details[0]
    : null;

  let triggerText = '';
  if (evolutionDetails) {
    if (evolutionDetails.min_level) {
      triggerText = `Lvl ${evolutionDetails.min_level}`;
    } else if (evolutionDetails.item) {
      triggerText = capitalize(evolutionDetails.item.name.replace(/-/g, ' '));
    } else if (evolutionDetails.trigger?.name === 'trade') {
      triggerText = evolutionDetails.held_item
        ? `Trade with ${capitalize(evolutionDetails.held_item.name.replace(/-/g, ' '))}`
        : 'Trade';
    } else if (evolutionDetails.min_happiness) {
      triggerText = `Happiness ${evolutionDetails.min_happiness}`;
    } else if (evolutionDetails.time_of_day) {
      triggerText = `${capitalize(evolutionDetails.time_of_day)}time`;
    } else if (evolutionDetails.trigger?.name) {
      triggerText = capitalize(evolutionDetails.trigger.name.replace(/-/g, ' '));
    }
  }

  const current = {
    id,
    name: node.species.name,
    displayName: capitalize(node.species.name.replace(/-/g, ' ')),
    formattedId: formatPokemonId(id),
    sprite: getOfficialArtworkUrl(id),
    triggerText,
    from: parentSpecies ? parentSpecies.name : null,
    evolvesTo: [],
  };

  if (node.evolves_to && node.evolves_to.length > 0) {
    current.evolvesTo = node.evolves_to.map(child => parseChainNode(child, node.species));
  }

  return current;
}

/**
 * Fetch and parse evolution chain
 */
export async function getEvolutionChain(chainUrlOrId) {
  let url = chainUrlOrId;
  if (typeof chainUrlOrId === 'number' || (typeof chainUrlOrId === 'string' && !chainUrlOrId.startsWith('http'))) {
    url = `${BASE_URL}/evolution-chain/${chainUrlOrId}`;
  }

  if (!url) return null;

  if (cache.evolutionChain.has(url)) {
    return cache.evolutionChain.get(url);
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Evolution chain fetch failed: ${res.status}`);
    const data = await res.json();

    const rootNode = parseChainNode(data.chain);
    cache.evolutionChain.set(url, rootNode);
    return rootNode;
  } catch (err) {
    console.error('Failed to fetch evolution chain:', err);
    return null;
  }
}

/**
 * Fetch list of Pokémon belonging to a specific type
 */
export async function getPokemonByType(typeName) {
  const type = typeName.toLowerCase();
  if (cache.typesList.has(type)) {
    return cache.typesList.get(type);
  }

  try {
    const res = await fetch(`${BASE_URL}/type/${type}`);
    if (!res.ok) throw new Error(`Type fetch failed: ${res.status}`);
    const data = await res.json();

    const pokemonList = data.pokemon.map(p => {
      const parts = p.pokemon.url.split('/').filter(Boolean);
      const id = parseInt(parts[parts.length - 1], 10);
      return {
        id,
        name: p.pokemon.name,
      };
    }).filter(p => p.id <= 1025); // Exclude special alternate forms beyond standard range if needed

    cache.typesList.set(type, pokemonList);
    return pokemonList;
  } catch (err) {
    console.error(`Failed to fetch Pokemon for type ${typeName}:`, err);
    return [];
  }
}
