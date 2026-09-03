import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes integrar EmailJS u otra solución
    console.log('Email suscrito:', email);
    alert('¡Gracias por suscribirte!');
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col">
          <div className="footer-logo">
            <img
              src="/src/assets/images/Imagenes/Logos/LogoClaro.png"
              alt="Céntrica"
              className="footer-logo-img"
            />
          </div>
          <p className="footer-description">
            Impulsamos tu éxito a través de la innovación inteligente.
          </p>
          <div className="footer-contact-info">
            <p>gerenciacomercial@centricasoluciones.com</p>
            <p>
              <Phone size={16} style={{ display: 'inline', marginRight: '8px' }} />
              +57 300 205 7325
            </p>
            <p>
              <MapPin size={16} style={{ display: 'inline', marginRight: '8px' }} />
              Medellín, Colombia
            </p>
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Navegación</h4>
          <ul className="footer-links">
            <li><Link to="/">Sobre nosotros</Link></li>
            <li><Link to="/terminos">Términos</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Legal</h4>
          <ul className="footer-links">
            <li><a href="/privacidad">Política de Privacidad</a></li>
            <li><a href="/politicas">Políticas internas</a></li>
            <li><a href="/terservicios">Términos de Servicio</a></li>
            <li><a href="/legal">Aviso Legal</a></li>
            <li><a href="/cookies">Cookies</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-col-title">Mantente informado</h4>
          <p className="footer-newsletter-text">
            Recibe novedades sobre nuestras soluciones.
          </p>
          <form className="footer-newsletter-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Suscribirse →</button>
          </form>
          <p className="footer-unsubscribe">
            Puedes darte de baja en cualquier momento.
            <br />
            <a href="/unsubscribe" className="footer-unsubscribe-link">
              Darse de baja de comunicaciones
            </a>
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="footer-copyright-secondary">
            © 2026 Céntrica. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
