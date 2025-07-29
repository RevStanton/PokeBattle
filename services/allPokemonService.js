// services/allPokemonService.js
import { fetchPokemonData, fetchPokemonSpecies } from './api.js';
import { fetchEvolutionChain }                   from './evolutionService.js';

const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=1025';
let _allCache = null;

export async function fetchAllPokemonList() {
  if (_allCache) {
    console.log('[allPokemonService] returning cached list:', _allCache.length);
    return _allCache;
  }
  console.log('[allPokemonService] fetching full Pokémon list...');
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Failed to load list (${res.status})`);
  const { results } = await res.json();
  console.log('[allPokemonService] fetched list length=', results.length);
  _allCache = results;
  return _allCache;
}

export async function fetchFullPokemon(nameOrId) {
  console.log(`[allPokemonService] fetchFullPokemon start for "${nameOrId}"`);
  const [core, species] = await Promise.all([
    fetchPokemonData(nameOrId),
    fetchPokemonSpecies(nameOrId)
  ]);
  console.log('[allPokemonService] core+species loaded:', core, species);
  if (!species.evolution_chain) {
    console.warn('[allPokemonService] no evolution_chain for', nameOrId);
    return { ...core, ...species, evolution: null };
  }
  const evolution = await fetchEvolutionChain(species.evolution_chain);
  console.log('[allPokemonService] evolution loaded:', evolution);
  return { ...core, ...species, evolution };
}
