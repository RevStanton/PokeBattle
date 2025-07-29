// js/ui/utils.js

/**
 * Capitalize the first letter of a string.
 * @param {string} s
 * @returns {string}
 */
export function capitalize(s) {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}
