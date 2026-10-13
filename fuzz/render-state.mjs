import assert from 'node:assert/strict';
import { DeslocLockCard, input, window } from './dom.mjs';

const labels = new Map([
  ['locked', 'Locked'], ['unlocked', 'Unlocked'], ['locking', 'Locking…'],
  ['unlocking', 'Unlocking…'], ['jammed', 'Jammed'], ['unknown', 'Unknown'],
  ['unavailable', 'Unavailable'],
]);

const card = new DeslocLockCard();

export async function fuzz(data) {
  const sample = input(data);
  if (!sample) return;
  const { text, state } = sample;
  card.hass = undefined;
  card.setConfig({ entity: 'lock.synthetic', name: text, battery_entity: 'sensor.synthetic' });
  card.hass = {
    states: {
      'lock.synthetic': { state, attributes: { friendly_name: 'Synthetic lock' } },
      'sensor.synthetic': { state: text },
    },
    callService: () => { throw new Error('Rendering must never call a service'); },
  };
  const shownState = state || 'unavailable';
  assert.equal(card.shadowRoot.querySelector('.state').textContent, labels.get(shownState) || 'Unknown');
  assert.equal(card.shadowRoot.querySelector('.disc').dataset.state, labels.has(shownState) ? shownState : 'unknown');
  const title = card.shadowRoot.querySelector('h2');
  assert.equal(title.textContent, text || 'Synthetic lock');
  assert.equal(title.children.length, 0, 'external labels must remain text');
  const numeric = text.trim() !== '' && Number.isFinite(Number(text));
  assert.equal(card.shadowRoot.querySelector('.battery').textContent, `Battery: ${numeric ? text + '%' : 'Unavailable'}`);
  assert.equal(card.shadowRoot.querySelector('.unlock').disabled, shownState !== 'locked');
  await window.happyDOM.waitUntilComplete();
}
