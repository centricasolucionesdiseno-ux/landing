import { Shield, Zap, Users, TrendingUp } from 'lucide-react';

const ValuesSection = () => {
  const values = [
    {
      icon: Shield,
      title: 'Seguridad primero',
      description: 'La seguridad no es un complemento, es la base de cada solución que construimos.',
      delay: 0.1
    },
    {
      icon: Zap,
      title: 'Innovación constante',
      description: 'Nos mantenemos a la vanguardia tecnológica para ofrecer soluciones modernas.',
      delay: 0.2
    },
    {
      icon: Users,
      title: 'Compromiso con el cliente',
      description: 'Tu éxito es nuestro éxito. Trabajamos contigo en cada paso del camino.',
      delay: 0.3
    },
    {
      icon: TrendingUp,
      title: 'Escalabilidad garantizada',
      description: 'Nuestras soluciones crecen contigo, sin necesidad de reinventar la rueda.',
      delay: 0.4
    }
  ];

  return (
    <section id="valores" className="section bg-light" data-animation="fade-up">
      <div className="container">
        <h2 className="section-title" data-animation="fade-down">
          Nuestros <span>valores</span>
        </h2>
        <div className="grid-2">
          {values.map((value, index) => (
            <div
              key={index}
              className="card card-float"
              data-animation="fade-up"
              data-delay={value.delay}
            >
              <div className="card-icon">
                <value.icon size={32} />
              </div>
              <h3 className="card-title">{value.title}</h3>
              <p className="card-text">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
