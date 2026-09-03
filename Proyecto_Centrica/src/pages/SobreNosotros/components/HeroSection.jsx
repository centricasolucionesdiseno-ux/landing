const HeroSection = () => {
  return (
    <section className="hero-video" data-animation="fade-in" data-delay="0">
      <video
        className="hero-video-bg"
        autoPlay
        loop
        muted
        playsInline
        poster="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600"
      >
        <source
          src="https://cdn.coverr.co/videos/coverr-modern-office-working-environment-1582634454963/1080p.mp4"
          type="video/mp4"
        />
      </video>
      <div className="hero-video-overlay"></div>
      <div className="hero-container">
        <h1 className="hero-title" data-animation="fade-up" data-delay="0.3">
          Acerca de <span>Céntrica</span>
        </h1>
        <p className="hero-description" data-animation="fade-up" data-delay="0.5">
          En Céntrica, desplegamos un ecosistema de soluciones diseñadas para trascender fronteras.
          Nuestra oferta integra la precisión técnica de una fábrica de software de élite con el poder
          transformador de la inteligencia artificial.
        </p>
        <div className="hero-buttons" data-animation="fade-up" data-delay="0.7">
          <a href="#vision" className="btn btn-primary">
            Conoce nuestra visión →
          </a>
          <a href="#valores" className="btn btn-secondary">
            Nuestros valores →
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
