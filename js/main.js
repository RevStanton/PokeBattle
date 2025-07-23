// js/main.js

import {
  fetchPokemonList,
  fetchPokemonData,
  fetchTypeRelations
} from './api.js';

import {
  populateDropdown,
  showOutput,
  renderBattleScreen,
  logTurn,
  updateHpBar,
  animateHit,
  animateHpBar,
  announceWinner
} from './ui.js';

import { simulateBattle } from './battle.js';
import { saveBattleResult } from './storage.js';

let lastP1, lastP2, lastTypeMap;

async function init() {
  showOutput('Loading Pokémon list…');
  try {
    const list = await fetchPokemonList(50, 0);
    populateDropdown('pokemon1', list);
    populateDropdown('pokemon2', list);
    showOutput('Select two Pokémon and click "Start Battle".');
  } catch (err) {
    console.error(err);
    showOutput('❌ ' + err.message);
  }
  document.getElementById('compareBtn')
    .addEventListener('click', startBattle);
  document.getElementById('resetBtn')
    .addEventListener('click', resetBattle);
}

async function startBattle() {
  const p1name = document.getElementById('pokemon1').value;
  const p2name = document.getElementById('pokemon2').value;
  if (!p1name || !p2name) {
    showOutput('Please select both Pokémon.');
    return;
  }

  showOutput(`Loading data for ${p1name} vs ${p2name}…`);

  try {
    // 1) Fetch both Pokémon
    const [p1, p2] = await Promise.all([
      fetchPokemonData(p1name),
      fetchPokemonData(p2name)
    ]);

    // 2) Fetch type relations
    const allTypes = [...new Set([...p1.types, ...p2.types])];
    const typeMap = {};
    await Promise.all(allTypes.map(async t => {
      typeMap[t] = await fetchTypeRelations(t);
    }));

    // Save last battle data for potential future use
    lastP1 = p1; lastP2 = p2; lastTypeMap = typeMap;

    // 3) Show battle UI
    renderBattleScreen(p1, p2);
    document.getElementById('output').classList.add('hidden');
    document.getElementById('resetContainer').classList.remove('hidden');

    // 4) Simulate
    simulateBattle(
      p1, p2, typeMap,
      (att, def, dmg, hp1, hp2, max1, max2, eff) => {
        const emot = eff === 0 ? 'ineffective'
                   : eff > 1 ? 'super‑effective'
                   : eff < 1 ? 'not very effective'
                   : 'effective';
        logTurn(`${att.name} attacks ${def.name} (${emot}) for ${dmg} damage.`);
        if (def === p2) {
          updateHpBar('poke2HpBar', hp2/max2);
          animateHpBar('poke2HpBar');
          animateHit('poke2Img');
        } else {
          updateHpBar('poke1HpBar', hp1/max1);
          animateHpBar('poke1HpBar');
          animateHit('poke1Img');
        }
      },
      winner => {
        announceWinner(winner.name);
        saveBattleResult(p1name, p2name, winner);
      }
    );

  } catch (err) {
    console.error(err);
    showOutput('❌ ' + err.message);
  }
}

function resetBattle() {
  // Hide battle and reset button, show selector + debug
  document.getElementById('battleContainer').classList.add('hidden');
  document.getElementById('resetContainer').classList.add('hidden');
  document.getElementById('output').classList.remove('hidden');
  showOutput('Select two Pokémon and click "Start Battle".');
  document.getElementById('selector').classList.remove('hidden');
  document.getElementById('battleLog').innerHTML = '';
}

init();
