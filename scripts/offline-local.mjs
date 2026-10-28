/**
 * Prueba offline concluyente: levanta el build de produccion, carga la portada,
 * espera a que el service worker precachee el contenido, apaga el servidor y
 * abre una ficha que nunca se visito.
 *
 * La emulacion de red de CDP no alcanza al service worker (corre en otro
 * target), asi que cortar la red desde la pestana puede dar un falso positivo.
 * Apagar el servidor no deja ninguna salida a la red.
 *
 *   npm run build
 *   node scripts/offline-local.mjs [slug]
 */
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 3013;
const slug = process.argv[2] || "reserva-natural-la-plancha";
const base = `http://localhost:${PORT}`;
const target = `${base}/puntos/${slug}`;
const profile = resolve(tmpdir(), "ecoguide-offline-local-" + Date.now());
const cdpPort = 9550 + Math.floor(Math.random() * 90);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const server = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "-p", String(PORT)],
  { cwd: process.cwd(), stdio: "ignore" },
);

for (let i = 0; i < 60; i++) {
  await sleep(500);
  try {
    const r = await fetch(`${base}/`, { method: "HEAD" });
    if (r.status < 500) break;
  } catch {
    /* todavia no levanta */
  }
}

spawn(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--remote-debugging-port=" + cdpPort,
    "--user-data-dir=" + profile,
    "about:blank",
  ],
  { stdio: "ignore" },
);

async function endpoint() {
  for (let i = 0; i < 80; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${cdpPort}/json/version`);
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

const evalJs = async (expression) => {
  const r = await cdp.send(
    "Runtime.evaluate",
    { expression, awaitPromise: true, returnByValue: true },
    sessionId,
  );
  return r.result?.value;
};

// Solo se visita la portada: la ficha tiene que venir de la precarga.
await cdp.send("Page.navigate", { url: `${base}/` }, sessionId);

let activo = false;
for (let i = 0; i < 30; i++) {
  await sleep(1000);
  const estado = await evalJs(
    `navigator.serviceWorker.getRegistration().then(r => r?.active?.state || "none")`,
  );
  if (estado === "activated") {
    console.log("service worker activo a los", i + 1, "s");
    activo = true;
    break;
  }
}
if (!activo) {
  console.log("el service worker no activo en 30 s");
  process.exit(1);
}

let precargada = false;
for (let i = 0; i < 40; i++) {
  await sleep(1000);
  precargada = await evalJs(`(async () => {
    const c = await caches.open("ecoguide-v2-shell");
    return !!(await c.match("/puntos/${slug}", { ignoreVary: true }));
  })()`);
  if (precargada) break;
}
console.log("ficha en cache:", precargada);
if (!precargada) {
  console.log("la precarga no guardo la ficha");
  process.exit(1);
}

server.kill();
await sleep(1500);
console.log("servidor apagado: sin red");

await cdp.send("Page.navigate", { url: target }, sessionId);
await sleep(4000);

const info = JSON.parse(
  await evalJs(`JSON.stringify({
    titulo: document.title,
    h1: (document.querySelector("h1")||{}).textContent || null,
    largo: (document.body.innerText||"").length,
    offlinePage: document.body.innerText.includes("Sin conexión")
  })`),
);

console.log("ficha sin red:", JSON.stringify(info));

socket.close();
process.exit(info.largo > 500 && !info.offlinePage ? 0 : 1);
