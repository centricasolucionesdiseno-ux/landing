/**
 * Genera el HTML estático de cada página después de `vite build`.
 *
 * Los buscadores y las redes sociales reciben la página completa (texto,
 * títulos, enlaces, datos estructurados) sin ejecutar JavaScript, y el
 * navegador la pinta antes de descargar React. Luego React la "hidrata".
 *
 * Genera: dist/index.html, dist/<ruta>.html, dist/404.html y dist/sitemap.xml.
 * Si una página sale con etiquetas duplicadas o sin <h1>, el build falla.
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = resolve(RAIZ, 'dist');
const SSR = resolve(RAIZ, 'node_modules/.cache/prerender');
const MANIFIESTO = resolve(DIST, '.vite/manifest.json');

const { render, RUTAS, datosEstructurados, SITE_URL, DOMINIOS_EXTERNOS } = await import(pathToFileURL(resolve(SSR, 'entry-server.js')).href);
const plantilla = await readFile(resolve(DIST, 'index.html'), 'utf8');
const manifiesto = JSON.parse(await readFile(MANIFIESTO, 'utf8'));

// React 19 emite al inicio las etiquetas que van en <head> (<title>, <meta>,
// <link>): se separan del contenido de la página.
const ETIQUETA_HEAD = /^(?:<title>[^<]*<\/title>|<meta\b[^>]*\/?>|<link\b[^>]*\/?>)/;
const separar = (html) => {
  let head = '';
  let resto = html;
  for (let m = resto.match(ETIQUETA_HEAD); m; m = resto.match(ETIQUETA_HEAD)) {
    head += m[0];
    resto = resto.slice(m[0].length);
  }
  return { head, cuerpo: resto };
};

const decodificar = (texto = '') =>
  texto.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

// JSON dentro de <script>: sin "<" literal para que nunca cierre la etiqueta
const jsonSeguro = (datos) => JSON.stringify(datos).replace(/</g, '\\u003c');

// Precarga el JS de la página (y lo que importa) para hidratar antes
const precargas = (carpeta) => {
  const vistos = new Set();
  const enPlantilla = (archivo) => plantilla.includes(`/${archivo}"`);
  const recorrer = (clave) => {
    const entrada = manifiesto[clave];
    if (!entrada || vistos.has(entrada.file)) return;
    vistos.add(entrada.file);
    (entrada.imports ?? []).forEach(recorrer);
  };
  recorrer(`src/pages/${carpeta}/index.jsx`);
  return [...vistos]
    .filter((archivo) => !enPlantilla(archivo))
    .map((archivo) => `<link rel="modulepreload" crossorigin href="/${archivo}">`)
    .join('');
};

const contar = (html, regex) => (html.match(regex) ?? []).length;

const validar = (nombre, head, cuerpo, { indexable }) => {
  const errores = [];
  if (contar(head, /<title>/g) !== 1) errores.push('debe tener exactamente un <title>');
  if (contar(head, /<meta name="description"/g) !== 1) errores.push('debe tener exactamente una meta description');
  if (indexable && contar(head, /<link rel="canonical"/g) !== 1) errores.push('debe tener exactamente un canonical');
  if (contar(cuerpo, /<h1[\s>]/g) !== 1) errores.push('debe tener exactamente un <h1>');
  // La CSP (security.config.js) bloquea scripts y estilos en línea
  if (/<script\b/.test(cuerpo)) errores.push('tiene <script> en el contenido');
  if (/\sstyle="/.test(cuerpo)) errores.push('tiene atributos style="" (usar clases CSS)');
  if (/<template\b|hidden id="S:/.test(cuerpo)) errores.push('tiene contenido sin terminar de Suspense');
  // Enlaces externos: solo https, solo dominios autorizados y, si abren otra
  // pestaña, con noopener noreferrer (sin tabnabbing ni fuga de la URL de origen)
  for (const [etiqueta, href] of cuerpo.matchAll(/<a\b[^>]*\shref="([a-z][a-z0-9+.-]*:[^"]*)"[^>]*>/gi)) {
    const url = decodificar(href);
    if (/^(mailto|tel):/i.test(url)) continue;
    let destino;
    try { destino = new URL(url); } catch { errores.push(`enlace inválido: ${url}`); continue; }
    if (destino.protocol !== 'https:') errores.push(`enlace sin https: ${url}`);
    else if (!DOMINIOS_EXTERNOS.includes(destino.hostname)) errores.push(`enlace a dominio no autorizado: ${destino.hostname}`);
    if (/target="_blank"/.test(etiqueta) && !/rel="[^"]*noopener[^"]*noreferrer|rel="[^"]*noreferrer[^"]*noopener/.test(etiqueta)) {
      errores.push(`enlace a otra pestaña sin noopener noreferrer: ${destino.hostname}`);
    }
  }
  if (errores.length) throw new Error(`${nombre}: ${errores.join(', ')}`);
};

// data-ruta: main.jsx solo hidrata si el HTML corresponde a la URL abierta
const armar = ({ head, cuerpo, jsonLd, modulos, ruta }) =>
  plantilla
    .replace('</head>', `    ${head}${modulos}${jsonLd ? `\n    <script type="application/ld+json">${jsonSeguro(jsonLd)}</script>` : ''}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root" data-ruta="${ruta}">${cuerpo}</div>`);

const archivoDe = (path) => (path === '/' ? 'index.html' : `${path.slice(1)}.html`);

// Fecha del último cambio de la página en git (para el sitemap); si no hay git, hoy
const ultimaModificacion = (carpeta) => {
  try {
    const fecha = execFileSync('git', ['log', '-1', '--format=%cs', '--', `src/pages/${carpeta}`], { cwd: RAIZ, encoding: 'utf8' }).trim();
    if (fecha) return fecha;
  } catch {
    // Sin git (por ejemplo, en algunos servicios de despliegue)
  }
  return new Date().toISOString().slice(0, 10);
};

const sitemap = [];

for (const ruta of RUTAS) {
  const { head, cuerpo } = separar(await render(ruta.path));
  validar(ruta.path, head, cuerpo, { indexable: !ruta.noindex });
  const seo = {
    title: decodificar(head.match(/<title>([^<]*)<\/title>/)?.[1]),
    description: decodificar(head.match(/<meta name="description" content="([^"]*)"/)?.[1])
  };
  const html = armar({
    head,
    cuerpo,
    jsonLd: ruta.noindex ? null : datosEstructurados(ruta, seo),
    modulos: precargas(ruta.carpeta),
    ruta: ruta.path
  });
  await writeFile(resolve(DIST, archivoDe(ruta.path)), html);

  if (!ruta.noindex) {
    sitemap.push([
      '  <url>',
      `    <loc>${SITE_URL}${ruta.path}</loc>`,
      `    <lastmod>${ultimaModificacion(ruta.carpeta)}</lastmod>`,
      `    <changefreq>${ruta.frecuencia}</changefreq>`,
      `    <priority>${ruta.prioridad.toFixed(1)}</priority>`,
      '  </url>'
    ].join('\n'));
  }
  console.log(`  ✓ ${archivoDe(ruta.path)}`);
}

// 404: el hosting la sirve con código 404 para cualquier ruta que no exista
{
  const { head, cuerpo } = separar(await render('/404-pagina-no-encontrada'));
  validar('404', head, cuerpo, { indexable: false });
  await writeFile(resolve(DIST, '404.html'), armar({ head, cuerpo, jsonLd: null, modulos: precargas('NotFound'), ruta: '404' }));
  console.log('  ✓ 404.html');
}

await writeFile(
  resolve(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap.join('\n')}\n</urlset>\n`
);
console.log(`  ✓ sitemap.xml (${sitemap.length} páginas)`);

// El manifiesto y el bundle del servidor solo sirven para este paso: no se publican
await rm(resolve(DIST, '.vite'), { recursive: true, force: true });
await rm(SSR, { recursive: true, force: true });
if (existsSync(resolve(DIST, '.vite'))) throw new Error('No se pudo borrar dist/.vite');
