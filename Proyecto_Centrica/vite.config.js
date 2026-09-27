import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { securityHeaders } from './security.config.js'

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

export default defineConfig({
  plugins: [react(), securityHeaders(), preloadFont()],
  build: {
    // Sin source maps en producción: no exponer el código fuente
    sourcemap: false,
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
