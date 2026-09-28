import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'

const app = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
)

// En producción cada página llega ya generada en HTML (scripts/prerender.mjs):
// React la "hidrata" sin volver a pintarla. Si el HTML es de otra ruta (un
// hosting que responde index.html para todo) o no hay HTML (desarrollo), se
// pinta desde cero.
const root = document.getElementById('root')
const { ruta } = root.dataset
if (ruta && (ruta === '404' || ruta === window.location.pathname)) hydrateRoot(root, app)
else createRoot(root).render(app)
