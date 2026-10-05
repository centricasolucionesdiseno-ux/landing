/**
 * Invitaciones proactivas: con el chat cerrado, si el visitante se queda un
 * rato en una página, Nebulina le ofrece algo concreto de esa página. Al
 * pulsarla, el chat se abre respondiendo directamente ese `tema`.
 *
 * Para no ser invasiva: como máximo MAX_INVITACIONES por sesión, nunca dos
 * veces en la misma página, ninguna más si el visitante cierra una o si ya
 * abrió el chat, y solo con la pestaña visible.
 */
export const MAX_INVITACIONES = 2;

export const INVITACIONES = {
  '/': { segundos: 8, texto: '¡Hola! Soy Nebulina 👋 ¿Te ayudo a encontrar la solución ideal para tu organización?', tema: 'diagnostico' },
  '/servicios': { segundos: 15, texto: '¿No sabes cuál servicio te conviene? Te lo recomiendo en 3 preguntas. 🧭', tema: 'diagnostico' },
  '/fabrica-software': { segundos: 20, texto: '¿Tienes un sistema antiguo que te frena? Te cuento cómo lo modernizamos sin empezar de cero.', tema: 'fabrica_legado' },
  '/nebula-erp': { segundos: 20, texto: '¿Sabías que Nebula ERP trae facturación electrónica DIAN? Te cuento cómo funciona.', tema: 'nebula_dian' },
  '/sicovi': { segundos: 20, texto: '¿Tu Concejo o Asamblea aún gestiona todo en papel y correos? Mira lo que gestiona SICOVI.', tema: 'sicovi_modulos' },
  '/analisis-ia': { segundos: 20, texto: '¿Qué tareas de tu empresa podría automatizar la IA? Te muestro casos concretos. 🤖', tema: 'ia_casos' },
  '/evaluaciones-calidad': { segundos: 20, texto: '¿Tu software está listo para producción? Te cuento qué evaluamos. ✅', tema: 'calidad_tipos' },
  '/consultoria-digital': { segundos: 20, texto: '¿No sabes por dónde empezar la transformación digital? Te oriento sin compromiso.', tema: 'consultoria' },
  '/contacto': { segundos: 25, texto: '¿Tienes una duda antes de agendar? Pregúntame, respondo al instante. 💬', tema: 'agendar' }
};

/** Si el visitante ya recorrió varias páginas de servicios, la invitación propone una solución combinada */
export const INVITACION_RECORRIDO = {
  minimoServicios: 2,
  segundos: 15,
  texto: 'Veo que has revisado varios de nuestros servicios. ¿Te ayudo a elegir el que más te conviene? 😊',
  tema: 'diagnostico'
};
