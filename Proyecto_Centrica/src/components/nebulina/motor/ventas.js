/**
 * Asesoría comercial: diagnóstico de 3 preguntas, venta cruzada, cierre suave
 * y propuesta combinada según el recorrido. Cada recurso se ofrece como
 * máximo una vez por conversación (quedan anotados en `memoria.ofertas`).
 */
import {
  CIERRE_SUAVE, ORDEN_PERFIL, PERFIL, RECOMENDACION, RECOMENDACION_PUBLICA, RECORRIDO, SERVICIOS,
  SIGUIENTE_PASO, TEMAS_PARA_VENTA_CRUZADA, VENTA_CRUZADA
} from '../../../config/nebulina';
import { esTemaDeInteres, mejorCoincidencia, servicioDeTema } from './intenciones';
import { cambioDePagina, completar, contextoCompleto, etiquetaDe, ofreceAgenda, resolverAcciones } from './respuestas';

const ACUSES = ['¡Perfecto! 👌', '¡Anotado! ✍️'];
const MAX_BOTONES_EXTRA = 2;

const opcionesDe = (campo) => (Object.hasOwn(PERFIL, campo) ? PERFIL[campo].opciones : {});

/** ¿El valor es una respuesta válida a esa pregunta del diagnóstico? */
export const esOpcionDePerfil = (campo, valor) => typeof campo === 'string' && typeof valor === 'string' && Object.hasOwn(opcionesDe(campo), valor);

export const etiquetaDePerfil = (campo, valor) => (esOpcionDePerfil(campo, valor) ? PERFIL[campo].opciones[valor].etiqueta : '');

const siguienteCampo = (perfil) => ORDEN_PERFIL.find((campo) => !perfil[campo]) ?? null;

const pregunta = (campo) => ({
  parrafo: PERFIL[campo].pregunta,
  acciones: Object.entries(opcionesDe(campo)).map(([valor, { etiqueta }]) => ({ tipo: 'perfil', campo, valor, etiqueta }))
});

/** Añade la primera pregunta del diagnóstico (y lo reinicia si ya se había hecho) */
export const iniciarDiagnostico = (respuesta) => {
  const [campo] = ORDEN_PERFIL;
  const { parrafo, acciones } = pregunta(campo);
  return { ...respuesta, parrafos: [...respuesta.parrafos, parrafo], acciones, perfil: {}, diagnostico: campo };
};

export const recomendacionPara = (perfil) =>
  (perfil.organizacion === 'publica' && RECOMENDACION_PUBLICA[perfil.necesidad]) || RECOMENDACION[perfil.necesidad];

/**
 * Respuesta a una pregunta del diagnóstico: la siguiente pregunta o, al
 * completarlo, la recomendación y el siguiente paso según la urgencia.
 */
export const respuestaPerfil = (campo, valor, ruta, memoria = {}) => {
  if (!esOpcionDePerfil(campo, valor)) return null;
  const perfil = { ...memoria.perfil, [campo]: valor };
  const siguiente = siguienteCampo(perfil);
  if (siguiente) {
    const { parrafo, acciones } = pregunta(siguiente);
    const acuse = ACUSES[ORDEN_PERFIL.indexOf(campo) % ACUSES.length];
    return { parrafos: [acuse, parrafo], acciones, tema: null, servicio: memoria.servicio ?? null, perfil, diagnostico: siguiente };
  }
  const recomendacion = recomendacionPara(perfil);
  const paso = SIGUIENTE_PASO[perfil.urgencia];
  const contexto = contextoCompleto(ruta, { ...memoria, servicio: recomendacion.servicio });
  return {
    parrafos: [completar('¡Gracias{nombre}! Con lo que me contaste:', contexto), recomendacion.texto, paso.texto],
    acciones: [...resolverAcciones(paso.acciones, contexto), { tipo: 'tema', id: recomendacion.tema, etiqueta: etiquetaDe(recomendacion.tema) }],
    tema: null,
    servicio: recomendacion.servicio,
    servicioElegido: recomendacion.servicio,
    perfil,
    diagnostico: null,
    // La recomendación ya invita a la reunión: no se repite el cierre suave
    oferta: 'cierre'
  };
};

/** Si hay una pregunta del diagnóstico pendiente y el visitante escribió la respuesta */
export const perfilEscrito = (texto, memoria = {}) => {
  const campo = memoria.diagnostico;
  if (!campo || !Object.hasOwn(PERFIL, campo)) return null;
  const valor = mejorCoincidencia(texto, opcionesDe(campo));
  return valor ? { campo, valor } : null;
};

const temasConsultados = (memoria, tema) => new Set([...(memoria.temas ?? []), tema].filter(esTemaDeInteres));

// Si la respuesta ya trae el botón de agendar, solo se suma la invitación
const conCierreSuave = (respuesta, contexto) => ({
  ...respuesta,
  parrafos: [...respuesta.parrafos, completar(CIERRE_SUAVE.respuesta, contexto)],
  acciones: ofreceAgenda(respuesta.acciones)
    ? respuesta.acciones
    : [...resolverAcciones(CIERRE_SUAVE.acciones, contexto), ...respuesta.acciones.filter(({ tipo }) => tipo === 'tema').slice(0, MAX_BOTONES_EXTRA)],
  oferta: 'cierre'
});

const conVentaCruzada = (respuesta, servicio) => {
  const { tema, texto } = VENTA_CRUZADA[servicio];
  return {
    ...respuesta,
    parrafos: [...respuesta.parrafos, texto],
    acciones: [...respuesta.acciones, { tipo: 'tema', id: tema, etiqueta: etiquetaDe(tema) }],
    oferta: `cruzada_${servicio}`
  };
};

/**
 * Oportunidad comercial en una respuesta sobre un servicio (una por mensaje):
 * - cierre suave si el visitante ya hizo varias preguntas de interés (prioridad)
 * - venta cruzada si profundizó en un servicio que otro complementa
 */
export const conVentas = (respuesta, ruta, memoria = {}) => {
  const servicio = servicioDeTema(respuesta.tema);
  if (!servicio) return respuesta;
  const ofertas = memoria.ofertas ?? [];
  const consultados = temasConsultados(memoria, respuesta.tema);
  if (!ofertas.includes('cierre') && consultados.size >= CIERRE_SUAVE.temas) {
    return conCierreSuave(respuesta, contextoCompleto(ruta, { ...memoria, servicio }));
  }
  const cruzada = VENTA_CRUZADA[servicio];
  const delServicio = [...consultados].filter((tema) => servicioDeTema(tema) === servicio).length;
  const yaLaMuestra = respuesta.acciones.some(({ id }) => id === cruzada?.tema);
  if (cruzada && !ofertas.includes(`cruzada_${servicio}`) && delServicio >= TEMAS_PARA_VENTA_CRUZADA && !yaLaMuestra) {
    return conVentaCruzada(respuesta, servicio);
  }
  return respuesta;
};

// ["a", "b", "c"] -> "a, b y c"
const enLista = (textos) => (textos.length > 1 ? `${textos.slice(0, -1).join(', ')} y ${textos.at(-1)}` : textos[0]);

/**
 * Comentario al cambiar de página con el chat abierto. Si el visitante ya
 * revisó otros servicios, propone integrarlos en una sola propuesta.
 */
export const comentarioDePagina = (ruta, memoria = {}, serviciosVisitados = []) => {
  const comentario = cambioDePagina(ruta);
  const servicio = comentario?.servicio;
  if (!servicio || (memoria.ofertas ?? []).includes('recorrido')) return comentario;
  const otros = serviciosVisitados.filter((id) => id !== servicio && SERVICIOS[id]);
  if (otros.length === 0) return comentario;
  const contexto = contextoCompleto(ruta, { ...memoria, servicio });
  return {
    ...comentario,
    parrafos: [...comentario.parrafos, RECORRIDO.texto.replace('{otros}', enLista(otros.map((id) => SERVICIOS[id].texto)))],
    acciones: [...resolverAcciones(RECORRIDO.acciones, contexto), ...comentario.acciones.slice(0, MAX_BOTONES_EXTRA)],
    oferta: 'recorrido'
  };
};
