// js/battle.js

/**
 * Simulate a simple turn‑based fight:
 * - p1 always goes first
 * - damage = max(1, attacker.attack - defender.defense/4)
 * - call onUpdate(attacker, defender, dmg, newHpAtt, newHpDef)
 * - call onComplete(winner)
 */
export function simulateBattle(p1, p2, onUpdate, onComplete) {
  const max1 = p1.stats.hp, max2 = p2.stats.hp;
  let hp1 = max1, hp2 = max2, turn = 0;

  const interval = setInterval(() => {
    if (hp1 <= 0 || hp2 <= 0) {
      clearInterval(interval);
      const winner = hp1 > 0 ? p1 : p2;
      onComplete(winner);
      return;
    }

    const attacker = (turn % 2 === 0) ? p1 : p2;
    const defender = (turn % 2 === 0) ? p2 : p1;
    let dmg = Math.max(1, attacker.stats.attack - (defender.stats.defense/4));
    if (defender === p2) hp2 -= dmg; else hp1 -= dmg;

    onUpdate(attacker, defender, dmg, hp1, hp2, max1, max2);
    turn++;
  }, 1000);
}
