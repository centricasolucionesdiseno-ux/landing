import { useSyncExternalStore } from 'react';

// La Política de Cookies lista esta clave
export const STORAGE_KEY = 'theme';
const CLASE = 'dark-mode';

// La fuente de verdad es la clase del <body> (theme-init.js la pone antes de
// pintar). En el servidor y durante la hidratación se asume el tema claro, como
// el HTML generado; después React toma el valor real sin parpadeo.
const suscribir = (avisar) => {
  const observador = new MutationObserver(avisar);
  observador.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  return () => observador.disconnect();
};
const leer = () => document.body.classList.contains(CLASE);

/** Modo oscuro persistente. */
export default function useTheme() {
  const isDark = useSyncExternalStore(suscribir, leer, () => false);

  const toggleTheme = () => {
    const oscuro = !leer();
    document.body.classList.toggle(CLASE, oscuro);
    try {
      localStorage.setItem(STORAGE_KEY, oscuro ? 'dark' : 'light');
    } catch {
      // Almacenamiento bloqueado (modo privado): el tema solo dura la sesión
    }
  };

  return [isDark, toggleTheme];
}
