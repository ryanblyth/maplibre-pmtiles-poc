# Docker Cheatsheet — Sprite Build (MapLibre)

This repo uses **Docker-only** tooling to build MapLibre-compatible **SDF sprites** from SVG icons. No local Node or Mapnik required.

## Prereqs
- Docker Desktop (macOS/Windows) or Docker Engine (Linux) installed & running.

## 1) Fetch icons (Maki, CC0)
Downloads the 15 POI SVGs into `./icons/`:
```bash
./tools/fetch-icons.sh
```

## 2) Build sprites with Spreet
Generates the sprite atlas + index (and @2x retina) under `public/assets/sprites/`:
```bash
./tools/make-sprites.sh
```

Outputs:
```
public/assets/sprites/
  basemap.png
  basemap.json
  basemap@2x.png
  basemap@2x.json
```

In your **style JSON** (top-level):
```json
"sprite": "/assets/sprites/basemap"
```

Icons are referenced by filename (e.g., `"icon-image": "airport"`). Because these are **SDF** sprites, you can recolor with `"icon-color"` in your paint properties.

## Notes & Troubleshooting
- If Docker writes root-owned files, rerun with: `sudo chown -R $(id -u):$(id -g) public/assets/sprites icons`
- If the image isn’t available for your arch, add `--platform linux/amd64` to the `docker run` lines.
- Make sure your web server serves `/public` as the site root (so the sprite path resolves).

## License
- Maki icons: CC0 (public domain).
- The generated sprite PNG/JSON atlases can be committed to your repo.
