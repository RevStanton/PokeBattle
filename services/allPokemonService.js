import { fetchPokemonData, fetchPokemonSpecies } from './api.js';
import { fetchEvolutionChain }                    from './evolutionService.js';

const API_BASE = 'https://pokeapi.co/api/v2/pokemon?limit=1025';
let _allCache = null;

/**
 * Returns [{ name, url }, …] of all Pokémon (cached)
 */
export async function fetchAllPokemonList() {
  const list = await fetchAllPokemonList();  
  console.log('[Service] fetched all Pokémon:', list.length);
  return list;
}

export async function fetchFullPokemon(nameOrId) {
  console.log(`[Service] fetchFullPokemon start for "${nameOrId}"`);
  const [ core, species ] = await Promise.all([
    fetchPokemonData(nameOrId),
    fetchPokemonSpecies(nameOrId)
  ]);
  console.log('[Service] core and species objects:', core, species);
  const chain = await fetchEvolutionChain(species.evolution_chain);
  console.log('[Service] evolution chain:', chain);
  return { ...core, ...species, evolution: chain };
}
