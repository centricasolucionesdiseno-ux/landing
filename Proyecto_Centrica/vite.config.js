import { existsSync, readFileSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { scriptInicialEnLinea, securityHeaders } from './security.config.js'

const VENDOR_CHUNKS = {
  'vendor-react': ['react', 'react-dom', 'react-router', 'scheduler'],
  'vendor-gsap': ['gsap'],
  'vendor-icons': ['lucide-react'],
}

// Precarga la fuente (nombre con hash) para que el texto no espere al CSS
const preloadFont = () => ({
  name: 'centrica-preload-font',
  apply: 'build',
  transformIndexHtml(html, ctx) {
    const font = Object.keys(ctx.bundle ?? {}).find((file) => file.endsWith('.woff2'))
    if (!font) return html
    return [{
      tag: 'link',
      attrs: { rel: 'preload', href: `/${font}`, as: 'font', type: 'font/woff2', crossorigin: '' },
      injectTo: 'head'
    }]
  }
})

const sinBarraFinal = (ruta) => {
  let limpia = ruta
  while (limpia.endsWith('/')) limpia = limpia.slice(0, -1)
  return limpia || '/'
}

// `vite preview` responde como el hosting: sin "/" final (301), 404.html con
// código 404 para rutas que no existen (por defecto respondería index.html) y
// nunca sirve archivos ocultos (.vite, .htaccess...) salvo .well-known.
const previewComoHosting = () => ({
  name: 'centrica-preview-hosting',
  configurePreviewServer(server) {
    const dist = resolve(server.config.root, server.config.build.outDir)
    server.middlewares.use((req, res, next) => {
      const [ruta, consulta = ''] = (req.url ?? '/').split('?')
      if (/\/\.(?!well-known\/)/.test(decodeURIComponent(ruta))) {
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        return res.end(readFileSync(join(dist, '404.html')))
      }
      if (ruta.length > 1 && ruta.endsWith('/')) {
        res.writeHead(301, { Location: sinBarraFinal(ruta) + (consulta && `?${consulta}`) })
        return res.end()
      }
      const esPagina = extname(ruta) === ''
      if (esPagina && ruta !== '/' && !existsSync(join(dist, `${decodeURIComponent(ruta)}.html`))) {
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        return res.end(readFileSync(join(dist, '404.html')))
      }
      next()
    })
  }
})

export default defineConfig({
  plugins: [react(), scriptInicialEnLinea(), securityHeaders(), preloadFont(), previewComoHosting()],
  build: {
    // Sin source maps en producción: no exponer el código fuente
    sourcemap: false,
    // Lo usa scripts/prerender.mjs para precargar el JS de cada página (se borra después)
    manifest: true,
    rollupOptions: {
      output: {
        // Vite 8 (rolldown) solo acepta manualChunks como función
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          for (const [chunk, pkgs] of Object.entries(VENDOR_CHUNKS)) {
            if (pkgs.some((pkg) => id.includes(`/node_modules/${pkg}/`))) return chunk
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true
  },
  // En `npm run dev`, /api (backend PHP de citas) se envía a un PHP local:
  // ver integraciones/agenda-hostinger/README.md
  server: {
    proxy: { '/api': 'http://127.0.0.1:8080' }
  },
  // Enlace público temporal con `npm run compartir` (túnel de Cloudflare).
  // Solo se autorizan los dominios del túnel, no cualquier host.
  preview: {
    port: 4173,
    allowedHosts: ['.trycloudflare.com']
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'gsap', 'lucide-react']
  }
})
