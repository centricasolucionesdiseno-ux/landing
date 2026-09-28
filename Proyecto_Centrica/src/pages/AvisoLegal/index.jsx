import { Link } from 'react-router-dom';
import {
  Scale, Building2, FileText, Copyright, TriangleAlert, Landmark, CircleCheck, CircleX,
  Handshake, ShieldCheck, Gavel
} from 'lucide-react';
import LegalPage from '../../components/legal/LegalPage';
import NebulinaAyuda from '../../components/common/NebulinaAyuda';
import { EmailLink } from '../../components/common/ContactLinks';
import { heroImage } from '../../utils/heroImages';
import { EMPRESA, AVISO_LEGAL } from '../../config/legal';

const SEO = {
  title: 'Aviso Legal | Céntrica',
  description: 'Aviso legal del sitio web de Céntrica: titular del sitio, condiciones de uso, propiedad intelectual, limitación de responsabilidad y legislación aplicable en Colombia.',
  ogTitle: 'Aviso Legal | Céntrica',
  ogDescription: 'Información legal y condiciones de uso del sitio web de Céntrica.',
  path: '/legal'
};

const RESUMEN = [
  { icon: Handshake, texto: 'Navegar por el sitio implica aceptar este aviso legal.' },
  { icon: ShieldCheck, texto: 'Úsalo de buena fe, sin afectar su seguridad ni la de otros usuarios.' },
  { icon: Copyright, texto: 'Textos, imágenes, marcas y software son de Céntrica o de sus licenciantes.' },
  { icon: Gavel, texto: 'Se rige por las leyes de Colombia, con jueces en Medellín.' }
];

const SECCIONES = [
  {
    id: 'titular',
    icon: Building2,
    titulo: 'Titular del sitio',
    contenido: (
      <>
        <p>
          El sitio web <strong>{EMPRESA.sitio}</strong> es operado por <strong>{EMPRESA.razonSocial}</strong> (en adelante,
          «Céntrica»), sociedad dedicada a la prestación de servicios tecnológicos, desarrollo de software y consultoría digital.
        </p>
        <dl className="legal-datos">
          <dt>Razón social</dt><dd>{EMPRESA.razonSocial}</dd>
          <dt>NIT</dt><dd>{EMPRESA.nit}</dd>
          <dt>Domicilio</dt><dd>{EMPRESA.domicilio}</dd>
          <dt>Correo</dt><dd><EmailLink para={EMPRESA.correo} asunto="Aviso legal" /></dd>
          <dt>Teléfono</dt><dd>{EMPRESA.telefono}</dd>
        </dl>
        <p>
          Para cualquier consulta sobre este sitio puedes escribirnos al correo indicado o usar los canales de la
          sección de <Link to="/contacto">contacto</Link>.
        </p>
      </>
    )
  },
  {
    id: 'condiciones',
    icon: FileText,
    titulo: 'Condiciones de uso',
    contenido: (
      <>
        <p>
          El acceso y uso de este sitio web te otorga la condición de usuario e implica la aceptación de las disposiciones
          de este Aviso Legal. El acceso es gratuito, salvo el costo de la conexión a internet de cada usuario.
        </p>
        <p>
          Te comprometes a hacer un uso adecuado de los contenidos y servicios del sitio, evitando actividades ilícitas o
          contrarias a la buena fe y al orden público. Los servicios contratados con Céntrica se rigen además por
          los <Link to="/terservicios">Términos de Servicio</Link> y, cuando exista, por el contrato correspondiente.
        </p>
        <h3>Obligaciones del usuario</h3>
        <ul>
          <li>No utilizar el sitio para fines ilegales o no autorizados.</li>
          <li>No intentar vulnerar ni interferir con la seguridad del sitio.</li>
          <li>No enviar contenido malicioso, ni formularios de forma automatizada o masiva.</li>
          <li>Suministrar información veraz en los formularios.</li>
          <li>Respetar los derechos de propiedad intelectual.</li>
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
          Todos los contenidos del sitio, incluidos textos, imágenes, diseños, logotipos, marcas y software, son propiedad
          de Céntrica o se usan con la licencia correspondiente, y están protegidos por la normativa colombiana e
          internacional de derechos de autor y propiedad industrial.
        </p>
        <p>
          Queda prohibida su reproducción, distribución, transformación o comunicación pública, total o parcial, sin
          autorización previa y expresa de Céntrica.
        </p>
        <div className="legal-comparar">
          <div className="legal-si">
            <h3><CircleCheck size={20} aria-hidden="true" /> ¿Qué está permitido?</h3>
            <ul>
              <li>Visualizar y navegar el sitio para uso personal.</li>
              <li>Compartir enlaces citando la fuente.</li>
              <li>Usar la información con fines informativos.</li>
            </ul>
          </div>
          <div className="legal-no">
            <h3><CircleX size={20} aria-hidden="true" /> ¿Qué está prohibido?</h3>
            <ul>
              <li>Copiar o reproducir contenido sin autorización.</li>
              <li>Modificar o adaptar el contenido.</li>
              <li>Usar logotipos o marcas sin permiso.</li>
            </ul>
          </div>
        </div>
      </>
    )
  },
  {
    id: 'responsabilidad',
    icon: TriangleAlert,
    titulo: 'Limitación de responsabilidad',
    contenido: (
      <>
        <p>
          La información publicada en este sitio es de carácter general y puede cambiar sin previo aviso. No constituye una
          oferta vinculante: las condiciones de cada servicio se definen en la propuesta o contrato correspondiente.
        </p>
        <p>
          Céntrica aplica medidas técnicas para mantener el sitio seguro y disponible, pero no puede garantizar su
          funcionamiento ininterrumpido ni la ausencia total de errores. En la medida permitida por la ley colombiana, no
          responde por daños derivados de las siguientes situaciones, sin perjuicio de los casos de dolo o culpa grave y de
          los derechos que el Estatuto del Consumidor reconoce a los consumidores.
        </p>
        <h3>Exclusiones de responsabilidad</h3>
        <ul>
          <li>Interrupciones o errores técnicos ajenos a Céntrica.</li>
          <li>Pérdida de datos por causas externas.</li>
          <li>Contenido de sitios de terceros enlazados desde este sitio.</li>
          <li>Uso indebido del sitio por parte del usuario.</li>
        </ul>
      </>
    )
  },
  {
    id: 'jurisdiccion',
    icon: Landmark,
    titulo: 'Legislación y jurisdicción',
    contenido: (
      <>
        <p>
          Este Aviso Legal se rige por la legislación de la República de Colombia. Cualquier controversia derivada del
          acceso o uso del sitio será sometida a los jueces competentes de Medellín, Colombia, salvo que la ley disponga
          otro fuero a favor del consumidor.
        </p>
        <h3>Legislación aplicable</h3>
        <ul>
          <li>Constitución Política de Colombia.</li>
          <li>Ley 527 de 1999 (Comercio Electrónico).</li>
          <li>Ley 1480 de 2011 (Estatuto del Consumidor).</li>
          <li>Ley 1581 de 2012 (Protección de Datos), desarrollada en nuestra <Link to="/privacidad">Política de Privacidad</Link>.</li>
          <li>Ley 23 de 1982 y Decisión Andina 351 de 1993 (Derechos de Autor).</li>
          <li>Decisión Andina 486 de 2000 (Propiedad Industrial).</li>
        </ul>
        <h3>Modificaciones</h3>
        <p>
          Podemos actualizar este aviso cuando cambie el sitio o la normativa. Publicaremos los cambios en esta página con
          su fecha de actualización.
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

const AvisoLegal = () => (
  <LegalPage
    className="aviso-legal-page"
    seo={SEO}
    hero={{
      image: heroImage('Legal'),
      icon: Scale,
      title: <>Aviso <span>Legal</span></>,
      description: `Vigente desde el ${AVISO_LEGAL.vigencia} · Última actualización: ${AVISO_LEGAL.actualizacion}`
    }}
    secciones={SECCIONES}
    resumen={<Resumen />}
    lateral={
      <NebulinaAyuda
        titulo="¿Dudas sobre este aviso?"
        texto="Escríbenos y con gusto te las resolvemos."
        asunto="Aviso legal"
      />
    }
    pie={
      <p className="legal-pie" data-reveal>
        {EMPRESA.razonSocial} · NIT {EMPRESA.nit} · {EMPRESA.domicilio} · Última actualización: {AVISO_LEGAL.actualizacion}
      </p>
    }
  />
);

export default AvisoLegal;
