/**
 * Ajustes de Nebulina que necesita la burbuja flotante (carga inicial de todas
 * las páginas): por eso no importa nada de la base de conocimiento.
 */

// Backend PHP en el mismo hosting (public/api/nebulina). Se puede cambiar en .env
export const NEBULINA_ENDPOINT = import.meta.env.VITE_NEBULINA_ENDPOINT || '/api/nebulina/mensaje.php';

// Almacenamiento de sesión (se borra al cerrar la pestaña; ver Política de Cookies)
export const CLAVE_RECORRIDO = 'nebulina-recorrido';
export const CLAVE_CONVERSACION = 'nebulina-conversacion';
// Almacenamiento local: si el visitante pidió que Nebulina lea sus respuestas en voz alta
export const CLAVE_VOZ = 'nebulina-voz';
// Versiones anteriores guardaban aquí si ya se había mostrado el saludo
export const CLAVE_SALUDO_ANTERIOR = 'nebulina-saludo';

/**
 * Inactividad: si tras una respuesta el visitante no escribe ni toca nada,
 * Nebulina pregunta si sigue ahí; si tampoco responde, se despide y cierra
 * el chat (la conversación queda guardada para cuando lo vuelva a abrir).
 */
export const SEGUNDOS_PREGUNTAR_SI_SIGUE = 60;
export const SEGUNDOS_CERRAR_SIN_RESPUESTA = 45;
