/** Mensajes del sistema: inactividad y "no entendí" */
import { tema, HUMANO } from './acciones';

/** Inactividad: primero pregunta con amabilidad, luego se despide antes de cerrar */
export const INACTIVIDAD = {
  pregunta: {
    respuesta: ['¿Sigues por aquí{nombre}? 😊 Si necesitas un momento, tranquilo; cuando quieras seguimos.'],
    acciones: [tema('sigo_aqui', 'Sigo aquí, continuar'), tema('humano', 'Prefiero hablar con una persona')]
  },
  despedida: {
    respuesta: ['Cerré el chat para no interrumpirte. 💙 Tu conversación queda guardada: ábreme cuando quieras y seguimos donde quedamos.'],
    acciones: [tema('sigo_aqui', 'Continuar la conversación'), tema('menu', 'Ver opciones')]
  }
};

/** Cuando no entiende: nunca inventa, ofrece opciones y al gerente */
export const SIN_RESPUESTA = {
  respuesta: [
    'Mmm, no estoy segura de haber entendido bien{nombre}. 🤔',
    'Puedo contarte sobre nuestros servicios, recomendarte una solución en 3 preguntas, ayudarte a agendar una reunión o pasarle tu pregunta a nuestro gerente para que te responda personalmente.'
  ],
  acciones: [tema('diagnostico', 'Recomiéndame una solución'), tema('servicios', 'Ver servicios'), ...HUMANO]
};
