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
// El <title> de respaldo de index.html (con su línea) se quita: cada página trae el suyo
const quitarTitulo = (html) => {
  const inicio = html.indexOf('<title>');
  const fin = html.indexOf('</title>');
  if (inicio === -1 || fin === -1) return html;
  return html.slice(0, html.lastIndexOf('\n', inicio)) + html.slice(fin + '</title>'.length);
};
const plantilla = quitarTitulo(await readFile(resolve(DIST, 'index.html'), 'utf8'));
const manifiesto = JSON.parse(await readFile(MANIFIESTO, 'utf8'));

// React 19 emite al inicio las etiquetas que van en <head> (<title>, <meta>,
// <link>): se separan del contenido de la página.
const ETIQUETA_HEAD = /^(?:<title>[^<]*<\/title>|<meta\b[^>]*\/?>|<link\b[^>]*\/?>)/;
const separar = (html) => {
  let head = '';
  let resto = html;
  for (let m = ETIQUETA_HEAD.exec(resto); m; m = ETIQUETA_HEAD.exec(resto)) {
    head += m[0];
    resto = resto.slice(m[0].length);
  }
  return { head, cuerpo: resto };
};

const decodificar = (texto = '') =>
  texto.replaceAll('&quot;', '"').replaceAll('&#x27;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');

// JSON dentro de <script>: sin "<" literal para que nunca cierre la etiqueta
const jsonSeguro = (datos) => JSON.stringify(datos).replaceAll('<', String.raw`\u003c`);

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

// SEO: un solo título, descripción, canonical (si se indexa) y <h1>
const erroresSeo = (head, cuerpo, indexable) => [
  contar(head, /<title>/g) !== 1 && 'debe tener exactamente un <title>',
  contar(head, /<meta name="description"/g) !== 1 && 'debe tener exactamente una meta description',
  indexable && contar(head, /<link rel="canonical"/g) !== 1 && 'debe tener exactamente un canonical',
  contar(cuerpo, /<h1[\s>]/g) !== 1 && 'debe tener exactamente un <h1>'
].filter(Boolean);

// La CSP (security.config.js) bloquea scripts y estilos en línea
const erroresContenido = (cuerpo) => [
  /<script\b/.test(cuerpo) && 'tiene <script> en el contenido',
  /\sstyle="/.test(cuerpo) && 'tiene atributos style="" (usar clases CSS)',
  /<template\b|hidden id="S:/.test(cuerpo) && 'tiene contenido sin terminar de Suspense'
].filter(Boolean);

const PESTANA_SEGURA = /rel="[^"]*noopener[^"]*noreferrer|rel="[^"]*noreferrer[^"]*noopener/;

// Enlace externo: solo https, solo dominios autorizados y, si abre otra
// pestaña, con noopener noreferrer (sin tabnabbing ni fuga de la URL de origen)
const erroresEnlace = (etiqueta, href) => {
  const url = decodificar(href);
  if (/^(mailto|tel):/i.test(url)) return [];
  if (!URL.canParse(url)) return [`enlace inválido: ${url}`];
  const destino = new URL(url);
  return [
    destino.protocol !== 'https:' && `enlace sin https: ${url}`,
    destino.protocol === 'https:' && !DOMINIOS_EXTERNOS.includes(destino.hostname) && `enlace a dominio no autorizado: ${destino.hostname}`,
    etiqueta.includes('target="_blank"') && !PESTANA_SEGURA.test(etiqueta) && `enlace a otra pestaña sin noopener noreferrer: ${destino.hostname}`
  ].filter(Boolean);
};

const ENLACE_EXTERNO = /<a\b[^>]*\shref="([a-z][a-z0-9+.-]*:[^"]*)"[^>]*>/gi;

const validar = (nombre, head, cuerpo, { indexable }) => {
  const errores = [
    ...erroresSeo(head, cuerpo, indexable),
    ...erroresContenido(cuerpo),
    ...[...cuerpo.matchAll(ENLACE_EXTERNO)].flatMap(([etiqueta, href]) => erroresEnlace(etiqueta, href))
  ];
  if (errores.length) throw new Error(`${nombre}: ${errores.join(', ')}`);
};

// data-ruta: main.jsx solo hidrata si el HTML corresponde a la URL abierta
const armar = ({ head, cuerpo, jsonLd, modulos, ruta }) => {
  const datos = jsonLd ? `\n    <script type="application/ld+json">${jsonSeguro(jsonLd)}</script>` : '';
  return plantilla
    .replace('</head>', `    ${head}${modulos}${datos}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root" data-ruta="${ruta}">${cuerpo}</div>`);
};

const archivoDe = (path) => (path === '/' ? 'index.html' : `${path.slice(1)}.html`);

// git se ejecuta por ruta absoluta (no se busca en el PATH, que podría estar manipulado)
const GIT = [
  process.env.GIT_BIN,
  '/usr/bin/git',
  '/usr/local/bin/git',
  '/opt/homebrew/bin/git',
  String.raw`C:\Program Files\Git\cmd\git.exe`
].find((ruta) => ruta && existsSync(ruta));

const hoy = () => new Date().toISOString().slice(0, 10);

// Fecha del último cambio de la página en git (para el sitemap); si no hay git, hoy
const ultimaModificacion = (carpeta) => {
  if (!GIT) return hoy();
  try {
    return execFileSync(GIT, ['log', '-1', '--format=%cs', '--', `src/pages/${carpeta}`], { cwd: RAIZ, encoding: 'utf8' }).trim() || hoy();
  } catch {
    // Repositorio sin historial (por ejemplo, en algunos servicios de despliegue)
    return hoy();
  }
};

const entradaSitemap = (ruta) => [
  '  <url>',
  `    <loc>${SITE_URL}${ruta.path}</loc>`,
  `    <lastmod>${ultimaModificacion(ruta.carpeta)}</lastmod>`,
  `    <changefreq>${ruta.frecuencia}</changefreq>`,
  `    <priority>${ruta.prioridad.toFixed(1)}</priority>`,
  '  </url>'
].join('\n');

const generarPagina = async (ruta) => {
  const { head, cuerpo } = separar(await render(ruta.path));
  validar(ruta.path, head, cuerpo, { indexable: !ruta.noindex });
  const seo = {
    title: decodificar(/<title>([^<]*)<\/title>/.exec(head)?.[1]),
    description: decodificar(/<meta name="description" content="([^"]*)"/.exec(head)?.[1])
  };
  const html = armar({
    head,
    cuerpo,
    jsonLd: ruta.noindex ? null : datosEstructurados(ruta, seo),
    modulos: precargas(ruta.carpeta),
    ruta: ruta.path
  });
  await writeFile(resolve(DIST, archivoDe(ruta.path)), html);
  console.log(`  ✓ ${archivoDe(ruta.path)}`);
};

// Las páginas se generan en paralelo; el sitemap conserva el orden de RUTAS
await Promise.all(RUTAS.map(generarPagina));
const sitemap = RUTAS.filter((ruta) => !ruta.noindex).map(entradaSitemap);

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
