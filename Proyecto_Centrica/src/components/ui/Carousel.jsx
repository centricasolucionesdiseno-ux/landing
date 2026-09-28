import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { prefersReducedMotion } from '../../utils/motion';

/**
 * Carrusel con desplazamiento nativo (scroll-snap): se desliza con el dedo en
 * móvil y no anima nada con JavaScript. Muestra 1, 2 o 3 elementos según el
 * ancho (ver .carrusel en components.css); flechas y puntos aparecen solo si
 * no caben todos.
 *
 * Avance automático: solo si hay elementos ocultos, el carrusel está en
 * pantalla, la pestaña visible, sin hover/foco y sin "reducir movimiento".
 * Se detiene para siempre en cuanto la persona lo usa.
 */
const Carousel = ({ items, etiqueta, intervalo = 6000 }) => {
  const pistaRef = useRef(null);
  const slidesRef = useRef([]);
  const [activo, setActivo] = useState(0);
  // Posiciones reales del carrusel: con 2 visibles y 3 elementos hay solo 2
  const [paginas, setPaginas] = useState(1);
  const [desborda, setDesborda] = useState(false);
  const [enPantalla, setEnPantalla] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [usado, setUsado] = useState(false);

  // Distancia entre el inicio de un elemento y el siguiente (ancho + hueco)
  const paso = useCallback(() => {
    const [primero, segundo] = slidesRef.current;
    return segundo && primero ? segundo.offsetLeft - primero.offsetLeft : pistaRef.current?.clientWidth || 1;
  }, []);

  const irA = useCallback((pagina) => {
    const pista = pistaRef.current;
    if (!pista) return;
    const destino = ((pagina % paginas) + paginas) % paginas;
    pista.scrollTo({ left: destino * paso(), behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, [paginas, paso]);

  // ¿Hay elementos que no caben y cuántas posiciones hay? (cambia con el ancho)
  useEffect(() => {
    const pista = pistaRef.current;
    const medir = () => {
      const maximo = pista.scrollWidth - pista.clientWidth;
      setDesborda(maximo > 2);
      setPaginas(maximo > 2 ? Math.round(maximo / paso()) + 1 : 1);
    };
    const observer = new ResizeObserver(medir);
    observer.observe(pista);
    return () => observer.disconnect();
  }, [paso]);

  // Posición activa según el desplazamiento (una medición por cuadro, sin costo)
  useEffect(() => {
    const pista = pistaRef.current;
    let cuadro = 0;
    const alDesplazar = () => {
      if (cuadro) return;
      cuadro = requestAnimationFrame(() => {
        cuadro = 0;
        setActivo(Math.min(paginas - 1, Math.round(pista.scrollLeft / paso())));
      });
    };
    pista.addEventListener('scroll', alDesplazar, { passive: true });
    return () => {
      pista.removeEventListener('scroll', alDesplazar);
      cancelAnimationFrame(cuadro);
    };
  }, [paginas, paso]);

  // ¿El carrusel está en pantalla? (fuera de ella no avanza)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setEnPantalla(entry.isIntersecting), { threshold: 0.4 });
    observer.observe(pistaRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!desborda || !enPantalla || pausado || usado || prefersReducedMotion()) return undefined;
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') irA(activo + 1);
    }, intervalo);
    return () => clearInterval(timer);
  }, [desborda, enPantalla, pausado, usado, activo, intervalo, irA]);

  const accion = (indice) => {
    setUsado(true);
    irA(indice);
  };

  return (
    <div
      className={`carrusel${desborda ? ' is-desborda' : ''}`}
      role="region"
      aria-roledescription="carrusel"
      aria-label={etiqueta}
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
    >
      <div
        className="carrusel-pista"
        ref={pistaRef}
        tabIndex={desborda ? 0 : -1}
        onPointerDown={() => setUsado(true)}
        onWheel={() => setUsado(true)}
      >
        {items.map((item, indice) => (
          <div
            key={item.key}
            className="carrusel-slide"
            ref={(el) => { slidesRef.current[indice] = el; }}
            role="group"
            aria-roledescription="diapositiva"
            aria-label={`${indice + 1} de ${items.length}`}
          >
            {item.contenido}
          </div>
        ))}
      </div>

      {desborda && (
        <div className="carrusel-controles">
          <button type="button" className="carrusel-flecha" onClick={() => accion(activo - 1)} aria-label="Anterior">
            <ChevronLeft size={22} aria-hidden="true" />
          </button>
          <div className="carrusel-puntos">
            {Array.from({ length: paginas }, (_, indice) => (
              <button
                key={indice}
                type="button"
                className={`carrusel-punto${indice === activo ? ' is-activo' : ''}`}
                onClick={() => accion(indice)}
                aria-label={`Ir a la posición ${indice + 1} de ${paginas}`}
                aria-current={indice === activo ? 'true' : undefined}
              />
            ))}
          </div>
          <button type="button" className="carrusel-flecha" onClick={() => accion(activo + 1)} aria-label="Siguiente">
            <ChevronRight size={22} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Carousel;
