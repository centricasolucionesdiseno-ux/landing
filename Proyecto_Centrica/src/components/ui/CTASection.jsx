import ActionButton from './ActionButton';

/** Llamado a la acción final, compartido por todas las páginas. */
const CTASection = ({ id, title, text, label = 'Solicitar información', to = '/contacto' }) => (
  <section id={id} className="section bg-primary cta-section">
    <div className="container">
      <h2 className="cta-title" data-reveal>{title}</h2>
      <p className="cta-text" data-reveal>{text}</p>
      <div data-reveal="zoom">
        <ActionButton to={to} label={label} variant="light" />
      </div>
    </div>
  </section>
);

export default CTASection;
