/* global maplibregl, pmtiles */

// Register PMTiles BEFORE creating the map
const protocol = new pmtiles.Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);

const map = new maplibregl.Map({
  container: "map",
  style: "/styles/basemap-midieval.json",
  center: [-105.7821, 39.5501],
  zoom: 8,
  // remove maxZoom so we can overzoom
  hash: false
});

map.addControl(new maplibregl.NavigationControl(), "top-right");

// Uncap any layer maxzoom so overzoom works >15
map.on("styledata", () => {
  const style = map.getStyle();
  const layers = style && style.layers ? style.layers : [];
  const uncapped = [];
  for (const layer of layers) {
    const min = typeof layer.minzoom === "number" ? layer.minzoom : 0;
    // If a layer has maxzoom <= 15 (common), raise it to 24
    if (typeof layer.maxzoom === "number" && layer.maxzoom < 24) {
      map.setLayerZoomRange(layer.id, min, 24);
      uncapped.push({ id: layer.id, oldMax: layer.maxzoom });
    }
  }
  if (uncapped.length) {
    console.log("Uncapped layer maxzoom to 24:", uncapped);
  }
});

map.on("load", () => {
  console.log("map: load");
  console.log("Current zoom:", map.getZoom());
});

map.on("error", (e) => console.error("Map error:", e?.error || e));
