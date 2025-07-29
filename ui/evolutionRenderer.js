// ui/evolutionRenderer.js
import { capitalize } from './utils.js';

function walkChain(chain, out = []) {
  out.push(chain.species.name);
  chain.evolves_to.forEach(next => walkChain(next, out));
  return out;
}

export function renderEvolution(chain) {
  if (!chain) return `<p>No evolution data.</p>`;
  const stages = walkChain(chain);
  return stages
    .map(n => `<span class="evo-stage">${capitalize(n)}</span>`)
    .join(' <span class="evo-arrow">→</span> ');
}
