/**
 * Comprensión del texto: normaliza lo que escribe o dicta el visitante (sin
 * importar tildes, mayúsculas ni signos), corrige lo que el dictado por voz
 * suele transcribir mal, quita muletillas y compara frases tolerando errores
 * de escritura, plurales y confusiones de sonido (b/v, s/z/c, h muda, ll/y).
 */
export const MAX_TEXTO = 500;
// Una coincidencia aproximada ("facturasion") vale menos que una exacta
const PESO_APROXIMADO = 0.8;

// Lo que el dictado por voz suele escribir mal ("sí covi", "e r p", "guasap")
const ALIAS = [
  [/\b(?:si|ci) ?co ?[bv]i\b/g, 'sicovi'],
  [/\b(?:e r p|erepe)\b/g, 'erp'],
  [/\b(?:i a|a i|ai)\b/g, 'ia'],
  [/\b(?:guasap|wasap|watsap|whatsap|whats app|guasa|wasa)\b/g, 'whatsapp'],
  [/\bq a\b/g, 'qa']
];
// Muletillas de la conversación hablada: no cambian lo que se pregunta
const MULETILLAS = /\b(?:eh+|em+|mm+|este|pues|o sea|bueno|oye|oiga|mira|vea|aja)\b/g;

/** "¿Cuánto CUESTA Nebula?" -> "cuanto cuesta nebula"; "eh qué es sí covi" -> "que es sicovi" */
export const normalizar = (texto) => {
  let limpio = texto
    .slice(0, MAX_TEXTO)
    .toLowerCase()
    .normalize('NFD')
    .replaceAll(/[̀-ͯ]/g, '')
    .replaceAll(/[^a-z0-9]+/g, ' ');
  for (const [patron, reemplazo] of ALIAS) limpio = limpio.replaceAll(patron, reemplazo);
  return limpio.replaceAll(MULETILLAS, ' ').replaceAll(/\s+/g, ' ').trim();
};

/**
 * Clave fonética: como suena en español ("sicobi" = "sicovi", "nevula" =
 * "nebula", "aser" = "hacer"). Sirve para voz y para errores de ortografía.
 */
const fonetica = (palabra) =>
  palabra
    .replaceAll('ch', '#')
    .replaceAll('h', '')
    .replaceAll('#', 'ch')
    .replaceAll('qu', 'k')
    .replaceAll(/c(?=[ei])/g, 's')
    .replaceAll(/c(?!h)/g, 'k')
    .replaceAll('z', 's')
    .replaceAll('v', 'b')
    .replaceAll('ll', 'y')
    .replaceAll(/(.)\1+/g, '$1');

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

const igualOSimilar = (token, palabra) =>
  token === palabra || palabraSimilar(token, palabra) || (palabra.length >= 4 && palabraSimilar(fonetica(token), fonetica(palabra)));

// La frase aparece en el texto con todas sus palabras seguidas, aunque tengan errores
const fraseAproximada = (tokens, palabras) =>
  tokens.some((_, inicio) => palabras.every((palabra, k) => tokens[inicio + k] !== undefined && igualOSimilar(tokens[inicio + k], palabra)));

/** Puntos de una frase: exacta (palabras enteras) vale más que aproximada */
export const puntosFrase = (texto, tokens, frase) => {
  const palabras = frase.split(' ');
  if (` ${texto} `.includes(` ${frase} `)) return palabras.length;
  return fraseAproximada(tokens, palabras) ? palabras.length * PESO_APROXIMADO : 0;
};

/** Puntos de una lista de frases sobre un texto ya normalizado */
export const puntosFrases = (texto, tokens, frases) => frases.reduce((total, frase) => total + puntosFrase(texto, tokens, frase), 0);
