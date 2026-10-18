#!/usr/bin/env bash
# Preserve the original screenshot pixels; only perspective and shadow are added.
set -euo pipefail
repo_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
source_image="$repo_root/docs/images/lock-card-locked.jpg"
output_image="$repo_root/docs/images/desloc-card-hero.png"
command -v magick >/dev/null 2>&1 || { printf '%s\n' 'ImageMagick 7 is required.' >&2; exit 1; }
[[ "$(magick identify -format '%wx%h' "$source_image")" == '493x405' ]] || { printf '%s\n' 'Screenshot dimensions changed; review the perspective before rendering.' >&2; exit 1; }
render_dir="$(mktemp -d "${TMPDIR:-/tmp}/docs-hero.XXXXXX")"
trap 'rm -rf -- "$render_dir"' EXIT
magick "$source_image" -alpha on -virtual-pixel transparent -filter Robidoux \
  -define distort:viewport=1540x1100+0+0 -distort Perspective '0,0 302,260 492,0 1178,190 492,404 1228,885 0,404 362,1000' \
  -strip "$render_dir/panel.png"
magick "$render_dir/panel.png" -fill '#152033' -colorize 100 \
  -channel A -evaluate multiply 0.22 +channel -blur 0x18 -strip "$render_dir/shadow.png"
magick -size 1540x1100 xc:'#f0f1f3' \
  "$render_dir/shadow.png" -geometry +0+22 -compose Over -composite \
  "$render_dir/panel.png" -geometry +0+0 -compose Over -composite \
  -strip -define png:exclude-chunk=date,time "PNG24:$render_dir/hero.png"
mv -- "$render_dir/hero.png" "$output_image"
printf 'Rendered %s\n' "$output_image"
