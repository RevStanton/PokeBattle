// js/engine/effectiveness.js

/**
 * Given attacker.types, defender.types, and a typeMap (from fetchTypeRelations),
 * returns 0, 0.5, 1, or 2 (or multiples if dual‑typed).
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
