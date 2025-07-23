// js/ui/renderer.js

/** Capitalize a name */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Fill a <select> with your Pokémon list */
export function populateDropdown(id, list) {
  const sel = document.getElementById(id);
  if (!sel) return console.error(`populateDropdown: no element #${id}`);
  sel.innerHTML = 
    '<option value="">Select…</option>' +
    list.map(name => 
      `<option value="${name}">${capitalize(name)}</option>`
    ).join('');
}

/** Show the battle screen & hide the selector/debug */
export function renderBattleScreen(p1, p2) {
  const selCont  = document.getElementById('selectorContainer');
  const outp     = document.getElementById('output');
  const battle   = document.getElementById('battleContainer');
  const reset    = document.getElementById('resetContainer');

  // These must all exist
  if (!selCont || !outp || !battle || !reset) {
    console.error('renderBattleScreen: missing container elements');
    return;
  }

  // Grab UI spots
  const img1  = document.getElementById('poke1Img');
  const name1 = document.getElementById('poke1Name');
  const img2  = document.getElementById('poke2Img');
  const name2 = document.getElementById('poke2Name');

  if (!img1 || !name1 || !img2 || !name2) {
    console.error('renderBattleScreen: missing image/name elements');
    return;
  }

  // Safely pick a sprite URL (fallback to empty string if nothing)
  const sprite1 = p1.sprites?.front_default
               || p1.sprites?.other?.['official-artwork']?.front_default
               || '';
  const sprite2 = p2.sprites?.front_default
               || p2.sprites?.other?.['official-artwork']?.front_default
               || '';

  img1.src         = sprite1;
  img1.alt         = p1.name;
  name1.textContent = capitalize(p1.name);

  img2.src         = sprite2;
  img2.alt         = p2.name;
  name2.textContent = capitalize(p2.name);

  // Toggle views
  selCont .classList.add('hidden');
  outp    .classList.add('hidden');
  battle  .classList.remove('hidden');
  reset   .classList.remove('hidden');
}

/** Shrink the HP bar width to fraction*100% */
export function updateHpBar(id, fraction) {
  const bar = document.getElementById(id);
  if (!bar) return;
  bar.style.width = `${Math.max(0, fraction * 100)}%`;
}

/** Show a winner message in the debug pane */
export function announceWinner(name) {
  const outp = document.getElementById('output');
  if (!outp) return;
  outp.textContent = `🏆 ${name.toUpperCase()} WINS!`;
}
