import { test } from "node:test";
import assert from "node:assert/strict";
import { Window } from "happy-dom";

const window = new Window();
for (const name of ["window", "document", "HTMLElement", "customElements", "CustomEvent"]) {
  globalThis[name] = name === "window" ? window : window[name];
}
const { DeslocLockCard } = await import("../ha-desloc-card.js");
const settled = () => new Promise(resolve => setImmediate(resolve));
const variants = [
  { type: "desloc-lock-card", config: { compact: true } },
  { type: "desloc-compact-lock-card", config: {} },
];
function fixture(variant) {
  const calls = [];
  const card = document.createElement(variant.type);
  card.setConfig({
    type: `custom:${variant.type}`, entity: "lock.test", name: "Side door",
    battery_entity: "sensor.battery", signal_entity: "sensor.signal", ...variant.config,
  });
  card.hass = {
    language: "en",
    states: {
      "lock.test": { state: "locked", attributes: {} },
      "sensor.battery": { state: "55", attributes: {} },
      "sensor.signal": { state: "-65", attributes: {} },
    },
    callService: async (...args) => { calls.push(args); },
  };
  document.body.replaceChildren(card);
  window.confirm = () => true;
  const action = () => card.shadowRoot.querySelector(".action");
  const report = state => {
    if (state === null) delete card.hass.states["lock.test"];
    else card.hass.states["lock.test"] = { state, attributes: {} };
    card.hass = { ...card.hass };
  };
  return { card, calls, action, report };
}

test("one installed module registers both card choices without changing the normal default", () => {
  for (const { type } of variants) {
    assert.ok(customElements.get(type), `${type} is registered`);
    const entries = window.customCards.filter(entry => entry.type === type);
    assert.equal(entries.length, 1);
    assert.equal(entries[0].preview, true);
  }
  const { card: normal } = fixture({ type: "desloc-lock-card", config: {} });
  const { card: compact } = fixture(variants[0]);
  assert.equal(normal.getCardSize(), 4);
  assert.deepEqual(normal.getGridOptions(), { columns: 6, rows: 5, min_columns: 6, min_rows: 5 });
  assert.ok(compact.getCardSize() < normal.getCardSize());
  assert.deepEqual(compact.getGridOptions(), { columns: 12, rows: "auto", min_columns: 6 });
  const { card: separate } = fixture(variants[1]);
  assert.equal(separate.getCardSize(), compact.getCardSize());
  assert.deepEqual(separate.getGridOptions(), compact.getGridOptions());
});

for (const variant of variants) {
  test(`${variant.type} keeps state, optional telemetry and the existing explicit action policy`, async () => {
    const { card, calls, action, report } = fixture(variant);
    assert.equal(card.shadowRoot.querySelector("h2").textContent, "Side door");
    assert.match(card.shadowRoot.querySelector(".battery").textContent, /55%/);
    assert.match(card.shadowRoot.querySelector(".signal").textContent, /-65 dBm/);
    const button = action();
    for (const [state, label, disabled] of [
      ["locked", "Unlock", false], ["unlocked", "Lock", false],
      ["unknown", "Lock", false], ["jammed", "Lock", false],
      ["locking", "Locking…", true], ["unlocking", "Unlocking…", true],
      ["unavailable", "Unavailable", true], [null, "Unavailable", true],
    ]) {
      report(state);
      assert.equal(action(), button);
      assert.equal(card.shadowRoot.querySelectorAll(".actions button").length, 1);
      assert.equal(button.textContent, label, state);
      assert.equal(button.disabled, disabled, state);
      if (disabled) {
        button.click();
        await card._command("lock");
        await card._command("unlock");
      } else if (["unknown", "jammed"].includes(state)) {
        await card._command("unlock");
      }
    }
    assert.equal(calls.length, 0, "rendering and disallowed commands do not operate the lock");
    for (const state of ["unknown", "jammed"]) {
      report(state);
      action().click();
      await settled();
    }
    assert.deepEqual(calls, [
      ["lock", "lock", { entity_id: "lock.test" }],
      ["lock", "lock", { entity_id: "lock.test" }],
    ]);
    card.setConfig({ type: `custom:${variant.type}`, entity: "lock.test", ...variant.config });
    assert.equal(card.shadowRoot.querySelector(".battery").hidden, true);
    assert.equal(card.shadowRoot.querySelector(".signal").hidden, true);
  });

  test(`${variant.type} requires unlock confirmation and blocks duplicate or reversed pending commands`, async () => {
    const { card, calls, action, report } = fixture(variant);
    let prompt;
    window.confirm = message => { prompt = message; return false; };
    action().click();
    await settled();
    assert.match(prompt, /Side door/);
    assert.equal(calls.length, 0);
    window.confirm = () => true;
    let complete;
    card.hass.callService = (...args) => { calls.push(args); return new Promise(resolve => { complete = resolve; }); };
    action().dispatchEvent(new window.MouseEvent("click", { detail: 1 }));
    assert.equal(action().disabled, true);
    report("unlocked");
    assert.equal(action().textContent, "Unlocking…");
    action().click();
    await card._command("lock");
    assert.equal(calls.length, 1);
    complete();
    await settled();
    assert.equal(action().textContent, "Lock");
    action().dispatchEvent(new window.MouseEvent("click", { detail: 2 }));
    await settled();
    assert.deepEqual(calls, [["lock", "unlock", { entity_id: "lock.test" }]]);
  });

  test(`${variant.type} preserves keyboard focus and renders untrusted text safely in RTL`, () => {
    const { card, action, report } = fixture(variant);
    const button = action();
    button.focus();
    report("unlocked");
    card.setConfig({ type: `custom:${variant.type}`, entity: "lock.test", language: "ar", name: '<img src=x onerror="alert(1)">', ...variant.config });
    assert.equal(card.dir, "rtl");
    assert.equal(action(), button);
    assert.equal(card.shadowRoot.activeElement, button);
    assert.equal(card.shadowRoot.querySelector("img"), null);
    assert.equal(card.shadowRoot.querySelector("h2").textContent, '<img src=x onerror="alert(1)">');
  });
}

test("compact configuration can be switched without replacing the action or its focus", () => {
  const { card, action } = fixture(variants[0]);
  const button = action();
  button.focus();
  for (const compact of [false, true, false]) {
    card.setConfig({ type: "custom:desloc-lock-card", entity: "lock.test", compact });
    assert.equal(card.getCardSize(), compact ? 2 : 4);
    assert.equal(card.getGridOptions().rows, compact ? "auto" : 5);
    assert.equal(action(), button);
    assert.equal(card.shadowRoot.activeElement, button);
  }
});

test("compact palette stub supplies compact mode and finds the same lock as the regular card", () => {
  const compactClass = customElements.get("desloc-compact-lock-card");
  const hass = { states: { "lock.desloc": { attributes: { friendly_name: "Front door" } } } };
  assert.deepEqual(compactClass.getStubConfig(hass), {
    ...DeslocLockCard.getStubConfig(hass), compact: true,
  });
});

for (const variant of variants) {
  test(`${variant.type} editor exposes compact mode and preserves its type and other fields`, () => {
    const { card } = fixture(variant);
    const editor = customElements.get(variant.type).getConfigElement();
    editor.setConfig({ type: `custom:${variant.type}`, entity: "lock.test", name: "Side door", ...variant.config });
    editor.hass = card.hass;
    const form = editor.shadowRoot.querySelector("ha-form");
    assert.ok(form.schema.some(field => field.name === "compact" && field.selector.boolean));
    assert.equal(form.data.compact, true);
    let result;
    editor.addEventListener("config-changed", event => { result = event.detail.config; });
    form.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { compact: false } } }));
    assert.equal(result.type, `custom:${variant.type}`);
    assert.equal(result.compact, false);
    assert.equal(result.name, "Side door");
    assert.equal(result.entity, "lock.test");
    card.setConfig(result);
    assert.equal(card.getCardSize(), 4, "explicit full size also works for the compact palette choice");
    form.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { compact: true } } }));
    card.setConfig(result);
    assert.equal(card.getCardSize(), 2);
    assert.equal(result.type, `custom:${variant.type}`);
  });
}

test("compact mode requires a boolean instead of coercing configuration strings", () => {
  for (const variant of variants) {
    const { card } = fixture(variant);
    for (const compact of ["false", "true", 0, 1, null, [], {}]) {
      assert.throws(() => card.setConfig({ entity: "lock.test", compact }), /true or false/);
    }
    card.setConfig({ entity: "lock.test", compact: false });
    assert.equal(card.getCardSize(), 4);
    card.setConfig({ entity: "lock.test", compact: true });
    assert.equal(card.getCardSize(), 2);
  }
});
