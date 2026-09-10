import { Helmet } from 'react-helmet-async';
import HeroSection from './components/HeroSection';
import VisionSection from './components/VisionSection';
import ValuesSection from './components/ValuesSection';
import StatsSection from './components/StatsSection';
import NebulinaSection from './components/NebulinaSection';
import CTASection from './components/CTASection';

const SobreNosotros = () => {
  return (
    <>
      <Helmet>
        <title>Sobre Nosotros - Innovación Inteligente | Céntrica</title>
        <meta name="description" content="Céntrica optimiza la competitividad organizacional con soluciones tecnológicas integrales: automatización, software a medida, análisis de datos e IA." />
        <meta property="og:title" content="Sobre Nosotros | Céntrica" />
        <meta property="og:description" content="Impulsamos tu éxito a través de la innovación inteligente con soluciones tecnológicas que transforman organizaciones." />
        <link rel="canonical" href="https://centricasoluciones.com" />
      </Helmet>
      <HeroSection />
      <VisionSection />
      <ValuesSection />
      <StatsSection />
      <NebulinaSection />
      <CTASection />
    </>
  );
};

export default SobreNosotros;
