import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { Window } from "happy-dom";
import { checkBundle } from "../scripts/build-i18n.mjs";
const window = new Window();
for (const name of ["window", "document", "HTMLElement", "customElements", "CustomEvent"]) globalThis[name] = name === "window" ? window : window[name];
const { DeslocLockCard, DeslocLockCardEditor, LOCALES, MESSAGES, resolveLocale, translate } = await import("../ha-desloc-card.js");
const config = { type: "custom:desloc-lock-card", entity: "lock.synthetic", battery_entity: "sensor.battery", signal_entity: "sensor.signal" };
const name = '<img src=x onerror="alert(1)"> {name} שלום';
function setup(language = "en") {
  const calls = [];
  const hass = { locale: { language }, states: {
    "lock.synthetic": { state: "locked", attributes: { friendly_name: name } },
    "sensor.battery": { state: "58" }, "sensor.signal": { state: "-57" },
  }, callService: async (...args) => { calls.push(args); } };
  const card = new DeslocLockCard(); card.setConfig(config); card.hass = hass;
  return { card, calls, hass };
}
test("all 24 complete packs match the offline single-file bundle and placeholder contract", async () => {
  assert.equal(LOCALES.length, 24);
  assert.deepEqual(LOCALES.map(({ code }) => code), ["en", "ar", "bn", "cs", "de", "es", "fa", "fr", "he", "hi", "id", "it", "ja", "ko", "nl", "pl", "pt", "ru", "th", "tr", "uk", "vi", "zh-Hans", "zh-Hant"]);
  const { source, updated } = await checkBundle();
  assert.equal(source, updated);
  assert.doesNotMatch(source, /\bimport\s*(?:\(|.*from\b)|\bfetch\s*\(/);
  for (const { code } of LOCALES) {
    assert.deepEqual(MESSAGES[code], JSON.parse(await readFile(new URL(`../locales/${code}.json`, import.meta.url), "utf8")));
    for (const key of ["confirm.unlock", "error.command", "caption", "editor.language"]) {
      assert.ok(MESSAGES[code][key]);
      if (code !== "en") assert.notEqual(MESSAGES[code][key], MESSAGES.en[key]);
    }
  }
});
test("regional language normalization, Chinese scripts and English fallback", () => {
  for (const [input, expected] of [["pt-BR", "pt"], ["EN_us", "en"], ["  de-AT ", "de"], ["zh", "zh-Hans"], ["zh-CN", "zh-Hans"], ["zh-TW", "zh-Hant"], ["zh-HK", "zh-Hant"], ["zh-Hans-TW", "zh-Hans"], ["ZH_hant", "zh-Hant"], ["ru-RU", "ru"], ["fa-IR", "fa"], ["xx", null], ["__proto__", null], [null, null], [{}, null]]) assert.equal(resolveLocale(input), expected, String(input));
  assert.equal(translate("xx", "state.locked"), "Locked");
  assert.equal(translate("ru", "missing.key"), "missing.key");
  assert.equal(translate("ru", "constructor"), "constructor");
  assert.equal(translate("en", "confirm.unlock", { name: "{name} {field}" }), "Unlock “{name} {field}”? This sends a physical unlock command.");
});
for (const { code, dir } of LOCALES) {
  test(`${code}: all UI messages, editor, safe names and explicit unlock cancellation`, async () => {
    const { card, calls, hass } = setup(code);
    const dictionary = MESSAGES[code];
    assert.equal(card.lang, code); assert.equal(card.dir, dir);
    assert.equal(card.shadowRoot.querySelector(".caption").textContent, dictionary.caption);
    assert.equal(card.shadowRoot.querySelector(".info").getAttribute("aria-label"), dictionary.details);
    assert.equal(card.shadowRoot.querySelector(".lock").textContent, dictionary["action.lock"]);
    assert.equal(card.shadowRoot.querySelector(".unlock").textContent, dictionary["action.unlock"]);
    assert.equal(card.shadowRoot.querySelector(".battery").textContent, dictionary["metric.battery"].replace("{value}", "\u206858%\u2069"));
    assert.equal(card.shadowRoot.querySelector(".signal").textContent, dictionary["metric.signal"].replace("{value}", "\u2068-57 dBm\u2069"));
    assert.equal(card.shadowRoot.querySelector("h2").textContent, name);
    assert.equal(card.shadowRoot.querySelector("img"), null);
    const snapshot = JSON.stringify(hass.states);
    const editor = new DeslocLockCardEditor(); editor.setConfig(config); editor.hass = hass;
    const form = editor.shadowRoot.querySelector("ha-form");
    assert.equal(editor.dir, dir); assert.equal(editor.lang, code);
    for (const field of form.schema) assert.equal(form.computeLabel(field), dictionary[`editor.${field.name}`]);
    assert.equal(form.schema.find(field => field.name === "language").selector.select.options[0].label, dictionary["editor.automatic"]);
    assert.equal(form.schema.find(field => field.name === "language").selector.select.options.length, 25);
    let prompt;
    window.confirm = value => { prompt = value; return false; };
    await card._command("unlock");
    assert.equal(prompt, dictionary["confirm.unlock"].replace("{name}", () => name));
    assert.equal(calls.length, 0); assert.equal(JSON.stringify(hass.states), snapshot);
    assert.throws(() => card.setConfig({ entity: "switch.bad" }), { message: dictionary["error.lock_entity"] });
    assert.throws(() => card.setConfig({ entity: "lock.synthetic", signal_entity: "lock.bad" }), { message: dictionary["error.sensor_entity"].replace("{field}", "signal_entity") });
    for (const state of ["locked", "unlocked", "locking", "unlocking", "jammed", "unknown", "unavailable", "constructor", "__proto__"]) {
      card.hass = { ...hass, states: { ...hass.states, "lock.synthetic": { state, attributes: { friendly_name: name } } } };
      assert.equal(card.shadowRoot.querySelector(".state").textContent, dictionary[`state.${["constructor", "__proto__"].includes(state) ? "unknown" : state}`]);
      if (state !== "locked") { await card._command("unlock"); assert.equal(calls.length, 0); }
    }
    card.hass = hass;
    window.confirm = () => true;
    await card._command("unlock");
    assert.deepEqual(calls, [["lock", "unlock", { entity_id: "lock.synthetic" }]]);
    card.hass = { ...hass, callService: async () => { throw Error("PRIVATE_SECRET"); } };
    await card._command("unlock");
    assert.equal(card.shadowRoot.querySelector(".error").textContent, dictionary["error.command"]);
    assert.equal(card.shadowRoot.textContent.includes("PRIVATE_SECRET"), false);
    assert.equal(JSON.stringify(card._config), JSON.stringify(config));
  });
}
test("HA profile switching never changes configuration or sends a command, including while pending", async () => {
  const { card, calls, hass } = setup();
  const editor = new DeslocLockCardEditor(); editor.setConfig(config); editor.hass = hass;
  let emitted = 0; editor.addEventListener("config-changed", () => emitted++);
  const snapshot = JSON.stringify(hass.states);
  for (const { code } of LOCALES) {
    card.hass = { ...hass, locale: { language: code } }; editor.hass = card.hass;
    assert.equal(card.lang, code); assert.equal(editor.lang, code);
    assert.deepEqual(card._config, config); assert.deepEqual(editor._config, config);
  }
  assert.equal(calls.length, 0); assert.equal(emitted, 0); assert.equal(JSON.stringify(hass.states), snapshot);
  let resolve;
  card.hass = { ...hass, callService: (...args) => { calls.push(args); return new Promise(done => { resolve = done; }); } };
  window.confirm = () => true;
  const pending = card._command("unlock");
  card.hass = { ...card.hass, locale: { language: "ar" } };
  assert.equal(card.dir, "rtl"); assert.equal(card.shadowRoot.querySelector(".unlock").disabled, true);
  await card._command("unlock"); await card._command("lock");
  assert.equal(calls.length, 1);
  resolve(); await pending; assert.equal(calls.length, 1);
});
test("explicit language is independent per card and the editor can return to profile language", () => {
  const { card, calls, hass } = setup("de-DE");
  card.setConfig({ ...config, language: "fr-CA" }); assert.equal(card.lang, "fr");
  card.hass = { ...hass, locale: { language: "ru" } }; assert.equal(card.lang, "fr");
  card.setConfig({ ...config, language: "unsupported" }); assert.equal(card.lang, "en");
  card.setConfig({ ...config, language: "auto" }); assert.equal(card.lang, "ru");
  const second = setup("ar").card; assert.equal(second.lang, "ar"); assert.equal(card.lang, "ru");
  const editor = new DeslocLockCardEditor(); editor.setConfig(config); editor.hass = hass;
  let changed; editor.addEventListener("config-changed", event => { changed = event.detail.config; });
  const form = editor.shadowRoot.querySelector("ha-form");
  form.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { language: "ja" } } }));
  assert.equal(editor.lang, "ja"); assert.deepEqual(changed, { ...config, language: "ja" });
  form.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { language: "auto" } } }));
  assert.equal(editor.lang, "de"); assert.deepEqual(changed, config); assert.equal(calls.length, 0);
});
test("legacy HA language property works and failure text updates on language changes", async () => {
  const { card, hass } = setup();
  card.hass = { ...hass, locale: undefined, language: "es-MX", callService: async () => { throw Error("PRIVATE"); } };
  assert.equal(card.lang, "es"); window.confirm = () => true; await card._command("unlock");
  card.hass = { ...card.hass, language: "uk" };
  assert.equal(card.shadowRoot.querySelector(".error").textContent, MESSAGES.uk["error.command"]);
});
test("invalid config types show localized validation while optional empty sensors remain valid", () => {
  const { card } = setup("de");
  for (const entity of [null, undefined, 123, {}, [], false]) {
    assert.throws(() => card.setConfig({ entity }), { message: MESSAGES.de["error.lock_entity"] });
  }
  for (const field of ["battery_entity", "signal_entity"]) {
    for (const value of [123, {}, [], true]) {
      assert.throws(() => card.setConfig({ ...config, [field]: value }), { message: MESSAGES.de["error.sensor_entity"].replace("{field}", field) });
    }
    for (const value of [null, undefined, ""]) assert.doesNotThrow(() => card.setConfig({ ...config, [field]: value }));
  }
});
