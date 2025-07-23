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

async function init() {
  showOutput('Loading Pokémon list…');
  try {
    const list = await fetchPokemonList(50, 0);
    console.log('✅ Pokémon list:', list);
    if (!list.length) throw new Error('Empty list');
    populateDropdown('pokemon1', list);
    populateDropdown('pokemon2', list);
    showOutput('Select two Pokémon and click "Start Battle".');
  } catch (err) {
    console.error('❌ Failed to load list:', err);
    showOutput('❌ ' + err.message);
  }
  document.getElementById('compareBtn')
    .addEventListener('click', startBattle);
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
    const [p1, p2] = await Promise.all([
      fetchPokemonData(p1name),
      fetchPokemonData(p2name)
    ]);
    // load type relations for both
    const allTypes = [...new Set([...p1.types, ...p2.types])];
    const typeMap = {};
    await Promise.all(allTypes.map(async t => {
      typeMap[t] = await fetchTypeRelations(t);
    }));

    renderBattleScreen(p1, p2);

    simulateBattle(
      p1, p2, typeMap,
      // onUpdate
      (att, def, dmg, hp1, hp2, max1, max2, eff) => {
        const emot = eff === 0 ? 'no effect'
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
      // onComplete
      winner => {
        announceWinner(winner.name);
        saveBattleResult(p1name, p2name, winner);
      }
    );
  } catch (err) {
    console.error('❌ Battle startup error:', err);
    showOutput('❌ ' + err.message);
  }
}

init();
