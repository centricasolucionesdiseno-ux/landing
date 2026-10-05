/**
 * Líneas de negocio. `formulario` es el valor de la lista del formulario de
 * citas y `ruta` su página. Es pequeño a propósito: lo usan tanto el chat como
 * la burbuja (que va en la carga inicial de todas las páginas).
 */
export const SERVICIOS = {
  fabrica: { texto: 'software a la medida', formulario: 'Fábrica de software', ruta: '/fabrica-software' },
  nebula: { texto: 'Nebula ERP', formulario: 'Nebula ERP', ruta: '/nebula-erp' },
  sicovi: { texto: 'SICOVI', formulario: 'Sicovi', ruta: '/sicovi' },
  ia: { texto: 'inteligencia artificial', formulario: 'Soluciones de IA', ruta: '/analisis-ia' },
  calidad: { texto: 'evaluación de calidad', formulario: 'Evaluaciones de calidad', ruta: '/evaluaciones-calidad' },
  consultoria: { texto: 'consultoría digital', formulario: 'Consultoría digital', ruta: '/consultoria-digital' }
};

/** "/nebula-erp" -> "nebula" (o null si la página no es de un servicio) */
export const servicioDeRuta = (ruta) => Object.keys(SERVICIOS).find((id) => SERVICIOS[id].ruta === ruta) ?? null;
