# Contributing

Use [GitHub issues](https://github.com/ha-homelab/ha-desloc-card/issues) for non-sensitive bug reports, questions and
feature proposals. Include the exact version/commit, environment, expected and
actual behavior, and a minimal sanitized reproduction. Check existing issues
first and keep follow-up evidence in the original thread. For vulnerabilities,
use the [private security process](SECURITY.md).

Submit a focused pull request against `main`. Describe the user-visible problem,
the resulting behavior, compatibility implications and checks performed. Preserve
existing authorship and third-party license/provenance records. Discuss changes
to protocols, storage, device safety or dependency/runtime requirements before
making an incompatible change. English is the common language for code review
and project documentation.

## Development and validation

```sh
npm ci --ignore-scripts
npm test
```

Use Node.js 24 as in CI. The JavaScript file is distributed directly; CI also checks HACS metadata. Browser mocks do not prove physical lock actuation.

The [CI workflow](.github/workflows/ci.yml) is the authoritative list of required jobs.
Use isolated test data and temporary outputs. Never run a device write, unlock,
deployment or publication command merely to validate a documentation change.

## Test and review policy

Changes to behavior must add or update automated tests that fail for the old
defect and cover the new boundary; regression fixes should include the relevant
failure case. If automation is infeasible, explain why in the PR and document
the reproducible manual procedure and limits. Update user/API documentation and
release notes for user-visible changes. Keep compiler, lint, static-analysis and
test assertions enabled, resolve new warnings, and document any remaining
warning with its reason and scope. Do not suppress a real security finding to
obtain a passing check. Wait for required checks and independent review before
merging; do not use an administrator bypass.

## Contribution rights and coding conventions

Submit only work you have the right to contribute under this repository's
applicable FLOSS licenses. Preserve third-party license and provenance notices.
No separate contributor agreement or mandatory DCO sign-off is currently used.
Keep changes focused, follow the surrounding language style and documented
interfaces, use synthetic fixtures, and explain security/compatibility effects.
New major functionality must include automated behavior tests. Fixes should
include a reproducer that fails before the change, or document why automation
is infeasible. New or changed interfaces require matching documentation.

See [governance](GOVERNANCE.md), [conduct](CODE_OF_CONDUCT.md),
[roadmap](ROADMAP.md) and [quality evidence](docs/quality.md).

### Language style

Use PEP 8's four-space indentation and explicit imports for Python; keep
maintained Python compatible with the declared runtime and enabled Ruff rules
where configured. JavaScript/TypeScript uses two-space indentation, semicolons,
strict modules and explicit interface types where TypeScript is used. Native
C++ changes follow the surrounding ESPHome style, use explicit bounds and avoid
unchecked pointer arithmetic. Do not reformat vendored code independently of
its recorded upstream source. Existing exceptions must be explained in review.
## Browser acceptance

The required CI call runs real Chromium, Firefox and WebKit user flows on Linux,
plus Chromium on Windows and WebKit on macOS. Nightly and beta qualification
keep these five targets. RC qualification, scheduled audits and manual audits
without a release channel expand to three locked browser generations and the
installed Chrome/Edge Stable and Beta channels (35 targets total). Stable
promotion reuses the accepted RC bytes; the shared release verdict binds each
result to the source, channel, run and attempt. These checks
use synthetic Home Assistant state; they do not connect to a real lock.

`scripts/browser-acceptance.cjs` exercises the actual shadow DOM, confirmation
dialogs, command suppression while pending, unavailable states, safe errors and
manual retry, all 24 locales/RTL, text escaping and keyboard interaction. Each
target preserves its actual browser version, completed scenario names and a
screenshot. Missing or stale evidence fails the shared check. Playwright WebKit
is not native Safari, and viewport tests are not real mobile-device acceptance.

The separate `tools/browser-compatibility/` locks keep historical browser
generations independent of application dependencies. Refresh their reviewed
inventory using `scripts/prepare_browser_compatibility.py` from the pinned
`venus-os-ci-toolkit` checkout, then qualify all targets; do not update all three
toolchains to one version. The existing shared Renovate CI preset does not
enable npm updates for these intentionally historical locks.
