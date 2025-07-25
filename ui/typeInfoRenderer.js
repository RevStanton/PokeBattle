// ui/typeInfoRenderer.js

/**
 * @param {string} pokemonName
 * @param {Array<Object>} tables  array of damage_relations for each type
 */
export function renderTypeInfo(pokemonName, tables) {
  const container = document.getElementById('type-results');
  container.innerHTML = '';  // clear previous

  // 1) Show header
  const title = document.createElement('h2');
  title.textContent = `${pokemonName.toUpperCase()} Effectiveness`;
  container.appendChild(title);

  // 2) Merge all tables into one summary:
  const summary = {
    double_damage_to: new Set(),
    half_damage_to:   new Set(),
    no_damage_to:     new Set(),
    double_damage_from: new Set(),
    half_damage_from:   new Set(),
    no_damage_from:     new Set()
  };
  tables.forEach(tr => {
    for (const key of Object.keys(summary)) {
      tr[key].forEach(t => summary[key].add(t.name));
    }
  });

  // 3) Render each category
  for (const [relation, setOfTypes] of Object.entries(summary)) {
    if (setOfTypes.size === 0) continue;
    const section = document.createElement('div');
    section.className = 'type-section';
    // human‑friendly headline
    const headline = relation
      .replace(/_/g, ' ')
      .replace('double damage to','Strong Against')
      .replace('half damage to','Resists')
      .replace('no damage to','Immune To')
      .replace('double damage from','Weak To')
      .replace('half damage from','Not Very Weak To')
      .replace('no damage from','Immune From');
    section.innerHTML = `
      <h3>${headline}</h3>
      <div class="type-list">
        ${[...setOfTypes].map(t => `<span class="type-badge">${t}</span>`).join('')}
      </div>
    `;
    container.appendChild(section);
  }
}
