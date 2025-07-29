// services/battleEngine.js
import { calcEffectiveness } from './effectiveness.js';

/**
 * Simulate turn‑based battle. 
 * Calls onUpdate(att, def, dmg, hp1, hp2, max1, max2, eff) each turn,
 * and onComplete(winner) when done.
 */
export function simulateBattle(p1, p2, typeMap, onUpdate, onComplete) {
  let hp1 = p1.stats.hp, hp2 = p2.stats.hp;
  const firstIsP1 = p1.stats.speed >= p2.stats.speed;
  let turn = 0;

  const iv = setInterval(() => {
    // end condition
    if (hp1 <= 0 || hp2 <= 0) {
      clearInterval(iv);
      onComplete(hp1 > 0 ? p1 : p2);
      return;
    }

    // choose attacker/defender
    const attacker = (turn % 2 === 0
      ? (firstIsP1 ? p1 : p2)
      : (firstIsP1 ? p2 : p1)
    );
    const defender = attacker === p1 ? p2 : p1;

    // stats
    const attack  = attacker.stats.attack;
    const defense = defender.stats.defense;
    const eff     = calcEffectiveness(attacker.types, defender.types, typeMap);

    // new Pokémon‑style formula
    const level = 50;               // you can tweak this
    const power = 50;               // you can tweak this
    const randomFactor = 0.85 + Math.random() * 0.15;
    const baseCalc = ((2 * level) / 5 + 2) * power * (attack / defense) / 50 + 2;
    const rawDmg  = Math.floor(baseCalc * eff * randomFactor);
    const dmg     = Math.max(1, rawDmg);

    // apply damage
    if (defender === p2) hp2 -= dmg;
    else                hp1 -= dmg;

    // callback update
    onUpdate(attacker, defender, dmg, hp1, hp2, p1.stats.hp, p2.stats.hp, eff);

    turn++;
  }, 1000);
}
