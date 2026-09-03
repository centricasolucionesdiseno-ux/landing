const VisionSection = () => {
  return (
    <section id="vision" className="section" data-animation="fade-up">
      <div className="container">
        <div className="grid-2">
          <div data-animation="fade-right" data-delay="0.2">
            <h3 className="section-title" style={{ textAlign: 'center' }}>
              Nuestra visión para asegurar soluciones <span>sostenibles, seguras y alineadas</span> con los objetivos de cada organización.
            </h3>
            <p style={{ textAlign: 'justify', fontSize: '1.1rem', lineHeight: '1.7', color: '#555', marginTop: '1.5rem' }}>
              Nuestra misión es optimizar la competitividad de las organizaciones nacionales e internacionales mediante
              soluciones tecnológicas integrales mediante la automatización y software a la medida, el análisis de datos
              y la implementación de IA para mantenerte un paso adelante.
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} data-animation="zoom-in" data-delay="0.3">
            <img
              src="/src/assets/images/Imagenes/SobreNosotros1.png"
              alt="Visión"
              style={{ width: '100%', maxWidth: '500px', height: 'auto', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
