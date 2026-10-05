/** Céntrica: quiénes somos, cómo trabajamos y orientación general. */
import { tema, CORREO, AGENDAR, HUMANO, CIERRE } from '../acciones';
import { EMPRESA } from '../../legal';
import { RESPUESTA_DIAS_HABILES } from '../../agenda';
import { SERVICIOS } from '../servicios';

export const TEMAS_EMPRESA = {
  empresa: {
    etiqueta: '¿Quiénes son?',
    palabras: ['quienes son', 'que es centrica', 'centrica', 'empresa', 'sobre ustedes', 'acerca de', 'historia', 'trayectoria', 'experiencia'],
    respuesta: [
      'Céntrica es una empresa de tecnología de Medellín, Colombia. 🏢',
      'Nuestra misión es optimizar la competitividad de organizaciones nacionales e internacionales con software a la medida, automatización, análisis de datos e inteligencia artificial.',
      'Trabajamos con empresas privadas y con entidades públicas.'
    ],
    acciones: [tema('cifras', 'Céntrica en cifras'), tema('empresa_valores', 'Sus valores'), tema('metodologia', '¿Cómo trabajan?'), tema('servicios', 'Ver servicios')]
  },
  // Las mismas cifras de la sección "Céntrica en cifras" (mismas fuentes: no se contradicen).
  // Nunca inventa cantidades de proyectos o clientes: eso lo cuenta el gerente con casos reales.
  cifras: {
    etiqueta: 'Céntrica en cifras',
    palabras: ['cifras', 'en cifras', 'estadisticas de la empresa', 'datos de centrica', 'numeros de centrica', 'cuantos servicios', 'cuantas lineas', 'cuantos proyectos', 'cuantos clientes', 'que tan grandes', 'tamano de la empresa', 'impacto'],
    respuesta: [
      'Céntrica en cifras: 📊',
      `• ${Object.keys(SERVICIOS).length} líneas de solución: software a la medida, Nebula ERP, SICOVI, inteligencia artificial, evaluaciones de calidad y consultoría digital.\n• 2 sectores: empresas privadas y entidades públicas.\n• Máximo ${RESPUESTA_DIAS_HABILES} días hábiles para responder tu solicitud.\n• Sede principal en Medellín, Antioquia.`,
      'Si quieres conocer casos y referencias según tu sector, nuestro gerente te los comparte en una reunión sin compromiso.'
    ],
    acciones: [tema('sectores', '¿Con qué sectores trabajan?'), tema('servicios', 'Ver servicios'), AGENDAR]
  },
  empresa_valores: {
    palabras: ['valores', 'mision', 'vision', 'principios', 'filosofia'],
    respuesta: [
      'Nuestra visión es asegurar soluciones sostenibles, seguras y alineadas con los objetivos de cada organización. Nos guían cuatro valores:',
      '• Seguridad primero: es la base de cada solución.\n• Innovación constante: tecnología moderna y vigente.\n• Compromiso con el cliente: tu éxito es nuestro éxito.\n• Escalabilidad: soluciones que crecen contigo.'
    ],
    acciones: [tema('metodologia', '¿Cómo trabajan?'), AGENDAR]
  },
  empresa_legal: {
    palabras: ['nit', 'razon social', 'rut', 'camara de comercio', 'datos de la empresa', 'facturar a', 'proveedor'],
    respuesta: [`Nuestra razón social es ${EMPRESA.razonSocial}, NIT ${EMPRESA.nit}, con domicilio en ${EMPRESA.domicilio}.`],
    acciones: [CORREO]
  },
  metodologia: {
    palabras: ['como trabajan', 'metodologia', 'proceso', 'etapas', 'pasos', 'como es el proceso', 'agil', 'scrum', 'como empiezan'],
    respuesta: [
      'Nuestro modelo de entrega tiene cuatro etapas:',
      '1. Diagnóstico: analizamos tus necesidades y objetivos.\n2. Desarrollo ágil: entregas continuas con Scrum/Kanban y DevOps.\n3. Aseguramiento: pruebas rigurosas y arquitectura probada.\n4. Soporte continuo: acompañamiento y mejoras después del lanzamiento.'
    ],
    acciones: [tema('soporte', 'Soporte'), tema('tiempos', '¿Cuánto tarda un proyecto?'), AGENDAR]
  },
  soporte: {
    palabras: ['soporte', 'mantenimiento', 'garantia', 'post venta', 'despues de entregar', 'acompanamiento', 'mesa de ayuda', 'falla', 'actualizaciones'],
    respuesta: [
      'No te dejamos solo después del lanzamiento: ofrecemos soporte dedicado y mejora continua de las soluciones. 🛠️',
      'Si ya eres cliente y necesitas ayuda, escríbele a nuestro gerente y te conecta con el equipo.'
    ],
    acciones: HUMANO
  },
  seguridad: {
    palabras: ['seguridad', 'seguro', 'ciberseguridad', 'proteccion', 'hackeo', 'cifrado', 'auditoria', 'multi tenant', 'multitenant', 'aislamiento', 'es seguro', 'que tan seguro', 'son seguros'],
    respuesta: [
      'La seguridad es nuestro primer valor. 🔒 Diseñamos con seguridad desde el inicio (Security by Design).',
      'Nuestras plataformas son multi-tenant con aislamiento total: cada cliente tiene su propia base de datos o esquema, con auditoría completa y cifrado. En pruebas aplicamos ISO 27001 y OWASP.'
    ],
    acciones: [tema('calidad', 'Pruebas de seguridad'), AGENDAR]
  },
  tiempos: {
    etiqueta: '¿Cuánto tarda?',
    palabras: ['cuanto tarda', 'cuanto tiempo', 'tiempo de entrega', 'plazo', 'plazos', 'duracion', 'cuando estaria', 'tiempo de implementacion', 'rapido', 'cuanto se demoran', 'cuanto demoran', 'se demoran', 'cuanto tardan', 'en cuanto tiempo'],
    respuesta: [
      'Depende del alcance de cada proyecto{servicio}: lo definimos juntos en el diagnóstico, con un cronograma claro. ⏱️',
      'Como referencia, un diagnóstico rápido de calidad toma de 2 a 3 días y una auditoría completa de 4 a 6 semanas.'
    ],
    acciones: CIERRE
  },
  sectores: {
    palabras: ['sector publico', 'entidad publica', 'gobierno', 'estado', 'sector privado', 'empresa privada', 'pymes', 'pyme', 'clientes', 'para quien'],
    respuesta: [
      'Trabajamos con los dos mundos:',
      '• Entidades públicas: Nebula ERP en versión GRP (presupuesto público y tributos como ICA y predial) y SICOVI para Concejos y Asambleas.\n• Empresas privadas: Nebula ERP, software a la medida, IA, calidad y consultoría.'
    ],
    acciones: [tema('recomendar', '¿Qué solución necesito?'), AGENDAR]
  },
  recomendar: {
    etiqueta: '¿Qué solución necesito?',
    palabras: ['que necesito', 'que me recomiendas', 'recomiendame', 'cual me sirve', 'no se que necesito', 'que solucion', 'asesorame', 'orientame'],
    respuesta: ['¡Te ayudo a elegir{nombre}! 🧭 ¿Qué es lo que más necesitas?'],
    acciones: [
      tema('diagnostico', 'Hacer un diagnóstico de 3 preguntas'),
      tema('nebula', 'Ordenar finanzas, nómina o inventarios'),
      tema('fabrica', 'Crear o modernizar un sistema'),
      tema('sicovi', 'Gestionar un Concejo o una Asamblea'),
      tema('ia', 'Automatizar con inteligencia artificial'),
      tema('calidad', 'Probar y asegurar mi software'),
      tema('consultoria', 'Planear la transformación digital')
    ]
  },
  servicios: {
    etiqueta: '¿Qué servicios ofrecen?',
    palabras: ['servicios', 'que hacen', 'que ofrecen', 'a que se dedican', 'soluciones', 'productos', 'portafolio', 'que venden', 'lineas de negocio', 'que es lo que hacen', 'lo que hacen', 'en que me pueden ayudar'],
    respuesta: [
      'En Céntrica tenemos seis líneas de servicio:',
      '• Fábrica de software: desarrollo a la medida y modernización de sistemas.\n• Nebula ERP: finanzas, nómina, inventarios y tributos en una sola plataforma.\n• SICOVI: gestión legislativa para Concejos y Asambleas.\n• Soluciones de IA: copilotos y agentes con evidencia verificable.\n• Evaluaciones de calidad: pruebas y auditoría de software.\n• Consultoría digital: diagnóstico y hoja de ruta tecnológica.',
      '¿Sobre cuál quieres saber más?'
    ],
    acciones: [tema('fabrica', 'Fábrica de software'), tema('nebula', 'Nebula ERP'), tema('sicovi', 'SICOVI'), tema('ia', 'Soluciones de IA'), tema('calidad', 'Evaluaciones de calidad'), tema('consultoria', 'Consultoría digital')]
  }
};
