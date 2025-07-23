// main.js

import { fetchPokemonList, fetchPokemonData } from './services/api.js';
import { fetchTypeRelations }                from './services/typeService.js';
import { simulateBattle }                    from './services/battleEngine.js';
import { calcEffectiveness }                 from './services/effectiveness.js';

import { showOutput }                        from './ui/dom.js';
import {
  populateDropdown,
  renderBattleScreen,
  updateHpBar,
  announceWinner
}                                           from './ui/renderer.js';
import { animateBounce, animateHpBar }       from './ui/animations.js';
import { enterArena, exitArena }             from './ui/state.js';


async function init() {
  showOutput('Select two Pokémon and click "Start Battle".');

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

  document.getElementById('resetBtn').addEventListener('click', () => {
  exitArena();

  // reset HP bars back to full
  updateHpBar('poke1HpBar', 1);
  updateHpBar('poke2HpBar', 1);

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

    // Fetch type relations
    const allTypes = [...new Set([...p1.types, ...p2.types])];
    const typeMap = {};
    await Promise.all(
      allTypes.map(async t => {
        typeMap[t] = await fetchTypeRelations(t);
      })
    );

    // Pre‑battle effectiveness (optional debug)
    const initialEff = calcEffectiveness(p1.types, p2.types, typeMap);
    let effText;
    if (initialEff === 0) effText = 'ineffective';
    else if (initialEff > 1) effText = 'super‑effective';
    else if (initialEff < 1) effText = 'not very effective';
    else effText = 'effective';
    showOutput(
      `Type effectiveness: ${p1.name} → ${p2.name} is ${effText} (×${initialEff})`
    );

    // Render the battle screen
    renderBattleScreen(p1, p2);
    enterArena();

    // Run the simulation
    simulateBattle(
      p1, p2, typeMap,
      (att, def, dmg, hp1, hp2, max1, max2, eff) => {
        // Which side got hit?
        const target = def === p2 ? 'p2' : 'p1';

        // Update & flash their HP bar
        const barId   = target === 'p2' ? 'poke2HpBar' : 'poke1HpBar';
        const newFrac = target === 'p2' ? hp2/max2 : hp1/max1;
        updateHpBar(barId, newFrac);
        animateHpBar(barId);

        // Bounce the sprite
        animateBounce(target);
      },
      winner => {
        announceWinner(winner.name);
      }
    );

  } catch (err) {
    console.error(err);
    showOutput('❌ ' + err.message);
  }
}

init();
