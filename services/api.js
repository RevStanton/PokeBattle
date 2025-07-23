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
  const json = await res.json();
  const stats = {};
  json.stats.forEach(s => stats[s.stat.name] = s.base_stat);
  return {
    name: json.name,
    sprite: json.sprites.front_default,
    stats,
    types: json.types.map(t => t.type.name)
  };
}
