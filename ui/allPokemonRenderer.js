import { capitalize } from './utils.js';

/**
 * Render a grid of sprite+name cards inside #all-pokemon-container
 */
export function renderPokemonList(list) {
  const container = document.getElementById('all-pokemon-container');
  container.innerHTML = list
    .map(({ name, url }) => {
      const id = url.split('/').filter(Boolean).pop();
      const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
      return `
        <div class="pkmn-card" data-name="${name}">
          <img src="${spriteUrl}" alt="${name}" />
          <div class="pkmn-name">${capitalize(name)}</div>
        </div>
      `;
    })
    .join('');
}

export function renderPokemonList(list) {
  console.log('[Renderer] renderPokemonList got', list.length, 'entries');
  const container = document.getElementById('all-pokemon-container');
  if (!container) return console.error('[Renderer] missing container');
  /* … existing code … */
}
