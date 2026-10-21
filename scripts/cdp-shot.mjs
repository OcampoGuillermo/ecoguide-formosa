/**
 * Captura con CDP (Chrome DevTools Protocol) para emular cualquier viewport,
 * incluido el movil real de 390 px, que el modo --window-size no permite.
 *
 *   node scripts/cdp-shot.mjs <url> <salida.png> [ancho] [alto] [--full] [--dpr=2]
 */
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const here = dirname(fileURLToPath(import.meta.url));
const SHOTS = resolve(here, "..", ".impeccable", "review");

const [url, outArg, wArg, hArg] = process.argv.slice(2);
const full = process.argv.includes("--full");
const dprArg = process.argv.find((a) => a.startsWith("--dpr="));
const dpr = dprArg ? Number(dprArg.split("=")[1]) : 1;
const width = Number(wArg || 1440);
const height = Number(hArg || 900);
const out = outArg.includes("/") ? outArg : resolve(SHOTS, outArg);
mkdirSync(dirname(out), { recursive: true });

const profile = resolve(tmpdir(), "ecoguide-cdp-" + Date.now());
const port = 9200 + Math.floor(Math.random() * 400);

const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-sandbox",
    "--disable-dev-shm-usage",
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
      /* todavia no levanta */
    }
    await sleep(250);
  }
  throw new Error("Chrome no respondio en el puerto " + port);
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
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : res(msg.result);
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

const wsUrl = await endpoint();
const socket = new WebSocket(wsUrl);
await new Promise((res, rej) => {
  socket.addEventListener("open", res);
  socket.addEventListener("error", rej);
});
const cdp = new Cdp(socket);

const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await cdp.send("Target.attachToTarget", { targetId, flatten: true });

await cdp.send(
  "Emulation.setDeviceMetricsOverride",
  {
    width,
    height,
    deviceScaleFactor: dpr,
    mobile: width < 900,
    screenWidth: width,
    screenHeight: height,
  },
  sessionId,
);

await cdp.send("Page.enable", {}, sessionId);
await cdp.send("Runtime.enable", {}, sessionId);
await cdp.send("Network.enable", {}, sessionId);

// Modo oscuro: se fija la preferencia antes de que cargue la pagina.
if (process.argv.includes("--dark")) {
  const base = new URL(url).origin;
  await cdp.send("Page.navigate", { url: base + "/" }, sessionId);
  await sleep(1500);
  await cdp.send(
    "Runtime.evaluate",
    {
      expression:
        "localStorage.setItem('ecoguide-theme','dark'); document.documentElement.classList.add('dark'); 'ok'",
      returnByValue: true,
    },
    sessionId,
  );
  await sleep(400);
  console.log("modo: oscuro");
}

// Login opcional: --login=correo:clave
const loginArg = process.argv.find((a) => a.startsWith("--login="));
if (loginArg) {
  const [email, password] = loginArg.slice(8).split(":");
  const base = new URL(url).origin;
  await cdp.send("Page.navigate", { url: base + "/" }, sessionId);
  await sleep(2200);
  await cdp.send(
    "Runtime.evaluate",
    {
      expression: `(async () => {
        const { csrfToken } = await fetch('/api/auth/csrf').then(r => r.json());
        await fetch('/api/auth/callback/credentials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ csrfToken, email: ${JSON.stringify(email)}, password: ${JSON.stringify(password)} })
        });
        return 'ok';
      })()`,
      awaitPromise: true,
      returnByValue: true,
    },
    sessionId,
  );
  await sleep(1200);
  console.log("sesion iniciada como", email);
}

await cdp.send("Page.navigate", { url }, sessionId);

// espera a que la red se calme
await sleep(2600);
for (let i = 0; i < 14; i++) {
  const { result } = await cdp.send(
    "Runtime.evaluate",
    { expression: "document.readyState", returnByValue: true },
    sessionId,
  );
  if (result.value === "complete") break;
  await sleep(400);
}
await sleep(2200);

const metrics = await cdp.send(
  "Runtime.evaluate",
  {
    expression:
      "JSON.stringify({vw:document.documentElement.clientWidth,sw:document.documentElement.scrollWidth,h:document.body.scrollHeight})",
    returnByValue: true,
  },
  sessionId,
);
const info = JSON.parse(metrics.result.value);

// Estado del mapa, si la pagina tiene uno.
const mapInfo = await cdp.send(
  "Runtime.evaluate",
  {
    expression: `(() => {
      const c = document.querySelector('.leaflet-container');
      if (!c) return 'sin mapa';
      const r = c.getBoundingClientRect();
      const tiles = [...document.querySelectorAll('.leaflet-tile')];
      const loaded = tiles.filter(t => t.classList.contains('leaflet-tile-loaded'));
      return JSON.stringify({
        w: Math.round(r.width), h: Math.round(r.height),
        tiles: tiles.length, cargados: loaded.length,
      });
    })()`,
    returnByValue: true,
  },
  sessionId,
);
if (mapInfo.result.value && mapInfo.result.value !== "sin mapa") {
  console.log("mapa:", mapInfo.result.value);
}

const shot = await cdp.send(
  "Page.captureScreenshot",
  {
    format: "png",
    captureBeyondViewport: full,
    ...(full ? { clip: { x: 0, y: 0, width, height: info.h, scale: 1 } } : {}),
  },
  sessionId,
);

writeFileSync(out, Buffer.from(shot.data, "base64"));
console.log(
  `captura: ${out} | viewport ${width}x${height} | scrollWidth ${info.sw} | alto ${info.h}`,
);

socket.close();
chrome.kill();
process.exit(info.sw > width + 2 ? 2 : 0);
