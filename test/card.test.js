import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { Window } from "happy-dom";
const window = new Window();
for (const name of ["window", "document", "HTMLElement", "customElements", "CustomEvent"]) globalThis[name] = name === "window" ? window : window[name];
const { DeslocLockCard } = await import("../ha-desloc-card.js");
let card, calls;
const settled = () => new Promise(resolve => setImmediate(resolve));
const action = () => card.shadowRoot.querySelector("button.primary.action");
const report = state => {
  card.hass = { ...card.hass, states: state === null ? {} : { "lock.test": { state, attributes: {} } } };
};
beforeEach(() => {
  calls = [];
  card = new DeslocLockCard();
  card.setConfig({ entity: "lock.test", battery_entity: "sensor.battery" });
  card.hass = { states: { "lock.test": { state: "locked", attributes: { friendly_name: "Test door" } }, "sensor.battery": { state: "55" } }, callService: async (...args) => { calls.push(args); } };
  window.confirm = () => true;
  document.body.replaceChildren(card);
});
test("unlock calls the HA service only after confirmation", async () => {
  window.confirm = () => false;
  await card._command("unlock"); assert.equal(calls.length, 0);
  window.confirm = () => true;
  await card._command("unlock");
  assert.deepEqual(calls, [["lock", "unlock", { entity_id: "lock.test" }]]);
});
test("unlock confirmation identifies the configured display name without changing its target", async () => {
  card.setConfig({ entity: "lock.test", name: "Side door" });
  let prompt;
  window.confirm = message => { prompt = message; return true; };
  await card._command("unlock");
  assert.equal(card.shadowRoot.querySelector("h2").textContent, "Side door");
  assert.equal(prompt, "Unlock “Side door”? This sends a physical unlock command.");
  assert.deepEqual(calls, [["lock", "unlock", { entity_id: "lock.test" }]]);
});
test("unlock confirmation follows the latest friendly name and cancellation sends nothing", async () => {
  let prompt;
  window.confirm = message => { prompt = message; return false; };
  card.hass = { ...card.hass, states: { "lock.test": { state: "locked", attributes: { friendly_name: "Back door" } } } };
  await card._command("unlock");
  assert.equal(card.shadowRoot.querySelector("h2").textContent, "Back door");
  assert.equal(prompt, "Unlock “Back door”? This sends a physical unlock command.");
  assert.equal(calls.length, 0);
  assert.equal(card.shadowRoot.querySelector(".action").disabled, false);
});
test("unnamed locks use their entity ID in the title and unlock confirmation", async () => {
  card.hass = { ...card.hass, states: { "lock.test": { state: "locked", attributes: {} } } };
  let prompt;
  window.confirm = message => { prompt = message; return true; };
  await card._command("unlock");
  assert.equal(card.shadowRoot.querySelector("h2").textContent, "lock.test");
  assert.equal(prompt, "Unlock “lock.test”? This sends a physical unlock command.");
  assert.deepEqual(calls, [["lock", "unlock", { entity_id: "lock.test" }]]);
});
test("caption does not infer a vendor or cloud transport from entity IDs and names", () => {
  for (const [entity, friendly_name] of [["lock.other", "Local door"], ["lock.desloc", "DESLOC front door"]]) {
    card.setConfig({ entity });
    card.hass = { ...card.hass, states: { [entity]: { state: "locked", attributes: { friendly_name } } } };
    assert.equal(card.shadowRoot.querySelector(".caption").textContent, "Reported lock state");
  }
});
test("concurrent clicks never repeat a pending command", async () => {
  let resolve;
  card.hass.callService = (...args) => { calls.push(args); return new Promise(r => { resolve = r; }); };
  const pending = card._command("unlock"); await card._command("unlock");
  assert.equal(calls.length, 1); resolve(); await pending;
});
test("a failed command is visible and never retried automatically", async () => {
  card.hass.callService = async () => { calls.push(1); throw Error("private server detail"); };
  action().click();
  await settled();
  assert.equal(calls.length, 1); assert.match(card.shadowRoot.querySelector(".error").textContent, /Check the physical lock/);
  assert.ok(!card.shadowRoot.textContent.includes("private server detail"));
  // Recovery: busy clears so an operator can manually retry without reload.
  assert.equal(card._busy, false);
  assert.equal(card.shadowRoot.querySelector(".action").disabled, false);
  assert.equal(action().textContent, "Unlock");
  card.hass.callService = async (...args) => { calls.push(args); };
  action().click();
  await settled();
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
  assert.equal(card.shadowRoot.querySelector(".action").disabled, true);
  assert.equal(card.shadowRoot.querySelector(".action").textContent, "Unlocking…");
  await card._command("lock");
  assert.equal(calls.length, 1);
  resolve();
  await pending;
  assert.equal(card._busy, false);
  assert.equal(card.shadowRoot.querySelector(".action").disabled, false);
  assert.equal(card.shadowRoot.querySelector(".action").textContent, "Lock");
  assert.equal(calls.length, 1);
  card.hass.callService = async (...args) => { calls.push(args); };
  await card._command("lock");
  assert.equal(calls.length, 2);
  assert.deepEqual(calls[1], ["lock", "lock", { entity_id: "lock.test" }]);
});


test("prototype property names remain unknown states and cannot unlock", async () => {
  for (const state of ["__proto__", "constructor", "toString", "hasOwnProperty"]) {
    card.hass = { ...card.hass, states: { "lock.test": { state, attributes: {} } } };
    assert.equal(card.shadowRoot.querySelector(".state").textContent, "Unknown");
    assert.equal(card.shadowRoot.querySelector(".disc").dataset.state, "unknown");
    await card._command("unlock");
  }
  assert.equal(calls.length, 0);
});

test("one persistent native action button follows the reported state", () => {
  const button = action();
  const cases = [
    ["locked", "Unlock", false], ["unlocked", "Lock", false],
    ["unknown", "Lock", false], ["jammed", "Lock", false], ["unexpected", "Lock", false],
    ["locking", "Locking…", true], ["unlocking", "Unlocking…", true],
    ["unavailable", "Unavailable", true], [null, "Unavailable", true], ["", "Unavailable", true],
  ];
  for (const [state, label, disabled] of cases) {
    report(state);
    assert.equal(action(), button, `node is preserved for ${state}`);
    assert.equal(card.shadowRoot.querySelectorAll(".actions button").length, 1);
    assert.equal(button.textContent, label, state);
    assert.equal(button.disabled, disabled, state);
  }
});

test("the action starts disabled before configuration and HA state arrive", async () => {
  const unconfigured = new DeslocLockCard();
  assert.equal(unconfigured.shadowRoot.querySelector(".action").disabled, true);
  await unconfigured._command("unlock");
  unconfigured.setConfig({ entity: "lock.test" });
  assert.equal(unconfigured.shadowRoot.querySelector(".action").disabled, true);
  await unconfigured._command("lock");
  assert.equal(calls.length, 0);
});

test("action clicks confirm unlock and send one explicit service for each direction", async () => {
  let confirmations = 0;
  window.confirm = () => { confirmations++; return false; };
  action().click();
  await settled();
  assert.equal(calls.length, 0);
  assert.equal(action().textContent, "Unlock");
  window.confirm = () => { confirmations++; return true; };
  action().click();
  await settled();
  assert.deepEqual(calls, [["lock", "unlock", { entity_id: "lock.test" }]]);
  assert.equal(card.shadowRoot.querySelector(".state").textContent, "Locked", "no optimistic state");
  report("unlocked");
  action().click();
  await settled();
  assert.equal(confirmations, 2, "locking does not request unlock confirmation");
  assert.deepEqual(calls[1], ["lock", "lock", { entity_id: "lock.test" }]);
});

test("missing, unavailable and transitional buttons cannot send commands", async () => {
  for (const state of [null, "unavailable", "locking", "unlocking"]) {
    report(state);
    action().click();
    await card._command("lock");
    await card._command("unlock");
  }
  assert.equal(calls.length, 0);
});

test("uncertain-state action clicks only send the explicit recovery lock", async () => {
  window.confirm = () => { throw Error("Lock must not show an unlock prompt"); };
  for (const state of ["unknown", "jammed", "unexpected", "__proto__"]) {
    report(state);
    action().click();
    await settled();
  }
  assert.equal(calls.length, 4);
  assert.ok(calls.every(([, service]) => service === "lock"));
});

test("command authorization does not trust mutable DOM state", async () => {
  action().textContent = "Lock";
  action().disabled = false;
  await card._command("lock");
  report("unlocked");
  action().textContent = "Unlock";
  action().disabled = false;
  await card._command("unlock");
  report("unavailable");
  action().disabled = false;
  await card._command("lock");
  await card._command("toggle");
  assert.equal(calls.length, 0);
});

test("changing the selected entity during confirmation cannot retarget unlock", async () => {
  card.hass.states["lock.other"] = { state: "locked", attributes: { friendly_name: "Other door" } };
  let prompt;
  window.confirm = message => {
    prompt = message;
    card.setConfig({ entity: "lock.other" });
    return true;
  };
  action().click();
  await settled();
  assert.match(prompt, /Test door/);
  assert.equal(calls.length, 0);
  assert.equal(action().disabled, false);
});

test("changed state during confirmation aborts instead of sending the opposite action", async () => {
  for (const state of ["unlocked", "unknown", "locking", "unlocking", "unavailable", null]) {
    report("locked");
    window.confirm = () => { report(state); return true; };
    await card._command("unlock");
  }
  assert.equal(calls.length, 0);
});

test("reentrant confirmation cannot open another prompt or send another command", async () => {
  let confirmations = 0;
  window.confirm = () => {
    confirmations++;
    card._command("unlock");
    return true;
  };
  await card._command("unlock");
  assert.equal(confirmations, 1);
  assert.equal(calls.length, 1);
});

test("a pending click retains its direction and target through state and locale updates", async () => {
  let resolve;
  card.hass.callService = (...args) => { calls.push(args); return new Promise(done => { resolve = done; }); };
  const button = action();
  button.click();
  assert.equal(button.textContent, "Unlocking…");
  assert.equal(button.getAttribute("aria-busy"), "true");
  report("unlocked");
  card.setConfig({ entity: "lock.test", language: "fr" });
  assert.equal(button.textContent, "Déverrouillage…");
  assert.equal(button.disabled, true);
  button.click();
  await card._command("lock");
  assert.equal(calls.length, 1);
  resolve();
  await settled();
  assert.equal(action(), button);
  assert.equal(button.textContent, "Verrouiller");
  assert.equal(button.disabled, false);
  assert.equal(button.getAttribute("aria-busy"), "false");
  assert.deepEqual(calls[0], ["lock", "unlock", { entity_id: "lock.test" }]);
});

test("pending lock uses its own progress label", async () => {
  report("unlocked");
  let resolve;
  card.hass.callService = () => new Promise(done => { resolve = done; });
  const pending = card._command("lock");
  assert.equal(action().textContent, "Locking…");
  report("locked");
  assert.equal(action().textContent, "Locking…");
  assert.equal(action().disabled, true);
  resolve();
  await pending;
  assert.equal(action().textContent, "Unlock");
});

test("a second click in a double-click cannot reverse a completed command", async () => {
  const button = action();
  button.dispatchEvent(new window.MouseEvent("click", { detail: 1, bubbles: true }));
  await settled();
  report("unlocked");
  button.dispatchEvent(new window.MouseEvent("click", { detail: 2, bubbles: true }));
  await settled();
  assert.equal(calls.length, 1);
  button.dispatchEvent(new window.MouseEvent("click", { detail: 1, bubbles: true }));
  await settled();
  assert.deepEqual(calls[1], ["lock", "lock", { entity_id: "lock.test" }]);
});

test("held activation keys are blocked without replacing native initial activation", () => {
  for (const key of ["Enter", " "]) {
    const initial = new window.KeyboardEvent("keydown", { key, repeat: false, cancelable: true });
    action().dispatchEvent(initial);
    assert.equal(initial.defaultPrevented, false);
    const repeated = new window.KeyboardEvent("keydown", { key, repeat: true, cancelable: true });
    action().dispatchEvent(repeated);
    assert.equal(repeated.defaultPrevented, true);
  }
});

test("state and language changes preserve the focused native action node", () => {
  const button = action();
  button.focus();
  report("unlocked");
  card.setConfig({ entity: "lock.test", language: "de" });
  assert.equal(action(), button);
  assert.equal(card.shadowRoot.activeElement, button);
  assert.equal(button.textContent, "Verriegeln");
});

test("a pointer press cannot change direction before its click", async () => {
  let confirmations = 0;
  window.confirm = () => { confirmations++; return true; };
  for (const [before, after] of [["locked", "unlocked"], ["unlocked", "locked"]]) {
    report(before);
    action().dispatchEvent(new window.PointerEvent("pointerdown", { button: 0, isPrimary: true }));
    report(after);
    action().dispatchEvent(new window.MouseEvent("click", { detail: 1 }));
    await settled();
  }
  assert.equal(calls.length, 0);
  assert.equal(confirmations, 0);
  action().dispatchEvent(new window.PointerEvent("pointerdown", { button: 0, isPrimary: true }));
  action().dispatchEvent(new window.MouseEvent("click", { detail: 1 }));
  await settled();
  assert.deepEqual(calls, [["lock", "unlock", { entity_id: "lock.test" }]]);
});

test("a keyboard press cannot choose a new action on key release", async () => {
  let confirmations = 0;
  window.confirm = () => { confirmations++; return true; };
  for (const key of ["Enter", " "]) {
    for (const [before, after] of [["locked", "unlocked"], ["unlocked", "locked"]]) {
      report(before);
      action().dispatchEvent(new window.KeyboardEvent("keydown", { key, repeat: false }));
      report(after);
      action().dispatchEvent(new window.KeyboardEvent("keyup", { key }));
      action().dispatchEvent(new window.MouseEvent("click", { detail: 0 }));
      await settled();
    }
  }
  assert.equal(calls.length, 0);
  assert.equal(confirmations, 0);
  action().dispatchEvent(new window.KeyboardEvent("keydown", { key: " ", repeat: false }));
  action().dispatchEvent(new window.KeyboardEvent("keyup", { key: " " }));
  action().dispatchEvent(new window.MouseEvent("click", { detail: 0 }));
  await settled();
  assert.deepEqual(calls, [["lock", "unlock", { entity_id: "lock.test" }]]);
});

test("changing the entity during a gesture never retargets the press", async () => {
  report("unlocked");
  card.hass.states["lock.other"] = { state: "unlocked", attributes: {} };
  action().dispatchEvent(new window.PointerEvent("pointerdown", { button: 0, isPrimary: true }));
  card.setConfig({ entity: "lock.other" });
  action().dispatchEvent(new window.MouseEvent("click", { detail: 1 }));
  await settled();
  assert.equal(calls.length, 0);
  action().dispatchEvent(new window.PointerEvent("pointerdown", { button: 0, isPrimary: true }));
  action().dispatchEvent(new window.MouseEvent("click", { detail: 1 }));
  await settled();
  assert.deepEqual(calls, [["lock", "lock", { entity_id: "lock.other" }]]);
});

test("cancelled or blurred gestures cannot authorize a late click", async () => {
  for (const cancel of ["pointercancel", "blur", "Escape"]) {
    report("unlocked");
    action().dispatchEvent(cancel === "blur"
      ? new window.KeyboardEvent("keydown", { key: " " })
      : new window.PointerEvent("pointerdown", { button: 0, isPrimary: true }));
    action().dispatchEvent(cancel === "Escape"
      ? new window.KeyboardEvent("keydown", { key: "Escape" }) : new window.Event(cancel));
    action().dispatchEvent(new window.MouseEvent("click", { detail: 1 }));
    await settled();
  }
  assert.equal(calls.length, 0);
  action().dispatchEvent(new window.PointerEvent("pointerdown", { button: 0, isPrimary: true }));
  action().dispatchEvent(new window.MouseEvent("click", { detail: 1 }));
  await settled();
  assert.deepEqual(calls, [["lock", "lock", { entity_id: "lock.test" }]]);
});

test("native pointer focus changes do not cancel a new deliberate click", async () => {
  action().dispatchEvent(new window.KeyboardEvent("keydown", { key: " " }));
  report("unlocked");
  action().dispatchEvent(new window.MouseEvent("click", { detail: 0 }));
  assert.equal(calls.length, 0, "the stale keyboard gesture is ignored");
  action().dispatchEvent(new window.PointerEvent("pointerdown", { button: 0, isPrimary: true }));
  action().dispatchEvent(new window.Event("blur"));
  action().dispatchEvent(new window.MouseEvent("click", { detail: 1 }));
  await settled();
  assert.deepEqual(calls, [["lock", "lock", { entity_id: "lock.test" }]]);
});

test("locale updates do not cancel a gesture whose target and action stay the same", async () => {
  action().dispatchEvent(new window.PointerEvent("pointerdown", { button: 0, isPrimary: true }));
  card.setConfig({ entity: "lock.test", language: "fr" });
  action().dispatchEvent(new window.MouseEvent("click", { detail: 1 }));
  await settled();
  assert.deepEqual(calls, [["lock", "unlock", { entity_id: "lock.test" }]]);
});

test("a gesture that began while unavailable cannot become authorized later", async () => {
  report("unavailable");
  action().dispatchEvent(new window.PointerEvent("pointerdown", { button: 0, isPrimary: true }));
  report("unlocked");
  action().dispatchEvent(new window.MouseEvent("click", { detail: 1 }));
  await settled();
  assert.equal(calls.length, 0);
});
