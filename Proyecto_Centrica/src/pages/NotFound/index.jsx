import { Compass } from 'lucide-react';
import Page from '../../components/ui/Page';
import ActionButton from '../../components/ui/ActionButton';

const SEO = {
  title: 'Página no encontrada | Céntrica',
  description: 'La página que buscas no existe o fue movida. Vuelve al inicio para conocer las soluciones de Céntrica.',
  noindex: true
};

const NotFound = () => (
  <Page className="status-page" seo={SEO}>
    <section className="section">
      <div className="container status-content">
        <span className="status-icon" data-reveal="zoom"><Compass size={48} aria-hidden="true" /></span>
        <h1 className="section-title" data-reveal>Página no <span>encontrada</span></h1>
        <p className="section-subtitle" data-reveal>La página que buscas no existe o fue movida.</p>
        <div data-reveal>
          <ActionButton to="/" label="Volver al inicio" />
        </div>
      </div>
    </section>
  </Page>
);

export default NotFound;
