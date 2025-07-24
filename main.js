import { fetchPokemonList, fetchPokemonData } from './services/api.js';
import { fetchTypeRelations }                from './services/typeService.js';
import { simulateBattle }                    from './services/battleEngine.js';
import { calcEffectiveness }                 from './services/effectiveness.js';

import { showOutput }                        from './ui/dom.js';
import {
  populateDropdown,
  renderBattleScreen,
  updateHpBar,
  announceWinner,
  logBattle
}                                           from './ui/renderer.js';
import { animateBounce, animateHpBar }       from './ui/animations.js';
import { enterArena, exitArena }             from './ui/state.js';

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

async function init() {
  // grab UI elements for toggling
  const selectorContainer = document.getElementById('selectorContainer');
  const output            = document.getElementById('output');
  const battleContainer   = document.getElementById('battleContainer');
  const battleLog         = document.getElementById('battleLog');
  const resetContainer    = document.getElementById('resetContainer');

  showOutput('Select two Pokémon and click "Start Battle".');

  // Populate dropdowns
  try {
    const list = await fetchPokemonList();
    console.log('📝 fetched Pokémon list → first 10:', list.slice(0, 10));
    populateDropdown('pokemon1', list);
    populateDropdown('pokemon2', list);
    console.log('✅ populateDropdown called for pokemon1 & pokemon2');
  } catch (err) {
    console.error(err);
    showOutput('❌ ' + err.message);
  }

  // Start Battle button
  document.getElementById('compareBtn').addEventListener('click', async () => {
    const p1name = document.getElementById('pokemon1').value;
    const p2name = document.getElementById('pokemon2').value;
    if (!p1name || !p2name) {
      showOutput('Please select both Pokémon.');
      return;
    }

    // toggle UI
    selectorContainer.classList.add('hidden');
    output.classList.remove('hidden');
    battleContainer.classList.remove('hidden');
    battleLog.classList.remove('hidden');

    showOutput(`Loading ${p1name} vs ${p2name}…`);
    try {
      const [p1, p2] = await Promise.all([
        fetchPokemonData(p1name),
        fetchPokemonData(p2name)
      ]);

      // fetch type relations
      const allTypes = [...new Set([...p1.types, ...p2.types])];
      const typeMap  = {};
      await Promise.all(allTypes.map(async t => {
        typeMap[t] = await fetchTypeRelations(t);
      }));

      // show type effectiveness
      const eff = calcEffectiveness(p1.types, p2.types, typeMap);
      const effText = eff === 0
        ? 'ineffective'
        : eff > 1
          ? 'super‑effective'
          : 'not very effective';
      showOutput(
        `Type: ${capitalize(p1.name)} → ${capitalize(p2.name)} is ${effText} (×${eff})`
      );

      // render and fight
      renderBattleScreen(p1, p2);
      enterArena();
      simulateBattle(
        p1, p2, typeMap,
        (att, def, dmg, hp1, hp2, max1, max2) => {
          logBattle(`${capitalize(att.name)} hits ${capitalize(def.name)} for ${dmg} damage`);
          const barId = def === p2 ? 'poke2HpBar' : 'poke1HpBar';
          const frac  = def === p2 ? hp2 / max2 : hp1 / max1;
          updateHpBar(barId, frac);
          animateHpBar(barId);
          animateBounce(def === p2 ? 'p2' : 'p1');
        },
        winner => {
          logBattle(`${capitalize(winner.name)} wins!`);
          announceWinner(capitalize(winner.name));
          resetContainer.classList.remove('hidden');
        }
      );
    } catch (err) {
      console.error(err);
      showOutput('❌ ' + err.message);
    }
  });

  // Reset Battle button
  document.getElementById('resetBtn').addEventListener('click', () => {
    exitArena();
    battleContainer.classList.add('hidden');
    battleLog.classList.add('hidden');
    output.classList.add('hidden');
    resetContainer.classList.add('hidden');
    selectorContainer.classList.remove('hidden');

    updateHpBar('poke1HpBar', 1);
    updateHpBar('poke2HpBar', 1);
    showOutput('Select two Pokémon and click "Start Battle".');
    ['pokemon1', 'pokemon2'].forEach(id => {
      document.getElementById(id).selectedIndex = 0;
    });
  });
}

// ▼ ensure init runs after the DOM is parsed ▼
document.addEventListener('DOMContentLoaded', init);
