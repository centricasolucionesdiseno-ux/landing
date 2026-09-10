import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Layers, Shield, FileDigit, Eye, Zap, GitPullRequest, Microchip,
  Users, GitBranch, RefreshCw, Briefcase, Landmark, Building,
  Database, Factory, Repeat, Star, GitMerge, Brain, Cloud, TrendingUp
} from 'lucide-react';
import LazyImage from '../../components/common/LazyImage';
import Sicovi1 from '../../assets/images/Imagenes/Sicovi.png';
import Sicovi2 from '../../assets/images/Imagenes/Sicovi2.png';
import './styles.css';

gsap.registerPlugin(ScrollTrigger);

const Sicovi = () => {
  useEffect(() => {
    gsap.set('.hero-title, .hero-subtitle, .hero-description, .hero-buttons', { opacity: 0 });
    gsap.to('.hero-title', { opacity: 1, y: 0, duration: 0.8, delay: 0.3 });
    gsap.to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.8, delay: 0.5 });
    gsap.to('.hero-description', { opacity: 1, y: 0, duration: 0.8, delay: 0.7 });
    gsap.to('.hero-buttons', { opacity: 1, y: 0, duration: 0.8, delay: 0.9 });

    ScrollTrigger.batch('.animar-seccion', {
      start: 'top 85%',
      once: true,
      onEnter: (batch) => batch.forEach(sec => {
        gsap.to(sec, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
      })
    });

    ScrollTrigger.batch('.animar-tarjeta', {
      start: 'top 88%',
      once: true,
      onEnter: (batch) => batch.forEach(card => {
        gsap.to(card, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
      })
    });

    const contadores = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const texto = el.innerText;
          const target = Number.parseInt(texto.replace(/\D/g, ''));
          if (Number.isNaN(target)) return;
          let current = 0;
          const incremento = Math.ceil(target / 80);

          let prefijo = '';
          if (texto.startsWith('+')) {
            prefijo = '+';
          } else if (texto.startsWith('-')) {
            prefijo = '-';
          }

          const sufijo = texto.includes('%') ? '%' : '';
          const intervalo = setInterval(() => {
            current += incremento;
            if (current >= target) {
              el.innerText = texto;
              clearInterval(intervalo);
            } else {
              el.innerText = prefijo + current + sufijo;
            }
          }, 25);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    contadores.forEach(c => observer.observe(c));

    setTimeout(() => ScrollTrigger.refresh(), 100);

    return () => {
      observer.disconnect();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const scrollA = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="sicovi-page">
      <Helmet>
        <title>SICOVI - Sistema de Gestión Legislativa para Concejos | Céntrica</title>
        <meta name="description" content="SICOVI centraliza la gestión legislativa de Concejos Municipales y Departamentales de Colombia. Transparencia, trazabilidad y eficiencia operativa." />
        <meta property="og:title" content="SICOVI - Sistema Concejo Visible | Céntrica" />
        <meta property="og:description" content="Plataforma integral de gestión legislativa para la transparencia ciudadana de los Concejos de Colombia." />
        <link rel="canonical" href="https://centricasoluciones.com/sicovi" />
      </Helmet>
      <section className="hero-video" style={{ backgroundImage: `url(${Sicovi1})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="hero-video-overlay"></div>
        <div className="hero-container">
          <h1 className="hero-title">SICOVI</h1>
          <p className="hero-subtitle">Sistema Concejo Visible</p>
          <p className="hero-description">
            Plataforma unificada de gestión legislativa y administrativa para la transparencia ciudadana de los Concejos Municipales y Departamentales de Colombia.
          </p>
          <div className="hero-buttons">
            <Link to="/contacto" className="btn btn-primary">Solicitar información →</Link>
            <button onClick={() => scrollA('valor')} className="btn btn-secondary">Conocer más →</button>
          </div>
        </div>
      </section>

      <section className="section animar-seccion">
        <div className="container">
          <div className="grid-2">
            <div className="animar-tarjeta">
              <h2 className="section-title">¿Qué es <span>SICOVI</span>?</h2>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginTop: '1rem', textAlign: 'justify' }}>
                Plataforma integral de los Concejos Municipales y Departamentales de Colombia que centraliza, gestiona y da visibilidad a toda la actividad legislativa y administrativa, transformando la transparencia en acción.
              </p>
              <div style={{ marginTop: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }} className="animar-tarjeta">
                  <Layers style={{ width: '40px', height: '40px', color: '#0e58a9', flexShrink: 0 }} />
                  <div>
                    <h3 style={{ color: '#0e58a9', marginBottom: '0.25rem' }}>Unifica</h3>
                    <p style={{ textAlign: 'justify' }}>Centraliza información de acuerdos, proyectos, sesiones, comisiones y agenda en un solo punto de acceso.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }} className="animar-tarjeta">
                  <Shield style={{ width: '40px', height: '40px', color: '#0e58a9', flexShrink: 0 }} />
                  <div>
                    <h3 style={{ color: '#0e58a9', marginBottom: '0.25rem' }}>Garantiza</h3>
                    <p style={{ textAlign: 'justify' }}>Trazabilidad completa y acceso público a todos los procesos del Concejo en tiempo real.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }} className="animar-tarjeta">
                  <FileDigit style={{ width: '40px', height: '40px', color: '#0e58a9', flexShrink: 0 }} />
                  <div>
                    <h3 style={{ color: '#0e58a9', marginBottom: '0.25rem' }}>Digitaliza</h3>
                    <p style={{ textAlign: 'justify' }}>Elimina silos de información y automatiza el flujo de trabajo interno del Concejo.</p>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="animar-tarjeta">
              <LazyImage src="https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=400&h=400&fit=crop" alt="SICOVI Ilustración" style={{ width: '100%', maxWidth: '500px', height: 'auto', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
            </div>
          </div>
        </div>
      </section>

      <section id="valor" className="section bg-light animar-seccion">
        <div className="container">
          <h2 className="section-title">Valor para <span>el Ciudadano y la Entidad</span></h2>
          <div className="grid-2">
            <div className="card card-float animar-tarjeta">
              <div className="card-icon"><Eye size={48} /></div>
              <h3 className="card-title">Transparencia Total</h3>
              <p className="card-text">Acceso ciudadano en línea a acuerdos, proyectos, sesiones y toda la actividad legislativa del Concejo.</p>
            </div>
            <div className="card card-float animar-tarjeta">
              <div className="card-icon"><Zap size={48} /></div>
              <h3 className="card-title">Eficiencia Operativa</h3>
              <p className="card-text">Centralización de procesos que reduce duplicidades y tiempos administrativos de manera significativa.</p>
            </div>
            <div className="card card-float animar-tarjeta">
              <div className="card-icon"><GitPullRequest size={48} /></div>
              <h3 className="card-title">Trazabilidad y Control</h3>
              <p className="card-text">Seguimiento digital completo de cada etapa legislativa con auditoría y respaldo permanente.</p>
            </div>
            <div className="card card-float animar-tarjeta">
              <div className="card-icon"><Microchip size={48} /></div>
              <h3 className="card-title">Modernización Tecnológica</h3>
              <p className="card-text">Plataforma robusta, escalable y basada en estándares abiertos de última generación.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section animar-seccion">
        <div className="container">
          <h2 className="section-title">Nuestra <span>Oferta Técnica</span></h2>
          <div className="grid-auto">
            <div className="card card-highlight animar-tarjeta">
              <div className="card-icon"><Users size={48} /></div>
              <h3 className="card-title">Organización Especializada</h3>
              <p className="card-text">Equipos funcionales (Squads) especializados por módulo: acuerdos, proyectos, sesiones, agenda y comisiones.</p>
            </div>
            <div className="card card-highlight animar-tarjeta">
              <div className="card-icon"><GitBranch size={48} /></div>
              <h3 className="card-title">Metodologías Ágiles</h3>
              <p className="card-text">Trabajamos con Scrum/Kanban combinadas con DevOps para entregas rápidas, confiables y continuas.</p>
            </div>
            <div className="card card-highlight animar-tarjeta">
              <div className="card-icon"><RefreshCw size={48} /></div>
              <h3 className="card-title">Modernización Continua</h3>
              <p className="card-text">Actualización constante de la plataforma con nuevas funcionalidades y mejoras de rendimiento.</p>
            </div>
          </div>
          <div className="grid-2" style={{ marginTop: '1rem' }}>
            <div className="card card-highlight animar-tarjeta">
              <div className="card-icon"><GitPullRequest size={48} /></div>
              <h3 className="card-title">Desarrollo Greenfield</h3>
              <p className="card-text">Creación de nuevos módulos desde cero, adaptados a las necesidades específicas del Concejo.</p>
            </div>
            <div className="card card-highlight animar-tarjeta">
              <div className="card-icon"><Briefcase size={48} /></div>
              <h3 className="card-title">Consultoría Técnica</h3>
              <p className="card-text">Acompañamiento técnico-funcional continuo para optimizar procesos y maximizar el valor de la inversión.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-light animar-seccion">
        <div className="container">
          <h2 className="section-title">Enfoque <span>Sectorial</span></h2>
          <div className="grid-2">
            <div className="card card-highlight animar-tarjeta">
              <div className="card-icon"><Landmark size={48} /></div>
              <h3 className="card-title">Sector Público (Principal)</h3>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
                <li><strong>Gobierno Local y Concejos:</strong> Gestión integral de acuerdos, proyectos, sesiones y comisiones con trazabilidad completa.</li>
                <li><strong>Ciudadanía:</strong> Acceso público a información legislativa, fortaleciendo la participación ciudadana y el control social.</li>
              </ul>
            </div>
            <div className="card card-highlight animar-tarjeta">
              <div className="card-icon"><Building size={48} /></div>
              <h3 className="card-title">Sector Privado (Potencial)</h3>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
                <li><strong>Arquitectura modular:</strong> Adaptable a organizaciones que requieran trazabilidad documental y gestión de procesos complejos.</li>
                <li><strong>Flexibilidad:</strong> Implementación en corporaciones, ONGs y entidades que necesiten auditoría y transparencia.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section animar-seccion">
        <div className="container">
          <h2 className="section-title">Multi-tenencia y <span>Flexibilidad</span></h2>
          <div className="grid-auto">
            <div className="card card-float animar-tarjeta">
              <div className="card-icon"><Database size={48} /></div>
              <h3 className="card-title">Flexibilidad de Datos</h3>
              <p className="card-text">Soportamos múltiples motores de base de datos (PostgreSQL, Oracle, SQL Server) para adaptarnos a la infraestructura existente.</p>
            </div>
            <div className="card card-float animar-tarjeta">
              <div className="card-icon"><Shield size={48} /></div>
              <h3 className="card-title">Aislamiento Total</h3>
              <p className="card-text">Cada Concejo posee su propia base de datos física o esquema lógico aislado. No hay mezcla de información.</p>
            </div>
            <div className="card card-float animar-tarjeta">
              <div className="card-icon"><Zap size={48} /></div>
              <h3 className="card-title">Conmutación Transparente</h3>
              <p className="card-text">El sistema conmuta entre bases de datos en milisegundos, ofreciendo una experiencia unificada y segura.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-light animar-seccion">
        <div className="container">
          <h2 className="section-title">Aceleración del <span>Desarrollo a Medida</span></h2>
          <p className="section-subtitle" style={{ fontSize: '1.2rem', fontWeight: 600, color: '#0e58a9', textAlign: 'center' }}>Impulsado por Arquitectura Base</p>
          <div className="grid-2">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="animar-tarjeta">
              <LazyImage src={Sicovi2} alt="Flor Centrica" style={{ width: '100%', maxWidth: '560px', height: 'auto' }} />
            </div>
            <div className="grid-2" style={{ gap: '1.5rem' }}>
              <div className="card card-highlight animar-tarjeta">
                <div className="card-icon"><Factory size={48} /></div>
                <h3 className="card-title">Plantillas (Archetypes)</h3>
                <p className="card-text">Generación rápida de nuevos módulos con Maven archetypes.</p>
              </div>
              <div className="card card-highlight animar-tarjeta">
                <div className="card-icon"><Repeat size={48} /></div>
                <h3 className="card-title">Reutilización</h3>
                <p className="card-text">Componentes comunes de seguridad, persistencia e interfaz.</p>
              </div>
              <div className="card card-highlight animar-tarjeta">
                <div className="card-icon"><Star size={48} /></div>
                <h3 className="card-title">Calidad heredada</h3>
                <p className="card-text">Todo desarrollo a medida se basa en MVC + JPA + JSF, garantizando consistencia y mantenibilidad.</p>
              </div>
              <div className="card card-highlight animar-tarjeta">
                <div className="card-icon"><GitMerge size={48} /></div>
                <h3 className="card-title">CI/CD integrado</h3>
                <p className="card-text">Nuevas funcionalidades se incorporan con el mismo pipeline de calidad.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section bg-primary animar-seccion">
        <div className="container">
          <h2 className="section-title" style={{ color: 'white' }}>Impacto en el <span style={{ color: '#4a9eff' }}>Concejo de Medellín</span></h2>
          <div className="stats-grid">
            <div className="stat-item" style={{ textAlign: 'center', color: 'white' }}>
              <span className="stat-number">-70%</span>
              <span className="stat-label">Reducción en tiempos de gestión documental</span>
            </div>
            <div className="stat-item" style={{ textAlign: 'center', color: 'white' }}>
              <span className="stat-number">+100%</span>
              <span className="stat-label">Mayor participación ciudadana</span>
            </div>
            <div className="stat-item" style={{ textAlign: 'center', color: 'white' }}>
              <span className="stat-number">-85%</span>
              <span className="stat-label">Disminución de errores administrativos</span>
            </div>
            <div className="stat-item" style={{ textAlign: 'center', color: 'white' }}>
              <span className="stat-number">100%</span>
              <span className="stat-label">Plataforma oficial de gestión legislativa</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section animar-seccion">
        <div className="container">
          <h2 className="section-title">Otros <span>servicios</span></h2>
          <div className="grid-2">
            <div className="card card-float animar-tarjeta">
              <div className="card-icon"><Factory size={48} /></div>
              <h3 className="card-title">Fábrica de Software</h3>
              <p className="card-text">Desarrollo de soluciones tecnológicas a la medida: aplicaciones, plataformas y sistemas escalables diseñados para evolucionar con el negocio.</p>
              <Link to="/fabrica" className="btn btn-secondary" style={{ marginTop: '1rem', textAlign: 'center' }}>Conocer más →</Link>
            </div>
            <div className="card card-float animar-tarjeta">
              <div className="card-icon"><Cloud size={48} /></div>
              <h3 className="card-title">Nebula ERP</h3>
              <p className="card-text">Plataforma integral de gestión empresarial que centraliza operaciones, optimiza recursos y permite tomar decisiones en tiempo real con visión estratégica.</p>
              <Link to="/nebula" className="btn btn-secondary" style={{ marginTop: '1rem', textAlign: 'center' }}>Conocer más →</Link>
            </div>
            <div className="card card-float animar-tarjeta">
              <div className="card-icon"><Brain size={48} /></div>
              <h3 className="card-title">Análisis con IA</h3>
              <p className="card-text">Implementación de Inteligencia Artificial para automatizar procesos, anticipar escenarios y transformar datos en decisiones precisas.</p>
              <Link to="/ia" className="btn btn-secondary" style={{ marginTop: '1rem', textAlign: 'center' }}>Conocer más →</Link>
            </div>
            <div className="card card-float animar-tarjeta">
              <div className="card-icon"><TrendingUp size={48} /></div>
              <h3 className="card-title">Consultoría digital</h3>
              <p className="card-text">Acompañamiento estratégico en la transformación digital: desde el diagnóstico hasta la implementación y optimización de soluciones.</p>
              <Link to="/consultoria" className="btn btn-secondary" style={{ marginTop: '1rem', textAlign: 'center' }}>Conocer más →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-primary section-cta animar-seccion">
        <div className="container">
          <h2>¿Listo para transformar la gestión legislativa de su Concejo?</h2>
          <p>Contáctenos y descubra cómo SICOVI puede llevar la transparencia y eficiencia a su entidad.</p>
          <Link to="/contacto" className="btn btn-primary" style={{ background: 'white', color: '#0e58a9' }}>Solicitar información técnica →</Link>
        </div>
      </section>
    </div>
  );
};

export default Sicovi;
