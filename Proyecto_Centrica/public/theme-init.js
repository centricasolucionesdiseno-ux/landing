// Aplica el tema guardado antes del primer render para evitar el parpadeo.
// Archivo externo (no inline) para cumplir la Content-Security-Policy.
try {
  if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
} catch {
  // Almacenamiento bloqueado: se usa el tema claro
}
