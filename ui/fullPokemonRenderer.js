import { renderPokemonInfo } from './infoRenderer.js';
import { renderEvolution }  from './evolutionRenderer.js';

/**
 * Render full details (stats, description, abilities) + evolution chain
 */
export function renderFullPokemon(data) {
  // 1) use your existing Pokedex renderer for core + species + abilities
  renderPokemonInfo(data);

  // 2) append the evolution chain
  const container = document.getElementById('pokemon-details');
  const evoDiv = document.createElement('div');
  evoDiv.className = 'evolution-chain';
  evoDiv.innerHTML = `
    <h3>Evolution Chain</h3>
    <div class="evo-list">
      ${renderEvolution(data.evolution)}
    </div>
  `;
  container.appendChild(evoDiv);
}