#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

mkdir -p icons
BASE="https://raw.githubusercontent.com/mapbox/maki/main/icons"

# Your 15 icons (Maki, CC0)
icons=(airport rail bus parking fuel charging-station restaurant cafe bar lodging hospital school park museum police)

for name in "${icons[@]}"; do
  url="$BASE/$name.svg"
  echo "→ $name"
  curl -fsSL "$url" -o "icons/$name.svg"
done

echo "✓ Saved SVGs to ./icons/"
