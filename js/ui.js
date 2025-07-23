// js/ui.js

/** Populate a <select> with an array of names */
export function populateDropdown(selectId, names) {
  const select = document.getElementById(selectId);
  select.innerHTML = names.map(n =>
    `<option value="${n}">${n.charAt(0).toUpperCase()+n.slice(1)}</option>`
  ).join('');
}

/** Show the battle screen & initialize it */
export function renderBattleScreen(p1, p2) {
  document.getElementById('selector').style.display = 'none';
  const B = document.getElementById('battleContainer');
  B.style.display = 'flex';

  document.getElementById('poke1Img').src = p1.sprite;
  document.getElementById('poke2Img').src = p2.sprite;
  document.getElementById('poke1Name').textContent = p1.name;
  document.getElementById('poke2Name').textContent = p2.name;

  document.getElementById('poke1HpBar').style.width = '100%';
  document.getElementById('poke2HpBar').style.width = '100%';

  document.getElementById('battleLog').innerHTML = '';
}

/** Append a line to the battle log */
export function logTurn(text) {
  const log = document.getElementById('battleLog');
  const p = document.createElement('div');
  p.textContent = text;
  log.appendChild(p);
  log.scrollTop = log.scrollHeight;
}

/** Update a target’s HP bar */
export function updateHpBar(targetId, fraction) {
  document.getElementById(targetId).style.width = `${Math.max(0, fraction*100)}%`;
}

/** Announce the winner */
export function announceWinner(name) {
  logTurn(`🏆 ${name.toUpperCase()} WINS!`);
}
