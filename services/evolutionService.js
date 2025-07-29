const API_BASE = 'https://pokeapi.co/api/v2/evolution-chain/';
let _evoCache = {};

/**
 * Given a full URL or an ID, returns the nested `chain` object
 */
export async function fetchEvolutionChain(urlOrId) {
  const endpoint = urlOrId.startsWith('http')
    ? urlOrId
    : `${API_BASE}${urlOrId}`;
  if (_evoCache[endpoint]) return _evoCache[endpoint];

  const res = await fetch(endpoint);
  if (!res.ok) throw new Error(`Failed to load evolution chain ${endpoint}`);
  const { chain } = await res.json();
  _evoCache[endpoint] = chain;
  return chain;
}