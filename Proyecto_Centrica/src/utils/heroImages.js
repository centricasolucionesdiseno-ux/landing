// Fondos del hero servidos desde el propio sitio, en varios anchos
// (Hero-<Nombre>-<ancho>.webp). Cada pantalla descarga solo el que necesita.
const FILES = import.meta.glob('../assets/images/Imagenes/Hero/*.webp', { eager: true, import: 'default' });

const DEFAULT_WIDTH = 1280;

/** heroImage('Inicio') -> { src, srcSet } para <img> o el poster del video. */
export const heroImage = (name) => {
  const variants = Object.entries(FILES)
    .map(([path, url]) => ({ url, match: new RegExp(String.raw`/Hero-${name}-(\d+)\.webp$`).exec(path) }))
    .filter((variant) => variant.match)
    .map(({ url, match }) => ({ url, width: Number(match[1]) }))
    .sort((a, b) => a.width - b.width);

  if (variants.length === 0) throw new Error(`No hay imágenes de hero para "${name}"`);

  const fallback = variants.find((v) => v.width >= DEFAULT_WIDTH) ?? variants.at(-1);
  return {
    src: fallback.url,
    srcSet: variants.map((v) => `${v.url} ${v.width}w`).join(', ')
  };
};
