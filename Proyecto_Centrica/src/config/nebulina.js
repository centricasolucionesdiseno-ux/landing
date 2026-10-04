/**
 * Base de conocimiento de Nebulina, la asistente guiada del sitio.
 *
 * - TEMAS: lo que Nebulina sabe responder. `palabras` son frases que la
 *   activan, en minúsculas y sin tildes (el motor normaliza lo que escribe el
 *   visitante y tolera errores de escritura y plurales). Las frases largas
 *   pesan más; gana el tema con más puntos.
 * - SERVICIOS: cada línea de negocio, para recordar de qué se está hablando
 *   ("¿y cuánto cuesta?") y preseleccionarla al agendar.
 * - PAGINAS: qué dice al abrir el chat en cada página y qué sugiere.
 *
 * Marcadores en las respuestas: {servicio} (servicio de la conversación),
 * {nombre} (", Ana" si el visitante dijo su nombre) y {horario} (si estamos
 * atendiendo ahora). Reglas de negocio: solo habla de Céntrica, nunca da
 * precios ni plazos cerrados (todo se cotiza según el alcance) y siempre
 * ofrece hablar con el gerente.
 *
 * Para agregar un tema: crearlo en TEMAS (y su etiqueta en ETIQUETAS si se
 * sugiere como botón); si aplica, sugerirlo en PAGINAS.
 */
import { CONTACTO, RESPUESTA_DIAS_HABILES } from './agenda';
import { EMPRESA } from './legal';

// Backend PHP en el mismo hosting (public/api/nebulina). Se puede cambiar en .env
export const NEBULINA_ENDPOINT = import.meta.env.VITE_NEBULINA_ENDPOINT || '/api/nebulina/mensaje.php';

// Almacenamiento de sesión (se borra al cerrar la pestaña; ver Política de Cookies)
export const CLAVE_SALUDO = 'nebulina-saludo';
export const CLAVE_CONVERSACION = 'nebulina-conversacion';
export const SEGUNDOS_SALUDO = 8;

/**
 * Inactividad: si tras una respuesta el visitante no escribe ni toca nada,
 * Nebulina pregunta si sigue ahí; si tampoco responde, se despide y cierra
 * el chat (la conversación queda guardada para cuando lo vuelva a abrir).
 */
export const SEGUNDOS_PREGUNTAR_SI_SIGUE = 60;
export const SEGUNDOS_CERRAR_SIN_RESPUESTA = 45;

/** Líneas de negocio. `formulario` es el valor de la lista del formulario de citas. */
export const SERVICIOS = {
  fabrica: { texto: 'software a la medida', formulario: 'Fábrica de software', ruta: '/fabrica-software' },
  nebula: { texto: 'Nebula ERP', formulario: 'Nebula ERP', ruta: '/nebula-erp' },
  sicovi: { texto: 'SICOVI', formulario: 'Sicovi', ruta: '/sicovi' },
  ia: { texto: 'inteligencia artificial', formulario: 'Soluciones de IA', ruta: '/analisis-ia' },
  calidad: { texto: 'evaluación de calidad', formulario: 'Evaluaciones de calidad', ruta: '/evaluaciones-calidad' },
  consultoria: { texto: 'consultoría digital', formulario: 'Consultoría digital', ruta: '/consultoria-digital' }
};

// Acciones que aparecen como botones bajo una respuesta
const ir = (ruta, etiqueta) => ({ tipo: 'pagina', ruta, etiqueta });
const tema = (id, etiqueta) => ({ tipo: 'tema', id, etiqueta });
const WHATSAPP = { tipo: 'whatsapp', etiqueta: 'Escribir por WhatsApp' };
const CORREO = { tipo: 'correo', etiqueta: 'Dejar un mensaje al gerente' };
const LLAMAR = { tipo: 'llamar', etiqueta: `Llamar al ${CONTACTO.telefono}` };
// El motor le agrega el servicio de la conversación (?servicio=...) para preseleccionarlo
const AGENDAR = { tipo: 'agendar', etiqueta: 'Agendar una reunión' };
const HUMANO = [WHATSAPP, CORREO];
const CIERRE = [AGENDAR, ...HUMANO];

export const TEMAS = {
  // ---------- Conversación ----------
  saludo: {
    palabras: ['hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches', 'hey', 'saludos', 'que tal', 'holi'],
    respuesta: ['¡Hola{nombre}! 😊 Qué gusto saludarte. Cuéntame qué buscas y te ayudo a encontrarlo.'],
    acciones: [tema('servicios', '¿Qué servicios ofrecen?'), tema('recomendar', '¿Qué solución necesito?'), tema('humano', 'Hablar con una persona')]
  },
  como_estas: {
    palabras: ['como estas', 'como vas', 'como te va', 'que haces', 'todo bien'],
    respuesta: ['¡Muy bien, gracias por preguntar{nombre}! 💙 Lista para ayudarte. ¿Qué te gustaría saber de Céntrica?'],
    acciones: [tema('servicios', 'Ver servicios'), tema('recomendar', '¿Qué solución necesito?')]
  },
  nebulina: {
    palabras: ['quien eres', 'que eres', 'nebulina', 'eres un robot', 'eres humana', 'eres una persona', 'eres real', 'bot', 'asistente virtual'],
    respuesta: [
      'Soy Nebulina, la asistente virtual de Céntrica. 🤖💙',
      'Conozco nuestros servicios y te conecto con nuestro gerente comercial, que sí es una persona de carne y hueso, cuando lo necesites.'
    ],
    acciones: [tema('capacidades', '¿Qué puedes hacer?'), tema('humano', 'Hablar con el gerente')]
  },
  capacidades: {
    palabras: ['que puedes hacer', 'en que me ayudas', 'como funcionas', 'que sabes', 'ayuda', 'como te uso'],
    respuesta: [
      'Esto es lo que puedo hacer por ti:',
      '• Explicarte cada servicio de Céntrica y recomendarte el adecuado.\n• Ayudarte a agendar una reunión virtual con el servicio ya elegido.\n• Pasarle tu mensaje al gerente o abrir WhatsApp con tu consulta.\n• Darte horarios, ubicación y datos de contacto.',
      'Puedes escribirme con tus palabras o usar los botones. 😉'
    ],
    acciones: [tema('recomendar', '¿Qué solución necesito?'), tema('servicios', 'Ver servicios'), AGENDAR]
  },
  menu: {
    palabras: ['menu', 'opciones', 'inicio', 'empezar', 'volver', 'otra cosa', 'otra pregunta'],
    respuesta: ['Claro{nombre}, ¿por dónde quieres seguir?'],
    acciones: [tema('servicios', 'Servicios'), tema('recomendar', '¿Qué solución necesito?'), tema('empresa', 'Sobre Céntrica'), AGENDAR, tema('humano', 'Hablar con una persona')]
  },
  ingles: {
    palabras: ['hello', 'hi', 'english', 'price', 'help me', 'do you speak', 'services'],
    respuesta: [
      'Hi! 👋 For now I can only chat in Spanish, but our team speaks with clients from abroad too.',
      'Write to our sales manager on WhatsApp or leave a message and we will get back to you.'
    ],
    acciones: HUMANO
  },
  respeto: {
    palabras: ['idiota', 'estupida', 'estupido', 'inutil', 'basura', 'mierda', 'tonta', 'tonto', 'maldita'],
    respuesta: [
      'Lamento si algo no salió como esperabas. 🙏 Quiero ayudarte de verdad.',
      'Si prefieres, te comunico con nuestro gerente para que lo resuelva personalmente.'
    ],
    acciones: HUMANO
  },
  sigo_aqui: {
    palabras: ['sigo aqui', 'aqui estoy', 'si sigo', 'sigo', 'aun estoy', 'todavia estoy', 'continuar', 'seguimos'],
    respuesta: ['¡Qué bien{nombre}! 😊 Sigamos. ¿En qué más te puedo ayudar?'],
    acciones: [tema('servicios', 'Servicios'), tema('recomendar', '¿Qué solución necesito?'), AGENDAR, tema('humano', 'Hablar con una persona')]
  },
  gracias: {
    palabras: ['gracias', 'muchas gracias', 'mil gracias', 'te agradezco', 'perfecto', 'excelente', 'genial', 'muy amable', 'super'],
    respuesta: ['¡Con mucho gusto{nombre}! 😊 Si te surge otra duda, aquí estoy.'],
    acciones: [tema('menu', 'Tengo otra pregunta'), AGENDAR]
  },
  despedida: {
    palabras: ['adios', 'chao', 'hasta luego', 'nos vemos', 'bye', 'hasta pronto'],
    respuesta: ['¡Hasta pronto{nombre}! Que tengas un excelente día. 👋'],
    acciones: []
  },

  // ---------- Céntrica ----------
  empresa: {
    palabras: ['quienes son', 'que es centrica', 'centrica', 'empresa', 'sobre ustedes', 'acerca de', 'historia', 'trayectoria', 'experiencia'],
    respuesta: [
      'Céntrica es una empresa de tecnología de Medellín, Colombia. 🏢',
      'Nuestra misión es optimizar la competitividad de organizaciones nacionales e internacionales con software a la medida, automatización, análisis de datos e inteligencia artificial.',
      'Trabajamos con empresas privadas y con entidades públicas.'
    ],
    acciones: [tema('empresa_valores', 'Sus valores'), tema('metodologia', '¿Cómo trabajan?'), tema('servicios', 'Ver servicios')]
  },
  empresa_valores: {
    palabras: ['valores', 'mision', 'vision', 'principios', 'filosofia', 'que los diferencia', 'por que ustedes', 'por que elegirlos'],
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
    palabras: ['seguridad', 'seguro', 'ciberseguridad', 'proteccion', 'hackeo', 'cifrado', 'auditoria', 'multi tenant', 'multitenant', 'aislamiento'],
    respuesta: [
      'La seguridad es nuestro primer valor. 🔒 Diseñamos con seguridad desde el inicio (Security by Design).',
      'Nuestras plataformas son multi-tenant con aislamiento total: cada cliente tiene su propia base de datos o esquema, con auditoría completa y cifrado. En pruebas aplicamos ISO 27001 y OWASP.'
    ],
    acciones: [tema('calidad', 'Pruebas de seguridad'), AGENDAR]
  },
  tiempos: {
    palabras: ['cuanto tarda', 'cuanto tiempo', 'tiempo de entrega', 'plazo', 'plazos', 'duracion', 'cuando estaria', 'tiempo de implementacion', 'rapido'],
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
    palabras: ['que necesito', 'que me recomiendas', 'recomiendame', 'cual me sirve', 'no se que necesito', 'que solucion', 'asesorame', 'orientame'],
    respuesta: ['¡Te ayudo a elegir{nombre}! 🧭 ¿Qué es lo que más necesitas?'],
    acciones: [
      tema('nebula', 'Ordenar finanzas, nómina o inventarios'),
      tema('fabrica', 'Crear o modernizar un sistema'),
      tema('sicovi', 'Gestionar un Concejo o una Asamblea'),
      tema('ia', 'Automatizar con inteligencia artificial'),
      tema('calidad', 'Probar y asegurar mi software'),
      tema('consultoria', 'Planear la transformación digital')
    ]
  },
  servicios: {
    palabras: ['servicios', 'que hacen', 'que ofrecen', 'a que se dedican', 'soluciones', 'productos', 'portafolio', 'que venden', 'lineas de negocio'],
    respuesta: [
      'En Céntrica tenemos seis líneas de servicio:',
      '• Fábrica de software: desarrollo a la medida y modernización de sistemas.\n• Nebula ERP: finanzas, nómina, inventarios y tributos en una sola plataforma.\n• SICOVI: gestión legislativa para Concejos y Asambleas.\n• Soluciones de IA: copilotos y agentes con evidencia verificable.\n• Evaluaciones de calidad: pruebas y auditoría de software.\n• Consultoría digital: diagnóstico y hoja de ruta tecnológica.',
      '¿Sobre cuál quieres saber más?'
    ],
    acciones: [tema('fabrica', 'Fábrica de software'), tema('nebula', 'Nebula ERP'), tema('sicovi', 'SICOVI'), tema('ia', 'Soluciones de IA'), tema('calidad', 'Evaluaciones de calidad'), tema('consultoria', 'Consultoría digital')]
  },

  // ---------- Fábrica de software ----------
  fabrica: {
    palabras: ['fabrica', 'software a la medida', 'a la medida', 'desarrollo', 'desarrollar', 'aplicacion', 'app', 'plataforma', 'sistema', 'pagina web', 'programar', 'squads', 'software'],
    respuesta: [
      'Con nuestra Fábrica de software construimos aplicaciones a la medida con squads ágiles y la arquitectura SIMAPPE.',
      'Hacemos desarrollo desde cero (greenfield), modernización de sistemas legados y consultoría de arquitectura, con pruebas automatizadas y CI/CD en cada entrega.'
    ],
    acciones: [tema('fabrica_tecnologias', '¿Con qué tecnologías trabajan?'), tema('fabrica_legado', 'Tengo un sistema antiguo'), tema('simappe', '¿Qué es SIMAPPE?'), ir('/fabrica-software', 'Ver Fábrica de software')]
  },
  fabrica_tecnologias: {
    palabras: ['tecnologias', 'lenguajes', 'java', 'net', 'node', 'python', 'react', 'angular', 'vue', 'stack', 'frontend', 'backend', 'docker', 'kubernetes', 'devops', 'api', 'apis'],
    respuesta: [
      'Trabajamos con Java, .NET, Node.js y Python en el backend; Angular, React y Vue en el frontend; APIs REST, contenedores, orquestadores y CI/CD automatizado.',
      'Aplicamos Clean Code, SOLID y arquitectura desacoplada en cada proyecto.'
    ],
    acciones: [tema('bases_datos', 'Bases de datos'), ...CIERRE]
  },
  bases_datos: {
    palabras: ['base de datos', 'bases de datos', 'postgresql', 'postgres', 'oracle', 'sql server', 'mysql', 'motor de base de datos'],
    respuesta: ['Nos adaptamos a la infraestructura que ya tienes: soportamos PostgreSQL, Oracle y SQL Server, y el sistema conmuta entre bases de datos en milisegundos. 🗄️'],
    acciones: CIERRE
  },
  fabrica_legado: {
    palabras: ['legado', 'legacy', 'antiguo', 'viejo', 'obsoleto', 'sistema viejo', 'sistema antiguo', 'muy viejo', 'muy antiguo', 'modernizar', 'migrar', 'migracion', 'actualizar sistema'],
    respuesta: [
      'Justo eso hacemos en la modernización de aplicativos: llevamos sistemas legados a arquitecturas modernas y escalables, por etapas, para no frenar tu operación.',
      'Lo ideal es revisarlo juntos en una reunión para entender tu sistema actual.'
    ],
    acciones: CIERRE
  },
  simappe: {
    palabras: ['simappe', 'arquitectura', 'capas', 'framework', 'cimiento'],
    respuesta: [
      'SIMAPPE es el cimiento de nuestras soluciones: gestiona la seguridad, el multi-tenancy, la auditoría y los servicios base que toda aplicación empresarial necesita.',
      'Sobre esa capa va la lógica de negocio (por ejemplo, Nebula con contabilidad y nómina). Así cada funcionalidad sigue el mismo camino y el software es fácil de mantener.'
    ],
    acciones: [tema('seguridad', 'Seguridad'), ...CIERRE]
  },

  // ---------- Nebula ERP ----------
  nebula: {
    palabras: ['nebula', 'erp', 'contabilidad', 'contable', 'inventario', 'inventarios', 'tesoreria', 'presupuesto', 'activos', 'grp', 'gestion empresarial', 'finanzas'],
    respuesta: [
      'Nebula ERP centraliza las finanzas, la administración y los tributos de tu organización en una sola plataforma, con IA integrada y reportes en tiempo real.',
      'Sirve tanto para empresas privadas (ERP) como para entidades públicas (GRP), y cada cliente tiene sus datos totalmente aislados.'
    ],
    acciones: [tema('nebula_modulos', '¿Qué módulos tiene?'), tema('nebula_dian', '¿Tiene facturación electrónica?'), tema('nebula_ia', '¿Qué hace la IA?'), ir('/nebula-erp', 'Ver Nebula ERP')]
  },
  nebula_modulos: {
    palabras: ['modulos', 'funcionalidades', 'que incluye', 'caracteristicas', 'funciones'],
    respuesta: [
      'Nebula ERP tiene tres grandes áreas:',
      '• Financiera: contabilidad inteligente, tesorería, facturación y presupuesto 360°.\n• Administrativa: nómina, talento humano, suministros y activos fijos.\n• Tributaria (entidades públicas): Industria y Comercio (ICA), impuesto predial y acuerdos de pago.'
    ],
    acciones: [tema('nebula_nomina', 'Nómina y talento humano'), tema('nebula_reportes', 'Reportes'), ...CIERRE]
  },
  nebula_dian: {
    palabras: ['dian', 'factura electronica', 'facturacion electronica', 'facturar', 'facturacion'],
    respuesta: ['Sí. El módulo de facturación de Nebula ERP cumple de forma nativa con el ecosistema de facturación electrónica de la DIAN. ✅'],
    acciones: CIERRE
  },
  nebula_nomina: {
    palabras: ['nomina', 'talento humano', 'empleados', 'recursos humanos', 'rrhh', 'evaluacion de desempeno', 'clima laboral', 'colaboradores'],
    respuesta: [
      'En Nebula ERP procesas nóminas complejas y cumples las obligaciones de ley. 👥',
      'El módulo de Talento Humano digitaliza el ciclo de vida de tus colaboradores: expedientes, evaluaciones de desempeño y clima laboral.'
    ],
    acciones: CIERRE
  },
  nebula_ia: {
    palabras: ['ia integrada', 'inteligencia artificial integrada', 'prediccion', 'predictivo', 'anomalias', 'que hace la ia'],
    respuesta: ['La IA de Nebula ERP hace análisis predictivo, detecta anomalías y automatiza procesos repetitivos, para que tu equipo se concentre en decidir. 🤖'],
    acciones: [tema('nebula_reportes', 'Reportes'), ...CIERRE]
  },
  nebula_reportes: {
    palabras: ['reportes', 'informes', 'dashboard', 'dashboards', 'indicadores', 'kpi', 'kpis', 'tablero', 'estadisticas'],
    respuesta: ['Nebula ERP incluye dashboards interactivos, reportes personalizables e indicadores clave (KPIs) en tiempo real. 📊'],
    acciones: CIERRE
  },
  nebula_tributos: {
    palabras: ['predial', 'ica', 'industria y comercio', 'impuestos', 'tributos', 'tributario', 'alcaldia', 'secretaria de hacienda', 'acuerdos de pago', 'cartera'],
    respuesta: [
      'Para entidades públicas, Nebula ERP moderniza la gestión tributaria: liquidación automatizada del ICA, control del impuesto predial con trazabilidad y reducción de cartera morosa, y acuerdos de pago flexibles.'
    ],
    acciones: [ir('/nebula-erp', 'Ver Nebula ERP'), ...CIERRE]
  },

  // ---------- SICOVI ----------
  sicovi: {
    palabras: ['sicovi', 'concejo', 'concejos', 'concejal', 'concejales', 'asamblea', 'asambleas', 'asamblea departamental', 'diputado', 'diputados', 'ordenanza', 'ordenanzas', 'legislativo', 'legislativa', 'acuerdos municipales', 'concejo visible'],
    respuesta: [
      'SICOVI (Sistema Concejo Visible) es nuestra plataforma de gestión legislativa para Concejos Municipales y Asambleas Departamentales de Colombia.',
      'Centraliza acuerdos u ordenanzas, proyectos, sesiones, comisiones y agenda, con trazabilidad completa y acceso público para la ciudadanía.'
    ],
    acciones: [tema('sicovi_modulos', '¿Qué gestiona?'), tema('sicovi_ciudadania', '¿Qué gana la ciudadanía?'), ir('/sicovi', 'Ver SICOVI'), AGENDAR]
  },
  sicovi_modulos: {
    palabras: ['sesiones', 'comisiones', 'proyectos de acuerdo', 'proyectos de ordenanza', 'actas', 'agenda legislativa', 'que gestiona'],
    respuesta: [
      'SICOVI tiene módulos para acuerdos u ordenanzas, proyectos, sesiones, agenda y comisiones, cada uno con un equipo (squad) especializado. 🏛️',
      'Automatiza el flujo de trabajo interno de la corporación y cada Concejo o Asamblea tiene su información totalmente aislada.'
    ],
    acciones: CIERRE
  },
  sicovi_medellin: {
    palabras: ['concejo de medellin', 'caso de exito', 'casos de exito', 'referencias', 'quien lo usa', 'donde lo usan', 'simi'],
    respuesta: [
      'SICOVI está en el Concejo de Medellín. 🏛️ La ciudadanía consulta en línea 6 módulos (acuerdos, proyectos de acuerdo, agenda, invitaciones, citaciones y comisiones) y el historial legislativo desde 2008.',
      'Según el informe de gestión 2024 del Concejo, ese año se aprobaron 21 proyectos de acuerdo y se realizaron 27 citaciones de control político.'
    ],
    acciones: [ir('/sicovi', 'Ver SICOVI'), ...CIERRE]
  },
  sicovi_ciudadania: {
    palabras: ['ciudadania', 'ciudadanos', 'transparencia', 'participacion', 'acceso publico'],
    respuesta: ['Con SICOVI cualquier ciudadano puede consultar en línea los acuerdos u ordenanzas, proyectos, sesiones y toda la actividad de su Concejo o Asamblea. Más transparencia y más participación. 🙌'],
    acciones: [ir('/sicovi', 'Ver SICOVI'), ...CIERRE]
  },

  // ---------- Soluciones de IA ----------
  ia: {
    palabras: ['inteligencia artificial', 'ia', 'ai', 'chatbot', 'chatbots', 'copiloto', 'agente', 'agentes', 'automatizar', 'automatizacion', 'machine learning'],
    respuesta: [
      'Con nuestras Soluciones de IA aplicamos inteligencia artificial a procesos reales, con trazabilidad: cada respuesta cita su fuente.',
      'Hacemos copilotos de conocimiento para consultar documentos en lenguaje natural, agentes que automatizan soporte y operaciones, integración de modelos de lenguaje y su operación en producción.'
    ],
    acciones: [tema('ia_casos', '¿Para qué casos sirve?'), tema('ia_modelos', '¿Qué modelos usan?'), tema('ia_confianza', '¿Es confiable?'), ir('/analisis-ia', 'Ver Soluciones de IA')]
  },
  ia_casos: {
    palabras: ['casos de uso', 'ejemplos', 'para que sirve', 'casos'],
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
    palabras: ['confiable', 'alucina', 'alucinaciones', 'evidencia', 'trazabilidad', 'fuentes', 'etica', 'explicable', 'contraloria'],
    respuesta: [
      'Sí: nuestra IA responde con evidencia verificable, citando el documento, dato o registro de origen. ✅',
      'Incluye control de acceso y trazabilidad de cada consulta, y ya fue probada en procesos de cumplimiento ante la Contraloría.'
    ],
    acciones: CIERRE
  },

  // ---------- Evaluaciones de calidad ----------
  calidad: {
    palabras: ['calidad', 'pruebas', 'testing', 'qa', 'tester', 'bugs', 'errores', 'auditoria de codigo', 'pruebas de carga', 'rendimiento', 'pentest', 'vulnerabilidades', 'automatizacion de pruebas', 'usabilidad'],
    respuesta: [
      'En Evaluaciones de calidad aseguramos que tu software funcione, rinda y sea seguro: pruebas funcionales, de rendimiento, de seguridad y de usabilidad, automatización de pruebas y auditoría de código.',
      'Trabajamos con estándares como ISO 25000, ISTQB, ISO 27001 y OWASP.'
    ],
    acciones: [tema('calidad_tipos', '¿Qué tipos de evaluación hay?'), tema('calidad_herramientas', 'Herramientas'), ir('/evaluaciones-calidad', 'Ver Evaluaciones de calidad')]
  },
  calidad_tipos: {
    palabras: ['tipos de evaluacion', 'diagnostico rapido', 'auditoria completa', 'qa continuo', 'capacitacion', 'modalidades'],
    respuesta: [
      'Tenemos cuatro modalidades:',
      '• Diagnóstico rápido: 2 a 3 días para detectar riesgos críticos.\n• Auditoría completa: calidad, seguridad y rendimiento (4 a 6 semanas).\n• QA continuo: integrado a tu ciclo de desarrollo.\n• Capacitación: formamos a tu equipo en pruebas de software.'
    ],
    acciones: CIERRE
  },
  calidad_herramientas: {
    palabras: ['herramientas', 'selenium', 'cypress', 'playwright', 'jmeter', 'k6', 'sonarqube', 'owasp zap', 'burp', 'appium', 'jira', 'testrail'],
    respuesta: [
      'Usamos herramientas líderes según el tipo de prueba:',
      '• Automatización: Selenium, Cypress, Playwright, JUnit.\n• Rendimiento: JMeter, Gatling, k6.\n• Seguridad: Burp Suite, OWASP ZAP, SonarQube.\n• Móvil: Appium, Detox, Espresso.\n• Gestión: JIRA, TestRail, Xray.'
    ],
    acciones: CIERRE
  },

  // ---------- Consultoría digital ----------
  consultoria: {
    palabras: ['consultoria', 'transformacion digital', 'asesoria', 'diagnostico', 'hoja de ruta', 'madurez digital', 'gestion del cambio', 'estrategia', 'consultor'],
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
  },

  // ---------- Comercial y contacto ----------
  precio: {
    palabras: ['precio', 'costo', 'cuanto cuesta', 'cuanto vale', 'cuanto cobran', 'valor', 'tarifa', 'cotizacion', 'cotizar', 'plan', 'licencia', 'mensualidad', 'inversion'],
    respuesta: [
      'Cada proyecto{servicio} se cotiza a la medida, según su alcance, por eso no manejamos precios fijos. 💬',
      'Lo mejor es una reunión virtual sin compromiso con nuestro gerente comercial: entiende tu necesidad y te prepara una propuesta.'
    ],
    acciones: CIERRE
  },
  demo: {
    palabras: ['demo', 'demostracion', 'ver funcionando', 'prueba gratis', 'probar el sistema', 'version de prueba'],
    respuesta: ['¡Con gusto te mostramos{servicio} en acción! 🚀 Agenda una reunión virtual y nuestro gerente te hace la demostración según lo que necesitas.'],
    acciones: CIERRE
  },
  agendar: {
    palabras: ['agendar', 'cita', 'reunion', 'videollamada', 'llamada', 'jitsi', 'reunirnos', 'agenda', 'separar'],
    respuesta: [
      '¡Claro! En la página de contacto eliges el día y la franja que te sirven. Te llega un correo para confirmar y nuestro gerente te envía la invitación a la videollamada en máximo ' + RESPUESTA_DIAS_HABILES + ' días hábiles.'
    ],
    acciones: CIERRE
  },
  humano: {
    palabras: ['hablar con alguien', 'persona', 'humano', 'asesor', 'gerente', 'comercial', 'vendedor', 'contactar', 'contacto', 'comunicarme', 'whatsapp', 'correo', 'email', 'escribirles'],
    respuesta: [
      'Con gusto te conecto{nombre} con nuestro gerente comercial. 🙌 {horario}',
      'Puedes escribirle por WhatsApp o dejarle un mensaje aquí y te responde a tu correo en máximo ' + RESPUESTA_DIAS_HABILES + ' días hábiles.'
    ],
    acciones: [...HUMANO, LLAMAR]
  },
  telefono: {
    palabras: ['telefono', 'celular', 'numero', 'llamar', 'llamarlos', 'marcar'],
    respuesta: [`Nuestro número es ${CONTACTO.telefono} (también es WhatsApp). 📞 {horario}`],
    acciones: [LLAMAR, WHATSAPP]
  },
  horario: {
    palabras: ['horario', 'a que hora', 'hora de atencion', 'atienden', 'abren', 'cierran', 'disponibles', 'fin de semana', 'sabado', 'domingo', 'festivos'],
    respuesta: ['Atendemos de lunes a viernes, de 8:00 a. m. a 6:00 p. m. (hora de Colombia). {horario}'],
    acciones: HUMANO
  },
  ubicacion: {
    palabras: ['donde estan', 'donde quedan', 'ubicacion', 'ubicados', 'direccion', 'oficina', 'sede', 'medellin', 'como llegar', 'mapa', 'visitarlos', 'presencial'],
    respuesta: [`Nuestra oficina está en ${CONTACTO.oficina}. 📍 Te recomiendo agendar antes de visitarnos para que el equipo te pueda atender. También atendemos en todo Colombia por videollamada.`],
    acciones: [ir('/contacto', 'Ver mapa'), AGENDAR, WHATSAPP]
  },
  privacidad: {
    palabras: ['datos personales', 'privacidad', 'habeas data', 'mis datos', 'proteccion de datos', 'borrar mis datos', 'ley 1581', 'cookies'],
    respuesta: [
      'Tratamos tus datos conforme a la Ley 1581 de 2012 y solo para lo que nos autorizas. Esta conversación no se guarda en nuestros servidores: solo vive en tu navegador mientras la pestaña esté abierta.',
      `Para consultar, corregir o eliminar tus datos escríbenos a ${CONTACTO.correo}.`
    ],
    acciones: [ir('/privacidad', 'Ver Política de Privacidad'), CORREO]
  },
  empleo: {
    palabras: ['trabajo', 'empleo', 'vacante', 'vacantes', 'hoja de vida', 'trabajar con ustedes', 'practicas', 'curriculum', 'contratan'],
    respuesta: [`¡Gracias por tu interés en ser parte de Céntrica! 💙 Puedes enviar tu hoja de vida a ${CONTACTO.correo} indicando el cargo que te interesa.`],
    acciones: [CORREO]
  }
};

/** Inactividad: primero pregunta con amabilidad, luego se despide antes de cerrar */
export const INACTIVIDAD = {
  pregunta: {
    respuesta: ['¿Sigues por aquí{nombre}? 😊 Si necesitas un momento, tranquilo; cuando quieras seguimos.'],
    acciones: [tema('sigo_aqui', 'Sigo aquí, continuar'), tema('humano', 'Prefiero hablar con una persona')]
  },
  despedida: {
    respuesta: ['Cerré el chat para no interrumpirte. 💙 Tu conversación queda guardada: ábreme cuando quieras y seguimos donde quedamos.'],
    acciones: [tema('sigo_aqui', 'Continuar la conversación'), tema('menu', 'Ver opciones')]
  }
};

/** Cuando no entiende: nunca inventa, ofrece opciones y al gerente */
export const SIN_RESPUESTA = {
  respuesta: [
    'Mmm, no estoy segura de haber entendido bien{nombre}. 🤔',
    'Puedo contarte sobre nuestros servicios, recomendarte una solución, ayudarte a agendar una reunión o pasarle tu pregunta a nuestro gerente para que te responda personalmente.'
  ],
  acciones: [tema('recomendar', '¿Qué solución necesito?'), tema('servicios', 'Ver servicios'), ...HUMANO]
};

/** Texto de los botones de sugerencia por página */
export const ETIQUETAS = {
  servicios: '¿Qué servicios ofrecen?',
  recomendar: '¿Qué solución necesito?',
  empresa: '¿Quiénes son?',
  agendar: 'Quiero agendar una reunión',
  demo: 'Quiero una demostración',
  precio: '¿Cuánto cuesta?',
  tiempos: '¿Cuánto tarda?',
  humano: 'Hablar con una persona',
  horario: '¿Cuál es el horario?',
  ubicacion: '¿Dónde están ubicados?',
  privacidad: 'Mis datos personales',
  fabrica_tecnologias: '¿Con qué tecnologías trabajan?',
  fabrica_legado: 'Tengo un sistema antiguo',
  nebula_modulos: '¿Qué módulos tiene?',
  nebula_dian: '¿Tiene facturación electrónica?',
  nebula_tributos: 'Impuestos municipales',
  sicovi: '¿Qué es SICOVI?',
  sicovi_ciudadania: '¿Qué gana la ciudadanía?',
  sicovi_medellin: '¿Dónde se usa?',
  ia_casos: '¿Para qué casos sirve?',
  ia_confianza: '¿Es confiable?',
  calidad_tipos: '¿Qué tipos de evaluación hay?',
  consultoria: '¿Qué incluye la consultoría?'
};

const SUGERENCIAS_GENERALES = ['servicios', 'recomendar', 'precio', 'humano'];

/** Contexto por página: lo que Nebulina dice al abrirse, el servicio y las preguntas que sugiere */
export const PAGINAS = {
  '/': { contexto: 'Te damos la bienvenida a Céntrica, una empresa de tecnología de Medellín.', sugerencias: ['servicios', 'recomendar', 'empresa', 'humano'] },
  '/servicios': { contexto: 'Veo que estás explorando nuestros servicios.', sugerencias: ['recomendar', 'precio', 'agendar', 'humano'] },
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

export const PAGINA_POR_DEFECTO = { contexto: '', sugerencias: SUGERENCIAS_GENERALES };
