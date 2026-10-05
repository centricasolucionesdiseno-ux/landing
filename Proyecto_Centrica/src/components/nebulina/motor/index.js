/**
 * Motor de conversación de Nebulina: funciones puras (sin React) que deciden
 * qué responder. Se divide en piezas:
 * - texto.js: normaliza y compara frases (tildes, errores de escritura, plurales)
 * - intenciones.js: qué tema pidió el visitante, su nombre y su interés
 * - respuestas.js: arma párrafos y botones con el contexto de la conversación
 * - ventas.js: diagnóstico, venta cruzada, cierre suave y recorrido
 */
import { TEMA_DIAGNOSTICO, TEMAS } from '../../../config/nebulina';
import { detectarNombre, NOMBRE_RE, rankingDeTemas, segundaPregunta, servicioDeTema, servicioMencionado } from './intenciones';
import { presentacion, respuestaBase } from './respuestas';
import { conVentas, iniciarDiagnostico, perfilEscrito, respuestaPerfil } from './ventas';

export { normalizar } from './texto';
export { buscarTema, detectarNombre, esTemaDeInteres, paginaDe, servicioDeTema } from './intenciones';
export { bienvenida, cambioDePagina, enHorario, etiquetaDe, pausaEscribiendo, respuestaInactividad, saludoInicial } from './respuestas';
export { comentarioDePagina, esOpcionDePerfil, etiquetaDePerfil, recomendacionPara, respuestaPerfil } from './ventas';

/**
 * Respuesta a un tema, con la oportunidad comercial que corresponda.
 * @returns {{ parrafos: string[], acciones: object[], tema: string | null, servicio: string | null, oferta?: string, perfil?: object, diagnostico?: string | null }}
 */
export const respuestaDeTema = (tema, ruta, memoria = {}) => {
  const base = respuestaBase(tema, ruta, memoria);
  return tema === TEMA_DIAGNOSTICO ? iniciarDiagnostico(base) : conVentas(base, ruta, memoria);
};

// "También: ¿Cuánto cuesta?" al inicio de los botones, si no estaba ya
const conSegundaPregunta = (respuesta, id) => {
  if (!id || respuesta.acciones.some((accion) => accion.id === id)) return respuesta;
  return { ...respuesta, acciones: [{ tipo: 'tema', id, etiqueta: `También: ${TEMAS[id].etiqueta}` }, ...respuesta.acciones] };
};

/**
 * Responde a lo que escribió o dictó el visitante:
 * - si hay una pregunta del diagnóstico pendiente y la respondió con sus
 *   palabras, sigue con el diagnóstico
 * - si nombra un servicio ("¿cuánto cuesta Nebula?"), la respuesta se adapta
 *   a ese servicio y lo recuerda para agendar
 * - si hace dos preguntas a la vez, responde la principal y ofrece la otra
 * - si se presentó, lo saluda por su nombre
 */
export const responder = (texto, ruta, memoria = {}) => {
  const nombre = detectarNombre(texto) ?? memoria.nombre ?? null;
  const sinNombre = texto.replace(NOMBRE_RE, '');
  const opcion = perfilEscrito(sinNombre, memoria);
  if (opcion) return { ...respuestaPerfil(opcion.campo, opcion.valor, ruta, { ...memoria, nombre }), nombre };
  const temas = rankingDeTemas(sinNombre, ruta);
  const tema = temas[0]?.id ?? null;
  if (!tema && nombre && nombre !== memoria.nombre) {
    return { ...presentacion(nombre, ruta), nombre };
  }
  const mencionado = servicioDeTema(tema) ? null : servicioMencionado(sinNombre);
  const contexto = { ...memoria, nombre, servicio: mencionado ?? memoria.servicio };
  const respuesta = conSegundaPregunta(respuestaDeTema(tema, ruta, contexto), segundaPregunta(temas));
  return { ...respuesta, nombre, servicioElegido: respuesta.servicioElegido ?? mencionado ?? undefined };
};
