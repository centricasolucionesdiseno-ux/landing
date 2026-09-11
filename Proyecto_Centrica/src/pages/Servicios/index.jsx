import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroVideoSection from './components/HeroVideoSection';
import ServicesGridSection from './components/ServicesGridSection';
import ModeloEntregaSection from './components/ModeloEntregaSection';
import CTASection from './components/CTASection';

gsap.registerPlugin(ScrollTrigger);

const Servicios = () => {
  useEffect(() => {
    // Hero animations
    gsap.set('.hero-title, .hero-description, .hero-buttons', { opacity: 0, y: 30 });

    gsap.to('.hero-title', {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 0.3
    });

    gsap.to('.hero-description', {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 0.5
    });

    gsap.to('.hero-buttons', {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 0.7
    });

    // Scroll-triggered animations for sections
    const sections = document.querySelectorAll('.servicios-page .section');
    sections.forEach((section) => {
      gsap.fromTo(section,
        {
          opacity: 0,
          y: 50
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Card animations
    const cards = document.querySelectorAll('.servicios-page .card-animate');
    cards.forEach((card, index) => {
      gsap.fromTo(card,
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.1,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Hover animations for float cards
    const floatCards = document.querySelectorAll('.servicios-page .card-float');
    floatCards.forEach((card) => {
      const onMouseEnter = () => {
        gsap.to(card, {
          y: -10,
          scale: 1.02,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          duration: 0.3,
          ease: 'power2.out'
        });

        const icon = card.querySelector('.card-icon');
        if (icon) {
          gsap.to(icon, {
            scale: 1.1,
            rotation: 5,
            duration: 0.3,
            ease: 'back.out(1.7)'
          });
        }
      };

      const onMouseLeave = () => {
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
      };

      card.addEventListener('mouseenter', onMouseEnter);
      card.addEventListener('mouseleave', onMouseLeave);
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="servicios-page">
      <Helmet>
        <title>Servicios - Soluciones Empresariales | Céntrica</title>
        <meta name="description" content="Descubre nuestros servicios tecnológicos: Fábrica de software, Nebula ERP, Sicovi, Análisis con IA, Evaluaciones de Calidad y Consultoría Digital." />
        <meta property="og:title" content="Servicios | Céntrica" />
        <meta property="og:description" content="Soluciones tecnológicas diseñadas para acelerar tu negocio, desde el desarrollo ágil hasta la consultoría estratégica." />
        <link rel="canonical" href="https://centricasoluciones.com/servicios" />
      </Helmet>
      <HeroVideoSection />
      <ServicesGridSection />
      <ModeloEntregaSection />
      <CTASection />
    </div>
  );
};

export default Servicios;
