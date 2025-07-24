// services/info.js
import { fetchPokemonList, fetchPokemonData } from './api.js';
import { renderPokemonInfo }                  from '../ui/infoRenderer.js';

document.addEventListener('DOMContentLoaded', () => {
  const searchInput      = document.getElementById('pokemon-search');
  const datalist         = document.getElementById('pokemon-list');
  const viewBtn          = document.getElementById('view-btn');
  const detailsContainer = document.getElementById('pokemon-details');

  // Only initialize if all the Pokedex elements exist
  if (!searchInput || !datalist || !viewBtn || !detailsContainer) return;

  let allPokemon = [];

  // 1) Load the master list
  fetchPokemonList()
    .then(names => {
      allPokemon = names;
      // start with an empty datalist
      datalist.innerHTML = '';
    })
    .catch(err => {
      console.error('Could not load Pokémon list:', err);
      alert('Pokédex is unavailable right now.');
    });

  // 2) Live‑filter on every keystroke
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) {
      datalist.innerHTML = '';
      return;
    }
    const matches = allPokemon
      .filter(name => name.includes(q))
      .slice(0, 20);
    datalist.innerHTML = matches
      .map(name => `<option value="${name}">`)
      .join('');
  });

  // 3) Fetch & render on button click
  viewBtn.addEventListener('click', async () => {
    const selected = searchInput.value.trim().toLowerCase();
    if (!selected) {
      return alert('Please select a Pokémon from the list.');
    }

    detailsContainer.innerHTML = '<p>Loading…</p>';
    try {
      const data = await fetchPokemonData(selected);
      renderPokemonInfo(data);
    } catch (err) {
      console.error('Error loading Pokémon data:', err);
      detailsContainer.innerHTML = '<p>Error loading data. Check the console.</p>';
    }
  });
});
