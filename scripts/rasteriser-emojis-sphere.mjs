// Usage : servir public/ sur le port 4322, puis
// node scripts/rasteriser-emojis-sphere.mjs liste.json dossier-sortie 224
// (puis cwebp vers public/sphere/emoji). Les emojis de la sphere sont des images
// a 3x leur taille max a l ecran : la sphere ne fait que les reduire.
// Rastérise les SVG des emojis de la sphère avec le moteur de Chrome, fond transparent.
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
const [, , liste, dossier, cote] = process.argv;
const noms = JSON.parse(readFileSync(liste, "utf8"));
const C = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const port = 9371;
const chrome = spawn(C, ["--headless=new", `--remote-debugging-port=${port}`, "--user-data-dir=/tmp/cdp-raster", "about:blank"], { stdio: "ignore" });
const att = (ms) => new Promise((r) => setTimeout(r, ms));
let t; for (let i = 0; i < 50; i++) { try { t = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); break; } catch { await att(200); } }
const ws = new WebSocket(t.find((c) => c.type === "page").webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const w = new Map();
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && w.has(m.id)) { w.get(m.id)(m.result); w.delete(m.id); } };
const cmd = (method, params = {}) => new Promise((r) => { const n = ++id; w.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });
const n = Number(cote);
await cmd("Emulation.setDeviceMetricsOverride", { width: n, height: n, deviceScaleFactor: 1, mobile: false });
await cmd("Emulation.setDefaultBackgroundColorOverride", { color: { r: 0, g: 0, b: 0, a: 0 } });
for (const nom of noms) {
  await cmd("Page.navigate", { url: `http://127.0.0.1:4322/emoji/${nom}.svg` });
  await att(250);
  await cmd("Runtime.evaluate", { expression: `document.documentElement.setAttribute('width','${n}');document.documentElement.setAttribute('height','${n}');document.documentElement.style.width='${n}px';document.documentElement.style.height='${n}px'` });
  await att(80);
  const { data } = await cmd("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width: n, height: n, scale: 1 } });
  writeFileSync(`${dossier}/${nom}.png`, Buffer.from(data, "base64"));
}
ws.close(); chrome.kill();
console.log(noms.length, "rastérisés");
