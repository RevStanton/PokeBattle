// js/ui/dom.js
export function showOutput(content) {
  const out = document.getElementById('output');
  if (!out) return;
  out.textContent = typeof content === 'object'
    ? JSON.stringify(content, null, 2)
    : content;
}
