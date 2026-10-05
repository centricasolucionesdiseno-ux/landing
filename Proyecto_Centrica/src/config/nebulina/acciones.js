/** Acciones que aparecen como botones bajo una respuesta */
import { CONTACTO } from '../agenda';

export const ir = (ruta, etiqueta) => ({ tipo: 'pagina', ruta, etiqueta });
export const tema = (id, etiqueta) => ({ tipo: 'tema', id, etiqueta });
export const WHATSAPP = { tipo: 'whatsapp', etiqueta: 'Escribir por WhatsApp' };
export const CORREO = { tipo: 'correo', etiqueta: 'Dejar un mensaje al gerente' };
export const LLAMAR = { tipo: 'llamar', etiqueta: `Llamar al ${CONTACTO.telefono}` };
// El motor le agrega el servicio de la conversación (?servicio=...) para preseleccionarlo
export const AGENDAR = { tipo: 'agendar', etiqueta: 'Agendar una reunión' };
export const HUMANO = [WHATSAPP, CORREO];
export const CIERRE = [AGENDAR, ...HUMANO];
