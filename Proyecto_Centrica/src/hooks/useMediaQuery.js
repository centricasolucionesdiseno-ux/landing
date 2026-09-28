import { useCallback, useSyncExternalStore } from 'react';

const sinSuscripcion = () => () => {};

/**
 * Media query compatible con el HTML generado en el build: en el servidor y
 * durante la hidratación vale `false` (igual que el HTML), y justo después
 * toma el valor real y se actualiza si cambia (girar el celular, etc.).
 */
export default function useMediaQuery(query) {
  const suscribir = useCallback((avisar) => {
    const mq = window.matchMedia(query);
    mq.addEventListener('change', avisar);
    return () => mq.removeEventListener('change', avisar);
  }, [query]);
  return useSyncExternalStore(suscribir, () => window.matchMedia(query).matches, () => false);
}

/** `false` en el servidor y durante la hidratación; `true` después. */
export const useHidratado = () => useSyncExternalStore(sinSuscripcion, () => true, () => false);
