# Screenshots

These are cropped captures of the actual Home Assistant interface. The new
locked-state and visual-editor screenshots use Home Assistant 2026.9.1 and DESLOC
Lock Card 0.1.1. No lock or unlock commands were executed while making these new
captures.

The displayed state comes from the underlying integration. With DESLOC, it is a
cloud-reported bolt state that may be cached, not a door-open sensor. Screenshots
record what the interface displayed at capture time, not the lock's current state.

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

For installation, use the [README](../README.md). The card's
[HACS catalog submission](https://github.com/hacs/default/pull/11473) is pending;
install it as a custom repository until it is accepted.
