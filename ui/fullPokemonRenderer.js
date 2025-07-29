// ui/fullPokemonRenderer.js
import { renderPokemonInfo } from './infoRenderer.js';
import { renderEvolution }  from './evolutionRenderer.js';

export function renderFullPokemon(data) {
  renderPokemonInfo(data);
  const container = document.getElementById('pokemon-details');
  const evoDiv = document.createElement('div');
  evoDiv.className = 'evolution-chain';
  evoDiv.innerHTML = `
    <h3>Evolution Chain</h3>
    <div class="evo-list">${renderEvolution(data.evolution)}</div>
  `;
  container.appendChild(evoDiv);
}
