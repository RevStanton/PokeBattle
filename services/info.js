// services/info.js
import {
  fetchPokemonList,
  fetchPokemonData,
  fetchPokemonSpecies,
  fetchAbilityInfo,
  fetchEvolutionChain
} from './api.js';
import { renderPokemonInfo } from '../ui/infoRenderer.js';

document.addEventListener('DOMContentLoaded', () => {
  const searchInput      = document.getElementById('pokemon-search');
  const datalist         = document.getElementById('pokemon-list');
  const viewBtn          = document.getElementById('view-btn');
  const detailsContainer = document.getElementById('pokemon-details');
  if (!searchInput || !datalist || !viewBtn || !detailsContainer) return;

  let allPokemon = [];

  // 1) Load and cache all Pokémon names
  (async () => {
    try {
      allPokemon = await fetchPokemonList();
      datalist.innerHTML = ''; // start empty
    } catch (err) {
      console.error('Could not load Pokémon list:', err);
      alert('Pokédex is unavailable right now.');
    }
  })();

  // 2) Live-filter the datalist as you type
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) return (datalist.innerHTML = '');

    datalist.innerHTML = allPokemon
      .filter(name => name.includes(q))
      .slice(0, 20)
      .map(name => `<option value="${name}">`)
      .join('');
  });

  // 3) On button click, fetch core + species + abilities and render
  viewBtn.addEventListener('click', async () => {
    const name = searchInput.value.trim().toLowerCase();
    if (!name) return alert('Please select a Pokémon from the list.');

    detailsContainer.innerHTML = '<p>Loading…</p>';
    try {
      // Fetch core data and species in parallel
      const [baseData, speciesData] = await Promise.all([
        fetchPokemonData(name),
        fetchPokemonSpecies(name)
      ]);

      // Then fetch each ability’s info
      const abilityDetails = await Promise.all(
        baseData.abilities.map(ab => fetchAbilityInfo(ab))
      );
       const evolution = await Promise.all(
        evoNames.map(n => fetchPokemonData(n))
      );
      // Merge everything and hand it to your renderer
      renderPokemonInfo({
        ...baseData,
        ...speciesData,
        abilityDetails,
        evolution
      });
    } catch (err) {
      console.error('Error loading Pokémon data:', err);
      detailsContainer.innerHTML = '<p>Error loading data. Check the console.</p>';
    }
  });
});
