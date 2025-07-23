// js/main.js

import { fetchPokemonList, fetchPokemonData } from './api.js';
import { populateDropdown, showOutput } from './ui.js';
import { compareStats } from './battle.js';
import { saveBattleResult } from './storage.js';

async function init() {
  try {
    showOutput('Loading Pokémon list…');
    const list = await fetchPokemonList(50, 0);

    console.log('✅ API returned list of Pokémon:', list);
    if (!Array.isArray(list) || list.length === 0) {
      throw new Error('Empty list returned');
    }

    // Populate both dropdowns
    populateDropdown('pokemon1', list);
    populateDropdown('pokemon2', list);

    showOutput('Select two Pokémon and click “Compare Stats”');
  } catch (err) {
    console.error('❌ Failed to fetch Pokémon list:', err);
    showOutput('❌ Could not load Pokémon list: ' + err.message);
  }

  // Wire up the button regardless
  document.getElementById('compareBtn')
    .addEventListener('click', onCompare);
}

async function onCompare() {
  const p1 = document.getElementById('pokemon1').value;
  const p2 = document.getElementById('pokemon2').value;

  if (!p1 || !p2) {
    showOutput('Please select both Pokémon before comparing.');
    return;
  }

  showOutput(`Loading data for ${p1} and ${p2}…`);

  try {
    const [data1, data2] = await Promise.all([
      fetchPokemonData(p1),
      fetchPokemonData(p2)
    ]);

    console.log('Fetched Pokémon data:', data1, data2);

    const result = compareStats(data1.stats, data2.stats);

    showOutput({
      you: { name: data1.name, stats: data1.stats },
      opponent: { name: data2.name, stats: data2.stats },
      comparison: result
    });

    saveBattleResult(data1.name, data2.name, result);

  } catch (err) {
    console.error('❌ Error fetching Pokémon data:', err);
    showOutput('❌ Error fetching data: ' + err.message);
  }
}

// Kick off the app
init();
