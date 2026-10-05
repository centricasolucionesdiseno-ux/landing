/** Conversación: saludos, cortesía y ayuda sobre la propia Nebulina. */
import { tema, AGENDAR, HUMANO } from '../acciones';

export const TEMAS_CONVERSACION = {
  saludo: {
    palabras: ['hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches', 'hey', 'saludos', 'que tal', 'holi'],
    respuesta: ['¡Hola{nombre}! 😊 Qué gusto saludarte. Cuéntame qué buscas y te ayudo a encontrarlo.'],
    acciones: [tema('servicios', '¿Qué servicios ofrecen?'), tema('recomendar', '¿Qué solución necesito?'), tema('humano', 'Hablar con una persona')]
  },
  como_estas: {
    palabras: ['como estas', 'como vas', 'como te va', 'que haces', 'todo bien'],
    respuesta: ['¡Muy bien, gracias por preguntar{nombre}! 💙 Lista para ayudarte. ¿Qué te gustaría saber de Céntrica?'],
    acciones: [tema('servicios', 'Ver servicios'), tema('recomendar', '¿Qué solución necesito?')]
  },
  nebulina: {
    palabras: ['quien eres', 'que eres', 'nebulina', 'eres un robot', 'eres humana', 'eres una persona', 'eres real', 'bot', 'asistente virtual'],
    respuesta: [
      'Soy Nebulina, la asistente virtual de Céntrica. 🤖💙',
      'Conozco nuestros servicios y te conecto con nuestro gerente comercial, que sí es una persona de carne y hueso, cuando lo necesites.'
    ],
    acciones: [tema('capacidades', '¿Qué puedes hacer?'), tema('humano', 'Hablar con el gerente')]
  },
  capacidades: {
    palabras: ['que puedes hacer', 'en que me ayudas', 'como funcionas', 'que sabes', 'ayuda', 'como te uso'],
    respuesta: [
      'Esto es lo que puedo hacer por ti:',
      '• Explicarte cada servicio de Céntrica y recomendarte el adecuado con un diagnóstico de 3 preguntas.\n• Conversar por voz: dicta tu pregunta con el micrófono y te leo las respuestas en voz alta.\n• Ayudarte a agendar una reunión virtual con el servicio ya elegido.\n• Pasarle tu mensaje al gerente o abrir WhatsApp con tu consulta.\n• Darte horarios, ubicación y datos de contacto.',
      'Puedes escribirme con tus palabras, hablarme o usar los botones. 😉'
    ],
    acciones: [tema('diagnostico', 'Recomiéndame una solución'), tema('servicios', 'Ver servicios'), AGENDAR]
  },
  voz: {
    etiqueta: '¿Puedo hablarte por voz?',
    palabras: ['voz', 'por voz', 'hablarte', 'hablar contigo', 'microfono', 'dictar', 'dictado', 'escucharme', 'me escuchas', 'leer en voz alta', 'lee en voz alta', 'audio'],
    respuesta: [
      '¡Claro que sí! 🎙️ Pulsa el micrófono junto a la caja de texto, dime tu pregunta y te respondo. Si me hablas, también te respondo en voz alta.',
      'Con el botón del parlante, arriba, puedo leer todas mis respuestas. La voz la procesa tu navegador: a Céntrica solo llega el texto del chat, nunca el audio.',
      'Si tu navegador no tiene dictado por voz (por ejemplo, Firefox), te lo indico al pulsar el micrófono y puedes escribirme. Para la mejor experiencia de voz te recomiendo Edge o Chrome.'
    ],
    acciones: [tema('capacidades', '¿Qué más puedes hacer?'), tema('privacidad', 'Mis datos personales')]
  },
  menu: {
    palabras: ['menu', 'opciones', 'inicio', 'empezar', 'volver', 'otra cosa', 'otra pregunta'],
    respuesta: ['Claro{nombre}, ¿por dónde quieres seguir?'],
    acciones: [tema('servicios', 'Servicios'), tema('recomendar', '¿Qué solución necesito?'), tema('empresa', 'Sobre Céntrica'), AGENDAR, tema('humano', 'Hablar con una persona')]
  },
  ingles: {
    palabras: ['hello', 'hi', 'english', 'price', 'help me', 'do you speak', 'services'],
    respuesta: [
      'Hi! 👋 For now I can only chat in Spanish, but our team speaks with clients from abroad too.',
      'Write to our sales manager on WhatsApp or leave a message and we will get back to you.'
    ],
    acciones: HUMANO
  },
  respeto: {
    palabras: ['idiota', 'estupida', 'estupido', 'inutil', 'basura', 'mierda', 'tonta', 'tonto', 'maldita'],
    respuesta: [
      'Lamento si algo no salió como esperabas. 🙏 Quiero ayudarte de verdad.',
      'Si prefieres, te comunico con nuestro gerente para que lo resuelva personalmente.'
    ],
    acciones: HUMANO
  },
  sigo_aqui: {
    palabras: ['sigo aqui', 'aqui estoy', 'si sigo', 'sigo', 'aun estoy', 'todavia estoy', 'continuar', 'seguimos'],
    respuesta: ['¡Qué bien{nombre}! 😊 Sigamos. ¿En qué más te puedo ayudar?'],
    acciones: [tema('servicios', 'Servicios'), tema('recomendar', '¿Qué solución necesito?'), AGENDAR, tema('humano', 'Hablar con una persona')]
  },
  gracias: {
    palabras: ['gracias', 'muchas gracias', 'mil gracias', 'te agradezco', 'perfecto', 'excelente', 'genial', 'muy amable', 'super'],
    respuesta: ['¡Con mucho gusto{nombre}! 😊 Si te surge otra duda, aquí estoy.'],
    acciones: [tema('menu', 'Tengo otra pregunta'), AGENDAR]
  },
  despedida: {
    palabras: ['adios', 'chao', 'hasta luego', 'nos vemos', 'bye', 'hasta pronto'],
    respuesta: ['¡Hasta pronto{nombre}! Que tengas un excelente día. 👋'],
    acciones: []
  }
};
