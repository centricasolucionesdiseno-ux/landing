import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import useCardInteractions from './hooks/useCardInteractions';

const MAIN_PAGES = {
  SobreNosotros: () => import('./pages/SobreNosotros'),
  Servicios: () => import('./pages/Servicios'),
  FabricaDeSoftware: () => import('./pages/FabricaDeSoftware'),
  NebulaERP: () => import('./pages/NebulaERP'),
  Sicovi: () => import('./pages/Sicovi'),
  ConsultoriaDigital: () => import('./pages/ConsultoriaDigital')
};

const SobreNosotros = lazy(MAIN_PAGES.SobreNosotros);
const Servicios = lazy(MAIN_PAGES.Servicios);
const FabricaDeSoftware = lazy(MAIN_PAGES.FabricaDeSoftware);
const NebulaERP = lazy(MAIN_PAGES.NebulaERP);
const Sicovi = lazy(MAIN_PAGES.Sicovi);
const ConsultoriaDigital = lazy(MAIN_PAGES.ConsultoriaDigital);
const AnalisisConIA = lazy(() => import('./pages/AnalisisConIA'));
const AgendaTuCita = lazy(() => import('./pages/AgendaTuCita'));
const Privacidad = lazy(() => import('./pages/Privacidad'));
const EnConstruccion = lazy(() => import('./pages/EnConstruccion'));
const NotFound = lazy(() => import('./pages/NotFound'));

const LoadingFallback = () => (
  <output className="page-loader">
    <span className="page-loader-spinner" aria-hidden="true" />
    <span>Cargando...</span>
  </output>
);

function App() {
  useCardInteractions();

  // Precarga las páginas principales cuando la actual ya cargó por completo
  // y el navegador está libre: navegar entre ellas no muestra "Cargando..."
  // y no le quita red a la imagen principal (LCP) de la primera visita.
  useEffect(() => {
    if (navigator.connection?.saveData) return undefined;
    let idleId;
    let timer;
    const preload = () => Object.values(MAIN_PAGES).forEach((load) => load());
    const schedule = () => {
      timer = setTimeout(() => {
        if ('requestIdleCallback' in window) idleId = window.requestIdleCallback(preload, { timeout: 3000 });
        else preload();
      }, 1500);
    };
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
    return () => {
      window.removeEventListener('load', schedule);
      clearTimeout(timer);
      if (idleId) window.cancelIdleCallback(idleId);
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <a className="skip-link" href="#main">Saltar al contenido</a>
        <Header />
        <main id="main">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<SobreNosotros />} />
              <Route path="/servicios" element={<Servicios />} />
              <Route path="/fabrica-software" element={<FabricaDeSoftware />} />
              <Route path="/nebula-erp" element={<NebulaERP />} />
              <Route path="/sicovi" element={<Sicovi />} />
              <Route path="/analisis-ia" element={<AnalisisConIA />} />
              <Route path="/consultoria-digital" element={<ConsultoriaDigital />} />
              <Route path="/contacto" element={<AgendaTuCita />} />
              <Route path="/privacidad" element={<Privacidad />} />
              <Route path="/blog" element={<EnConstruccion title="Blog" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
