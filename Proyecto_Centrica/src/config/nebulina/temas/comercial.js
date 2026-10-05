/** Comercial y contacto: precio, demostración, agenda, gerente, horario y datos. */
import { ir, WHATSAPP, CORREO, LLAMAR, AGENDAR, HUMANO, CIERRE } from '../acciones';
import { CONTACTO, RESPUESTA_DIAS_HABILES } from '../../agenda';

export const TEMAS_COMERCIAL = {
  precio: {
    etiqueta: '¿Cuánto cuesta?',
    palabras: ['precio', 'costo', 'cuanto cuesta', 'cuanto vale', 'cuanto cobran', 'valor', 'tarifa', 'cotizacion', 'cotizar', 'plan', 'licencia', 'mensualidad', 'inversion', 'cuanto me sale', 'cuanto sale', 'cuanto me cuesta', 'que precio', 'precios'],
    respuesta: [
      'Cada proyecto{servicio} se cotiza a la medida, según su alcance, por eso no manejamos precios fijos. 💬',
      'Lo mejor es una reunión virtual sin compromiso con nuestro gerente comercial: entiende tu necesidad y te prepara una propuesta.'
    ],
    acciones: CIERRE
  },
  demo: {
    etiqueta: 'Quiero una demostración',
    palabras: ['demo', 'demostracion', 'ver funcionando', 'prueba gratis', 'probar el sistema', 'version de prueba', 'mostrar como funciona', 'me pueden mostrar', 'ver como funciona', 'muestrenme', 'ensenarme'],
    respuesta: ['¡Con gusto te mostramos{servicio} en acción! 🚀 Agenda una reunión virtual y nuestro gerente te hace la demostración según lo que necesitas.'],
    acciones: CIERRE
  },
  agendar: {
    etiqueta: 'Quiero agendar una reunión',
    palabras: ['agendar', 'cita', 'reunion', 'videollamada', 'llamada', 'jitsi', 'reunirnos', 'agenda', 'separar'],
    respuesta: [
      '¡Claro! En la página de contacto eliges el día y la franja que te sirven. Te llega un correo para confirmar y nuestro gerente te envía la invitación a la videollamada en máximo ' + RESPUESTA_DIAS_HABILES + ' días hábiles.'
    ],
    acciones: CIERRE
  },
  humano: {
    etiqueta: 'Hablar con una persona',
    palabras: ['hablar con alguien', 'persona', 'humano', 'asesor', 'gerente', 'comercial', 'vendedor', 'contactar', 'contacto', 'comunicarme', 'whatsapp', 'correo', 'email', 'escribirles'],
    respuesta: [
      'Con gusto te conecto{nombre} con nuestro gerente comercial. 🙌 {horario}',
      'Puedes escribirle por WhatsApp o dejarle un mensaje aquí y te responde a tu correo en máximo ' + RESPUESTA_DIAS_HABILES + ' días hábiles.'
    ],
    acciones: [...HUMANO, LLAMAR]
  },
  telefono: {
    palabras: ['telefono', 'celular', 'numero', 'llamar', 'llamarlos', 'marcar', 'me pueden llamar', 'llamenme', 'numero de telefono', 'me llaman'],
    respuesta: [`Nuestro número es ${CONTACTO.telefono} (también es WhatsApp). 📞 {horario}`],
    acciones: [LLAMAR, WHATSAPP]
  },
  horario: {
    etiqueta: '¿Cuál es el horario?',
    palabras: ['horario', 'a que hora', 'hora de atencion', 'atienden', 'abren', 'cierran', 'disponibles', 'fin de semana', 'sabado', 'domingo', 'festivos'],
    respuesta: ['Atendemos de lunes a viernes, de 8:00 a. m. a 6:00 p. m. (hora de Colombia). {horario}'],
    acciones: HUMANO
  },
  ubicacion: {
    etiqueta: '¿Dónde están ubicados?',
    palabras: ['donde estan', 'donde quedan', 'ubicacion', 'ubicados', 'direccion', 'oficina', 'sede', 'medellin', 'como llegar', 'mapa', 'visitarlos', 'presencial', 'en que ciudad', 'que ciudad', 'de donde son'],
    respuesta: [`Nuestra oficina está en ${CONTACTO.oficina}. 📍 Te recomiendo agendar antes de visitarnos para que el equipo te pueda atender. También atendemos en todo Colombia por videollamada.`],
    acciones: [ir('/contacto', 'Ver mapa'), AGENDAR, WHATSAPP]
  },
  privacidad: {
    etiqueta: 'Mis datos personales',
    palabras: ['datos personales', 'privacidad', 'habeas data', 'mis datos', 'proteccion de datos', 'borrar mis datos', 'ley 1581', 'cookies'],
    respuesta: [
      'Tratamos tus datos conforme a la Ley 1581 de 2012 y solo para lo que nos autorizas. Esta conversación no se guarda en nuestros servidores: solo vive en tu navegador mientras la pestaña esté abierta.',
      `Para consultar, corregir o eliminar tus datos escríbenos a ${CONTACTO.correo}.`
    ],
    acciones: [ir('/privacidad', 'Ver Política de Privacidad'), CORREO]
  },
  empleo: {
    palabras: ['trabajo', 'empleo', 'vacante', 'vacantes', 'hoja de vida', 'trabajar con ustedes', 'practicas', 'curriculum', 'contratan', 'contratando', 'estan contratando', 'buscan personal', 'oportunidades laborales'],
    respuesta: [`¡Gracias por tu interés en ser parte de Céntrica! 💙 Puedes enviar tu hoja de vida a ${CONTACTO.correo} indicando el cargo que te interesa.`],
    acciones: [CORREO]
  }
};
