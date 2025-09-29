# MapLibre + PMTiles (US z6–15) – Style Practice Starter

This is a minimal static site that renders a MapLibre map using a US PMTiles basemap (OpenMapTiles schema).
It’s ideal for practicing style and layer edits directly in the JSON.

## Project structure
```
public/
  index.html
  js/
    map.js
  styles/
    basemap.json          # edit me as you learn!
  tiles/
    us_z6-15.pmtiles      # put your US PMTiles here (not included)
  assets/
    fonts/                # put PBF glyphs here so labels render
    sprites/              # optional icons later (basemap.{json,png})
.gitignore
```

## Run locally
1) Copy your PMTiles into `public/tiles/us_z6-15.pmtiles`.
2) (Optional) Add glyph PBFs so labels render:
   - Example path: `public/assets/fonts/Noto Sans Regular/0-255.pbf` (and other ranges as needed)
   - Make sure the folder name matches the `text-font` in the style (`"Noto Sans Regular"`)
3) Start a static server **from the `public/` folder** so `/styles` and `/tiles` resolve:
   ```bash
   cd public
   python3 -m http.server 8000
   ```
   Open http://localhost:8000

## Notes
- The PMTiles protocol streams byte ranges (206 Partial Content); you’ll see `.pmtiles` requests in Network.
- No API keys required. No Mapbox SDKs are used.
- Style JSON follows the MapLibre/Mapbox style spec and expects OpenMapTiles layer names.
- Edit `public/styles/basemap.json` and refresh the browser to see your changes.

## Troubleshooting
- **White screen**: ensure `#map` has height (100vh), and that `public/` is the web root.
- **Unknown scheme pmtiles**: check that `maplibregl.addProtocol('pmtiles', ...)` runs before `new Map()`.
- **Labels missing**: add PBF glyphs and ensure `"glyphs": "/assets/fonts/{fontstack}/{range}.pbf"` resolves.
- **200 instead of 206 on `.pmtiles`**: your server must support HTTP Range (Python http.server does).
