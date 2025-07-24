// services/api.js
const API_BASE = 'https://pokeapi.co/api/v2';
let _pokemonListCache = null;

/**
 * Fetches the full list of Pokémon names (cached).
 * @returns {Promise<string[]>}
 */
export async function fetchPokemonList() {
  if (_pokemonListCache) return _pokemonListCache;
  const url = `${API_BASE}/pokemon?limit=2000`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch Pokémon list (status ${res.status})`);
  }
  const { results } = await res.json();
  _pokemonListCache = results.map(p => p.name);
  return _pokemonListCache;
}

/**
 * Fetches a single Pokémon's full data.
 * @param {string|number} nameOrId - Pokémon name or ID
 * @returns {Promise<Object>}
 */
export async function fetchPokemonData(nameOrId) {
  const identifier = String(nameOrId).toLowerCase();
  const res = await fetch(`${API_BASE}/pokemon/${identifier}`);
  if (!res.ok) {
    throw new Error(`Pokémon "${identifier}" not found (status ${res.status})`);
  }
  const data = await res.json();
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
      officialArtwork: data.sprites.other?.['official-artwork']?.front_default || ''
    }
  };
}

/**
 * Fetch species info: flavor text, genus, habitat, growth rate, evolution chain URL
 */
export async function fetchPokemonSpecies(nameOrId) {
  const id = String(nameOrId).toLowerCase();
  const res = await fetch(`${API_BASE}/pokemon-species/${id}`);
  if (!res.ok) throw new Error(`Species for "${id}" not found (status ${res.status})`);
  const sp = await res.json();

  // pick first English flavor text & genus
  const flavor = sp.flavor_text_entries
    .find(e => e.language.name === 'en')?.flavor_text
    .replace(/[\n\f]/g, ' ') || '';
  const genus = sp.genera
    .find(g => g.language.name === 'en')?.genus || '';

  return {
    description: flavor,
    genus,
    habitat: sp.habitat?.name || '',
    growth_rate: sp.growth_rate?.name || '',
    evolution_chain_url: sp.evolution_chain?.url || ''
  };
}