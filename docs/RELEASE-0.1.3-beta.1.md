# DESLOC Lock Card 0.1.3-beta.1

## Changes

This opt-in beta qualifies the current source with the updated CI and locked development dependencies. The lock-control behavior is unchanged from the previous stable release. The package reports a distinct prerelease version so beta and stable installations remain identifiable.

## Upgrade

Keep the current stable release for normal use. To test this beta, explicitly enable prereleases in HACS and select `0.1.3-beta.1`. For manual installation, open the [versioned beta release](https://github.com/ha-homelab/ha-desloc-card/releases/tag/v0.1.3-beta.1), download `ha-desloc-card.js` and `SHA256SUMS`, verify the checksum, and replace the existing card file in the Home Assistant `www` directory. Keep its Lovelace resource URL and reload the browser; if cached, update the URL query suffix to `0.1.3-beta.1`. The README links to stable releases, so select this beta page explicitly. Preserve the existing configuration and reload the browser after updating the card resource. Downgrading uses the previous stable artifact. No new live-lock acceptance is claimed by this packaging release.

## Security

Keep account sessions, access tokens and private device identifiers out of reports and committed configuration. Existing confirmation, authentication and diagnostic redaction behavior is retained. Verify the release checksums before manual installation.
