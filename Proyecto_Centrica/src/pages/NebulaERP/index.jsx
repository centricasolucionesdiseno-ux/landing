import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  BarChart3, Brain, Shield, LineChart, GanttChart, Landmark,
  TrendingUp, Eye, GitPullRequest, ShieldCheck, Scale, Smartphone,
  Zap, CheckCircle, Layers, Settings, Clock, FileCheck, Monitor,
  Calculator, Wallet, Receipt, Briefcase, Users, Warehouse,
  Factory, Home, Handshake, Building, Database, Cloud
} from 'lucide-react';
import LazyImage from '../../components/common/LazyImage';
import Nebula1 from '../../assets/images/Imagenes/Nebula1.png';
import Nebula2 from '../../assets/images/Imagenes/Nebula2.png';
import './styles.css';

gsap.registerPlugin(ScrollTrigger);

const NebulaERP = () => {
  const flipRefs = useRef([]);

  useEffect(() => {
    // Hero fade-in
    gsap.set('.hero-title, .hero-subtitle, .hero-description, .hero-buttons', { opacity: 0 });
    gsap.to('.hero-title', { opacity: 1, y: 0, duration: 0.8, delay: 0.3 });
    gsap.to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.8, delay: 0.5 });
    gsap.to('.hero-description', { opacity: 1, y: 0, duration: 0.8, delay: 0.7 });
    gsap.to('.hero-buttons', { opacity: 1, y: 0, duration: 0.8, delay: 0.9 });

    // ScrollTrigger para secciones completas
    ScrollTrigger.batch('.animar-seccion', {
      start: 'top 85%',
      once: true,
      onEnter: (batch) => batch.forEach(sec => {
        gsap.to(sec, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
      })
    });

    // ScrollTrigger para tarjetas
    ScrollTrigger.batch('.animar-tarjeta', {
      start: 'top 88%',
      once: true,
      onEnter: (batch) => batch.forEach(card => {
        gsap.to(card, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
      })
    });

    // Contadores
    const contadores = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const texto = el.innerText;
          const target = parseInt(texto.replace(/[^0-9]/g, ''));
          if (isNaN(target)) return;
          let current = 0;
          const incremento = Math.ceil(target / 80);
          const prefijo = texto.startsWith('+') ? '+' : texto.startsWith('-') ? '-' : '';
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

    // Flip en móvil
    flipRefs.current.forEach(ref => {
      if (ref) ref.addEventListener('click', () => ref.classList.toggle('flipped'));
    });

    // Force refresh after layout settles
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
    <div className="nebula-page">
      <Helmet>
        <title>Nebula ERP - Sistema de Gestión Empresarial Integral | Céntrica</title>
        <meta name="description" content="Nebula ERP centraliza operaciones financieras, inventarios y administrativas. Gestión empresarial con IA integrada y reportes en tiempo real." />
        <meta property="og:title" content="Nebula ERP - Plataforma de Gestión Empresarial | Céntrica" />
        <meta property="og:description" content="ERP integral para gestión financiera, administrativa y tributaria con inteligencia artificial." />
        <link rel="canonical" href="https://centricasoluciones.com/nebula-erp" />
      </Helmet>
      <section
        className="hero-video"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="hero-video-overlay"></div>
        <div className="hero-container">
          <h1 className="hero-title">Nebula <span>ERP</span></h1>
          <p className="hero-subtitle">Plataforma integral de gestión empresarial</p>
          <p className="hero-description">
            Centraliza operaciones financieras, de inventarios y administrativas en un solo ecosistema,
            con inteligencia artificial integrada y reportes en tiempo real.
          </p>
          <div className="hero-buttons">
            <Link to="/contacto" className="btn btn-primary">Solicitar demo →</Link>
            <button onClick={() => scrollA('caracteristicas')} className="btn btn-secondary">
              Conocer características →
            </button>
          </div>
        </div>
      </section>

      {/* ¿Qué es Nebula ERP? */}
      <section className="section animar-seccion" style={{ background: 'linear-gradient(135deg, #0a1929 0%, #16213e 100%)', color: 'white' }}>
        <div className="container">
          <div className="grid-2">
            <div className="animar-tarjeta">
              <h2 className="section-title" style={{ color: 'white' }}>¿Qué es <span style={{ color: '#f0f0f0' }}>Nebula ERP</span>?</h2>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginTop: '1rem', textAlign: 'justify', color: 'rgba(255,255,255,0.9)' }}>
                Nebula ERP reúne en una sola plataforma la operación financiera, administrativa y tributaria
                de su organización. A través de tres soluciones principales —Gestión Financiera, Gestión
                Administrativa y Nebula Rentas— elimina los silos de información y maximiza la eficiencia operativa.
              </p>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginTop: '1rem', textAlign: 'justify', color: 'rgba(255,255,255,0.9)' }}>
                Construida sobre la arquitectura SIMAPPE, Nebula hereda automáticamente capacidades de
                multi-tenancy, seguridad avanzada y auditoría completa, permitiendo que su equipo se enfoque
                en lo que realmente importa: hacer crecer su negocio.
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="animar-tarjeta">
              <LazyImage
                src={Nebula1}
                alt="Nebula ERP Ilustración"
                style={{ width: '100%', maxWidth: '500px', height: 'auto', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Soluciones Principales */}
      <section id="caracteristicas" className="section bg-light animar-seccion">
        <div className="container">
          <h2 className="section-title">Soluciones <span>Principales</span></h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted, #666)', maxWidth: '700px', margin: '0 auto 2rem' }}>
            Tres soluciones integradas, con los módulos que integra cada una.
          </p>
          <div className="grid-auto">
            <div className="card card-float animar-tarjeta">
              <div className="card-icon"><LineChart size={48} /></div>
              <h3 className="card-title">Gestión Financiera</h3>
              <p className="card-text">
                Unifica la visión contable, el control presupuestario, la facturación y la tesorería
                en una sola plataforma, garantizando el cumplimiento fiscal y la información en tiempo real.
              </p>
              <p className="card-text" style={{ marginTop: '0.75rem', fontStyle: 'italic', fontSize: '0.9em' }}>
                Módulos: Contabilidad, Presupuesto, Tesorería y Facturación.
              </p>
            </div>
            <div className="card card-float animar-tarjeta">
              <div className="card-icon"><GanttChart size={48} /></div>
              <h3 className="card-title">Gestión Administrativa</h3>
              <p className="card-text">
                Unifica la gestión de personas (nómina y talento humano) con la administración de
                recursos tangibles (suministros y activos), reduciendo costos operativos y silos de información.
              </p>
              <p className="card-text" style={{ marginTop: '0.75rem', fontStyle: 'italic', fontSize: '0.9em' }}>
                Módulos: Nómina, Talento Humano y Suministros y Activos.
              </p>
            </div>
            <div className="card card-float animar-tarjeta">
              <div className="card-icon"><Landmark size={48} /></div>
              <h3 className="card-title">Nebula Rentas <span style={{ fontSize: '0.6em', fontWeight: 400 }}>(Sector Público)</span></h3>
              <p className="card-text">
                Moderniza la gestión tributaria de su institución: liquidación automatizada de ICA,
                control riguroso del impuesto predial y flexibilidad en los acuerdos de pago.
              </p>
              <p className="card-text" style={{ marginTop: '0.75rem', fontStyle: 'italic', fontSize: '0.9em' }}>
                Módulos: Industria y Comercio (ICA), Impuesto Predial y Acuerdos de Pago.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Capacidades Transversales */}
      <section className="section animar-seccion">
        <div className="container">
          <h2 className="section-title">Capacidades <span>Transversales</span></h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted, #666)', maxWidth: '700px', margin: '0 auto 2rem' }}>
            Presentes en las tres soluciones, sin importar cuál implemente primero.
          </p>
          <div className="grid-auto">
            <div className="card card-float animar-tarjeta">
              <div className="card-icon"><Brain size={48} /></div>
              <h3 className="card-title">Inteligencia Artificial Integrada</h3>
              <p className="card-text">Análisis predictivo, detección de anomalías y automatización de procesos repetitivos.</p>
            </div>
            <div className="card card-float animar-tarjeta">
              <div className="card-icon"><BarChart3 size={48} /></div>
              <h3 className="card-title">Reportes en Tiempo Real</h3>
              <p className="card-text">Dashboards interactivos, reportes personalizables e indicadores clave de rendimiento (KPIs).</p>
            </div>
            <div className="card card-float animar-tarjeta">
              <div className="card-icon"><Shield size={48} /></div>
              <h3 className="card-title">Seguridad Multi-Tenant</h3>
              <p className="card-text">Aislamiento total de datos, auditoría completa y cifrado de información en cada solución.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Módulos Especializados */}
      <section className="section section-modulos animar-seccion">
        <div className="container">
          <h2 className="section-title">Módulos <span>Especializados</span></h2>

          <h3 className="modulo-categoria">Gestión Financiera</h3>
          <div className="grid-2">
            <div className="card card-highlight animar-tarjeta">
              <div className="card-icon"><Calculator size={48} /></div>
              <h3 className="card-title">Módulo Contable Inteligente</h3>
              <p className="card-text"><strong>Cumplimiento total y control estratégico en un solo lugar.</strong> Automatiza el registro de transacciones y centraliza la operación financiera.</p>
            </div>
            <div className="card card-highlight animar-tarjeta">
              <div className="card-icon"><Wallet size={48} /></div>
              <h3 className="card-title">Tesorería</h3>
              <p className="card-text"><strong>El motor de su estabilidad.</strong> Visibilidad en tiempo real de obligaciones a corto y largo plazo, con generación de archivos planos para pagos masivos.</p>
            </div>
            <div className="card card-highlight animar-tarjeta">
              <div className="card-icon"><Receipt size={48} /></div>
              <h3 className="card-title">Facturación</h3>
              <p className="card-text"><strong>El motor inteligente detrás de sus finanzas.</strong> Cumplimiento nativo con el ecosistema de facturación electrónica de la DIAN.</p>
            </div>
            <div className="card card-highlight animar-tarjeta">
              <div className="card-icon"><Scale size={48} /></div>
              <h3 className="card-title">Gestión Presupuestaria 360°</h3>
              <p className="card-text"><strong>Control total para gobiernos y empresas.</strong> Sector Público (GRP) y Sector Privado (ERP) con centros de costo y rentabilidad.</p>
            </div>
          </div>

          <h3 className="modulo-categoria" style={{ marginTop: '3rem' }}>Gestión Administrativa</h3>
          <div className="grid-2">
            <div className="card card-highlight animar-tarjeta">
              <div className="card-icon"><Briefcase size={48} /></div>
              <h3 className="card-title">Nómina</h3>
              <p className="card-text"><strong>Pagos a tiempo, cumplimiento garantizado.</strong> Procese nóminas complejas, genere reportes financieros detallados y garantice el cumplimiento de obligaciones.</p>
            </div>
            <div className="card card-highlight animar-tarjeta">
              <div className="card-icon"><Users size={48} /></div>
              <h3 className="card-title">Talento Humano</h3>
              <p className="card-text"><strong>Su equipo en sintonía.</strong> Digitalice el ciclo de vida de sus colaboradores: expedientes, evaluaciones de desempeño y clima laboral.</p>
            </div>
            <div className="card card-highlight animar-tarjeta">
              <div className="card-icon"><Warehouse size={48} /></div>
              <h3 className="card-title">Suministros y Activos</h3>
              <p className="card-text"><strong>Sus recursos bajo control, en tiempo real.</strong> Gestione el ciclo de vida completo de activos fijos y optimice sus inventarios.</p>
            </div>
          </div>

          <h3 className="modulo-categoria" style={{ marginTop: '3rem' }}>Nebula Rentas (Sector Público)</h3>
          <div className="grid-2">
            <div className="card card-highlight animar-tarjeta">
              <div className="card-icon"><Factory size={48} /></div>
              <h3 className="card-title">Industria y Comercio (ICA)</h3>
              <p className="card-text">Liquidación automatizada del Impuesto de Industria y Comercio, para maximizar los ingresos y simplificar los trámites.</p>
            </div>
            <div className="card card-highlight animar-tarjeta">
              <div className="card-icon"><Home size={48} /></div>
              <h3 className="card-title">Impuesto Predial</h3>
              <p className="card-text">Control riguroso del Impuesto Predial, con trazabilidad y reducción de la cartera morosa.</p>
            </div>
            <div className="card card-highlight animar-tarjeta">
              <div className="card-icon"><Handshake size={48} /></div>
              <h3 className="card-title">Acuerdos de Pago</h3>
              <p className="card-text">Flexibilidad para formalizar acuerdos de pago que acercan la administración al ciudadano.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Arquitectura SIMAPPE + Nebula */}
      <section className="section section-arquitectura animar-seccion">
        <div className="container">
          <h2 className="section-title" style={{ color: 'white' }}>
            La <span style={{ color: '#4a9eff' }}>Arquitectura</span> detrás de Nebula
          </h2>
          <div className="grid-2">
            <div className="card animar-tarjeta" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)', color: 'white', textAlign: 'center' }}>
              <div className="card-icon"><Layers size={48} style={{ color: '#4a9eff' }} /></div>
              <h3 className="card-title" style={{ color: 'white' }}>SIMAPPE - El Cimiento</h3>
              <p className="card-text" style={{ color: 'rgba(255,255,255,0.9)' }}>
                Gestiona la seguridad, multi-tenancy, auditoría y servicios base que toda aplicación empresarial requiere.
              </p>
            </div>
            <div className="card animar-tarjeta" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)', color: 'white', textAlign: 'center' }}>
              <div className="card-icon"><Cloud size={48} style={{ color: '#4a9eff' }} /></div>
              <h3 className="card-title" style={{ color: 'white' }}>Nebula - El Negocio</h3>
              <p className="card-text" style={{ color: 'rgba(255,255,255,0.9)' }}>
                Contiene la lógica específica de Contabilidad, Nómina, Inventarios y demás procesos operativos.
              </p>
            </div>
          </div>
          <div className="card animar-tarjeta" style={{ marginTop: '2rem', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', textAlign: 'center' }}>
            <p style={{ color: 'white' }}>
              <strong>Ventaja competitiva:</strong> Su equipo se enfoca 100% en resolver el problema del negocio, no en reinventar la infraestructura técnica.
            </p>
          </div>
        </div>
      </section>

      {/* Multi-Tenancy y Multi-Motor */}
      <section className="section animar-seccion">
        <div className="container">
          <h2 className="section-title">Multi-Tenancy y <span>Multi-Motor</span></h2>
          <div className="grid-auto">
            <div className="card card-float animar-tarjeta">
              <div className="card-icon"><Database size={48} /></div>
              <h3 className="card-title">Flexibilidad de Datos</h3>
              <p className="card-text">Soportamos los motores líderes del mercado (PostgreSQL, Oracle, SQL Server) para adaptarnos a su infraestructura existente.</p>
            </div>
            <div className="card card-float animar-tarjeta">
              <div className="card-icon"><Shield size={48} /></div>
              <h3 className="card-title">Aislamiento Total</h3>
              <p className="card-text">Cada cliente posee su propia base de datos física o esquema lógico aislado. No hay mezcla de información.</p>
            </div>
            <div className="card card-float animar-tarjeta">
              <div className="card-icon"><Zap size={48} /></div>
              <h3 className="card-title">Conmutación Transparente</h3>
              <p className="card-text">El sistema conmuta entre bases de datos en milisegundos, ofreciendo una experiencia unificada y segura.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios para el Negocio (Flip Cards) */}
      <section className="section bg-light animar-seccion">
        <div className="container">
          <h2 className="section-title">Beneficios para <span>su Negocio</span></h2>
          <div className="grid-auto">
            <div className="card-flip" ref={el => flipRefs.current[0] = el}>
              <div className="card-flip-inner">
                <div className="card-flip-front">
                  <div className="card-icon"><TrendingUp size={48} /></div>
                  <h3 className="card-title">Eficiencia Operativa</h3>
                  <p className="card-text">← Haz clic o pasa el mouse</p>
                </div>
                <div className="card-flip-back">
                  <div className="card-icon"><Zap size={48} /></div>
                  <h3 className="card-title">-70%</h3>
                  <p className="card-text">Automatice procesos repetitivos y reduzca tiempos de ejecución.</p>
                </div>
              </div>
            </div>
            <div className="card-flip" ref={el => flipRefs.current[1] = el}>
              <div className="card-flip-inner">
                <div className="card-flip-front">
                  <div className="card-icon"><Eye size={48} /></div>
                  <h3 className="card-title">Visibilidad Total</h3>
                  <p className="card-text">← Haz clic o pasa el mouse</p>
                </div>
                <div className="card-flip-back">
                  <div className="card-icon"><BarChart3 size={48} /></div>
                  <h3 className="card-title">360°</h3>
                  <p className="card-text">Acceda a información consolidada de toda la organización desde un solo lugar.</p>
                </div>
              </div>
            </div>
            <div className="card-flip" ref={el => flipRefs.current[2] = el}>
              <div className="card-flip-inner">
                <div className="card-flip-front">
                  <div className="card-icon"><GitPullRequest size={48} /></div>
                  <h3 className="card-title">Toma de Decisiones Ágil</h3>
                  <p className="card-text">← Haz clic o pasa el mouse</p>
                </div>
                <div className="card-flip-back">
                  <div className="card-icon"><Clock size={48} /></div>
                  <h3 className="card-title">Tiempo Real</h3>
                  <p className="card-text">Reportes en tiempo real e indicadores clave al alcance de su mano.</p>
                </div>
              </div>
            </div>
            <div className="card-flip" ref={el => flipRefs.current[3] = el}>
              <div className="card-flip-inner">
                <div className="card-flip-front">
                  <div className="card-icon"><ShieldCheck size={48} /></div>
                  <h3 className="card-title">Cumplimiento Normativo</h3>
                  <p className="card-text">← Haz clic o pasa el mouse</p>
                </div>
                <div className="card-flip-back">
                  <div className="card-icon"><FileCheck size={48} /></div>
                  <h3 className="card-title">100%</h3>
                  <p className="card-text">Auditoría completa y trazabilidad de cada transacción para cumplir con requisitos legales.</p>
                </div>
              </div>
            </div>
            <div className="card-flip" ref={el => flipRefs.current[4] = el}>
              <div className="card-flip-inner">
                <div className="card-flip-front">
                  <div className="card-icon"><Scale size={48} /></div>
                  <h3 className="card-title">Escalabilidad Garantizada</h3>
                  <p className="card-text">← Haz clic o pasa el mouse</p>
                </div>
                <div className="card-flip-back">
                  <div className="card-icon"><TrendingUp size={48} /></div>
                  <h3 className="card-title">Ilimitado</h3>
                  <p className="card-text">La plataforma crece con su negocio, sin necesidad de migraciones complejas.</p>
                </div>
              </div>
            </div>
            <div className="card-flip" ref={el => flipRefs.current[5] = el}>
              <div className="card-flip-inner">
                <div className="card-flip-front">
                  <div className="card-icon"><Smartphone size={48} /></div>
                  <h3 className="card-title">Acceso Multiplataforma</h3>
                  <p className="card-text">← Haz clic o pasa el mouse</p>
                </div>
                <div className="card-flip-back">
                  <div className="card-icon"><Monitor size={48} /></div>
                  <h3 className="card-title">Anywhere</h3>
                  <p className="card-text">Disponible en web, dispositivos móviles y tabletas, con experiencia de usuario consistente.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Casos de Uso por Sector */}
      <section className="section animar-seccion">
        <div className="container">
          <h2 className="section-title">Nebula en <span>Acción</span></h2>
          <div className="grid-2">
            <div className="card card-highlight animar-tarjeta">
              <div className="card-icon"><Building size={48} /></div>
              <h3 className="card-title">Sector Privado</h3>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
                <li><strong>Manufactura:</strong> Control de producción, costos y cadena de suministro.</li>
                <li><strong>Retail:</strong> Gestión multicanal, inventarios y promociones.</li>
                <li><strong>Servicios:</strong> Facturación recurrente, proyectos y CRM integrado.</li>
                <li><strong>Construcción:</strong> Control de obras, presupuestos y subcontratistas.</li>
              </ul>
            </div>
            <div className="card card-highlight animar-tarjeta">
              <div className="card-icon"><Landmark size={48} /></div>
              <h3 className="card-title">Sector Público</h3>
              <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
                <li><strong>Presupuesto:</strong> Ejecución presupuestal y control de gasto público.</li>
                <li><strong>Contratación:</strong> Gestión de procesos de contratación estatal.</li>
                <li><strong>Tesorería:</strong> Administración de recursos y pagos a proveedores.</li>
                <li><strong>Transparencia:</strong> Portales de datos abiertos y rendición de cuentas.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ¿Por qué Nebula ERP? */}
      <section className="section bg-light animar-seccion">
        <div className="container">
          <h2 className="section-title">¿Por qué <span>Nebula ERP</span>?</h2>
          <div className="grid-2">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="animar-tarjeta">
              <LazyImage
                src={Nebula2}
                alt="Nebula ERP"
                style={{ width: '100%', maxWidth: '560px', height: 'auto' }}
              />
            </div>
            <div className="grid-2" style={{ gap: '1.5rem' }}>
              <div className="card card-highlight animar-tarjeta">
                <div className="card-icon"><CheckCircle size={48} /></div>
                <h3 className="card-title">Arquitectura Moderna</h3>
                <p className="card-text">Construido sobre SIMAPPE, no hereda deuda técnica de sistemas legacy.</p>
              </div>
              <div className="card card-highlight animar-tarjeta">
                <div className="card-icon"><Brain size={48} /></div>
                <h3 className="card-title">IA Integrada</h3>
                <p className="card-text">A diferencia de otros ERPs, Nebula incorpora inteligencia artificial en el núcleo.</p>
              </div>
              <div className="card card-highlight animar-tarjeta">
                <div className="card-icon"><Layers size={48} /></div>
                <h3 className="card-title">Multi-Tenancy Nativa</h3>
                <p className="card-text">Diseñado desde cero para servir a múltiples clientes con aislamiento total.</p>
              </div>
              <div className="card card-highlight animar-tarjeta">
                <div className="card-icon"><Settings size={48} /></div>
                <h3 className="card-title">Personalizable</h3>
                <p className="card-text">Sin necesidad de costosos desarrollos, la plataforma se adapta a sus procesos.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resultados Medibles */}
      <section className="stats-section bg-primary animar-seccion">
        <div className="container">
          <h2 className="section-title" style={{ color: 'white' }}>
            Resultados <span style={{ color: '#4a9eff' }}>Medibles</span>
          </h2>
          <div className="stats-grid">
            <div className="stat-item" style={{ textAlign: 'center', color: 'white' }}>
              <span className="stat-number">+40%</span>
              <span className="stat-label">Incremento en eficiencia operativa</span>
            </div>
            <div className="stat-item" style={{ textAlign: 'center', color: 'white' }}>
              <span className="stat-number">-50%</span>
              <span className="stat-label">Reducción en tiempos de cierre contable</span>
            </div>
            <div className="stat-item" style={{ textAlign: 'center', color: 'white' }}>
              <span className="stat-number">+99.9%</span>
              <span className="stat-label">Disponibilidad garantizada</span>
            </div>
            <div className="stat-item" style={{ textAlign: 'center', color: 'white' }}>
              <span className="stat-number">+60%</span>
              <span className="stat-label">Mejora en precisión de inventarios</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="section bg-primary section-cta animar-seccion">
        <div className="container">
          <h2>¿Listo para transformar la gestión de su empresa?</h2>
          <p>Solicite una demo personalizada y descubra cómo Nebula ERP puede optimizar sus operaciones.</p>
          <Link to="/contacto" className="btn btn-primary" style={{ background: 'white', color: '#0e58a9' }}>
            Solicitar información técnica →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default NebulaERP;