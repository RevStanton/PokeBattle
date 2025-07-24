import { fetchPokemonList, fetchPokemonData } from './services/api.js';
import { renderPokemonInfo }            from './ui/infoRenderer.js';

async function init() {
  // 1) load all names
  const list = await fetchPokemonList(); 
  const datalist = document.getElementById('pokemon-list');
  list.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.name; 
    datalist.appendChild(opt);
  });

  // 2) wire button
  document.getElementById('view-btn')
    .addEventListener('click', async () => {
      const name = document.getElementById('pokemon-search').value.trim().toLowerCase();
      if (!name) return alert('Pick a Pokémon first!');
      try {
        const data = await fetchPokemonData(name);
        renderPokemonInfo(data);
      } catch (e) {
        console.error(e);
        alert('Could not fetch data—check the console.');
      }
    });
}

document.addEventListener('DOMContentLoaded', init);
