import { useEffect, useRef } from 'react';

// Script oficial de Cloudflare Turnstile. Se carga solo en la página que lo
// usa y solo si hay clave configurada (la CSP lo permite únicamente entonces).
const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let cargando;

const cargarTurnstile = () => {
  cargando ??= new Promise((resolver, rechazar) => {
    if (window.turnstile) {
      resolver(window.turnstile);
      return;
    }
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => resolver(window.turnstile);
    script.onerror = () => {
      cargando = undefined;
      rechazar(new Error('No se pudo cargar la verificación'));
    };
    document.head.appendChild(script);
  });
  return cargando;
};

/**
 * Verificación anti-bots de Cloudflare (sin cookies, casi siempre invisible).
 * El token se valida en el servidor (Apps Script); aquí solo se obtiene.
 * `reiniciarRef.current()` pide un token nuevo: cada token sirve una sola vez.
 */
const Turnstile = ({ sitekey, onToken, reiniciarRef }) => {
  const contenedorRef = useRef(null);

  useEffect(() => {
    let widgetId;
    let cancelado = false;

    cargarTurnstile()
      .then((turnstile) => {
        if (cancelado || !contenedorRef.current) return;
        widgetId = turnstile.render(contenedorRef.current, {
          sitekey,
          language: 'es',
          theme: document.body.classList.contains('dark-mode') ? 'dark' : 'light',
          callback: (token) => onToken(token),
          'expired-callback': () => onToken(''),
          'error-callback': () => onToken('')
        });
        if (reiniciarRef) reiniciarRef.current = () => turnstile.reset(widgetId);
      })
      .catch(() => onToken(''));

    return () => {
      cancelado = true;
      if (widgetId !== undefined) window.turnstile?.remove(widgetId);
    };
  }, [sitekey, onToken, reiniciarRef]);

  return <div ref={contenedorRef} className="form-turnstile" />;
};

export default Turnstile;
