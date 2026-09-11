const HeroVideoSection = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-video">
      <video
        className="hero-video-bg"
        autoPlay
        loop
        muted
        playsInline
        poster="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600"
      >
        <source
          src="https://cdn.coverr.co/videos/coverr-office-team-working-on-laptops-1582634531069/1080p.mp4"
          type="video/mp4"
        />
      </video>
      <div className="hero-video-overlay"></div>
      <div className="hero-container">
        <h1 className="hero-title">
          Nuestros <span>Servicios</span>
        </h1>
        <p className="hero-description">
          Soluciones tecnológicas diseñadas para acelerar tu negocio,
          desde el desarrollo ágil hasta la consultoría estratégica.
        </p>
        <div className="hero-buttons">
          <button onClick={() => scrollToSection('servicios')} className="btn btn-primary">
            Ver servicios →
          </button>
          <button onClick={() => scrollToSection('modelo')} className="btn btn-secondary">
            Conoce nuestro modelo →
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroVideoSection;
