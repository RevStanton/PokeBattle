// js/ui/animations.js

/** Bounce the sprite for 0.6s */
export function animateBounce(side) {
  const img = document.querySelector(
    `.battle-card[data-pokemon="${side}"] img`
  );
  if (!img) return;
  img.classList.add('bounce');
  img.addEventListener(
    'animationend',
    () => img.classList.remove('bounce'),
    { once: true }
  );
}

/** Flash the HP bar when it updates */
export function animateHpBar(id) {
  const bar = document.getElementById(id);
  if (!bar) return;
  bar.classList.add('flash');
  bar.addEventListener(
    'animationend',
    () => bar.classList.remove('flash'),
    { once: true }
  );
}
