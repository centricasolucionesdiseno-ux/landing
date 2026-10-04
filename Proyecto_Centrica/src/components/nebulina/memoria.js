/**
 * La conversación se conserva en sessionStorage mientras la pestaña esté
 * abierta (se puede recargar o navegar sin perderla) y se borra al cerrarla.
 * Lo guardado se puede manipular desde el navegador: al leerlo solo se acepta
 * lo que tiene la forma esperada.
 */
import { CONTACTO } from '../../config/agenda';
import { CLAVE_CONVERSACION, SERVICIOS, TEMAS } from '../../config/nebulina';
import { esTemaDeInteres } from './motor';

const VERSION = 1;
const MAX_MENSAJES = 40;
const MAX_TEMAS = 10;
const MAX_TEXTO = 1200;
const RUTA_RE = /^\/[a-z0-9/-]*(?:\?servicio=[\w%.-]{1,60})?$/i;
const TIPOS_FIJOS = new Set(['whatsapp', 'correo']);

export const MEMORIA_INICIAL = { nombre: null, servicio: null, temas: [] };

const texto = (valor, maximo = MAX_TEXTO) => (typeof valor === 'string' ? valor.slice(0, maximo) : '');

const accionValida = (accion) => {
  const etiqueta = texto(accion?.etiqueta, 80);
  if (!etiqueta) return null;
  if (accion.tipo === 'tema') return TEMAS[accion.id] ? { tipo: 'tema', id: accion.id, etiqueta } : null;
  if (accion.tipo === 'pagina') return RUTA_RE.test(accion.ruta ?? '') ? { tipo: 'pagina', ruta: accion.ruta, etiqueta } : null;
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

const memoriaValida = (memoria) => ({
  nombre: texto(memoria?.nombre, 20) || null,
  servicio: typeof memoria?.servicio === 'string' && SERVICIOS[memoria.servicio] ? memoria.servicio : null,
  temas: Array.isArray(memoria?.temas) ? memoria.temas.filter((id) => TEMAS[id]).slice(-MAX_TEMAS) : []
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

export const guardarConversacion = (mensajes, memoria) => {
  try {
    const datos = { version: VERSION, mensajes: mensajes.slice(-MAX_MENSAJES), memoria };
    window.sessionStorage.setItem(CLAVE_CONVERSACION, JSON.stringify(datos));
  } catch {
    // Almacenamiento lleno o bloqueado: la conversación sigue, solo no se conserva al recargar
  }
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
