/**
 * Prueba la promesa central del producto: la app sirve sin conexión.
 *
 * 1. carga la portada con red y deja que el service worker cachee el shell
 * 2. corta la red
 * 3. recarga y comprueba que la pagina sigue renderizando
 *
 *   node scripts/cdp-offline.mjs [url]
 */
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const here = dirname(fileURLToPath(import.meta.url));
const SHOTS = resolve(here, "..", ".impeccable", "review");
const url = process.argv[2] || "http://localhost:3001/";

mkdirSync(SHOTS, { recursive: true });
const profile = resolve(tmpdir(), "ecoguide-offline-" + Date.now());
const port = 9600 + Math.floor(Math.random() * 300);

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
      /* todavia no levanta */
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
await cdp.send("Network.enable", {}, sessionId);
await cdp.send(
  "Emulation.setDeviceMetricsOverride",
  { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false },
  sessionId,
);

// 1. primera carga con red
await cdp.send("Page.navigate", { url }, sessionId);

// El service worker tarda en instalar y precachear: se espera a que active
// en vez de cortar la red a ciegas a los pocos segundos.
let swState;
for (let i = 0; i < 30; i++) {
  await sleep(1000);
  swState = await cdp.send(
    "Runtime.evaluate",
    {
      expression:
        "navigator.serviceWorker.getRegistration().then(r => JSON.stringify({ has: !!r, active: !!r?.active, state: r?.active?.state || null }))",
      awaitPromise: true,
      returnByValue: true,
    },
    sessionId,
  );
  if (JSON.parse(swState.result.value).active) break;
}
console.log("service worker:", swState.result.value);

// Margen para que termine la precarga del contenido publicado.
await sleep(6000);

// 2. se corta la red
await cdp.send(
  "Network.emulateNetworkConditions",
  {
    offline: true,
    latency: 0,
    downloadThroughput: 0,
    uploadThroughput: 0,
  },
  sessionId,
);
console.log("red: OFFLINE");

// 3. recarga y se mide
await cdp.send("Page.reload", { ignoreCache: false }, sessionId);
await sleep(4500);

const probe = await cdp.send(
  "Runtime.evaluate",
  {
    expression: `JSON.stringify({
      titulo: document.title,
      h1: (document.querySelector('h1')||{}).textContent || null,
      cuerpo: (document.body.innerText||'').length,
      online: navigator.onLine,
      error: document.body.innerText.includes('Application error')
    })`,
    returnByValue: true,
  },
  sessionId,
);
const info = JSON.parse(probe.result.value);
console.log("sin red ->", JSON.stringify(info));

const shot = await cdp.send(
  "Page.captureScreenshot",
  { format: "png" },
  sessionId,
);
const out = resolve(SHOTS, "offline.png");
writeFileSync(out, Buffer.from(shot.data, "base64"));
console.log("captura:", out);

socket.close();
chrome.kill();
process.exit(info.cuerpo > 200 && !info.error ? 0 : 1);
