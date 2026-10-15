# Changelog

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
