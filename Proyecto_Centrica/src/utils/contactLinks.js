import { CONTACTO } from '../config/agenda';

// Solo estos destinos externos: nada del enlace depende de datos sin codificar
const WHATSAPP_URL = 'https://wa.me/';
const GMAIL_URL = 'https://mail.google.com/mail/';

// Gmail/WhatsApp Web y los clientes de correo aceptan URLs de ~2.000 caracteres
const MAX_CUERPO = 1200;

/** Computador (mouse): Gmail web. Celular/tablet: app de correo. Ver useMediaQuery. */
export const CONSULTA_COMPUTADOR = '(hover: hover) and (pointer: fine)';

const recortar = (texto = '') => (texto.length > MAX_CUERPO ? `${texto.slice(0, MAX_CUERPO)}…` : texto);

/** Enlace de WhatsApp (app en el celular, WhatsApp Web/escritorio en el computador). */
export const enlaceWhatsApp = (mensaje = CONTACTO.mensajeWhatsApp) =>
  `${WHATSAPP_URL}${CONTACTO.whatsapp}?text=${encodeURIComponent(recortar(mensaje))}`;

/**
 * Enlace para escribir un correo. En computador abre la ventana de redactar
 * de Gmail en una pestaña nueva; en celular usa mailto: (app de correo).
 * Devuelve { href, externo } para decidir target/rel en el <a>.
 */
export const enlaceCorreo = ({ para = CONTACTO.correo, asunto = '', cuerpo = '', computador = false } = {}) => {
  if (computador) {
    const params = new URLSearchParams({ view: 'cm', fs: '1', to: para });
    if (asunto) params.set('su', asunto);
    if (cuerpo) params.set('body', recortar(cuerpo));
    return { href: `${GMAIL_URL}?${params}`, externo: true };
  }
  // mailto: necesita %20 (no "+") para los espacios: encodeURIComponent
  const partes = [
    asunto && `subject=${encodeURIComponent(asunto)}`,
    cuerpo && `body=${encodeURIComponent(recortar(cuerpo))}`
  ].filter(Boolean);
  const consulta = partes.length ? `?${partes.join('&')}` : '';
  return { href: `mailto:${para}${consulta}`, externo: false };
};

/** Atributos seguros para enlaces que abren otra pestaña (evita tabnabbing y fuga de referer). */
export const PESTANA_NUEVA = { target: '_blank', rel: 'noopener noreferrer' };
