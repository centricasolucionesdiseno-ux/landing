import { Link } from 'react-router-dom';

const ServicesGridSection = () => {
  const services = [
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
      ),
      title: 'Fábrica de software',
      description: 'Desarrollo ágil de aplicaciones a medida con metodologías modernas, entregas continuas y calidad asegurada en cada sprint.',
      link: '/fabrica-software'
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
        </svg>
      ),
      title: 'Nebula ERP',
      description: 'Plataforma integral de gestión empresarial que centraliza operaciones financieras, de inventarios y administrativas con IA integrada.',
      link: '/nebula-erp'
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ),
      title: 'Sicovi',
      description: 'Plataforma unificada de gestión legislativa y administrativa para Concejos Municipales y Departamentales de Colombia.',
      link: '/sicovi'
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path>
          <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path>
        </svg>
      ),
      title: 'Análisis con IA',
      description: 'Implementamos inteligencia artificial para automatizar procesos, anticipar escenarios y transformar datos en decisiones precisas.',
      link: '/analisis-ia'
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 11l3 3L22 4"></path>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
        </svg>
      ),
      title: 'Evaluaciones de Calidad',
      description: 'Auditorías y mejoras de calidad de software, asegurando estándares de rendimiento, seguridad y mantenibilidad.',
      link: '/evaluaciones-calidad'
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
          <polyline points="17 6 23 6 23 12"></polyline>
        </svg>
      ),
      title: 'Consultoría digital',
      description: 'Acompañamiento estratégico para tu transformación digital, desde el diagnóstico hasta la implementación de soluciones.',
      link: '/contacto'
    }
  ];

  return (
    <section id="servicios" className="section">
      <div className="container">
        <h2 className="section-title">
          Nuestros <span>Servicios</span>
        </h2>
        <div className="grid-auto">
          {services.map((service, index) => (
            <div key={index} className="card card-float card-animate">
              <div className="card-icon">{service.icon}</div>
              <h3 className="card-title">{service.title}</h3>
              <p className="card-text">{service.description}</p>
              <Link to={service.link} className="btn" style={{ marginTop: '1rem', background: '#0e58a9', color: 'white' }}>
                Conocer más →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGridSection;
