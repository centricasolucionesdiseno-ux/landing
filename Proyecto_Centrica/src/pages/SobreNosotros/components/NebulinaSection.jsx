import { Bot, Zap, Shield, Brain, Globe } from 'lucide-react';

const NebulinaSection = () => {
  const features = [
    {
      icon: Zap,
      title: 'Respuestas instantáneas',
      description: 'Obtén información en tiempo real sin esperas.'
    },
    {
      icon: Shield,
      title: 'Segura y confiable',
      description: 'Opera bajo los más altos estándares de seguridad.'
    },
    {
      icon: Brain,
      title: 'Aprendizaje continuo',
      description: 'Se mejora constantemente con cada interacción.'
    },
    {
      icon: Globe,
      title: 'Disponible 24/7',
      description: 'Siempre lista para ayudarte, cualquier día, cualquier hora.'
    }
  ];

  return (
    <section className="nebulina-section">
      <div className="nebulina-container">
        <div className="nebulina-grid">
          {/* Lado izquierdo: Información */}
          <div className="nebulina-content">
            <div className="nebulina-badge">
              <Bot size={20} />
              <span>Asistente Inteligente</span>
            </div>
            <h2 className="nebulina-title">
              Conoce a <span>Nebulina</span>
            </h2>
            <p className="nebulina-description" style={{ textAlign: 'justify' }}>
              Nebulina es nuestro asistente virtual impulsado por inteligencia artificial,
              diseñado para acompañarte 24/7 en tus procesos de consulta, soporte y gestión
              de información. Más que un chatbot, es tu aliada inteligente dentro del ecosistema
              Céntrica.
            </p>

            <div className="nebulina-features">
              {features.map((feature, index) => (
                <div key={index} className="nebulina-feature">
                  <feature.icon size={24} />
                  <div>
                    <h4>{feature.title}</h4>
                    <p style={{ textAlign: 'justify' }}>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lado derecho: Imagen/Ilustración de Nebulina */}
          <div className="nebulina-avatar">
            <div className="nebulina-avatar-circle">
              <div className="nebulina-avatar-icon">
                <img
                  src="/src/assets/images/Imagenes/Neutro.png"
                  style={{ width: '100%', maxWidth: '200px', height: 'auto', borderRadius: '20px' }}
                  alt="Nebulina"
                />
              </div>
              <div className="nebulina-pulse"></div>
            </div>
            <div className="nebulina-bubbles">
              <div className="bubble bubble-1">
                <p>¡Hola! Soy Nebulina 🤖</p>
              </div>
              <div className="bubble bubble-2">
                <p>Estaré disponible muy pronto</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NebulinaSection;
