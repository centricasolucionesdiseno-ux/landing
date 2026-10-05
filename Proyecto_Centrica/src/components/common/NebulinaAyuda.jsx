import { Mail } from 'lucide-react';
import { EmailLink } from './ContactLinks';
import { EMPRESA } from '../../config/legal';
import Parpados from '../nebulina/Parpados';
import Nebulina260 from '../../assets/images/Imagenes/Nebulina-Hola-260.webp';
import Nebulina500 from '../../assets/images/Imagenes/Nebulina-Hola-500.webp';
import Nebulina400 from '../../assets/images/Imagenes/Nebulina-Hola-400.webp';

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
      <span className="nebulina-viva">
        <img
          src={Nebulina500}
          srcSet={`${Nebulina260} 260w, ${Nebulina400} 400w, ${Nebulina500} 500w`}
          sizes="(max-width: 959px) 220px, 250px"
          width="500"
          height="500"
          alt="Nebulina, la asistente virtual de Céntrica, saludando"
          loading="lazy"
          decoding="async"
        />
        <Parpados variante="hola" />
      </span>
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
