// tools/build-sprite.js
const fs = require("fs");
const p = require("path");

const OUT_DIR = p.join("public", "assets", "sprites");
const ICONS_DIR = "icons";
fs.mkdirSync(ICONS_DIR, { recursive: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

const MAKIP = p.join("node_modules", "@mapbox", "maki", "icons");
const TEMAKIP = p.join("node_modules", "@rapideditor", "temaki", "icons");

// Desired icon ids (file names) → candidate source names in Maki/Temaki
const map = {
  "airport":        ["airport"],
  "train":          ["rail","train","railway"],
  "bus":            ["bus","bus-stop","bus_station"],
  "parking":        ["parking"],
  "fuel":           ["fuel","fuel-station","fuel_station"],
  "ev-charging":    ["charging_station","charging-station","ev_charging","ev-charging"],
  "restaurant":     ["restaurant","fast-food","fast_food"],
  "cafe":           ["cafe"],
  "bar":            ["bar","beer"],
  "hotel":          ["lodging","hotel"],
  "hospital":       ["hospital","clinic"],
  "school":         ["school","university","college"],
  "park":           ["park","park-alt"],
  "museum":         ["museum"],
  "police":         ["police"]
};

function tryFiles(baseDir, name) {
  const candidates = [`${name}.svg`, `${name}-15.svg`, `${name}-11.svg`];
  for (const f of candidates) {
    const full = p.join(baseDir, f);
    if (fs.existsSync(full)) return full;
  }
  return null;
}

function findIcon(name) {
  for (const n of map[name]) {
    const m = tryFiles(MAKIP, n);
    if (m) return m;
    const t = tryFiles(TEMAKIP, n);
    if (t) return t;
  }
  return null;
}

const missing = [];
for (const outName of Object.keys(map)) {
  const src = findIcon(outName);
  if (!src) { missing.push(outName); continue; }
  const dst = p.join(ICONS_DIR, `${outName}.svg`);
  fs.copyFileSync(src, dst);
  console.log(`✓ ${outName}  ←  ${src}`);
}
if (missing.length) {
  console.warn("Missing icons (not found in Maki/Temaki):", missing.join(", "));
}
