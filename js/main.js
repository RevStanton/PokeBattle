// js/main.js
import { fetchPokemonList, fetchPokemonData } from './api.js';
import { populateDropdown, showOutput } from './ui.js';
import { compareStats } from './battle.js';
import { saveBattleResult } from './storage.js';

async function init() {
  try {
    // 1) fetch 50 Pokemon names
    const list = await fetchPokemonList(50);
    populateDropdown('pokemon1', list);
    populateDropdown('pokemon2', list);

    // 2) wire up button
    document.getElementById('compareBtn')
      .addEventListener('click', onCompare);
  } catch (err) {
    showOutput('Initialization error: ' + err.message);
    console.error(err);
  }
}

async function onCompare() {
  const p1 = document.getElementById('pokemon1').value;
  const p2 = document.getElementById('pokemon2').value;
  showOutput('Loading data for ' + p1 + ' and ' + p2 + '…');

  try {
    // fetch both in parallel
    const [data1, data2] = await Promise.all([
      fetchPokemonData(p1),
      fetchPokemonData(p2)
    ]);

    // compare
    const result = compareStats(data1.stats, data2.stats);
    showOutput({
      you: data1,
      opponent: data2,
      comparison: result
    });

    // persist (stub)
    saveBattleResult(data1.name, data2.name, result);

  } catch (err) {
    showOutput('Error fetching data: ' + err.message);
    console.error(err);
  }
}

// kick off
init();
