import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { Window } from "happy-dom";
const window = new Window();
for (const name of ["window", "document", "HTMLElement", "customElements", "CustomEvent"]) globalThis[name] = name === "window" ? window : window[name];
const { DeslocLockCard } = await import("../ha-desloc-card.js");
let card, calls;
beforeEach(() => {
  calls = [];
  card = new DeslocLockCard();
  card.setConfig({ entity: "lock.test", battery_entity: "sensor.battery" });
  card.hass = { states: { "lock.test": { state: "locked", attributes: { friendly_name: "Test door" } }, "sensor.battery": { state: "55" } }, callService: async (...args) => { calls.push(args); } };
  window.confirm = () => true;
});
test("unlock calls the HA service only after confirmation", async () => {
  window.confirm = () => false;
  await card._command("unlock"); assert.equal(calls.length, 0);
  window.confirm = () => true;
  await card._command("unlock");
  assert.deepEqual(calls, [["lock", "unlock", { entity_id: "lock.test" }]]);
});
test("concurrent clicks never repeat a pending command", async () => {
  let resolve;
  card.hass.callService = (...args) => { calls.push(args); return new Promise(r => { resolve = r; }); };
  const pending = card._command("unlock"); await card._command("unlock");
  assert.equal(calls.length, 1); resolve(); await pending;
});
test("a failed command is visible and never retried automatically", async () => {
  card.hass.callService = async () => { calls.push(1); throw Error("private server detail"); };
  await card._command("unlock");
  assert.equal(calls.length, 1); assert.match(card.shadowRoot.querySelector(".error").textContent, /Check the physical lock/);
  assert.ok(!card.shadowRoot.textContent.includes("private server detail"));
  // Recovery: busy clears so an operator can manually retry without reload.
  assert.equal(card._busy, false);
  assert.equal(card.shadowRoot.querySelector(".unlock").disabled, false);
  card.hass.callService = async (...args) => { calls.push(args); };
  await card._command("unlock");
  assert.equal(calls.length, 2);
});
test("unavailable and uncertain states cannot unlock", async () => {
  for (const state of ["unavailable", "unknown", "locking", "unlocking", "jammed", "unexpected"]) {
    card.hass = { ...card.hass, states: { "lock.test": { state, attributes: {} } } };
    await card._command("unlock");
  }
  assert.equal(calls.length, 0);
});
test("unknown state allows an explicit lock for recovery", async () => {
  card.hass = { ...card.hass, states: { "lock.test": { state: "unknown", attributes: {} } } };
  await card._command("lock"); assert.equal(calls[0][1], "lock");
});
test("external names render as text and missing telemetry is unavailable", () => {
  card.setConfig({ entity: "lock.test", name: '<img src=x onerror="alert(1)">', battery_entity: "sensor.missing" });
  assert.equal(card.shadowRoot.querySelector("img"), null);
  assert.match(card.shadowRoot.querySelector(".battery").textContent, /Unavailable/);
});
test("setConfig rejects non-lock entities and non-sensor telemetry", () => {
  assert.throws(() => card.setConfig({ entity: "switch.test" }), /Select a lock entity/);
  assert.throws(() => card.setConfig({ entity: "lock.test", battery_entity: "binary_sensor.x" }), /battery_entity must be a sensor entity/);
  assert.throws(() => card.setConfig({ entity: "lock.test", signal_entity: "lock.other" }), /signal_entity must be a sensor entity/);
  card.setConfig({ entity: "lock.test", battery_entity: "sensor.battery" });
});

test("visual editor retains card type when it updates fields", () => {
  const editor = DeslocLockCard.getConfigElement();
  editor.setConfig({ type: "custom:desloc-lock-card", entity: "lock.test" }); editor.hass = card.hass;
  let value; editor.addEventListener("config-changed", e => { value = e.detail.config; });
  editor.shadowRoot.querySelector("ha-form").dispatchEvent(new CustomEvent("value-changed", { detail: { value: { entity: "lock.other" } } }));
  assert.equal(value.type, "custom:desloc-lock-card"); assert.equal(value.entity, "lock.other");
});

test("pending unlock keeps commands gated until the latest state is settled", async () => {
  let resolve;
  card.hass.callService = (...args) => { calls.push(args); return new Promise((done) => { resolve = done; }); };
  const pending = card._command("unlock");
  card.hass = {
    ...card.hass,
    states: { "lock.test": { state: "unlocked", attributes: { friendly_name: "Test door" } } },
  };
  assert.equal(card.shadowRoot.querySelector(".state").textContent, "Unlocked");
  assert.equal(card.shadowRoot.querySelector(".lock").disabled, true);
  assert.equal(card.shadowRoot.querySelector(".unlock").disabled, true);
  await card._command("lock");
  assert.equal(calls.length, 1);
  resolve();
  await pending;
  assert.equal(card._busy, false);
  assert.equal(card.shadowRoot.querySelector(".lock").disabled, false);
  assert.equal(card.shadowRoot.querySelector(".unlock").disabled, true);
  assert.equal(calls.length, 1);
  card.hass.callService = async (...args) => { calls.push(args); };
  await card._command("lock");
  assert.equal(calls.length, 2);
  assert.deepEqual(calls[1], ["lock", "lock", { entity_id: "lock.test" }]);
});
