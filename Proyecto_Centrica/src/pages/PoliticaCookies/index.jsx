import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Cookie, Info, ChartPie, Settings, SlidersHorizontal, Scale, CircleCheck, CircleX, Trash2,
  EyeOff, HardDrive, MapPin, BellRing
} from 'lucide-react';
import LegalPage from '../../components/legal/LegalPage';
import NebulinaAyuda from '../../components/common/NebulinaAyuda';
import { heroImage } from '../../utils/heroImages';
import { STORAGE_KEY as CLAVE_TEMA } from '../../hooks/useTheme';
import { BORRADOR_HORAS, CLAVE_BORRADOR, TURNSTILE_SITEKEY } from '../../config/agenda';
import { CLAVE_CONVERSACION, CLAVE_SALUDO } from '../../config/nebulina';
import { EMPRESA, COOKIES } from '../../config/legal';

const SEO = {
  title: 'Política de Cookies | Céntrica',
  description: 'Qué cookies y datos guarda el sitio de Céntrica en tu navegador, para qué sirven, cuánto duran y cómo borrarlos, conforme a la Ley 1581 de 2012 de Colombia.',
  ogTitle: 'Política de Cookies | Céntrica',
  ogDescription: 'Sin analítica, sin publicidad y sin rastreo: esto es lo único que guardamos en tu navegador.',
  path: '/cookies'
};

const RESUMEN = [
  { icon: EyeOff, texto: 'No usamos cookies de analítica, publicidad ni redes sociales.' },
  { icon: HardDrive, texto: 'Solo guardamos tu tema preferido y el borrador del formulario de citas.' },
  { icon: MapPin, texto: 'El mapa de Google en Contacto puede instalar sus propias cookies.' },
  { icon: BellRing, texto: 'Si algún día usamos cookies opcionales, te pediremos permiso antes.' }
];

// Todo lo que el sitio guarda en el navegador. Si se agrega algo nuevo, va aquí.
const ALMACENADO = [
  {
    nombre: CLAVE_TEMA,
    tipo: 'Almacenamiento local',
    finalidad: 'Recordar si prefieres el modo claro u oscuro.',
    duracion: 'Hasta que lo borres',
    titular: 'Céntrica'
  },
  {
    nombre: CLAVE_BORRADOR,
    tipo: 'Almacenamiento local',
    finalidad: 'Conservar lo que escribes en el formulario de citas si recargas o sales de la página, para preguntarte si quieres continuar. Nunca guarda tu autorización de datos.',
    duracion: `${BORRADOR_HORAS} horas, o hasta que envíes o canceles la solicitud`,
    titular: 'Céntrica'
  },
  {
    nombre: CLAVE_SALUDO,
    tipo: 'Almacenamiento de sesión',
    finalidad: 'Recordar que ya viste el saludo de Nebulina, para no mostrártelo en cada página.',
    duracion: 'Se borra al cerrar la pestaña',
    titular: 'Céntrica'
  },
  {
    nombre: CLAVE_CONVERSACION,
    tipo: 'Almacenamiento de sesión',
    finalidad: 'Conservar tu conversación con Nebulina si recargas o cambias de página. Solo está en tu navegador: no la guardamos en nuestros servidores.',
    duracion: 'Se borra al cerrar la pestaña o al pulsar "Nueva conversación"',
    titular: 'Céntrica'
  },
  {
    nombre: 'Cookies de Google Maps',
    tipo: 'Cookies de terceros',
    finalidad: 'Mostrar el mapa de nuestra oficina en la página de Contacto. Solo se cargan al llegar a esa sección.',
    duracion: 'La que defina Google',
    titular: 'Google'
  },
  ...(TURNSTILE_SITEKEY ? [{
    nombre: 'Cloudflare Turnstile',
    tipo: 'Datos técnicos de terceros',
    finalidad: 'Verificar que el formulario de citas lo envía una persona y no un programa automatizado.',
    duracion: 'La de la verificación',
    titular: 'Cloudflare'
  }] : [])
];

const TablaAlmacenado = () => (
  <div className="legal-tabla">
    <table>
      <caption className="visually-hidden">Datos que el sitio guarda en tu navegador</caption>
      <thead>
        <tr><th scope="col">Nombre</th><th scope="col">Para qué sirve</th><th scope="col">Duración</th><th scope="col">De quién</th></tr>
      </thead>
      <tbody>
        {ALMACENADO.map(({ nombre, tipo, finalidad, duracion, titular }) => (
          <tr key={nombre}>
            <th scope="row" data-label="Nombre"><code>{nombre}</code><small>{tipo}</small></th>
            <td data-label="Para qué sirve">{finalidad}</td>
            <td data-label="Duración">{duracion}</td>
            <td data-label="De quién">{titular}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Borra lo que guarda Céntrica en este navegador. Las cookies de Google o
// Cloudflare solo se pueden borrar desde el navegador.
const BorrarDatos = () => {
  const [mensaje, setMensaje] = useState('');

  const borrar = () => {
    try {
      localStorage.removeItem(CLAVE_TEMA);
      localStorage.removeItem(CLAVE_BORRADOR);
      // Versiones anteriores del sitio guardaban el borrador por sesión
      sessionStorage.removeItem(CLAVE_BORRADOR);
      sessionStorage.removeItem(CLAVE_SALUDO);
      sessionStorage.removeItem(CLAVE_CONVERSACION);
      setMensaje('Listo: borramos tu preferencia de tema y el borrador del formulario. La próxima vez que abras el sitio lo verás en modo claro.');
    } catch {
      setMensaje('Tu navegador tiene bloqueado el almacenamiento, así que no hay nada guardado.');
    }
  };

  return (
    <div className="legal-accion">
      <button type="button" className="btn btn-secondary" onClick={borrar}>
        <Trash2 size={18} aria-hidden="true" /> <span>Borrar lo que guardamos en este navegador</span>
      </button>
      <output aria-live="polite">{mensaje}</output>
    </div>
  );
};

const SECCIONES = [
  {
    id: 'que-son',
    icon: Info,
    titulo: '¿Qué son las cookies?',
    contenido: (
      <>
        <p>
          Las cookies son pequeños archivos de texto que un sitio web guarda en tu dispositivo cuando lo visitas. Otras
          tecnologías cumplen una función parecida, como el almacenamiento local y el almacenamiento de sesión del
          navegador; en esta política las tratamos igual que a las cookies.
        </p>
        <p>
          No dañan tu dispositivo y puedes borrarlas cuando quieras. En este sitio las usamos lo mínimo posible: nada
          de lo que guardamos sirve para identificarte, rastrearte ni mostrarte publicidad.
        </p>
        <h3>¿Para qué las usamos?</h3>
        <ul>
          <li>Recordar tus preferencias de navegación, como el modo claro u oscuro.</li>
          <li>Que no pierdas lo que escribiste en el formulario de citas si recargas la página.</li>
          <li>Mostrar servicios externos que forman parte del sitio, como el mapa de nuestra oficina.</li>
        </ul>
      </>
    )
  },
  {
    id: 'tipos',
    icon: ChartPie,
    titulo: 'Tipos de cookies',
    contenido: (
      <>
        <p>
          Según su finalidad, las cookies pueden ser <strong>técnicas</strong> (necesarias para que el sitio funcione),
          {' '}<strong>de preferencias</strong> (recuerdan tus elecciones), <strong>de análisis</strong> (miden cómo se usa el
          sitio), <strong>de publicidad</strong> (crean perfiles para mostrar anuncios) y <strong>de terceros</strong> (las
          gestiona un servicio externo integrado en el sitio).
        </p>
        <div className="legal-comparar">
          <div className="legal-si">
            <h3><CircleCheck size={20} aria-hidden="true" /> Lo que usamos</h3>
            <ul>
              <li>Técnicas: el borrador del formulario de citas.</li>
              <li>De preferencias: tu tema claro u oscuro.</li>
              <li>De terceros: el mapa de Google en Contacto{TURNSTILE_SITEKEY && ' y la verificación antibots de Cloudflare'}.</li>
            </ul>
          </div>
          <div className="legal-no">
            <h3><CircleX size={20} aria-hidden="true" /> Lo que no usamos</h3>
            <ul>
              <li>De análisis, como Google Analytics.</li>
              <li>De publicidad o remarketing.</li>
              <li>Botones o píxeles de redes sociales.</li>
              <li>Perfiles de navegación o venta de datos.</li>
            </ul>
          </div>
        </div>
      </>
    )
  },
  {
    id: 'que-guardamos',
    icon: Settings,
    titulo: 'Qué guardamos exactamente',
    contenido: (
      <>
        <p>
          Esta es la lista completa de lo que el sitio guarda en tu navegador. Lo que guarda Céntrica se queda solo en tu
          dispositivo: no lo enviamos a ningún servidor ni lo usamos para identificarte. Como es necesario para funciones
          que tú mismo usas, no te mostramos un aviso de aceptación.
        </p>
        <TablaAlmacenado />
        <p>
          Los servicios de terceros aplican sus propias políticas: puedes consultar la
          {' '}<a href="https://policies.google.com/technologies/cookies?hl=es" target="_blank" rel="noopener noreferrer">política de cookies de Google</a>
          {TURNSTILE_SITEKEY && (
            <> y la <a href="https://www.cloudflare.com/es-es/privacypolicy/" target="_blank" rel="noopener noreferrer">política de privacidad de Cloudflare</a></>
          )}. Si bloqueas las cookies de terceros en tu navegador, puede que el mapa no se muestre, pero el resto del sitio
          funciona igual.
        </p>
      </>
    )
  },
  {
    id: 'gestion',
    icon: SlidersHorizontal,
    titulo: 'Cómo gestionar o borrar las cookies',
    contenido: (
      <>
        <p>
          Puedes borrar en un clic lo que guarda Céntrica en este navegador. Si lo haces, el sitio seguirá funcionando
          igual: solo volverá al modo claro y el formulario de citas quedará vacío.
        </p>
        <BorrarDatos />
        <p>
          También puedes aceptar, bloquear o borrar cookies de cualquier sitio, incluidas las de terceros, desde la
          configuración de tu navegador:
        </p>
        <ul>
          <li><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies de terceros.</li>
          <li><strong>Firefox:</strong> Configuración → Privacidad y seguridad → Cookies y datos del sitio.</li>
          <li><strong>Safari en Mac:</strong> Ajustes → Privacidad → Gestionar datos de sitios web.</li>
          <li><strong>Safari en iPhone:</strong> Ajustes → Apps → Safari → Avanzado → Datos de sitios web.</li>
          <li><strong>Edge:</strong> Configuración → Cookies y permisos del sitio → Administrar y eliminar cookies.</li>
        </ul>
      </>
    )
  },
  {
    id: 'marco-legal',
    icon: Scale,
    titulo: 'Marco legal y cambios',
    contenido: (
      <>
        <p>
          En Colombia no existe una ley exclusiva sobre cookies. Cuando la información que recogen permite identificar a
          una persona, se aplica el régimen de protección de datos personales, cuya autoridad es la Superintendencia de
          Industria y Comercio (SIC). Por eso esta política sigue sus principios de finalidad, libertad, transparencia y
          seguridad, y se complementa con nuestra <Link to="/privacidad">Política de Privacidad</Link>.
        </p>
        <h3>Normativa aplicable</h3>
        <ul>
          <li>Ley 1581 de 2012 (Protección de Datos Personales).</li>
          <li>Decreto 1074 de 2015, que compiló el Decreto 1377 de 2013 sobre la autorización del titular.</li>
          <li>Ley 1480 de 2011 (Estatuto del Consumidor), sobre información en el comercio electrónico.</li>
          <li>Ley 527 de 1999 (Comercio Electrónico).</li>
        </ul>
        <h3>Si esto cambia</h3>
        <ul>
          <li>Actualizaremos la lista de lo que guardamos y la fecha de esta política.</li>
          <li>
            Antes de activar cookies opcionales, como las de análisis, te pediremos autorización previa, expresa e informada,
            con la opción de rechazarlas tan fácil como aceptarlas.
          </li>
          <li>Si rechazas las cookies opcionales, el sitio seguirá funcionando con normalidad.</li>
        </ul>
      </>
    )
  }
];

const Resumen = () => (
  <div className="legal-resumen" data-reveal>
    <h2 className="legal-resumen-titulo">En pocas palabras</h2>
    <ul>
      {RESUMEN.map(({ icon: Icon, texto }) => (
        <li key={texto}>
          <span className="legal-resumen-icono"><Icon size={20} aria-hidden="true" /></span>
          {texto}
        </li>
      ))}
    </ul>
  </div>
);

const PoliticaCookies = () => (
  <LegalPage
    className="cookies-page"
    seo={SEO}
    hero={{
      image: heroImage('Cookies'),
      icon: Cookie,
      title: <>Política de <span>Cookies</span></>,
      description: `Vigente desde el ${COOKIES.vigencia} · Última actualización: ${COOKIES.actualizacion}`
    }}
    secciones={SECCIONES}
    resumen={<Resumen />}
    lateral={
      <NebulinaAyuda
        titulo="¿Dudas sobre las cookies?"
        texto="Escríbenos y te contamos qué guardamos y por qué."
        asunto="Política de cookies"
      />
    }
    pie={
      <p className="legal-pie" data-reveal>
        {EMPRESA.razonSocial} · NIT {EMPRESA.nit} · {EMPRESA.domicilio} · Última actualización: {COOKIES.actualizacion}
      </p>
    }
  />
);

export default PoliticaCookies;
