// js/ui/animations.js

export function animateHit(imgId) {
  const img = document.getElementById(imgId);
  img.classList.add('shake');
  setTimeout(() => img.classList.remove('shake'), 500);
}

export function animateHpBar(barId) {
  const bar = document.getElementById(barId);
  bar.classList.add('flash');
  setTimeout(() => bar.classList.remove('flash'), 300);
}
