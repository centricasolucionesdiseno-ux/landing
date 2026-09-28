/**
 * Publica la web con un enlace temporal accesible desde cualquier red:
 *   1. compila el sitio (npm run build: incluye el HTML de cada página y borra
 *      los archivos internos del build, igual que en producción)
 *   2. lo sirve localmente (vite preview, puerto 4173)
 *   3. abre un túnel de Cloudflare y muestra el enlace https://...trycloudflare.com
 *
 * Uso: npm run compartir   (Ctrl + C cierra el enlace)
 * Requiere `cloudflared` instalado: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/
 */
import { spawn, spawnSync } from 'node:child_process';

const PORT = Number(process.env.PUERTO) || 4173; // PUERTO=4180 npm run compartir, si el 4173 está ocupado
const isWindows = process.platform === 'win32';
const npx = isWindows ? 'npx.cmd' : 'npx';
const npm = isWindows ? 'npm.cmd' : 'npm';

const hasCloudflared = spawnSync('cloudflared', ['--version'], { stdio: 'ignore', shell: isWindows }).status === 0;
if (!hasCloudflared) {
  console.error('\n✖ Falta "cloudflared". Instálalo y vuelve a ejecutar npm run compartir:');
  console.error('  Linux: descarga el binario "cloudflared-linux-amd64" de github.com/cloudflare/cloudflared/releases');
  console.error('         y cópialo a ~/.local/bin/cloudflared (chmod +x), no necesita sudo');
  console.error('  Windows: winget install --id Cloudflare.cloudflared');
  console.error('  macOS:   brew install cloudflared\n');
  process.exit(1);
}

console.log('▸ Compilando el sitio...');
const build = spawnSync(npm, ['run', 'build'], { stdio: 'inherit', shell: isWindows });
if (build.status !== 0) process.exit(build.status ?? 1);

const LOCAL_URL = `http://localhost:${PORT}`;
const respondsOk = () => fetch(LOCAL_URL, { signal: AbortSignal.timeout(1500) }).then((res) => res.ok, () => false);

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
const preview = spawn(npx, ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
  stdio: ['ignore', 'ignore', 'pipe'],
  shell: isWindows
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
for (let i = 0; i < 60 && !(await respondsOk()); i++) {
  await new Promise((resolve) => setTimeout(resolve, 300));
}
if (!(await respondsOk())) {
  console.error('✖ El servidor local no respondió a tiempo.');
  stopAll(1);
}

console.log('▸ Abriendo túnel público...');
const tunnel = spawn('cloudflared', ['tunnel', '--no-autoupdate', '--url', `http://localhost:${PORT}`], { shell: isWindows });
children.push(tunnel);

// Copia el enlace al portapapeles para no escribirlo a mano: un error de
// tipeo (p. ej. "trycloudflare.co" sin la "m") lleva a sitios de terceros.
const CLIPBOARD_COMMANDS = {
  win32: [['clip']],
  darwin: [['pbcopy']],
  linux: [['wl-copy'], ['xclip', '-selection', 'clipboard'], ['xsel', '--clipboard', '--input']]
};

const copyToClipboard = (text) =>
  (CLIPBOARD_COMMANDS[process.platform] || []).some(([cmd, ...args]) => {
    const result = spawnSync(cmd, args, { input: text, stdio: ['pipe', 'ignore', 'ignore'], shell: isWindows });
    return result.status === 0;
  });

// Cloudflare registra el nombre del túnel en el DNS unos segundos después de
// crearlo. Si se abre antes, el navegador responde "no se encuentra el sitio"
// y guarda ese error en memoria: se espera a que el enlace responda de verdad.
const ESPERA_MAX_MS = 90000;
const esperarDisponible = async (url) => {
  const limite = Date.now() + ESPERA_MAX_MS;
  while (Date.now() < limite && !stopping) {
    try {
      const respuesta = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
      if (respuesta.ok) return true;
    } catch {
      // aún no resuelve el DNS o el túnel no está listo: reintentar
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  return false;
};

// cloudflared escribe el enlace en stderr; lo mostramos destacado cuando ya funciona
let announced = false;
const findUrl = async (chunk) => {
  const url = chunk.toString().match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
  if (!url || announced) return;
  announced = true;
  console.log('▸ Esperando a que el enlace esté disponible en internet (unos segundos)...');
  const listo = await esperarDisponible(url[0]);
  if (stopping) return;
  const copied = copyToClipboard(url[0]);
  console.log(`\n  ✔ Enlace público: ${url[0]}`);
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
