# Release-candidate fuzzing

See the [illustrated RC fuzzing process and verified rollout results](https://github.com/victron-venus/venus-os-ci-toolkit/blob/main/docs/rc-fuzzing-results.md)
for the shared release flow, evidence requirements and a dated cross-project
snapshot. The project-specific scope and reproduction guidance below still apply.

> **Local packaging:** `python3 scripts/release.py package` is unsupported in this repository because no shell packaging adapter is installed. Use the [project commands below](#local-release-packaging); the generic example in `release-workflow.md` does not apply here.

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

## Local release packaging

Use Python 3.12+ from the repository root:

```sh
python3 scripts/test_package_card.py
python3 scripts/package_card.py
```

This writes `ha-desloc-card.js`, checksums and version metadata to a new `release-dist/` directory. It preserves the HACS entry-point filename and stamps the version from the prepared package metadata. It does not install the card into Home Assistant. Use a clean disposable checkout and a new output directory.

To reproduce an already allocated beta or RC, first check out the exact source
commit from its published `release-manifest.json`, restore that manifest's
`version_plan` object as `.release-plan.json`, and apply its version overlay:

```sh
python3 scripts/version_plan.py sync --root . --plan .release-plan.json
```

Then run the project commands above. Keep the source, plan and channel together;
do not invent a release sequence or edit version fields by hand. Local packaging
does not create a qualified release: the hosted pipeline still verifies the full
build inventory, provenance and, for an RC, its own isolated fuzz report.

## Deterministic target-contract checks

Ordinary CI now replays the real fuzz target exports using the checked-in
synthetic corpus, fixed malformed inputs and a bounded deterministic byte matrix.
It awaits asynchronous targets and propagates assertion failures. This catches
harness/production API drift without starting Jazzer or a mutation campaign.
The RC preflight repeats this check after its locked setup.

Run locally from the repository root:

```sh
npm ci --prefix fuzz --ignore-scripts --no-audit --no-fund
node fuzz/replay.mjs
```

The replay preserves the same offline boundaries as the targets above; it does
not qualify a release or substitute for the RC's isolated campaign.

## Release workflow retries

Fresh release inputs are selected by the exact GitHub workflow run ID and run
attempt. After a failed or partial run, choose **Re-run all jobs** so every
required producer creates inputs for the same attempt. Retrying only failed jobs
or an individual job intentionally fails when a complete current-attempt input
set is missing.

Artifacts from older attempts may remain available for diagnostics; they are not
inputs to the new attempt and do not need to be deleted. Filtering artifact names
alone does not prove package completeness or receipt identity. Complete package
inventory and receipt identity checks remain separate release requirements.

See the shared [package identity and retry contract](https://github.com/victron-venus/venus-os-ci-toolkit/blob/main/docs/VERSIONING.md#package-identity-across-reruns).
