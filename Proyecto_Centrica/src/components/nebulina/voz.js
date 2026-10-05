/**
 * Voz de Nebulina con las capacidades del propio navegador (Web Speech API),
 * sin servicios ni claves de Céntrica.
 *
 * Dictado: el navegador convierte la voz en texto (si puede, en el propio
 * equipo; Chrome, Edge y Safari pueden procesar el audio en los servidores de
 * su fabricante; ver Política de Privacidad). Céntrica nunca recibe el audio.
 * Donde el navegador no trae dictado (Firefox) o lo tiene bloqueado (Opera,
 * Brave), Nebulina explica cómo dictar con el teclado del sistema: así se le
 * puede hablar desde cualquier navegador.
 *
 * Lectura en voz alta: la voz más natural disponible (neuronales de Edge,
 * de Google en Chrome, mejoradas de Apple), femenina y latina si existe. Las
 * voces robóticas (eSpeak) se descartan: si es lo único que hay, no se ofrece.
 */
import { CLAVE_VOZ } from '../../config/nebulina/ajustes';

const IDIOMA = 'es-CO';
const MAX_LECTURA = 600;

const enNavegador = () => typeof window !== 'undefined';
const Reconocimiento = () => (enNavegador() ? window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null : null);
const sintesisDisponible = () => enNavegador() && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

export const dictadoDisponible = () => Boolean(Reconocimiento());

// ---------- Dictado ----------

const DICTADO_DEL_SISTEMA = 'Puedes usar el dictado de tu teclado: el micrófono 🎤 del teclado en el celular, Windows + H en Windows o pulsar dos veces Fn en Mac. Te escucho igual. 😊';

export const SIN_DICTADO = `Tu navegador no trae dictado por voz. ${DICTADO_DEL_SISTEMA}`;

const MENSAJES_ERROR = {
  'not-allowed': 'Para hablarme necesito permiso para usar el micrófono. Puedes darlo en el candado de la barra de direcciones. 🎙️',
  'audio-capture': 'No encontré un micrófono disponible. Revisa que esté conectado o escríbeme. 🎙️',
  'no-speech': 'No alcancé a escucharte. Pulsa el micrófono e inténtalo de nuevo. 👂'
};
// Servicio de dictado bloqueado o sin conexión (Opera, Brave, sin internet...)
const ERROR_SERVICIO = `El dictado de tu navegador no está disponible ahora. ${DICTADO_DEL_SISTEMA}`;

// Si el navegador puede reconocer la voz en el dispositivo, mejor: el audio no sale del equipo
const enDispositivo = async (Clase) => {
  try {
    return typeof Clase.available === 'function' && (await Clase.available({ langs: [IDIOMA], processLocally: true })) === 'available';
  } catch {
    return false;
  }
};

// Safari antiguo no permite recorrer los resultados con for...of ni [...lista]
const textoDe = (resultados) => {
  const lista = Array.from({ length: resultados.length }, (_, indice) => resultados[indice]);
  return {
    texto: lista.map((resultado) => resultado[0]?.transcript ?? '').join(' ').replaceAll(/\s+/g, ' ').trim(),
    final: Boolean(lista.at(-1)?.isFinal)
  };
};

/**
 * Escucha una frase. `onParcial` recibe el texto mientras se habla, `onFinal`
 * el definitivo, `onError` un mensaje amable y `onFin` siempre al terminar.
 * @returns {Promise<() => void>} función para dejar de escuchar
 */
export const escuchar = async ({ onParcial, onFinal, onError, onFin }) => {
  const Clase = Reconocimiento();
  if (!Clase) {
    onError(SIN_DICTADO);
    onFin();
    return () => {};
  }
  const reconocimiento = new Clase();
  reconocimiento.lang = IDIOMA;
  reconocimiento.interimResults = true;
  reconocimiento.continuous = false;
  reconocimiento.maxAlternatives = 1;
  if (await enDispositivo(Clase)) reconocimiento.processLocally = true;

  let entregado = false;
  reconocimiento.onresult = (evento) => {
    const { texto, final } = textoDe(evento.results);
    if (!final) {
      onParcial(texto);
      return;
    }
    entregado = true;
    onFinal(texto);
  };
  reconocimiento.onerror = (evento) => {
    if (evento.error !== 'aborted') onError(MENSAJES_ERROR[evento.error] ?? ERROR_SERVICIO);
  };
  reconocimiento.onend = () => {
    if (!entregado) onParcial('');
    onFin();
  };
  reconocimiento.start();
  return () => reconocimiento.abort();
};

// ---------- Lectura en voz alta ----------

// Puntaje de una voz: natural antes que robótica, femenina (Nebulina) y latina
const NATURAL = /natural|neural|online/i;
const GOOGLE = /google/i;
const MEJORADA = /premium|enhanced|mejorad|siri/i;
const ROBOTICA = /espeak|festival|pico|mbrola/i;
const FEMENINA = /salom|dalia|paloma|elvira|paulina|m[oó]nica|marisol|helena|laura|sabina|camila|elena|ximena|lupe|ang[eé]lica|google español/i;
const MASCULINA = /gonzalo|jorge|alonso|[aá]lvaro|pablo|diego|juan|carlos|ra[uú]l|enrique|tom[aá]s/i;
const ACENTO = { 'es-co': 25, 'es-419': 15, 'es-mx': 15, 'es-us': 15, 'es-es': 5 };

const puntaje = (voz) => {
  const nombre = `${voz.name} ${voz.voiceURI}`;
  if (ROBOTICA.test(nombre)) return -1;
  let total = ACENTO[voz.lang?.toLowerCase().replace('_', '-')] ?? 0;
  if (NATURAL.test(nombre)) total += 100;
  else if (GOOGLE.test(nombre)) total += 60;
  else if (MEJORADA.test(nombre)) total += 50;
  else if (voz.localService) total += 10;
  if (FEMENINA.test(nombre)) total += 20;
  if (MASCULINA.test(nombre)) total -= 15;
  return total;
};

/** La voz en español más humana disponible, o null si solo hay voces robóticas */
const mejorVoz = () => {
  if (!sintesisDisponible()) return null;
  let mejor = null;
  let mejorPuntaje = -1;
  for (const voz of window.speechSynthesis.getVoices()) {
    if (!voz.lang?.toLowerCase().startsWith('es')) continue;
    const valor = puntaje(voz);
    if (valor > mejorPuntaje) {
      mejor = voz;
      mejorPuntaje = valor;
    }
  }
  return mejor;
};

export const lecturaDisponible = () => Boolean(mejorVoz());

/** Las voces cargan después de la página: avisa cuando estén listas */
export const alCargarVoces = (callback) => {
  if (!sintesisDisponible()) return () => {};
  window.speechSynthesis.addEventListener?.('voiceschanged', callback);
  return () => window.speechSynthesis.removeEventListener?.('voiceschanged', callback);
};

// Siglas que se leerían mal ("erp" en una sola sílaba)
const PRONUNCIACION = [
  [/\bERP\b/g, 'E R P'],
  [/\bGRP\b/g, 'G R P'],
  [/\bQA\b/g, 'Q A'],
  [/\bNIT\b/g, 'nit'],
  [/\bDIAN\b/g, 'Dian']
];

// Sin emojis ni viñetas: se leen mal en voz alta
const textoParaLeer = (parrafos) => {
  let texto = parrafos.join('. ').replaceAll(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, '').replaceAll('•', '').replaceAll('·', ',');
  for (const [sigla, lectura] of PRONUNCIACION) texto = texto.replaceAll(sigla, lectura);
  return texto.replaceAll(/\s+/g, ' ').replaceAll(/\.\s*\./g, '.').trim().slice(0, MAX_LECTURA);
};

// Frase por frase: pausas naturales y sin el corte de Chrome en textos largos
const frases = (texto) => texto.split(/(?<=[.!?])\s+/).map((frase) => frase.trim()).filter(Boolean);

const decir = (texto, voz) => {
  const frase = new window.SpeechSynthesisUtterance(texto);
  if (voz) {
    frase.voice = voz;
    frase.lang = voz.lang;
  } else {
    frase.lang = IDIOMA;
  }
  // Ritmo conversacional; las voces naturales ya traen su entonación
  const natural = NATURAL.test(voz?.name ?? '');
  frase.rate = natural ? 1 : 0.95;
  frase.pitch = natural ? 1 : 1.08;
  frase.volume = texto ? 1 : 0;
  window.speechSynthesis.speak(frase);
};

/**
 * iPhone/iPad solo dejan hablar si antes hubo un toque del visitante: se
 * llama al pulsar el micrófono o el parlante y así las respuestas (que llegan
 * después) también se pueden leer.
 */
export const prepararLectura = () => {
  try {
    if (sintesisDisponible()) decir('', null);
  } catch {
    // Sin lectura en este navegador
  }
};

/** Lee en voz alta una respuesta (interrumpe la anterior) */
export const leer = (parrafos) => {
  const voz = mejorVoz();
  const texto = textoParaLeer(parrafos);
  if (!voz || !texto) return;
  // La voz es un extra: si el navegador falla al leer, el chat sigue funcionando
  try {
    window.speechSynthesis.cancel();
    // Chrome en Android puede quedar en pausa tras cancelar
    window.speechSynthesis.resume?.();
    for (const parte of frases(texto)) decir(parte, voz);
  } catch {
    // Sin lectura en voz alta para esta respuesta
  }
};

export const callar = () => {
  try {
    if (sintesisDisponible()) window.speechSynthesis.cancel();
  } catch {
    // Nada que callar
  }
};

// ---------- Preferencia (localStorage, como el tema claro/oscuro) ----------

/** ¿El visitante pidió que Nebulina lea sus respuestas? Se recuerda en este equipo */
export const leerPreferencia = () => {
  try {
    return window.localStorage.getItem(CLAVE_VOZ) === '1';
  } catch {
    return false;
  }
};

export const guardarPreferencia = (activa) => {
  try {
    if (activa) window.localStorage.setItem(CLAVE_VOZ, '1');
    else window.localStorage.removeItem(CLAVE_VOZ);
  } catch {
    // Almacenamiento bloqueado: la preferencia dura solo esta visita
  }
};
