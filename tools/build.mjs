// Solo per chi modifica i sorgenti. Il sito distribuito funziona senza Node o npm.
import { createRequire } from "node:module";
const { build } = createRequire(import.meta.url)("esbuild");
import { readFile, writeFile, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, dirname, relative } from "node:path";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const version = JSON.parse(await readFile(resolve(root, "package.json"), "utf8")).version;
const displayVersion = version.replace(/\.0$/, "");
await writeFile(resolve(root, "js/config.js"),
  `/** Generato da tools/build.mjs. */\nexport const VERSION = "${displayVersion}";\nexport const PWA_URL = "https://alessandromandelli.github.io/SMV/";\n`);
const assets = JSON.parse(
  await readFile(resolve(root, "assets/beni.json"), "utf8"),
);
await writeFile(
  resolve(root, "js/catalog.js"),
  "/** Generato da assets/beni.json. */\nexport const ASSETS = " +
    JSON.stringify(assets, null, 2) +
    ";\n",
);
await build({
  entryPoints: [resolve(root, "js/app.js")],
  bundle: true,
  format: "iife",
  target: ["chrome90", "safari15", "firefox90"],
  outfile: resolve(root, "app.bundle.js"),
  minify: false,
  banner: {
    js: `/* Schede Restauro ${displayVersion} — generato dai sorgenti modulari in js/. */`,
  },
});
// Solo risorse necessarie all'app installata. I sorgenti restano nello ZIP
// per la manutenzione, ma sono già inclusi in app.bundle.js e non vanno in cache.
const files = [
  "./index.html",
  "./styles.css",
  "./app.bundle.js",
  "./pwa-install.js",
  "./manifest.webmanifest",
  "./assets/icon-180.png",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/home-landscape.png",
  "./assets/map.jpg",
  "./assets/branding/anniversary.png",
  "./assets/branding/logo.jpg",
  "./assets/branding/footer.jpg",
  "./assets/source-arial.ttf",
  "./assets/source-arial-bold.ttf",
  "./assets/sans-regular.ttf",
  "./assets/sans-bold.ttf",
  "./vendor/pdf-lib.min.js",
  "./vendor/fontkit.umd.min.js",
  "./vendor/jszip.min.js",
];
for (const path of files) await access(resolve(root, path));
files.sort();
const sw = `/* Cache isolata per il percorso della PWA. */
const VERSION='${version}';
const PREFIX='schede-restauro:'+self.registration.scope+':';
const CACHE=PREFIX+VERSION;
const FILES=${JSON.stringify(["./", ...files], null, 2)};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES.map(path=>new Request(new URL(path,self.registration.scope),{cache:'reload'})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);if(event.request.method!=='GET'||!url.href.startsWith(self.registration.scope))return;
 event.respondWith(caches.open(CACHE).then(async cache=>{
  if(event.request.mode==='navigate'){
   try{const response=await fetch(event.request);if(response.ok)await cache.put(new URL('index.html',self.registration.scope).href,response.clone());return response;}catch{return cache.match(new URL('index.html',self.registration.scope).href);}
  }
  const plain=new URL(event.request.url);plain.search='';
  return (await cache.match(event.request))||(await cache.match(plain.href))||fetch(event.request);
 }));
});\n`;
await writeFile(resolve(root, "sw.js"), sw);
console.log("Bundle e cache aggiornati.");

const indexPath = resolve(root, "index.html");
await writeFile(indexPath, (await readFile(indexPath, "utf8")).replace(/\?v=[0-9.]+/g, "?v=" + displayVersion));
