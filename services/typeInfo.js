import { fetchPokemonList, fetchPokemonData } from './api.js';
import { fetchTypeRelations }                 from './typeService.js';
import { renderTypeInfo }                     from '../ui/typeInfoRenderer.js';
import { populateDropdown }                   from '../ui/renderer.js';  // reuse your dropdown helper

async function init() {
  // 1) populate Pokémon dropdown
  const names = await fetchPokemonList();
  populateDropdown('pokemon-select', names);

  // 2) on click, fetch that Pokémon’s types and then damage relations
  document
    .getElementById('show-types-btn')
    .addEventListener('click', async () => {
      const name = document.getElementById('pokemon-select').value;
      if (!name) return alert('Please pick a Pokémon.');
      
      // fetch its core data (to learn its types)
      const pkmn = await fetchPokemonData(name);
      
      // fetch the damage relations for *each* of its types in parallel
      const typeTables = await Promise.all(
        pkmn.types.map(t => fetchTypeRelations(t))
      );

      // render the union of those tables
      renderTypeInfo(pkmn.name, typeTables);
    });
}

document.addEventListener('DOMContentLoaded', init);
