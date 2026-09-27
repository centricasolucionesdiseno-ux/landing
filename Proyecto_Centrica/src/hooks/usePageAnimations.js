import { useLayoutEffect } from 'react';
import { loadGsap } from '../lib/gsap';
import { prefersReducedMotion } from '../utils/motion';

const STAGGER_MS = 90;
const MAX_STAGGER_STEPS = 6;
const REVEAL_MS = 800;

/**
 * Animaciones compartidas por todas las páginas:
 *  - [data-hero-item]: entrada escalonada del hero (CSS puro, ver components.css)
 *  - [data-reveal]: aparición al hacer scroll con IntersectionObserver + CSS.
 *    Solo se ocultan los elementos que están debajo del pliegue, así lo que
 *    ya se ve al entrar nunca parpadea.
 *  - [data-parallax]: parallax del hero en escritorio, con GSAP cargado en
 *    diferido (no bloquea la primera pintura).
 */
export default function usePageAnimations(scopeRef) {
  useLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!scope || prefersReducedMotion()) return undefined;

    // ---- Aparición al hacer scroll ----
    const foldLine = window.innerHeight * 0.92;
    const pending = [...scope.querySelectorAll('[data-reveal]')].filter(
      (el) => el.getBoundingClientRect().top > foldLine
    );
    pending.forEach((el) => el.classList.add('reveal-pending'));

    const timers = [];
    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
          .forEach((entry, index) => {
            const el = entry.target;
            const delay = Math.min(index, MAX_STAGGER_STEPS) * STAGGER_MS;
            observer.unobserve(el);
            el.style.setProperty('--reveal-delay', `${delay}ms`);
            el.classList.add('is-revealed');
            // Al terminar se quitan las clases: el CSS original (hover, tilt) vuelve a mandar
            timers.push(
              setTimeout(() => {
                el.classList.remove('reveal-pending', 'is-revealed');
                el.style.removeProperty('--reveal-delay');
              }, REVEAL_MS + delay + 50)
            );
          });
      },
      { rootMargin: '0px 0px -8% 0px' }
    );
    pending.forEach((el) => observer.observe(el));

    // ---- Parallax del hero (solo escritorio) ----
    let cancelled = false;
    let gsapContext;
    let refreshTimer;
    const onAssetLoad = (event) => {
      if (event.target.tagName !== 'IMG') return;
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => loadGsap().then(({ ScrollTrigger }) => ScrollTrigger.refresh()), 150);
    };

    const parallaxTargets = scope.querySelectorAll('[data-parallax]');
    if (parallaxTargets.length && window.matchMedia('(min-width: 769px)').matches) {
      loadGsap().then(({ gsap }) => {
        if (cancelled) return;
        gsapContext = gsap.context(() => {
          parallaxTargets.forEach((el) => {
            gsap.to(el, {
              yPercent: 12,
              ease: 'none',
              scrollTrigger: { trigger: el.parentElement, start: 'top top', end: 'bottom top', scrub: 0.5 }
            });
          });
        }, scope);
        // Las imágenes lazy cambian la altura del documento: recalcular posiciones
        scope.addEventListener('load', onAssetLoad, true);
      });
    }

    return () => {
      cancelled = true;
      observer.disconnect();
      timers.forEach(clearTimeout);
      clearTimeout(refreshTimer);
      scope.removeEventListener('load', onAssetLoad, true);
      gsapContext?.revert();
      pending.forEach((el) => {
        el.classList.remove('reveal-pending', 'is-revealed');
        el.style.removeProperty('--reveal-delay');
      });
    };
  }, [scopeRef]);
}
