// js/ui.js

export function populateDropdown(selectId, names) {
  const sel = document.getElementById(selectId);
  sel.innerHTML = names.map(n =>
    `<option value="${n}">${n.charAt(0).toUpperCase() + n.slice(1)}</option>`
  ).join('');
}

export function showOutput(content) {
  const out = document.getElementById('output');
  if (!out) return;
  out.textContent = typeof content === 'object'
    ? JSON.stringify(content, null, 2)
    : content;
}

export function renderBattleScreen(p1, p2) {
  document.getElementById('selectorContainer').classList.add('hidden');
  document.getElementById('output').classList.add('hidden');
  document.getElementById('battleContainer').classList.remove('hidden');
  document.getElementById('resetContainer').classList.remove('hidden');

  // Pokémon 1
  const img1 = document.getElementById('poke1Img');
  img1.src = p1.sprite;
  img1.alt = p1.name;
  document.getElementById('poke1Name').textContent = p1.name;

  // Pokémon 2
  const img2 = document.getElementById('poke2Img');
  img2.src = p2.sprite;
  img2.alt = p2.name;
  document.getElementById('poke2Name').textContent = p2.name;

  // Reset HP & log
  document.getElementById('poke1HpBar').style.width = '100%';
  document.getElementById('poke2HpBar').style.width = '100%';
  document.getElementById('battleLog').innerHTML = '';
}

export function logTurn(text) {
  const log = document.getElementById('battleLog');
  const p = document.createElement('div');
  p.textContent = text;
  log.appendChild(p);
  log.scrollTop = log.scrollHeight;
}

export function updateHpBar(barId, fraction) {
  const bar = document.getElementById(barId);
  bar.style.width = `${Math.max(0, fraction * 100)}%`;
}

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

export function announceWinner(name) {
  logTurn(`🏆 ${name.toUpperCase()} WINS!`);
}
