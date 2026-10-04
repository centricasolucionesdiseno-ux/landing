import { Bot, Zap, Shield, Brain, Globe, MessageCircle } from 'lucide-react';
import NebulinaBot from './NebulinaBot';
import { abrirNebulina } from '../../../components/nebulina/abrirNebulina';

const FEATURES = [
  { icon: Zap, title: 'Respuestas instantáneas', description: 'Obtén información en tiempo real sin esperas.' },
  { icon: Shield, title: 'Segura y confiable', description: 'Opera bajo los más altos estándares de seguridad.' },
  { icon: Brain, title: 'Aprendizaje continuo', description: 'Se mejora constantemente con cada interacción.' },
  { icon: Globe, title: 'Disponible 24/7', description: 'Siempre lista para ayudarte, cualquier día, cualquier hora.' }
];

const NebulinaSection = () => (
  <section className="nebulina-section">
    <div className="nebulina-container">
      <div className="nebulina-grid">
        <div className="nebulina-content">
          <div className="nebulina-badge" data-reveal>
            <Bot size={20} aria-hidden="true" />
            <span>Asistente Inteligente</span>
          </div>
          <h2 className="nebulina-title" data-reveal>
            Conoce a <span>Nebulina</span>
          </h2>
          <p className="nebulina-description text-justify" data-reveal>
            Nebulina es nuestro asistente virtual impulsado por inteligencia artificial,
            diseñado para acompañarte 24/7 en tus procesos de consulta, soporte y gestión
            de información. Más que un chatbot, es tu aliada inteligente dentro del ecosistema
            Céntrica.
          </p>

          <div className="nebulina-features">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="nebulina-feature" data-reveal>
                <span className="nebulina-feature-icon"><Icon size={22} aria-hidden="true" /></span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="nebulina-stage">
          <div className="nebulina-stage-bot" data-reveal="zoom">
            <NebulinaBot />
          </div>
          <div className="nebulina-bubbles">
            <div className="bubble bubble-1" data-reveal="right">
              <p>¡Hola! Soy Nebulina 👋</p>
            </div>
            <button type="button" className="bubble bubble-2 bubble-accion" onClick={abrirNebulina} data-reveal="right">
              <MessageCircle size={16} aria-hidden="true" />
              <span>¡Ya estoy en línea! Escríbeme</span>
            </button>
            <div className="bubble bubble-typing" data-reveal="right" aria-hidden="true">
              <span /><span /><span />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default NebulinaSection;
