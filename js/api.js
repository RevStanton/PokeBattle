// js/api.js

const API_BASE = 'https://pokeapi.co/api/v2';

// Fetch a list of Pokémon (limit adjustable)
export async function fetchPokemonList(limit = 151, offset = 0) {
  const res = await fetch(`${API_BASE}/pokemon?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error('Failed to fetch Pokémon list');
  const { results } = await res.json();
  // results is [{ name, url }, ...]
  return results;
}

// Fetch detailed data for a single Pokémon by name
export async function fetchPokemonData(name) {
  const res = await fetch(`${API_BASE}/pokemon/${name.toLowerCase()}`);
  if (!res.ok) throw new Error(`Pokémon ${name} not found`);
  const data = await res.json();
  // You can extract stats & sprite here:
  return {
    name: data.name,
    sprite: data.sprites.front_default,
    stats: data.stats.reduce((acc, s) => {
      acc[s.stat.name] = s.base_stat;
      return acc;
    }, {}),
    types: data.types.map(t => t.type.name),
  };
}
