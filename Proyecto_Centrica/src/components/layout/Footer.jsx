import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';
import { CONTACTO } from '../../config/agenda';
import { EmailLink, WhatsAppIcon, WhatsAppLink } from '../common/ContactLinks';
import LogoLetraClara from '../../assets/images/Imagenes/Logos/LogoModoOscuroLetraClara.png';

const [usuarioCorreo, dominioCorreo] = CONTACTO.correo.split('@');

const NAV_LINKS = [
  { to: '/', label: 'Sobre nosotros' },
  { to: '/terminos', label: 'Términos' },
  { to: '/contacto', label: 'Contacto' }
];

const LEGAL_LINKS = [
  { to: '/privacidad', label: 'Política de Privacidad' },
  { to: '/politicas', label: 'Políticas internas' },
  { to: '/terservicios', label: 'Términos de Servicio' },
  { to: '/legal', label: 'Aviso Legal' },
  { to: '/cookies', label: 'Cookies' }
];

const FooterLinks = ({ title, links }) => (
  <div className="footer-col">
    <h2 className="footer-col-title">{title}</h2>
    <ul className="footer-links">
      {links.map((link) => (
        <li key={link.to}>
          <Link to={link.to}>{link.label}</Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-col footer-brand">
        <div className="footer-logo">
          <img src={LogoLetraClara} alt="Céntrica" className="footer-logo-img" width="438" height="126" loading="lazy" />
        </div>
        <p className="footer-description">
          Impulsamos tu éxito a través de la innovación inteligente.
        </p>
        <div className="footer-contact-info">
          <EmailLink className="footer-correo">
            <Mail size={16} aria-hidden="true" />
            {/* <wbr> tras la @: en pantallas angostas parte ahí y no a mitad de palabra */}
            <span>{usuarioCorreo}@<wbr />{dominioCorreo}</span>
          </EmailLink>
          <WhatsAppLink>
            <WhatsAppIcon size={16} />
            {CONTACTO.telefono}
          </WhatsAppLink>
          <p>
            <MapPin size={16} aria-hidden="true" />
            Medellín, Colombia
          </p>
        </div>
      </div>

      <FooterLinks title="Navegación" links={NAV_LINKS} />
      <FooterLinks title="Legal" links={LEGAL_LINKS} />

      {/* Newsletter pendiente: los estilos .footer-newsletter-* siguen en layout.css */}
    </div>

    <div className="footer-bottom">
      <p className="footer-copyright-secondary">
        © {new Date().getFullYear()} Céntrica. Todos los derechos reservados.
      </p>
    </div>
  </footer>
);

export default Footer;
