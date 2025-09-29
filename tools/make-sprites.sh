#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

mkdir -p public/assets/sprites

# Build SDF sprite (normal)
docker run --rm   -v "$PWD/icons:/app/icons:ro"   -v "$PWD/public/assets/sprites:/app/output"   ghcr.io/flother/spreet:latest   --sdf /app/icons /app/output/basemap

# Build SDF sprite (retina @2x)
docker run --rm   -v "$PWD/icons:/app/icons:ro"   -v "$PWD/public/assets/sprites:/app/output"   ghcr.io/flother/spreet:latest   --sdf --retina /app/icons /app/output/basemap@2x

echo "✓ Sprites written to public/assets/sprites/"
echo "  Add this to your style:  "sprite": "/assets/sprites/basemap""
