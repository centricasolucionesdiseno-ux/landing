import {
  Layers, Shield, FileDigit, Eye, Zap, GitPullRequest, Microchip,
  Users, GitBranch, RefreshCw, Briefcase, Landmark, Building,
  Database, Factory, Repeat, Star, GitMerge, Brain, Cloud, TrendingUp
} from 'lucide-react';
import Page from '../../components/ui/Page';
import PageHero from '../../components/ui/PageHero';
import { heroImage } from '../../utils/heroImages';
import SectionHeader from '../../components/ui/SectionHeader';
import FeatureCard from '../../components/ui/FeatureCard';
import MediaFrame from '../../components/ui/MediaFrame';
import StatsBand from '../../components/ui/StatsBand';
import CTASection from '../../components/ui/CTASection';
import Sicovi2 from '../../assets/images/Imagenes/Sicovi2.webp';
import Concejo500 from '../../assets/images/Imagenes/Sicovi-Concejo-500.webp';
import Concejo1000 from '../../assets/images/Imagenes/Sicovi-Concejo-1000.webp';

const SEO = {
  title: 'SICOVI: Gestión Legislativa para Concejos | Céntrica',
  description: 'SICOVI centraliza la gestión legislativa de Concejos Municipales y Departamentales de Colombia. Transparencia, trazabilidad y eficiencia operativa.',
  ogTitle: 'SICOVI - Sistema Concejo Visible | Céntrica',
  ogDescription: 'Plataforma integral de gestión legislativa para la transparencia ciudadana de los Concejos de Colombia.',
  path: '/sicovi'
};

const PILARES = [
  { icon: Layers, title: 'Unifica', text: 'Centraliza información de acuerdos, proyectos, sesiones, comisiones y agenda en un solo punto de acceso.' },
  { icon: Shield, title: 'Garantiza', text: 'Trazabilidad completa y acceso público a todos los procesos del Concejo en tiempo real.' },
  { icon: FileDigit, title: 'Digitaliza', text: 'Elimina silos de información y automatiza el flujo de trabajo interno del Concejo.' }
];

const VALOR = [
  { icon: Eye, title: 'Transparencia Total', text: 'Acceso ciudadano en línea a acuerdos, proyectos, sesiones y toda la actividad legislativa del Concejo.' },
  { icon: Zap, title: 'Eficiencia Operativa', text: 'Centralización de procesos que reduce duplicidades y tiempos administrativos de manera significativa.' },
  { icon: GitPullRequest, title: 'Trazabilidad y Control', text: 'Seguimiento digital completo de cada etapa legislativa con auditoría y respaldo permanente.' },
  { icon: Microchip, title: 'Modernización Tecnológica', text: 'Plataforma robusta, escalable y basada en estándares abiertos de última generación.' }
];

const OFERTA = [
  { icon: Users, title: 'Organización Especializada', text: 'Equipos funcionales (Squads) especializados por módulo: acuerdos, proyectos, sesiones, agenda y comisiones.' },
  { icon: GitBranch, title: 'Metodologías Ágiles', text: 'Trabajamos con Scrum/Kanban combinadas con DevOps para entregas rápidas, confiables y continuas.' },
  { icon: RefreshCw, title: 'Modernización Continua', text: 'Actualización constante de la plataforma con nuevas funcionalidades y mejoras de rendimiento.' }
];

const OFERTA_EXTRA = [
  { icon: GitPullRequest, title: 'Desarrollo Greenfield', text: 'Creación de nuevos módulos desde cero, adaptados a las necesidades específicas del Concejo.' },
  { icon: Briefcase, title: 'Consultoría Técnica', text: 'Acompañamiento técnico-funcional continuo para optimizar procesos y maximizar el valor de la inversión.' }
];

const SECTORES = [
  {
    icon: Landmark,
    title: 'Sector Público (Principal)',
    items: [
      ['Gobierno Local y Concejos', 'Gestión integral de acuerdos, proyectos, sesiones y comisiones con trazabilidad completa.'],
      ['Ciudadanía', 'Acceso público a información legislativa, fortaleciendo la participación ciudadana y el control social.']
    ]
  },
  {
    icon: Building,
    title: 'Sector Privado (Potencial)',
    items: [
      ['Arquitectura modular', 'Adaptable a organizaciones que requieran trazabilidad documental y gestión de procesos complejos.'],
      ['Flexibilidad', 'Implementación en corporaciones, ONGs y entidades que necesiten auditoría y transparencia.']
    ]
  }
];

const MULTI_TENENCIA = [
  { icon: Database, title: 'Flexibilidad de Datos', text: 'Soportamos múltiples motores de base de datos (PostgreSQL, Oracle, SQL Server) para adaptarnos a la infraestructura existente.' },
  { icon: Shield, title: 'Aislamiento Total', text: 'Cada Concejo posee su propia base de datos física o esquema lógico aislado. No hay mezcla de información.' },
  { icon: Zap, title: 'Conmutación Transparente', text: 'El sistema conmuta entre bases de datos en milisegundos, ofreciendo una experiencia unificada y segura.' }
];

const ACELERACION = [
  { icon: Factory, title: 'Plantillas (Archetypes)', text: 'Generación rápida de nuevos módulos con Maven archetypes.' },
  { icon: Repeat, title: 'Reutilización', text: 'Componentes comunes de seguridad, persistencia e interfaz.' },
  { icon: Star, title: 'Calidad heredada', text: 'Todo desarrollo a medida se basa en MVC + JPA + JSF, garantizando consistencia y mantenibilidad.' },
  { icon: GitMerge, title: 'CI/CD integrado', text: 'Nuevas funcionalidades se incorporan con el mismo pipeline de calidad.' }
];

const STATS = [
  { value: '-70%', label: 'Reducción en tiempos de gestión documental' },
  { value: '+100%', label: 'Mayor participación ciudadana' },
  { value: '-85%', label: 'Disminución de errores administrativos' },
  { value: '100%', label: 'Plataforma oficial de gestión legislativa' }
];

const OTROS_SERVICIOS = [
  {
    icon: Factory,
    title: 'Fábrica de Software',
    text: 'Desarrollo de soluciones tecnológicas a la medida: aplicaciones, plataformas y sistemas escalables diseñados para evolucionar con el negocio.',
    to: '/fabrica-software'
  },
  {
    icon: Cloud,
    title: 'Nebula ERP',
    text: 'Plataforma integral de gestión empresarial que centraliza operaciones, optimiza recursos y permite tomar decisiones en tiempo real con visión estratégica.',
    to: '/nebula-erp'
  },
  {
    icon: Brain,
    title: 'Soluciones de IA',
    text: 'Implementación de Inteligencia Artificial para automatizar procesos, anticipar escenarios y transformar datos en decisiones precisas.',
    to: '/analisis-ia'
  },
  {
    icon: TrendingUp,
    title: 'Consultoría digital',
    text: 'Acompañamiento estratégico en la transformación digital: desde el diagnóstico hasta la implementación y optimización de soluciones.',
    to: '/consultoria-digital'
  }
];

const Sicovi = () => (
  <Page className="sicovi-page" seo={SEO}>
    <PageHero
      image={heroImage('Sicovi')}
      title="SICOVI"
      subtitle="Sistema Concejo Visible"
      description="Plataforma unificada de gestión legislativa y administrativa para la transparencia ciudadana de los Concejos Municipales y Departamentales de Colombia."
      actions={[
        { label: 'Solicitar información', to: '/contacto' },
        { label: 'Conocer más', targetId: 'valor', variant: 'secondary' }
      ]}
    />

    {/* ¿Qué es SICOVI? */}
    <section className="section">
      <div className="container">
        <div className="grid-2 split">
          <div>
            <h2 className="section-title" data-reveal>¿Qué es <span>SICOVI</span>?</h2>
            <p className="text-lead" data-reveal>
              Plataforma integral de los Concejos Municipales y Departamentales de Colombia que centraliza, gestiona y da visibilidad a toda la actividad legislativa y administrativa, transformando la transparencia en acción.
            </p>
            <div className="icon-list">
              {PILARES.map(({ icon: Icon, title, text }) => (
                <div key={title} className="icon-list-item" data-reveal="left">
                  <span className="icon-list-icon"><Icon size={28} aria-hidden="true" /></span>
                  <div>
                    <h3>{title}</h3>
                    <p className="text-justify">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <MediaFrame
            src={Concejo1000}
            srcSet={`${Concejo500} 500w, ${Concejo1000} 1000w`}
            width={1000}
            height={1000}
            alt="SICOVI Ilustración"
            maxWidth={500}
            shadow
          />
        </div>
      </div>
    </section>

    {/* Valor */}
    <section id="valor" className="section bg-light">
      <div className="container">
        <SectionHeader title={<>Valor para <span>el Ciudadano y la Entidad</span></>} />
        <div className="grid-2">
          {VALOR.map((item) => <FeatureCard key={item.title} {...item} />)}
        </div>
      </div>
    </section>

    {/* Oferta Técnica */}
    <section className="section">
      <div className="container">
        <SectionHeader title={<>Nuestra <span>Oferta Técnica</span></>} />
        <div className="grid-auto">
          {OFERTA.map((item) => <FeatureCard key={item.title} variant="highlight" {...item} />)}
        </div>
        <div className="grid-2 grid-follow">
          {OFERTA_EXTRA.map((item) => <FeatureCard key={item.title} variant="highlight" {...item} />)}
        </div>
      </div>
    </section>

    {/* Enfoque Sectorial */}
    <section className="section bg-light">
      <div className="container">
        <SectionHeader title={<>Enfoque <span>Sectorial</span></>} />
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

    {/* Multi-tenencia */}
    <section className="section">
      <div className="container">
        <SectionHeader title={<>Multi-tenencia y <span>Flexibilidad</span></>} />
        <div className="grid-auto">
          {MULTI_TENENCIA.map((item) => <FeatureCard key={item.title} {...item} />)}
        </div>
      </div>
    </section>

    {/* Aceleración del Desarrollo a Medida */}
    <section className="section bg-light">
      <div className="container">
        <SectionHeader
          title={<>Aceleración del <span>Desarrollo a Medida</span></>}
          subtitle="Impulsado por Arquitectura Base"
          subtitleClassName="section-subtitle--accent"
        />
        <div className="grid-2 split">
          <MediaFrame src={Sicovi2} width={1024} height={1024} alt="Flor Centrica" reveal="left" />
          <div className="grid-2 grid-nested">
            {ACELERACION.map((item) => <FeatureCard key={item.title} variant="highlight" {...item} />)}
          </div>
        </div>
      </div>
    </section>

    <StatsBand title={<>Impacto en el <span>Concejo de Medellín</span></>} stats={STATS} />

    {/* Otros servicios */}
    <section className="section">
      <div className="container">
        <SectionHeader title={<>Otros <span>servicios</span></>} />
        <div className="grid-2">
          {OTROS_SERVICIOS.map((item) => <FeatureCard key={item.title} {...item} />)}
        </div>
      </div>
    </section>

    <CTASection
      title="¿Listo para transformar la gestión legislativa de su Concejo?"
      text="Contáctenos y descubra cómo SICOVI puede llevar la transparencia y eficiencia a su entidad."
      label="Solicitar información técnica"
    />
  </Page>
);

export default Sicovi;
