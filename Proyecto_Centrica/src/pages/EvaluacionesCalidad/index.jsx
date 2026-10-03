import {
  CircleCheck, BarChart3, TrendingUp, Bug, Gauge, Shield, Smartphone, GitBranch, FileSearch,
  Award, GraduationCap, Lock, ShieldCheck, TrendingDown, Clock, Rocket, DollarSign, PiggyBank,
  Users, Smile, RefreshCw, Code2, ClipboardList, Search, FolderCheck, Repeat
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
import Pruebas560 from '../../assets/images/Imagenes/Calidad-Pruebas-560.webp';
import Pruebas1120 from '../../assets/images/Imagenes/Calidad-Pruebas-1120.webp';

const SEO = {
  title: 'Evaluaciones de Calidad de Software y QA | Céntrica',
  description: 'Aseguramiento de calidad de software en Colombia: pruebas funcionales, de rendimiento, seguridad y usabilidad, automatización y auditoría de código.',
  ogTitle: 'Evaluaciones de Calidad | Céntrica',
  ogDescription: 'Auditorías y mejoras de calidad de software que aseguran rendimiento, seguridad y mantenibilidad en cada entrega.',
  path: '/evaluaciones-calidad'
};

const PILARES = [
  { icon: CircleCheck, title: 'Prevención', text: 'Identifique y corrija defectos tempranamente.' },
  { icon: BarChart3, title: 'Medición', text: 'Métricas objetivas de calidad de software.' },
  { icon: TrendingUp, title: 'Mejora Continua', text: 'Optimización constante de procesos y productos.' }
];

const SERVICIOS = [
  { icon: Bug, title: 'Pruebas Funcionales', text: 'Validación de requisitos, pruebas de caja negra, pruebas de regresión y aceptación para garantizar que el software funciona según lo esperado.' },
  { icon: Gauge, title: 'Pruebas de Rendimiento', text: 'Pruebas de carga, estrés y resistencia para asegurar que su aplicación responde adecuadamente bajo condiciones extremas de uso.' },
  { icon: Shield, title: 'Pruebas de Seguridad', text: 'Análisis de vulnerabilidades, pruebas de penetración y auditorías de seguridad para proteger sus datos y sistemas.' },
  { icon: Smartphone, title: 'Pruebas de Usabilidad', text: 'Evaluación de experiencia de usuario, accesibilidad y satisfacción para garantizar interfaces intuitivas y efectivas.' },
  { icon: GitBranch, title: 'Automatización de Pruebas', text: 'Implementación de frameworks de automatización (Selenium, Cypress, JUnit) para pruebas continuas y regresión eficiente.' },
  { icon: FileSearch, title: 'Auditoría de Código', text: 'Revisión sistemática de código fuente para identificar malas prácticas, deuda técnica y oportunidades de mejora.' }
];

const METODOLOGIA = [
  { title: 'Análisis de Requisitos', text: 'Comprendemos las necesidades del negocio y definimos la estrategia de calidad.' },
  { title: 'Diseño de Casos de Prueba', text: 'Creamos escenarios de prueba basados en criterios de aceptación y riesgos.' },
  { title: 'Ejecución de Pruebas', text: 'Realizamos pruebas manuales y automatizadas documentando cada resultado.' },
  { title: 'Reporte y Análisis', text: 'Entregamos informes detallados con métricas, hallazgos y recomendaciones.' },
  { title: 'Seguimiento y Mejora', text: 'Acompañamos la corrección de defectos y validamos las soluciones implementadas.' }
];

const ESTANDARES = [
  { icon: Award, title: 'ISO 25000', text: 'Estándar internacional para la evaluación de la calidad del producto software.' },
  { icon: GraduationCap, title: 'ISTQB', text: 'Certificación internacional en pruebas de software.' },
  { icon: Lock, title: 'ISO 27001', text: 'Seguridad de la información aplicada a pruebas.' },
  { icon: ShieldCheck, title: 'OWASP', text: 'Estándares de seguridad en aplicaciones web.' }
];

const BENEFICIOS = [
  {
    front: { icon: CircleCheck, title: 'Reducción de Defectos' },
    back: { icon: TrendingDown, title: '-85%', text: 'Reducción de defectos en producción después de implementar nuestras evaluaciones.' }
  },
  {
    front: { icon: Clock, title: 'Time-to-Market Acelerado' },
    back: { icon: Rocket, title: '-60%', text: 'Menor tiempo en ciclos de prueba, entregas más rápidas con calidad garantizada.' }
  },
  {
    front: { icon: DollarSign, title: 'Ahorro Significativo' },
    back: { icon: PiggyBank, title: '100x', text: 'Los defectos detectados temprano cuestan hasta 100 veces menos que en producción.' }
  },
  {
    front: { icon: Users, title: 'Satisfacción del Usuario' },
    back: { icon: Smile, title: '+40%', text: 'Incremento en satisfacción de usuarios con productos confiables y sin errores.' }
  },
  {
    front: { icon: Shield, title: 'Mitigación de Riesgos' },
    back: { icon: Lock, title: '+95%', text: 'Identifique vulnerabilidades antes de que impacten su operación.' }
  },
  {
    front: { icon: TrendingUp, title: 'Mejora Continua' },
    back: { icon: RefreshCw, title: 'Procesos Optimizados', text: 'Basados en métricas objetivas y mejora constante.' }
  }
];

const HERRAMIENTAS = [
  { icon: Code2, title: 'Automatización', text: 'Selenium, Cypress, Playwright, JUnit, TestNG' },
  { icon: Gauge, title: 'Rendimiento', text: 'JMeter, Gatling, k6, LoadRunner' },
  { icon: Shield, title: 'Seguridad', text: 'Burp Suite, OWASP ZAP, SonarQube' },
  { icon: ClipboardList, title: 'Gestión', text: 'JIRA, TestRail, Xray, Zephyr' },
  { icon: GitBranch, title: 'CI/CD', text: 'Jenkins, GitHub Actions, GitLab CI' },
  { icon: Smartphone, title: 'Móvil', text: 'Appium, Detox, XCUITest, Espresso' }
];

const TIPOS = [
  { icon: Search, title: 'Diagnóstico Rápido', text: 'Evaluación exprés de 2-3 días para identificar riesgos críticos en su software.', etiqueta: 'Ideal para startups' },
  { icon: FolderCheck, title: 'Auditoría Completa', text: 'Análisis exhaustivo de calidad, seguridad y rendimiento (4-6 semanas).', etiqueta: 'Certificación ISO' },
  { icon: Repeat, title: 'QA Continuo', text: 'Servicio de aseguramiento de calidad integrado a su ciclo de desarrollo.', etiqueta: 'CI/CD Ready' },
  { icon: GraduationCap, title: 'Capacitación', text: 'Entrenamiento a su equipo interno en prácticas de pruebas de software.', etiqueta: 'Certificación ISTQB' }
];

const tiposCarrusel = TIPOS.map(({ etiqueta, ...tipo }) => ({
  key: tipo.title,
  contenido: (
    <FeatureCard {...tipo} className="caso-card">
      <span className="card-badge">{etiqueta}</span>
    </FeatureCard>
  )
}));

const EvaluacionesCalidad = () => (
  <Page className="calidad-page" seo={SEO}>
    <PageHero
      video="https://cdn.coverr.co/videos/coverr-typing-on-laptop-keyboard-1586816218985/1080p.mp4"
      image={heroImage('Calidad')}
      title={<>Evaluaciones de <span>Calidad</span></>}
      subtitle="Aseguramiento y mejora continua del software"
      description="Auditorías y mejoras de calidad de software, asegurando estándares de rendimiento, seguridad y mantenibilidad para garantizar la excelencia en cada entrega."
      actions={[
        { label: 'Solicitar auditoría', targetId: 'contacto' },
        { label: 'Ver servicios', targetId: 'servicios-q', variant: 'secondary' }
      ]}
    />

    {/* ¿Qué son las Evaluaciones de Calidad? */}
    <section className="section">
      <div className="container">
        <div className="grid-2 split">
          <div>
            <h2 className="section-title" data-reveal>¿Qué son las <span>Evaluaciones de Calidad</span>?</h2>
            <p className="text-lead" data-reveal>
              Es un conjunto de servicios especializados en el aseguramiento de la calidad del software, que incluye pruebas sistemáticas, auditorías técnicas y procesos de mejora continua para garantizar que sus aplicaciones cumplan con los más altos estándares de la industria.
            </p>
            <p className="text-lead" data-reveal>
              Aplicamos metodologías reconocidas internacionalmente (ISTQB, ISO 25000) y buenas prácticas de ingeniería de software para identificar y corregir riesgos antes de que impacten su operación.
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
            src={Pruebas1120}
            srcSet={`${Pruebas560} 560w, ${Pruebas1120} 1120w`}
            width={1120}
            height={747}
            alt="Persona señalando la pantalla de un portátil mientras revisa un software"
            maxWidth={500}
            shadow
          />
        </div>
      </div>
    </section>

    {/* Servicios de Calidad */}
    <section id="servicios-q" className="section bg-light">
      <div className="container">
        <SectionHeader title={<>Servicios de <span>Calidad</span></>} />
        <div className="grid-auto">
          {SERVICIOS.map((item) => <FeatureCard key={item.title} {...item} />)}
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

    {/* Estándares y Certificaciones */}
    <section className="section bg-light">
      <div className="container">
        <SectionHeader title={<>Estándares y <span>Certificaciones</span></>} />
        <div className="grid-2">
          {ESTANDARES.map((item) => <FeatureCard key={item.title} variant="highlight" {...item} />)}
        </div>
      </div>
    </section>

    {/* Beneficios para su Organización (Flip Cards) */}
    <section className="section">
      <div className="container">
        <SectionHeader title={<>Beneficios para <span>su Organización</span></>} />
        <div className="grid-auto">
          {BENEFICIOS.map((beneficio) => <FlipCard key={beneficio.front.title} {...beneficio} />)}
        </div>
      </div>
    </section>

    {/* Herramientas que Utilizamos */}
    <section className="section bg-light">
      <div className="container">
        <SectionHeader title={<>Herramientas que <span>Utilizamos</span></>} />
        <div className="grid-auto">
          {HERRAMIENTAS.map((item) => <FeatureCard key={item.title} variant="highlight" {...item} />)}
        </div>
      </div>
    </section>

    {/* Tipos de Evaluación (carrusel) */}
    <section className="section">
      <div className="container">
        <SectionHeader title={<>Tipos de <span>Evaluación</span></>} />
        <Carousel items={tiposCarrusel} etiqueta="Tipos de evaluación" />
      </div>
    </section>

    <CTASection
      id="contacto"
      title="¿Listo para asegurar la calidad de su software?"
      text="Agende una reunión con nuestro equipo y le proponemos la evaluación que mejor se ajusta a su producto."
      label="Solicitar auditoría"
    />
  </Page>
);

export default EvaluacionesCalidad;
