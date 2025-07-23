// js/battle.js

/** 
 * Compare two stats objects side‑by‑side.
 * For now just bundle them up.
 */
export function compareStats(stats1, stats2) {
  return { you: stats1, opponent: stats2 };
}
