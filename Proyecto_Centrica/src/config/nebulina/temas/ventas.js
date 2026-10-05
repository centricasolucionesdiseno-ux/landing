/**
 * Asesoría comercial: diagnóstico guiado y respuestas a las dudas que frenan
 * una decisión. Siempre con empatía, sin presionar y sin prometer precios ni
 * plazos cerrados.
 */
import { tema, AGENDAR, CORREO, WHATSAPP } from '../acciones';

export const TEMAS_VENTAS = {
  diagnostico: {
    etiqueta: 'Recomiéndame una solución',
    palabras: ['diagnostico', 'quiero un diagnostico', 'hacer un diagnostico', 'hagamos el diagnostico', 'recomiendame una solucion', 'ayudame a elegir', 'cual me conviene', 'que me conviene', 'cual elijo', 'no se cual', 'cuestionario', 'ayudame a decidir'],
    // El motor agrega la primera pregunta del diagnóstico (ver PERFIL en ventas.js)
    respuesta: ['¡Hagamos un diagnóstico rápido{nombre}! 🧭 Son solo 3 preguntas y te recomiendo la solución que mejor encaja contigo.'],
    acciones: []
  },
  porque_nosotros: {
    etiqueta: '¿Por qué Céntrica?',
    palabras: ['por que ustedes', 'por que centrica', 'por que elegirlos', 'por que deberia', 'que los diferencia', 'que los hace diferentes', 'diferencia', 'ventajas', 'competencia', 'mejor que', 'que ofrecen distinto'],
    respuesta: [
      'Buena pregunta{nombre}. 💙 Esto es lo que nos diferencia:',
      '• Un solo equipo de principio a fin: diagnóstico, desarrollo, pruebas y soporte.\n• Seguridad desde el diseño, con estándares como ISO 27001 y OWASP.\n• Soluciones a la medida que crecen contigo, sin pagar por lo que no usas.\n• Experiencia con empresas privadas y entidades públicas de Colombia.',
      'Lo mejor es comprobarlo: en una reunión sin compromiso te mostramos cómo resolveríamos tu caso.'
    ],
    acciones: [AGENDAR, tema('metodologia', '¿Cómo trabajan?'), WHATSAPP]
  },
  objecion_precio: {
    etiqueta: 'Me preocupa el presupuesto',
    palabras: ['caro', 'muy caro', 'costoso', 'muy costoso', 'no tengo presupuesto', 'sin presupuesto', 'poco presupuesto', 'presupuesto limitado', 'no me alcanza', 'algo economico', 'algo barato'],
    respuesta: [
      'Te entiendo{nombre}, cuidar el presupuesto es lo primero. 💙',
      'Por eso no vendemos paquetes cerrados: ajustamos el alcance a lo que de verdad necesitas y podemos avanzar por etapas, empezando por lo que más valor te da.',
      'En una reunión sin compromiso revisamos opciones que se ajusten a tu inversión.'
    ],
    acciones: [AGENDAR, tema('porque_nosotros', '¿Por qué Céntrica?'), WHATSAPP]
  },
  objecion_sistema: {
    etiqueta: 'Ya tengo un sistema',
    palabras: ['ya tengo un sistema', 'ya tenemos un sistema', 'ya tengo software', 'ya tenemos software', 'ya tengo un erp', 'ya tenemos un erp', 'ya usamos', 'ya uso', 'ya tenemos proveedor', 'ya tengo proveedor', 'ya contamos con', 'ya tenemos un programa', 'ya tengo un programa', 'ya contamos con un sistema'],
    respuesta: [
      '¡Qué bien que ya tengas una base{nombre}! 👍',
      'No hace falta empezar de cero: podemos integrarnos con lo que ya usas, modernizar solo lo que te frena o evaluar su calidad y seguridad para que sepas en qué punto está.',
      '¿Qué te gustaría mejorar?'
    ],
    acciones: [tema('fabrica_legado', 'Modernizar mi sistema'), tema('calidad', 'Evaluar mi sistema'), AGENDAR]
  },
  objecion_pensar: {
    etiqueta: 'Lo voy a pensar',
    palabras: ['lo voy a pensar', 'lo pienso', 'dejame pensarlo', 'tengo que pensarlo', 'mas adelante', 'despues te escribo', 'luego te escribo', 'despues hablamos', 'no estoy seguro', 'no estoy segura', 'lo consulto', 'tengo que consultarlo', 'lo voy a consultar', 'consultarlo', 'consultar con mi socio', 'consultar con mi jefe'],
    respuesta: [
      '¡Claro{nombre}, tómate tu tiempo! Es una decisión importante. 😊',
      'Si quieres, déjale tu correo a nuestro gerente y te envía la información para que la revises con calma y la compartas con tu equipo, sin compromiso.'
    ],
    acciones: [CORREO, WHATSAPP, tema('porque_nosotros', '¿Por qué Céntrica?')]
  }
};
