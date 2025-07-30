// ui/infoRenderer.js
export function renderPokemonInfo(p) {
  const {
    id,
    name,
    types,
    height,
    weight,
    stats,
    moves,
    // sprites
    sprites: { frontDefault, officialArtwork },
    // species data
    description,
    genus,
    habitat,
    growth_rate,
    // enriched ability details
    abilityDetails = [],
    evolution = []
  } = p;

  const container = document.getElementById('pokemon-details');
  container.innerHTML = '';

  // Main card wrapper
  const card = document.createElement('div');
  card.className = 'poke-card';

  // Build inner HTML
  card.innerHTML = `
    <div class="poke-header">
      <h2>${name.toUpperCase()} (#${id})</h2>
      <img src="${officialArtwork || frontDefault}" alt="${name}" />
    </div>

    ${genus ? `<p class="poke-genus">${genus}</p>` : ''}
    ${description ? `<p class="poke-desc">${description}</p>` : ''}
    <!-- NEW Evolution Chain -->
  ${evolution.length > 1 ? `
    <div class="poke-evolution">
      <h3>Evolution Chain</h3>
      <ul class="evo-list">
        ${evolution.map(e => `
          <li>
            <a href="#" data-name="${e.name}">
              <img src="${e.sprites.frontDefault || ''}" alt="${e.name}">
              <span>${e.name}</span>
            </a>
          </li>
        `).join('')}
      </ul>
    </div>
  ` : ''}
    <div class="poke-abilities">
      <h3>Abilities</h3>
      ${abilityDetails.map(a => `
        <div class="ability">
          <h4>${a.name.replace(/-/g, ' ')}</h4>
          ${a.effect ? `<p class="ability-effect">${a.effect}</p>` : ''}
          ${a.flavor ? `<p class="ability-flavor">${a.flavor}</p>` : ''}
        </div>
      `).join('')}
    </div>

    <div class="poke-meta">
      <p><strong>Types:</strong> ${types.join(', ')}</p>
      <p><strong>Height:</strong> ${(height/10).toFixed(1)} m • <strong>Weight:</strong> ${(weight/10).toFixed(1)} kg</p>
      ${habitat ? `<p><strong>Habitat:</strong> ${habitat}</p>` : ''}
      ${growth_rate ? `<p><strong>Growth Rate:</strong> ${growth_rate}</p>` : ''}
    </div>

    <table class="poke-stats">
      <thead>
        <tr><th>Stat</th><th>Value</th></tr>
      </thead>
      <tbody>
        ${Object.entries(stats).map(([stat, val]) => `
          <tr><td>${stat}</td><td>${val}</td></tr>
        `).join('')}
      </tbody>
    </table>

    <div class="poke-moves">
      <h3>Moves</h3>
      <ul>
        ${moves.slice(0, 10).map(m => `<li>${m}</li>`).join('')}
        ${moves.length > 10 ? '<li>…and more</li>' : ''}
      </ul>
    </div>
  `;

  container.appendChild(card);
}
