import { useCallback, useEffect, useRef, useState } from 'react';
import { alCargarVoces, callar, dictadoDisponible, escuchar, guardarPreferencia, lecturaDisponible, leerPreferencia, prepararLectura } from './voz';

const ERROR_GENERAL = 'El dictado por voz no está disponible en este momento. Puedes escribirme. 😊';

/**
 * Voz del chat: micrófono (dictado) y lectura en voz alta.
 * - onDictado(texto): el visitante terminó de hablar
 * - onActividad(): mientras habla (para que no cuente como inactividad)
 * - onAviso(texto): un problema con el micrófono, explicado con amabilidad
 */
const useVoz = ({ onDictado, onActividad, onAviso }) => {
  const [dictado] = useState(dictadoDisponible);
  // Las voces cargan después de la página: el parlante aparece si hay una voz natural
  const [lectura, setLectura] = useState(lecturaDisponible);
  useEffect(() => alCargarVoces(() => setLectura(lecturaDisponible())), []);
  // Se recuerda en este equipo, como el tema claro u oscuro
  const [leerEnVoz, setLeerEnVoz] = useState(leerPreferencia);
  const [escuchando, setEscuchando] = useState(false);
  const [parcial, setParcial] = useState('');
  const detener = useRef(null);
  // Callbacks al día sin reiniciar el reconocimiento
  const eventos = useRef({ onDictado, onActividad, onAviso });
  useEffect(() => {
    eventos.current = { onDictado, onActividad, onAviso };
  }, [onDictado, onActividad, onAviso]);

  const dejarDeEscuchar = useCallback(() => {
    detener.current?.();
    detener.current = null;
  }, []);

  const empezarAEscuchar = useCallback(async () => {
    callar();
    setEscuchando(true);
    try {
      detener.current = await escuchar({
        onParcial: (texto) => {
          setParcial(texto);
          eventos.current.onActividad();
        },
        onFinal: (texto) => {
          setParcial('');
          if (texto) eventos.current.onDictado(texto);
        },
        onError: (mensaje) => eventos.current.onAviso(mensaje),
        onFin: () => {
          detener.current = null;
          setEscuchando(false);
          setParcial('');
        }
      });
    } catch {
      setEscuchando(false);
      eventos.current.onAviso(ERROR_GENERAL);
    }
  }, []);

  const alternarMicrofono = useCallback(() => {
    // El toque habilita la respuesta hablada en iPhone/iPad
    prepararLectura();
    if (escuchando) dejarDeEscuchar();
    // Los errores ya se manejan dentro (onAviso): no hay nada que esperar aquí
    else void empezarAEscuchar();
  }, [escuchando, dejarDeEscuchar, empezarAEscuchar]);

  const alternarLectura = useCallback(() => {
    const activa = !leerEnVoz;
    if (activa) prepararLectura();
    else callar();
    guardarPreferencia(activa);
    setLeerEnVoz(activa);
  }, [leerEnVoz]);

  // Al salir: micrófono apagado y sin voz
  useEffect(() => () => {
    detener.current?.();
    callar();
  }, []);

  return {
    disponible: { dictado, lectura },
    escuchando,
    parcial,
    leerEnVoz: leerEnVoz && lectura,
    alternarMicrofono,
    alternarLectura,
    dejarDeEscuchar
  };
};

export default useVoz;
