/* eslint-disable react-refresh/only-export-components -- no es un módulo de interfaz: solo lo usa el build */
import { StrictMode } from 'react';
import { prerender } from 'react-dom/static';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

export { RUTAS, datosEstructurados, SITE_URL, DOMINIOS_EXTERNOS } from './config/seo';

const arbol = (url) => (
  <StrictMode>
    <HelmetProvider context={{}}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  </StrictMode>
);

/**
 * Genera el HTML de una ruta en el build (lo usa scripts/prerender.mjs).
 *
 * `prerender` espera a que cargue la página lazy. Ya cargada, renderToString
 * escribe todo en línea, sin los <script> con que el streaming completa los
 * Suspense (la CSP los bloquearía).
 */
export async function render(url) {
  await prerender(arbol(url));
  return renderToString(arbol(url));
}
