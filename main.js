// main.js

import { fetchPokemonList, fetchPokemonData } from './services/api.js';
import { fetchTypeRelations }                from './services/typeService.js';
import { simulateBattle }                    from './services/battleEngine.js';
import { calcEffectiveness }                 from './services/effectiveness.js';

import { showOutput }            from './ui/dom.js';
import {
  populateDropdown,
  renderBattleScreen,
  logTurn,
  updateHpBar,
  announceWinner
}                               from './ui/renderer.js';
import { animateHit, animateHpBar } from './ui/animations.js';

import { enterArena, exitArena }  from './ui/state.js';
import { saveBattleResult }       from './storage.js';

async function init() {
  // Initial landing text
  showOutput('Select two Pokémon and click "Start Battle".');

  // Populate the dropdowns
  try {
    const list = await fetchPokemonList(50, 0);
    populateDropdown('pokemon1', list);
    populateDropdown('pokemon2', list);
  } catch (err) {
    console.error(err);
    showOutput('❌ ' + err.message);
  }

  // Wire up buttons
  document.getElementById('compareBtn')
    .addEventListener('click', startBattle);

  document.getElementById('resetBtn')
    .addEventListener('click', () => {
      exitArena();
      showOutput('Select two Pokémon and click "Start Battle".');
      ['pokemon1','pokemon2'].forEach(id => {
        const sel = document.getElementById(id);
        if (sel) sel.selectedIndex = 0;
      });
    });
}

async function startBattle() {
  const p1name = document.getElementById('pokemon1').value;
  const p2name = document.getElementById('pokemon2').value;

  if (!p1name || !p2name) {
    showOutput('Please select both Pokémon.');
    return;
  }

  showOutput(`Loading ${p1name} vs ${p2name}…`);

  try {
    // Fetch Pokémon data in parallel
    const [p1, p2] = await Promise.all([
      fetchPokemonData(p1name),
      fetchPokemonData(p2name)
    ]);

    // Fetch type relations
    const allTypes = [...new Set([...p1.types, ...p2.types])];
    const typeMap = {};
    await Promise.all(
      allTypes.map(async t => {
        typeMap[t] = await fetchTypeRelations(t);
      })
    );

    // Pre‑battle analysis
    const initialEff = calcEffectiveness(p1.types, p2.types, typeMap);
    let effText;
    if (initialEff === 0) effText = 'ineffective';
    else if (initialEff > 1) effText = 'super‑effective';
    else if (initialEff < 1) effText = 'not very effective';
    else effText = 'effective';

    showOutput(
      `Type effectiveness: ${p1.name} → ${p2.name} is ${effText} (×${initialEff})`
    );

    // Render and switch to arena
    renderBattleScreen(p1, p2);
    enterArena();

    // Run the battle simulation
    simulateBattle(
      p1, p2, typeMap,
      (att, def, dmg, hp1, hp2, max1, max2, eff) => {
        let emot;
        if (eff === 0) emot = 'ineffective';
        else if (eff > 1) emot = 'super‑effective';
        else if (eff < 1) emot = 'not very effective';
        else emot = 'effective';

        logTurn(`${att.name} attacks ${def.name} (${emot}) for ${dmg} damage.`);

        if (def === p2) {
          updateHpBar('poke2HpBar', hp2 / max2);
          animateHpBar('poke2HpBar');
          animateHit('poke2Img');
        } else {
          updateHpBar('poke1HpBar', hp1 / max1);
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

// Kick things off
init();
