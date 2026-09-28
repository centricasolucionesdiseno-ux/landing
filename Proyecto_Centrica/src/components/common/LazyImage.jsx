import { useCallback, useState } from 'react';

/**
 * Imagen con carga diferida nativa y aparición suave al terminar de cargar.
 * Con el HTML generado en el build la imagen puede terminar de cargar antes de
 * que React tome la página (y nunca vería el onLoad): la ref lo detecta.
 */
const LazyImage = ({ src, alt, className = '', eager = false, ...rest }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const detectarCargada = useCallback((img) => {
    if (img?.complete && img.naturalWidth > 0) setIsLoaded(true);
  }, []);

  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      ref={detectarCargada}
      onLoad={() => setIsLoaded(true)}
      className={`lazy-image${isLoaded ? ' is-loaded' : ''} ${className}`.trim()}
      {...rest}
    />
  );
};

export default LazyImage;
