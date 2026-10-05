/**
 * La conversación se conserva en sessionStorage mientras la pestaña esté
 * abierta (se puede recargar o navegar sin perderla) y se borra al cerrarla.
 * Lo guardado se puede manipular desde el navegador: al leerlo solo se acepta
 * lo que tiene la forma esperada.
 */
import { CONTACTO } from '../../config/agenda';
import { CLAVE_CONVERSACION, SERVICIOS, TEMAS } from '../../config/nebulina';
import { esOpcionDePerfil, esTemaDeInteres } from './motor';

const VERSION = 1;
const MAX_MENSAJES = 40;
const MAX_TEMAS = 10;
const MAX_OFERTAS = 10;
const OFERTA_RE = /^[a-z_]{1,30}$/;
const MAX_TEXTO = 1200;
const RUTA_RE = /^\/[a-z0-9/-]*(?:\?servicio=[\w%.-]{1,60})?$/i;
const TIPOS_FIJOS = new Set(['whatsapp', 'correo']);

/**
 * nombre y servicio de la conversación, temas de interés consultados, perfil
 * del diagnóstico (y la pregunta pendiente), ofertas comerciales ya hechas y
 * si ya explicó cómo funciona el dictado por voz
 */
export const MEMORIA_INICIAL = {
  nombre: null, servicio: null, temas: [], perfil: {}, diagnostico: null, ofertas: [], avisoVoz: false
};

const texto = (valor, maximo = MAX_TEXTO) => (typeof valor === 'string' ? valor.slice(0, maximo) : '');

const accionValida = (accion) => {
  const etiqueta = texto(accion?.etiqueta, 80);
  if (!etiqueta) return null;
  if (accion.tipo === 'tema') return Object.hasOwn(TEMAS, accion.id ?? '') ? { tipo: 'tema', id: accion.id, etiqueta } : null;
  if (accion.tipo === 'pagina') return RUTA_RE.test(accion.ruta ?? '') ? { tipo: 'pagina', ruta: accion.ruta, etiqueta } : null;
  if (accion.tipo === 'perfil') return esOpcionDePerfil(accion.campo, accion.valor) ? { tipo: 'perfil', campo: accion.campo, valor: accion.valor, etiqueta } : null;
  if (accion.tipo === 'llamar') return { tipo: 'llamar', href: CONTACTO.telefonoEnlace, etiqueta };
  return TIPOS_FIJOS.has(accion.tipo) ? { tipo: accion.tipo, etiqueta } : null;
};

const mensajeValido = (mensaje, indice) => {
  if (!['nebulina', 'visitante'].includes(mensaje?.autor) || !Array.isArray(mensaje.parrafos)) return null;
  const parrafos = mensaje.parrafos.map((parrafo) => texto(parrafo)).filter(Boolean);
  if (parrafos.length === 0) return null;
  const acciones = Array.isArray(mensaje.acciones) ? mensaje.acciones.map(accionValida).filter(Boolean) : [];
  return { id: indice + 1, autor: mensaje.autor, parrafos, acciones };
};

// Solo respuestas que existen en el diagnóstico
const perfilValido = (perfil) =>
  Object.fromEntries(Object.entries(perfil && typeof perfil === 'object' ? perfil : {}).filter(([campo, valor]) => esOpcionDePerfil(campo, valor)));

const memoriaValida = (memoria) => ({
  nombre: texto(memoria?.nombre, 20) || null,
  servicio: typeof memoria?.servicio === 'string' && Object.hasOwn(SERVICIOS, memoria.servicio) ? memoria.servicio : null,
  temas: Array.isArray(memoria?.temas) ? memoria.temas.filter((id) => Object.hasOwn(TEMAS, id)).slice(-MAX_TEMAS) : [],
  perfil: perfilValido(memoria?.perfil),
  // La pregunta pendiente no se restaura: sus botones ya no estarían a la vista
  diagnostico: null,
  ofertas: Array.isArray(memoria?.ofertas) ? memoria.ofertas.filter((id) => typeof id === 'string' && OFERTA_RE.test(id)).slice(-MAX_OFERTAS) : [],
  avisoVoz: memoria?.avisoVoz === true
});

/** @returns {{ mensajes: object[], memoria: object } | null} */
export const cargarConversacion = () => {
  try {
    const guardado = JSON.parse(window.sessionStorage.getItem(CLAVE_CONVERSACION) || 'null');
    if (guardado?.version !== VERSION || !Array.isArray(guardado.mensajes)) return null;
    const mensajes = guardado.mensajes.slice(-MAX_MENSAJES).map(mensajeValido).filter(Boolean);
    return mensajes.length ? { mensajes, memoria: memoriaValida(guardado.memoria) } : null;
  } catch {
    return null;
  }
};

const escribir = (mensajes, memoria) =>
  window.sessionStorage.setItem(CLAVE_CONVERSACION, JSON.stringify({ version: VERSION, mensajes, memoria }));

/**
 * Guarda los últimos mensajes. Si el almacenamiento está lleno, reintenta con
 * la mitad (los más recientes) en vez de perder toda la conversación.
 */
export const guardarConversacion = (mensajes, memoria) => {
  for (let cantidad = MAX_MENSAJES; cantidad >= 1; cantidad = Math.floor(cantidad / 2)) {
    try {
      escribir(mensajes.slice(-cantidad), memoria);
      return true;
    } catch {
      // Lleno: se intenta con menos mensajes; bloqueado: fallará también y se rinde
    }
  }
  return false;
};

export const borrarConversacion = () => {
  try {
    window.sessionStorage.removeItem(CLAVE_CONVERSACION);
  } catch {
    // Almacenamiento bloqueado: no hay nada que borrar
  }
};

/** Agrega un tema de interés a la lista de consultados (sin repetir, los más recientes) */
export const conTema = (temas, tema) => (esTemaDeInteres(tema) && !temas.includes(tema) ? [...temas, tema].slice(-MAX_TEMAS) : temas);

/** Anota una oferta comercial hecha (cierre, venta cruzada...) para no repetirla */
export const conOferta = (ofertas, oferta) => (oferta && !ofertas.includes(oferta) ? [...ofertas, oferta].slice(-MAX_OFERTAS) : ofertas);
