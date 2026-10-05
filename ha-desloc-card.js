/* DESLOC Lock Card — MIT License, HA Homelab contributors. */
const VERSION = "0.1.2-rc.1";
const STATES = { locked: "Locked", unlocked: "Unlocked", locking: "Locking…", unlocking: "Unlocking…", jammed: "Jammed", unknown: "Unknown", unavailable: "Unavailable" };

export class DeslocLockCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        ha-card { padding: 24px; overflow: hidden; color: var(--primary-text-color); background: var(--ha-card-background, var(--card-background-color)); }
        header { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
        h2 { font-size: 20px; font-weight: 600; margin: 0; overflow-wrap: anywhere; }
        .caption { color: var(--secondary-text-color); font-size: 12px; margin: 5px 0 0; }
        .hero { display: grid; justify-items: center; padding: 24px 0; gap: 14px; }
        .disc { width: 88px; height: 88px; border-radius: 50%; display: grid; place-items: center; background: color-mix(in srgb, var(--primary-color) 12%, transparent); color: var(--primary-color); }
        .disc[data-state="unlocked"] { background: color-mix(in srgb, var(--warning-color, #e6a000) 15%, transparent); color: var(--warning-color, #e6a000); }
        .disc[data-state="unknown"], .disc[data-state="unavailable"] { color: var(--secondary-text-color); background: var(--secondary-background-color); }
        .disc ha-icon { --mdc-icon-size: 42px; }
        .state { font-size: 24px; font-weight: 600; }
        .telemetry { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; margin: 0 0 24px; }
        .metric { font-size: 13px; border: 1px solid var(--divider-color); border-radius: 22px; padding: 7px 12px; }
        .metric[hidden] { display: none; }
        .actions { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        button { font: inherit; cursor: pointer; border-radius: 12px; min-height: 46px; border: 1px solid var(--divider-color); color: var(--primary-text-color); background: transparent; padding: 10px 16px; }
        button.primary { color: var(--text-primary-color, #fff); background: var(--primary-color); border-color: var(--primary-color); }
        button:disabled { cursor: default; opacity: .45; }
        button:focus-visible { outline: 3px solid var(--primary-color); outline-offset: 3px; }
        button.info { border: 0; min-width: 44px; padding: 8px; }
        .error { color: var(--error-color, #db4437); font-size: 13px; margin-top: 14px; overflow-wrap: anywhere; }
        .error:empty { display: none; }
        @media (prefers-reduced-motion: no-preference) { .disc { transition: background .2s; } }
      </style>
      <ha-card>
        <header><div><h2></h2><p class="caption">Reported lock state</p></div><button class="info" aria-label="Show lock details"><ha-icon icon="mdi:information-outline"></ha-icon></button></header>
        <div class="hero"><div class="disc"><ha-icon></ha-icon></div><div class="state" role="status" aria-live="polite"></div></div>
        <div class="telemetry"><span class="metric battery"></span><span class="metric signal"></span></div>
        <div class="actions"><button class="primary lock">Lock</button><button class="unlock">Unlock</button></div>
        <div class="error" role="alert"></div>
      </ha-card>`;
    this.shadowRoot.querySelector(".lock").addEventListener("click", () => this._command("lock"));
    this.shadowRoot.querySelector(".unlock").addEventListener("click", () => this._command("unlock"));
    this.shadowRoot.querySelector(".info").addEventListener("click", () => {
      if (this._config) this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: this._config.entity }, bubbles: true, composed: true }));
    });
  }

  setConfig(config) {
    if (!config?.entity?.startsWith("lock.")) throw new Error("Select a lock entity.");
    for (const key of ["battery_entity", "signal_entity"]) {
      if (config[key] && !config[key].startsWith("sensor.")) throw new Error(`${key} must be a sensor entity.`);
    }
    this._config = { ...config };
    this._render();
  }

  set hass(value) { this._hass = value; this._render(); }
  get hass() { return this._hass; }
  getCardSize() { return 4; }
  getGridOptions() { return { columns: 6, rows: 5, min_columns: 6, min_rows: 5 }; }
  static getConfigElement() { return document.createElement("desloc-lock-card-editor"); }
  static getStubConfig(hass, entities, fallbackEntities) {
    const candidates = [...(entities || []), ...(fallbackEntities || []), ...Object.keys(hass?.states || {})];
    const entity = candidates.find(id => id.startsWith("lock.") && /desloc|c100/i.test(`${id} ${hass?.states[id]?.attributes?.friendly_name || ""}`)) || candidates.find(id => id.startsWith("lock.")) || "";
    return { entity };
  }

  _displayName() {
    return this._config.name || this._hass.states[this._config.entity]?.attributes?.friendly_name || this._config.entity;
  }

  _render() {
    if (!this._config || !this._hass) return;
    const state = this._hass.states[this._config.entity]?.state || "unavailable";
    const known = ["locked", "unlocked"].includes(state);
    const transitioning = ["locking", "unlocking"].includes(state);
    this.shadowRoot.querySelector("h2").textContent = this._displayName();
    this.shadowRoot.querySelector(".state").textContent = STATES[state] || "Unknown";
    const disc = this.shadowRoot.querySelector(".disc");
    disc.dataset.state = Object.hasOwn(STATES, state) ? state : "unknown";
    disc.querySelector("ha-icon").setAttribute("icon", state === "locked" ? "mdi:lock" : state === "unlocked" ? "mdi:lock-open-variant" : "mdi:lock-question");
    for (const [key, selector, label, unit] of [["battery_entity", ".battery", "Battery", "%"], ["signal_entity", ".signal", "Wi-Fi", " dBm"]]) {
      const el = this.shadowRoot.querySelector(selector);
      const sensor = this._hass.states[this._config[key]];
      el.hidden = !this._config[key];
      const raw = sensor?.state;
      const value = typeof raw === "string" && raw.trim() !== "" && Number.isFinite(Number(raw)) ? raw : null;
      el.textContent = `${label}: ${value === null ? "Unavailable" : value + unit}`;
    }
    // An unknown bolt state still permits an explicit lock command for recovery.
    // Unlock requires a positively reported locked state.
    this.shadowRoot.querySelector(".lock").disabled = Boolean(this._busy) || transitioning || state === "unavailable" || state === "locked";
    this.shadowRoot.querySelector(".unlock").disabled = Boolean(this._busy) || !known || state !== "locked";
    this.shadowRoot.querySelector(".error").textContent = this._error || "";
  }

  async _command(service) {
    if (this._busy || !this._config || !this._hass || !["lock", "unlock"].includes(service)) return;
    if (this.shadowRoot.querySelector(`.${service}`).disabled) return;
    if (service === "unlock" && !window.confirm(`Unlock “${this._displayName()}”? This sends a physical unlock command.`)) return;
    this._busy = true;
    this._error = "";
    this._render();
    try {
      await this._hass.callService("lock", service, { entity_id: this._config.entity });
    } catch {
      // Do not render raw server errors, which can contain private device data.
      this._error = "Command failed or was not confirmed. Check the physical lock before retrying.";
    } finally {
      this._busy = false;
      this._render();
    }
  }
}

export class DeslocLockCardEditor extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: "open" }); }
  setConfig(config) { this._config = { ...config }; this._render(); }
  set hass(value) { this._hass = value; this._render(); }
  _render() {
    if (!this._config || !this._hass) return;
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.schema = [
        { name: "entity", required: true, selector: { entity: { domain: "lock" } } },
        { name: "name", selector: { text: {} } },
        { name: "battery_entity", selector: { entity: { domain: "sensor", device_class: "battery" } } },
        { name: "signal_entity", selector: { entity: { domain: "sensor", device_class: "signal_strength" } } },
      ];
      this._form.computeLabel = ({ name }) => ({ entity: "Lock", name: "Display name", battery_entity: "Battery sensor (optional)", signal_entity: "Wi-Fi signal sensor (optional)" })[name];
      this._form.addEventListener("value-changed", event => {
        event.stopPropagation();
        this._config = { ...this._config, ...event.detail.value };
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true }));
      });
      this.shadowRoot.append(this._form);
    }
    this._form.hass = this._hass;
    this._form.data = this._config;
  }
}

if (!customElements.get("desloc-lock-card")) customElements.define("desloc-lock-card", DeslocLockCard);
if (!customElements.get("desloc-lock-card-editor")) customElements.define("desloc-lock-card-editor", DeslocLockCardEditor);
window.customCards = window.customCards || [];
if (!window.customCards.some(card => card.type === "desloc-lock-card")) window.customCards.push({ type: "desloc-lock-card", name: "DESLOC Lock Card", description: "Lock control, reported state, battery and Wi-Fi signal.", preview: true });
console.info(`DESLOC Lock Card ${VERSION}`);
