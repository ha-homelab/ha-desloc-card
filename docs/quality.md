# Quality and assessment scope

This assessment covers the browser card and its packaging tools. It does not award a badge to
upstream Home Assistant, firmware, hosted platforms or downstream installations.

## Verification

Use the commands in [CONTRIBUTING](../CONTRIBUTING.md) and the current GitHub
Actions workflows. Keep the source commit, tool versions, command and outcome
with any evidence. A green job describes the checks it actually executed; a
path-filtered skipped job is not a fresh execution of those checks.

Compiler/safe-language warnings, static security analysis and dynamic tests have
different scopes. Document individual accepted warnings rather than disabling
rules globally. A successful simulated test or compilation does not establish
physical device behavior.

## Security argument

Home Assistant authenticates users and authorizes lock services. The card never receives cloud credentials. Entity state and names are untrusted text; unlock requires confirmation.

The security policy and implementation-specific tests describe the controls
for those boundaries. This is a compact engineering argument, not an independent
security certification or a completed formal assurance case.

## Current limits

Whole-project statement coverage of at least 80% has not been established by
this assessment. Test counts are not a coverage percentage. The maintainer has
confirmed knowledge of secure design and common vulnerability classes; knowledge
does not replace the implementation evidence. Governance records the absence of
a tested backup-maintainer/recovery arrangement, so Silver continuity is unmet.

Only a saved and verified public OpenSSF assessment establishes an awarded badge.
Missing evidence stays unmet until it is actually produced.

## Assessment record — 2026-10-14

The current GitHub inventory found no non-PR issues, public project advisories
or open dependency alerts. Pull requests came from the maintainer and maintenance
bots. The maintainer confirmed no outside-GitHub bug, enhancement or vulnerability
reports in the preceding 12 months. Private vulnerability reporting is enabled.
Gitleaks scanned 41 available Git commits without a finding. These observations
are dated evidence, not a permanent guarantee or a claim of zero future defects.

Local verification passed 14 card tests, 3 packaging tests and 8 workflow-action
checks. CodeQL now explicitly includes Python release helpers as well as
JavaScript and Actions. The ES-module card uses strict language semantics.

The local npm audit endpoint was unavailable during this review. It is not
counted as a successful zero-finding npm audit; dependency-review CI and the
dated GitHub advisory inventory provide separate evidence.
