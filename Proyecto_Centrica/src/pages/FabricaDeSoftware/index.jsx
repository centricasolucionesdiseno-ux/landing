import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Fabrica1 from '../../assets/images/Imagenes/Fabrica1.jpg';
import Fabrica2 from '../../assets/images/Imagenes/Fabrica2.png';
import './styles.css';

gsap.registerPlugin(ScrollTrigger);

const FabricaDeSoftware = () => {
  const ofertaCard1Ref = useRef(null);
  const ofertaCard2Ref = useRef(null);
  const ofertaCard3Ref = useRef(null);
  const squadsCardRef = useRef(null);

  useEffect(() => {
    // Hero animations with initial opacity
    gsap.set('.hero-title, .hero-subtitle, .hero-description, .hero-buttons', { opacity: 0 });

    gsap.to('.hero-title', {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 0.3
    });

    gsap.to('.hero-subtitle', {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 0.5
    });

    gsap.to('.hero-description', {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 0.7
    });

    gsap.to('.hero-buttons', {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 0.9
    });

    // Scroll animations for sections
    const sections = document.querySelectorAll('.animate-section');
    sections.forEach((section) => {
      gsap.from(section, {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      });
    });

    // Card animations
    const cards = document.querySelectorAll('.card-animate');
    cards.forEach((card, index) => {
      gsap.from(card, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        delay: index * 0.1,
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
    });

    // Hover animations for oferta cards
    const setupCardHover = (cardRef) => {
      if (!cardRef.current) return;

      const card = cardRef.current;

      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -15,
          scale: 1.05,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          duration: 0.3,
          ease: 'power2.out'
        });

        const icon = card.querySelector('.card-icon');
        if (icon) {
          gsap.to(icon, {
            scale: 1.2,
            rotation: 5,
            duration: 0.3,
            ease: 'back.out(1.7)'
          });
        }
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
          duration: 0.3,
          ease: 'power2.out'
        });

        const icon = card.querySelector('.card-icon');
        if (icon) {
          gsap.to(icon, {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      });
    };

    setupCardHover(ofertaCard1Ref);
    setupCardHover(ofertaCard2Ref);
    setupCardHover(ofertaCard3Ref);
    setupCardHover(squadsCardRef);

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fabrica-page">
      {/* Hero con Video */}
      <section className="hero-video" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=1600)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="hero-video-overlay"></div>
        <div className="hero-container">
          <h1 className="hero-title">Fábrica de <span>Software</span> Céntrica</h1>
          <p className="hero-subtitle">Ingeniería de Alto Nivel para Desafíos Corporativos</p>
          <p className="hero-description">
            La industrialización de la ingeniería de software. La transición de modelos de desarrollo convencionales
            hacia un centro de producción basado en procesos estandarizados, medibles y optimizables.
          </p>
          <div className="hero-buttons">
            <a href="#contacto" className="btn btn-primary">Solicitar información →</a>
            <button onClick={() => scrollToSection('oferta')} className="btn btn-secondary">Conocer oferta →</button>
          </div>
        </div>
      </section>

      {/* Valor para el cliente */}
      <section className="section animate-section">
        <div className="container">
          <h2 className="section-title">Valor para el <span>Cliente</span></h2>
          <div className="grid-auto">
            <div className="card card-float card-animate">
              <div className="card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                  <polyline points="11 14 12 15 15 12"></polyline>
                </svg>
              </div>
              <h3 className="card-title">Previsibilidad</h3>
              <p className="card-text">Seguridad en el cumplimiento de tiempos y presupuestos.</p>
            </div>

            <div className="card card-float card-animate">
              <div className="card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                  <polyline points="2 17 12 22 22 17"></polyline>
                  <polyline points="2 12 12 17 22 12"></polyline>
                </svg>
              </div>
              <h3 className="card-title">Consistencia</h3>
              <p className="card-text">Calidad técnica uniforme en cada entrega.</p>
            </div>

            <div className="card card-float card-animate">
              <div className="card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                  <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
              </div>
              <h3 className="card-title">Escalabilidad</h3>
              <p className="card-text">Capacidad de respuesta industrializada ante la demanda del negocio.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Oferta Técnica */}
      <section id="oferta" className="section section-oferta animate-section">
        <div className="container">
          <h2 className="section-title">Nuestra <span>Oferta Técnica</span></h2>

          <div ref={squadsCardRef} className="card card-animate" style={{
            textAlign: 'center',
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, #0e58a9 0%, #1a6bc9 100%)',
            color: 'white'
          }}>
            <div className="card-icon" style={{ color: 'white' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="card-title" style={{ color: 'white' }}>Células de Ingeniería (Squads)</h3>
            <p className="card-text" style={{ color: 'rgba(255,255,255,0.95)' }}>
              Equipos multidisciplinarios integrados para el desarrollo ágil de productos.
            </p>
          </div>

          <div className="grid-auto">
            <div ref={ofertaCard1Ref} className="card card-float card-animate">
              <div className="card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <polyline points="1 20 1 14 7 14"></polyline>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
              </div>
              <h3 className="card-title">Modernización de Aplicativos</h3>
              <p className="card-text">Evolución de sistemas legacy hacia arquitecturas modernas y escalables.</p>
            </div>

            <div ref={ofertaCard2Ref} className="card card-float card-animate">
              <div className="card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M12 1v6m0 6v6"></path>
                  <path d="m4.2 4.2 4.2 4.2m5.6 5.6 4.2 4.2M1 12h6m6 0h6M4.2 19.8l4.2-4.2m5.6-5.6 4.2-4.2"></path>
                </svg>
              </div>
              <h3 className="card-title">Desarrollo Greenfield</h3>
              <p className="card-text">Construcción de soluciones innovadoras desde cero con arquitectura Cloud Native.</p>
            </div>

            <div ref={ofertaCard3Ref} className="card card-float card-animate">
              <div className="card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                </svg>
              </div>
              <h3 className="card-title">Consultoría de Arquitectura</h3>
              <p className="card-text">Definición de mapas de ruta tecnológicos y gobierno de ecosistemas digitales.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stack Tecnológico */}
      <section className="section animate-section">
        <div className="container">
          <h2 className="section-title">El <span>Stack Tecnológico</span></h2>
          <p className="section-subtitle">
            Flexibilidad y Estándar - Neutralidad tecnológica orientada a la mejor solución para el reto específico,
            priorizando siempre la estabilidad y longevidad del software.
          </p>
          <div className="grid-2">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="card-animate">
              <img
                src={Fabrica1}
                alt="Stack Tecnológico"
                style={{ width: '100%', maxWidth: '560px', height: 'auto', borderRadius: '20px' }}
              />
            </div>

            <div className="grid-2" style={{ gap: '1rem' }}>
              <div className="card card-highlight card-animate">
                <div className="card-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                    <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                    <line x1="6" y1="6" x2="6.01" y2="6"></line>
                    <line x1="6" y1="18" x2="6.01" y2="18"></line>
                  </svg>
                </div>
                <h3 className="card-title">Backend</h3>
                <p className="card-text">Arquitecturas robustas (Java, .NET, Node.js, Python)</p>
              </div>

              <div className="card card-highlight card-animate">
                <div className="card-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                </div>
                <h3 className="card-title">Frontend</h3>
                <p className="card-text">Experiencias de usuario de vanguardia (Angular, React, Vue)</p>
              </div>

              <div className="card card-highlight card-animate">
                <div className="card-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="6" y1="3" x2="6" y2="15"></line>
                    <circle cx="18" cy="6" r="3"></circle>
                    <circle cx="6" cy="18" r="3"></circle>
                    <path d="M18 9a9 9 0 0 1-9 9"></path>
                  </svg>
                </div>
                <h3 className="card-title">Interoperabilidad</h3>
                <p className="card-text">APIs RESTful y comunicación asíncrona como estándar</p>
              </div>

              <div className="card card-highlight card-animate">
                <div className="card-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </div>
                <h3 className="card-title">Infraestructura & DevOps</h3>
                <p className="card-text">Contenedores, orquestadores y CI/CD automatizado</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calidad e Ingeniería de Procesos */}
      <section className="section bg-light animate-section">
        <div className="container">
          <h2 className="section-title">Calidad e <span>Ingeniería de Procesos</span></h2>
          <div className="grid-2">
            <div className="card card-float card-animate">
              <div className="card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
              </div>
              <h3 className="card-title">Gobernanza Técnica</h3>
              <p className="card-text">
                Operamos bajo un modelo de Gobernanza de Arquitectura Estricta, donde la calidad no es un accidente,
                sino el resultado de procesos de ingeniería estandarizados y medibles.
              </p>
            </div>

            <div className="card card-float card-animate">
              <div className="card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
              </div>
              <h3 className="card-title">Estándares de Ingeniería</h3>
              <p className="card-text">
                Aplicación de patrones de diseño (Clean Code, SOLID) y arquitectura desacoplada como cimiento de cada proyecto.
              </p>
            </div>

            <div className="card card-float card-animate">
              <div className="card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <polyline points="1 20 1 14 7 14"></polyline>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
              </div>
              <h3 className="card-title">SDLC Automatizado</h3>
              <p className="card-text">
                Ciclo de vida de desarrollo de software soportado por flujos de CI/CD que garantizan la integridad del código en cada despliegue.
              </p>
            </div>

            <div className="card card-float card-animate">
              <div className="card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 5H2v7l6.29 6.29c.94.94 2.48.94 3.42 0l3.58-3.58c.94-.94.94-2.48 0-3.42L9 5Z"></path>
                  <path d="M6 9.01V9"></path>
                  <path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19"></path>
                </svg>
              </div>
              <h3 className="card-title">Trazabilidad y QA</h3>
              <p className="card-text">
                Implementación de pirámide de pruebas (unitarias, integración y funcionales) y auditoría constante de procesos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Arquitectura SIMAPPE */}
      <section className="section bg-primary animate-section">
        <div className="container">
          <h2 className="section-title" style={{ color: 'white' }}>
            Arquitectura <span style={{ color: '#4a9eff' }}>SIMAPPE</span>
          </h2>
          <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.9)' }}>
            El Motor Nebula - Nuestra arquitectura de referencia propia que asegura que todo desarrollo inicie bajo estándares de excelencia técnica.
          </p>
          <div className="grid-auto">
            <div className="card simappe-card card-animate">
              <div className="card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4a9eff" strokeWidth="2">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
              </div>
              <h3 className="card-title" style={{ color: 'white' }}>Mantenibilidad</h3>
              <p className="card-text" style={{ color: 'rgba(255,255,255,0.9)' }}>
                Reducción drástica de la deuda técnica para el futuro del cliente.
              </p>
            </div>

            <div className="card simappe-card card-animate">
              <div className="card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4a9eff" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
              </div>
              <h3 className="card-title" style={{ color: 'white' }}>Desacoplamiento</h3>
              <p className="card-text" style={{ color: 'rgba(255,255,255,0.9)' }}>
                Flexibilidad para evolucionar componentes tecnológicos sin afectar el sistema completo.
              </p>
            </div>

            <div className="card simappe-card card-animate">
              <div className="card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4a9eff" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h3 className="card-title" style={{ color: 'white' }}>Seguridad</h3>
              <p className="card-text" style={{ color: 'rgba(255,255,255,0.9)' }}>
                Integración de procesos de validación y seguridad desde el diseño (Security by Design).
              </p>
            </div>
          </div>
          <div className="card simappe-card card-animate" style={{ marginTop: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'white', margin: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', marginRight: '0.5rem', verticalAlign: 'middle' }}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              Nebula ERP no se construye desde cero; se levanta sobre la infraestructura probada de Simappe.
            </p>
          </div>
        </div>
      </section>

      {/* Estrategia de Dos Capas */}
      <section className="section animate-section">
        <div className="container">
          <h2 className="section-title">Estrategia de <span>Dos Capas</span></h2>
          <p className="section-subtitle" style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0e58a9' }}>
            SIMAPPE + NEBULA
          </p>
          <div className="grid-2">
            <div className="card card-float card-animate">
              <div className="card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                  <polyline points="2 17 12 22 22 17"></polyline>
                  <polyline points="2 12 12 17 22 12"></polyline>
                </svg>
              </div>
              <h3 className="card-title">Capa 1: Simappe (El Cimiento)</h3>
              <p className="card-text">Gestiona la seguridad, multi-tenancy, auditoría y servicios base.</p>
            </div>

            <div className="card card-float card-animate">
              <div className="card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                </svg>
              </div>
              <h3 className="card-title">Capa 2: Nebula (El Negocio)</h3>
              <p className="card-text">Donde reside la lógica específica de Contabilidad, Nómina y otros procesos operativos.</p>
            </div>
          </div>
          <div className="card bg-light card-animate" style={{ marginTop: '2rem', textAlign: 'center', borderLeft: '4px solid #0e58a9' }}>
            <p style={{ margin: 0 }}>
              <strong>Ventaja:</strong> El equipo se enfoca 100% en resolver el problema del negocio, no en reinventar la infraestructura.
            </p>
          </div>
        </div>
      </section>

      {/* Patrón de Capas */}
      <section className="section bg-light animate-section">
        <div className="container">
          <h2 className="section-title">El Patrón de <span>Capas</span></h2>
          <p className="section-subtitle">
            Component Pattern - Aplicamos un flujo de ingeniería estandarizado que garantiza consistencia y mantenibilidad.
          </p>

          <div className="card card-animate" style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem', textAlign: 'center' }}>
            <span style={{ fontWeight: '600', color: '#0e58a9' }}>Controlador</span>
            <span style={{ fontWeight: '600', color: '#0e58a9' }}>→</span>
            <span style={{ fontWeight: '600', color: '#0e58a9' }}>Servicio</span>
            <span style={{ fontWeight: '600', color: '#0e58a9' }}>→</span>
            <span style={{ fontWeight: '600', color: '#0e58a9' }}>Componente</span>
            <span style={{ fontWeight: '600', color: '#0e58a9' }}>→</span>
            <span style={{ fontWeight: '600', color: '#0e58a9' }}>Repositorio</span>
          </div>

          <div className="grid-auto">
            <div className="card card-highlight card-animate">
              <div className="card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3 className="card-title">Estandarización</h3>
              <p className="card-text">
                Cada funcionalidad sigue el mismo camino, lo que facilita que cualquier desarrollador pueda dar soporte a cualquier módulo.
              </p>
            </div>

            <div className="card card-highlight card-animate">
              <div className="card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3 className="card-title">Micro-Responsabilidades</h3>
              <p className="card-text">
                Separamos la validación, la orquestación y la lógica de negocio para crear un software altamente mantenible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Tenancy y Multi-Motor */}
      <section className="section animate-section">
        <div className="container">
          <h2 className="section-title">Multi-Tenancy y <span>Multi-Motor</span></h2>
          <div className="grid-auto">
            <div className="card card-float card-animate">
              <div className="card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                </svg>
              </div>
              <h3 className="card-title">Flexibilidad de Datos</h3>
              <p className="card-text">
                Soportamos los motores líderes del mercado (PostgreSQL, Oracle, SQL Server) para adaptarnos a la infraestructura que el cliente ya posea.
              </p>
            </div>

            <div className="card card-float card-animate">
              <div className="card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className="card-title">Aislamiento Total</h3>
              <p className="card-text">
                Cada cliente (Tenant) posee su propia base de datos física o esquema lógico aislado. No hay mezcla de información.
              </p>
            </div>

            <div className="card card-float card-animate">
              <div className="card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </div>
              <h3 className="card-title">Seguridad Dinámica</h3>
              <p className="card-text">
                El sistema conmuta entre bases de datos en milisegundos de forma transparente y segura.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Desarrollo a Medida */}
      <section className="section bg-light animate-section">
        <div className="container">
          <h2 className="section-title">Desarrollo a <span>Medida</span></h2>
          <p className="section-subtitle" style={{ fontSize: '1.2rem', fontWeight: '600', color: '#0e58a9' }}>
            Impulsado por SIMAPPE
          </p>
          <div className="grid-2">
            <div className="grid-2" style={{ gap: '1.5rem' }}>
              <div className="card card-highlight card-animate">
                <div className="card-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="6"></circle>
                    <circle cx="12" cy="12" r="2"></circle>
                  </svg>
                </div>
                <h3 className="card-title">Enfoque en el Negocio</h3>
                <p className="card-text">
                  Al tener la seguridad, conectividad y auditoría pre-configuradas, el equipo inicia el desarrollo de la lógica específica del cliente desde el día 1.
                </p>
              </div>

              <div className="card card-highlight card-animate">
                <div className="card-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <h3 className="card-title">Calidad Nativa</h3>
                <p className="card-text">
                  Los desarrollos a medida heredan automáticamente todos los beneficios de la arquitectura (Resiliencia, Trazabilidad, Multi-tenancy).
                </p>
              </div>

              <div className="card card-highlight card-animate">
                <div className="card-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                    <line x1="7" y1="7" x2="7.01" y2="7"></line>
                  </svg>
                </div>
                <h3 className="card-title">Flexibilidad Total</h3>
                <p className="card-text">
                  El cliente recibe un traje a la medida pero con la resistencia y estándares de una solución corporativa global.
                </p>
              </div>

              <div className="card card-highlight card-animate">
                <div className="card-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                  </svg>
                </div>
                <h3 className="card-title">Aceleración Extrema</h3>
                <p className="card-text">
                  Utilizamos el Simappe Archetype, una "semilla" industrial que genera la estructura de un proyecto completo con todos los estándares Nebula en segundos.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="card-animate">
              <img
                src={Fabrica2}
                alt="Desarrollo a Medida"
                style={{ width: '100%', maxWidth: '560px', height: 'auto', borderRadius: '20px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Enfoque Multisectorial */}
      <section className="section animate-section">
        <div className="container">
          <h2 className="section-title">Enfoque <span>Multisectorial</span></h2>
          <div className="grid-2">
            <div className="card card-highlight card-animate">
              <div className="card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <h3 className="card-title">Sector Privado (Corporativo)</h3>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', textAlign: 'left' }}>
                <li><strong>Agilidad Operativa:</strong> Implementación de células de ingeniería (Squads) para acelerar la innovación.</li>
                <li><strong>Modernización de Core:</strong> Transformación de sistemas legacy hacia arquitecturas modernas.</li>
                <li><strong>Control con Nebula:</strong> Despliegue de Nebula ERP como núcleo financiero y contable.</li>
              </ul>
            </div>

            <div className="card card-highlight card-animate">
              <div className="card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 21h18"></path>
                  <path d="M5 21V7l8-4v18"></path>
                  <path d="M19 21V11l-6-4"></path>
                  <line x1="9" y1="9" x2="9" y2="9.01"></line>
                  <line x1="9" y1="13" x2="9" y2="13.01"></line>
                  <line x1="9" y1="17" x2="9" y2="17.01"></line>
                </svg>
              </div>
              <h3 className="card-title">Sector Público</h3>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', textAlign: 'left' }}>
                <li><strong>Transformación Digital:</strong> Automatización de trámites masivos bajo estándares de gobierno digital.</li>
                <li><strong>Gobierno Abierto:</strong> Implementación de esquemas de transparencia, datos abiertos e interoperabilidad.</li>
                <li><strong>Gestión con Nebula:</strong> Aplicación del ecosistema Nebula ERP para administración financiera con cumplimiento normativo.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FabricaDeSoftware;
