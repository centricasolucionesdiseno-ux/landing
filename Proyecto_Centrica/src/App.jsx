import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import './App.css';

const SobreNosotros = lazy(() => import('./pages/SobreNosotros'));
const Servicios = lazy(() => import('./pages/Servicios'));
const FabricaDeSoftware = lazy(() => import('./pages/FabricaDeSoftware'));
const NebulaERP = lazy(() => import('./pages/NebulaERP'));
const Sicovi = lazy(() => import('./pages/Sicovi'));
const AnalisisConIA = lazy(() => import('./pages/AnalisisConIA'));
const EvaluacionesDeCalidad = lazy(() => import('./pages/EvaluacionesDeCalidad'));
const AgendaTuCita = lazy(() => import('./pages/AgendaTuCita'));

const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    fontSize: '1.2rem',
    color: '#0e58a9'
  }}>
    Cargando...
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<SobreNosotros />} />
              <Route path="/servicios" element={<Servicios />} />
              <Route path="/fabrica-software" element={<FabricaDeSoftware />} />
              <Route path="/nebula-erp" element={<NebulaERP />} />
              <Route path="/sicovi" element={<Sicovi />} />
              <Route path="/analisis-ia" element={<AnalisisConIA />} />
              <Route path="/evaluaciones-calidad" element={<EvaluacionesDeCalidad />} />
              <Route path="/contacto" element={<AgendaTuCita />} />
              <Route path="/blog" element={<div style={{padding: '2rem'}}><h1>Blog</h1><p>Página en construcción...</p></div>} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
