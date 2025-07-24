// services/api.js

const API_BASE = 'https://pokeapi.co/api/v2';
let _pokemonListCache = null;

/**
 * Fetches & caches the full list of Pokémon names.
 * @returns {Promise<string[]>}
 */
export async function fetchPokemonList() {
  if (_pokemonListCache) {
    return _pokemonListCache;
  }
  const res = await fetch(`${API_BASE}/pokemon?limit=2000`);
  if (!res.ok) {
    throw new Error(`Failed to fetch Pokémon list (status ${res.status})`);
  }
  const { results } = await res.json();
  _pokemonListCache = results.map(p => p.name);
  return _pokemonListCache;
}

/**
 * Fetches a single Pokémon's core data.
 * @param {string|number} nameOrId
 * @returns {Promise<Object>}
 */
export async function fetchPokemonData(nameOrId) {
  const id = String(nameOrId).toLowerCase();
  const res = await fetch(`${API_BASE}/pokemon/${id}`);
  if (!res.ok) {
    throw new Error(`Pokémon "${id}" not found (status ${res.status})`);
  }
  const data = await res.json();

  // collapse stats array into an object
  const stats = data.stats.reduce((acc, { stat, base_stat }) => {
    acc[stat.name] = base_stat;
    return acc;
  }, {});

  return {
    id: data.id,
    name: data.name,
    types: data.types.map(({ type }) => type.name),
    abilities: data.abilities.map(({ ability }) => ability.name),
    height: data.height,
    weight: data.weight,
    moves: data.moves.map(({ move }) => move.name),
    stats,
    sprites: {
      frontDefault: data.sprites.front_default,
      officialArtwork:
        data.sprites.other?.['official-artwork']?.front_default || ''
    }
  };
}

/**
 * Fetches the /ability endpoint for a given ability name or ID,
 * returning its short effect and flavor text.
 * @param {string} nameOrId
 * @returns {Promise<Object>}
 */
export async function fetchAbilityInfo(nameOrId) {
  const id = String(nameOrId).toLowerCase();
  const res = await fetch(`${API_BASE}/ability/${id}`);
  if (!res.ok) {
    throw new Error(`Ability "${id}" not found (status ${res.status})`);
  }
  const ab = await res.json();

  const effect = ab.effect_entries.find(e => e.language.name === 'en')
    ?.short_effect || '';

  const flavor = ab.flavor_text_entries
    .find(e => e.language.name === 'en')
    ?.flavor_text.replace(/[\n\f]/g, ' ') || '';

  return { name: ab.name, effect, flavor };
}

/**
 * Fetches the /pokemon-species endpoint for additional flavor text,
 * genus, habitat, and growth rate.
 * @param {string|number} nameOrId
 * @returns {Promise<Object>}
 */
export async function fetchPokemonSpecies(nameOrId) {
  const id = String(nameOrId).toLowerCase();
  const res = await fetch(`${API_BASE}/pokemon-species/${id}`);
  if (!res.ok) {
    throw new Error(`Species for "${id}" not found (status ${res.status})`);
  }
  const sp = await res.json();

  const description = sp.flavor_text_entries
    .find(e => e.language.name === 'en')
    ?.flavor_text.replace(/[\n\f]/g, ' ') || '';

  const genus = sp.genera.find(g => g.language.name === 'en')?.genus || '';

  return {
    description,
    genus,
    habitat: sp.habitat?.name || '',
    growth_rate: sp.growth_rate?.name || ''
  };
}
