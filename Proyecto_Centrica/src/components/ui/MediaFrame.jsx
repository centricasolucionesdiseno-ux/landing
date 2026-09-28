import LazyImage from '../common/LazyImage';

// En móvil la imagen ocupa el ancho del contenedor; en escritorio, su columna (máx. maxWidth).
// maxWidth: 500 o 560 (clases .media-ancho-* en components.css)
const sizesFor = (maxWidth) => `(max-width: 900px) calc(100vw - 2rem), ${maxWidth}px`;

/**
 * Imagen ilustrativa con flotación suave y zoom al pasar el mouse.
 * width/height = tamaño intrínseco: reserva el espacio y evita saltos (CLS).
 * srcSet (opcional): versiones en varios anchos para que cada pantalla
 * descargue la adecuada sin perder nitidez.
 */
const MediaFrame = ({ src, srcSet, alt, width, height, shadow = false, maxWidth = 560, reveal = 'zoom' }) => (
  <div className="media-frame" data-reveal={reveal}>
    <LazyImage
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? sizesFor(maxWidth) : undefined}
      alt={alt}
      width={width}
      height={height}
      className={`media-ancho-${maxWidth}${shadow ? ' media-shadow' : ''}`}
    />
  </div>
);

export default MediaFrame;
