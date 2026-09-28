import { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import usePageAnimations from '../../hooks/usePageAnimations';
import { SITE_URL, OG_IMAGE } from '../../config/seo';

/**
 * Envoltorio de página: SEO (Helmet) + animaciones con scope propio.
 * index.html no trae título ni descripción: cada página define los suyos, así
 * nunca quedan etiquetas duplicadas. `seo.noindex` para páginas que no deben
 * salir en buscadores (404, en construcción).
 */
const Page = ({ className = '', seo, children }) => {
  const pageRef = useRef(null);
  usePageAnimations(pageRef);
  const url = seo?.path !== undefined ? `${SITE_URL}${seo.path || '/'}` : null;

  return (
    <div ref={pageRef} className={`page ${className}`.trim()}>
      {seo && (
        <Helmet>
          <title>{seo.title}</title>
          <meta name="description" content={seo.description} />
          <meta name="robots" content={seo.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'} />
          {url && <link rel="canonical" href={url} />}
          {url && <meta property="og:url" content={url} />}
          <meta property="og:title" content={seo.ogTitle ?? seo.title} />
          <meta property="og:description" content={seo.ogDescription ?? seo.description} />
          <meta property="og:image" content={OG_IMAGE.url} />
          <meta property="og:image:width" content={String(OG_IMAGE.width)} />
          <meta property="og:image:height" content={String(OG_IMAGE.height)} />
          <meta property="og:image:alt" content={OG_IMAGE.alt} />
          <meta name="twitter:title" content={seo.ogTitle ?? seo.title} />
          <meta name="twitter:description" content={seo.ogDescription ?? seo.description} />
          <meta name="twitter:image" content={OG_IMAGE.url} />
        </Helmet>
      )}
      {children}
    </div>
  );
};

export default Page;
