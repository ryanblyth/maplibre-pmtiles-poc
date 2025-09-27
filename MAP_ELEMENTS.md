# Map Elements Cheat Sheet (MapLibre + PMTiles)

## The style file (the brain)
A **style JSON** defines how the map looks & behaves.

- Top-level keys: `version`, `name`, `glyphs`, `sprite`, `sources`, `layers` (ordered).
- Uses **expressions** for data/zoom driven styling: `["match", ...]`, `["interpolate", ...]`, etc.

Minimal skeleton:
```json
{
  "version": 8,
  "name": "Basemap",
  "glyphs": "/assets/fonts/{fontstack}/{range}.pbf",
  "sprite": "/assets/sprites/basemap",
  "sources": { /* vector/raster/geojson definitions */ },
  "layers": [ /* background, water, roads, labels, POIs, ... */ ]
}
```

---

## Sources (where data comes from)
- **vector** – Mapbox Vector Tiles (MVT). Fully stylable.  
  Example (PMTiles):  
  ```json
  "us": { "type": "vector", "url": "pmtiles:///tiles/us.pmtiles" }
  ```
- **raster** – prerendered PNG/JPG tiles (simple, low-customization).
- **raster-dem** – elevation tiles for terrain/hillshade.
- **geojson** – raw GeoJSON (best for small/medium datasets).
- **image** / **video** – georeferenced overlays.

**PMTiles** = single-file bundle for tiles (vector or raster) + HTTP range index. Register the protocol in JS:
```js
import { PMTiles, Protocol } from "pmtiles";
const protocol = new Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);
```
Use a PMTiles URL in the style: `pmtiles:///path/file.pmtiles`.

**MBTiles** = SQLite tile bundle (good for local/builds). Convert to PMTiles for hosting.

**Tile schema** = the logical layer/field names inside tiles (e.g., **OpenMapTiles**: `water`, `transportation`, `place`, …). Your `source-layer` values must match.

---

## Layers (how to draw)
- **background** – solid/gradient base (no source).
- **fill** – polygons (landuse, water, buildings).
- **line** – strokes (roads, rivers, boundaries).
- **symbol** – text + icons (labels, POIs).
- **circle** – simple point circles.
- **raster** – draw raster tiles.
- **hillshade** – shading from a `raster-dem` source.
- **fill-extrusion** – 3D buildings/extrusions.
- **heatmap** – density visualization.

**Draw order matters**: earlier layers paint first (appear underneath later ones). Typical stack (bottom → top):
1. background  
2. hillshade (optional)  
3. landcover/landuse  
4. water (fill/line)  
5. boundaries (low levels)  
6. roads (casing → fill), bridges, tunnels  
7. rail/aerialway  
8. buildings (+ extrusions)  
9. POI icons (sprites)  
10. water/road names  
11. place labels (cities, countries)

---

## Glyphs (text rendering)
- **What**: tiny PBF files with SDF glyphs per font + character range.
- **Why**: WebGL text needs glyph atlases; CSS/web fonts don’t apply.
- **Where**: top-level `glyphs` URL; your symbol layers’ `"text-font"` must match a hosted font family (e.g., `"Noto Sans Regular"`).
- **Host**: self-host under `/assets/fonts/{fontstack}/{range}.pbf` or use a trusted CDN.

---

## Sprites (icons & patterns)
- **What**: PNG + JSON (and `@2x`) atlas of named images.
- **Where**: top-level `sprite` URL (no extension).
- **Use**: `"icon-image": "airport"` in symbol layers; `"fill-pattern"`/`"line-pattern"` for textures.
- Prefer **SDF** sprites so you can recolor with `"icon-color"`.
- Keep icon names in the sprite aligned with your style logic (e.g., match on `class/subclass` → `"restaurant"`).

---

## Styling mechanics
- **Filters** select features: `["==", ["get","admin_level"], 4]`.
- **Zoom control**: `minzoom` / `maxzoom` on layers; `["interpolate", ["linear"], ["zoom"], ...]` in paints/layouts.
- **Data-driven**: `["match", ["get","class"], ...]`, `["step", ...]`, `["case", ...]`.
- **Casing technique**: draw a darker/wider road **line** under a lighter/narrower one.
- **Bridges/tunnels**: filter using attributes like `["==", ["get","brunnel"], "bridge"]`.

---

## Terrain & special effects (optional)
- **Terrain**: add a `raster-dem` source, then top-level `"terrain": { "source": "dem" }`.
- **Hillshade**: add a `hillshade` layer tied to your DEM.
- **3D buildings**: `fill-extrusion` with height attributes (e.g., `["get","render_height"]`).

---

## Interactivity (in JS, not inside the style)
- **Events**: `map.on('click', 'layer-id', e => ...)` for popups/highlights.
- **Markers/Popups**: DOM elements on top of the map.
- **Controls**: zoom, geolocate, attribution, custom UI.
- **Hit testing**: `queryRenderedFeatures` to inspect what’s under the cursor.

---

## Hosting & ops
- **Put big files on a CDN**: PMTiles, DEMs, sprites, glyphs. Use long cache headers + versioned paths.
- **Attribution**: OSM → “© OpenStreetMap contributors”; include any other providers you use.
- **Performance**:
  - Use vector tiles for large datasets (avoid giant GeoJSON).
  - Show dense layers only at higher zooms.
  - Keep icon sets tight; SDF sprites for recolor/scale.
- **Licensing**:
  - OSM data: ODbL (cite properly).
  - Icons like **Maki/Temaki**: CC0 (public domain).
  - OpenMapTiles schema/styles have their own terms—check before commercial use.

---

## Debug checklist
- **Tiles load?** Network shows `pmtiles` range requests OK; console has no protocol errors.
- **Glyphs OK?** `/assets/fonts/.../0-255.pbf` returns 200; labels render.
- **Sprite OK?** `/assets/sprites/basemap.json/png` returns 200; icons render.
- **Layer order** sensible? Roads over land, labels over roads, POIs under place labels, etc.
- **Zooms/filters** correct? If something “disappears”, check `minzoom`/`maxzoom` and filters.
- **Schema match**? `source-layer` names match your tiles; fields used in expressions actually exist.

---

## Handy snippets

**Add a PMTiles vector source**
```json
"sources": {
  "basemap": { "type": "vector", "url": "pmtiles:///tiles/us.pmtiles" }
}
```

**Symbol layer with SDF icon + label**
```json
{
  "id": "poi",
  "type": "symbol",
  "source": "basemap",
  "source-layer": "poi",
  "minzoom": 12,
  "layout": {
    "icon-image": "restaurant",
    "text-field": ["coalesce", ["get","name:en"], ["get","name"]],
    "text-font": ["Noto Sans Regular"],
    "text-offset": [0, 1.05],
    "text-size": 12
  },
  "paint": {
    "icon-color": "#f59e0b",
    "text-color": "#e5e7eb",
    "text-halo-color": "#0b0f14",
    "text-halo-width": 1
  }
}
```

---

**TL;DR:**  
- **Data** via **vector tiles** (often **PMTiles**).  
- **Look** via **style JSON** with ordered **layers**.  
- **Text** via **glyph PBFs**; **icons/patterns** via **sprites**.  
- Optional **terrain/hillshade/extrusions** for depth.  
- Interactivity lives in your **JS app**, not the style.
