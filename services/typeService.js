// services/typeService.js
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
  const { damage_relations: dr } = await res.json();
  const result = {
    // Legacy keys your battle engine uses:
    double:    dr.double_damage_to.map(t => t.name),
    half:      dr.half_damage_to.map(t => t.name),
    immune:    dr.no_damage_to.map(t => t.name),

    // New full keys for the Type‑Info renderer:
    double_damage_to:   dr.double_damage_to.map(t => t.name),
    half_damage_to:     dr.half_damage_to.map(t => t.name),
    no_damage_to:       dr.no_damage_to.map(t => t.name),
    double_damage_from: dr.double_damage_from.map(t => t.name),
    half_damage_from:   dr.half_damage_from.map(t => t.name),
    no_damage_from:     dr.no_damage_from.map(t => t.name)
  };
   cache[typeName] = result;
   return result;
 }