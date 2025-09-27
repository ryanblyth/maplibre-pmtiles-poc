import { protocol } from 'https://unpkg.com/pmtiles/dist/index.js';

// Register PMTiles protocol BEFORE creating the map
maplibregl.addProtocol('pmtiles', protocol.tile);

const map = new maplibregl.Map({
  container: 'map',
  style: 'styles/basemap.json',
  center: [-98.5, 39.8], // US center-ish
  zoom: 4
});

map.addControl(new maplibregl.NavigationControl(), 'top-right');

// Helpful during style iteration
map.on('error', (e) => console.error('Map error:', e && e.error || e));
