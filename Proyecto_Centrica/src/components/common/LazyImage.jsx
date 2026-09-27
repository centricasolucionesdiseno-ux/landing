import { useState } from 'react';

/**
 * Imagen con carga diferida nativa y aparición suave al terminar de cargar.
 */
const LazyImage = ({ src, alt, className = '', style, eager = false, ...rest }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={() => setIsLoaded(true)}
      className={`lazy-image${isLoaded ? ' is-loaded' : ''} ${className}`.trim()}
      style={style}
      {...rest}
    />
  );
};

export default LazyImage;
