// js/ui/animations.js

/** Float a damage number above the specified side ('p1' or 'p2') */
export function animateDamage(side, dmg) {
  const card = document.querySelector(`.battle-card[data-pokemon="${side}"] .sprite-container`);
  const dmgEl = document.createElement('div');
  dmgEl.className = 'damage-number';
  dmgEl.textContent = `-${dmg}`;
  dmgEl.style.left = '50%';
  dmgEl.style.transform = 'translateX(-50%)';
  card.appendChild(dmgEl);
  dmgEl.addEventListener('animationend', () => card.removeChild(dmgEl));
}

/** Show a type effect over the specified side */
export function animateTypeEffect(side, type) {
  const layer = document.querySelector(`.battle-card[data-pokemon="${side}"] .effect-layer`);
  const cls = type === 'fire'     ? 'fire-effect'
             : type === 'water'    ? 'water-effect'
             : type === 'electric' ? 'electric-effect'
             : null;
  if (!cls) return;
  const fx = document.createElement('div');
  fx.className = cls;
  layer.appendChild(fx);
  fx.addEventListener('animationend', () => layer.removeChild(fx));
}
