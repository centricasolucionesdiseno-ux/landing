import { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import SectionHeader from '../../../components/ui/SectionHeader';
import { UBICACION } from '../../../config/agenda';

const coordenadas = `${UBICACION.lat},${UBICACION.lng}`;

/**
 * Mapa de Google sin API key, con el pin en las coordenadas exactas de la
 * oficina. Se carga solo cuando la persona lo pide: Google Maps descarga
 * ~400 KB de JavaScript y puede instalar cookies, así que no se carga para
 * quien no lo necesita (página más rápida y más privada).
 */
const MapaSection = () => {
  const [mostrarMapa, setMostrarMapa] = useState(false);

  return (
    <section id="mapa" className="section bg-light">
      <div className="container">
        <SectionHeader title="Encuéntranos" subtitle={UBICACION.direccion} />
        <div className="mapa-frame" data-reveal="zoom">
          {mostrarMapa ? (
            <iframe
              title={`Mapa: oficina de Céntrica en ${UBICACION.direccion}`}
              src={`https://www.google.com/maps?q=${coordenadas}&z=18&hl=es&output=embed`}
              // Google solo recibe el dominio, no la dirección completa de la página
              referrerPolicy="strict-origin-when-cross-origin"
              // Aislado: puede mostrar el mapa y abrir Google Maps en otra pestaña,
              // pero no navegar nuestra página, enviar formularios ni abrir diálogos
              sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              allowFullScreen
            />
          ) : (
            <div className="mapa-vista">
              <span className="mapa-vista-icono" aria-hidden="true"><MapPin size={36} /></span>
              <p className="mapa-vista-direccion">{UBICACION.direccion}</p>
              <button type="button" className="btn btn-primary" onClick={() => setMostrarMapa(true)}>
                <MapPin size={18} aria-hidden="true" /> <span>Ver mapa interactivo</span>
              </button>
              <p className="mapa-vista-nota">El mapa lo provee Google Maps, que puede usar sus propias cookies.</p>
            </div>
          )}
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
};

export default MapaSection;
