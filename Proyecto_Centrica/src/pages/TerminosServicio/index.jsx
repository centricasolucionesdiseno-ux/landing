import { Link } from 'react-router-dom';
import {
  FileText, Target, CircleCheck, User, Shield, CircleX, Copyright, Lock, Scale,
  Handshake, ShieldCheck, Gavel
} from 'lucide-react';
import LegalPage from '../../components/legal/LegalPage';
import NebulinaAyuda from '../../components/common/NebulinaAyuda';
import { heroImage } from '../../utils/heroImages';
import { EMPRESA, TERMINOS } from '../../config/legal';

const SEO = {
  title: 'Términos de Servicio | Céntrica',
  description: 'Términos de servicio de Céntrica: alcance, uso permitido, responsabilidad, propiedad intelectual, protección de datos y legislación aplicable.',
  ogTitle: 'Términos de Servicio | Céntrica',
  ogDescription: 'Condiciones que regulan el acceso y uso de las soluciones digitales de Céntrica.',
  path: '/terservicios'
};

const RESUMEN = [
  { icon: Handshake, texto: 'Al usar nuestros servicios aceptas estas condiciones.' },
  { icon: ShieldCheck, texto: 'Úsalos de forma legal y responsable, sin afectar su seguridad.' },
  { icon: Copyright, texto: 'El software y los contenidos son propiedad de Céntrica o de sus licenciantes.' },
  { icon: Gavel, texto: 'Se rigen por las leyes de Colombia, con tribunales en Medellín.' }
];

const SECCIONES = [
  {
    id: 'alcance',
    icon: Target,
    titulo: 'Alcance del servicio',
    contenido: (
      <>
        <p>
          Los presentes Términos de Servicio regulan el acceso y uso de las soluciones digitales ofrecidas por
          {' '}<strong>{EMPRESA.razonSocial}</strong> (en adelante, «Céntrica»), identificada con NIT {EMPRESA.nit} y
          domiciliada en {EMPRESA.domicilio}, incluyendo plataformas, herramientas tecnológicas y servicios asociados.
        </p>
        <p>
          El uso de estos servicios implica la aceptación de las condiciones aquí descritas, así como de cualquier normativa
          aplicable. Cuando exista un contrato o propuesta firmada con Céntrica, sus condiciones particulares prevalecen sobre
          estos términos generales.
        </p>
        <h3>Servicios incluidos</h3>
        <ul>
          <li>Desarrollo y fábrica de software a medida.</li>
          <li>Plataforma Nebula ERP de gestión empresarial.</li>
          <li>Sistema SICOVI para gestión legislativa.</li>
          <li>Soluciones de Inteligencia Artificial aplicada.</li>
          <li>Consultoría digital y transformación estratégica.</li>
        </ul>
      </>
    )
  },
  {
    id: 'uso-permitido',
    icon: CircleCheck,
    titulo: 'Uso permitido',
    contenido: (
      <>
        <p>El usuario se compromete a utilizar los servicios de manera responsable, legal y conforme a los fines para los cuales fueron diseñados.</p>
        <p>
          Queda prohibido el uso indebido de la plataforma, incluyendo actividades que puedan afectar su funcionamiento,
          seguridad o integridad, así como el acceso no autorizado a sistemas o datos.
        </p>
        <h3>Usos prohibidos</h3>
        <ul>
          <li>Realizar actividades ilegales o fraudulentas.</li>
          <li>Intentar vulnerar la seguridad del sistema.</li>
          <li>Distribuir malware o contenido dañino.</li>
          <li>Acceder a información no autorizada.</li>
          <li>Sobrecargar la infraestructura del servicio, incluido el envío automatizado o masivo de formularios.</li>
        </ul>
      </>
    )
  },
  {
    id: 'cuentas',
    icon: User,
    titulo: 'Cuentas y acceso',
    contenido: (
      <>
        <p>En caso de requerirse registro, el usuario será responsable de mantener la confidencialidad de sus credenciales de acceso.</p>
        <p>
          Céntrica no será responsable por el uso indebido de cuentas derivado de negligencia en la protección de la
          información de acceso por parte del usuario.
        </p>
        <h3>Requisitos de registro</h3>
        <ul>
          <li>Proporcionar información veraz y actualizada.</li>
          <li>Mantener la confidencialidad de la contraseña.</li>
          <li>Notificar inmediatamente cualquier uso no autorizado.</li>
          <li>Ser mayor de edad y legalmente capaz, o actuar en representación de una organización con facultades para ello.</li>
        </ul>
      </>
    )
  },
  {
    id: 'responsabilidad',
    icon: Shield,
    titulo: 'Responsabilidad',
    contenido: (
      <>
        <p>
          Los servicios se proporcionan según su disponibilidad. Céntrica trabaja para mantenerlos seguros y en funcionamiento,
          pero no garantiza que sean ininterrumpidos o libres de errores.
        </p>
        <p>
          En la medida permitida por la ley colombiana, Céntrica no será responsable por daños indirectos derivados del uso o
          la imposibilidad de uso de los servicios. Esta limitación no aplica cuando la ley no permita excluir la
          responsabilidad, como en los casos de dolo o culpa grave, ni afecta los derechos que el Estatuto del Consumidor
          reconoce a los consumidores.
        </p>
        <h3>Limitaciones de responsabilidad</h3>
        <ul>
          <li>Interrupciones programadas o de emergencia.</li>
          <li>Pérdida de datos por causas externas o ajenas a Céntrica.</li>
          <li>Errores en el uso del servicio por parte del usuario.</li>
          <li>Contenido de terceros accesible desde el servicio.</li>
        </ul>
      </>
    )
  },
  {
    id: 'terminacion',
    icon: CircleX,
    titulo: 'Terminación',
    contenido: (
      <>
        <p>
          Nos reservamos el derecho de suspender o cancelar el acceso a los servicios en caso de incumplimiento de estos
          términos o uso indebido de la plataforma.
        </p>
        <p>El usuario puede dejar de utilizar los servicios en cualquier momento, sin perjuicio de las obligaciones adquiridas previamente.</p>
        <h3>Causales de terminación</h3>
        <ul>
          <li>Incumplimiento de los términos establecidos.</li>
          <li>Uso fraudulento o ilegal del servicio.</li>
          <li>Solicitud expresa del usuario.</li>
          <li>Decisión de Céntrica, con previo aviso.</li>
        </ul>
      </>
    )
  },
  {
    id: 'propiedad-intelectual',
    icon: Copyright,
    titulo: 'Propiedad intelectual',
    contenido: (
      <>
        <p>
          Todo el contenido, software, diseños, logotipos y materiales disponibles en los servicios son propiedad de Céntrica o
          de sus licenciantes y están protegidos por las leyes de propiedad intelectual.
        </p>
        <p>
          El usuario no adquiere ningún derecho de propiedad sobre los servicios o contenidos, más allá de los derechos de uso
          limitados otorgados en estos términos o en el contrato correspondiente.
        </p>
        <h3>Restricciones</h3>
        <ul>
          <li>No copiar, modificar o distribuir el software.</li>
          <li>No descompilar ni realizar ingeniería inversa.</li>
          <li>No eliminar avisos de propiedad intelectual.</li>
        </ul>
      </>
    )
  },
  {
    id: 'proteccion-datos',
    icon: Lock,
    titulo: 'Protección de datos',
    contenido: (
      <>
        <p>
          Céntrica trata los datos personales de acuerdo con su <Link to="/privacidad">Política de Privacidad</Link> y la
          legislación aplicable en Colombia (Ley 1581 de 2012).
        </p>
        <p>El usuario garantiza que los datos proporcionados son exactos y se compromete a notificar cualquier cambio.</p>
        <h3>Derechos del usuario</h3>
        <ul>
          <li>Acceder, actualizar y corregir sus datos.</li>
          <li>Solicitar la eliminación de sus datos.</li>
          <li>Revocar el consentimiento para el tratamiento.</li>
          <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC).</li>
        </ul>
      </>
    )
  },
  {
    id: 'legislacion',
    icon: Scale,
    titulo: 'Legislación aplicable',
    contenido: (
      <>
        <p>
          Estos términos se rigen por las leyes de la República de Colombia. Cualquier disputa relacionada con estos términos
          será sometida a los tribunales competentes de Medellín, Colombia.
        </p>
        <h3>Normativa aplicable</h3>
        <ul>
          <li>Constitución Política de Colombia.</li>
          <li>Ley 527 de 1999 (Comercio Electrónico).</li>
          <li>Ley 1480 de 2011 (Estatuto del Consumidor).</li>
          <li>Ley 1581 de 2012 (Protección de Datos).</li>
          <li>Decreto 1074 de 2015 (Único Reglamentario del Sector Comercio).</li>
        </ul>
        <h3>Modificaciones</h3>
        <p>
          Podemos actualizar estos términos cuando cambien nuestros servicios o la normativa. Publicaremos los cambios en esta
          página con su fecha de actualización.
        </p>
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

const TerminosServicio = () => (
  <LegalPage
    className="terminos-page"
    seo={SEO}
    hero={{
      image: heroImage('Terminos'),
      icon: FileText,
      title: <>Términos de <span>Servicio</span></>,
      description: `Vigentes desde el ${TERMINOS.vigencia} · Última actualización: ${TERMINOS.actualizacion}`
    }}
    secciones={SECCIONES}
    resumen={<Resumen />}
    lateral={
      <NebulinaAyuda
        titulo="¿Dudas sobre estos términos?"
        texto="Escríbenos y con gusto te las resolvemos."
        asunto="Términos de servicio"
      />
    }
    pie={
      <p className="legal-pie" data-reveal>
        {EMPRESA.razonSocial} · NIT {EMPRESA.nit} · {EMPRESA.domicilio} · Última actualización: {TERMINOS.actualizacion}
      </p>
    }
  />
);

export default TerminosServicio;
