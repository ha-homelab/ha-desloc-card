import { Window } from 'happy-dom';

export const window = new Window();
for (const name of ['window', 'document', 'HTMLElement', 'customElements', 'CustomEvent']) {
  globalThis[name] = name === 'window' ? window : window[name];
}
export const { DeslocLockCard, LOCALES, MESSAGES } = await import('../ha-desloc-card.js');

export function input(data) {
  if (data.length > 4096) return null;
  const flags = data[0] || 0;
  const text = data.subarray(2).toString('utf8');
  const states = ['locked', 'unlocked', 'locking', 'unlocking', 'jammed', 'unknown', 'unavailable', '__proto__', 'constructor', 'toString', text];
  return { flags, text, state: states[(data[1] || 0) % states.length] };
}
