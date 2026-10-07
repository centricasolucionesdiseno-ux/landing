import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { useHidratado } from '../../hooks/useMediaQuery';
import { EVENTO_ABRIR } from './abrirNebulina';
import { invitacionPara, registrarChatAbierto, registrarInvitacion, registrarRechazo, registrarVisita } from './recorrido';
import Parpados from './Parpados';
import Avatar from '../../assets/images/Imagenes/Nebulina-Avatar-128.webp';
import '../../styles/nebulina.css';

// El panel (y su base de conocimiento) se descarga solo al abrir el chat o al
// pasar el mouse/foco por el botón: no pesa en la carga de ninguna página.
const cargarChat = () => import('./NebulinaChat');
const NebulinaChat = lazy(cargarChat);

/**
 * Burbuja flotante de Nebulina, presente en todas las páginas. Solo se pinta
 * en el navegador (no forma parte del HTML generado ni afecta el SEO).
 *
 * Con el chat cerrado, si el visitante se queda un rato en una página,
 * Nebulina lo invita con algo concreto de esa página (ver proactivo.js).
 */
const Nebulina = () => {
  const hidratado = useHidratado();
  const { pathname } = useLocation();
  const [abierto, setAbierto] = useState(false);
  // Una vez abierto se mantiene montado: la conversación sigue al cambiar de página
  const [montado, setMontado] = useState(false);
  // Invitación visible: { ruta, texto, tema }. Solo se muestra en la página donde salió
  const [invitacion, setInvitacion] = useState(null);
  // Tema con el que arranca el chat si se abrió desde una invitación
  const [temaInicial, setTemaInicial] = useState(null);
  const lanzadorRef = useRef(null);
  // La burbuja está oculta con el chat abierto: el foco vuelve a ella cuando reaparece
  const enfocarAlCerrar = useRef(false);

  const abrir = useCallback((tema = null) => {
    setTemaInicial((actual) => actual ?? tema);
    setMontado(true);
    setAbierto(true);
    setInvitacion(null);
    registrarChatAbierto();
  }, []);

  const abrirSinTema = useCallback(() => abrir(), [abrir]);

  // enfocar = false cuando se cierra solo por inactividad: no interrumpe lo que el visitante hace en la página
  const cerrar = useCallback((enfocar = true) => {
    enfocarAlCerrar.current = enfocar;
    setAbierto(false);
  }, []);

  useEffect(() => {
    if (abierto || !enfocarAlCerrar.current) return;
    enfocarAlCerrar.current = false;
    lanzadorRef.current?.focus();
  }, [abierto]);

  const rechazarInvitacion = () => {
    setInvitacion(null);
    registrarRechazo();
  };

  useEffect(() => {
    window.addEventListener(EVENTO_ABRIR, abrirSinTema);
    return () => window.removeEventListener(EVENTO_ABRIR, abrirSinTema);
  }, [abrirSinTema]);

  // Recorrido: qué servicios ha visto (para invitar y proponer soluciones combinadas)
  useEffect(() => {
    if (hidratado) registrarVisita(pathname);
  }, [hidratado, pathname]);

  // Invitación proactiva tras unos segundos en la página (con topes, ver recorrido.js)
  useEffect(() => {
    if (!hidratado || montado) return undefined;
    const elegida = invitacionPara(pathname);
    if (!elegida) return undefined;
    const timer = setTimeout(() => {
      // Solo si sigue mirando la página y nada cambió mientras tanto
      if (document.visibilityState !== 'visible' || !invitacionPara(pathname)) return;
      registrarInvitacion(pathname);
      setInvitacion({ ruta: pathname, texto: elegida.texto, tema: elegida.tema });
    }, elegida.segundos * 1000);
    return () => clearTimeout(timer);
  }, [hidratado, montado, pathname]);

  if (!hidratado) return null;

  const invitacionVisible = invitacion?.ruta === pathname && !abierto;

  return (
    <div className="nebulina-flotante">
      {montado && (
        <Suspense fallback={null}>
          <NebulinaChat abierto={abierto} onCerrar={cerrar} temaInicial={temaInicial} />
        </Suspense>
      )}

      {invitacionVisible && (
        <div className="nebulina-saludo">
          <button type="button" className="nebulina-saludo-texto" onClick={() => abrir(invitacion.tema)} onPointerEnter={cargarChat}>
            {invitacion.texto}
          </button>
          <button type="button" className="nebulina-saludo-cerrar" onClick={rechazarInvitacion} aria-label="Cerrar invitación">
            <X size={14} aria-hidden="true" />
          </button>
        </div>
      )}

      <button
        type="button"
        ref={lanzadorRef}
        className={`nebulina-lanzador${abierto ? ' is-abierto' : ''}`}
        onClick={abierto ? () => cerrar() : abrirSinTema}
        onPointerEnter={cargarChat}
        onFocus={cargarChat}
        aria-expanded={abierto}
        aria-controls="nebulina-chat"
        aria-label={abierto ? 'Cerrar el chat con Nebulina' : 'Abrir el chat con Nebulina, la asistente virtual'}
      >
        {abierto ? (
          <X size={26} aria-hidden="true" />
        ) : (
          <>
            <img src={Avatar} width="128" height="128" alt="" decoding="async" />
            <Parpados variante="avatar" />
          </>
        )}
        {!abierto && <span className="nebulina-lanzador-estado" aria-hidden="true" />}
      </button>
    </div>
  );
};

export default Nebulina;
