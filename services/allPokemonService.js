// services/allPokemonService.js

import { fetchPokemonData, fetchPokemonSpecies } from './api.js';
import { fetchEvolutionChain }                  from './evolutionService.js';

const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=1025';

let _allCache = null;

/**
 * Fetches & caches the full list of Pokémon (name + URL).
 * @returns {Promise<Array<{ name: string, url: string }>>}
 */
export async function fetchAllPokemonList() {
  if (_allCache) {
    console.log('[allPokemonService] returning cached list:', _allCache.length);
    return _allCache;
  }

  console.log('[allPokemonService] fetching full Pokémon list...');
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error(`Failed to load Pokémon list (${res.status})`);
  }
  const json = await res.json();
  const results = json.results;  // array of { name, url }
  console.log('[allPokemonService] fetched list length=', results.length);

  _allCache = results;
  return _allCache;
}

/**
 * Fetches core data, species data, and evolution chain for one Pokémon.
 * @param {string} nameOrId
 * @returns {Promise<Object>}
 */
export async function fetchFullPokemon(nameOrId) {
  console.log(`[allPokemonService] fetchFullPokemon start for "${nameOrId}"`);

  // 1) core data + species in parallel
  const [ core, species ] = await Promise.all([
    fetchPokemonData(nameOrId),
    fetchPokemonSpecies(nameOrId)
  ]);
  console.log('[allPokemonService] core + species loaded:', core, species);

  // 2) evolution chain
  const evoUrl = species.evolution_chain; // make sure your species includes this URL
  console.log('[allPokemonService] fetching evolution chain URL:', evoUrl);
  const evolution = await fetchEvolutionChain(evoUrl);
  console.log('[allPokemonService] evolution chain loaded:', evolution);

  return { ...core, ...species, evolution };
}
