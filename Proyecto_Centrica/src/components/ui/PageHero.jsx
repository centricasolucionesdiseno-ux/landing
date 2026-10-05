import { useRef } from 'react';
import ActionButton from './ActionButton';
import useMediaQuery from '../../hooks/useMediaQuery';

// El video 1080p solo compensa en portátiles/escritorio (pantalla ancha y
// mouse), sin ahorro de datos. Celulares y tablets usan la imagen, que pesa
// una fracción y no gasta datos móviles.
// El HTML generado y la primera pintura usan siempre la imagen (es el LCP);
// el video la reemplaza después con la misma imagen como poster, sin salto.
const CONSULTA_VIDEO = '(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
const ahorroDatos = () => typeof navigator !== 'undefined' && Boolean(navigator.connection?.saveData);

const imagenFondo = (background) => (
  <img
    className="hero-video-bg"
    src={background.src}
    srcSet={background.srcSet}
    sizes="100vw"
    alt=""
    fetchPriority="high"
    decoding="async"
  />
);

// AVIF si el navegador lo soporta; si no, WebP. Sin versión AVIF va el <img>
// solo, que React precarga desde el <head> (dentro de <picture> no lo hace)
const HeroImagen = ({ background }) =>
  background.avifSrcSet ? (
    <picture>
      <source type="image/avif" srcSet={background.avifSrcSet} sizes="100vw" />
      {imagenFondo(background)}
    </picture>
  ) : (
    imagenFondo(background)
  );

/**
 * Hero de página con video o imagen de fondo, parallax, orbes animados y
 * entrada escalonada del contenido (ver usePageAnimations).
 * `image` es { src, srcSet, avifSrc, avifSrcSet } (ver utils/heroImages); en móvil se usa en vez del video.
 * `icon` + `compact`: variante para páginas legales (más baja, con ícono).
 */
const PageHero = ({ title, subtitle, description, image, video, icon: Icon, compact = false, actions = [] }) => {
  const heroRef = useRef(null);
  const pantallaVideo = useMediaQuery(CONSULTA_VIDEO);
  const showVideo = Boolean(video) && pantallaVideo && !ahorroDatos();
  const background = image ?? {};
  const scrollPastHero = () => {
    heroRef.current?.nextElementSibling?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={`hero-video${compact ? ' hero-video--compact' : ''}`} ref={heroRef}>
      {/* La imagen es el LCP: React 19 sube este <link> al <head>. Solo hace
          falta para AVIF (el <img> solo ya lo precarga React); `type` hace que
          los navegadores sin AVIF lo ignoren y no descarguen dos veces */}
      {background.avifSrcSet && !showVideo && (
        <link rel="preload" as="image" type="image/avif" href={background.avifSrc} imageSrcSet={background.avifSrcSet} imageSizes="100vw" fetchPriority="high" />
      )}
      <div className="hero-media" data-parallax aria-hidden="true">
        {showVideo ? (
          <video className="hero-video-bg" autoPlay loop muted playsInline preload="metadata" poster={image?.src}>
            <source src={video} type="video/mp4" />
          </video>
        ) : (
          <HeroImagen background={background} />
        )}
      </div>
      <div className="hero-video-overlay" aria-hidden="true" />
      <div className="hero-orbs" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="hero-container">
        {Icon && (
          <span className="hero-icon" data-hero-item aria-hidden="true">
            <Icon size={34} strokeWidth={1.75} />
          </span>
        )}
        <h1 className="hero-title" data-hero-item>{title}</h1>
        {subtitle && <p className="hero-subtitle" data-hero-item>{subtitle}</p>}
        {description && <p className="hero-description" data-hero-item>{description}</p>}
        {actions.length > 0 && (
          <div className="hero-buttons" data-hero-item>
            {actions.map((action) => (
              <ActionButton key={action.label} {...action} />
            ))}
          </div>
        )}
      </div>

      {!compact && (
        <button type="button" className="hero-scroll-cue" onClick={scrollPastHero} aria-label="Ir al contenido" />
      )}
    </section>
  );
};

export default PageHero;
