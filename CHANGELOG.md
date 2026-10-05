# Changelog

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
