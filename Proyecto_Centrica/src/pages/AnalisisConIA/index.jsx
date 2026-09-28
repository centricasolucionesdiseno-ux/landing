import {
  FileCheck, ShieldCheck, Target, Search, Bot, Network, Settings, Clock, CircleCheck,
  Shield, BadgeCheck, Scale, TrendingUp, Landmark, Headphones, Workflow, Users, Check
} from 'lucide-react';
import Page from '../../components/ui/Page';
import PageHero from '../../components/ui/PageHero';
import { heroImage } from '../../utils/heroImages';
import SectionHeader from '../../components/ui/SectionHeader';
import FeatureCard from '../../components/ui/FeatureCard';
import FlipCard from '../../components/ui/FlipCard';
import MediaFrame from '../../components/ui/MediaFrame';
import StepsTimeline from '../../components/ui/StepsTimeline';
import Carousel from '../../components/ui/Carousel';
import CTASection from '../../components/ui/CTASection';
import Nebulina260 from '../../assets/images/Imagenes/Nebulina-Hola-260.webp';
import Nebulina500 from '../../assets/images/Imagenes/Nebulina-Hola-500.webp';
import Lente560 from '../../assets/images/Imagenes/IA-Lente-560.webp';
import Lente942 from '../../assets/images/Imagenes/IA-Lente-942.webp';

const SEO = {
  title: 'Inteligencia Artificial para Empresas | Céntrica',
  description: 'Inteligencia artificial para empresas en Colombia: copilotos de conocimiento, agentes de IA, modelos de lenguaje con RAG y operación en producción.',
  ogTitle: 'Soluciones de IA | Céntrica',
  ogDescription: 'Transformamos sus datos y procesos en decisiones accionables, con evidencia verificable en cada respuesta.',
  path: '/analisis-ia'
};

const PILARES = [
  { icon: FileCheck, title: 'Con evidencia', text: 'Cada respuesta cita su fuente de origen: documento, dato o registro verificable.' },
  { icon: ShieldCheck, title: 'Seguro', text: 'Control de acceso y trazabilidad en cada consulta, pensado para procesos de auditoría.' },
  { icon: Target, title: 'Aplicado', text: 'Enfocado en procesos y necesidades reales, no en promesas genéricas de tecnología.' }
];

const CAPACIDADES = [
  { icon: Search, etiqueta: 'Producto insignia', title: 'Copiloto de Conocimiento', text: 'Consulta en lenguaje natural sobre información y documentos, con búsqueda semántica y respuestas trazables.' },
  { icon: Bot, etiqueta: 'Automatización', title: 'Agentes de IA y Automatización', text: 'Asistentes que gestionan soporte, operaciones y flujos de trabajo, con supervisión humana.' },
  { icon: Network, etiqueta: 'Integración', title: 'Integración de Modelos de Lenguaje', text: 'GPT, Claude, Gemini y modelos abiertos integrados en sus productos ya existentes, vía RAG.' },
  { icon: Settings, etiqueta: 'Operación continua', title: 'Operación y Mejora de IA', text: 'Monitoreo, ajuste fino y control de costos de los modelos ya implementados en producción.' }
];

const BENEFICIOS = [
  {
    front: { icon: Clock, title: 'Ahorro en Búsqueda' },
    back: { icon: Search, title: '30-40%', text: 'Reducción estimada en tiempo de búsqueda y gestión de información documental.' }
  },
  {
    front: { icon: FileCheck, title: 'Evidencia Verificable' },
    back: { icon: CircleCheck, title: '100%', text: 'Respuestas con fuente citada, listas para procesos de auditoría.' }
  },
  {
    front: { icon: Shield, title: 'Cumplimiento Normativo' },
    back: { icon: BadgeCheck, title: '+', text: 'Apoyo al cumplimiento normativo y control interno.' }
  },
  {
    front: { icon: Scale, title: 'Escalabilidad' },
    back: { icon: TrendingUp, title: '∞', text: 'Escalable a nuevas fuentes de datos y casos de uso.' }
  }
];

const CASOS = [
  {
    icon: Landmark,
    title: 'Gestión Documental y Cumplimiento',
    puntos: ['Control interno y cumplimiento normativo', 'Atención de solicitudes de información', 'Trazabilidad ante entes de control'],
    etiqueta: 'Sector Público y Privado'
  },
  {
    icon: Headphones,
    title: 'Servicio al Cliente',
    puntos: ['Agentes virtuales y soporte automatizado', 'Conectados a los canales existentes', 'Con supervisión humana'],
    etiqueta: 'Automatización'
  },
  {
    icon: Workflow,
    title: 'Operaciones Internas',
    puntos: ['Automatización de flujos de trabajo', 'Integración de IA en herramientas ya en uso', 'Monitoreo y control de costos'],
    etiqueta: 'Eficiencia Operativa'
  }
];

const METODOLOGIA = [
  { title: 'Descubrimiento', text: 'Identificamos dónde la IA genera valor real en su operación.' },
  { title: 'Diseño de Datos y Modelo', text: 'Elegimos el enfoque adecuado según el caso y el presupuesto.' },
  { title: 'Construcción e Integración', text: 'Desarrollamos, entrenamos e integramos, con pruebas sobre casos reales.' },
  { title: 'Despliegue', text: 'Salida a producción con monitoreo y control desde el primer día.' },
  { title: 'Monitoreo y Evolución', text: 'Ajuste y mejora continua según el uso real.' }
];

const POR_QUE = [
  { icon: CircleCheck, title: 'Caso Validado', text: 'Trazabilidad y cumplimiento normativo, ya probado ante la Contraloría.' },
  { icon: Users, title: 'Equipo Especializado', text: 'Científicos de datos, ingenieros ML y expertos de negocio.' },
  { icon: Target, title: 'Enfoque en Resultados', text: 'Nos enfocamos en métricas de negocio, no solo en tecnología.' },
  { icon: Shield, title: 'Ética y Transparencia', text: 'Modelos explicables y cumplimiento normativo.' }
];

const casosCarrusel = CASOS.map(({ icon, title, puntos, etiqueta }) => ({
  key: title,
  contenido: (
    <FeatureCard icon={icon} title={title} className="caso-card">
      <ul className="caso-puntos">
        {puntos.map((punto) => (
          <li key={punto}><Check size={16} aria-hidden="true" /> {punto}</li>
        ))}
      </ul>
      <span className="card-badge">{etiqueta}</span>
    </FeatureCard>
  )
}));

const SolucionesIA = () => (
  <Page className="ia-page" seo={SEO}>
    <PageHero
      video="https://cdn.coverr.co/videos/coverr-ai-technology-futuristic-blue-digits-1561127177750/720p.mp4"
      image={heroImage('IA')}
      title={<>Soluciones de <span>IA</span></>}
      subtitle="IA aplicada, con trazabilidad y resultados verificables"
      description="Transformamos sus datos y procesos en decisiones accionables, mediante inteligencia artificial aplicada y con evidencia verificable en cada respuesta."
      actions={[
        { label: 'Solicitar asesoría', targetId: 'contacto' },
        { label: 'Ver casos de uso', targetId: 'casos-uso', variant: 'secondary' }
      ]}
    />

    {/* ¿Qué es Soluciones de IA? */}
    <section className="section">
      <div className="container">
        <div className="grid-2 split">
          <div>
            <h2 className="section-title" data-reveal>¿Qué es <span>Soluciones de IA</span>?</h2>
            <p className="text-lead" data-reveal>
              Es un conjunto de capacidades de inteligencia artificial diseñadas para automatizar procesos, integrar modelos de lenguaje y poner a disposición el conocimiento institucional con evidencia verificable.
            </p>
            <p className="text-lead" data-reveal>
              Nuestro enfoque combina búsqueda semántica, modelos de lenguaje y trazabilidad documental, validado ya en procesos de cumplimiento normativo y control ante entes de vigilancia como la Contraloría.
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
          <div className="media-frame" data-reveal="zoom">
            <div className="nebulina-ayuda-media ia-nebulina">
              <img
                src={Nebulina500}
                srcSet={`${Nebulina260} 260w, ${Nebulina500} 500w`}
                sizes="(max-width: 900px) 70vw, 420px"
                width="500"
                height="500"
                alt="Nebulina, la asistente virtual con IA de Céntrica"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Capacidades Clave */}
    <section className="section bg-light">
      <div className="container">
        <SectionHeader title={<>Capacidades <span>Clave</span></>} />
        <div className="grid-2">
          {CAPACIDADES.map((item) => <FeatureCard key={item.title} {...item} />)}
        </div>
      </div>
    </section>

    {/* Beneficios (Flip Cards) */}
    <section className="section">
      <div className="container">
        <SectionHeader title={<>Beneficios <span>para su Negocio</span></>} />
        <div className="grid-auto">
          {BENEFICIOS.map((beneficio) => <FlipCard key={beneficio.front.title} {...beneficio} />)}
        </div>
      </div>
    </section>

    {/* Casos de Uso (carrusel) */}
    <section id="casos-uso" className="section bg-light">
      <div className="container">
        <SectionHeader title={<>Casos de <span>Uso</span></>} />
        <Carousel items={casosCarrusel} etiqueta="Casos de uso" />
      </div>
    </section>

    {/* Nuestra Metodología */}
    <section className="section">
      <div className="container">
        <SectionHeader title={<>Nuestra <span>Metodología</span></>} />
        <StepsTimeline pasos={METODOLOGIA} />
      </div>
    </section>

    {/* ¿Por qué elegirnos? */}
    <section className="section bg-light">
      <div className="container">
        <SectionHeader title={<>¿Por qué <span>elegirnos</span>?</>} />
        <div className="grid-2 split">
          <MediaFrame
            src={Lente942}
            srcSet={`${Lente560} 560w, ${Lente942} 942w`}
            width={942}
            height={942}
            alt="Lente que analiza datos y genera predicciones"
            reveal="left"
            shadow
          />
          <div className="grid-2 grid-nested">
            {POR_QUE.map((item) => <FeatureCard key={item.title} variant="highlight" {...item} />)}
          </div>
        </div>
      </div>
    </section>

    <CTASection
      id="contacto"
      title="¿Listo para aplicar IA con resultados verificables?"
      text="Cuéntenos su caso y le mostraremos dónde la inteligencia artificial genera valor real en su operación."
      label="Solicitar asesoría"
    />
  </Page>
);

export default SolucionesIA;
