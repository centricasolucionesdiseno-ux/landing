/**
 * Base de conocimiento de Nebulina, la asistente guiada del sitio. Cada área
 * vive en su propio archivo de temas/ y aquí se reúnen.
 *
 * Un tema es { etiqueta?, palabras, respuesta, acciones }:
 * - `palabras`: frases que lo activan, en minúsculas y sin tildes (el motor
 *   normaliza lo que escribe el visitante y tolera errores de escritura y
 *   plurales). Las frases largas pesan más; gana el tema con más puntos.
 * - `respuesta`: párrafos, con marcadores {servicio} (servicio de la
 *   conversación), {nombre} (", Ana" si el visitante dijo su nombre) y
 *   {horario} (si estamos atendiendo ahora).
 * - `etiqueta`: texto del botón cuando se sugiere (obligatoria si el tema
 *   aparece en PAGINAS).
 *
 * Reglas de negocio: solo habla de Céntrica, nunca da precios ni plazos
 * cerrados (todo se cotiza según el alcance) y siempre ofrece hablar con el
 * gerente.
 *
 * Para agregar un tema: crearlo en el archivo de su área (o en uno nuevo y
 * sumarlo abajo) y, si aplica, sugerirlo en paginas.js. `validarConocimiento`
 * revisa que todo lo referenciado exista: en desarrollo avisa en la consola y
 * en el build lo detiene.
 */
import { TEMAS_CONVERSACION } from './temas/conversacion';
import { TEMAS_EMPRESA } from './temas/empresa';
import { TEMAS_FABRICA } from './temas/fabrica';
import { TEMAS_NEBULA } from './temas/nebula';
import { TEMAS_SICOVI } from './temas/sicovi';
import { TEMAS_IA } from './temas/ia';
import { TEMAS_CALIDAD } from './temas/calidad';
import { TEMAS_CONSULTORIA } from './temas/consultoria';
import { TEMAS_COMERCIAL } from './temas/comercial';
import { TEMAS_VENTAS } from './temas/ventas';

const AREAS = [
  TEMAS_CONVERSACION, TEMAS_EMPRESA, TEMAS_FABRICA, TEMAS_NEBULA, TEMAS_SICOVI,
  TEMAS_IA, TEMAS_CALIDAD, TEMAS_CONSULTORIA, TEMAS_COMERCIAL, TEMAS_VENTAS
];

export const TEMAS = Object.freeze(Object.assign({}, ...AREAS));

/** Cuántos temas define cada área en total (para detectar ids repetidos entre áreas) */
export const TOTAL_TEMAS_DEFINIDOS = AREAS.reduce((total, area) => total + Object.keys(area).length, 0);
