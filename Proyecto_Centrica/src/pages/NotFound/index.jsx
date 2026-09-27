import { Compass } from 'lucide-react';
import Page from '../../components/ui/Page';
import ActionButton from '../../components/ui/ActionButton';

const NotFound = () => (
  <Page className="status-page">
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
