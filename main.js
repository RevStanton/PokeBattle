// main.js

import { fetchPokemonList, fetchPokemonData }   from './services/api.js';
import { fetchTypeRelations }                  from './services/typeService.js';
import { simulateBattle }                      from './services/battleEngine.js';
import { calcEffectiveness }                   from './services/effectiveness.js';

import { showOutput }                          from './ui/dom.js';
import {
  populateDropdown,
  renderBattleScreen,
  logTurn,
  updateHpBar,
  announceWinner
} from './ui/renderer.js';
import { animateHit, animateHpBar }            from './ui/animations.js';
import { saveBattleResult }                    from './storage.js';

import { enterArena, exitArena }               from './ui/state.js';

async function init() {
  showOutput('Select two Pokémon and click "Start Battle".');

  // Populate dropdowns
  try {
    const list = await fetchPokemonList(50, 0);
    populateDropdown('pokemon1', list);
    populateDropdown('pokemon2', list);
  } catch (err) {
    console.error(err);
    showOutput('❌ ' + err.message);
  }

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
    const [p1, p2] = await Promise.all([
      fetchPokemonData(p1name),
      fetchPokemonData(p2name)
    ]);
    const allTypes = [...new Set([...p1.types, ...p2.types])];
    const typeMap = {};
    await Promise.all(allTypes.map(t => fetchTypeRelations(t).then(r => {
      typeMap[t] = r;
    })));

    // Pre‑battle effectiveness
    const initialEff = calcEffectiveness(p1.types, p2.types, typeMap);
    const effText = initialEff === 0
      ? 'ineffective'
      : initialEff > 1
        ? 'super‑effective'
        : initialEff < 1
          ? 'not very effective'
          : 'effective';
    showOutput(`Type effectiveness: ${p1.name} → ${p2.name} is ${effText} (×${initialEff})`);

    // Render & enter arena
    renderBattleScreen(p1, p2);
    enterArena();

    // Simulate
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

init();
