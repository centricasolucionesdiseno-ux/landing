const CTASection = () => {
  return (
    <section
      id="contacto"
      className="section bg-primary"
      style={{ textAlign: 'center' }}
      data-animation="fade-up"
    >
      <div className="container">
        <h2
          style={{ fontSize: '2rem', marginBottom: '1rem', color: 'white' }}
          data-animation="fade-down"
        >
          ¿Listo para construir el futuro con nosotros?
        </h2>
        <p
          style={{ fontSize: '1.1rem', marginBottom: '2rem', color: 'rgba(255,255,255,0.95)' }}
          data-animation="fade-up"
          data-delay="0.2"
        >
          Contáctanos y descubre cómo podemos acelerar tu próximo desarrollo.
        </p>
        <a
          href="/contacto"
          className="btn btn-primary"
          style={{ background: 'white', color: '#0e58a9' }}
          data-animation="zoom-in"
          data-delay="0.4"
        >
          Solicitar información →
        </a>
      </div>
    </section>
  );
};

export default CTASection;
