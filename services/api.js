// services/api.js
const API_BASE = 'https://pokeapi.co/api/v2';

/**
 * Fetches the full list of Pokémon names.
 */
export async function fetchPokemonList() {
  // 1) get the total count
  const infoRes = await fetch(`${API_BASE}/pokemon?limit=1`);
  if (!infoRes.ok) throw new Error('Failed to fetch Pokémon count');
  const infoData = await infoRes.json();
  const total = infoData.count;

  // 2) fetch them all in one go
  const listRes = await fetch(`${API_BASE}/pokemon?limit=${total}&offset=0`);
  if (!listRes.ok) throw new Error('Failed to fetch full Pokémon list');
  const listData = await listRes.json();

  // return just the names
  return listData.results.map(p => p.name);
}

/**
 * Fetch a single Pokémon’s data (unchanged)
 */
export async function fetchPokemonData(name) {
  const res = await fetch(`${API_BASE}/pokemon/${name.toLowerCase()}`);
  if (!res.ok) throw new Error(`Pokémon "${name}" not found`);
  const data = await res.json();

  const stats = data.stats.reduce((acc, s) => {
    acc[s.stat.name] = s.base_stat;
    return acc;
  }, {});

  return {
    name: data.name,
    types: data.types.map(t => t.type.name),
    stats,
    sprites: {
      front_default: data.sprites.front_default,
      official: data.sprites.other?.['official-artwork']?.front_default || ''
    }
  };
}
