/**
 * Intenciones: qué quiere el visitante (el tema que mejor responde a lo que
 * escribió), si se presentó y qué tanto interés comercial muestra.
 */
import { PAGINAS, PAGINA_POR_DEFECTO, SERVICIOS, TEMAS } from '../../../config/nebulina';
import { MAX_TEXTO, normalizar, puntosFrases } from './texto';

// Desempates: un subtema ("nebula_dian") pesa más que su tema general, y ambos
// más si la página actual los sugiere
const PESO_ESPECIFICO = 0.3;
// El nombre de un servicio dicho tal cual ("IA", "SICOVI") es una señal fuerte
const PESO_SERVICIO = 0.3;
const PESO_PAGINA = 0.2;
// Saludos, agradecimientos y similares solo ganan si no hay una pregunta concreta
const PESO_CONVERSACION = 0.6;
const TEMAS_CONVERSACION = new Set(['saludo', 'como_estas', 'gracias', 'despedida', 'menu', 'sigo_aqui']);
// Temas que no dicen nada del interés comercial del visitante (no van en el aviso al gerente)
// Lo que se quiere hacer pesa más que el tema del que se habla: en "¿cuánto
// cuesta Nebula?" la intención es el precio y Nebula es el contexto. Solo con
// palabras exactas ("valores" no es "valor", "pasos" no es "plazos")
const PESO_INTENCION = 0.5;
const TEMAS_INTENCION = new Set(['precio', 'tiempos', 'demo', 'agendar', 'telefono', 'humano', 'soporte', 'horario', 'ubicacion']);
// Temas generales: ceden ante uno concreto ("¿qué hacen con IA?" es sobre IA)
const PESO_GENERAL = 0.5;
const TEMAS_GENERALES = new Set(['servicios', 'empresa', 'menu']);
// Una segunda pregunta en el mismo mensaje se ofrece como botón si tiene al menos este puntaje
const PUNTAJE_SEGUNDA = 1;
const TEMAS_CONVERSACION_O_GENERALES = (id) => TEMAS_CONVERSACION.has(id) || TEMAS_GENERALES.has(id);
const TEMAS_SIN_INTERES = new Set([...TEMAS_CONVERSACION, 'nebulina', 'capacidades', 'ingles', 'respeto', 'telefono', 'horario', 'diagnostico', 'voz']);

export const paginaDe = (ruta) => PAGINAS[ruta] ?? PAGINA_POR_DEFECTO;

/** Opciones (de un conjunto { id: { palabras } }) con puntos, de mayor a menor */
export const ranking = (texto, opciones, extra = () => 0) => {
  const normalizado = normalizar(texto);
  if (!normalizado) return [];
  const tokens = normalizado.split(' ');
  const resultado = [];
  for (const [id, { palabras }] of Object.entries(opciones)) {
    const base = puntosFrases(normalizado, tokens, palabras);
    if (base > 0) resultado.push({ id, puntos: base + extra(id, base) });
  }
  // Estable: a igual puntaje gana el que aparece primero en la base de conocimiento
  return resultado.sort((a, b) => b.puntos - a.puntos);
};

/** Opción con más puntos para el texto, o null */
export const mejorCoincidencia = (texto, opciones, extra) => ranking(texto, opciones, extra)[0]?.id ?? null;

const ajusteTema = (sugerencias) => (id, base) => {
  const servicio = servicioDeTema(id);
  let ajuste = 0;
  if (servicio) ajuste += id === servicio ? PESO_SERVICIO : PESO_ESPECIFICO;
  if (sugerencias.includes(id)) ajuste += PESO_PAGINA;
  if (TEMAS_CONVERSACION.has(id)) ajuste -= base * (1 - PESO_CONVERSACION);
  if (TEMAS_GENERALES.has(id)) ajuste -= base * (1 - PESO_GENERAL);
  if (TEMAS_INTENCION.has(id) && Number.isInteger(base)) ajuste += PESO_INTENCION;
  return ajuste;
};

// "¿Es confiable la inteligencia artificial?": si se nombra un servicio y un
// subtema suyo, el servicio refuerza al subtema en vez de competir con él
const reforzarSubtemas = (lista) => {
  const puntosPorId = Object.fromEntries(lista.map(({ id, puntos }) => [id, puntos]));
  return lista
    .map(({ id, puntos }) => {
      const servicio = servicioDeTema(id);
      const reforzado = servicio && servicio !== id && puntosPorId[servicio] ? puntos + puntosPorId[servicio] : puntos;
      return { id, puntos: reforzado };
    })
    .sort((a, b) => b.puntos - a.puntos);
};

/** Temas que responden al texto, de mejor a peor */
export const rankingDeTemas = (texto, ruta) => reforzarSubtemas(ranking(texto, TEMAS, ajusteTema(paginaDe(ruta).sugerencias)));

/** Id del tema que mejor responde al texto, o null si ninguno aplica */
export const buscarTema = (texto, ruta) => rankingDeTemas(texto, ruta)[0]?.id ?? null;

/**
 * Otra pregunta en el mismo mensaje ("¿qué es SICOVI y cuánto cuesta?"): el
 * segundo tema, si es distinto, tiene botón y no es un saludo ni algo general
 */
export const segundaPregunta = (lista) => {
  const [primero, segundo] = lista;
  if (!segundo || segundo.puntos < PUNTAJE_SEGUNDA || TEMAS_CONVERSACION_O_GENERALES(segundo.id) || !TEMAS[segundo.id].etiqueta) return null;
  const mismoServicio = servicioDeTema(primero.id) && servicioDeTema(primero.id) === servicioDeTema(segundo.id);
  return mismoServicio ? null : segundo.id;
};

/** Servicio nombrado en el texto ("¿cuánto cuesta Nebula?" -> "nebula"), aunque el tema sea otro */
export const servicioMencionado = (texto) => {
  const principales = Object.fromEntries(Object.keys(SERVICIOS).filter((id) => TEMAS[id]).map((id) => [id, TEMAS[id]]));
  return mejorCoincidencia(texto, principales);
};

/** ¿El tema muestra un interés del visitante? (los saludos o el horario no) */
export const esTemaDeInteres = (tema) => Boolean(TEMAS[tema]) && !TEMAS_SIN_INTERES.has(tema);

/** Servicio al que pertenece un tema: "nebula_dian" -> "nebula" */
export const servicioDeTema = (tema) => {
  const clave = tema?.split('_')[0];
  return SERVICIOS[clave] ? clave : null;
};

export const NOMBRE_RE = /(?:me llamo|mi nombre es)\s+([a-záéíóúñü]{2,20})/i;
// "me llamo la atención": palabras que no son nombres
const NO_NOMBRES = new Set(['la', 'el', 'lo', 'un', 'una', 'muy', 'mucho', 'asi', 'como']);

/** "Hola, me llamo ana" -> "Ana" (o null) */
export const detectarNombre = (texto) => {
  const nombre = NOMBRE_RE.exec(texto.slice(0, MAX_TEXTO))?.[1]?.toLowerCase();
  if (!nombre || NO_NOMBRES.has(nombre)) return null;
  return nombre.charAt(0).toUpperCase() + nombre.slice(1);
};
