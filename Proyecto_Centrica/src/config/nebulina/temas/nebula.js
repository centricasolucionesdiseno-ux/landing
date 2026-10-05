/** Nebula ERP. */
import { ir, tema, CIERRE } from '../acciones';

export const TEMAS_NEBULA = {
  nebula: {
    palabras: ['nebula', 'erp', 'contabilidad', 'contable', 'inventario', 'inventarios', 'tesoreria', 'presupuesto', 'activos', 'grp', 'gestion empresarial', 'finanzas', 'software contable', 'programa contable', 'sistema contable'],
    respuesta: [
      'Nebula ERP centraliza las finanzas, la administración y los tributos de tu organización en una sola plataforma, con IA integrada y reportes en tiempo real.',
      'Sirve tanto para empresas privadas (ERP) como para entidades públicas (GRP), y cada cliente tiene sus datos totalmente aislados.'
    ],
    acciones: [tema('nebula_modulos', '¿Qué módulos tiene?'), tema('nebula_dian', '¿Tiene facturación electrónica?'), tema('nebula_ia', '¿Qué hace la IA?'), ir('/nebula-erp', 'Ver Nebula ERP')]
  },
  nebula_modulos: {
    etiqueta: '¿Qué módulos tiene?',
    palabras: ['modulos', 'funcionalidades', 'que incluye', 'caracteristicas', 'funciones'],
    respuesta: [
      'Nebula ERP tiene tres grandes áreas:',
      '• Financiera: contabilidad inteligente, tesorería, facturación y presupuesto 360°.\n• Administrativa: nómina, talento humano, suministros y activos fijos.\n• Tributaria (entidades públicas): Industria y Comercio (ICA), impuesto predial y acuerdos de pago.'
    ],
    acciones: [tema('nebula_nomina', 'Nómina y talento humano'), tema('nebula_reportes', 'Reportes'), ...CIERRE]
  },
  nebula_dian: {
    etiqueta: '¿Tiene facturación electrónica?',
    palabras: ['dian', 'factura electronica', 'facturacion electronica', 'facturar', 'facturacion'],
    respuesta: ['Sí. El módulo de facturación de Nebula ERP cumple de forma nativa con el ecosistema de facturación electrónica de la DIAN. ✅'],
    acciones: CIERRE
  },
  nebula_nomina: {
    palabras: ['nomina', 'talento humano', 'empleados', 'recursos humanos', 'rrhh', 'evaluacion de desempeno', 'clima laboral', 'colaboradores'],
    respuesta: [
      'En Nebula ERP procesas nóminas complejas y cumples las obligaciones de ley. 👥',
      'El módulo de Talento Humano digitaliza el ciclo de vida de tus colaboradores: expedientes, evaluaciones de desempeño y clima laboral.'
    ],
    acciones: CIERRE
  },
  nebula_ia: {
    palabras: ['ia integrada', 'inteligencia artificial integrada', 'prediccion', 'predictivo', 'anomalias', 'que hace la ia'],
    respuesta: ['La IA de Nebula ERP hace análisis predictivo, detecta anomalías y automatiza procesos repetitivos, para que tu equipo se concentre en decidir. 🤖'],
    acciones: [tema('nebula_reportes', 'Reportes'), ...CIERRE]
  },
  nebula_reportes: {
    palabras: ['reportes', 'informes', 'dashboard', 'dashboards', 'indicadores', 'kpi', 'kpis', 'tablero', 'estadisticas'],
    respuesta: ['Nebula ERP incluye dashboards interactivos, reportes personalizables e indicadores clave (KPIs) en tiempo real. 📊'],
    acciones: CIERRE
  },
  nebula_tributos: {
    etiqueta: 'Impuestos municipales',
    palabras: ['predial', 'ica', 'industria y comercio', 'impuestos', 'tributos', 'tributario', 'alcaldia', 'secretaria de hacienda', 'acuerdos de pago', 'cartera'],
    respuesta: [
      'Para entidades públicas, Nebula ERP moderniza la gestión tributaria: liquidación automatizada del ICA, control del impuesto predial con trazabilidad y reducción de cartera morosa, y acuerdos de pago flexibles.'
    ],
    acciones: [ir('/nebula-erp', 'Ver Nebula ERP'), ...CIERRE]
  }
};
