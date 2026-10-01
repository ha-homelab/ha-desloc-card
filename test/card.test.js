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
test("visual editor retains card type when it updates fields", () => {
  const editor = DeslocLockCard.getConfigElement();
  editor.setConfig({ type: "custom:desloc-lock-card", entity: "lock.test" }); editor.hass = card.hass;
  let value; editor.addEventListener("config-changed", e => { value = e.detail.config; });
  editor.shadowRoot.querySelector("ha-form").dispatchEvent(new CustomEvent("value-changed", { detail: { value: { entity: "lock.other" } } }));
  assert.equal(value.type, "custom:desloc-lock-card"); assert.equal(value.entity, "lock.other");
});
