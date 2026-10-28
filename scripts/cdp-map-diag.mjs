/**
 * Diagnostico del mapa: mide el contenedor de Leaflet, el pane y los tiles
 * en una sesion limpia de Chrome (sin cache).
 *
 *   node scripts/cdp-map-diag.mjs [url]
 */
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const url = process.argv[2] || "http://localhost:3001/mapa";
const profile = resolve(tmpdir(), "ecoguide-diag-" + Date.now());
const port = 9700 + Math.floor(Math.random() * 200);

const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-sandbox",
    "--remote-debugging-port=" + port,
    "--user-data-dir=" + profile,
    "about:blank",
  ],
  { stdio: "ignore" },
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function endpoint() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      const data = await res.json();
      if (data.webSocketDebuggerUrl) return data.webSocketDebuggerUrl;
    } catch {
      /* todavia no */
    }
    await sleep(250);
  }
  throw new Error("Chrome no respondio");
}

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    ws.addEventListener("message", (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve: res, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(JSON.stringify(msg.error)));
        else res(msg.result);
      }
    });
  }
  send(method, params = {}, sessionId) {
    const id = ++this.id;
    return new Promise((res, reject) => {
      this.pending.set(id, { resolve: res, reject });
      this.ws.send(JSON.stringify({ id, method, params, sessionId }));
    });
  }
}

const socket = new WebSocket(await endpoint());
await new Promise((res, rej) => {
  socket.addEventListener("open", res);
  socket.addEventListener("error", rej);
});
const cdp = new Cdp(socket);
const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await cdp.send("Target.attachToTarget", { targetId, flatten: true });
await cdp.send("Page.enable", {}, sessionId);
await cdp.send("Runtime.enable", {}, sessionId);
await cdp.send(
  "Emulation.setDeviceMetricsOverride",
  { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false },
  sessionId,
);
await cdp.send("Page.navigate", { url }, sessionId);
await sleep(7000);

const probe = await cdp.send(
  "Runtime.evaluate",
  {
    expression: `(() => {
      const containers = [...document.querySelectorAll('.leaflet-container')];
      const out = containers.map((c) => {
        const r = c.getBoundingClientRect();
        const tiles = [...c.querySelectorAll('.leaflet-tile')];
        const rects = tiles.map(t => {
          const b = t.getBoundingClientRect();
          return [Math.round(b.left - r.left), Math.round(b.top - r.top)];
        });
        return {
          rect: [Math.round(r.width), Math.round(r.height)],
          posAbs: [Math.round(r.left), Math.round(r.top)],
          tiles: tiles.length,
          cargados: tiles.filter(t => t.classList.contains('leaflet-tile-loaded')).length,
          posiciones: rects,
        };
      });
      return JSON.stringify(
        {
          contenedores: out.length,
          mapa: window.__mapa ?? "sin instancia",
          detalles: out,
        },
        null,
        1,
      );
    })()`,
    returnByValue: true,
  },
  sessionId,
);
console.log(probe.result.value);

socket.close();
chrome.kill();
process.exit(0);
