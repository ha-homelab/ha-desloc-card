import { test } from "node:test";
import assert from "node:assert/strict";
import { Window } from "happy-dom";

const window = new Window();
for (const name of ["window", "document", "HTMLElement", "customElements", "CustomEvent"]) {
  globalThis[name] = name === "window" ? window : window[name];
}
const { LOCALES, MESSAGES } = await import("../ha-desloc-card.js");
const variants = [
  { name: "full card", type: "desloc-lock-card", config: {} },
  { name: "compact option", type: "desloc-lock-card", config: { compact: true } },
  { name: "compact picker card", type: "desloc-compact-lock-card", config: {} },
];

function fixture(variant) {
  const card = document.createElement(variant.type);
  const calls = [];
  const config = { type: `custom:${variant.type}`, entity: "lock.test", ...variant.config };
  card.setConfig(config);
  card.hass = {
    language: "en",
    states: { "lock.test": { state: "locked", attributes: {} } },
    callService: async (...args) => { calls.push(args); },
  };
  window.confirm = () => true;
  document.body.replaceChildren(card);
  const button = card.shadowRoot.querySelector(".action");
  const report = state => {
    card.hass = { ...card.hass, states: state === null ? {} : { "lock.test": { state, attributes: {} } } };
  };
  const deferCommand = () => {
    let resolve, reject;
    card.hass.callService = (...args) => {
      calls.push(args);
      return new Promise((done, fail) => { resolve = done; reject = fail; });
    };
    return { resolve: () => resolve(), reject: error => reject(error) };
  };
  const assertBusy = expected => {
    assert.equal(button.getAttribute("aria-busy"), String(expected));
    if (expected) assert.equal(button.disabled, true, "a pending command remains disabled");
    assert.equal(card.shadowRoot.querySelector(".action"), button, "the native button is preserved");
  };
  return { card, calls, config, button, report, deferCommand, assertBusy };
}

for (const variant of variants) {
  test(`${variant.name}: loading covers the unresolved request without inferring success or allowing repeats`, async () => {
    const { card, calls, button, report, deferCommand, assertBusy } = fixture(variant);
    const deferred = deferCommand();
    const pending = card._command("unlock");
    assertBusy(true);
    assert.equal(button.textContent, "Unlocking…");
    assert.equal(card.shadowRoot.querySelector(".state").textContent, "Locked", "pending is not a reported unlock");
    for (const state of ["unknown", "unlocked", "locked"]) {
      report(state);
      assertBusy(true);
      button.click();
      await card._command("lock");
      await card._command("unlock");
      assert.equal(calls.length, 1, "state changes cannot send a second command while waiting");
    }
    deferred.resolve();
    await pending;
    assertBusy(false);
    assert.equal(button.disabled, false);
    assert.equal(button.textContent, "Unlock");
    assert.equal(card.shadowRoot.querySelector(".state").textContent, "Locked", "service completion does not fabricate lock state");
    assert.deepEqual(calls, [["lock", "unlock", { entity_id: "lock.test" }]]);
  });

  test(`${variant.name}: an HA transition keeps loading after the local request resolves`, async () => {
    const { card, calls, button, report, deferCommand, assertBusy } = fixture(variant);
    for (const [initial, service, transition, final] of [
      ["locked", "unlock", "unlocking", "unlocked"],
      ["unlocked", "lock", "locking", "locked"],
    ]) {
      report(initial);
      const deferred = deferCommand();
      const pending = card._command(service);
      report(transition);
      deferred.resolve();
      await pending;
      assertBusy(true);
      assert.equal(button.textContent, MESSAGES.en[`state.${transition}`]);
      const previousCalls = calls.length;
      button.click();
      await card._command(service);
      assert.equal(calls.length, previousCalls);
      report(final);
      assertBusy(false);
      assert.equal(button.disabled, false);
    }
  });

  test(`${variant.name}: failed confirmation ends loading and retains the unknown state and warning`, async () => {
    const { card, calls, button, report, deferCommand, assertBusy } = fixture(variant);
    const deferred = deferCommand();
    const pending = card._command("unlock");
    report("unknown");
    assertBusy(true);
    deferred.reject({ translation_domain: "desloc", translation_key: "command_timeout" });
    await pending;
    assertBusy(false);
    assert.equal(button.disabled, false);
    assert.equal(button.textContent, "Lock");
    assert.equal(card.shadowRoot.querySelector(".state").textContent, "Unknown");
    assert.equal(card.shadowRoot.querySelector(".error").textContent, MESSAGES.en["error.command_timeout"]);
    assert.equal(calls.length, 1, "ending the indicator never retries a failed command");
  });

  test(`${variant.name}: external transitions load, while ordinary uncertainty and unavailability do not`, async () => {
    const { card, calls, button, report, assertBusy } = fixture(variant);
    for (const state of ["locking", "unlocking"]) {
      report(state);
      assertBusy(true);
      button.click();
      await card._command("lock");
      await card._command("unlock");
    }
    for (const state of ["unknown", "unavailable", "jammed", "unexpected", "locked", "unlocked", null]) {
      report(state);
      assertBusy(false);
    }
    assert.equal(calls.length, 0, "rendering an external state never sends a command");
  });

  test(`${variant.name}: cancelling unlock does not show loading or send a command`, async () => {
    const { card, calls, button, assertBusy } = fixture(variant);
    window.confirm = () => false;
    await card._command("unlock");
    assertBusy(false);
    assert.equal(button.textContent, "Unlock");
    assert.equal(button.disabled, false);
    assert.equal(calls.length, 0);
  });

  test(`${variant.name}: the busy button keeps its localized accessible text in all languages`, async () => {
    const { card, config, button, report, deferCommand, assertBusy } = fixture(variant);
    for (const { code, dir } of LOCALES) {
      card.setConfig({ ...config, language: code });
      for (const [initial, service, transition] of [["locked", "unlock", "unlocking"], ["unlocked", "lock", "locking"]]) {
        report(initial);
        const deferred = deferCommand();
        const pending = card._command(service);
        assertBusy(true);
        assert.equal(button.textContent, MESSAGES[code][`state.${transition}`], `${code}: ${service}`);
        assert.notEqual(button.getAttribute("aria-hidden"), "true");
        assert.equal(card.lang, code);
        assert.equal(card.dir, dir);
        deferred.resolve();
        await pending;
        assertBusy(false);
      }
    }
  });
}
