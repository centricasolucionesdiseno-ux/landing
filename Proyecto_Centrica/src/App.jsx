import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import SobreNosotros from './pages/SobreNosotros';
import Servicios from './pages/Servicios';
import FabricaDeSoftware from './pages/FabricaDeSoftware';
import NebulaERP from './pages/NebulaERP';
import SICOVI from './pages/SICOVI';
import AnalisisConIA from './pages/AnalisisConIA';
import EvaluacionesDeCalidad from './pages/EvaluacionesDeCalidad';
import AgendaTuCita from './pages/AgendaTuCita';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<SobreNosotros />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/fabrica-software" element={<FabricaDeSoftware />} />
            <Route path="/nebula-erp" element={<NebulaERP />} />
            <Route path="/sicovi" element={<SICOVI />} />
            <Route path="/analisis-ia" element={<AnalisisConIA />} />
            <Route path="/evaluaciones-calidad" element={<EvaluacionesDeCalidad />} />
            <Route path="/contacto" element={<AgendaTuCita />} />
            <Route path="/blog" element={<Servicios />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
