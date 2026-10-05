/**
 * Punto de entrada de la configuración de Nebulina (lo usa el chat, que se
 * descarga solo al abrirlo). La burbuja flotante importa directamente
 * ajustes.js, servicios.js y proactivo.js para no cargar el conocimiento.
 */
import { validarConocimiento } from './validar';

export * from './ajustes';
export * from './servicios';
export * from './conocimiento';
export * from './paginas';
export * from './mensajes';
export * from './ventas';
export * from './proactivo';
export { validarConocimiento };

// En desarrollo, un error en la base de conocimiento se ve de inmediato en la consola
if (import.meta.env.DEV) {
  const problemas = validarConocimiento();
  if (problemas.length) console.error(`Nebulina: revisa la base de conocimiento\n- ${problemas.join('\n- ')}`);
}
