// services/evolutionService.js
const API_BASE = 'https://pokeapi.co/api/v2/evolution-chain/';
let _evoCache = {};

export async function fetchEvolutionChain(urlOrId) {
  const endpoint = urlOrId.startsWith('http')
    ? urlOrId
    : `${API_BASE}${urlOrId}`;
  if (_evoCache[endpoint]) return _evoCache[endpoint];

  const res = await fetch(endpoint);
  if (!res.ok) throw new Error(`Evolution chain not found (${res.status})`);
  const { chain } = await res.json();
  _evoCache[endpoint] = chain;
  return chain;
}
