import { useEffect } from 'react';
import { prefersReducedMotion } from '../utils/motion';

const MAX_TILT = 7; // grados

const resetCard = (card) => {
  card.style.removeProperty('--rx');
  card.style.removeProperty('--ry');
};

/**
 * Inclinación 3D y "spotlight" que sigue al cursor en cualquier elemento
 * con [data-tilt]. Usa un único listener delegado en el documento, así
 * funciona para todas las cards de todas las páginas sin listeners extra.
 * El CSS lee las variables --mx, --my, --rx y --ry.
 */
export default function useCardInteractions() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;

    const tilt = !prefersReducedMotion();
    let activeCard = null;
    let lastEvent = null;
    let frame = 0;

    const update = () => {
      frame = 0;
      if (!activeCard || !lastEvent) return;
      const rect = activeCard.getBoundingClientRect();
      const px = (lastEvent.clientX - rect.left) / rect.width;
      const py = (lastEvent.clientY - rect.top) / rect.height;
      activeCard.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
      activeCard.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      if (tilt) {
        activeCard.style.setProperty('--rx', `${((0.5 - py) * MAX_TILT).toFixed(2)}deg`);
        activeCard.style.setProperty('--ry', `${((px - 0.5) * MAX_TILT).toFixed(2)}deg`);
      }
    };

    const onPointerMove = (event) => {
      const card = event.target instanceof Element ? event.target.closest('[data-tilt]') : null;
      if (card !== activeCard) {
        if (activeCard) resetCard(activeCard);
        activeCard = card;
      }
      if (!card) return;
      lastEvent = event;
      if (!frame) frame = requestAnimationFrame(update);
    };

    const onPointerLeave = () => {
      if (activeCard) resetCard(activeCard);
      activeCard = null;
    };

    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);
}
