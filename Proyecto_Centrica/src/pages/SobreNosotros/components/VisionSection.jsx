import MediaFrame from '../../../components/ui/MediaFrame';
import SobreNosotros1 from '../../../assets/images/Imagenes/SobreNosotros1.webp';
import SobreNosotros500 from '../../../assets/images/Imagenes/SobreNosotros1-500.webp';

const VisionSection = () => (
  <section id="vision" className="section">
    <div className="container">
      <div className="grid-2 split">
        <div data-reveal="left">
          <h2 className="section-title">
            Nuestra visión para asegurar soluciones <span>sostenibles, seguras y alineadas</span> con los objetivos de cada organización.
          </h2>
          <p className="text-lead">
            Nuestra misión es optimizar la competitividad de las organizaciones nacionales e internacionales mediante
            soluciones tecnológicas integrales mediante la automatización y software a la medida, el análisis de datos
            y la implementación de IA para mantenerte un paso adelante.
          </p>
        </div>
        <MediaFrame
          src={SobreNosotros1}
          srcSet={`${SobreNosotros500} 500w, ${SobreNosotros1} 1000w`}
          width={1000}
          height={1000}
          alt="Visión"
          maxWidth={500}
          shadow
        />
      </div>
    </div>
  </section>
);

export default VisionSection;
