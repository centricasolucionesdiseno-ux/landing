// Fondos del hero servidos desde el propio sitio, en varios anchos
// (Hero-<Nombre>-<ancho>.webp y .avif). Cada pantalla descarga solo el que
// necesita, en AVIF si el navegador lo soporta (pesa ~35 % menos) o en WebP.
const WEBP = import.meta.glob('../assets/images/Imagenes/Hero/*.webp', { eager: true, import: 'default' });
const AVIF = import.meta.glob('../assets/images/Imagenes/Hero/*.avif', { eager: true, import: 'default' });

const DEFAULT_WIDTH = 1280;

const variantesDe = (archivos, name, extension) =>
  Object.entries(archivos)
    .map(([path, url]) => ({ url, match: new RegExp(String.raw`/Hero-${name}-(\d+)\.${extension}$`).exec(path) }))
    .filter((variant) => variant.match)
    .map(({ url, match }) => ({ url, width: Number(match[1]) }))
    .sort((a, b) => a.width - b.width);

const srcSetDe = (variantes) => variantes.map((v) => `${v.url} ${v.width}w`).join(', ');

/** heroImage('Inicio') -> { src, srcSet, avifSrc, avifSrcSet } para <picture> o el poster del video. */
export const heroImage = (name) => {
  const variants = variantesDe(WEBP, name, 'webp');
  if (variants.length === 0) throw new Error(`No hay imágenes de hero para "${name}"`);

  const fallback = variants.find((v) => v.width >= DEFAULT_WIDTH) ?? variants.at(-1);
  const avif = variantesDe(AVIF, name, 'avif');
  const avifFallback = avif.find((v) => v.width >= DEFAULT_WIDTH) ?? avif.at(-1);
  return {
    src: fallback.url,
    srcSet: srcSetDe(variants),
    avifSrc: avifFallback?.url,
    avifSrcSet: avif.length ? srcSetDe(avif) : undefined
  };
};
