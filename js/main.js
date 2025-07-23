// js/main.js

import { fetchPokemonList, fetchPokemonData } from './api.js';
import { populateDropdown, renderBattleScreen, logTurn, updateHpBar, announceWinner } from './ui.js';
import { simulateBattle } from './battle.js';
import { saveBattleResult } from './storage.js';

async function init() {
  try {
    const list = await fetchPokemonList(50, 0);
    populateDropdown('pokemon1', list);
    populateDropdown('pokemon2', list);
  } catch (err) {
    alert('Failed to load Pokémon list: ' + err.message);
    console.error(err);
  }

  document.getElementById('compareBtn').addEventListener('click', startBattle);
}

async function startBattle() {
  const p1name = document.getElementById('pokemon1').value;
  const p2name = document.getElementById('pokemon2').value;
  if (!p1name || !p2name) return alert('Pick two Pokémon!');

  const [p1, p2] = await Promise.all([
    fetchPokemonData(p1name),
    fetchPokemonData(p2name)
  ]);

  renderBattleScreen(p1, p2);
  simulateBattle(
    p1, p2,
    // onUpdate
    (att, def, dmg, hp1, hp2, max1, max2) => {
      logTurn(`${att.name} hits ${def.name} for ${dmg} damage.`);
      // update the correct HP bar
      if (def === p2) updateHpBar('poke2HpBar', hp2/max2);
      else updateHpBar('poke1HpBar', hp1/max1);
    },
    // onComplete
    winner => {
      announceWinner(winner.name);
      saveBattleResult(p1.name, p2.name, winner.name);
    }
  );
}

init();
