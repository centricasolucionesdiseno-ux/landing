import PageHero from '../../../components/ui/PageHero';
import { heroImage } from '../../../utils/heroImages';

const HeroVideoSection = () => (
  <PageHero
    video="https://cdn.coverr.co/videos/coverr-office-team-working-on-laptops-1582634531069/1080p.mp4"
    image={heroImage('Servicios')}
    title={<>Nuestros <span>Servicios</span></>}
    description="Soluciones tecnológicas diseñadas para acelerar tu negocio, desde el desarrollo ágil hasta la consultoría estratégica."
    actions={[
      { label: 'Ver servicios', targetId: 'servicios' },
      { label: 'Conoce nuestro modelo', targetId: 'modelo', variant: 'secondary' }
    ]}
  />
);

export default HeroVideoSection;
