// ui/allPokemonRenderer.js
import { capitalize } from './utils.js';

export function renderPokemonList(list) {
  console.log('[allPokemonRenderer] rendering list, count=', Array.isArray(list) ? list.length : list);
  const container = document.getElementById('all-pokemon-container');
  if (!container) {
    console.error('[allPokemonRenderer] missing #all-pokemon-container');
    return;
  }
  container.innerHTML = list.map(({ name, url }) => {
    const id = url.split('/').filter(Boolean).pop();
    const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    return `
      <div class="pkmn-card" data-name="${name}">
        <img src="${spriteUrl}" alt="${name}" />
        <div class="pkmn-name">${capitalize(name)}</div>
      </div>
    `;
  }).join('');
}
