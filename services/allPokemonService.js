import { fetchPokemonData, fetchPokemonSpecies } from './api.js';
import { fetchEvolutionChain }                    from './evolutionService.js';

const API_BASE = 'https://pokeapi.co/api/v2/pokemon?limit=1025';
let _allCache = null;

/**
 * Returns [{ name, url }, …] of all Pokémon (cached)
 */
export async function fetchAllPokemonList() {
  if (_allCache) return _allCache;
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error(`Failed to load Pokémon list (${res.status})`);
  const { results } = await res.json();
  _allCache = results;
  return _allCache;
}

/**
 * Fetches full data for one Pokémon, including species & evolution chain
 * @param {string} nameOrId
 */
export async function fetchFullPokemon(nameOrId) {
  // 1) core + species
  const [core, species] = await Promise.all([
    fetchPokemonData(nameOrId),
    fetchPokemonSpecies(nameOrId)
  ]);

  // 2) evolution chain via species.evolution_chain.url
  const evoChain = await fetchEvolutionChain(species.evolution_chain.url);

  return { ...core, ...species, evolution: evoChain };
}