/**
 * Recorrido del visitante en esta pestaña (sessionStorage, se borra al
 * cerrarla): qué páginas de servicios visitó y qué invitaciones de Nebulina
 * ya vio. Sirve para invitar con algo concreto sin repetirse ni insistir, y
 * para proponer una solución combinada si revisó varios servicios. No sale
 * del navegador. Al leerlo solo se acepta lo que tiene la forma esperada.
 */
import { CLAVE_RECORRIDO } from '../../config/nebulina/ajustes';
import { INVITACIONES, INVITACION_RECORRIDO, MAX_INVITACIONES } from '../../config/nebulina/proactivo';
import { SERVICIOS, servicioDeRuta } from '../../config/nebulina/servicios';

const VACIO = { servicios: [], invitaciones: [], rechazada: false, chatAbierto: false };
const MAX_RUTAS = 20;

const lista = (valor, esValido) => (Array.isArray(valor) ? [...new Set(valor.filter((elemento) => esValido(elemento)))].slice(-MAX_RUTAS) : []);

export const leerRecorrido = () => {
  try {
    const guardado = JSON.parse(window.sessionStorage.getItem(CLAVE_RECORRIDO) || 'null');
    return {
      servicios: lista(guardado?.servicios, (id) => typeof id === 'string' && Object.hasOwn(SERVICIOS, id)),
      invitaciones: lista(guardado?.invitaciones, (ruta) => typeof ruta === 'string' && Object.hasOwn(INVITACIONES, ruta)),
      rechazada: guardado?.rechazada === true,
      chatAbierto: guardado?.chatAbierto === true
    };
  } catch {
    return { ...VACIO };
  }
};

const actualizar = (cambio) => {
  try {
    const actual = leerRecorrido();
    window.sessionStorage.setItem(CLAVE_RECORRIDO, JSON.stringify({ ...actual, ...cambio(actual) }));
  } catch {
    // Almacenamiento bloqueado: Nebulina funciona igual, solo sin recordar el recorrido
  }
};

/** Anota la visita a una página de servicio (las demás no se guardan) */
export const registrarVisita = (ruta) => {
  const servicio = servicioDeRuta(ruta);
  if (servicio) actualizar(({ servicios }) => ({ servicios: [...servicios.filter((id) => id !== servicio), servicio] }));
};

export const registrarInvitacion = (ruta) => actualizar(({ invitaciones }) => ({ invitaciones: [...invitaciones, ruta] }));
export const registrarRechazo = () => actualizar(() => ({ rechazada: true }));
export const registrarChatAbierto = () => actualizar(() => ({ chatAbierto: true }));

/**
 * Invitación para la página, o null si no corresponde: ya abrió el chat,
 * cerró una invitación, llegó al máximo o ya la vio en esta página.
 */
export const invitacionPara = (ruta) => {
  if (!Object.hasOwn(INVITACIONES, ruta)) return null;
  const { servicios, invitaciones, rechazada, chatAbierto } = leerRecorrido();
  if (rechazada || chatAbierto || invitaciones.length >= MAX_INVITACIONES || invitaciones.includes(ruta)) return null;
  const variosServicios = servicios.length >= INVITACION_RECORRIDO.minimoServicios && (servicioDeRuta(ruta) || ruta === '/servicios');
  return variosServicios ? INVITACION_RECORRIDO : INVITACIONES[ruta];
};
