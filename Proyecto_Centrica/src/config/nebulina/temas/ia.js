/** Soluciones de inteligencia artificial. */
import { ir, tema, CIERRE } from '../acciones';

export const TEMAS_IA = {
  ia: {
    palabras: ['inteligencia artificial', 'ia', 'ai', 'chatbot', 'chatbots', 'copiloto', 'agente', 'agentes', 'automatizar', 'automatizacion', 'machine learning'],
    respuesta: [
      'Con nuestras Soluciones de IA aplicamos inteligencia artificial a procesos reales, con trazabilidad: cada respuesta cita su fuente.',
      'Hacemos copilotos de conocimiento para consultar documentos en lenguaje natural, agentes que automatizan soporte y operaciones, integración de modelos de lenguaje y su operación en producción.'
    ],
    acciones: [tema('ia_casos', '¿Para qué casos sirve?'), tema('ia_modelos', '¿Qué modelos usan?'), tema('ia_confianza', '¿Es confiable?'), ir('/analisis-ia', 'Ver Soluciones de IA')]
  },
  ia_casos: {
    etiqueta: '¿Para qué casos sirve?',
    palabras: ['casos de uso', 'ejemplos de ia', 'para que sirve la ia', 'que se puede hacer con ia', 'casos de ia', 'ejemplos'],
    respuesta: [
      'Algunos casos donde la IA ya genera valor:',
      '• Gestión documental y cumplimiento normativo, con trazabilidad ante entes de control.\n• Servicio al cliente con agentes virtuales supervisados por personas.\n• Automatización de flujos de trabajo internos.',
      'Estimamos entre 30 % y 40 % menos tiempo buscando y gestionando información documental.'
    ],
    acciones: CIERRE
  },
  ia_modelos: {
    palabras: ['gpt', 'chatgpt', 'claude', 'gemini', 'llm', 'modelo de lenguaje', 'modelos', 'rag', 'openai', 'llama'],
    respuesta: [
      'Integramos GPT, Claude, Gemini y modelos abiertos en tus productos, usando RAG para que respondan con tu propia información. 🧠',
      'Elegimos el enfoque según el caso y el presupuesto, y después monitoreamos, ajustamos y controlamos los costos en producción.'
    ],
    acciones: CIERRE
  },
  ia_confianza: {
    etiqueta: '¿Es confiable?',
    palabras: ['confiable', 'alucina', 'alucinaciones', 'evidencia', 'trazabilidad', 'fuentes', 'etica', 'explicable', 'contraloria'],
    respuesta: [
      'Sí: nuestra IA responde con evidencia verificable, citando el documento, dato o registro de origen. ✅',
      'Incluye control de acceso y trazabilidad de cada consulta, y ya fue probada en procesos de cumplimiento ante la Contraloría.'
    ],
    acciones: CIERRE
  }
};
