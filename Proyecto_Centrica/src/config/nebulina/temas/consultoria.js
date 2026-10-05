/** Consultoría digital. */
import { ir, tema, CIERRE } from '../acciones';

export const TEMAS_CONSULTORIA = {
  consultoria: {
    etiqueta: '¿Qué incluye la consultoría?',
    palabras: ['consultoria', 'transformacion digital', 'asesoria', 'diagnostico de madurez', 'hoja de ruta', 'madurez digital', 'gestion del cambio', 'estrategia', 'consultor', 'digitalizar', 'digitalizacion', 'digitalizar mi empresa', 'asesoria digital'],
    respuesta: [
      'Con la Consultoría digital te acompañamos en la transformación de tu organización: diagnóstico de madurez, hoja de ruta tecnológica, rediseño de procesos, gestión del cambio, ciberseguridad estratégica y analítica de datos.',
      'Podemos empezar con un diagnóstico inicial sin costo. 🎯'
    ],
    acciones: [tema('consultoria_nube', 'Nube y datos'), ir('/consultoria-digital', 'Ver Consultoría digital'), ...CIERRE]
  },
  consultoria_nube: {
    palabras: ['nube', 'cloud', 'aws', 'azure', 'google cloud', 'big data', 'business intelligence', 'bi', 'datos', 'analitica'],
    respuesta: ['En tecnologías habilitadoras te asesoramos en nube (AWS, Azure, Google Cloud), datos y analítica (Big Data, BI), IA, ciberseguridad (Zero Trust), DevOps y experiencia digital. ☁️'],
    acciones: CIERRE
  }
};
