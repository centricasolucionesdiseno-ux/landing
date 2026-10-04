import { useEffect, useRef, useState } from 'react';
import NebulinaCuerpo from '../../../assets/images/Imagenes/Nebulina-cuerpo.webp';
import Parpados from '../../../components/nebulina/Parpados';

// Paleta tomada del PNG original de Nebulina
const LINE = '#2a3548';
const METAL = { light: '#bac7d6', base: '#a2aebd', shade: '#8c98a8', shine: '#d8e2ec' };
const HAND = { light: '#c6d3e1', base: '#abbcd1', shade: '#93a6bf', tip: '#d3dde8' };

// Dedos: [x del centro, largo, inclinación en grados]
const FINGERS = [
  [-11.5, 21, -9],
  [-3.8, 24, -3],
  [3.9, 23, 3],
  [11.2, 18, 9]
];

const Finger = ({ x, length, angle }) => {
  const top = -88 - length;
  return (
    <g transform={`rotate(${angle} ${x} -88)`}>
      <rect x={x - 4} y={top} width="8" height={length + 6} rx="4" fill={HAND.base} stroke={LINE} strokeWidth="0.9" />
      {/* Brillo de la punta y sombra lateral */}
      <rect x={x - 2.6} y={top + 1.2} width="4" height="6" rx="2" fill={HAND.tip} />
      <path d={`M${x + 2.6} ${top + 4} V${-86}`} stroke={HAND.shade} strokeWidth="1.6" strokeLinecap="round" />
      {/* Articulaciones */}
      <path d={`M${x - 3.6} ${top + length * 0.38} h7.2 M${x - 3.6} ${top + length * 0.7} h7.2`} stroke={LINE} strokeWidth="0.6" opacity="0.7" />
    </g>
  );
};

/**
 * Antebrazo levantado con la palma al frente. Unidades = píxeles del PNG
 * original; el origen (0, 0) es el centro del codo (45, 332 px). Va detrás
 * del cuerpo para que el codo original del modelo tape la unión.
 */
const WavingArm = () => (
  <svg className="nebulina-bot-arm" viewBox="-30 -125 70 140" aria-hidden="true">
    <defs>
      <clipPath id="nb-forearm">
        <path d="M-13 1 L-18.5 -54 L18.5 -54 L13 1 Z" />
      </clipPath>
      <clipPath id="nb-palm">
        <path d="M-17 -66 L17 -66 Q19 -80 16 -91 L-15.5 -91 Q-19 -80 -17 -66 Z" />
      </clipPath>
    </defs>

    {/* Antebrazo con sombreado por bandas */}
    <g clipPath="url(#nb-forearm)">
      <rect x="-20" y="-56" width="40" height="58" fill={METAL.base} />
      <path d="M-20 -56 H-7 L-9 2 H-20 Z" fill={METAL.light} />
      <path d="M9 -56 H20 V2 H10 Z" fill={METAL.shade} />
      <path d="M-11 -8 L-12.5 -50" stroke={METAL.shine} strokeWidth="2.2" strokeLinecap="round" />
    </g>
    <path d="M-13 1 L-18.5 -54 L18.5 -54 L13 1" fill="none" stroke={LINE} strokeWidth="0.9" strokeLinejoin="round" />

    {/* Puño de la muñeca, segmentado como el original */}
    <path d="M-19.5 -54 L19.5 -54 L18.5 -68 L-18.5 -68 Z" fill={METAL.base} stroke={LINE} strokeWidth="0.9" strokeLinejoin="round" />
    <path d="M-18.8 -60.5 H18.8" stroke={LINE} strokeWidth="0.7" />
    <path d="M-17.5 -66.5 H-6 V-55.5 H-18.8 Z" fill={METAL.light} opacity="0.85" />
    <path d="M10 -66.5 H17.8 L18.7 -55.5 H10 Z" fill={METAL.shade} opacity="0.85" />

    {/* Dedos (detrás de la palma) y pulgar hacia el centro del cuerpo */}
    {FINGERS.map(([x, length, angle]) => <Finger key={x} x={x} length={length} angle={angle} />)}
    <g transform="rotate(42 15 -74)">
      <rect x="11" y="-96" width="9" height="24" rx="4.5" fill={HAND.base} stroke={LINE} strokeWidth="0.9" />
      <rect x="12.6" y="-94.5" width="4.5" height="7" rx="2.2" fill={HAND.tip} />
      <path d="M11.8 -84 h7.4" stroke={LINE} strokeWidth="0.6" opacity="0.7" />
    </g>

    {/* Palma */}
    <g clipPath="url(#nb-palm)">
      <rect x="-20" y="-93" width="40" height="29" fill={HAND.base} />
      <ellipse cx="-3" cy="-80" rx="11" ry="9" fill={HAND.light} />
      <path d="M11 -93 H20 V-64 H12 Q15 -78 11 -93 Z" fill={HAND.shade} />
    </g>
    <path d="M-17 -66 L17 -66 Q19 -80 16 -91 L-15.5 -91 Q-19 -80 -17 -66" fill="none" stroke={LINE} strokeWidth="0.9" strokeLinejoin="round" />
    <path d="M-9 -76 Q-1 -71.5 8 -77" fill="none" stroke={LINE} strokeWidth="0.6" opacity="0.55" />

  </svg>
);

/**
 * Nebulina de cuerpo completo saludando. La animación solo corre mientras
 * la sección está en pantalla.
 */
const NebulinaBot = () => {
  const botRef = useRef(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const el = botRef.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(([entry]) => setIsActive(entry.isIntersecting), {
      threshold: 0.35
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={botRef} className={`nebulina-bot${isActive ? ' is-active' : ''}`}>
      <div className="nebulina-bot-figure">
        <WavingArm />
        <img
          src={NebulinaCuerpo}
          alt="Nebulina, asistente virtual de Céntrica, saludando"
          className="nebulina-bot-body"
          width="309"
          height="617"
          loading="lazy"
          decoding="async"
        />
        <Parpados variante="cuerpo" />
        <span className="nebulina-bot-glow" aria-hidden="true" />
      </div>
      <span className="nebulina-bot-shadow" aria-hidden="true" />
    </div>
  );
};

export default NebulinaBot;
