import { CONTACTO, UBICACION } from './agenda';
import { EMPRESA } from './legal';

export const SITE_URL = 'https://centricasoluciones.com';

// Únicos dominios externos a los que el sitio puede enlazar. scripts/prerender.mjs
// hace fallar el build si aparece otro (evita que un cambio por error o
// malintencionado deje un enlace a un sitio falso o de phishing).
export const DOMINIOS_EXTERNOS = [
  'directorio-empresas.einforma.co',
  'wa.me',
  'mail.google.com',
  'www.google.com',
  'policies.google.com',
  'www.cloudflare.com'
];
export const SITE_NAME = 'Céntrica';

// Imagen al compartir el enlace (WhatsApp, LinkedIn, Facebook, X): 1200 × 630
export const OG_IMAGE = {
  url: `${SITE_URL}/og-centrica.jpg`,
  width: 1200,
  height: 630,
  alt: 'Céntrica: desarrollo de software, ERP e inteligencia artificial en Medellín, Colombia'
};

/**
 * Páginas que se generan como HTML estático en el build (scripts/prerender.mjs)
 * y van al sitemap. `carpeta` es la de src/pages; `miga` el nombre en las
 * migas de pan de Google; `servicio` marca las páginas de un servicio.
 * Al crear una página nueva se agrega aquí (y su <Route> en App.jsx).
 */
export const RUTAS = [
  { path: '/', carpeta: 'SobreNosotros', prioridad: 1.0, frecuencia: 'monthly' },
  { path: '/servicios', carpeta: 'Servicios', miga: 'Servicios', prioridad: 0.9, frecuencia: 'monthly' },
  { path: '/fabrica-software', carpeta: 'FabricaDeSoftware', miga: 'Fábrica de software', padre: '/servicios', servicio: true, prioridad: 0.9, frecuencia: 'monthly' },
  { path: '/nebula-erp', carpeta: 'NebulaERP', miga: 'Nebula ERP', padre: '/servicios', servicio: true, prioridad: 0.9, frecuencia: 'monthly' },
  { path: '/sicovi', carpeta: 'Sicovi', miga: 'SICOVI', padre: '/servicios', servicio: true, prioridad: 0.9, frecuencia: 'monthly' },
  { path: '/analisis-ia', carpeta: 'AnalisisConIA', miga: 'Soluciones de IA', padre: '/servicios', servicio: true, prioridad: 0.9, frecuencia: 'monthly' },
  { path: '/evaluaciones-calidad', carpeta: 'EvaluacionesCalidad', miga: 'Evaluaciones de calidad', padre: '/servicios', servicio: true, prioridad: 0.9, frecuencia: 'monthly' },
  { path: '/consultoria-digital', carpeta: 'ConsultoriaDigital', miga: 'Consultoría digital', padre: '/servicios', servicio: true, prioridad: 0.9, frecuencia: 'monthly' },
  { path: '/contacto', carpeta: 'AgendaTuCita', miga: 'Contacto', prioridad: 0.8, frecuencia: 'monthly' },
  { path: '/privacidad', carpeta: 'Privacidad', miga: 'Política de privacidad', prioridad: 0.3, frecuencia: 'yearly' },
  { path: '/terservicios', carpeta: 'TerminosServicio', miga: 'Términos de servicio', prioridad: 0.3, frecuencia: 'yearly' },
  { path: '/legal', carpeta: 'AvisoLegal', miga: 'Aviso legal', prioridad: 0.3, frecuencia: 'yearly' },
  { path: '/cookies', carpeta: 'PoliticaCookies', miga: 'Política de cookies', prioridad: 0.3, frecuencia: 'yearly' },
  // Sin contenido todavía: se genera (para no dar 404) pero no se indexa
  { path: '/blog', carpeta: 'EnConstruccion', noindex: true }
];

const ORG_ID = `${SITE_URL}/#organizacion`;

/** Datos estructurados (Schema.org) de la empresa: aparecen en todas las páginas. */
const organizacion = () => ({
  '@type': ['Organization', 'ProfessionalService'],
  '@id': ORG_ID,
  name: SITE_NAME,
  legalName: EMPRESA.razonSocial,
  taxID: EMPRESA.nit,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/apple-touch-icon.png`,
  image: OG_IMAGE.url,
  email: CONTACTO.correo,
  telephone: CONTACTO.telefono.replace(/\s+/g, ''),
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Cra. 82C #30-35, Belén',
    addressLocality: 'Medellín',
    addressRegion: 'Antioquia',
    addressCountry: 'CO'
  },
  geo: { '@type': 'GeoCoordinates', latitude: UBICACION.lat, longitude: UBICACION.lng },
  areaServed: { '@type': 'Country', name: 'Colombia' },
  knowsLanguage: 'es'
});

/** JSON-LD de una página: empresa + sitio + migas de pan (+ servicio). */
export const datosEstructurados = (ruta, seo) => {
  const url = `${SITE_URL}${ruta.path === '/' ? '/' : ruta.path}`;
  const grafo = [
    organizacion(),
    { '@type': 'WebSite', '@id': `${SITE_URL}/#sitio`, url: `${SITE_URL}/`, name: SITE_NAME, inLanguage: 'es-CO', publisher: { '@id': ORG_ID } },
    {
      '@type': 'WebPage',
      '@id': `${url}#pagina`,
      url,
      name: seo?.title,
      description: seo?.description,
      inLanguage: 'es-CO',
      isPartOf: { '@id': `${SITE_URL}/#sitio` },
      about: { '@id': ORG_ID }
    }
  ];

  if (ruta.path !== '/') {
    const padre = ruta.padre && RUTAS.find((r) => r.path === ruta.padre);
    const migas = [{ name: 'Inicio', url: `${SITE_URL}/` }];
    if (padre) migas.push({ name: padre.miga, url: `${SITE_URL}${padre.path}` });
    migas.push({ name: ruta.miga, url });
    grafo.push({
      '@type': 'BreadcrumbList',
      itemListElement: migas.map((m, i) => ({ '@type': 'ListItem', position: i + 1, name: m.name, item: m.url }))
    });
  }

  if (ruta.servicio) {
    grafo.push({
      '@type': 'Service',
      name: ruta.miga,
      description: seo?.description,
      url,
      provider: { '@id': ORG_ID },
      areaServed: { '@type': 'Country', name: 'Colombia' }
    });
  }

  return { '@context': 'https://schema.org', '@graph': grafo };
};
