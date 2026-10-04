/**
 * Motor de conversación de Nebulina: funciones puras (sin React) que deciden
 * qué responder. Entiende lo que escribe el visitante por palabras clave, sin
 * importar tildes, mayúsculas ni signos, tolera errores de escritura y
 * plurales, y recuerda el servicio del que se está hablando y el nombre.
 */
import { CONTACTO, ZONA_HORARIA } from '../../config/agenda';
import { ETIQUETAS, INACTIVIDAD, PAGINAS, PAGINA_POR_DEFECTO, SERVICIOS, SIN_RESPUESTA, TEMAS } from '../../config/nebulina';

const HORA_APERTURA = 8;
const HORA_CIERRE = 18;
const MAX_TEXTO = 500;
// Una coincidencia aproximada ("facturasion") vale menos que una exacta
const PESO_APROXIMADO = 0.8;
// Desempates: un subtema ("nebula_dian") pesa más que su tema general, y ambos
// más si la página actual los sugiere
const PESO_ESPECIFICO = 0.3;
const PESO_PAGINA = 0.2;
// Saludos, agradecimientos y similares solo ganan si no hay una pregunta concreta
const PESO_CONVERSACION = 0.6;
const TEMAS_CONVERSACION = new Set(['saludo', 'como_estas', 'gracias', 'despedida', 'menu', 'sigo_aqui']);
// Temas que no dicen nada del interés comercial del visitante (no van en el aviso al gerente)
const TEMAS_SIN_INTERES = new Set([...TEMAS_CONVERSACION, 'nebulina', 'capacidades', 'ingles', 'respeto', 'telefono', 'horario']);

/** "¿Cuánto CUESTA Nebula?" -> "cuanto cuesta nebula" */
export const normalizar = (texto) =>
  texto
    .slice(0, MAX_TEXTO)
    .toLowerCase()
    .normalize('NFD')
    .replaceAll(/[̀-ͯ]/g, '')
    .replaceAll(/[^a-z0-9]+/g, ' ')
    .trim();

export const paginaDe = (ruta) => PAGINAS[ruta] ?? PAGINA_POR_DEFECTO;

// ---------- Coincidencias ----------

/**
 * Distancia de edición (Damerau-Levenshtein restringida): letras de más, de
 * menos, cambiadas o intercambiadas ("nomnia" -> "nomina") cuentan como 1.
 * Deja de calcular en cuanto supera el máximo.
 */
const distancia = (a, b, maximo) => {
  if (Math.abs(a.length - b.length) > maximo) return maximo + 1;
  let antepenultima = [];
  let anterior = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const actual = [i];
    for (let j = 1; j <= b.length; j++) {
      const costo = a[i - 1] === b[j - 1] ? 0 : 1;
      actual[j] = Math.min(anterior[j] + 1, actual[j - 1] + 1, anterior[j - 1] + costo);
      const intercambio = i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1];
      if (intercambio) actual[j] = Math.min(actual[j], antepenultima[j - 2] + 1);
    }
    if (Math.min(...actual) > maximo) return maximo + 1;
    antepenultima = anterior;
    anterior = actual;
  }
  return anterior[b.length];
};

// Errores tolerados según el largo de la palabra: ninguno en las cortas ("ia", "app")
const toleranciaPara = (palabra) => {
  if (palabra.length >= 10) return 2;
  return palabra.length >= 5 ? 1 : 0;
};

// "precios" coincide con "precio"; "facturasion" con "facturacion"
const palabraSimilar = (token, palabra) => {
  if (token === `${palabra}s` || token === `${palabra}es`) return true;
  const tolerancia = toleranciaPara(palabra);
  return tolerancia > 0 && distancia(token, palabra, tolerancia) <= tolerancia;
};

const igualOSimilar = (token, palabra) => token === palabra || palabraSimilar(token, palabra);

// La frase aparece en el texto con todas sus palabras seguidas, aunque tengan errores
const fraseAproximada = (tokens, palabras) =>
  tokens.some((_, inicio) => palabras.every((palabra, k) => tokens[inicio + k] !== undefined && igualOSimilar(tokens[inicio + k], palabra)));

/** Puntos de una frase: exacta (palabras enteras) vale más que aproximada */
const puntosFrase = (texto, tokens, frase) => {
  const palabras = frase.split(' ');
  if (` ${texto} `.includes(` ${frase} `)) return palabras.length;
  return fraseAproximada(tokens, palabras) ? palabras.length * PESO_APROXIMADO : 0;
};

const puntaje = (texto, tokens, id, sugerencias) => {
  const base = TEMAS[id].palabras.reduce((total, frase) => total + puntosFrase(texto, tokens, frase), 0);
  if (base === 0) return 0;
  const ponderado = TEMAS_CONVERSACION.has(id) ? base * PESO_CONVERSACION : base;
  return ponderado + (id.includes('_') ? PESO_ESPECIFICO : 0) + (sugerencias.includes(id) ? PESO_PAGINA : 0);
};

/** Id del tema que mejor responde al texto, o null si ninguno aplica */
export const buscarTema = (texto, ruta) => {
  const normalizado = normalizar(texto);
  if (!normalizado) return null;
  const tokens = normalizado.split(' ');
  const { sugerencias } = paginaDe(ruta);
  let mejor = null;
  let mejorPuntaje = 0;
  for (const id of Object.keys(TEMAS)) {
    const valor = puntaje(normalizado, tokens, id, sugerencias);
    if (valor > mejorPuntaje) {
      mejor = id;
      mejorPuntaje = valor;
    }
  }
  return mejor;
};

// ---------- Memoria de la conversación ----------

/** ¿El tema muestra un interés del visitante? (los saludos o el horario no) */
export const esTemaDeInteres = (tema) => Boolean(TEMAS[tema]) && !TEMAS_SIN_INTERES.has(tema);

/** Servicio al que pertenece un tema: "nebula_dian" -> "nebula" */
export const servicioDeTema = (tema) => {
  const clave = tema?.split('_')[0];
  return SERVICIOS[clave] ? clave : null;
};

const NOMBRE_RE = /(?:me llamo|mi nombre es)\s+([a-záéíóúñü]{2,20})/i;
// "me llamo la atención": palabras que no son nombres
const NO_NOMBRES = new Set(['la', 'el', 'lo', 'un', 'una', 'muy', 'mucho', 'asi', 'como']);

/** "Hola, me llamo ana" -> "Ana" (o null) */
export const detectarNombre = (texto) => {
  const nombre = NOMBRE_RE.exec(texto.slice(0, MAX_TEXTO))?.[1]?.toLowerCase();
  if (!nombre || NO_NOMBRES.has(nombre)) return null;
  return nombre.charAt(0).toUpperCase() + nombre.slice(1);
};

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

const textoHorario = (fecha) =>
  enHorario(fecha)
    ? 'Ahora mismo estamos en horario de atención. ✅'
    : 'En este momento estamos fuera de horario, pero puedes dejar tu mensaje y te respondemos el siguiente día hábil.';

// ---------- Respuestas ----------

export const etiquetaDe = (id) => ETIQUETAS[id] ?? id;

const sugerenciasComoAcciones = (ids) => ids.map((id) => ({ tipo: 'tema', id, etiqueta: etiquetaDe(id) }));

/**
 * Contexto de la conversación: servicio (el último del que se habló o el de
 * la página), nombre del visitante y fecha (para el horario).
 */
const contextoCompleto = (ruta, { servicio = null, nombre = null, fecha = new Date() } = {}) => ({
  servicio: servicio ?? paginaDe(ruta).servicio ?? null,
  nombre,
  fecha
});

// Rellena {servicio}, {nombre} y {horario}
const completar = (parrafo, { servicio, nombre, fecha }) =>
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

/**
 * Respuesta a un tema (o "no entendí" si no existe).
 * @returns {{ parrafos: string[], acciones: object[], tema: string | null, servicio: string | null }}
 */
export const respuestaDeTema = (tema, ruta, memoria = {}) => {
  const existe = Boolean(TEMAS[tema]);
  const { respuesta, acciones } = existe ? TEMAS[tema] : SIN_RESPUESTA;
  const contexto = contextoCompleto(ruta, { ...memoria, servicio: servicioDeTema(tema) ?? memoria.servicio });
  return {
    parrafos: respuesta.map((parrafo) => completar(parrafo, contexto)),
    acciones: acciones.map((accion) => resolverAccion(accion, contexto)),
    tema: existe ? tema : null,
    servicio: contexto.servicio
  };
};

/** Responde a lo que escribió el visitante. Si se presentó, lo saluda por su nombre. */
export const responder = (texto, ruta, memoria = {}) => {
  const nombre = detectarNombre(texto) ?? memoria.nombre ?? null;
  const tema = buscarTema(texto.replace(NOMBRE_RE, ''), ruta);
  if (!tema && nombre && nombre !== memoria.nombre) {
    return { ...presentacion(nombre, ruta), nombre };
  }
  return { ...respuestaDeTema(tema, ruta, { ...memoria, nombre }), nombre };
};

const presentacion = (nombre, ruta) => ({
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
    acciones: acciones.map((accion) => resolverAccion(accion, contexto)),
    tema: null,
    servicio: contexto.servicio,
    inactividad: tipo
  };
};

/** Mensajes de bienvenida: saludo según la hora + contexto de la página + sugerencias */
export const bienvenida = (ruta, fecha = new Date()) => {
  const { contexto, sugerencias, servicio = null } = paginaDe(ruta);
  return {
    parrafos: [`${saludoSegunHora(fecha)}! Soy Nebulina, la asistente virtual de Céntrica. 👋`, contexto, '¿En qué te puedo ayudar?'].filter(Boolean),
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
