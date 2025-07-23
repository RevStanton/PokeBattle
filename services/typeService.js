// js/services/typeService.js
import { fetchPokemonData } from './api.js'; // if needed

const API_BASE = 'https://pokeapi.co/api/v2/type/';
const cache = {};

/**
 * Returns an object { double:[], half:[], immune:[] }
 * for the given typeName, caching results.
 */
export async function fetchTypeRelations(typeName) {
  if (cache[typeName]) return cache[typeName];
  const res = await fetch(`${API_BASE}${typeName}`);
  if (!res.ok) throw new Error(`Type "${typeName}" not found`);
  const { damage_relations } = await res.json();
  const result = {
    double: damage_relations.double_damage_to.map(t => t.name),
    half:   damage_relations.half_damage_to.map(t => t.name),
    immune: damage_relations.no_damage_to.map(t => t.name)
  };
  cache[typeName] = result;
  return result;
}
