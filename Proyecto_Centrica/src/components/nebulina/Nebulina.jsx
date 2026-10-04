import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useHidratado } from '../../hooks/useMediaQuery';
import { CLAVE_SALUDO, SEGUNDOS_SALUDO } from '../../config/nebulina';
import { EVENTO_ABRIR } from './abrirNebulina';
import Avatar from '../../assets/images/Imagenes/Nebulina-Avatar-128.webp';
import '../../styles/nebulina.css';

// El panel (y su base de conocimiento) se descarga solo al abrir el chat o al
// pasar el mouse/foco por el botón: no pesa en la carga de ninguna página.
const cargarChat = () => import('./NebulinaChat');
const NebulinaChat = lazy(cargarChat);

const saludoVisto = () => {
  try {
    return window.sessionStorage.getItem(CLAVE_SALUDO) === '1';
  } catch {
    return true; // sin almacenamiento: mejor no insistir con el saludo
  }
};

const marcarSaludoVisto = () => {
  try {
    window.sessionStorage.setItem(CLAVE_SALUDO, '1');
  } catch {
    // almacenamiento bloqueado: el saludo podría repetirse, sin consecuencias
  }
};

/**
 * Burbuja flotante de Nebulina, presente en todas las páginas. Solo se pinta
 * en el navegador (no forma parte del HTML generado ni afecta el SEO).
 */
const Nebulina = () => {
  const hidratado = useHidratado();
  const [abierto, setAbierto] = useState(false);
  // Una vez abierto se mantiene montado: la conversación sigue al cambiar de página
  const [montado, setMontado] = useState(false);
  const [saludo, setSaludo] = useState(false);
  const lanzadorRef = useRef(null);

  const abrir = useCallback(() => {
    setMontado(true);
    setAbierto(true);
    setSaludo(false);
    marcarSaludoVisto();
  }, []);

  // enfocar = false cuando se cierra solo por inactividad: no interrumpe lo que el visitante hace en la página
  const cerrar = useCallback((enfocar = true) => {
    setAbierto(false);
    if (enfocar) lanzadorRef.current?.focus();
  }, []);

  const cerrarSaludo = () => {
    setSaludo(false);
    marcarSaludoVisto();
  };

  useEffect(() => {
    window.addEventListener(EVENTO_ABRIR, abrir);
    return () => window.removeEventListener(EVENTO_ABRIR, abrir);
  }, [abrir]);

  // Saludo de bienvenida una vez por sesión, pasados unos segundos
  useEffect(() => {
    if (!hidratado || saludoVisto()) return undefined;
    const timer = setTimeout(() => setSaludo(true), SEGUNDOS_SALUDO * 1000);
    return () => clearTimeout(timer);
  }, [hidratado]);

  if (!hidratado) return null;

  return (
    <div className="nebulina-flotante">
      {montado && (
        <Suspense fallback={null}>
          <NebulinaChat abierto={abierto} onCerrar={cerrar} />
        </Suspense>
      )}

      {saludo && !abierto && (
        <div className="nebulina-saludo">
          <button type="button" className="nebulina-saludo-texto" onClick={abrir}>
            ¡Hola! Soy Nebulina 👋 ¿Te ayudo a encontrar algo?
          </button>
          <button type="button" className="nebulina-saludo-cerrar" onClick={cerrarSaludo} aria-label="Cerrar saludo">
            <X size={14} aria-hidden="true" />
          </button>
        </div>
      )}

      <button
        type="button"
        ref={lanzadorRef}
        className={`nebulina-lanzador${abierto ? ' is-abierto' : ''}`}
        onClick={abierto ? () => cerrar() : abrir}
        onPointerEnter={cargarChat}
        onFocus={cargarChat}
        aria-expanded={abierto}
        aria-controls="nebulina-chat"
        aria-label={abierto ? 'Cerrar el chat con Nebulina' : 'Abrir el chat con Nebulina, la asistente virtual'}
      >
        {abierto ? (
          <X size={26} aria-hidden="true" />
        ) : (
          <img src={Avatar} width="128" height="128" alt="" decoding="async" />
        )}
        {!abierto && <span className="nebulina-lanzador-estado" aria-hidden="true" />}
      </button>
    </div>
  );
};

export default Nebulina;
