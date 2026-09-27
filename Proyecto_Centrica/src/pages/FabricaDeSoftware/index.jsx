import { Fragment } from 'react';
import {
  CalendarCheck, Layers, TrendingUp, Users, RefreshCw, Sparkles, Navigation,
  Server, Monitor, GitBranch, Boxes, ShieldCheck, Code, Tags, Wrench, Link2,
  Lock, Info, Database, CircleCheck, Shield, Zap, Target, Star, Tag, Rocket,
  Building2, Landmark
} from 'lucide-react';
import Page from '../../components/ui/Page';
import PageHero from '../../components/ui/PageHero';
import { heroImage } from '../../utils/heroImages';
import SectionHeader from '../../components/ui/SectionHeader';
import FeatureCard from '../../components/ui/FeatureCard';
import MediaFrame from '../../components/ui/MediaFrame';
import CTASection from '../../components/ui/CTASection';
import Equipo984 from '../../assets/images/Imagenes/Equipo-984.webp';
import Equipo560 from '../../assets/images/Imagenes/Equipo-560.webp';
import Fabrica2 from '../../assets/images/Imagenes/Fabrica2.webp';

const SEO = {
  title: 'Fábrica de Software - Desarrollo a Medida de Alto Nivel | Céntrica',
  description: 'Fábrica de software con células de ingeniería (Squads), metodologías ágiles y arquitectura SIMAPPE. Modernización de aplicativos y desarrollo greenfield.',
  ogTitle: 'Fábrica de Software | Céntrica',
  ogDescription: 'Desarrollo de software industrial con estándares corporativos, arquitectura moderna y equipos especializados.',
  path: '/fabrica-software'
};

const VALOR = [
  { icon: CalendarCheck, title: 'Previsibilidad', text: 'Seguridad en el cumplimiento de tiempos y presupuestos.' },
  { icon: Layers, title: 'Consistencia', text: 'Calidad técnica uniforme en cada entrega.' },
  { icon: TrendingUp, title: 'Escalabilidad', text: 'Capacidad de respuesta industrializada ante la demanda del negocio.' }
];

const OFERTA = [
  { icon: RefreshCw, title: 'Modernización de Aplicativos', text: 'Evolución de sistemas legacy hacia arquitecturas modernas y escalables.' },
  { icon: Sparkles, title: 'Desarrollo Greenfield', text: 'Construcción de soluciones innovadoras desde cero con arquitectura Cloud Native.' },
  { icon: Navigation, title: 'Consultoría de Arquitectura', text: 'Definición de mapas de ruta tecnológicos y gobierno de ecosistemas digitales.' }
];

const STACK = [
  { icon: Server, title: 'Backend', text: 'Arquitecturas robustas (Java, .NET, Node.js, Python)' },
  { icon: Monitor, title: 'Frontend', text: 'Experiencias de usuario de vanguardia (Angular, React, Vue)' },
  { icon: GitBranch, title: 'Interoperabilidad', text: 'APIs RESTful y comunicación asíncrona como estándar' },
  { icon: Boxes, title: 'Infraestructura & DevOps', text: 'Contenedores, orquestadores y CI/CD automatizado' }
];

const CALIDAD = [
  {
    icon: ShieldCheck,
    title: 'Gobernanza Técnica',
    text: 'Operamos bajo un modelo de Gobernanza de Arquitectura Estricta, donde la calidad no es un accidente, sino el resultado de procesos de ingeniería estandarizados y medibles.'
  },
  {
    icon: Code,
    title: 'Estándares de Ingeniería',
    text: 'Aplicación de patrones de diseño (Clean Code, SOLID) y arquitectura desacoplada como cimiento de cada proyecto.'
  },
  {
    icon: RefreshCw,
    title: 'SDLC Automatizado',
    text: 'Ciclo de vida de desarrollo de software soportado por flujos de CI/CD que garantizan la integridad del código en cada despliegue.'
  },
  {
    icon: Tags,
    title: 'Trazabilidad y QA',
    text: 'Implementación de pirámide de pruebas (unitarias, integración y funcionales) y auditoría constante de procesos.'
  }
];

const SIMAPPE = [
  { icon: Wrench, title: 'Mantenibilidad', text: 'Reducción drástica de la deuda técnica para el futuro del cliente.' },
  { icon: Link2, title: 'Desacoplamiento', text: 'Flexibilidad para evolucionar componentes tecnológicos sin afectar el sistema completo.' },
  { icon: Lock, title: 'Seguridad', text: 'Integración de procesos de validación y seguridad desde el diseño (Security by Design).' }
];

const CAPAS = [
  { icon: Layers, title: 'Capa 1: Simappe (El Cimiento)', text: 'Gestiona la seguridad, multi-tenancy, auditoría y servicios base.' },
  { icon: Database, title: 'Capa 2: Nebula (El Negocio)', text: 'Donde reside la lógica específica de Contabilidad, Nómina y otros procesos operativos.' }
];

const FLUJO = ['Controlador', 'Servicio', 'Componente', 'Repositorio'];

const PATRON = [
  {
    icon: CircleCheck,
    title: 'Estandarización',
    text: 'Cada funcionalidad sigue el mismo camino, lo que facilita que cualquier desarrollador pueda dar soporte a cualquier módulo.'
  },
  {
    icon: CircleCheck,
    title: 'Micro-Responsabilidades',
    text: 'Separamos la validación, la orquestación y la lógica de negocio para crear un software altamente mantenible.'
  }
];

const MULTI_TENANCY = [
  {
    icon: Database,
    title: 'Flexibilidad de Datos',
    text: 'Soportamos los motores líderes del mercado (PostgreSQL, Oracle, SQL Server) para adaptarnos a la infraestructura que el cliente ya posea.'
  },
  {
    icon: Shield,
    title: 'Aislamiento Total',
    text: 'Cada cliente (Tenant) posee su propia base de datos física o esquema lógico aislado. No hay mezcla de información.'
  },
  {
    icon: Zap,
    title: 'Seguridad Dinámica',
    text: 'El sistema conmuta entre bases de datos en milisegundos de forma transparente y segura.'
  }
];

const A_MEDIDA = [
  {
    icon: Target,
    title: 'Enfoque en el Negocio',
    text: 'Al tener la seguridad, conectividad y auditoría pre-configuradas, el equipo inicia el desarrollo de la lógica específica del cliente desde el día 1.'
  },
  {
    icon: Star,
    title: 'Calidad Nativa',
    text: 'Los desarrollos a medida heredan automáticamente todos los beneficios de la arquitectura (Resiliencia, Trazabilidad, Multi-tenancy).'
  },
  {
    icon: Tag,
    title: 'Flexibilidad Total',
    text: 'El cliente recibe un traje a la medida pero con la resistencia y estándares de una solución corporativa global.'
  },
  {
    icon: Rocket,
    title: 'Aceleración Extrema',
    text: 'Utilizamos el Simappe Archetype, una "semilla" industrial que genera la estructura de un proyecto completo con todos los estándares Nebula en segundos.'
  }
];

const SECTORES = [
  {
    icon: Building2,
    title: 'Sector Privado (Corporativo)',
    items: [
      ['Agilidad Operativa', 'Implementación de células de ingeniería (Squads) para acelerar la innovación.'],
      ['Modernización de Core', 'Transformación de sistemas legacy hacia arquitecturas modernas.'],
      ['Control con Nebula', 'Despliegue de Nebula ERP como núcleo financiero y contable.']
    ]
  },
  {
    icon: Landmark,
    title: 'Sector Público',
    items: [
      ['Transformación Digital', 'Automatización de trámites masivos bajo estándares de gobierno digital.'],
      ['Gobierno Abierto', 'Implementación de esquemas de transparencia, datos abiertos e interoperabilidad.'],
      ['Gestión con Nebula', 'Aplicación del ecosistema Nebula ERP para administración financiera con cumplimiento normativo.']
    ]
  }
];

const FabricaDeSoftware = () => (
  <Page className="fabrica-page" seo={SEO}>
    <PageHero
      image={heroImage('Fabrica')}
      title={<>Fábrica de <span>Software</span> Céntrica</>}
      subtitle="Ingeniería de Alto Nivel para Desafíos Corporativos"
      description="La industrialización de la ingeniería de software. La transición de modelos de desarrollo convencionales hacia un centro de producción basado en procesos estandarizados, medibles y optimizables."
      actions={[
        { label: 'Solicitar información', targetId: 'contacto' },
        { label: 'Conocer oferta', targetId: 'oferta', variant: 'secondary' }
      ]}
    />

    {/* Valor para el cliente */}
    <section className="section section-valor">
      <div className="container">
        <SectionHeader title={<>Valor para el <span>Cliente</span></>} />
        <div className="grid-auto">
          {VALOR.map((item) => <FeatureCard key={item.title} {...item} />)}
        </div>
      </div>
    </section>

    {/* Oferta Técnica */}
    <section id="oferta" className="section section-glow">
      <div className="container">
        <SectionHeader title={<>Nuestra <span>Oferta Técnica</span></>} light />
        <FeatureCard
          variant="accent"
          className="card-wide"
          icon={Users}
          title="Células de Ingeniería (Squads)"
          text="Equipos multidisciplinarios integrados para el desarrollo ágil de productos."
        />
        <div className="grid-auto">
          {OFERTA.map((item) => <FeatureCard key={item.title} {...item} />)}
        </div>
      </div>
    </section>

    {/* Stack Tecnológico */}
    <section className="section">
      <div className="container">
        <SectionHeader
          title={<>El <span>Stack Tecnológico</span></>}
          subtitle="Flexibilidad y Estándar - Neutralidad tecnológica orientada a la mejor solución para el reto específico, priorizando siempre la estabilidad y longevidad del software."
        />
        <div className="grid-2 split">
          <MediaFrame
            src={Equipo984}
            srcSet={`${Equipo560} 560w, ${Equipo984} 984w`}
            width={984}
            height={738}
            alt="Equipo de Céntrica"
            reveal="left"
            shadow
          />
          <div className="grid-2 grid-nested">
            {STACK.map((item) => <FeatureCard key={item.title} variant="highlight" {...item} />)}
          </div>
        </div>
      </div>
    </section>

    {/* Calidad e Ingeniería de Procesos */}
    <section className="section bg-light">
      <div className="container">
        <SectionHeader title={<>Calidad e <span>Ingeniería de Procesos</span></>} />
        <div className="grid-2">
          {CALIDAD.map((item) => <FeatureCard key={item.title} {...item} />)}
        </div>
      </div>
    </section>

    {/* Arquitectura SIMAPPE */}
    <section className="section bg-primary">
      <div className="container">
        <SectionHeader
          light
          title={<>Arquitectura <span>SIMAPPE</span></>}
          subtitle="El Motor Nebula - Nuestra arquitectura de referencia propia que asegura que todo desarrollo inicie bajo estándares de excelencia técnica."
        />
        <div className="grid-auto">
          {SIMAPPE.map((item) => <FeatureCard key={item.title} variant="glass" {...item} />)}
        </div>
        <div className="card card-glass card-callout-glass" data-reveal>
          <p>
            <Info size={20} aria-hidden="true" />
            Nebula ERP no se construye desde cero; se levanta sobre la infraestructura probada de Simappe.
          </p>
        </div>
      </div>
    </section>

    {/* Estrategia de Dos Capas */}
    <section className="section">
      <div className="container">
        <SectionHeader
          title={<>Estrategia de <span>Dos Capas</span></>}
          subtitle="SIMAPPE + NEBULA"
          subtitleClassName="section-subtitle--accent section-subtitle--lg"
        />
        <div className="grid-2">
          {CAPAS.map((item) => <FeatureCard key={item.title} {...item} />)}
        </div>
        <div className="card card-callout" data-reveal>
          <p>
            <strong>Ventaja:</strong> El equipo se enfoca 100% en resolver el problema del negocio, no en reinventar la infraestructura.
          </p>
        </div>
      </div>
    </section>

    {/* Patrón de Capas */}
    <section className="section bg-light">
      <div className="container">
        <SectionHeader
          title={<>El Patrón de <span>Capas</span></>}
          subtitle="Component Pattern - Aplicamos un flujo de ingeniería estandarizado que garantiza consistencia y mantenibilidad."
        />
        <div className="card layer-flow" data-reveal>
          {FLUJO.map((paso, index) => (
            <Fragment key={paso}>
              {index > 0 && <span className="layer-flow-arrow" aria-hidden="true">→</span>}
              <span className="layer-flow-step" style={{ '--step': index }}>{paso}</span>
            </Fragment>
          ))}
        </div>
        <div className="grid-auto">
          {PATRON.map((item) => <FeatureCard key={item.title} variant="highlight" {...item} />)}
        </div>
      </div>
    </section>

    {/* Multi-Tenancy y Multi-Motor */}
    <section className="section">
      <div className="container">
        <SectionHeader title={<>Multi-Tenancy y <span>Multi-Motor</span></>} />
        <div className="grid-auto">
          {MULTI_TENANCY.map((item) => <FeatureCard key={item.title} {...item} />)}
        </div>
      </div>
    </section>

    {/* Desarrollo a Medida */}
    <section className="section bg-light">
      <div className="container">
        <SectionHeader
          title={<>Desarrollo a <span>Medida</span></>}
          subtitle="Impulsado por SIMAPPE"
          subtitleClassName="section-subtitle--accent"
        />
        <div className="grid-2 split">
          <div className="grid-2 grid-nested">
            {A_MEDIDA.map((item) => <FeatureCard key={item.title} variant="highlight" {...item} />)}
          </div>
          <MediaFrame src={Fabrica2} width={1024} height={1024} alt="Desarrollo a Medida" reveal="right" />
        </div>
      </div>
    </section>

    {/* Enfoque Multisectorial */}
    <section className="section">
      <div className="container">
        <SectionHeader title={<>Enfoque <span>Multisectorial</span></>} />
        <div className="grid-2">
          {SECTORES.map((sector) => (
            <FeatureCard key={sector.title} variant="highlight" icon={sector.icon} title={sector.title}>
              <ul className="card-list">
                {sector.items.map(([label, text]) => (
                  <li key={label}><strong>{label}:</strong> {text}</li>
                ))}
              </ul>
            </FeatureCard>
          ))}
        </div>
      </div>
    </section>

    <CTASection
      id="contacto"
      title="¿Listo para industrializar tu desarrollo de software?"
      text="Contáctanos y descubre cómo podemos acelerar tu próximo desarrollo."
    />
  </Page>
);

export default FabricaDeSoftware;
