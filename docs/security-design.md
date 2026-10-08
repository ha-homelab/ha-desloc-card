# Security design and verification

## Scope and trust boundaries

The project provides a browser-side Home Assistant dashboard card for physical locks.

The browser receives entity state and display text from Home Assistant. Keep untrusted state as text, preserve explicit unlock confirmation, and issue actions only for the configured entity. The confirmation is a user-interface safeguard; Home Assistant authorization and the integration enforce access to the physical lock. The card does not receive DESLOC cloud credentials.

## Source and operating documentation

- [ha-desloc-card.js](../ha-desloc-card.js)
- [README.md](../README.md)

## Regression evidence

- [test/card.test.js](../test/card.test.js)

Run the documented commands in [CONTRIBUTING.md](../CONTRIBUTING.md) and the
[CI workflow](../.github/workflows/ci.yml). Preserve negative tests for rejected inputs,
unavailable dependencies, authorization failures and cancellation. A passing
test run describes its fixtures and environment; it does not certify every
upstream service, hardware model or production deployment.

## Remaining security assessment

Record current static-analysis results and assess cryptographic criteria for the browser/HA authorization boundary; do not claim the card authenticates unlock requests by itself.

Report new issues through [SECURITY.md](../SECURITY.md). An OpenSSF assessment
records evidence and applicability; it is not a guarantee that a system is safe.
