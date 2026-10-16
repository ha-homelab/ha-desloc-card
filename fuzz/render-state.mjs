import assert from 'node:assert/strict';
import { DeslocLockCard, LOCALES, MESSAGES, input, window } from './dom.mjs';

const states = new Set(['locked', 'unlocked', 'locking', 'unlocking', 'jammed', 'unknown', 'unavailable']);

const card = new DeslocLockCard();

export async function fuzz(data) {
  const sample = input(data);
  if (!sample) return;
  const { flags, text, state } = sample;
  const { code: language, dir } = LOCALES[flags % LOCALES.length];
  const messages = MESSAGES[language];
  card.hass = undefined;
  card.setConfig({ entity: 'lock.synthetic', name: text, battery_entity: 'sensor.synthetic' });
  card.hass = {
    locale: { language },
    states: {
      'lock.synthetic': { state, attributes: { friendly_name: 'Synthetic lock' } },
      'sensor.synthetic': { state: text },
    },
    callService: () => { throw new Error('Rendering must never call a service'); },
  };
  const shownState = state || 'unavailable';
  assert.equal(card.shadowRoot.querySelector('.state').textContent, messages[`state.${states.has(shownState) ? shownState : 'unknown'}`]);
  assert.equal(card.shadowRoot.querySelector('.disc').dataset.state, states.has(shownState) ? shownState : 'unknown');
  assert.equal(card.lang, language);
  assert.equal(card.dir, dir);
  const title = card.shadowRoot.querySelector('h2');
  assert.equal(title.textContent, text || 'Synthetic lock');
  assert.equal(title.children.length, 0, 'external labels must remain text');
  const numeric = text.trim() !== '' && Number.isFinite(Number(text));
  assert.equal(card.shadowRoot.querySelector('.battery').textContent, messages['metric.battery'].replace('{value}', () => numeric ? `\u2068${text}%\u2069` : messages['state.unavailable']));
  assert.equal(card.shadowRoot.querySelector('.unlock').disabled, shownState !== 'locked');
  await window.happyDOM.waitUntilComplete();
}
