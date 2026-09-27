import Page from '../../components/ui/Page';
import StatsBand from '../../components/ui/StatsBand';
import CTASection from '../../components/ui/CTASection';
import HeroSection from './components/HeroSection';
import VisionSection from './components/VisionSection';
import ValuesSection from './components/ValuesSection';
import NebulinaSection from './components/NebulinaSection';

const SEO = {
  title: 'Sobre Nosotros - Innovación Inteligente | Céntrica',
  description: 'Céntrica optimiza la competitividad organizacional con soluciones tecnológicas integrales: automatización, software a medida, análisis de datos e IA.',
  ogTitle: 'Sobre Nosotros | Céntrica',
  ogDescription: 'Impulsamos tu éxito a través de la innovación inteligente con soluciones tecnológicas que transforman organizaciones.',
  path: ''
};

const STATS = [
  { value: '5', label: '+ años de experiencia' },
  { value: '50', label: '+ proyectos entregados' },
  { value: '100', label: '% clientes satisfechos' },
  { value: '24', label: '/7 soporte dedicado' }
];

const SobreNosotros = () => (
  <Page className="sobre-nosotros-page" seo={SEO}>
    <HeroSection />
    <VisionSection />
    <ValuesSection />
    <StatsBand title={<>Nuestro <span>impacto</span></>} stats={STATS} />
    <NebulinaSection />
    <CTASection
      id="contacto"
      title="¿Listo para construir el futuro con nosotros?"
      text="Contáctanos y descubre cómo podemos acelerar tu próximo desarrollo."
    />
  </Page>
);

export default SobreNosotros;
