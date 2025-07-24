import { fetchPokemonList, fetchPokemonData } from './services/api.js';
import { renderPokemonInfo } from './ui/infoRenderer.js';

const searchInput = document.getElementById('pokemon-search');
const datalist = document.getElementById('pokemon-list');
const viewBtn = document.getElementById('view-btn');
const detailsContainer = document.getElementById('pokemon-details');

async function init() {
  try {
    const names = await fetchPokemonList();
    datalist.innerHTML = names.map(name => `<option value="${name}">`).join('');
  } catch (err) {
    console.error('Error loading Pokémon list:', err);
    alert('Could not load Pokédex data. Please try again later.');
  }

  viewBtn.addEventListener('click', onViewClick);
}

async function onViewClick() {
  const name = searchInput.value.trim().toLowerCase();
  if (!name) {
    alert('Please select a Pokémon from the list.');
    return;
  }
  detailsContainer.innerHTML = '<p>Loading...</p>';
  try {
    const data = await fetchPokemonData(name);
    renderPokemonInfo(data);
  } catch (err) {
    console.error('Error fetching Pokémon data:', err);
    detailsContainer.innerHTML = '<p>Error loading data. Check the console for details.</p>';
  }
}

document.addEventListener('DOMContentLoaded', init);
