/**
 * Estrategia comercial de Nebulina. Siempre amable y nunca insistente: cada
 * recurso se usa como máximo una vez por conversación.
 *
 * - PERFIL: diagnóstico de 3 preguntas (organización, necesidad, urgencia).
 *   Con las respuestas recomienda un servicio y el siguiente paso según la
 *   urgencia; el perfil viaja al gerente con el mensaje del chat. Los valores
 *   aceptados se repiten en el servidor (EnviarMensaje.php): si se cambian
 *   aquí, hay que cambiarlos allá.
 * - VENTA_CRUZADA: cuando el visitante profundiza en un servicio, le muestra
 *   otro que lo complementa.
 * - CIERRE_SUAVE: tras varias preguntas de interés, propone la reunión.
 * - RECORRIDO: al pasar a otro servicio con el chat abierto, propone una
 *   solución combinada.
 */
import { tema, AGENDAR, CORREO, WHATSAPP } from './acciones';
import { DURACION_MIN } from '../agenda';

export const TEMA_DIAGNOSTICO = 'diagnostico';

// Cada opción: texto del botón y palabras para reconocerla si el visitante la escribe
const opcion = (etiqueta, palabras) => ({ etiqueta, palabras });

export const PERFIL = {
  organizacion: {
    pregunta: '1 de 3 · ¿Para qué tipo de organización buscas la solución?',
    opciones: {
      privada: opcion('Empresa privada', ['empresa', 'empresa privada', 'privada', 'compania', 'negocio', 'pyme']),
      publica: opcion('Entidad pública', ['entidad publica', 'publica', 'alcaldia', 'gobernacion', 'concejo', 'asamblea', 'gobierno', 'municipio']),
      emprendimiento: opcion('Emprendimiento o startup', ['emprendimiento', 'startup', 'emprendedor', 'emprendedora']),
      otra: opcion('Otra organización', ['otra', 'fundacion', 'ong', 'universidad', 'colegio', 'cooperativa'])
    }
  },
  necesidad: {
    pregunta: '2 de 3 · ¿Qué es lo que más necesitas resolver?',
    opciones: {
      medida: opcion('Crear o modernizar un sistema', ['sistema', 'aplicacion', 'app', 'software', 'plataforma', 'modernizar', 'crear']),
      erp: opcion('Ordenar finanzas, nómina o inventarios', ['finanzas', 'nomina', 'inventario', 'contabilidad', 'erp', 'facturacion', 'tributos']),
      legislativa: opcion('Gestionar un Concejo o una Asamblea', ['concejo', 'asamblea', 'legislativo', 'legislativa', 'acuerdos', 'ordenanzas']),
      ia: opcion('Automatizar con inteligencia artificial', ['ia', 'inteligencia artificial', 'automatizar', 'automatizacion', 'chatbot', 'agente']),
      calidad: opcion('Probar y asegurar mi software', ['pruebas', 'probar', 'calidad', 'qa', 'testing', 'auditoria']),
      asesoria: opcion('Aún no lo tengo claro', ['no se', 'no lo tengo claro', 'no estoy seguro', 'asesoria', 'orientacion', 'consultoria'])
    }
  },
  urgencia: {
    pregunta: '3 de 3 · ¿Para cuándo lo necesitas?',
    opciones: {
      ya: opcion('Lo antes posible', ['lo antes posible', 'urgente', 'ya', 'ya mismo', 'inmediato', 'este mes', 'cuanto antes']),
      pronto: opcion('En 1 a 3 meses', ['meses', 'proximo mes', 'trimestre', 'pronto']),
      explorando: opcion('Solo estoy explorando', ['explorando', 'mirando', 'curiosidad', 'informacion', 'sin afan', 'sin prisa'])
    }
  }
};

export const ORDEN_PERFIL = ['organizacion', 'necesidad', 'urgencia'];

/** Servicio que se recomienda según la necesidad (y un ajuste para entidades públicas) */
export const RECOMENDACION = {
  medida: { servicio: 'fabrica', tema: 'fabrica', texto: 'Te recomiendo nuestra Fábrica de software: diseñamos y construimos el sistema a la medida de tus procesos, o modernizamos el que ya tienes.' },
  erp: { servicio: 'nebula', tema: 'nebula_modulos', texto: 'Te recomiendo Nebula ERP: integra finanzas, nómina, inventarios y facturación electrónica DIAN en una sola plataforma.' },
  legislativa: { servicio: 'sicovi', tema: 'sicovi_modulos', texto: 'Te recomiendo SICOVI: centraliza acuerdos u ordenanzas, sesiones, comisiones y agenda, con acceso público para la ciudadanía.' },
  ia: { servicio: 'ia', tema: 'ia_casos', texto: 'Te recomiendo nuestras Soluciones de IA: copilotos para consultar tus documentos en lenguaje natural y agentes que automatizan soporte y operaciones, con trazabilidad.' },
  calidad: { servicio: 'calidad', tema: 'calidad_tipos', texto: 'Te recomiendo nuestras Evaluaciones de calidad: revisamos funcionalidad, rendimiento y seguridad antes de que lleguen los problemas.' },
  asesoria: { servicio: 'consultoria', tema: 'consultoria', texto: 'Te recomiendo empezar con nuestra Consultoría digital: aclaramos juntos qué necesitas y armamos una hoja de ruta.' }
};

export const RECOMENDACION_PUBLICA = {
  erp: { servicio: 'nebula', tema: 'nebula_tributos', texto: 'Te recomiendo Nebula ERP en su versión para el sector público: presupuesto público y tributos municipales como ICA y predial.' }
};

/** Siguiente paso según la urgencia */
export const SIGUIENTE_PASO = {
  ya: {
    texto: 'Como lo necesitas pronto, lo mejor es una reunión virtual con nuestro gerente comercial: te prepara una propuesta a tu medida.',
    acciones: [AGENDAR, WHATSAPP]
  },
  pronto: {
    texto: `Estás a tiempo de planearlo bien: en una reunión virtual de ${DURACION_MIN} minutos, sin costo, revisamos tu caso y te enviamos una propuesta.`,
    acciones: [AGENDAR, CORREO]
  },
  explorando: {
    texto: 'Sin afán: explora con calma. Si quieres, déjale tu correo a nuestro gerente y te envía información para revisarla con tu equipo.',
    acciones: [CORREO, tema('porque_nosotros', '¿Por qué Céntrica?')]
  }
};

export const VENTA_CRUZADA = {
  fabrica: { tema: 'calidad', texto: 'Por cierto: el software que construimos puede pasar por nuestras Evaluaciones de calidad antes de salir a producción. 🔍' },
  nebula: { tema: 'ia_casos', texto: 'Dato útil: Nebula ERP se puede complementar con nuestras Soluciones de IA para aprovechar mejor tus datos. 🤖' },
  sicovi: { tema: 'consultoria', texto: 'Por cierto: también acompañamos a entidades públicas en su transformación digital con nuestra Consultoría. 🏛️' },
  ia: { tema: 'consultoria', texto: 'Muchos proyectos de IA empiezan con un diagnóstico de datos en nuestra Consultoría digital. 📊' },
  calidad: { tema: 'fabrica', texto: 'Y si la evaluación encuentra mejoras, nuestra Fábrica de software puede implementarlas: un solo equipo de principio a fin. 🛠️' },
  consultoria: { tema: 'fabrica', texto: 'Y cuando el plan esté listo, nuestra Fábrica de software lo ejecuta: un solo equipo de principio a fin. 🛠️' }
};

/** Preguntas de un mismo servicio antes de ofrecer la venta cruzada */
export const TEMAS_PARA_VENTA_CRUZADA = 2;

export const CIERRE_SUAVE = {
  temas: 3,
  respuesta: `Por lo que me has contado{nombre}, creo que te sería muy útil una reunión virtual de ${DURACION_MIN} minutos con nuestro gerente: sin costo ni compromiso, y sales con una propuesta pensada para tu caso. ¿Te animas?`,
  acciones: [AGENDAR, WHATSAPP]
};

export const RECORRIDO = {
  texto: 'Veo que también revisaste {otros}. Si te interesa más de uno, podemos integrarlos en una sola propuesta.',
  acciones: [tema('diagnostico', 'Recomiéndame una solución'), AGENDAR]
};
