import {
  Shield, ShieldCheck, Calendar, Building2, Database, CircleCheck, Share2, Lock,
  Cookie, Users, Ban, EyeOff, UserCheck
} from 'lucide-react';
import LegalPage from '../../components/legal/LegalPage';
import NebulinaAyuda from '../../components/common/NebulinaAyuda';
import { EmailLink } from '../../components/common/ContactLinks';
import { heroImage } from '../../utils/heroImages';
import { EMPRESA, PRIVACIDAD } from '../../config/legal';
import { TURNSTILE_SITEKEY } from '../../config/agenda';

const SEO = {
  title: 'Política de Privacidad y Tratamiento de Datos | Céntrica',
  description: 'Cómo Céntrica recopila, usa y protege tus datos personales conforme a la Ley 1581 de 2012, y cómo puedes ejercer tus derechos de habeas data.',
  ogTitle: 'Política de Privacidad | Céntrica',
  ogDescription: 'Qué datos recopilamos, para qué los usamos y cómo ejercer tus derechos sobre ellos.',
  path: '/privacidad'
};

// Gmail en el computador, app de correo en el celular; asunto ya puesto
const Correo = () => <EmailLink para={EMPRESA.correo} asunto="Habeas data" />;

const RESUMEN = [
  { icon: UserCheck, texto: 'Solo usamos los datos que nos das para atender tu solicitud.' },
  { icon: Ban, texto: 'No vendemos, alquilamos ni cedemos tus datos personales.' },
  { icon: EyeOff, texto: 'Sin cookies de rastreo ni publicidad.' },
  { icon: ShieldCheck, texto: 'Puedes consultar, corregir o eliminar tus datos cuando quieras.' }
];

const SECCIONES = [
  {
    id: 'vigencia',
    icon: Calendar,
    titulo: 'Fecha de vigencia',
    contenido: (
      <>
        <p>
          La presente Política de Tratamiento de Datos Personales entra en vigor el <strong>{PRIVACIDAD.vigencia}</strong> y
          se aplica a los datos que Céntrica recibe a través de {EMPRESA.sitio}. Describe qué datos recopilamos, para qué
          los usamos, cómo los protegemos y cómo puedes ejercer tus derechos, conforme a la Ley 1581 de 2012, el Decreto
          1377 de 2013 (compilado en el Decreto 1074 de 2015) y demás normas colombianas de protección de datos personales.
        </p>
        <p>
          Al enviar tus datos en nuestros formularios y marcar la casilla de aceptación, autorizas su tratamiento en los
          términos aquí descritos.
        </p>
        <h3>Modificaciones de la política</h3>
        <p>
          Podemos actualizar esta política cuando cambien nuestros servicios o la normativa. Publicaremos los cambios en esta
          página con su fecha de actualización y, si son sustanciales, los comunicaremos antes de aplicarlos a quienes nos
          hayan entregado sus datos.
        </p>
      </>
    )
  },
  {
    id: 'responsable',
    icon: Building2,
    titulo: 'Responsable del tratamiento',
    contenido: (
      <>
        <p>El responsable de decidir sobre el tratamiento de tus datos personales es:</p>
        <dl className="legal-datos">
          <dt>Razón social</dt><dd>{EMPRESA.razonSocial}</dd>
          {EMPRESA.nit && (<><dt>NIT</dt><dd>{EMPRESA.nit}</dd></>)}
          <dt>Domicilio</dt><dd>{EMPRESA.domicilio}</dd>
          <dt>Correo</dt><dd><Correo /></dd>
          <dt>Teléfono</dt><dd>{EMPRESA.telefono}</dd>
        </dl>
        <p>Para cualquier asunto relacionado con esta política puedes escribirnos al correo indicado.</p>
      </>
    )
  },
  {
    id: 'informacion',
    icon: Database,
    titulo: 'Información recopilada',
    contenido: (
      <>
        <p>
          Solo recopilamos los datos que tú nos entregas voluntariamente. No solicitamos datos sensibles (como salud,
          orientación política o religiosa, o datos biométricos) ni datos de menores de edad.
        </p>
        <h3>Cuando agendas una cita o nos contactas</h3>
        <ul>
          <li><strong>Datos de identificación y contacto:</strong> nombre completo y correo laboral.</li>
          <li><strong>Datos profesionales:</strong> empresa y cargo.</li>
          <li><strong>Datos de tu solicitud:</strong> servicio de interés, motivo de la cita, y fechas y franja horaria preferidas.</li>
        </ul>
        <h3>Datos técnicos</h3>
        <p>
          Como cualquier sitio web, el servidor que aloja este sitio puede registrar datos técnicos básicos de cada visita
          (dirección IP, navegador, fecha y hora) con fines de seguridad y funcionamiento. No los usamos para identificarte
          ni para crear perfiles.
        </p>
        <h3>Contenido de terceros</h3>
        <p>
          Algunas páginas incluyen contenido de terceros: el mapa de Google Maps en la página de contacto y videos de fondo
          servidos desde coverr.co. Al cargarlos, esos proveedores pueden recibir datos técnicos de tu navegador según sus
          propias políticas de privacidad.
        </p>
      </>
    )
  },
  {
    id: 'uso',
    icon: CircleCheck,
    titulo: 'Uso de la información',
    contenido: (
      <>
        <p>Usamos tus datos únicamente para las finalidades que te informamos al recogerlos:</p>
        <ul>
          <li>Agendar, confirmar y realizar la reunión que solicitaste, incluida la invitación con el enlace de la videollamada que te enviamos por correo.</li>
          <li>Responder tus consultas, incluidos los mensajes que nos dejas en el chat de Nebulina, y dar seguimiento comercial a tu solicitud.</li>
          <li>Enviarte propuestas o información relacionada con el servicio que te interesa.</li>
          <li>Mantener la seguridad del sitio y prevenir el uso abusivo de los formularios.</li>
          <li>Cumplir obligaciones legales y requerimientos de autoridades competentes.</li>
        </ul>
        <p>
          Solo te enviaremos boletines o comunicaciones comerciales generales si nos das tu autorización expresa para ello,
          y podrás retirarla en cualquier momento. <strong>No vendemos, alquilamos ni cedemos tus datos personales.</strong>
        </p>
      </>
    )
  },
  {
    id: 'terceros',
    icon: Share2,
    titulo: 'Con quién compartimos tus datos',
    contenido: (
      <>
        <p>Para prestar el servicio nos apoyamos en proveedores que actúan como encargados del tratamiento, siguiendo nuestras instrucciones:</p>
        <ul>
          <li>
            <strong>Jitsi Meet (8x8):</strong> plataforma de la videollamada. Solo recibe los datos técnicos de la conexión
            cuando entras a la reunión; no le enviamos tus datos de contacto.
          </li>
          <li>
            <strong>Hostinger (alojamiento y correo):</strong> almacena y entrega las páginas del sitio, guarda tu solicitud de
            cita y envía los correos de confirmación. Las solicitudes que no confirmas se borran a los 7 días.
          </li>
          {TURNSTILE_SITEKEY && (
            <li>
              <strong>Cloudflare (Turnstile):</strong> verifica que el formulario de citas lo envía una persona y no un
              programa automatizado. Procesa datos técnicos del navegador y no usa cookies.
            </li>
          )}
        </ul>
        <p>
          Algunos de estos proveedores almacenan información en servidores ubicados fuera de Colombia (por ejemplo, en Estados
          Unidos). Al aceptar esta política autorizas esa transmisión internacional, que se realiza con proveedores que ofrecen
          niveles adecuados de protección de datos.
        </p>
        <p>Solo compartiremos tus datos con autoridades cuando exista una obligación legal o una orden judicial.</p>
      </>
    )
  },
  {
    id: 'proteccion',
    icon: Lock,
    titulo: 'Protección de datos',
    contenido: (
      <>
        <p>
          Aplicamos medidas técnicas, humanas y administrativas razonables para proteger tu información contra el acceso no
          autorizado, la pérdida, la alteración o la divulgación indebida.
        </p>
        <h3>Medidas de seguridad</h3>
        <ul>
          <li>Cifrado de la información en tránsito (HTTPS/TLS).</li>
          <li>Acceso restringido a las personas autorizadas del equipo comercial.</li>
          <li>Cabeceras de seguridad en el sitio (política de seguridad de contenido y protección contra suplantación de páginas).</li>
          <li>Validación de datos y controles contra envíos automatizados (spam) en los formularios.</li>
        </ul>
        <p>
          Ningún sistema es completamente infalible. Si ocurriera un incidente de seguridad que afecte tus datos, te
          informaremos y lo reportaremos a la Superintendencia de Industria y Comercio, como lo exige la ley.
        </p>
        <h3>Conservación</h3>
        <p>
          Conservamos tus datos durante el tiempo necesario para cumplir las finalidades descritas y las obligaciones legales
          aplicables. Después los eliminamos o anonimizamos, salvo que la ley exija conservarlos.
        </p>
      </>
    )
  },
  {
    id: 'cookies',
    icon: Cookie,
    titulo: 'Cookies y almacenamiento local',
    contenido: (
      <>
        <p><strong>Este sitio no usa cookies publicitarias ni de analítica, y no rastrea tu navegación.</strong></p>
        <p>
          Solo guarda en tu propio navegador (almacenamiento local, sin enviarlo a nuestros servidores) dos datos para
          mejorar tu experiencia:
        </p>
        <ul>
          <li>Tu preferencia de tema (claro u oscuro).</li>
          <li>El borrador del formulario de citas, para que no pierdas lo escrito si recargas o sales de la página. Se borra al enviar o cancelar la solicitud, o a las 48 horas.</li>
        </ul>
        <p>
          Puedes borrarlos en cualquier momento desde la configuración de tu navegador. Ten en cuenta que el mapa de Google
          Maps puede usar sus propias cookies.
        </p>
      </>
    )
  },
  {
    id: 'derechos',
    icon: Users,
    titulo: 'Derechos del usuario',
    contenido: (
      <>
        <p>Como titular de tus datos personales tienes derecho a (artículo 8 de la Ley 1581 de 2012):</p>
        <ul>
          <li>Conocer, actualizar y rectificar tus datos.</li>
          <li>Solicitar prueba de la autorización que nos otorgaste.</li>
          <li>Ser informado sobre el uso que les damos.</li>
          <li>Revocar la autorización o solicitar la supresión de tus datos, cuando no exista un deber legal de conservarlos.</li>
          <li>Acceder gratuitamente a tus datos.</li>
          <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC), una vez agotado el trámite ante nosotros.</li>
        </ul>
        <h3>Cómo ejercer tus derechos</h3>
        <ol className="legal-pasos">
          <li>Escribe a <Correo /> con el asunto <strong>«Habeas data»</strong>.</li>
          <li>Incluye tu nombre completo, tu número de identificación, la descripción de tu solicitud y un dato de contacto para responderte.</li>
          <li>Si actúas en representación de otra persona, adjunta el documento que lo acredite.</li>
        </ol>
        <h3>Plazos de respuesta</h3>
        <ul>
          <li><strong>Consultas:</strong> máximo 10 días hábiles, prorrogables 5 días hábiles más con aviso previo.</li>
          <li><strong>Reclamos</strong> (corrección, actualización, supresión o revocatoria): máximo 15 días hábiles, prorrogables 8 días hábiles más con aviso previo.</li>
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

const Privacidad = () => (
  <LegalPage
    className="privacidad-page"
    seo={SEO}
    hero={{
      image: heroImage('Privacidad'),
      icon: Shield,
      title: <>Política de <span>Privacidad</span></>,
      description: `Vigente desde el ${PRIVACIDAD.vigencia} · Última actualización: ${PRIVACIDAD.actualizacion}`
    }}
    secciones={SECCIONES}
    resumen={<Resumen />}
    lateral={<NebulinaAyuda />}
    pie={
      <p className="legal-pie" data-reveal>
        {EMPRESA.razonSocial} · {EMPRESA.domicilio} · Última actualización: {PRIVACIDAD.actualizacion}
      </p>
    }
  />
);

export default Privacidad;
