/**
 * Cabeceras de seguridad del sitio, definidas en un solo lugar.
 *
 * El plugin `securityHeaders()` en cada build:
 *  - inyecta la CSP como <meta> en index.html (funciona en cualquier hosting)
 *  - genera `_headers` y `_redirects` (Netlify / Cloudflare Pages)
 *  - genera `.htaccess` (Apache / cPanel)
 *
 * Si se agrega un servicio externo nuevo (analytics, formularios, mapas...)
 * hay que añadir su dominio en CSP_DIRECTIVES o el navegador lo bloqueará.
 * Principio: cada dominio externo se permite solo en la directiva que lo necesita.
 */

const TURNSTILE = 'https://challenges.cloudflare.com';

const baseDirectives = () => ({
  'default-src': ["'self'"],
  'script-src': ["'self'"],
  // Sin atributos de evento en línea (onclick="..."), ni siquiera por error
  'script-src-attr': ["'none'"],
  'style-src': ["'self'"],
  'font-src': ["'self'"],
  'img-src': ["'self'", 'data:'],
  'media-src': ["'self'", 'https://cdn.coverr.co'],
  // Formulario "Agenda tu cita" -> Google Apps Script (responde con una redirección
  // a script.googleusercontent.com)
  'connect-src': ["'self'", 'https://script.google.com', 'https://script.googleusercontent.com'],
  // Mapa de Google en la página de Contacto
  'frame-src': ['https://www.google.com', 'https://maps.google.com'],
  'worker-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': []
});

// Cloudflare Turnstile (anti-bots del formulario): solo si hay clave configurada.
// Sin Turnstile se activa Trusted Types: el navegador bloquea cualquier intento de
// inyectar HTML o scripts en la página (XSS del lado del cliente), aunque apareciera
// una falla en el código o en una dependencia. El script de Turnstile no es
// compatible con Trusted Types, por eso solo va cuando no se usa.
const directives = ({ turnstile }) => {
  const csp = baseDirectives();
  if (turnstile) {
    csp['script-src'].push(TURNSTILE);
    csp['frame-src'].push(TURNSTILE);
  } else {
    csp['require-trusted-types-for'] = ["'script'"];
    csp['trusted-types'] = ["'none'"];
  }
  return csp;
};

// Solo como cabecera HTTP (en el hosting con HTTPS), no en el <meta>:
//  - frame-ancestors no es válido dentro de <meta>
//  - upgrade-insecure-requests rompería `npm run preview` por la red local
//    (http://192.168.x.x): pediría los JS/CSS por https y la página no cargaría
const META_EXCLUDED = new Set(['frame-ancestors', 'upgrade-insecure-requests']);

const buildCsp = (opciones, forMeta = false) =>
  Object.entries(directives(opciones))
    .filter(([name]) => !(forMeta && META_EXCLUDED.has(name)))
    .map(([name, values]) => [name, ...values].join(' '))
    .join('; ');

const headers = (opciones) => ({
  'Content-Security-Policy': buildCsp(opciones),
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // Funciones del navegador que el sitio nunca usa: bloqueadas para todos, incluidos iframes
  'Permissions-Policy': [
    'camera=()', 'microphone=()', 'geolocation=()', 'payment=()', 'usb=()', 'serial=()', 'hid=()',
    'bluetooth=()', 'midi=()', 'accelerometer=()', 'gyroscope=()', 'magnetometer=()',
    'display-capture=()', 'xr-spatial-tracking=()', 'browsing-topics=()'
  ].join(', '),
  'Cross-Origin-Opener-Policy': 'same-origin',
  // Otros sitios no pueden incrustar ni leer nuestros archivos
  'Cross-Origin-Resource-Policy': 'same-origin',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'Origin-Agent-Cluster': '?1'
});

// Los archivos de /assets llevan hash en el nombre: se pueden cachear un año
const ASSETS_CACHE = 'public, max-age=31536000, immutable';

const netlifyHeaders = (opciones) =>
  [
    '/*',
    ...Object.entries(headers(opciones)).map(([name, value]) => `  ${name}: ${value}`),
    '',
    '/assets/*',
    `  Cache-Control: ${ASSETS_CACHE}`,
    ''
  ].join('\n');

// Cada página es un .html generado en el build (scripts/prerender.mjs): Netlify y
// Cloudflare Pages ya sirven /servicios desde servicios.html, quitan el ".html" y
// el "/" final con un 301 y responden 404.html con código 404. No hace falta
// (y sería un error) redirigir todo a index.html como en una SPA.
const netlifyRedirects = () => '# Sin reglas: ver security.config.js\n';

const apacheHtaccess = (opciones) =>
  [
    '# Generado en el build desde security.config.js — no editar a mano',
    'Options -Indexes',
    '',
    '# Archivos ocultos (.git, .env, ...) nunca se sirven, por si se suben por error',
    '<FilesMatch "^\\.">',
    '  Require all denied',
    '</FilesMatch>',
    'RedirectMatch 404 /\\.(?!well-known)',
    '',
    '<IfModule mod_headers.c>',
    ...Object.entries(headers(opciones)).map(([name, value]) => `  Header always set ${name} "${value}"`),
    '  Header unset X-Powered-By',
    '  <FilesMatch "\\.(js|css|webp|png|jpg|svg|woff2?)$">',
    `    Header set Cache-Control "${ASSETS_CACHE}"`,
    '  </FilesMatch>',
    '  <FilesMatch "\\.html$">',
    '    Header set Cache-Control "no-cache"',
    '  </FilesMatch>',
    '</IfModule>',
    '',
    '# Páginas que no existen: 404 real (no una página vacía con código 200)',
    'ErrorDocument 404 /404.html',
    'Options -MultiViews',
    '',
    '<IfModule mod_rewrite.c>',
    '  RewriteEngine On',
    '',
    '  # Una sola URL por página (SEO): https, sin www, sin .html y sin "/" final',
    '  RewriteCond %{HTTPS} off [OR]',
    '  RewriteCond %{HTTP_HOST} ^www\\. [NC]',
    '  RewriteCond %{HTTP_HOST} ^(?:www\\.)?(.+)$ [NC]',
    '  RewriteRule ^ https://%1%{REQUEST_URI} [L,R=301]',
    '',
    '  RewriteCond %{THE_REQUEST} \\s/+(.*?)(?:index)?\\.html[\\s?] [NC]',
    '  RewriteRule ^ /%1 [L,R=301]',
    '',
    '  RewriteCond %{REQUEST_FILENAME} !-d',
    '  RewriteRule ^(.+)/$ /$1 [L,R=301]',
    '',
    '  # /servicios -> servicios.html (páginas generadas en el build)',
    '  RewriteCond %{REQUEST_FILENAME} !-f',
    '  RewriteCond %{REQUEST_FILENAME}.html -f',
    '  RewriteRule ^(.+)$ $1.html [L]',
    '</IfModule>',
    ''
  ].join('\n');

export function securityHeaders() {
  const opciones = { turnstile: false };
  return {
    name: 'centrica-security-headers',
    apply: 'build',
    configResolved(config) {
      opciones.turnstile = Boolean(config.env.VITE_TURNSTILE_SITEKEY);
    },
    // Justo después de <meta charset>: el charset debe ir primero y la CSP
    // antes de cualquier script o estilo
    transformIndexHtml(html) {
      const meta = `<meta http-equiv="Content-Security-Policy" content="${buildCsp(opciones, true)}" />`;
      return html.replace(/(<meta charset="[^"]*"\s*\/?>)/i, `$1\n    ${meta}`);
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: '_headers', source: netlifyHeaders(opciones) });
      this.emitFile({ type: 'asset', fileName: '_redirects', source: netlifyRedirects() });
      this.emitFile({ type: 'asset', fileName: '.htaccess', source: apacheHtaccess(opciones) });
    }
  };
}
