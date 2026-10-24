# Changelog

## [0.4.0] - Beta

### Added

- Add a compact layout with the lock name, reported state, optional battery/Wi-Fi readings, details, and one adaptive action button.
- Add a **Compact layout** toggle to the visual editor and the optional `compact` YAML setting. Existing cards keep their full layout by default.
- Include **DESLOC Compact Lock Card** in the dashboard card picker as `custom:desloc-compact-lock-card`. Both variants use the same HACS package and JavaScript resource.
- Translate compact-layout settings and the compact picker description into all 24 supported languages; support narrow dashboards and right-to-left layouts.

### Upgrade

This is an opt-in beta. Select the latest 0.4.0 beta in HACS and reload the browser.
Enable **Compact layout** on an existing card, or add **DESLOC Compact Lock Card**.
No integration update, extra resource, or reauthentication is required. Before
rolling back to 0.3.x, change compact card types to `custom:desloc-lock-card` and
remove the `compact` option.

### Security

Both layouts share the existing command handling: explicit unlock confirmation,
state and target rechecks, pending-command protection, and no automatic retries.
Changing the layout never sends a lock command. Automated browser checks use
synthetic entities and do not operate a physical lock.

## [0.3.2] - 2026-10-18

### Changed

- Replace the obsolete Scorecard CI container with the reviewed, checksum-pinned scanner. Keep the upstream SARIF reporting policy, GitHub Security upload and retained report artifacts.
- Refresh pinned review and release-candidate fuzz workflows. Dashboard interactions and lock service calls are unchanged.

### Upgrade

Update through HACS or replace the verified JavaScript resource, then reload the dashboard. Preserve the previous resource and card configuration for rollback.

### Security

The replaced CI image contained 25 high-severity dependency findings in the recorded scan. The scanner replacement changes CI tooling, not the distributed application runtime. OpenSSF REST publication remains disabled as before.

Publication and synthetic UI checks do not operate a physical lock.

## [0.3.1] - 2026-10-17

### Changed

- Link the illustrated release-candidate fuzzing process and validation results from the project documentation.
- Keep this documentation maintenance release aligned with the declared package and npm lockfile versions.

### Upgrade

Update the card through the existing HACS or manual resource procedure and reload the browser. The single-action lock interface and all configuration remain unchanged. Keep the previous package for rollback.

### Security

This release does not change service-call permissions or unlock confirmation. Browser and fuzzing checks use synthetic entities and do not operate a physical lock.

## [0.3.0] - 2026-10-16

### Changed

- Replace the separate Lock and Unlock controls with one full-width action button. It offers Unlock for a reported locked state and Lock for an unlocked or uncertain state.
- Show localized Locking or Unlocking progress while an action is pending; unavailable entities disable the button. All 24 language packs and existing card configuration remain supported.
- Validate the intended command against current Home Assistant state independently of the DOM. Keep the confirmed entity and command fixed, and cancel if the target or allowed action changes during confirmation.
- Keep the action selected at the start of a pointer or keyboard press. If the lock state changes before release, cancel that activation instead of sending the opposite command.
- Preserve explicit unlock confirmation, one command per operation, safe error messages, and manual recovery without automatic retries.

### Validation

- Extend unit, translation, deterministic fuzz, and browser acceptance checks for the single action, state transitions, confirmation, pending requests, and keyboard interaction.
- Browser fixtures use synthetic Home Assistant entities and stubbed service calls; they do not operate or certify a physical lock.

### Upgrade

Update the card through the existing HACS custom repository or replace the
manual JavaScript resource, then reload the browser. No integration update,
account reauthentication, or YAML migration is required. The older screenshot
walkthrough remains a historical view of the two-button interface.

### Security

Unlock requires a reported locked state and explicit confirmation naming the
selected lock. A state or target change during a press or confirmation cancels
that activation; it cannot substitute the opposite command. Pending actions
block repeat commands. This release adds no device permissions, automatic
actions, or retries. Reported state is not a door-open sensor.

## [0.2.0] - Development line

### Added

- Translate the card and visual editor into 24 languages, following the Home Assistant profile by default with an optional per-card override.
- Include translated states, telemetry, commands, physical-unlock confirmation, safe failure messages, configuration validation, and accessibility labels.
- Support regional language tags, English fallback, and right-to-left Arabic, Hebrew, and Persian layouts.
- Bundle all translations offline in the existing HACS JavaScript asset, with complete-key and placeholder checks and language-aware safety tests.

### Changed

- Keep displayed text current when the HA profile language changes without modifying card configuration, user names, entity IDs, or pending commands.
- Synchronize the development version banner with the 0.2.0 package line. Release packaging stamps the planned package version; RC identity is recorded in the release manifest.

### Upgrade

Use the existing HACS custom repository or manual installation procedure and
reload the browser. Existing configuration works unchanged. Set **Language** in
the visual editor only when a card should differ from the HA profile. No extra
resource files, translation service, or migration are required. This release
candidate is an opt-in preview; native-speaker corrections are welcome.

### Security

Language changes never send commands or clear pending-command gates. Unlock
still requires a reported locked state and an explicit confirmation naming the
selected lock. Translations and names render as text, and raw service errors
remain hidden. Synthetic tests do not establish physical lock acceptance.

## [0.1.5] - Development line

### Changed

- Refresh the pinned CodeRabbit review and autofix workflow revisions while retaining the current fuzz qualification runtime.
- Record the second D110 Plus community report, including PIN functionality, without claiming a particular PIN creation workflow or keypad test.
- Reconcile the release history with the published 0.1.3 and 0.1.4 releases.

### Upgrade

This beta is an opt-in preview. Use the existing HACS custom repository or manual
installation procedure, then reload the browser. The card's runtime behavior,
configuration, and release asset name are unchanged.

### Security

Existing unlock confirmation and one-shot command behavior are unchanged. This
release updates development automation and documentation; it adds no device
permissions or automatic lock actions.

## [0.1.4] - 2026-10-14

### Changed

- Qualify this release with the bounded, offline RC fuzz campaign and deterministic seed replay checks.
- Bind release evidence to the exact source and toolkit revision, validate seed corpora, and retain engine execution counts and diagnostic artifacts.
- Document the fuzzing scope, resource limits, and the distinction between synthetic checks and target acceptance.

### Upgrade

Use the existing installation or update procedure. This release changes validation
and release tooling; existing user configuration and data formats are preserved.
Keep the previous immutable release for rollback. Test the exact RC package on the
intended target before accepting a stable promotion.

### Security

The campaign operates offline on synthetic inputs. It rejects missing or invalid
seed corpora and incomplete execution evidence. These checks do not establish
untested hardware, integrations, credentials, or deployment behavior.

## [0.1.3] - 2026-10-14

- Render unknown lock states as Unknown, including JavaScript prototype-property names.
- Add bounded, offline RC-only Jazzer.js campaigns for card rendering and command confirmation.
- Publish HACS-compatible card assets with frozen versions, checksums and source-bound release evidence.
- Include Python release helpers in CodeQL analysis.
- Document governance, private reporting and current OpenSSF evidence limits.

### Upgrade

Use the existing HACS custom repository or replace ha-desloc-card.js manually,
then reload the browser. The HACS asset name and card configuration stay the
same. This preview adds no migration or automatic lock action. Check the card
on desktop and mobile before considering stable promotion.

### Security

Unknown state strings, including JavaScript prototype-property names, now
render as Unknown. Unlock still requires a reported locked state and explicit
confirmation. Offline RC fuzzing uses synthetic data and stub service calls;
it does not verify physical lock state or authorize real device operations.

## 0.1.2 — 2026-10-05

- Promote the installed 0.1.2-rc.1 candidate to stable with unchanged behavior.
- Identify the selected lock by its displayed name in unlock confirmation.
- Use a neutral reported-state caption for DESLOC and other HA lock entities.
- Preserve cancellation, pending-state handling, and single-shot service calls.

Validation: 13 automated card tests. The release candidate was installed through
HACS and its served JavaScript was verified against the release artifact.

## 0.1.2-rc.1 — 2026-10-04

- Promote the beta to a release candidate with no behavior changes.
- Keep named unlock confirmation and the neutral reported-state caption.

The beta passed all 13 automated card tests. This release candidate remains
an opt-in prerelease with the same runtime behavior.

## 0.1.2-beta.1 — 2026-10-04

- Identify the selected lock by its displayed name in unlock confirmation.
- Use a neutral reported-state caption for DESLOC and other HA lock entities.
- Cover configured names, renamed entities, fallback labels, cancellation, and
  unchanged service targets with regression tests.

This is a prerelease for opt-in testing. Existing command confirmation, pending
state handling, and single-shot service calls are preserved.

## 0.1.1 — 2026-10-01

- Expand the English HACS custom-repository and manual installation instructions.
- Add a preview of the installed card and clarify that default HACS catalog
  inclusion is pending, not an endorsement or current listing.
- No changes to lock control behavior.

## 0.1.0 — 2026-10-01

- Initial dashboard card with reported lock state, battery, and Wi-Fi signal.
- Visual configuration editor, theme support, and required unlock confirmation.
- Commands execute once, with errors for failed or unconfirmed operations.
