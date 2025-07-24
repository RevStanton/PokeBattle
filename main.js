// main.js
const selector   = document.getElementById('selectorContainer');
const battlePane = document.getElementById('battleContainer');
const output     = document.getElementById('output');
const log        = document.getElementById('battleLog');
const resetPane  = document.getElementById('resetContainer');

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

/** Capitalize a string’s first letter */
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

async function init() {
  showOutput('Select two Pokémon and click "Start Battle".');

  try {
    const list = await fetchPokemonList();
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

    // 1) hide everything
    battlePane.classList.add('hidden');
    log.classList.add('hidden');
    output.classList.add('hidden');
    resetPane.classList.add('hidden');

    // 2) show selector again
    selector.classList.remove('hidden');

    // 3) reset HP bars & dropdowns as you already do
    updateHpBar('poke1HpBar', 1);
    updateHpBar('poke2HpBar', 1);
    showOutput('Select two Pokémon and click "Start Battle".');
    ['pokemon1', 'pokemon2'].forEach(id => {
      document.getElementById(id).selectedIndex = 0;
    });
  });


async function startBattle() {
  // 0) toggle visibility
  selector.classList.add('hidden');
  output.classList.remove('hidden');
  battlePane.classList.remove('hidden');
  log.classList.remove('hidden');

  const p1name = document.getElementById('pokemon1').value;
  const p2name = document.getElementById('pokemon2').value;
  // … rest of your existing code


  showOutput(`Loading ${p1name} vs ${p2name}…`);
  try {
    // Fetch both Pokémon
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

    // Pre‑battle effectiveness (debug)
    const initialEff = calcEffectiveness(p1.types, p2.types, typeMap);
    let effText = initialEff === 0
      ? 'ineffective'
      : initialEff > 1
        ? 'super‑effective'
        : initialEff < 1
          ? 'not very effective'
          : 'effective';
    showOutput(
      `Type effectiveness: ${capitalize(p1.name)} → ${capitalize(p2.name)} is ${effText} (×${initialEff})`
    );

    // Show battle screen & log
    renderBattleScreen(p1, p2);
    enterArena();
    const log = document.getElementById('battleLog');
    if (log) log.classList.remove('hidden');

    // Simulate the fight
    simulateBattle(
      p1, p2, typeMap,

      // onUpdate callback
      (att, def, dmg, hp1, hp2, max1, max2, eff) => {
        const attackerName = capitalize(att.name);
        const defenderName = capitalize(def.name);

        // 1) Log the hit
        logBattle(`${attackerName} hits ${defenderName} for ${dmg} damage`);

        // 2) Update & flash HP
        const target = def === p2 ? 'p2' : 'p1';
        const barId   = target === 'p2' ? 'poke2HpBar' : 'poke1HpBar';
        const newFrac = target === 'p2'
          ? hp2 / max2
          : hp1 / max1;
        updateHpBar(barId, newFrac);
        animateHpBar(barId);

        // 3) Bounce the defender sprite
        animateBounce(target);
      },

      // onComplete callback
      winner => {
        const winnerName = capitalize(winner.name);
        logBattle(`${winnerName} wins!`);
        announceWinner(winnerName);
      }
    );

  } catch (err) {
    console.error(err);
    showOutput('❌ ' + err.message);
  }
}

init();
