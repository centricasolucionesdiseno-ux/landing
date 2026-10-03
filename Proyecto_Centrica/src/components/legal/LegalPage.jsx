import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDown, ChevronsUpDown, Printer } from 'lucide-react';
import Page from '../ui/Page';
import PageHero from '../ui/PageHero';

/**
 * Plantilla de páginas legales: hero compacto, índice lateral con la sección
 * activa resaltada, acordeón accesible y opción de imprimir / guardar en PDF.
 *
 * secciones: [{ id, icon, titulo, contenido }]
 * resumen:   bloque opcional "en pocas palabras" antes del acordeón
 * lateral:   contenido opcional bajo el índice (en móvil va al final)
 */
const LegalPage = ({ seo, hero, secciones, resumen, lateral, pie, className = '' }) => {
  const [abiertas, setAbiertas] = useState(() => new Set([secciones[0].id]));
  const [activa, setActiva] = useState(secciones[0].id);
  const itemsRef = useRef({});
  // Tras un clic en el índice, el resaltado respeta esa elección mientras dura el scroll
  const bloqueoRef = useRef(0);
  const ladoRef = useRef(null);
  const [lateralFijo, setLateralFijo] = useState(false);
  const { hash } = useLocation();

  const todasAbiertas = abiertas.size === secciones.length;

  const alternar = (id) =>
    setAbiertas((actuales) => {
      const nuevas = new Set(actuales);
      if (nuevas.has(id)) nuevas.delete(id);
      else nuevas.add(id);
      return nuevas;
    });

  const irA = (id) => {
    setAbiertas((actuales) => new Set(actuales).add(id));
    setActiva(id);
    bloqueoRef.current = Date.now() + 1200;
    window.history.replaceState(null, '', `#${id}`);
    requestAnimationFrame(() => itemsRef.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  // Enlace directo a una sección (p. ej. /privacidad#derechos): abrirla y llevar allí
  useEffect(() => {
    const id = hash.slice(1);
    if (!secciones.some((s) => s.id === id)) return undefined;
    const timer = setTimeout(() => irA(id), 120);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash]);

  // La columna lateral solo queda fija si cabe entera en la pantalla; si no,
  // el botón de Nebulina quedaría oculto hasta el final de la página
  useEffect(() => {
    const lado = ladoRef.current;
    if (!lado) return undefined;
    const escritorio = window.matchMedia('(min-width: 960px)');
    const medir = () => setLateralFijo(escritorio.matches && lado.offsetHeight + 120 <= window.innerHeight);
    const observer = new ResizeObserver(medir);
    observer.observe(lado);
    window.addEventListener('resize', medir);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', medir);
    };
  }, []);

  // Índice: resaltar la sección que se está leyendo (sin escuchar el scroll)
  useEffect(() => {
    const visibles = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => (entry.isIntersecting ? visibles.add(entry.target.id) : visibles.delete(entry.target.id)));
        if (Date.now() < bloqueoRef.current) return;
        const enPantalla = secciones.filter((s) => visibles.has(s.id));
        if (enPantalla.length === 0) return;
        // Al final de la página la última sección no puede subir más: se resalta esa
        const alFinal = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
        setActiva((alFinal ? enPantalla[enPantalla.length - 1] : enPantalla[0]).id);
      },
      { rootMargin: '-110px 0px -55% 0px' }
    );
    Object.values(itemsRef.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [secciones]);

  return (
    <Page className={`legal-page ${className}`.trim()} seo={seo}>
      <PageHero compact {...hero} />

      <div className="container">
        <div className="legal-grid">
          <div className={`legal-side${lateralFijo ? ' is-fijo' : ''}`} ref={ladoRef}>
            <nav className="legal-nav" aria-label="Contenido del documento" data-reveal="left">
              <p className="legal-nav-titulo">Contenido</p>
              <ol>
                {secciones.map(({ id, icon: Icon, titulo }, index) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className={activa === id ? 'is-active' : ''}
                      aria-current={activa === id ? 'true' : undefined}
                      onClick={(event) => {
                        event.preventDefault();
                        irA(id);
                      }}
                    >
                      <Icon size={18} aria-hidden="true" />
                      <span>{index + 1}. {titulo}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            {lateral && <aside className="legal-lateral">{lateral}</aside>}
          </div>

          <div className="legal-main">
            {resumen}

            <div className="legal-toolbar" data-reveal>
              <button
                type="button"
                className="btn-link"
                onClick={() => setAbiertas(todasAbiertas ? new Set() : new Set(secciones.map((s) => s.id)))}
              >
                <ChevronsUpDown size={16} aria-hidden="true" /> {todasAbiertas ? 'Contraer todo' : 'Expandir todo'}
              </button>
              <button type="button" className="btn-link" onClick={() => window.print()}>
                <Printer size={16} aria-hidden="true" /> Imprimir o guardar PDF
              </button>
            </div>

            <div className="legal-items">
              {secciones.map(({ id, icon: Icon, titulo, contenido }, index) => {
                const abierta = abiertas.has(id);
                return (
                  <section
                    key={id}
                    id={id}
                    ref={(el) => { itemsRef.current[id] = el; }}
                    className={`legal-item${abierta ? ' is-open' : ''}`}
                    data-reveal
                  >
                    <h2 className="legal-item-titulo">
                      <button
                        type="button"
                        id={`${id}-boton`}
                        aria-expanded={abierta}
                        aria-controls={`${id}-contenido`}
                        onClick={() => alternar(id)}
                      >
                        <span className="legal-item-icono"><Icon size={20} aria-hidden="true" /></span>
                        <span className="legal-item-texto">{index + 1}. {titulo}</span>
                        <ChevronDown className="legal-item-flecha" size={20} aria-hidden="true" />
                      </button>
                    </h2>
                    {/* grid-template-rows 0fr -> 1fr: abre/cierra suave sin medir alturas con JS */}
                    <div
                      id={`${id}-contenido`}
                      className="legal-item-cuerpo"
                      inert={!abierta}
                    >
                      <div className="legal-item-interior">
                        <div className="legal-contenido">{contenido}</div>
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>

            {pie}
          </div>
        </div>
      </div>
    </Page>
  );
};

export default LegalPage;
