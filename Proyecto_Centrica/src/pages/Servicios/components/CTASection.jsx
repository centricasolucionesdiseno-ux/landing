import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="section bg-primary" style={{ textAlign: 'center' }}>
      <div className="container">
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'white', fontWeight: '700' }}>
          ¿Listo para transformar tu negocio?
        </h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: 'rgba(255,255,255,0.95)' }}>
          Contáctanos y descubre cómo podemos acelerar tu próximo desarrollo.
        </p>
        <Link to="/contacto" className="btn" style={{ background: 'white', color: '#0e58a9', padding: '1rem 2.5rem', fontWeight: '600' }}>
          Solicitar información →
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
