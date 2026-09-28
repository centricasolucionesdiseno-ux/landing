import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, Moon, Sun, X } from 'lucide-react';
import useTheme from '../../hooks/useTheme';
import LogoColor from '../../assets/images/Imagenes/Logos/LogoColor.png';
import LogoLetraClara from '../../assets/images/Imagenes/Logos/LogoModoOscuroLetraClara.png';

const SERVICES = [
  { to: '/fabrica-software', label: 'Fábrica de software' },
  { to: '/nebula-erp', label: 'Nebula ERP' },
  { to: '/sicovi', label: 'Sicovi' },
  { to: '/analisis-ia', label: 'Soluciones de IA' },
  { to: '/consultoria-digital', label: 'Consultoría digital' }
];

const SERVICE_PATHS = ['/servicios', ...SERVICES.map((service) => service.to)];
const DESKTOP_QUERY = '(min-width: 961px)';

const Header = () => {
  const [isDark, toggleTheme] = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const progressRef = useRef(null);
  const { pathname } = useLocation();

  // Estado "scrolled" + barra de progreso (esta última sin re-render)
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 12);
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
    setSubmenuOpen(false);
    // Evita que :focus-within mantenga abierto el submenú tras navegar
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  };

  // Menú móvil abierto: bloquear scroll, cerrar con Escape o al pasar a escritorio
  useEffect(() => {
    if (!menuOpen) return undefined;
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const onKeyDown = (event) => event.key === 'Escape' && setMenuOpen(false);
    const onDesktop = (event) => event.matches && setMenuOpen(false);

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    desktop.addEventListener('change', onDesktop);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
      desktop.removeEventListener('change', onDesktop);
    };
  }, [menuOpen]);

  const headerClasses = ['header', scrolled && 'is-scrolled', menuOpen && 'menu-open'].filter(Boolean).join(' ');
  const servicesActive = SERVICE_PATHS.includes(pathname);

  return (
    <header className={headerClasses}>
      <Link to="/" className="logo" onClick={closeMenu} aria-label="Céntrica, ir al inicio">
        <img src={isDark ? LogoLetraClara : LogoColor} alt="Logo Céntrica" className="logo-img" width="438" height="126" />
      </Link>

      <nav id="main-nav" className="nav" aria-label="Principal">
        <ul className="menu">
          <li>
            <NavLink to="/" end onClick={closeMenu}>Sobre nosotros</NavLink>
          </li>
          <li className={`dropdown${submenuOpen ? ' open' : ''}`}>
            <div className="dropdown-trigger">
              <NavLink to="/servicios" onClick={closeMenu} className={servicesActive ? 'active' : ''}>
                Servicios
              </NavLink>
              <button
                type="button"
                className="dropdown-toggle"
                aria-expanded={submenuOpen}
                aria-controls="submenu-servicios"
                aria-label={submenuOpen ? 'Ocultar servicios' : 'Mostrar servicios'}
                onClick={() => setSubmenuOpen((open) => !open)}
              >
                <ChevronDown size={16} aria-hidden="true" />
              </button>
            </div>
            <ul id="submenu-servicios" className="submenu">
              {SERVICES.map((service) => (
                <li key={service.to}>
                  <NavLink to={service.to} onClick={closeMenu}>{service.label}</NavLink>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <NavLink to="/contacto" onClick={closeMenu}>Contacto</NavLink>
          </li>
          {/* <li><NavLink to="/blog">Blog</NavLink></li> */}
        </ul>
      </nav>

      <div className="header-actions">
        <button
          type="button"
          className="icon-btn dark-mode-btn"
          onClick={toggleTheme}
          aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
        >
          {isDark ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
        </button>
        <button
          type="button"
          className="icon-btn menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>

      <span className="scroll-progress" ref={progressRef} aria-hidden="true" />
    </header>
  );
};

export default Header;
