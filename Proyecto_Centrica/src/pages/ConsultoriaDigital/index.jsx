import {
  ClipboardList, Map as MapIcon, GitBranch, Users, Shield, BarChart3, Zap, TrendingUp,
  Target, CheckCircle, Rocket, DollarSign, Heart, Lock, Award, Briefcase, Handshake,
  Cloud, Database, Brain, Smartphone
} from 'lucide-react';
import Page from '../../components/ui/Page';
import PageHero from '../../components/ui/PageHero';
import { heroImage } from '../../utils/heroImages';
import SectionHeader from '../../components/ui/SectionHeader';
import FeatureCard from '../../components/ui/FeatureCard';
import FlipCard from '../../components/ui/FlipCard';
import MediaFrame from '../../components/ui/MediaFrame';
import CTASection from '../../components/ui/CTASection';
import StepsTimeline from '../../components/ui/StepsTimeline';
import Consultoria560 from '../../assets/images/Imagenes/Consultoria-560.webp';
import Consultoria1120 from '../../assets/images/Imagenes/Consultoria-1120.webp';
import Equipo560 from '../../assets/images/Imagenes/Consultoria-Equipo-560.webp';
import Equipo1120 from '../../assets/images/Imagenes/Consultoria-Equipo-1120.webp';

const SEO = {
  title: 'Consultoría en Transformación Digital | Céntrica',
  description: 'Consultoría de transformación digital en Colombia: diagnóstico de madurez, hoja de ruta tecnológica, procesos, gestión del cambio, ciberseguridad y datos.',
  ogTitle: 'Consultoría Digital | Céntrica',
  ogDescription: 'Acompañamos a las organizaciones en su evolución hacia la madurez digital con una adopción tecnológica eficiente, segura y alineada con sus objetivos.',
  path: '/consultoria-digital'
};

const PILARES = [
  { icon: MapIcon, title: 'Estrategia', text: 'Definimos la hoja de ruta tecnológica alineada a sus objetivos.' },
  { icon: Zap, title: 'Implementación', text: 'Acompañamos la ejecución de cada fase del plan.' },
  { icon: TrendingUp, title: 'Optimización', text: 'Medimos resultados y mejoramos continuamente.' }
];

const AREAS = [
  { icon: ClipboardList, title: 'Diagnóstico Digital', text: 'Evaluación exhaustiva de la madurez digital de su organización, identificando brechas, oportunidades y riesgos.' },
  { icon: MapIcon, title: 'Hoja de Ruta Tecnológica', text: 'Definición de un plan estratégico con fases claras, prioridades y métricas de éxito para su transformación digital.' },
  { icon: GitBranch, title: 'Transformación de Procesos', text: 'Rediseño de procesos operativos para aprovechar al máximo las capacidades de las tecnologías digitales.' },
  { icon: Users, title: 'Gestión del Cambio', text: 'Acompañamiento a equipos y colaboradores para asegurar la adopción exitosa de nuevas tecnologías.' },
  { icon: Shield, title: 'Ciberseguridad Estratégica', text: 'Definición de políticas y arquitecturas de seguridad alineadas con el negocio.' },
  { icon: BarChart3, title: 'Analítica y Datos', text: 'Estrategias para convertir datos en insights accionables que impulsen decisiones.' }
];

const METODOLOGIA = [
  { title: 'Descubrimiento', text: 'Entendemos su negocio, sus objetivos y los desafíos específicos que enfrenta.' },
  { title: 'Diagnóstico', text: 'Evaluamos su madurez digital, procesos, tecnología y capacidades del equipo.' },
  { title: 'Estrategia', text: 'Definimos la hoja de ruta, prioridades y métricas de éxito.' },
  { title: 'Implementación', text: 'Acompañamos la ejecución de cada fase del plan estratégico.' },
  { title: 'Medición y Evolución', text: 'Analizamos resultados y ajustamos la estrategia para mejora continua.' }
];

const BENEFICIOS = [
  {
    front: { icon: Target, title: 'Alineación Estratégica' },
    back: { icon: CheckCircle, title: '+45%', text: 'Tecnología alineada con los objetivos de negocio.' }
  },
  {
    front: { icon: Zap, title: 'Mayor Agilidad' },
    back: { icon: Rocket, title: '-60%', text: 'Capacidad de respuesta rápida ante cambios del mercado.' }
  },
  {
    front: { icon: DollarSign, title: 'ROI Optimizado' },
    back: { icon: TrendingUp, title: '+3x', text: 'Inversiones tecnológicas con retorno medible.' }
  },
  {
    front: { icon: Users, title: 'Cultura Digital' },
    back: { icon: Heart, title: '+80%', text: 'Fomento de mentalidad innovadora en la organización.' }
  },
  {
    front: { icon: Shield, title: 'Reducción de Riesgos' },
    back: { icon: Lock, title: '-70%', text: 'Identificación temprana de amenazas y mitigación proactiva.' }
  },
  {
    front: { icon: TrendingUp, title: 'Ventaja Competitiva' },
    back: { icon: Award, title: 'Liderazgo', text: 'Posicionamiento diferenciado en el mercado mediante innovación.' }
  }
];

const POR_QUE = [
  { icon: Briefcase, title: 'Experiencia Multisectorial', text: 'Conocimiento de los retos de diversos sectores y tamaños de organización, aplicado a cada proyecto.' },
  { icon: Users, title: 'Equipo Senior', text: 'Consultores con amplia experiencia en estrategia, tecnología y negocio.' },
  { icon: Target, title: 'Enfoque en Resultados', text: 'Nos medimos por el impacto real en su negocio, no solo por entregables.' },
  { icon: Handshake, title: 'Acompañamiento Continuo', text: 'Estamos con usted en cada fase, desde la estrategia hasta la ejecución.' }
];

const TECNOLOGIAS = [
  { icon: Cloud, title: 'Cloud Computing', text: 'AWS, Azure, Google Cloud' },
  { icon: Database, title: 'Data & Analytics', text: 'Big Data, BI, Data Lakes' },
  { icon: Brain, title: 'Inteligencia Artificial', text: 'ML, NLP, Visión por Computador' },
  { icon: Shield, title: 'Ciberseguridad', text: 'Zero Trust, Compliance, GRC' },
  { icon: GitBranch, title: 'DevOps & Agilidad', text: 'CI/CD, Scrum, Kanban' },
  { icon: Smartphone, title: 'Digital Experience', text: 'UX/UI, Omnicanalidad, Mobile' }
];

const ConsultoriaDigital = () => (
  <Page className="consultoria-page" seo={SEO}>
    <PageHero
      video="https://cdn.coverr.co/videos/coverr-meeting-in-a-modern-office-1582634468857/1080p.mp4"
      image={heroImage('Servicios')}
      title={<>Consultoría <span>Digital</span></>}
      subtitle="Transformación estratégica para la era digital"
      description="Acompañamos a las organizaciones en su evolución hacia la madurez digital, garantizando una adopción tecnológica eficiente, segura y alineada con sus objetivos estratégicos."
      actions={[
        { label: 'Solicitar diagnóstico', targetId: 'contacto' },
        { label: 'Ver servicios', targetId: 'servicios-c', variant: 'secondary' }
      ]}
    />

    {/* ¿Qué es la Consultoría Digital? */}
    <section className="section">
      <div className="container">
        <div className="grid-2 split">
          <div>
            <h2 className="section-title" data-reveal>¿Qué es la <span>Consultoría Digital</span>?</h2>
            <p className="text-lead" data-reveal>
              Es un servicio estratégico que ayuda a las organizaciones a navegar su transformación digital, desde la definición de la hoja de ruta hasta la implementación de soluciones tecnológicas que generan valor real y sostenible.
            </p>
            <p className="text-lead" data-reveal>
              Nuestro enfoque combina experiencia técnica, conocimiento del negocio y visión estratégica para asegurar que la tecnología sea un habilitador del crecimiento, no un fin en sí mismo.
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
            src={Consultoria1120}
            srcSet={`${Consultoria560} 560w, ${Consultoria1120} 1120w`}
            width={1120}
            height={747}
            alt="Equipo de consultoría trabajando en una reunión"
            maxWidth={500}
            shadow
          />
        </div>
      </div>
    </section>

    {/* Áreas de Consultoría */}
    <section id="servicios-c" className="section bg-light">
      <div className="container">
        <SectionHeader title={<>Áreas de <span>Consultoría</span></>} />
        <div className="grid-auto">
          {AREAS.map((item) => <FeatureCard key={item.title} {...item} />)}
        </div>
      </div>
    </section>

    {/* Nuestra Metodología */}
    <section className="section">
      <div className="container">
        <SectionHeader title={<>Nuestra <span>Metodología</span></>} />
        <StepsTimeline pasos={METODOLOGIA} />
      </div>
    </section>

    {/* Beneficios para su Organización (Flip Cards) */}
    <section className="section bg-light">
      <div className="container">
        <SectionHeader title={<>Beneficios para <span>su Organización</span></>} />
        <div className="grid-auto">
          {BENEFICIOS.map((beneficio) => <FlipCard key={beneficio.front.title} {...beneficio} />)}
        </div>
      </div>
    </section>

    {/* ¿Por qué elegirnos? */}
    <section className="section">
      <div className="container">
        <SectionHeader title={<>¿Por qué <span>elegirnos</span>?</>} />
        <div className="grid-2 split">
          <MediaFrame
            src={Equipo1120}
            srcSet={`${Equipo560} 560w, ${Equipo1120} 1120w`}
            width={1120}
            height={747}
            alt="Consultor explicando un tablero de planificación"
            reveal="left"
            shadow
          />
          <div className="grid-2 grid-nested">
            {POR_QUE.map((item) => <FeatureCard key={item.title} variant="highlight" {...item} />)}
          </div>
        </div>
      </div>
    </section>

    {/* Tecnologías Habilitadoras */}
    <section className="section bg-light">
      <div className="container">
        <SectionHeader title={<>Tecnologías <span>Habilitadoras</span></>} />
        <div className="grid-auto">
          {TECNOLOGIAS.map((item) => <FeatureCard key={item.title} variant="highlight" {...item} />)}
        </div>
      </div>
    </section>

    <CTASection
      id="contacto"
      title="¿Listo para iniciar su transformación digital?"
      text="Solicite un diagnóstico inicial sin costo y descubramos juntos las oportunidades para su organización."
      label="Solicitar diagnóstico"
    />
  </Page>
);

export default ConsultoriaDigital;
