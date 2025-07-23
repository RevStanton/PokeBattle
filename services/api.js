// services/api.js
const API_BASE = 'https://pokeapi.co/api/v2';

export async function fetchPokemonList(limit = 50, offset = 0) {
  const res = await fetch(`${API_BASE}/pokemon?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error('Failed to fetch Pokémon list');
  const data = await res.json();
  return data.results.map(p => p.name);
}

export async function fetchPokemonData(name) {
  const res = await fetch(`${API_BASE}/pokemon/${name.toLowerCase()}`);
  if (!res.ok) throw new Error(`Pokémon "${name}" not found`);
  const data = await res.json();

  // turn stats array into a name→value map
  const stats = data.stats.reduce((acc, s) => {
    acc[s.stat.name] = s.base_stat;
    return acc;
  }, {});

  return {
    name: data.name,
    types: data.types.map(t => t.type.name),
    stats,
    sprites: {
      // primary battle sprite
      front_default: data.sprites.front_default,
      // fallback to the official artwork if the default is missing
      official: data.sprites.other?.['official-artwork']?.front_default || ''
    }
  };
}
