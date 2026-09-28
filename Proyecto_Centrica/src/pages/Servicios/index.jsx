import Page from '../../components/ui/Page';
import CTASection from '../../components/ui/CTASection';
import HeroVideoSection from './components/HeroVideoSection';
import ServicesGridSection from './components/ServicesGridSection';
import ModeloEntregaSection from './components/ModeloEntregaSection';

const SEO = {
  title: 'Servicios de Tecnología para Empresas | Céntrica',
  description: 'Software a la medida, ERP, gestión legislativa, inteligencia artificial y consultoría digital para empresas y entidades públicas en Colombia.',
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
