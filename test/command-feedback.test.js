import { test } from "node:test";
import assert from "node:assert/strict";
import { Window } from "happy-dom";

const window = new Window();
for (const name of ["window", "document", "HTMLElement", "customElements", "CustomEvent"]) {
  globalThis[name] = name === "window" ? window : window[name];
}
const { LOCALES, MESSAGES } = await import("../ha-desloc-card.js");
const timestamp = seconds => `2026-10-24T20:00:${String(seconds).padStart(2, "0")}.000Z`;
const structuredError = key => ({
  translation_domain: "desloc", translation_key: key,
  message: "PRIVATE_TOKEN raw vendor message", translation_placeholders: { id: "PRIVATE_DEVICE", pin: "PRIVATE_PIN" },
});
function fixture(type = "desloc-lock-card") {
  const card = document.createElement(type);
  const calls = [];
  card.setConfig({ type: `custom:${type}`, entity: "lock.test" });
  card.hass = {
    language: "en",
    states: { "lock.test": { state: "locked", last_changed: timestamp(0), attributes: {} } },
    callService: async (...args) => { calls.push(args); },
  };
  window.confirm = () => true;
  document.body.replaceChildren(card);
  const report = (state, changedAt, attributes = {}) => {
    card.hass = { ...card.hass, states: {
      ...card.hass.states, "lock.test": { state, last_changed: changedAt, attributes },
    } };
  };
  const errorText = () => card.shadowRoot.querySelector(".error").textContent;
  const fail = async (error, state = "unknown", changedAt = timestamp(10)) => {
    card.hass.callService = async (...args) => {
      calls.push(args);
      report(state, changedAt);
      throw error;
    };
    await card._command("unlock");
  };
  return { card, calls, report, errorText, fail };
}

test("known DESLOC service errors use local translations in every supported language", async () => {
  for (const { code } of LOCALES) {
    for (const key of ["command_timeout", "command_unconfirmed", "auth_required", "unavailable", "command_in_progress"]) {
      const { card, calls, errorText, fail } = fixture();
      card.setConfig({ entity: "lock.test", language: code });
      await fail(structuredError(key));
      assert.equal(errorText(), MESSAGES[code][`error.${key}`], `${code}: ${key}`);
      assert.equal(calls.length, 1);
      assert.doesNotMatch(card.shadowRoot.textContent, /PRIVATE_TOKEN|PRIVATE_DEVICE|PRIVATE_PIN/);
      card.setConfig({ entity: "lock.test", language: "ru" });
      assert.equal(errorText(), MESSAGES.ru[`error.${key}`], "existing warning follows the selected language");
    }
  }
});

test("untrusted, foreign and malformed errors remain generic without displaying their content", async () => {
  const errors = [
    null, "PRIVATE_TOKEN", new Error("PRIVATE_TOKEN"),
    { ...structuredError("command_timeout"), translation_domain: "other_integration" },
    structuredError("command_failed"), structuredError("__proto__"), structuredError("constructor"),
    structuredError("PRIVATE_TOKEN"), { message: "PRIVATE_TOKEN", translation_key: "command_timeout" },
    { ...structuredError("command_timeout"), translation_key: {} },
    Object.create(structuredError("command_timeout")),
  ];
  for (const error of errors) {
    const { card, errorText, fail } = fixture();
    await fail(error);
    assert.equal(errorText(), MESSAGES.en["error.command"]);
    assert.doesNotMatch(card.shadowRoot.textContent, /PRIVATE_TOKEN|PRIVATE_DEVICE|PRIVATE_PIN/);
  }
});

for (const type of ["desloc-lock-card", "desloc-compact-lock-card"]) {
  test(`${type} clears a recognized old warning only after strictly newer stable state`, async () => {
    const { card, calls, report, errorText, fail } = fixture(type);
    await fail(structuredError("command_timeout"));
    const warning = errorText();
    report("unknown", timestamp(10), { battery: 99 });
    assert.equal(errorText(), warning, "telemetry-only updates do not clear the warning");
    report("locked", timestamp(10));
    assert.equal(errorText(), warning, "a stable cached report is insufficient");
    report("unknown", timestamp(20));
    report("unlocked", timestamp(15));
    assert.equal(errorText(), warning, "an older stable update does not supersede uncertainty");
    report("unlocked", timestamp(30));
    assert.equal(errorText(), "");
    assert.equal(card.shadowRoot.querySelector(".state").textContent, "Unlocked");
    assert.equal(calls.length, 1, "state recovery never sends a retry");
  });
}

test("legacy DESLOC command_failed can recover after a fresh unknown-to-stable transition", async () => {
  const { report, errorText, fail } = fixture();
  await fail(structuredError("command_failed"));
  assert.equal(errorText(), MESSAGES.en["error.command"]);
  report("locked", timestamp(20));
  assert.equal(errorText(), "");
});

test("a failure caught after state already recovered is retained until a new uncertain-to-stable transition", async () => {
  const { report, errorText, fail } = fixture();
  await fail(structuredError("command_unconfirmed"), "locked", timestamp(20));
  const warning = errorText();
  report("locked", timestamp(30));
  report("unlocked", timestamp(35));
  assert.equal(errorText(), warning, "post-failure stable updates alone do not prove recovery");
  report("unlocking", timestamp(40));
  report("unlocked", timestamp(45));
  assert.equal(errorText(), "");
});

test("authentication, preflight and unstructured errors are not erased by later state updates", async () => {
  for (const error of [structuredError("auth_required"), structuredError("unavailable"), structuredError("command_in_progress"), new Error("PRIVATE_TOKEN")]) {
    const { report, errorText, fail } = fixture();
    await fail(error);
    const warning = errorText();
    report("unlocked", timestamp(20));
    assert.equal(errorText(), warning);
  }
});

test("missing or invalid state timestamps retain a warning until a deliberate new command", async () => {
  for (const changedAt of [undefined, "not-a-date"]) {
    const { card, calls, report, errorText } = fixture();
    card.hass.callService = async (...args) => {
      calls.push(args);
      report("unknown", changedAt);
      throw structuredError("command_timeout");
    };
    await card._command("unlock");
    const warning = errorText();
    report("locked", timestamp(20));
    assert.equal(errorText(), warning);
    card.hass.callService = async (...args) => { calls.push(args); };
    await card._command("unlock");
    assert.equal(errorText(), "");
  }
});

test("switching entities clears the old warning and an older request cannot assign one to the new entity", async () => {
  const { card, errorText, fail } = fixture();
  await fail(structuredError("command_timeout"));
  card.hass.states["lock.other"] = { state: "locked", last_changed: timestamp(20), attributes: {} };
  card.setConfig({ entity: "lock.other" });
  assert.equal(errorText(), "");
  let reject;
  card.hass.callService = () => new Promise((_, fail) => { reject = fail; });
  const pending = card._command("unlock");
  card.setConfig({ entity: "lock.test" });
  reject(structuredError("auth_required"));
  await pending;
  assert.equal(errorText(), "");
});
