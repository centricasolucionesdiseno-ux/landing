/** Fábrica de software. */
import { ir, tema, CIERRE } from '../acciones';

export const TEMAS_FABRICA = {
  fabrica: {
    etiqueta: '¿Qué es la Fábrica de software?',
    palabras: ['fabrica', 'software a la medida', 'a la medida', 'desarrollo', 'desarrollar', 'aplicacion', 'app', 'plataforma', 'sistema', 'pagina web', 'programar', 'squads', 'software'],
    respuesta: [
      'Con nuestra Fábrica de software construimos aplicaciones a la medida con squads ágiles y la arquitectura SIMAPPE.',
      'Hacemos desarrollo desde cero (greenfield), modernización de sistemas legados y consultoría de arquitectura, con pruebas automatizadas y CI/CD en cada entrega.'
    ],
    acciones: [tema('fabrica_tecnologias', '¿Con qué tecnologías trabajan?'), tema('fabrica_legado', 'Tengo un sistema antiguo'), tema('simappe', '¿Qué es SIMAPPE?'), ir('/fabrica-software', 'Ver Fábrica de software')]
  },
  fabrica_tecnologias: {
    etiqueta: '¿Con qué tecnologías trabajan?',
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
    etiqueta: 'Tengo un sistema antiguo',
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
  }
};
