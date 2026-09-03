import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const StatsSection = () => {
  const [counts, setCounts] = useState({
    experience: 0,
    projects: 0,
    satisfaction: 0,
    support: 0
  });
  const sectionRef = useRef(null);
  const numbersRef = useRef([]);
  const [hasAnimated, setHasAnimated] = useState(false);

  const stats = [
    { key: 'experience', target: 5, label: '+ años de experiencia', delay: 0, floatY: -25, duration: 1.5, glowIntensity: 1.2 },
    { key: 'projects', target: 50, label: '+ proyectos entregados', delay: 0.1, floatY: -30, duration: 1.8, glowIntensity: 1.6 },
    { key: 'satisfaction', target: 100, label: '% clientes satisfechos', delay: 0.2, floatY: -22, duration: 1.6, glowIntensity: 2 },
    { key: 'support', target: 24, label: '/7 soporte dedicado', delay: 0.15, floatY: -28, duration: 1.7, glowIntensity: 1.4 }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            animateCounters();
            animateFloating();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

  const animateCounters = () => {
    stats.forEach((stat, index) => {
      const obj = { value: 0 };
      gsap.to(obj, {
        value: stat.target,
        duration: 2.5,
        delay: stat.delay,
        ease: 'expo.out',
        onUpdate: () => {
          setCounts((prev) => ({ ...prev, [stat.key]: Math.floor(obj.value) }));
        }
      });
    });
  };

  const animateFloating = () => {
    numbersRef.current.forEach((el, index) => {
      if (el) {
        const stat = stats[index];

        // Animación flotante más rápida y dinámica
        gsap.to(el, {
          y: stat.floatY,
          duration: stat.duration,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          delay: stat.delay * 0.5
        });

        // Movimiento horizontal sutil
        gsap.to(el, {
          x: gsap.utils.random(-5, 5),
          duration: stat.duration * 1.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: stat.delay * 0.5 + 0.2
        });

        // Rotación sutil aleatoria
        gsap.to(el, {
          rotation: gsap.utils.random(-2, 2),
          duration: stat.duration * 0.9,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: stat.delay * 0.5 + 0.1
        });

        // Escala pulsante más rápida
        gsap.to(el, {
          scale: 1.08,
          duration: stat.duration * 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'power2.inOut',
          delay: stat.delay * 0.5 + 0.3
        });

        // Animación de brillo más intensa y rápida
        const timeline = gsap.timeline({ repeat: -1, delay: stat.delay * 0.3 });
        timeline.to(el, {
          textShadow: `0 0 ${35 * stat.glowIntensity}px rgba(74, 158, 255, 1),
                       0 0 ${60 * stat.glowIntensity}px rgba(74, 158, 255, 0.9),
                       0 0 ${90 * stat.glowIntensity}px rgba(74, 158, 255, 0.7),
                       0 0 ${130 * stat.glowIntensity}px rgba(74, 158, 255, 0.5),
                       0 0 ${180 * stat.glowIntensity}px rgba(74, 158, 255, 0.3)`,
          duration: 0.6,
          ease: 'power2.inOut'
        }).to(el, {
          textShadow: `0 0 15px rgba(74, 158, 255, 0.7),
                       0 0 25px rgba(74, 158, 255, 0.5),
                       0 0 40px rgba(74, 158, 255, 0.3)`,
          duration: 0.6,
          ease: 'power2.inOut'
        });
      }
    });
  };

  return (
    <section
      ref={sectionRef}
      className="stats-section bg-primary"
      data-animation="fade-up"
    >
      <div className="container">
        <h2 className="section-title" style={{ color: 'white' }} data-animation="fade-down">
          Nuestro <span style={{ color: '#4a9eff' }}>impacto</span>
        </h2>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div
              key={stat.key}
              className="stat-item"
              style={{ textAlign: 'center', color: 'white' }}
              data-animation="zoom-in"
              data-delay={stat.delay}
            >
              <span
                ref={(el) => (numbersRef.current[index] = el)}
                className="stat-number"
                style={{
                  display: 'inline-block',
                  textShadow: '0 0 15px rgba(74, 158, 255, 0.6)',
                  transformOrigin: 'center center',
                  willChange: 'transform'
                }}
              >
                {counts[stat.key]}
              </span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
