import { capitalize } from './utils.js';

/**
 * Flattens the nested chain into an array of species names
 */
function walkChain(chain, out = []) {
  out.push(chain.species.name);
  chain.evolves_to.forEach(next => walkChain(next, out));
  return out;
}

/**
 * Returns HTML string for the evolution line: Bulbasaur → Ivysaur → Venusaur
 */
export function renderEvolution(chain) {
  const stages = walkChain(chain);
  return stages
    .map(n => `<span class="evo-stage">${capitalize(n)}</span>`)
    .join(' <span class="evo-arrow">→</span> ');
}