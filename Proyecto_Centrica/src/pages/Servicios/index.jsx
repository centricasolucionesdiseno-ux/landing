import Page from '../../components/ui/Page';
import CTASection from '../../components/ui/CTASection';
import HeroVideoSection from './components/HeroVideoSection';
import ServicesGridSection from './components/ServicesGridSection';
import ModeloEntregaSection from './components/ModeloEntregaSection';

const SEO = {
  title: 'Servicios - Soluciones Empresariales | Céntrica',
  description: 'Descubre nuestros servicios tecnológicos: Fábrica de software, Nebula ERP, Sicovi, Análisis con IA y Consultoría Digital.',
  ogTitle: 'Servicios | Céntrica',
  ogDescription: 'Soluciones tecnológicas diseñadas para acelerar tu negocio, desde el desarrollo ágil hasta la consultoría estratégica.',
  path: '/servicios'
};

const Servicios = () => (
  <Page className="servicios-page" seo={SEO}>
    <HeroVideoSection />
    <ServicesGridSection />
    <ModeloEntregaSection />
    <CTASection
      title="¿Listo para transformar tu negocio?"
      text="Contáctanos y descubre cómo podemos acelerar tu próximo desarrollo."
    />
  </Page>
);

export default Servicios;
