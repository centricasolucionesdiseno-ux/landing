import { Briefcase, Cloud, Landmark, Brain, TrendingUp } from 'lucide-react';
import SectionHeader from '../../../components/ui/SectionHeader';
import FeatureCard from '../../../components/ui/FeatureCard';

const SERVICES = [
  {
    icon: Briefcase,
    title: 'Fábrica de software',
    text: 'Desarrollo ágil de aplicaciones a medida con metodologías modernas, entregas continuas y calidad asegurada en cada sprint.',
    to: '/fabrica-software'
  },
  {
    icon: Cloud,
    title: 'Nebula ERP',
    text: 'Plataforma integral de gestión empresarial que centraliza operaciones financieras, de inventarios y administrativas con IA integrada.',
    to: '/nebula-erp'
  },
  {
    icon: Landmark,
    title: 'Sicovi',
    text: 'Plataforma unificada de gestión legislativa y administrativa para Concejos Municipales y Departamentales de Colombia.',
    to: '/sicovi'
  },
  {
    icon: Brain,
    title: 'Análisis con IA',
    text: 'Implementamos inteligencia artificial para automatizar procesos, anticipar escenarios y transformar datos en decisiones precisas.',
    to: '/analisis-ia'
  },
  {
    icon: TrendingUp,
    title: 'Consultoría digital',
    text: 'Acompañamiento estratégico para tu transformación digital, desde el diagnóstico hasta la implementación de soluciones.',
    to: '/consultoria-digital'
  }
];

const ServicesGridSection = () => (
  <section id="servicios" className="section">
    <div className="container">
      <SectionHeader title={<>Nuestros <span>Servicios</span></>} />
      <div className="grid-auto">
        {SERVICES.map((service) => (
          <FeatureCard key={service.title} {...service} />
        ))}
      </div>
    </div>
  </section>
);

export default ServicesGridSection;
