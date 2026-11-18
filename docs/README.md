# Documentation

A Home Assistant dashboard card for physical locks, with the release records,
translation coverage and security design that accompany it.

## Using the card

- [How the DESLOC Lock Card works](how-it-works.md) — the standard lock entities and optional features it fronts.
- [Languages and translation contributions](i18n.md) — the 24 language packs and how to contribute one.
- [Screenshots](screenshots.md) — cropped captures of the real interface.
- [Diagram sources](diagrams/README.md) — the editable SVG sources rather than screenshots.

## Security and quality

- [Security design and verification](security-design.md) — what the browser-side card does and the verification behind it.
- [Quality and assessment scope](quality.md) — the card and packaging tools, and the limits of the assessment.
- [OpenSSF evidence](openssf-evidence.md) — the proposed Passing assessment recorded in `.bestpractices.json`.

## Releases

- [DESLOC Lock Card 0.1.3-beta.1](RELEASE-0.1.3-beta.1.md) — what the opt-in beta qualifies.
- [Release results: card v0.2.0](release-results.md) — a static snapshot from 15 October 2026.
- [CI dependency updates](dependency-updates.md) — the shared Renovate preset for actions and reusable workflows.
- [CI and release operations](release-workflow.md) — `.release-policy.json` and the required status.
- [Version plans and manifest synchronization](VERSIONING.md) — the versioning opt-in.
- [Release-candidate fuzzing](fuzzing.md) — the illustrated fuzzing process.
- [Fuzzing release candidates](rc-fuzzing.md) — the reusable bounded fuzz workflow.
- [Release read recovery and rerun validation](release-read-safety.md) — the two fixes carried from the shared toolkit.
- [Early final-build runner check](runner-preflight.md) — why the check runs before the final build.
