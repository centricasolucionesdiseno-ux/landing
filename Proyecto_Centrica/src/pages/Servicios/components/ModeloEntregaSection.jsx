import { Target, ArrowDownToLine, ShieldCheck, Headphones } from 'lucide-react';
import SectionHeader from '../../../components/ui/SectionHeader';
import FeatureCard from '../../../components/ui/FeatureCard';

const STEPS = [
  { icon: Target, title: '1. Diagnóstico', text: 'Analizamos tus necesidades y objetivos específicos.' },
  { icon: ArrowDownToLine, title: '2. Desarrollo ágil', text: 'Entregas continuas con metodologías modernas.' },
  { icon: ShieldCheck, title: '3. Aseguramiento', text: 'Pruebas rigurosas y arquitectura multi-tenant probada.' },
  { icon: Headphones, title: '4. Soporte continuo', text: 'Acompañamiento y mejora constante post-lanzamiento.' }
];

const ModeloEntregaSection = () => (
  <section id="modelo" className="section bg-light">
    <div className="container">
      <SectionHeader title={<>Un modelo <span>pensado para crecer</span></>} />
      <div className="grid-2 steps-grid">
        {STEPS.map((step) => (
          <FeatureCard key={step.title} variant="highlight" {...step} />
        ))}
      </div>
    </div>
  </section>
);

export default ModeloEntregaSection;
