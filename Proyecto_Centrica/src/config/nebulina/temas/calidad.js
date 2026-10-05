/** Evaluaciones de calidad de software. */
import { ir, tema, CIERRE } from '../acciones';

export const TEMAS_CALIDAD = {
  calidad: {
    etiqueta: '¿Cómo evalúan la calidad?',
    palabras: ['calidad', 'pruebas', 'pruebas de software', 'probar software', 'testing', 'qa', 'tester', 'bugs', 'errores', 'auditoria de codigo', 'pruebas de carga', 'rendimiento', 'pentest', 'vulnerabilidades', 'automatizacion de pruebas', 'usabilidad'],
    respuesta: [
      'En Evaluaciones de calidad aseguramos que tu software funcione, rinda y sea seguro: pruebas funcionales, de rendimiento, de seguridad y de usabilidad, automatización de pruebas y auditoría de código.',
      'Trabajamos con estándares como ISO 25000, ISTQB, ISO 27001 y OWASP.'
    ],
    acciones: [tema('calidad_tipos', '¿Qué tipos de evaluación hay?'), tema('calidad_herramientas', 'Herramientas'), ir('/evaluaciones-calidad', 'Ver Evaluaciones de calidad')]
  },
  calidad_tipos: {
    etiqueta: '¿Qué tipos de evaluación hay?',
    palabras: ['tipos de evaluacion', 'diagnostico rapido', 'auditoria completa', 'qa continuo', 'capacitacion', 'modalidades'],
    respuesta: [
      'Tenemos cuatro modalidades:',
      '• Diagnóstico rápido: 2 a 3 días para detectar riesgos críticos.\n• Auditoría completa: calidad, seguridad y rendimiento (4 a 6 semanas).\n• QA continuo: integrado a tu ciclo de desarrollo.\n• Capacitación: formamos a tu equipo en pruebas de software.'
    ],
    acciones: CIERRE
  },
  calidad_herramientas: {
    palabras: ['herramientas', 'selenium', 'cypress', 'playwright', 'jmeter', 'k6', 'sonarqube', 'owasp zap', 'burp', 'appium', 'jira', 'testrail'],
    respuesta: [
      'Usamos herramientas líderes según el tipo de prueba:',
      '• Automatización: Selenium, Cypress, Playwright, JUnit.\n• Rendimiento: JMeter, Gatling, k6.\n• Seguridad: Burp Suite, OWASP ZAP, SonarQube.\n• Móvil: Appium, Detox, Espresso.\n• Gestión: JIRA, TestRail, Xray.'
    ],
    acciones: CIERRE
  }
};
