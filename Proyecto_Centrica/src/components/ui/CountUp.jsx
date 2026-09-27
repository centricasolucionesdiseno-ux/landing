import { useEffect, useRef } from 'react';
import { loadGsap } from '../../lib/gsap';
import { prefersReducedMotion } from '../../utils/motion';

// "+99.9%" -> { prefix: '+', value: 99.9, suffix: '%', decimals: 1 }
const parseValue = (raw) => {
  const match = String(raw).match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  return {
    prefix: match[1],
    value: Number(match[2]),
    suffix: match[3],
    decimals: (match[2].split('.')[1] || '').length
  };
};

/**
 * Contador animado que arranca al entrar en pantalla. Escribe directamente
 * en el DOM (sin re-renders por frame), carga GSAP solo cuando hace falta y
 * respeta prefers-reduced-motion.
 */
const CountUp = ({ value, className = '' }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const parsed = parseValue(value);
    if (!el || !parsed || prefersReducedMotion()) return undefined;

    const counter = { current: 0 };
    const render = () => {
      el.textContent = `${parsed.prefix}${counter.current.toFixed(parsed.decimals)}${parsed.suffix}`;
    };
    render();

    let tween;
    let cancelled = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        loadGsap().then(({ gsap }) => {
          if (cancelled) return;
          tween = gsap.to(counter, { current: parsed.value, duration: 2.2, ease: 'expo.out', onUpdate: render });
        });
      },
      { rootMargin: '0px 0px -10% 0px' }
    );
    observer.observe(el);

    return () => {
      cancelled = true;
      observer.disconnect();
      tween?.kill();
      el.textContent = value;
    };
  }, [value]);

  return <span ref={ref} className={className}>{value}</span>;
};

export default CountUp;
