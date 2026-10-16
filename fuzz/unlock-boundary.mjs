import assert from 'node:assert/strict';
import { DeslocLockCard, LOCALES, MESSAGES, input, window } from './dom.mjs';

const card = new DeslocLockCard();

export async function fuzz(data) {
  const sample = input(data);
  if (!sample) return;
  const { flags, text, state } = sample;
  const { code: language } = LOCALES[flags % LOCALES.length];
  const service = ['lock', 'unlock', text][flags % 3];
  const confirmation = Boolean(flags & 4);
  const busy = Boolean(flags & 8);
  const reject = Boolean(flags & 16);
  let prompts = 0;
  const calls = [];
  card.hass = undefined;
  card._error = '';
  card.setConfig({ entity: 'lock.synthetic', name: text });
  window.confirm = message => {
    prompts += 1;
    assert.equal(message, MESSAGES[language]['confirm.unlock'].replace('{name}', () => text || 'lock.synthetic'));
    return confirmation;
  };
  card._busy = busy;
  card._pendingService = busy ? 'unlock' : undefined;
  card.hass = {
    locale: { language },
    states: { 'lock.synthetic': { state, attributes: {} } },
    callService: async (...args) => {
      calls.push(args);
      if (reject) throw Error('synthetic private transport detail');
    },
  };
  const effectiveState = state || 'unavailable';
  const mayLock = !['locked', 'unavailable', 'locking', 'unlocking'].includes(effectiveState);
  const mayUnlock = effectiveState === 'locked';
  assert.equal(card.shadowRoot.querySelectorAll('.actions button').length, 1);
  assert.equal(card.shadowRoot.querySelector('.action').disabled, busy || (!mayLock && !mayUnlock));
  const permitted = !busy && ((service === 'lock' && mayLock) || (service === 'unlock' && mayUnlock && confirmation));
  await card._command(service);
  assert.equal(calls.length, permitted ? 1 : 0);
  if (permitted) assert.deepEqual(calls[0], ['lock', service, { entity_id: 'lock.synthetic' }]);
  assert.equal(prompts, !busy && service === 'unlock' && mayUnlock ? 1 : 0);
  assert.equal(card.shadowRoot.textContent.includes('synthetic private transport detail'), false);
  if (permitted) assert.equal(card._busy, false, 'completion must release the command gate');
  await window.happyDOM.waitUntilComplete();
}
