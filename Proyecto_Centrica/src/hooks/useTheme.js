import { useEffect, useState } from 'react';

const STORAGE_KEY = 'theme';

/** Modo oscuro persistente. index.html aplica la clase antes del render. */
export default function useTheme() {
  const [isDark, setIsDark] = useState(() => document.body.classList.contains('dark-mode'));

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDark);
    try {
      localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
    } catch {
      // Almacenamiento bloqueado (modo privado): el tema solo dura la sesión
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((dark) => !dark);

  return [isDark, toggleTheme];
}
