/** Contexto por página: lo que Nebulina dice al abrirse, el servicio y las preguntas que sugiere */
export const PAGINAS = {
  '/': { contexto: 'Te damos la bienvenida a Céntrica, una empresa de tecnología de Medellín.', sugerencias: ['diagnostico', 'servicios', 'empresa', 'humano'] },
  '/servicios': { contexto: 'Veo que estás explorando nuestros servicios.', sugerencias: ['diagnostico', 'precio', 'agendar', 'humano'] },
  '/fabrica-software': { contexto: 'Veo que te interesa nuestra Fábrica de software.', servicio: 'fabrica', sugerencias: ['fabrica_tecnologias', 'fabrica_legado', 'tiempos', 'agendar'] },
  '/nebula-erp': { contexto: 'Veo que te interesa Nebula ERP.', servicio: 'nebula', sugerencias: ['nebula_modulos', 'nebula_dian', 'nebula_tributos', 'demo'] },
  '/sicovi': { contexto: 'Veo que te interesa SICOVI para Concejos y Asambleas.', servicio: 'sicovi', sugerencias: ['sicovi', 'sicovi_medellin', 'sicovi_ciudadania', 'demo'] },
  '/analisis-ia': { contexto: 'Veo que te interesan nuestras Soluciones de IA.', servicio: 'ia', sugerencias: ['ia_casos', 'ia_confianza', 'precio', 'agendar'] },
  '/evaluaciones-calidad': { contexto: 'Veo que te interesan nuestras Evaluaciones de calidad.', servicio: 'calidad', sugerencias: ['calidad_tipos', 'tiempos', 'precio', 'agendar'] },
  '/consultoria-digital': { contexto: 'Veo que te interesa nuestra Consultoría digital.', servicio: 'consultoria', sugerencias: ['consultoria', 'precio', 'agendar', 'humano'] },
  '/contacto': { contexto: 'Estás en la página de contacto. Puedo ayudarte con la agenda o pasarle un mensaje al gerente.', sugerencias: ['agendar', 'horario', 'ubicacion', 'humano'] },
  '/privacidad': { contexto: '¿Tienes dudas sobre tus datos personales?', sugerencias: ['privacidad', 'humano'] },
  '/cookies': { contexto: '¿Tienes dudas sobre lo que guardamos en tu navegador?', sugerencias: ['privacidad', 'humano'] }
};

export const PAGINA_POR_DEFECTO = { contexto: '', sugerencias: ['diagnostico', 'servicios', 'precio', 'humano'] };
