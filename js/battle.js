// js/battle.js

/**
 * Calculate type effectiveness multiplier
 */
export function calcEffectiveness(attTypes, defTypes, typeMap) {
  let mult = 1;
  for (const atk of attTypes) {
    const rel = typeMap[atk];
    for (const def of defTypes) {
      if (rel.immune.includes(def)) return 0;
      if (rel.double.includes(def)) mult *= 2;
      else if (rel.half.includes(def)) mult *= 0.5;
    }
  }
  return mult;
}

/**
 * Simulate turn‑based battle.
 * onUpdate(att, def, dmg, hp1, hp2, max1, max2)
 * onComplete(winner)
 */
export function simulateBattle(p1, p2, typeMap, onUpdate, onComplete) {
  const max1 = p1.stats.hp, max2 = p2.stats.hp;
  let hp1 = max1, hp2 = max2, turn = 0;

  const interval = setInterval(() => {
    if (hp1 <= 0 || hp2 <= 0) {
      clearInterval(interval);
      onComplete(hp1 > 0 ? p1 : p2);
      return;
    }
    const attacker = turn % 2 === 0 ? p1 : p2;
    const defender = turn % 2 === 0 ? p2 : p1;

    const base = Math.max(1, attacker.stats.attack - defender.stats.defense/4);
    const eff  = calcEffectiveness(attacker.types, defender.types, typeMap);
    const dmg  = Math.max(1, Math.floor(base * eff));

    if (defender === p2) hp2 -= dmg;
    else hp1 -= dmg;

    onUpdate(attacker, defender, dmg, hp1, hp2, max1, max2, eff);
    turn++;
  }, 1000);
}
