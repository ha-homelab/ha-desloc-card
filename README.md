# DESLOC Lock Card

[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/15472/badge)](https://www.bestpractices.dev/en/projects/15472)

[![Checks](https://github.com/ha-homelab/ha-desloc-card/actions/workflows/ci.yml/badge.svg)](https://github.com/ha-homelab/ha-desloc-card/actions/workflows/ci.yml)

[![Fuzzing: RC only](https://img.shields.io/badge/Fuzzing-RC%20only-blue)](docs/fuzzing.md)

A Home Assistant dashboard card for [DESLOC for Home Assistant](https://github.com/ha-homelab/ha-desloc).
Shows reported lock state, battery, and Wi-Fi signal, with one adaptive action button,
a visual editor, full and compact layouts, light/dark theme support, and a required unlock confirmation.
The card is independent of DESLOC, Home Assistant, and HACS.

The companion integration automatically discovers all locks returned by the
DESLOC account. C100 Plus is maintainer-tested. D110 Plus has a
[general working report](https://github.com/home-assistant/feature-requests/discussions/2138#discussioncomment-18702050)
and a [second report that also confirms PIN functionality](https://github.com/home-assistant/feature-requests/discussions/2138#discussioncomment-18706123),
both from October 1, 2026. The PIN report does not describe its creation workflow,
keypad testing, or firmware version. A [K120 owner also reported working
integration and the entities used by this card](https://community.home-assistant.io/t/desloc-smart-locks-custom-integration-and-dashboard-card-model-compatibility-reports/1027056/2),
without separate lock/unlock or PIN test details. Models without maintainer
validation retain their experimental runtime label. See the integration's
[compatibility notes](https://github.com/ha-homelab/ha-desloc/blob/main/docs/compatibility.md).
The card uses Home Assistant entities and actions; it never receives DESLOC
credentials or connects directly to the vendor cloud. It can also display other
standard HA lock entities, but their behavior depends on the underlying integration.

<a href="docs/images/lock-card-locked.jpg"><img src="docs/images/desloc-card-hero.png" width="600" alt="DESLOC lock card in perspective"></a>

Historical card **0.1.1** screenshot; current versions use one adaptive action button.
Click for the unchanged readable original. [Animated walkthrough](docs/media/desloc-overview.gif).

A looping 30-second English walkthrough of the companion integration and card,
made from actual UI screenshots in Home Assistant 2026.9.1 with integration 0.3.0
and card 0.1.1. It is not a continuous recording or proof of physical lock
actuation. The cloud-reported bolt state may be cached; it is not a door-open sensor.
Version 0.3.0 replaces the two controls shown in this historical walkthrough
with one button that offers the action appropriate to the reported state.

[Watch the MP4](docs/media/desloc-overview.mp4), read the
[scene synopsis](docs/screenshots.md#video-overview), or browse the
[static screenshot gallery](docs/screenshots.md).

## Install through HACS

The card is included in the default HACS catalog; its
[submission was accepted on October 24, 2026](https://github.com/hacs/default/pull/11473).

1. Open **HACS** and search for **DESLOC Lock Card**.
2. Download the latest stable release of **DESLOC Lock Card** (not `main` or a
   prerelease) and reload the browser.
3. Edit a dashboard, add **DESLOC Lock Card**, and select the lock and optional
   battery/Wi-Fi sensors in the visual editor.

The card and integration are separate repositories. If you do not already have
a lock entity, first install the [DESLOC integration](https://github.com/ha-homelab/ha-desloc#installation)
by searching for **DESLOC** in HACS and complete its setup.

Home Assistant 2026.9.1 is the tested baseline.

If HACS does not register a resource automatically, add
`/hacsfiles/ha-desloc-card/ha-desloc-card.js` as a **JavaScript module** under
**Settings → Dashboards → ⋮ → Resources**. Enable **Advanced mode** in your
HA profile if the resources menu is hidden.

### Custom repository fallback

If the card does not appear in your HACS catalog, add
`https://github.com/ha-homelab/ha-desloc-card` under **HACS → Custom repositories**,
type **Dashboard** (called **Plugin** in some versions). Then download the latest
stable release and follow the browser reload and dashboard setup steps above.

## Manual installation without HACS

1. Download `ha-desloc-card.js` from the [latest stable release](https://github.com/ha-homelab/ha-desloc-card/releases/latest).
2. Copy it into your HA configuration directory as `www/ha-desloc-card.js`.
   Create `www` if it does not exist. For HA OS, the full path is
   `/config/www/ha-desloc-card.js`. For Container, use the configuration directory
   mounted at `/config`.
3. Under **Settings → Dashboards → ⋮ → Resources**, add
   `/local/ha-desloc-card.js` with type **JavaScript module**. Enable Advanced mode
   in your profile if needed. If you just created `www`, restart HA once.
4. Reload the browser, edit a dashboard, and add **DESLOC Lock Card**. Choose the
   lock entity and optional sensors, or use the YAML below.

To update, replace the JS file with the new stable release and reload the browser.
If it remains cached, append the version to the resource URL, for example
`/local/ha-desloc-card.js?v=0.1.2`. Do not register both the HACS and manual resource
URLs at once.

## Configuration

```yaml
type: custom:desloc-lock-card
entity: lock.front_door
name: Front door
battery_entity: sensor.front_door_battery
signal_entity: sensor.front_door_wi_fi_signal
```

Use your actual entity IDs. Only `entity` is required; it must be a `lock` entity.
`name`, `battery_entity`, `signal_entity`, `language`, and `compact` are optional. Use a battery percentage
sensor and RSSI sensor in dBm. Omit sensors that do not exist.

### Compact card (0.4.0 beta)

The compact layout keeps the lock name, reported state, optional battery/Wi-Fi
readings, details button, and single action in a smaller card. It uses the same
unlock confirmation and command handling as the full layout.

Both layouts ship in the **same HACS download and JavaScript resource**:

- Edit an existing **DESLOC Lock Card** and enable **Compact layout**.
- Or add **DESLOC Compact Lock Card** from the dashboard card picker. This starts
  with the compact layout enabled; its editor can also switch back to the full layout.

For an existing card, add `compact: true` to its YAML. For a new compact card:

```yaml
type: custom:desloc-compact-lock-card
entity: lock.front_door
name: Front door
battery_entity: sensor.front_door_battery
signal_entity: sensor.front_door_wi_fi_signal
```

The full card remains the default for existing configurations. Compact cards
start at full section width with automatic height in a Sections dashboard and
can be resized down to half a section. On narrow tiles the action moves below
the text, and long names or errors can expand the card without clipping.
No second resource, integration setup, or account login is needed.

**Beta testing:** compact mode is introduced in the 0.4.0 beta series. In HACS,
open **DESLOC Lock Card**, choose **Redownload**, enable prerelease versions,
and select the latest `v0.4.0-beta.*` release. Reload the browser after downloading.
The stable 0.3.x series does not include compact mode. To roll back, switch compact
card types to `custom:desloc-lock-card`, remove `compact`, redownload the previous
stable version, and reload the browser.

## Languages

The card and visual editor support 24 languages and follow your Home Assistant
profile by default. Use **Language** in the editor or an optional `language: fr`
in YAML to choose a different language for one card. Arabic, Hebrew, and Persian
use right-to-left layout. Regional tags resolve to the matching pack; unsupported
languages fall back to English. All translations ship in the single JS file.

Changing language does not send commands or change lock names, entity IDs, or
telemetry. Unlock confirmation and command errors use the selected language.
See the [language guide](docs/i18n.md) for the complete list, fallback rules, and
translation contributions. Documentation and the screenshot walkthrough remain
in English.

## Behavior

- One action button shows **Unlock** when the reported state is locked and
  **Lock** when it is unlocked. The reported state remains visible above it.
- Unlock requires a reported **locked** state and an explicit confirmation that
  names the selected lock. The title and confirmation use the configured display
  name, then the entity's current friendly name, then its entity ID.
- The caption says **Reported lock state** for every entity; it does not infer a
  vendor or cloud connection from the entity ID or name.
- During a request or state transition, the button shows **Locking…** or
  **Unlocking…** and is disabled, even if HA reports the target state early.
- Unknown, jammed, and unrecognized states retain an explicit **Lock** action
  for manual recovery, but never Unlock. No action is sent merely because the
  state or button label changes.
- Unavailable or missing entities disable the button. Missing sensor data is displayed as
  unavailable, never as zero.
- The card never retries a command automatically and never invents a successful
  state. A failed or unconfirmed action displays an error.
- The information button opens the normal Home Assistant entity details.

Reported bolt state is not a door-open sensor and may be cached by the cloud.
After an uncertain result, check the physical lock before issuing another command.

Cancelling the confirmation closes the prompt without sending a command.
The selected entity and action are fixed at the start of a pointer or keyboard
press and checked again at activation and after confirmation. If the target or
state changes meanwhile, that activation is cancelled instead of switching to
the opposite command.

[![Unlock flow: check HA state, confirm the selected lock, call its service once, and display the result](docs/diagrams/interaction.svg)](docs/diagrams/interaction.svg)

The [visual process guide](docs/how-it-works.md) explains the interaction and
[language selection](docs/diagrams/language-flow.svg), including regional
fallback and right-to-left layout.

## Release results

[![v0.2.0: 44 passing tests, 24 locales in three browser engines, and two successful fuzz targets](docs/diagrams/release-results.svg)](docs/diagrams/release-results.svg)

This **15 October 2026** snapshot describes v0.2.0, not live `main` status.
Read the [results, sources, and release process](docs/release-results.md) for
the automated checks and separate maintainer browser checks. They use synthetic
HA state and do not establish physical lock operation.

## Development

Requires Node.js 24 or newer for the development workflow. The shipped JavaScript
has no runtime dependencies. Normal installation needs no build step; translation
contributors regenerate the checked-in dictionary with `node scripts/build-i18n.mjs`.

```sh
npm ci --ignore-scripts
npm test
```

Tests cover confirmation, duplicate clicks, failure behavior, unavailable states,
safe rendering, editor configuration, and all 24 language packs. Translation
contract tests also check the generated single-file bundle and placeholders. They mock HA; they do not operate a lock.
Before a release, also check the card in Home Assistant on desktop and mobile sizes.
The [RC fuzzing guide](docs/fuzzing.md) explains the isolated mutation targets,
budgets and diagnostics; [release instructions](RELEASING.md) describe the
versioned HACS assets and review gates.

## Contributing and security

Open issues and pull requests in this repository. Include browser/HA versions and
an anonymized card configuration. Never post account sessions, access tokens,
raw network captures, private device identifiers, or Home Assistant backups.
Report vulnerabilities privately using GitHub's security reporting when available.

## License

[MIT](LICENSE). Names and trademarks belong to their respective owners.

## Project maintenance

See [contribution and test requirements](CONTRIBUTING.md), the
[security reporting policy](SECURITY.md), [security design](docs/security-design.md),
and the [OpenSSF evidence and remaining criteria](docs/openssf-evidence.md).

## Project practices

[Contribute](CONTRIBUTING.md) · [Governance](GOVERNANCE.md) ·
[Code of Conduct](CODE_OF_CONDUCT.md) · [Roadmap](ROADMAP.md) ·
[Quality and assessment scope](docs/quality.md)

## Screenshot artwork

Regenerate the perspective cover with `bash scripts/render-docs-hero.sh`
(ImageMagick 7). It preserves the original screenshot and only adds a geometric
projection and shadow. The linked flat image remains the readable reference.
