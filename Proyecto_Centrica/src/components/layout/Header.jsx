import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  return (
    <header className="header">
      <div className="logo-container">
        <div className="logo">
          <Link to="/">
            <img
              src="/src/assets/images/Imagenes/Logos/LogoClaro.png"
              alt="Logo Centrica"
              className="logo-img"
            />
          </Link>
        </div>
      </div>

      <nav>
        <ul className="menu">
          <li><Link to="/">Sobre nosotros</Link></li>
          <li className="dropdown">
            <a href="#">Servicios</a>
            <ul className="submenu">
              <li><Link to="/fabrica-software">Fábrica de software</Link></li>
              <li><Link to="/nebula-erp">Nebula ERP</Link></li>
              <li><Link to="/sicovi">Sicovi</Link></li>
              <li><Link to="/analisis-ia">Análisis con IA</Link></li>
              <li><Link to="/evaluaciones-calidad">Evaluaciones de Calidad</Link></li>
            </ul>
          </li>
          <li><Link to="/contacto">Contacto</Link></li>
          <li><Link to="/blog">Blog</Link></li>
        </ul>
      </nav>

      <button
        id="darkModeToggle"
        className="dark-mode-btn"
        onClick={toggleDarkMode}
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </header>
  );
};

export default Header;
