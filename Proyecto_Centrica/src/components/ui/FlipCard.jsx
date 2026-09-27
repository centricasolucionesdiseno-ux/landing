import { useState } from 'react';

/**
 * Tarjeta que gira: con hover en escritorio y con tap/teclado en cualquier
 * dispositivo. Es un <button> para que sea accesible.
 */
const FlipCard = ({ front, back }) => {
  const [flipped, setFlipped] = useState(false);
  const FrontIcon = front.icon;
  const BackIcon = back.icon;

  return (
    <button
      type="button"
      className={`card-flip${flipped ? ' flipped' : ''}`}
      onClick={() => setFlipped((value) => !value)}
      aria-pressed={flipped}
      aria-label={`${front.title}: ${back.title}. ${back.text}`}
      data-reveal
    >
      <span className="card-flip-inner">
        <span className="card-flip-front" aria-hidden="true">
          <span className="card-icon"><span className="card-icon-badge"><FrontIcon size={40} strokeWidth={1.75} /></span></span>
          <span className="card-title">{front.title}</span>
          <span className="flip-hint">
            <span className="flip-hint-mouse">← Haz clic o pasa el mouse</span>
            <span className="flip-hint-touch">Toca para ver más</span>
          </span>
        </span>
        <span className="card-flip-back" aria-hidden="true">
          <span className="card-icon"><BackIcon size={44} strokeWidth={1.75} /></span>
          <span className="card-title">{back.title}</span>
          <span className="card-text">{back.text}</span>
        </span>
      </span>
    </button>
  );
};

export default FlipCard;
