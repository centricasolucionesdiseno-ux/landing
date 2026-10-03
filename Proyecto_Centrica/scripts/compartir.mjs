/**
 * Publica la web con un enlace temporal accesible desde cualquier red:
 *   1. compila el sitio (npm run build: incluye el HTML de cada página y borra
 *      los archivos internos del build, igual que en producción)
 *   2. lo sirve localmente (vite preview en 127.0.0.1, puerto 4173)
 *   3. abre un túnel de Cloudflare y muestra el enlace https://...trycloudflare.com
 *
 * Uso: npm run compartir   (Ctrl + C cierra el enlace)
 * Requiere `cloudflared` instalado: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/
 *
 * Los programas se ejecutan por ruta absoluta, nunca buscándolos en el PATH
 * (que podría estar manipulado para suplantar un comando).
 */
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = Number(process.env.PUERTO) || 4173; // PUERTO=4180 npm run compartir, si el 4173 está ocupado
const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const NODE = process.execPath;
const VITE = join(RAIZ, 'node_modules', 'vite', 'bin', 'vite.js');
// 127.0.0.1 explícito: "localhost" puede resolver a IPv6 (::1) y Vite escucha en IPv4
const HOST = '127.0.0.1';
const LOCAL_URL = `http://${HOST}:${PORT}`;

// cloudflared: variable CLOUDFLARED o las ubicaciones habituales de cada sistema
const CLOUDFLARED = [
  process.env.CLOUDFLARED,
  join(homedir(), '.local', 'bin', 'cloudflared'),
  '/usr/local/bin/cloudflared',
  '/usr/bin/cloudflared',
  '/opt/homebrew/bin/cloudflared',
  String.raw`C:\Program Files (x86)\cloudflared\cloudflared.exe`,
  String.raw`C:\Program Files\cloudflared\cloudflared.exe`
].find((ruta) => ruta && existsSync(ruta));

if (!CLOUDFLARED) {
  console.error('\n✖ Falta "cloudflared". Instálalo y vuelve a ejecutar npm run compartir:');
  console.error('  Linux: descarga el binario "cloudflared-linux-amd64" de github.com/cloudflare/cloudflared/releases');
  console.error('         y cópialo a ~/.local/bin/cloudflared (chmod +x), no necesita sudo');
  console.error('  Windows: winget install --id Cloudflare.cloudflared');
  console.error('  macOS:   brew install cloudflared');
  console.error('  Si está en otra carpeta: CLOUDFLARED=/ruta/a/cloudflared npm run compartir\n');
  process.exit(1);
}

// npm deja en npm_execpath la ruta de su propio script (npm-cli.js)
if (!process.env.npm_execpath) {
  console.error('\n✖ Ejecútalo con: npm run compartir\n');
  process.exit(1);
}

console.log('▸ Compilando el sitio...');
const build = spawnSync(NODE, [process.env.npm_execpath, 'run', 'build'], { stdio: 'inherit' });
if (build.status !== 0) process.exit(build.status ?? 1);

const pausa = (ms) => new Promise((resolver) => setTimeout(resolver, ms));
const respondsOk = (url = LOCAL_URL, metodo = 'GET') =>
  fetch(url, { method: metodo, signal: AbortSignal.timeout(5000) }).then((res) => res.ok, () => false);

/** Reintenta `condicion` hasta que sea verdadera, se agoten los intentos o `cancelar()` lo pida */
const esperar = async (condicion, { intentos, pausaMs, cancelar = () => false }) => {
  if (cancelar()) return false;
  if (await condicion()) return true;
  if (intentos <= 1) return false;
  await pausa(pausaMs);
  return esperar(condicion, { intentos: intentos - 1, pausaMs, cancelar });
};

// Si ya hay algo en el puerto, el túnel apuntaría a ese otro servidor
if (await respondsOk()) {
  console.error(`\n✖ El puerto ${PORT} ya está en uso (¿otro "npm run compartir" o "npm run preview" abierto?).`);
  console.error('  Ciérralo con Ctrl + C en su terminal y vuelve a intentarlo.\n');
  process.exit(1);
}

const children = [];
let stopping = false;
const stopAll = (code = 0) => {
  stopping = true;
  children.forEach((child) => child.kill());
  process.exit(code);
};
process.on('SIGINT', () => stopAll(0));
process.on('SIGTERM', () => stopAll(0));

console.log(`▸ Sirviendo en ${LOCAL_URL}`);
const preview = spawn(NODE, [VITE, 'preview', '--host', HOST, '--port', String(PORT), '--strictPort'], {
  cwd: RAIZ,
  stdio: ['ignore', 'ignore', 'pipe']
});
children.push(preview);
let previewErrors = '';
preview.stderr.on('data', (chunk) => { previewErrors += chunk; });

// Si el servidor local se cae, el enlace daría "Bad gateway (502)": mejor cerrar todo y avisar
preview.on('exit', (code) => {
  if (stopping) return;
  console.error(`\n✖ El servidor local se detuvo (código ${code}). Se cierra el enlace público.`);
  if (previewErrors.trim()) console.error(previewErrors.trim());
  console.error('  Vuelve a ejecutar: npm run compartir\n');
  stopAll(1);
});

// Esperar a que el servidor responda antes de abrir el túnel
if (!(await esperar(() => respondsOk(), { intentos: 60, pausaMs: 300 }))) {
  console.error('✖ El servidor local no respondió a tiempo.');
  stopAll(1);
}

console.log('▸ Abriendo túnel público...');
const tunnel = spawn(CLOUDFLARED, ['tunnel', '--no-autoupdate', '--url', LOCAL_URL]);
children.push(tunnel);

// Copia el enlace al portapapeles para no escribirlo a mano: un error de
// tipeo (p. ej. "trycloudflare.co" sin la "m") lleva a sitios de terceros.
const CLIPBOARD_COMMANDS = {
  win32: [[String.raw`C:\Windows\System32\clip.exe`]],
  darwin: [['/usr/bin/pbcopy']],
  linux: [['/usr/bin/wl-copy'], ['/usr/bin/xclip', '-selection', 'clipboard'], ['/usr/bin/xsel', '--clipboard', '--input']]
};

const copyToClipboard = (text) =>
  (CLIPBOARD_COMMANDS[process.platform] || []).some(([cmd, ...args]) =>
    existsSync(cmd) && spawnSync(cmd, args, { input: text, stdio: ['pipe', 'ignore', 'ignore'] }).status === 0
  );

// Cloudflare registra el nombre del túnel en el DNS unos segundos después de
// crearlo. Si se abre antes, el navegador responde "no se encuentra el sitio"
// y guarda ese error en memoria: se espera a que el enlace responda de verdad
// (hasta ~90 s: 45 intentos cada 2 s).
const esperarDisponible = (url) =>
  esperar(() => respondsOk(url, 'HEAD'), { intentos: 45, pausaMs: 2000, cancelar: () => stopping });

// cloudflared escribe el enlace en stderr; lo mostramos destacado cuando ya funciona
const URL_TUNEL = /https:\/\/[a-z0-9-]+\.trycloudflare\.com/;
let announced = false;
const findUrl = async (chunk) => {
  const url = URL_TUNEL.exec(chunk.toString())?.[0];
  if (!url || announced) return;
  announced = true;
  console.log('▸ Esperando a que el enlace esté disponible en internet (unos segundos)...');
  const listo = await esperarDisponible(url);
  if (stopping) return;
  const copied = copyToClipboard(url);
  console.log(`\n  ✔ Enlace público: ${url}`);
  if (!listo) console.log('    (aún no responde: si el navegador dice "no se encuentra", espera y recarga)');
  console.log(copied ? '    (copiado al portapapeles: pégalo con Ctrl + V)' : '    Cópialo completo: termina en .trycloudflare.com');
  console.log('    ⚠ El dominio correcto termina en ".com". Si ves ".co" es un sitio falso.');
  console.log('    Compártelo con quien quieras. Ctrl + C para cerrarlo.\n');
};
tunnel.stdout.on('data', findUrl);
tunnel.stderr.on('data', findUrl);
tunnel.on('exit', (code) => {
  if (stopping) return;
  console.error(`\n✖ El túnel se cerró (código ${code}). Revisa tu conexión a internet y vuelve a ejecutar npm run compartir.`);
  stopAll(1);
});
