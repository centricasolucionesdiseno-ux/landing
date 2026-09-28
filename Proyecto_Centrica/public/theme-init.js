// Aplica el tema guardado antes del primer render para evitar el parpadeo.
// Archivo externo (no inline) para cumplir la Content-Security-Policy.
try {
  if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
} catch {
  // Almacenamiento bloqueado: se usa el tema claro
}

// Anti-clickjacking de respaldo: si alguien incrusta el sitio en un iframe (por
// ejemplo en un hosting que no aplicó frame-ancestors / X-Frame-Options), se
// oculta y se sale del marco para que no se pueda superponer ni engañar al usuario.
if (window.top !== window.self) {
  document.documentElement.style.visibility = 'hidden';
  try {
    window.top.location.replace(window.location.href);
  } catch {
    // Marco con sandbox: la página queda oculta
  }
}
