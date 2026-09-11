const ModeloEntregaSection = () => {
  const steps = [
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="6"></circle>
          <circle cx="12" cy="12" r="2"></circle>
        </svg>
      ),
      title: '1. Diagnóstico',
      description: 'Analizamos tus necesidades y objetivos específicos.'
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="18" x2="12" y2="2"></line>
          <polyline points="6 12 12 18 18 12"></polyline>
          <line x1="12" y1="2" x2="12" y2="6"></line>
          <line x1="12" y1="13" x2="12" y2="18"></line>
        </svg>
      ),
      title: '2. Desarrollo ágil',
      description: 'Entregas continuas con metodologías modernas.'
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <path d="m9 12 2 2 4-4"></path>
        </svg>
      ),
      title: '3. Aseguramiento',
      description: 'Pruebas rigurosas y arquitectura multi-tenant probada.'
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"></path>
        </svg>
      ),
      title: '4. Soporte continuo',
      description: 'Acompañamiento y mejora constante post-lanzamiento.'
    }
  ];

  return (
    <section id="modelo" className="section bg-light">
      <div className="container">
        <h2 className="section-title">
          Un modelo <span>pensado para crecer</span>
        </h2>
        <div className="grid-2">
          {steps.map((step, index) => (
            <div key={index} className="card card-highlight card-animate">
              <div className="card-icon">{step.icon}</div>
              <h3 className="card-title">{step.title}</h3>
              <p className="card-text">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModeloEntregaSection;
