export function renderPokemonInfo(p) {
  const container = document.getElementById('pokemon-details');
  container.innerHTML = '';  // clear

  // Card wrapper
  const card = document.createElement('div');
  card.className = 'poke-card';

  // Name & sprite
  const header = document.createElement('div');
  header.className = 'poke-header';
  header.innerHTML = `
    <h2>${p.name.toUpperCase()} (#${p.id})</h2>
    <img src="${p.sprites.front_default}" alt="${p.name}" />
  `;
  card.appendChild(header);

  // Types & Abilities
  const meta = document.createElement('div');
  meta.className = 'poke-meta';
  meta.innerHTML = `
    <p><strong>Types:</strong> ${p.types.map(t => t.type.name).join(', ')}</p>
    <p><strong>Abilities:</strong> ${p.abilities.map(a => a.ability.name).join(', ')}</p>
    <p><strong>Height:</strong> ${p.height / 10} m • <strong>Weight:</strong> ${p.weight / 10} kg</p>
  `;
  card.appendChild(meta);

  // Stats table
  const statsTable = document.createElement('table');
  statsTable.className = 'poke-stats';
  statsTable.innerHTML = `
    <thead><tr><th>Stat</th><th>Value</th></tr></thead>
    <tbody>
      ${p.stats.map(s =>
        `<tr>
           <td>${s.stat.name}</td>
           <td>${s.base_stat}</td>
         </tr>`
      ).join('')}
    </tbody>
  `;
  card.appendChild(statsTable);

  // Moves (first 10)
  const moves = document.createElement('div');
  moves.className = 'poke-moves';
  moves.innerHTML = `
    <h3>Moves</h3>
    <ul>
      ${p.moves.slice(0, 10).map(m => `<li>${m.move.name}</li>`).join('')}
      ${p.moves.length > 10 ? '<li>…and more</li>' : ''}
    </ul>
  `;
  card.appendChild(moves);

  container.appendChild(card);
}
