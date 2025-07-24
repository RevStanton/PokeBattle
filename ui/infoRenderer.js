// ui/infoRenderer.js
export function renderPokemonInfo(p) {
  const {
    id, name, types, abilities,
    height, weight, stats, moves,
    sprites: { frontDefault, officialArtwork },
    // from species endpoint:
    description, genus, habitat, growth_rate
  } = p;

  const container = document.getElementById('pokemon-details');
  container.innerHTML = ''; // clear

  const card = document.createElement('div');
  card.className = 'poke-card';
  card.innerHTML = `
    <div class="poke-header">
      <h2>${name.toUpperCase()} (#${id})</h2>
      <img src="${officialArtwork || frontDefault}" alt="${name}">
    </div>

    ${genus ? `<p class="poke-genus">${genus}</p>` : ''}
    ${description ? `<p class="poke-desc">${description}</p>` : ''}

    <div class="poke-meta">
      <p><strong>Types:</strong> ${types.join(', ')}</p>
      <p><strong>Abilities:</strong> ${abilities.join(', ')}</p>
      <p><strong>Height:</strong> ${(height/10).toFixed(1)} m &bull; <strong>Weight:</strong> ${(weight/10).toFixed(1)} kg</p>
      ${habitat ? `<p><strong>Habitat:</strong> ${habitat}</p>` : ''}
      ${growth_rate ? `<p><strong>Growth Rate:</strong> ${growth_rate}</p>` : ''}
    </div>

    <table class="poke-stats">
      <thead><tr><th>Stat</th><th>Value</th></tr></thead>
      <tbody>
        ${Object.entries(stats).map(([s,v]) => `<tr><td>${s}</td><td>${v}</td></tr>`).join('')}
      </tbody>
    </table>

    <div class="poke-moves">
      <h3>Moves</h3>
      <ul>
        ${moves.slice(0,10).map(m => `<li>${m}</li>`).join('')}
        ${moves.length>10?'<li>…and more</li>':''}
      </ul>
    </div>
  `;

  container.appendChild(card);
}
