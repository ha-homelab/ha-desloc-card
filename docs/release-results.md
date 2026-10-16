# Release results: card v0.2.0

This is a **static snapshot from 15 October 2026, Pacific time**. It describes
[v0.2.0](https://github.com/ha-homelab/ha-desloc-card/releases/tag/v0.2.0), promoted
from v0.2.0-rc.1, rather than the current status of `main`. The workflow and
browser-check timestamps fall on 16 October in UTC. Values and source links
are retained in [release-results.json](release-results.json).

[![v0.2.0 results: 44 passing tests, 24 locales across three engines, and two successful fuzz targets](diagrams/release-results.svg)](diagrams/release-results.svg)

## Automated candidate checks

The [RC validation run](https://github.com/ha-homelab/ha-desloc-card/actions/runs/38833239966)
passed **44 unit tests**, with no failures or skipped tests. They exercise
confirmation, duplicate clicks, error handling, entity availability, safe
rendering, configuration, and translation contracts using synthetic HA state.

Two isolated fuzz campaigns also completed successfully: **44,258 render-state
executions** and **42,716 unlock-boundary executions**. Each target used a
60-second mutation budget through Jazzer.js/libFuzzer. The chart uses the same
zero-based scale for both targets; the counts describe executed inputs, not
relative quality or coverage. Startup and packaging are outside the mutation
budget. See the published [fuzz report](https://github.com/ha-homelab/ha-desloc-card/releases/download/v0.2.0/fuzz-report.json)
and the [target descriptions](fuzzing.md).

## Maintainer browser checks of the published JavaScript

Local Playwright checks passed all **24 locales in each of three engines**:
Chromium 156.0.8078.4, Firefox 157.0, and WebKit 27.2. The chart's C/F/W markers
identify those engines. These were maintainer-run checks of the exact published
JS, not a hosted CI job or a test of every browser/OS combination.

The checks covered regional and English fallback, per-card overrides,
right-to-left direction, literal rendering of hostile names, 375-pixel layout,
cancel sending no call, confirm sending one call, and disabled controls for
unavailable entities. They used synthetic HA entities and stubbed service calls;
no physical lock commands were sent. The record was captured at
`2026-10-16T01:10:21.206Z` against the JS SHA-256:

```text
e2d1b24fc1a66ae4fe81ef2f7c1ba8a8d87570a59d6b111c74479651949f5fa8
```

The sanitized maintainer record is included in
[release-results.json](release-results.json). See the [language guide](i18n.md)
for the actual list of supported packs.

## Stable promotion

All **seven published files**, including the manifest, matched the accepted RC
byte for byte. The [stable promotion run](https://github.com/ha-homelab/ha-desloc-card/actions/runs/38839561398)
verified the retained candidate evidence. Its source revision was
[`f3bb1f3`](https://github.com/ha-homelab/ha-desloc-card/commit/f3bb1f32fd74bb0ba88969d6585237a444ae4b07).

[![Release process: review, build and verify an RC, approve publication, and promote identical assets](diagrams/release-pipeline.svg)](diagrams/release-pipeline.svg)

A reviewed PR and successful CI precede an explicitly requested RC, its
packaging, and isolated fuzz campaigns. Maintainers inspect its source, hashes,
reports, and acceptance results before requesting stable publication. After
approval, promotion verifies provenance and copies the accepted assets without
rebuilding. Code, dependency, or packaging changes require a new RC.

The [release strategy](../RELEASING.md) and [runbook](release-workflow.md) define
the gates and commands. Publishing a release and installing it in HA are
separate operations. The [integration's results](https://github.com/ha-homelab/ha-desloc/blob/main/docs/release-results.md)
cover backend validation separately.

## Scope and future updates

These are test and input counts, not code-coverage percentages, security
guarantees, performance measurements, or proof of physical lock reliability.
For a later release, collect fresh source/run IDs and reports and update the
chart, JSON, and prose together. Do not treat this snapshot as live status or
reuse it as evidence for changed code.
