import { Construction } from 'lucide-react';
import Page from '../../components/ui/Page';
import ActionButton from '../../components/ui/ActionButton';

/** Página temporal para secciones que aún no tienen contenido. */
const EnConstruccion = ({ title }) => (
  <Page className="status-page">
    <section className="section">
      <div className="container status-content">
        <span className="status-icon" data-reveal="zoom"><Construction size={48} aria-hidden="true" /></span>
        <h1 className="section-title" data-reveal>{title}</h1>
        <p className="section-subtitle" data-reveal>Página en construcción...</p>
        <div data-reveal>
          <ActionButton to="/servicios" label="Ver nuestros servicios" />
        </div>
      </div>
    </section>
  </Page>
);

export default EnConstruccion;
