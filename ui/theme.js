// ui/theme.js
export function applyTheme() {
  const root = document.documentElement;

  /* use a path relative to index.html */
  root.style.setProperty(
    '--arena-bg',
    "url('images/arena.jpg') center/cover no-repeat"
  );

  /* Card & panel backgrounds */
  root.style.setProperty('--card-bg',       'rgba(255, 255, 255, 0.9)');
  root.style.setProperty('--panel-bg',      'rgba(0, 0, 0, 0.7)');

  /* Accent colors */
  root.style.setProperty('--accent-red',    '#ff1c1c');
  root.style.setProperty('--accent-yellow', '#ffde59');
  root.style.setProperty('--accent-blue',   '#3b4cca');

  /* Fonts */
  root.style.setProperty('--font-main',     "'Press Start 2P', cursive");
  root.style.setProperty('--font-sans',     "'Verdana', sans-serif");
}
