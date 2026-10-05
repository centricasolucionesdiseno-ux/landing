import Page from '../../components/ui/Page';
import StatsBand from '../../components/ui/StatsBand';
import CTASection from '../../components/ui/CTASection';
import HeroSection from './components/HeroSection';
import VisionSection from './components/VisionSection';
import ValuesSection from './components/ValuesSection';
import NebulinaSection from './components/NebulinaSection';
import { RESPUESTA_DIAS_HABILES } from '../../config/agenda';
import { SERVICIOS } from '../../config/nebulina/servicios';

const SEO = {
  title: 'Céntrica | Desarrollo de Software, ERP e IA en Medellín',
  description: 'Empresa de tecnología en Medellín, Colombia: desarrollo de software a la medida, Nebula ERP, SICOVI, inteligencia artificial y consultoría digital.',
  ogTitle: 'Sobre Nosotros | Céntrica',
  ogDescription: 'Impulsamos tu éxito a través de la innovación inteligente con soluciones tecnológicas que transforman organizaciones.',
  path: ''
};

// Solo datos verificables, que el propio sitio respalda: las líneas de
// servicio, los sectores que atendemos, el plazo de respuesta que
// comunicamos al agendar y nuestra sede
const STATS = [
  { value: String(Object.keys(SERVICIOS).length), label: 'Líneas de solución: software, ERP, SICOVI, IA, calidad y consultoría' },
  { value: '2', label: 'Sectores atendidos: empresas privadas y entidades públicas' },
  { value: String(RESPUESTA_DIAS_HABILES), label: 'Días hábiles como máximo para responder tu solicitud' },
  { value: 'Medellín', label: 'Sede principal, en Antioquia, Colombia', animar: false }
];

const SobreNosotros = () => (
  <Page className="sobre-nosotros-page" seo={SEO}>
    <HeroSection />
    <VisionSection />
    <ValuesSection />
    <StatsBand title={<>Céntrica <span>en cifras</span></>} stats={STATS} />
    <NebulinaSection />
    <CTASection
      id="contacto"
      title="¿Listo para construir el futuro con nosotros?"
      text="Contáctanos y descubre cómo podemos acelerar tu próximo desarrollo."
    />
  </Page>
);

export default SobreNosotros;
