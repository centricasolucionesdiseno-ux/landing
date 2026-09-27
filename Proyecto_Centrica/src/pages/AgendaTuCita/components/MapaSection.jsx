import { Navigation } from 'lucide-react';
import SectionHeader from '../../../components/ui/SectionHeader';
import { UBICACION } from '../../../config/agenda';

const coordenadas = `${UBICACION.lat},${UBICACION.lng}`;

// Mapa de Google sin API key, con el pin en las coordenadas exactas de la
// oficina. loading="lazy": solo se descarga al acercarse a la sección.
const MapaSection = () => (
  <section id="mapa" className="section bg-light">
    <div className="container">
      <SectionHeader title="Encuéntranos" subtitle={UBICACION.direccion} />
      <div className="mapa-frame" data-reveal="zoom">
        <iframe
          title={`Mapa: oficina de Céntrica en ${UBICACION.direccion}`}
          src={`https://www.google.com/maps?q=${coordenadas}&z=18&hl=es&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <div className="mapa-acciones" data-reveal>
        <a
          className="btn btn-primary"
          href={`https://www.google.com/maps/dir/?api=1&destination=${coordenadas}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Navigation size={18} aria-hidden="true" /> <span>Cómo llegar</span>
        </a>
      </div>
    </div>
  </section>
);

export default MapaSection;
