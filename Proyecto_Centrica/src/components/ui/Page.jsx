import { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import usePageAnimations from '../../hooks/usePageAnimations';

const SITE_URL = 'https://centricasoluciones.com';

/** Envoltorio de página: SEO (Helmet) + animaciones con scope propio. */
const Page = ({ className = '', seo, children }) => {
  const pageRef = useRef(null);
  usePageAnimations(pageRef);

  return (
    <div ref={pageRef} className={`page ${className}`.trim()}>
      {seo && (
        <Helmet>
          <title>{seo.title}</title>
          <meta name="description" content={seo.description} />
          <meta property="og:title" content={seo.ogTitle} />
          <meta property="og:description" content={seo.ogDescription} />
          <meta property="og:url" content={`${SITE_URL}${seo.path}`} />
          <link rel="canonical" href={`${SITE_URL}${seo.path}`} />
        </Helmet>
      )}
      {children}
    </div>
  );
};

export default Page;
