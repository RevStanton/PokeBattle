// js/api.js
const API_BASE = 'https://pokeapi.co/api/v2';

export async function fetchPokemonList(limit = 50, offset = 0) {
  const res = await fetch(`${API_BASE}/pokemon?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error('Failed to fetch Pokémon list');
  const data = await res.json();
  // return array of names
  return data.results.map(p => p.name);
}

export async function fetchPokemonData(name) {
  name = name.toLowerCase().trim();
  const res = await fetch(`${API_BASE}/pokemon/${name}`);
  if (!res.ok) throw new Error(`Pokémon "${name}" not found`);
  const data = await res.json();
  // turn stats into a plain object
  const stats = {};
  data.stats.forEach(s => {
    stats[s.stat.name] = s.base_stat;
  });
  return {
    name: data.name,
    sprite: data.sprites.front_default,
    stats
  };
}
