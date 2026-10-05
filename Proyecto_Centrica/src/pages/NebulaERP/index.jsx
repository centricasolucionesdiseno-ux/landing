import {
  BarChart3, Brain, Shield, LineChart, GanttChart, Landmark,
  TrendingUp, Eye, GitPullRequest, ShieldCheck, Scale, Smartphone,
  Zap, CheckCircle, Layers, Settings, Clock, FileCheck, Monitor,
  Calculator, Wallet, Receipt, Briefcase, Users, Warehouse,
  Factory, Home, Handshake, Building, Database, Cloud
} from 'lucide-react';
import Page from '../../components/ui/Page';
import PageHero from '../../components/ui/PageHero';
import { heroImage } from '../../utils/heroImages';
import SectionHeader from '../../components/ui/SectionHeader';
import FeatureCard from '../../components/ui/FeatureCard';
import FlipCard from '../../components/ui/FlipCard';
import MediaFrame from '../../components/ui/MediaFrame';
import StatsBand from '../../components/ui/StatsBand';
import CTASection from '../../components/ui/CTASection';
import Nebula1 from '../../assets/images/Imagenes/Nebula1.webp';
import Nebula2 from '../../assets/images/Imagenes/Nebula2.webp';
import Nebula1Chica from '../../assets/images/Imagenes/Nebula1-500.webp';
import Nebula1Media from '../../assets/images/Imagenes/Nebula1-720.webp';
import Nebula2Chica from '../../assets/images/Imagenes/Nebula2-512.webp';
import Nebula2Media from '../../assets/images/Imagenes/Nebula2-720.webp';

const SEO = {
  title: 'Nebula ERP: Software de Gestión Empresarial | Céntrica',
  description: 'Nebula ERP centraliza finanzas, inventarios y procesos administrativos de tu empresa en Colombia, con IA integrada y reportes en tiempo real.',
  ogTitle: 'Nebula ERP - Plataforma de Gestión Empresarial | Céntrica',
  ogDescription: 'ERP integral para gestión financiera, administrativa y tributaria con inteligencia artificial.',
  path: '/nebula-erp'
};

const SOLUCIONES = [
  {
    icon: LineChart,
    title: 'Gestión Financiera',
    text: 'Unifica la visión contable, el control presupuestario, la facturación y la tesorería en una sola plataforma, garantizando el cumplimiento fiscal y la información en tiempo real.',
    note: 'Módulos: Contabilidad, Presupuesto, Tesorería y Facturación.'
  },
  {
    icon: GanttChart,
    title: 'Gestión Administrativa',
    text: 'Unifica la gestión de personas (nómina y talento humano) con la administración de recursos tangibles (suministros y activos), reduciendo costos operativos y silos de información.',
    note: 'Módulos: Nómina, Talento Humano y Suministros y Activos.'
  },
  {
    icon: Landmark,
    title: <>Nebula Rentas <small className="card-title-tag">(Sector Público)</small></>,
    key: 'rentas',
    text: 'Moderniza la gestión tributaria de su institución: liquidación automatizada de ICA, control riguroso del impuesto predial y flexibilidad en los acuerdos de pago.',
    note: 'Módulos: Industria y Comercio (ICA), Impuesto Predial y Acuerdos de Pago.'
  }
];

const CAPACIDADES = [
  { icon: Brain, title: 'Inteligencia Artificial Integrada', text: 'Análisis predictivo, detección de anomalías y automatización de procesos repetitivos.' },
  { icon: BarChart3, title: 'Reportes en Tiempo Real', text: 'Dashboards interactivos, reportes personalizables e indicadores clave de rendimiento (KPIs).' },
  { icon: Shield, title: 'Seguridad Multi-Tenant', text: 'Aislamiento total de datos, auditoría completa y cifrado de información en cada solución.' }
];

const MODULOS = [
  {
    categoria: 'Gestión Financiera',
    items: [
      { icon: Calculator, title: 'Módulo Contable Inteligente', lead: 'Cumplimiento total y control estratégico en un solo lugar.', text: 'Automatiza el registro de transacciones y centraliza la operación financiera.' },
      { icon: Wallet, title: 'Tesorería', lead: 'El motor de su estabilidad.', text: 'Visibilidad en tiempo real de obligaciones a corto y largo plazo, con generación de archivos planos para pagos masivos.' },
      { icon: Receipt, title: 'Facturación', lead: 'El motor inteligente detrás de sus finanzas.', text: 'Cumplimiento nativo con el ecosistema de facturación electrónica de la DIAN.' },
      { icon: Scale, title: 'Gestión Presupuestaria 360°', lead: 'Control total para gobiernos y empresas.', text: 'Sector Público (GRP) y Sector Privado (ERP) con centros de costo y rentabilidad.' }
    ]
  },
  {
    categoria: 'Gestión Administrativa',
    items: [
      { icon: Briefcase, title: 'Nómina', lead: 'Pagos a tiempo, cumplimiento garantizado.', text: 'Procese nóminas complejas, genere reportes financieros detallados y garantice el cumplimiento de obligaciones.' },
      { icon: Users, title: 'Talento Humano', lead: 'Su equipo en sintonía.', text: 'Digitalice el ciclo de vida de sus colaboradores: expedientes, evaluaciones de desempeño y clima laboral.' },
      { icon: Warehouse, title: 'Suministros y Activos', lead: 'Sus recursos bajo control, en tiempo real.', text: 'Gestione el ciclo de vida completo de activos fijos y optimice sus inventarios.' }
    ]
  },
  {
    categoria: 'Nebula Rentas (Sector Público)',
    items: [
      { icon: Factory, title: 'Industria y Comercio (ICA)', text: 'Liquidación automatizada del Impuesto de Industria y Comercio, para maximizar los ingresos y simplificar los trámites.' },
      { icon: Home, title: 'Impuesto Predial', text: 'Control riguroso del Impuesto Predial, con trazabilidad y reducción de la cartera morosa.' },
      { icon: Handshake, title: 'Acuerdos de Pago', text: 'Flexibilidad para formalizar acuerdos de pago que acercan la administración al ciudadano.' }
    ]
  }
];

const ARQUITECTURA = [
  { icon: Layers, title: 'SIMAPPE - El Cimiento', text: 'Gestiona la seguridad, multi-tenancy, auditoría y servicios base que toda aplicación empresarial requiere.' },
  { icon: Cloud, title: 'Nebula - El Negocio', text: 'Contiene la lógica específica de Contabilidad, Nómina, Inventarios y demás procesos operativos.' }
];

const MULTI_TENANCY = [
  { icon: Database, title: 'Flexibilidad de Datos', text: 'Soportamos los motores líderes del mercado (PostgreSQL, Oracle, SQL Server) para adaptarnos a su infraestructura existente.' },
  { icon: Shield, title: 'Aislamiento Total', text: 'Cada cliente posee su propia base de datos física o esquema lógico aislado. No hay mezcla de información.' },
  { icon: Zap, title: 'Conmutación Transparente', text: 'El sistema conmuta entre bases de datos en milisegundos, ofreciendo una experiencia unificada y segura.' }
];

const BENEFICIOS = [
  {
    front: { icon: TrendingUp, title: 'Eficiencia Operativa' },
    back: { icon: Zap, title: '-70%', text: 'Automatice procesos repetitivos y reduzca tiempos de ejecución.' }
  },
  {
    front: { icon: Eye, title: 'Visibilidad Total' },
    back: { icon: BarChart3, title: '360°', text: 'Acceda a información consolidada de toda la organización desde un solo lugar.' }
  },
  {
    front: { icon: GitPullRequest, title: 'Toma de Decisiones Ágil' },
    back: { icon: Clock, title: 'Tiempo Real', text: 'Reportes en tiempo real e indicadores clave al alcance de su mano.' }
  },
  {
    front: { icon: ShieldCheck, title: 'Cumplimiento Normativo' },
    back: { icon: FileCheck, title: '100%', text: 'Auditoría completa y trazabilidad de cada transacción para cumplir con requisitos legales.' }
  },
  {
    front: { icon: Scale, title: 'Escalabilidad Garantizada' },
    back: { icon: TrendingUp, title: 'Ilimitado', text: 'La plataforma crece con su negocio, sin necesidad de migraciones complejas.' }
  },
  {
    front: { icon: Smartphone, title: 'Acceso Multiplataforma' },
    back: { icon: Monitor, title: 'Anywhere', text: 'Disponible en web, dispositivos móviles y tabletas, con experiencia de usuario consistente.' }
  }
];

const SECTORES = [
  {
    icon: Building,
    title: 'Sector Privado',
    items: [
      ['Manufactura', 'Control de producción, costos y cadena de suministro.'],
      ['Retail', 'Gestión multicanal, inventarios y promociones.'],
      ['Servicios', 'Facturación recurrente, proyectos y CRM integrado.'],
      ['Construcción', 'Control de obras, presupuestos y subcontratistas.']
    ]
  },
  {
    icon: Landmark,
    title: 'Sector Público',
    items: [
      ['Presupuesto', 'Ejecución presupuestal y control de gasto público.'],
      ['Contratación', 'Gestión de procesos de contratación estatal.'],
      ['Tesorería', 'Administración de recursos y pagos a proveedores.'],
      ['Transparencia', 'Portales de datos abiertos y rendición de cuentas.']
    ]
  }
];

const POR_QUE = [
  { icon: CheckCircle, title: 'Arquitectura Moderna', text: 'Construido sobre SIMAPPE, no hereda deuda técnica de sistemas legacy.' },
  { icon: Brain, title: 'IA Integrada', text: 'A diferencia de otros ERPs, Nebula incorpora inteligencia artificial en el núcleo.' },
  { icon: Layers, title: 'Multi-Tenancy Nativa', text: 'Diseñado desde cero para servir a múltiples clientes con aislamiento total.' },
  { icon: Settings, title: 'Personalizable', text: 'Sin necesidad de costosos desarrollos, la plataforma se adapta a sus procesos.' }
];

const STATS = [
  { value: '+40%', label: 'Incremento en eficiencia operativa' },
  { value: '-50%', label: 'Reducción en tiempos de cierre contable' },
  { value: '+99.9%', label: 'Disponibilidad garantizada' },
  { value: '+60%', label: 'Mejora en precisión de inventarios' }
];

const NebulaERP = () => (
  <Page className="nebula-page" seo={SEO}>
    <PageHero
      image={heroImage('Nebula')}
      title={<>Nebula <span>ERP</span></>}
      subtitle="Plataforma integral de gestión empresarial"
      description="Centraliza operaciones financieras, de inventarios y administrativas en un solo ecosistema, con inteligencia artificial integrada y reportes en tiempo real."
      actions={[
        { label: 'Solicitar demo', to: '/contacto' },
        { label: 'Conocer características', targetId: 'caracteristicas', variant: 'secondary' }
      ]}
    />

    {/* ¿Qué es Nebula ERP? */}
    <section className="section section-dark">
      <div className="container">
        <div className="grid-2 split">
          <div data-reveal="left">
            <h2 className="section-title section-title--light">¿Qué es <span>Nebula ERP</span>?</h2>
            <p className="text-lead">
              Nebula ERP reúne en una sola plataforma la operación financiera, administrativa y tributaria
              de su organización. A través de tres soluciones principales —Gestión Financiera, Gestión
              Administrativa y Nebula Rentas— elimina los silos de información y maximiza la eficiencia operativa.
            </p>
            <p className="text-lead">
              Construida sobre la arquitectura SIMAPPE, Nebula hereda automáticamente capacidades de
              multi-tenancy, seguridad avanzada y auditoría completa, permitiendo que su equipo se enfoque
              en lo que realmente importa: hacer crecer su negocio.
            </p>
          </div>
          <MediaFrame
            src={Nebula1}
            srcSet={`${Nebula1Chica} 500w, ${Nebula1Media} 720w, ${Nebula1} 1000w`}
            width={1000}
            height={1000}
            alt="Nebula ERP Ilustración"
            maxWidth={500}
            shadow
          />
        </div>
      </div>
    </section>

    {/* Soluciones Principales */}
    <section id="caracteristicas" className="section bg-light">
      <div className="container">
        <SectionHeader
          title={<>Soluciones <span>Principales</span></>}
          subtitle="Tres soluciones integradas, con los módulos que integra cada una."
        />
        <div className="grid-auto">
          {SOLUCIONES.map(({ key, ...item }) => <FeatureCard key={key || item.title} {...item} />)}
        </div>
      </div>
    </section>

    {/* Capacidades Transversales */}
    <section className="section">
      <div className="container">
        <SectionHeader
          title={<>Capacidades <span>Transversales</span></>}
          subtitle="Presentes en las tres soluciones, sin importar cuál implemente primero."
        />
        <div className="grid-auto">
          {CAPACIDADES.map((item) => <FeatureCard key={item.title} {...item} />)}
        </div>
      </div>
    </section>

    {/* Módulos Especializados */}
    <section className="section bg-light">
      <div className="container">
        <SectionHeader title={<>Módulos <span>Especializados</span></>} />
        {MODULOS.map((grupo) => (
          <div key={grupo.categoria} className="modulo-grupo">
            <h3 className="modulo-categoria" data-reveal>{grupo.categoria}</h3>
            <div className="grid-2">
              {grupo.items.map(({ lead, text, ...item }) => (
                <FeatureCard key={item.title} variant="highlight" {...item}>
                  <p className="card-text">
                    {lead && <><strong>{lead}</strong> </>}
                    {text}
                  </p>
                </FeatureCard>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Arquitectura SIMAPPE + Nebula */}
    <section className="section section-glow">
      <div className="container">
        <SectionHeader light title={<>La <span>Arquitectura</span> detrás de Nebula</>} />
        <div className="grid-2">
          {ARQUITECTURA.map((item) => <FeatureCard key={item.title} variant="glass" {...item} />)}
        </div>
        <div className="card card-glass card-callout-glass" data-reveal>
          <p>
            <strong>Ventaja competitiva:</strong> Su equipo se enfoca 100% en resolver el problema del negocio, no en reinventar la infraestructura técnica.
          </p>
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

    {/* Beneficios para el Negocio (Flip Cards) */}
    <section className="section bg-light">
      <div className="container">
        <SectionHeader title={<>Beneficios para <span>su Negocio</span></>} />
        <div className="grid-auto">
          {BENEFICIOS.map((beneficio) => <FlipCard key={beneficio.front.title} {...beneficio} />)}
        </div>
      </div>
    </section>

    {/* Casos de Uso por Sector */}
    <section className="section">
      <div className="container">
        <SectionHeader title={<>Nebula en <span>Acción</span></>} />
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

    {/* ¿Por qué Nebula ERP? */}
    <section className="section bg-light">
      <div className="container">
        <SectionHeader title={<>¿Por qué <span>Nebula ERP</span>?</>} />
        <div className="grid-2 split">
          <MediaFrame
            src={Nebula2}
            srcSet={`${Nebula2Chica} 512w, ${Nebula2Media} 720w, ${Nebula2} 1024w`}
            width={1024}
            height={1024}
            alt="Nebula ERP"
            reveal="left"
          />
          <div className="grid-2 grid-nested">
            {POR_QUE.map((item) => <FeatureCard key={item.title} variant="highlight" {...item} />)}
          </div>
        </div>
      </div>
    </section>

    <StatsBand title={<>Resultados <span>Medibles</span></>} stats={STATS} />

    <CTASection
      title="¿Listo para transformar la gestión de su empresa?"
      text="Solicite una demo personalizada y descubra cómo Nebula ERP puede optimizar sus operaciones."
      label="Solicitar información técnica"
    />
  </Page>
);

export default NebulaERP;
