# Release-candidate fuzzing

The public repository uses [Jazzer.js](https://github.com/CodeIntelligenceTesting/jazzer.js)
through the shared `venus-os-ci-toolkit` release workflow. A reviewed
`.github/fuzz.json` declares the targets and dependency setup. The reusable
workflow is pinned to a full commit in `.release-policy.json`.

Mutation campaigns run only for an explicit `rc` dispatch on the public
repository's default branch. Pull requests, pushes, beta releases and nightly
releases keep their ordinary tests; they do not run a mutation campaign. A
private fork cannot qualify through this public RC fuzz workflow. This is a
repository-managed Jazzer.js integration, not a claim of enrollment in Google's
hosted OSS-Fuzz service.

## What is exercised

* `render-state` feeds arbitrary UTF-8 names, numeric-looking sensor strings and
  known or unexpected lock states into the production custom element. It checks
  exact state labels, safe text rendering, unavailable telemetry and unlock
  availability. The corpus includes JavaScript prototype-property names.
* `unlock-boundary` feeds state, command, confirmation, busy and service-failure
  combinations into the production command handler. It checks that unlock needs
  a reported `locked` state and positive confirmation, that busy or invalid
  commands cannot send service calls, and that private failure text is hidden.

Both targets use a synthetic Happy DOM window and a stub Home Assistant service.
They never connect to Home Assistant, cloud accounts or a lock. The test does
not establish physical lock state, radio reliability, HA authorization or device
acceptance. Real device checks remain part of release acceptance.

The harness reuses one card, like Home Assistant's repeated state updates, and
waits for Happy DOM's asynchronous work after each input. Node's heap is capped
at 512 MiB. The shared runner additionally sets a 2 GiB RSS limit, a 10-second
per-input timeout, an outer process timeout and a 60-second mutation budget per
target. Inputs above 4 KiB are ignored. Two targets total two minutes of mutation;
dependency setup and ordinary release checks take additional time.

## Local reproduction

Use Node 24 and install only the isolated, locked fuzz dependencies:

```sh
npm ci --prefix fuzz --ignore-scripts --no-audit --no-fund
node --max-old-space-size=512 fuzz/node_modules/@jazzer.js/core/dist/cli.js \
  fuzz/render-state.mjs -- -max_total_time=60 -timeout=10 -rss_limit_mb=2048 \
  fuzz/corpus/render-state
node --max-old-space-size=512 fuzz/node_modules/@jazzer.js/core/dist/cli.js \
  fuzz/unlock-boundary.mjs -- -max_total_time=60 -timeout=10 -rss_limit_mb=2048 \
  fuzz/corpus/unlock-boundary
```

A local command is useful diagnostic evidence; the release gate requires the
shared isolated campaign from its own RC attempt. In CI, dependency setup may
use the network, and target execution uses a Linux network namespace without
network access. A successful command with no positive libFuzzer execution count
fails the shared gate.

When a target fails, download `fuzz-diagnostics-<attempt>` from the release run.
It contains setup/target logs, the campaign report, corpus files and crash or
timeout inputs. Reproduce a saved input with the same target and Node version:

```sh
node --max-old-space-size=512 fuzz/node_modules/@jazzer.js/core/dist/cli.js \
  fuzz/render-state.mjs -- -runs=1 /path/to/saved-input
```

Keep a small synthetic regression input and an ordinary unit test with the fix,
then create a new RC from the reviewed source. Do not add household names,
account data, credentials or real device records to the public corpus.

## Release evidence

A qualified RC includes `fuzz-report.json` and `release-inputs-fuzz.json` in its
release evidence. The shared publisher verifies the source SHA, repository,
run ID, attempt, manifest digest and exact successful target inventory. Fuzz
validation receipts are separate from platform build receipts. An old RC made
before adoption cannot satisfy the current fuzz policy. Beta and nightly
releases have no fuzz qualification claim.
