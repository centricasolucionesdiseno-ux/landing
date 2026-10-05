/**
 * Respuestas: arma lo que Nebulina dice (párrafos y botones) a partir de la
 * base de conocimiento, con el contexto de la conversación (servicio, nombre
 * y si estamos en horario de atención).
 */
import { CONTACTO, ZONA_HORARIA } from '../../../config/agenda';
import { INACTIVIDAD, PAGINAS, SERVICIOS, SIN_RESPUESTA, TEMAS } from '../../../config/nebulina';
import { paginaDe, servicioDeTema } from './intenciones';

const HORA_APERTURA = 8;
const HORA_CIERRE = 18;

// ---------- Horario ----------

// Hora y día de la semana en Colombia, sin depender de la zona del visitante
const ahoraEnColombia = (fecha) => {
  const partes = new Intl.DateTimeFormat('en-US', { timeZone: ZONA_HORARIA, hour: 'numeric', hourCycle: 'h23', weekday: 'short' })
    .formatToParts(fecha);
  const valor = (tipo) => partes.find((parte) => parte.type === tipo)?.value;
  return { hora: Number(valor('hour')), diaHabil: !['Sat', 'Sun'].includes(valor('weekday')) };
};

export const enHorario = (fecha = new Date()) => {
  const { hora, diaHabil } = ahoraEnColombia(fecha);
  return diaHabil && hora >= HORA_APERTURA && hora < HORA_CIERRE;
};

const saludoSegunHora = (fecha) => {
  const { hora } = ahoraEnColombia(fecha);
  if (hora < 12) return '¡Buenos días';
  return hora < 19 ? '¡Buenas tardes' : '¡Buenas noches';
};

/** "¡Buenas tardes! Soy Nebulina..." */
export const saludoInicial = (fecha = new Date()) => `${saludoSegunHora(fecha)}! Soy Nebulina, la asistente virtual de Céntrica. 👋`;

const textoHorario = (fecha) =>
  enHorario(fecha)
    ? 'Ahora mismo estamos en horario de atención. ✅'
    : 'En este momento estamos fuera de horario, pero puedes dejar tu mensaje y te respondemos el siguiente día hábil.';

// ---------- Armado ----------

export const etiquetaDe = (id) => TEMAS[id]?.etiqueta ?? id;

export const sugerenciasComoAcciones = (ids) => ids.map((id) => ({ tipo: 'tema', id, etiqueta: etiquetaDe(id) }));

/**
 * Contexto de la conversación: servicio (el último del que se habló o el de
 * la página), nombre del visitante y fecha (para el horario).
 */
export const contextoCompleto = (ruta, { servicio = null, nombre = null, fecha = new Date() } = {}) => ({
  servicio: servicio ?? paginaDe(ruta).servicio ?? null,
  nombre,
  fecha
});

/** Rellena {servicio}, {nombre} y {horario} */
export const completar = (parrafo, { servicio, nombre, fecha }) =>
  parrafo
    .replace('{servicio}', servicio ? ` de ${SERVICIOS[servicio].texto}` : '')
    .replace('{nombre}', nombre ? `, ${nombre}` : '')
    .replace('{horario}', textoHorario(fecha))
    .trim();

// "Agendar" lleva el servicio de la conversación para preseleccionarlo en el formulario
const resolverAccion = (accion, { servicio }) => {
  if (accion.tipo === 'agendar') {
    const consulta = servicio ? `?servicio=${encodeURIComponent(SERVICIOS[servicio].formulario)}` : '';
    return { tipo: 'pagina', ruta: `/contacto${consulta}`, etiqueta: accion.etiqueta };
  }
  if (accion.tipo === 'llamar') return { ...accion, href: CONTACTO.telefonoEnlace };
  return accion;
};

export const resolverAcciones = (acciones, contexto) => acciones.map((accion) => resolverAccion(accion, contexto));

/** ¿Alguno de los botones ya lleva a agendar? */
export const ofreceAgenda = (acciones) => acciones.some((accion) => accion.tipo === 'pagina' && accion.ruta.startsWith('/contacto'));

/**
 * Respuesta a un tema tal como está en la base de conocimiento (o "no
 * entendí" si no existe).
 * @returns {{ parrafos: string[], acciones: object[], tema: string | null, servicio: string | null }}
 */
export const respuestaBase = (tema, ruta, memoria = {}) => {
  const existe = Boolean(TEMAS[tema]);
  const { respuesta, acciones } = existe ? TEMAS[tema] : SIN_RESPUESTA;
  const contexto = contextoCompleto(ruta, { ...memoria, servicio: servicioDeTema(tema) ?? memoria.servicio });
  return {
    parrafos: respuesta.map((parrafo) => completar(parrafo, contexto)),
    acciones: resolverAcciones(acciones, contexto),
    tema: existe ? tema : null,
    servicio: contexto.servicio
  };
};

export const presentacion = (nombre, ruta) => ({
  parrafos: [`¡Mucho gusto, ${nombre}! 😊 ¿En qué te puedo ayudar hoy?`],
  acciones: sugerenciasComoAcciones(paginaDe(ruta).sugerencias),
  tema: null,
  servicio: paginaDe(ruta).servicio ?? null
});

/** Inactividad: 'pregunta' ("¿Sigues por aquí?") o 'despedida' (antes de cerrar el chat) */
export const respuestaInactividad = (tipo, ruta, memoria = {}) => {
  const contexto = contextoCompleto(ruta, memoria);
  const { respuesta, acciones } = INACTIVIDAD[tipo];
  return {
    parrafos: respuesta.map((parrafo) => completar(parrafo, contexto)),
    acciones: resolverAcciones(acciones, contexto),
    tema: null,
    servicio: contexto.servicio,
    inactividad: tipo
  };
};

/** Mensajes de bienvenida: saludo según la hora + contexto de la página + sugerencias */
export const bienvenida = (ruta, fecha = new Date()) => {
  const { contexto, sugerencias, servicio = null } = paginaDe(ruta);
  return {
    parrafos: [saludoInicial(fecha), contexto, '¿En qué te puedo ayudar?'].filter(Boolean),
    acciones: sugerenciasComoAcciones(sugerencias),
    tema: null,
    servicio
  };
};

/** Al cambiar de página con el chat abierto, Nebulina lo nota (si la página tiene contexto) */
export const cambioDePagina = (ruta) => {
  const pagina = PAGINAS[ruta];
  if (!pagina?.contexto) return null;
  return { parrafos: [pagina.contexto], acciones: sugerenciasComoAcciones(pagina.sugerencias), tema: null, servicio: pagina.servicio ?? null };
};

/** Pausa de "escribiendo..." proporcional al largo de la respuesta (se siente natural) */
export const pausaEscribiendo = (parrafos, reducirMovimiento = false) => {
  if (reducirMovimiento) return 150;
  const caracteres = parrafos.join(' ').length;
  return Math.min(1600, 450 + caracteres * 4);
};
