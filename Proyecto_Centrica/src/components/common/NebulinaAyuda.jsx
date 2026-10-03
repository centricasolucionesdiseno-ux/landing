import { Mail } from 'lucide-react';
import { EmailLink } from './ContactLinks';
import { EMPRESA } from '../../config/legal';
import Nebulina260 from '../../assets/images/Imagenes/Nebulina-Hola-260.webp';
import Nebulina500 from '../../assets/images/Imagenes/Nebulina-Hola-500.webp';

/**
 * Tarjeta de Nebulina con enlace de correo (Gmail en el computador, app de
 * correo en el celular). Por defecto: dudas sobre datos personales, asunto
 * "Habeas data"; cada página puede adaptar título, texto y asunto.
 */
const NebulinaAyuda = ({
  titulo = '¿Dudas sobre tus datos?',
  texto = 'Escríbenos y te respondemos en máximo 2 días hábiles.',
  asunto = 'Habeas data',
  className = ''
}) => (
  <figure className={`nebulina-ayuda ${className}`.trim()} data-reveal="zoom">
    <div className="nebulina-ayuda-media">
      <img
        src={Nebulina500}
        srcSet={`${Nebulina260} 260w, ${Nebulina500} 500w`}
        sizes="(max-width: 959px) 220px, 250px"
        width="500"
        height="500"
        alt="Nebulina, la asistente virtual de Céntrica, saludando"
        loading="lazy"
        decoding="async"
      />
    </div>
    <figcaption>
      <strong>{titulo}</strong>
      <span>{texto}</span>
      <EmailLink para={EMPRESA.correo} asunto={asunto} className="btn btn-primary">
        <Mail size={18} aria-hidden="true" /> <span>Escribirnos</span>
      </EmailLink>
    </figcaption>
  </figure>
);

export default NebulinaAyuda;
