// js/ui/renderer.js

// Populate the two dropdowns
export function populateDropdown(id, list) {
  const sel = document.getElementById(id);
  if (!sel) return console.error(`No <select> with id="${id}"`);
  sel.innerHTML =
    '<option value="">Select…</option>' +
    list.map(name => `<option value="${name}">${capitalize(name)}</option>`).join('');
}

// Capitalize helper
function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}

/** Show the battle screen, hide the selector & debug */
export function renderBattleScreen(p1, p2) {
  const selCont  = document.getElementById('selectorContainer');
  const outp     = document.getElementById('output');
  const battle   = document.getElementById('battleContainer');
  const reset    = document.getElementById('resetContainer');

  // grab elements
  const img1     = document.getElementById('poke1Img');
  const name1    = document.getElementById('poke1Name');
  const img2     = document.getElementById('poke2Img');
  const name2    = document.getElementById('poke2Name');

  if (!img1 || !name1 || !img2 || !name2 || !selCont || !battle || !reset || !outp) {
    console.error('Missing one or more battle screen elements');
    return;
  }

  // set sprites & names
  img1.src      = p1.sprites.front_default;
  name1.textContent = capitalize(p1.name);
  img2.src      = p2.sprites.front_default;
  name2.textContent = capitalize(p2.name);

  // toggle screens
  selCont .classList.add('hidden');
  outp    .classList.add('hidden');
  battle  .classList.remove('hidden');
  reset   .classList.remove('hidden');
}

export function logTurn(msg) {
  // optional: keep your text log around if you like
  const outp = document.getElementById('output');
  if (outp) outp.textContent += `\n${msg}`;
}

export function updateHpBar(id, fraction) {
  const bar = document.getElementById(id);
  if (bar) bar.style.width = `${Math.max(0, fraction*100)}%`;
}

export function announceWinner(name) {
  const outp = document.getElementById('output');
  if (outp) outp.textContent = `🏆 ${name.toUpperCase()} WINS!`;
}
