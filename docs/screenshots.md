# Screenshots

These are cropped captures of the actual Home Assistant interface. The new
locked-state and visual-editor screenshots use Home Assistant 2026.9.1 and DESLOC
Lock Card 0.1.1. No lock or unlock commands were executed while making these new
captures.

The displayed state comes from the underlying integration. With DESLOC, it is a
cloud-reported bolt state that may be cached, not a door-open sensor. Screenshots
record what the interface displayed at capture time, not the lock's current state.

## Video overview

[Watch the 30-second overview](media/desloc-overview.mp4) of the companion
integration and dashboard card. This silent, English screenshot walkthrough is
1280 × 720 at 30 fps. The actual UI was captured on October 1, 2026, using Home
Assistant 2026.9.1, DESLOC integration 0.3.0, and DESLOC Lock Card 0.1.1. It is an
edited sequence of screenshots, not a continuous recording or evidence of
physical lock actuation.

The captions were updated after the
[D110 Plus community report](https://github.com/home-assistant/feature-requests/discussions/2138#discussioncomment-18702050).
The UI screenshots still show the maintainer's C100 Plus, using the capture
versions listed above; they do not depict a D110 Plus test.

The README uses a [looping GIF](media/desloc-overview.gif) of the same 30-second
screenshot sequence. The MP4, text synopsis below, and static screenshots remain
available as alternatives to the animation.

The captions describe the project at recording time. Both projects are now in
the default HACS catalog: search for **DESLOC** for the integration and
**DESLOC Lock Card** for the separate dashboard card. Use the current
[installation instructions](../README.md#install-through-hacs). A later
[D110 Plus report includes PIN functionality](https://github.com/home-assistant/feature-requests/discussions/2138#discussioncomment-18706123),
and a [K120 owner reported working integration and available card entities](https://community.home-assistant.io/t/desloc-smart-locks-custom-integration-and-dashboard-card-model-compatibility-reports/1027056/2).
See the current [compatibility notes](https://github.com/ha-homelab/ha-desloc/blob/main/docs/compatibility.md)
for the scope of each report.

The six historical scenes, in order:

1. **Set up DESLOC:** choose email sign-in or an existing app session. A new
   sign-in can invalidate the phone app session.
2. **Discover locks:** all returned locks are added during setup or
   reconfiguration. C100 Plus: maintainer-tested. D110 Plus: community-reported
   working. Other models remain experimental.
3. **View reported state:** the card shows bolt state, battery, and Wi-Fi.
   Cloud reports may be cached and are not a door-open sensor.
4. **Configure the card:** select a lock, display name, and optional sensors.
   The card uses HA entities and never receives DESLOC credentials.
5. **Add a permanent PIN user:** open Settings → Devices & services → DESLOC →
   Configure. The displayed form is empty; submitting it creates permanent access.
   Permanent PIN creation was physically tested on C100 Plus. D110 Plus PIN
   testing had not been reported when these captions were written.
6. **Find the projects:** C100 Plus is maintainer-tested; D110 Plus is
   community-reported working. Other models remain experimental. The unofficial
   [cloud integration](https://github.com/ha-homelab/ha-desloc) and optional
   [dashboard card](https://github.com/ha-homelab/ha-desloc-card) are separate
   repositories. At recording time both used HACS custom repositories while
   their catalog submissions awaited review; use the current installation
   instructions above.

## Reported locked state

![DESLOC Lock Card showing Locked, battery level, Wi-Fi signal, and lock controls](images/lock-card-locked.jpg)

The card displays the reported Locked state and optional battery and Wi-Fi
sensors. Unlock requires confirmation when selected.

## Visual editor

![DESLOC Lock Card visual editor with entity selectors and a live card preview](images/card-visual-editor.jpg)

Choose a lock entity, display name, and optional battery and Wi-Fi sensors. The
preview shows the resulting card beside the form.

## Earlier reported unlocked state

![Earlier DESLOC Lock Card capture showing a reported Unlocked state](images/lock-card.jpg)

This image is preserved from an earlier capture. It illustrates the reported
Unlocked appearance and does not describe the lock's current state.

For installation, use the [README](../README.md#install-through-hacs). The card's
[HACS catalog submission](https://github.com/hacs/default/pull/11473) was accepted
on October 24, 2026; search for **DESLOC Lock Card** in HACS.
