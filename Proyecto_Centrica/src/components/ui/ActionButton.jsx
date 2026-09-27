import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { scrollToId } from '../../utils/scroll';

/**
 * Botón de acción con flecha animada. Según las props navega con el router
 * (to), abre un enlace normal (href) o hace scroll a una sección (targetId).
 */
const ActionButton = ({ label, to, href, targetId, variant = 'primary', className = '' }) => {
  const classes = `btn btn-${variant} ${className}`.trim();
  const content = (
    <>
      <span>{label}</span>
      <ArrowRight className="btn-arrow" size={18} aria-hidden="true" />
    </>
  );

  if (to) return <Link to={to} className={classes}>{content}</Link>;
  if (href) return <a href={href} className={classes}>{content}</a>;
  return (
    <button type="button" className={classes} onClick={() => scrollToId(targetId)}>
      {content}
    </button>
  );
};

export default ActionButton;
