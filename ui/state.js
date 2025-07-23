// ui/state.js

/**
 * Switch into Arena mode:
 *  - Add `arena-mode` class to <body>
 *  - Show #battleContainer & #resetContainer
 *  - Hide #selectorContainer & #output
 */
export function enterArena() {
  document.body.classList.add('arena-mode');
  document.getElementById('selectorContainer').classList.add('hidden');
  document.getElementById('output').classList.add('hidden');
  document.getElementById('battleContainer').classList.remove('hidden');
  document.getElementById('resetContainer').classList.remove('hidden');
}

/**
 * Switch back to Landing mode:
 *  - Remove `arena-mode` class
 *  - Show #selectorContainer & #output
 *  - Hide #battleContainer & #resetContainer
 */
export function exitArena() {
  document.body.classList.remove('arena-mode');
  document.getElementById('selectorContainer').classList.remove('hidden');
  document.getElementById('output').classList.remove('hidden');
  document.getElementById('battleContainer').classList.add('hidden');
  document.getElementById('resetContainer').classList.add('hidden');
}
