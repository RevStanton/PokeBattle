// js/ui.js

/** Populate a <select> with an array of names */
export function populateDropdown(selectId, names) {
  const select = document.getElementById(selectId);
  select.innerHTML = ''; // clear any existing
  names.forEach(n => {
    const opt = document.createElement('option');
    opt.value = n;
    opt.textContent = n.charAt(0).toUpperCase() + n.slice(1);
    select.appendChild(opt);
  });
}

/** Show text (or JSON) in the <pre> output area */
export function showOutput(content) {
  const out = document.getElementById('output');
  if (typeof content === 'object') {
    out.textContent = JSON.stringify(content, null, 2);
  } else {
    out.textContent = content;
  }
}
