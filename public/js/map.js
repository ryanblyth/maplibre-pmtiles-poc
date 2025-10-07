/* global maplibregl, pmtiles */

// import * as pmtiles from "pmtiles";
// import maplibregl from "maplibre-gl";

// Register PMTiles BEFORE creating the map
const protocol = new pmtiles.Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);

const map = new maplibregl.Map({
  container: "map",
  style: "/styles/basemap-midieval.json",
  center: [0, 0], // World center
  zoom: 2,     // World view
  hash: false  // disable hash to prevent URL overrides
});

map.addControl(new maplibregl.NavigationControl(), "top-right");

map.on("load", () => {
  console.log("map: load");
  console.log("Current zoom:", map.getZoom());
  console.log("Current center:", map.getCenter());
  console.log("Current bounds:", map.getBounds());
});

map.on("styledata", () => console.log("map: styledata"));
map.on("error", (e) => console.error("Map error:", e?.error || e));

map.on("dataloading", (e) => console.log("Data loading:", e.dataType));
map.on("data", (e) => console.log("Data loaded:", e.dataType, e.sourceDataType));
map.on("sourcedata", (e) => {
  console.log("Source data:", e.dataType, e.sourceId);
});
