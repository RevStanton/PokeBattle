// js/ui/layout.js

/** Renders the page header with title & nav links */
export function renderHeader() {
  const header = document.createElement('header');
  header.className = 'app-header';
  header.innerHTML = `
    <div class="header-inner">
      <h1>PokéBattle Arena</h1>
      <nav>
        <a href="./index.html">Home</a>
        <a href="#battleLog">Battle Log</a>
      </nav>
    </div>
  `;
  document.body.prepend(header);
}

/** Renders the page footer with credits */
export function renderFooter() {
  const footer = document.createElement('footer');
  footer.className = 'app-footer';
  footer.innerHTML = `
    <p>© 2025 YourName • Data from <a href="https://pokeapi.co" target="_blank">PokéAPI</a></p>
  `;
  document.body.appendChild(footer);
}
