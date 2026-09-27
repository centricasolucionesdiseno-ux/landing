import PageHero from '../../../components/ui/PageHero';
import { heroImage } from '../../../utils/heroImages';

const HeroSection = () => (
  <PageHero
    video="https://cdn.coverr.co/videos/coverr-modern-office-working-environment-1582634454963/1080p.mp4"
    image={heroImage('Inicio')}
    title={<>Acerca de <span>Céntrica</span></>}
    description="En Céntrica, desplegamos un ecosistema de soluciones diseñadas para trascender fronteras. Nuestra oferta integra la precisión técnica de una fábrica de software de élite con el poder transformador de la inteligencia artificial."
    actions={[
      { label: 'Conoce nuestra visión', targetId: 'vision' },
      { label: 'Nuestros valores', targetId: 'valores', variant: 'secondary' }
    ]}
  />
);

export default HeroSection;
