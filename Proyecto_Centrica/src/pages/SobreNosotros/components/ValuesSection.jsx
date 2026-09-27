import { Shield, Zap, Users, TrendingUp } from 'lucide-react';
import SectionHeader from '../../../components/ui/SectionHeader';
import FeatureCard from '../../../components/ui/FeatureCard';

const VALUES = [
  {
    icon: Shield,
    title: 'Seguridad primero',
    text: 'La seguridad no es un complemento, es la base de cada solución que construimos.'
  },
  {
    icon: Zap,
    title: 'Innovación constante',
    text: 'Nos mantenemos a la vanguardia tecnológica para ofrecer soluciones modernas.'
  },
  {
    icon: Users,
    title: 'Compromiso con el cliente',
    text: 'Tu éxito es nuestro éxito. Trabajamos contigo en cada paso del camino.'
  },
  {
    icon: TrendingUp,
    title: 'Escalabilidad garantizada',
    text: 'Nuestras soluciones crecen contigo, sin necesidad de reinventar la rueda.'
  }
];

const ValuesSection = () => (
  <section id="valores" className="section bg-light">
    <div className="container">
      <SectionHeader title={<>Nuestros <span>valores</span></>} />
      <div className="grid-2">
        {VALUES.map((value) => (
          <FeatureCard key={value.title} {...value} />
        ))}
      </div>
    </div>
  </section>
);

export default ValuesSection;
