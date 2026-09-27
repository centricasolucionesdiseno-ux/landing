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
 */

const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'"],
  'style-src': ["'self'"],
  'font-src': ["'self'"],
  'img-src': ["'self'", 'data:'],
  'media-src': ["'self'", 'https://cdn.coverr.co'],
  // Formulario "Agenda tu cita" -> Google Apps Script (responde con una redirección
  // a script.googleusercontent.com)
  'connect-src': ["'self'", 'https://script.google.com', 'https://script.googleusercontent.com'],
  // Mapa de Google en la página de Contacto
  'frame-src': ['https://www.google.com', 'https://maps.google.com'],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': []
};

// Solo como cabecera HTTP (en el hosting con HTTPS), no en el <meta>:
//  - frame-ancestors no es válido dentro de <meta>
//  - upgrade-insecure-requests rompería `npm run preview` por la red local
//    (http://192.168.x.x): pediría los JS/CSS por https y la página no cargaría
const META_EXCLUDED = new Set(['frame-ancestors', 'upgrade-insecure-requests']);

const buildCsp = (forMeta = false) =>
  Object.entries(CSP_DIRECTIVES)
    .filter(([name]) => !(forMeta && META_EXCLUDED.has(name)))
    .map(([name, values]) => [name, ...values].join(' '))
    .join('; ');

const HEADERS = {
  'Content-Security-Policy': buildCsp(),
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
  'Cross-Origin-Opener-Policy': 'same-origin'
};

// Los archivos de /assets llevan hash en el nombre: se pueden cachear un año
const ASSETS_CACHE = 'public, max-age=31536000, immutable';

const netlifyHeaders = () =>
  [
    '/*',
    ...Object.entries(HEADERS).map(([name, value]) => `  ${name}: ${value}`),
    '',
    '/assets/*',
    `  Cache-Control: ${ASSETS_CACHE}`,
    '',
    '/index.html',
    '  Cache-Control: no-cache',
    ''
  ].join('\n');

const apacheHtaccess = () =>
  [
    '# Generado en el build desde security.config.js — no editar a mano',
    'Options -Indexes',
    '',
    '<IfModule mod_headers.c>',
    ...Object.entries(HEADERS).map(([name, value]) => `  Header always set ${name} "${value}"`),
    '  Header unset X-Powered-By',
    '  <FilesMatch "\\.(js|css|webp|png|jpg|svg|woff2?)$">',
    `    Header set Cache-Control "${ASSETS_CACHE}"`,
    '  </FilesMatch>',
    '  <Files "index.html">',
    '    Header set Cache-Control "no-cache"',
    '  </Files>',
    '</IfModule>',
    '',
    '# Forzar HTTPS',
    '<IfModule mod_rewrite.c>',
    '  RewriteEngine On',
    '  RewriteCond %{HTTPS} off',
    '  RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]',
    '',
    '  # SPA: las rutas de React Router sirven index.html',
    '  RewriteCond %{REQUEST_FILENAME} !-f',
    '  RewriteCond %{REQUEST_FILENAME} !-d',
    '  RewriteRule ^ index.html [L]',
    '</IfModule>',
    ''
  ].join('\n');

export function securityHeaders() {
  return {
    name: 'centrica-security-headers',
    apply: 'build',
    // Justo después de <meta charset>: el charset debe ir primero y la CSP
    // antes de cualquier script o estilo
    transformIndexHtml(html) {
      const meta = `<meta http-equiv="Content-Security-Policy" content="${buildCsp(true)}" />`;
      return html.replace(/(<meta charset="[^"]*"\s*\/?>)/i, `$1\n    ${meta}`);
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: '_headers', source: netlifyHeaders() });
      this.emitFile({ type: 'asset', fileName: '_redirects', source: '/*  /index.html  200\n' });
      this.emitFile({ type: 'asset', fileName: '.htaccess', source: apacheHtaccess() });
    }
  };
}
