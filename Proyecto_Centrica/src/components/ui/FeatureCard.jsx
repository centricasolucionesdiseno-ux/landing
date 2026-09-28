import ActionButton from './ActionButton';

/**
 * Card interactiva (tilt 3D + spotlight vía data-tilt, aparición vía data-reveal).
 * Variantes: float | highlight | glass (sobre fondos azules) | accent (degradado).
 * `etiqueta`: texto corto sobre el título (p. ej. "Producto insignia").
 */
const FeatureCard = ({
  icon: Icon,
  etiqueta,
  title,
  text,
  note,
  children,
  variant = 'float',
  to,
  linkLabel = 'Conocer más',
  className = ''
}) => (
  <article className={`card card-${variant} ${className}`.trim()} data-tilt data-reveal>
    {Icon && (
      <div className="card-icon">
        <span className="card-icon-badge">
          <Icon size={40} strokeWidth={1.75} aria-hidden="true" />
        </span>
      </div>
    )}
    {etiqueta && <span className="card-etiqueta">{etiqueta}</span>}
    {title && <h3 className="card-title">{title}</h3>}
    {text && <p className="card-text">{text}</p>}
    {note && <p className="card-text card-note">{note}</p>}
    {children}
    {to && (
      <div className="card-actions">
        <ActionButton to={to} label={linkLabel} />
      </div>
    )}
  </article>
);

export default FeatureCard;
