/**
 * AGENDA TU CITA — Céntrica
 * Google Apps Script publicado como aplicación web en la cuenta del gerente
 * comercial. Recibe las solicitudes del formulario del sitio y:
 *   1. busca el primer espacio libre en su Google Calendar dentro del rango
 *      de fechas pedido (días hábiles, franja elegida, sin festivos)
 *   2. crea el evento con enlace de Google Meet e invita al visitante
 *   3. envía al gerente un correo con el motivo y los datos de la persona
 * Si no hay espacio libre, igual le avisa al gerente para no perder la solicitud.
 *
 * INSTALACIÓN (una vez, con la cuenta del gerente):
 *  1. script.google.com -> Proyecto nuevo -> pegar este archivo.
 *  2. Servicios (+) -> Google Calendar API -> Agregar.
 *  3. Ejecutar probarAgenda() y aceptar los permisos.
 *  4. Implementar -> Nueva implementación -> Aplicación web
 *     (Ejecutar como: Yo · Acceso: Cualquier usuario) y copiar la URL /exec
 *     en VITE_AGENDA_ENDPOINT del archivo .env del sitio.
 *
 * SEGURIDAD (el script actúa en nombre de la cuenta del gerente):
 *  - La invitación que recibe el visitante NO lleva texto escrito por él
 *    (evita usar la cuenta de la empresa para enviar phishing/spam).
 *  - Límites globales por hora y por día, y por correo.
 *  - Verificación anti-bots con Cloudflare Turnstile (recomendado):
 *    1. En dash.cloudflare.com -> Turnstile, crear un widget para
 *       centricasoluciones.com y copiar la clave del sitio y la secreta.
 *    2. Aquí: Configuración del proyecto -> Propiedades del script ->
 *       agregar TURNSTILE_SECRET = <clave secreta>. Nunca en el código.
 *    3. En el sitio: VITE_TURNSTILE_SITEKEY = <clave del sitio> en .env.
 *    Si TURNSTILE_SECRET no está configurada, la verificación se omite.
 */

const CONFIG = {
  CORREO_GERENTE: 'gerenciacomercial@centricasoluciones.com',
  ZONA_HORARIA: 'America/Bogota',
  DESFASE_UTC: '-05:00', // Colombia no tiene horario de verano
  DURACION_MIN: 30,
  PASO_MIN: 30,
  // Horario de atención: [hora inicio, hora fin]
  FRANJAS: {
    manana: [8, 12],
    tarde: [14, 18]
  },
  DIAS_HABILES: [1, 2, 3, 4, 5], // lunes a viernes (formato 'u': 1 = lunes)
  ANTELACION_HORAS: 24,
  MAX_DIAS_RANGO: 60,
  MAX_DIAS_ADELANTE: 90,
  MAX_SOLICITUDES_POR_CORREO_DIA: 3,
  MAX_SOLICITUDES_GLOBAL_HORA: 8,
  MAX_SOLICITUDES_GLOBAL_DIA: 25,
  MAX_BYTES: 8000, // una solicitud legítima pesa ~1 KB
  // Turnstile: solo se aceptan verificaciones emitidas para estos dominios
  DOMINIOS_PERMITIDOS: ['centricasoluciones.com', 'www.centricasoluciones.com'],
  CALENDARIO_FESTIVOS: 'es.co#holiday@group.v.calendar.google.com',
  SERVICIOS: ['Fábrica de software', 'Nebula ERP', 'Sicovi', 'Soluciones de IA', 'Consultoría digital', 'Otro'],
  CARGOS: ['CEO', 'CTO', 'Director TI', 'Gerente', 'Otro']
};

// ---------- Punto de entrada ----------

function doPost(e) {
  try {
    const bruto = (e && e.postData && e.postData.contents) || '';
    if (bruto.length > CONFIG.MAX_BYTES) {
      return responder({ ok: false, codigo: 'datos_invalidos', mensaje: 'La solicitud es demasiado grande.' });
    }
    const datos = JSON.parse(bruto || '{}');
    if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
      return responder({ ok: false, codigo: 'datos_invalidos', mensaje: 'Solicitud no válida.' });
    }

    // Campo trampa para bots: si viene lleno, se responde "ok" sin hacer nada
    if (datos.website) return responder({ ok: true, estado: 'agendada' });

    const error = validar(datos);
    if (error) return responder({ ok: false, codigo: 'datos_invalidos', mensaje: error });

    if (!verificarHumano(datos.turnstile)) {
      return responder({
        ok: false,
        codigo: 'verificacion',
        mensaje: 'No pudimos verificar que la solicitud la envía una persona. Recarga la página e inténtalo de nuevo.'
      });
    }

    // El lock evita que dos solicitudes simultáneas tomen el mismo espacio o
    // se salten los límites
    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      const limite = superaLimites(datos.correo);
      if (limite) return responder({ ok: false, codigo: 'limite', mensaje: limite });

      const espacio = buscarEspacio(datos);
      if (!espacio) {
        notificarGerenteSinEspacio(datos);
        return responder({ ok: true, estado: 'pendiente' });
      }
      const evento = crearReunion(datos, espacio);
      notificarGerente(datos, espacio, evento);
      return responder({
        ok: true,
        estado: 'agendada',
        inicio: espacio.inicio.toISOString(),
        fin: espacio.fin.toISOString(),
        meet: evento.hangoutLink || ''
      });
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    console.error(err);
    return responder({
      ok: false,
      codigo: 'error',
      mensaje: 'No pudimos procesar la solicitud en este momento.'
    });
  }
}

// Permite comprobar que la aplicación web está publicada
function doGet() {
  return responder({ ok: true, servicio: 'agenda-centrica' });
}

function responder(objeto) {
  return ContentService.createTextOutput(JSON.stringify(objeto)).setMimeType(ContentService.MimeType.JSON);
}

// ---------- Validación ----------

// Caracteres de control, invisibles (zero-width) y de dirección de texto (bidi):
// sirven para ocultar o disfrazar contenido en correos y asuntos
const INVISIBLES_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u2069\uFEFF]/g;
const texto = (valor, max, multilinea) => {
  if (typeof valor !== 'string') return '';
  const limpio = (multilinea ? valor.replace(/\r\n?/g, '\n') : valor.replace(/[\r\n\t]+/g, ' ')).replace(INVISIBLES_RE, '');
  return limpio.trim().slice(0, max);
};
const FECHA_RE = /^\d{4}-\d{2}-\d{2}$/;
const CORREO_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function hoyEnColombia() {
  return Utilities.formatDate(new Date(), CONFIG.ZONA_HORARIA, 'yyyy-MM-dd');
}

function diasEntre(desde, hasta) {
  return Math.round((fechaLocal(hasta, 12) - fechaLocal(desde, 12)) / 86400000);
}

function fechaLocal(fecha, hora, minuto) {
  const hh = String(hora).padStart(2, '0');
  const mm = String(minuto || 0).padStart(2, '0');
  return new Date(`${fecha}T${hh}:${mm}:00${CONFIG.DESFASE_UTC}`);
}

function validar(d) {
  d.nombre = texto(d.nombre, 80);
  d.correo = texto(d.correo, 120).toLowerCase();
  d.empresa = texto(d.empresa, 100);
  d.cargo = texto(d.cargo, 40);
  d.servicio = texto(d.servicio, 60);
  d.mensaje = texto(d.mensaje, 1000, true);

  if (d.nombre.length < 2) return 'Escribe tu nombre completo.';
  if (!CORREO_RE.test(d.correo)) return 'El correo no es válido.';
  if (d.empresa.length < 2) return 'Escribe el nombre de tu empresa.';
  if (d.cargo && CONFIG.CARGOS.indexOf(d.cargo) === -1) return 'Elige un cargo de la lista.';
  if (d.servicio && CONFIG.SERVICIOS.indexOf(d.servicio) === -1) return 'Elige un servicio de la lista.';
  if (d.mensaje.length < 10) return 'Cuéntanos el motivo de la cita (mínimo 10 caracteres).';
  if (['manana', 'tarde', 'cualquiera'].indexOf(d.franja) === -1) return 'Elige una franja horaria.';
  if (d.acepta !== true) return 'Debes aceptar el tratamiento de datos personales.';
  if (!FECHA_RE.test(d.desde) || !FECHA_RE.test(d.hasta)) return 'Revisa el rango de fechas.';

  const hoy = hoyEnColombia();
  if (d.desde < hoy) return 'La fecha inicial no puede estar en el pasado.';
  if (d.hasta < d.desde) return 'La fecha final debe ser igual o posterior a la inicial.';
  if (diasEntre(d.desde, d.hasta) > CONFIG.MAX_DIAS_RANGO) return `El rango no puede superar ${CONFIG.MAX_DIAS_RANGO} días.`;
  if (diasEntre(hoy, d.hasta) > CONFIG.MAX_DIAS_ADELANTE) return `Solo se puede agendar hasta ${CONFIG.MAX_DIAS_ADELANTE} días adelante.`;
  return '';
}

// Límites globales (hora y día) y por correo. Devuelve el mensaje si se supera.
function superaLimites(correo) {
  const cache = CacheService.getScriptCache();
  const ahora = new Date();
  const hora = 'agenda:global:h:' + Utilities.formatDate(ahora, CONFIG.ZONA_HORARIA, 'yyyyMMddHH');
  const dia = 'agenda:global:d:' + Utilities.formatDate(ahora, CONFIG.ZONA_HORARIA, 'yyyyMMdd');
  const porCorreo = 'agenda:correo:' + Utilities.formatDate(ahora, CONFIG.ZONA_HORARIA, 'yyyyMMdd') + ':' + correo;
  const actuales = cache.getAll([hora, dia, porCorreo]);
  const n = (clave) => Number(actuales[clave] || 0);

  if (n(hora) >= CONFIG.MAX_SOLICITUDES_GLOBAL_HORA || n(dia) >= CONFIG.MAX_SOLICITUDES_GLOBAL_DIA) {
    return 'En este momento estamos recibiendo muchas solicitudes. Inténtalo más tarde o escríbenos por correo.';
  }
  if (n(porCorreo) >= CONFIG.MAX_SOLICITUDES_POR_CORREO_DIA) {
    return 'Ya recibimos varias solicitudes con este correo hoy. Te contactaremos pronto.';
  }
  const nuevos = {};
  nuevos[hora] = String(n(hora) + 1);
  nuevos[dia] = String(n(dia) + 1);
  nuevos[porCorreo] = String(n(porCorreo) + 1);
  cache.putAll(nuevos, 90000);
  return '';
}

// Cloudflare Turnstile: se verifica del lado de Google, nunca solo en el navegador.
// Falla cerrado: cualquier error de verificación rechaza la solicitud.
function verificarHumano(token) {
  const secreto = PropertiesService.getScriptProperties().getProperty('TURNSTILE_SECRET');
  if (!secreto) return true; // Turnstile sin configurar (ver instrucciones al inicio)
  if (typeof token !== 'string' || !token || token.length > 2048) return false;
  const respuesta = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'post',
    payload: { secret: secreto, response: token },
    muteHttpExceptions: true
  });
  if (respuesta.getResponseCode() !== 200) return false;
  const resultado = JSON.parse(respuesta.getContentText());
  return resultado.success === true && CONFIG.DOMINIOS_PERMITIDOS.indexOf(resultado.hostname) !== -1;
}

// ---------- Búsqueda de espacio libre ----------

function buscarEspacio(d) {
  const calendario = CalendarApp.getDefaultCalendar();
  let festivos = null;
  try {
    festivos = CalendarApp.getCalendarById(CONFIG.CALENDARIO_FESTIVOS);
  } catch (err) {
    festivos = null;
  }

  const minimo = new Date(Date.now() + CONFIG.ANTELACION_HORAS * 3600000);
  const franjas = d.franja === 'cualquiera' ? [CONFIG.FRANJAS.manana, CONFIG.FRANJAS.tarde] : [CONFIG.FRANJAS[d.franja]];
  const duracion = CONFIG.DURACION_MIN * 60000;
  const paso = CONFIG.PASO_MIN * 60000;

  for (let i = 0; i <= diasEntre(d.desde, d.hasta); i++) {
    const mediodia = new Date(fechaLocal(d.desde, 12).getTime() + i * 86400000);
    const fecha = Utilities.formatDate(mediodia, CONFIG.ZONA_HORARIA, 'yyyy-MM-dd');
    const diaSemana = Number(Utilities.formatDate(mediodia, CONFIG.ZONA_HORARIA, 'u'));
    if (CONFIG.DIAS_HABILES.indexOf(diaSemana) === -1) continue;
    if (festivos && festivos.getEventsForDay(mediodia).length > 0) continue;

    // Eventos del día que ocupan tiempo (se ignoran los de todo el día y los rechazados)
    const ocupados = calendario
      .getEvents(fechaLocal(fecha, 0), fechaLocal(fecha, 23, 59))
      .filter((ev) => !ev.isAllDayEvent() && ev.getMyStatus() !== CalendarApp.GuestStatus.NO)
      .map((ev) => [ev.getStartTime().getTime(), ev.getEndTime().getTime()]);

    for (const [horaInicio, horaFin] of franjas) {
      const finFranja = fechaLocal(fecha, horaFin).getTime();
      for (let t = fechaLocal(fecha, horaInicio).getTime(); t + duracion <= finFranja; t += paso) {
        if (t < minimo.getTime()) continue;
        const choca = ocupados.some(([ini, fin]) => t < fin && t + duracion > ini);
        if (!choca) return { inicio: new Date(t), fin: new Date(t + duracion) };
      }
    }
  }
  return null;
}

// ---------- Creación de la reunión ----------

function crearReunion(d, espacio) {
  // La invitación la recibe el correo que escribió el visitante, que podría no
  // ser suyo: por eso lleva solo texto fijo de Céntrica, nunca texto del
  // formulario. Los detalles le llegan únicamente al gerente (notificarGerente).
  const titulo = d.servicio ? `Reunión con Céntrica · ${d.servicio}` : 'Reunión con Céntrica';
  const descripcion = [
    'Reunión virtual con el equipo comercial de Céntrica, agendada desde centricasoluciones.com.',
    '',
    'Si no solicitaste esta reunión, puedes rechazar o ignorar esta invitación.'
  ].join('\n');

  // Servicio avanzado "Google Calendar API": necesario para crear el enlace de Meet
  return Calendar.Events.insert(
    {
      summary: titulo,
      description: descripcion,
      start: { dateTime: espacio.inicio.toISOString(), timeZone: CONFIG.ZONA_HORARIA },
      end: { dateTime: espacio.fin.toISOString(), timeZone: CONFIG.ZONA_HORARIA },
      attendees: [{ email: d.correo }],
      guestsCanInviteOthers: false,
      guestsCanModify: false,
      guestsCanSeeOtherGuests: false,
      conferenceData: {
        createRequest: { requestId: Utilities.getUuid(), conferenceSolutionKey: { type: 'hangoutsMeet' } }
      },
      reminders: { useDefault: true }
    },
    'primary',
    { conferenceDataVersion: 1, sendUpdates: 'all' }
  );
}

// ---------- Correos al gerente ----------

const escapar = (valor) =>
  String(valor || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// "lunes 5 de octubre, 9:00 a. m." (Apps Script formatea en inglés por defecto)
const DIAS = ['', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

function fechaLegible(fecha) {
  const f = (patron) => Utilities.formatDate(fecha, CONFIG.ZONA_HORARIA, patron);
  const hora24 = Number(f('H'));
  const hora12 = hora24 % 12 || 12;
  const sufijo = hora24 < 12 ? 'a. m.' : 'p. m.';
  return `${DIAS[Number(f('u'))]} ${Number(f('d'))} de ${MESES[Number(f('M')) - 1]}, ${hora12}:${f('mm')} ${sufijo}`;
}

function tablaDatos(d) {
  const filas = [
    ['Nombre', d.nombre],
    ['Correo', d.correo],
    ['Empresa', d.empresa],
    ['Cargo', d.cargo || '—'],
    ['Servicio de interés', d.servicio || '—'],
    ['Rango pedido', `${d.desde} a ${d.hasta}`],
    ['Franja', { manana: 'Mañana', tarde: 'Tarde', cualquiera: 'Cualquier hora' }[d.franja]]
  ];
  return (
    '<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">' +
    filas
      .map(([k, v]) => `<tr><td style="padding:6px 12px;color:#555"><b>${k}</b></td><td style="padding:6px 12px">${escapar(v)}</td></tr>`)
      .join('') +
    '</table>' +
    `<p style="font-family:Arial,sans-serif;font-size:14px"><b>Motivo de la cita:</b><br>${escapar(d.mensaje).replace(/\n/g, '<br>')}</p>`
  );
}

function notificarGerente(d, espacio, evento) {
  const cuando = fechaLegible(espacio.inicio);
  MailApp.sendEmail({
    to: CONFIG.CORREO_GERENTE,
    replyTo: d.correo,
    subject: `Nueva cita agendada: ${d.nombre} (${d.empresa}) · ${cuando}`,
    htmlBody:
      `<p style="font-family:Arial,sans-serif;font-size:15px">Se agendó una reunión desde el sitio web para el <b>${escapar(cuando)}</b> (hora Colombia).</p>` +
      (evento.hangoutLink ? `<p style="font-family:Arial,sans-serif;font-size:15px">Google Meet: <a href="${escapar(evento.hangoutLink)}">${escapar(evento.hangoutLink)}</a></p>` : '') +
      tablaDatos(d) +
      '<p style="font-family:Arial,sans-serif;font-size:13px;color:#777">El evento ya está en tu Google Calendar y el visitante recibió la invitación.</p>'
  });
}

function notificarGerenteSinEspacio(d) {
  MailApp.sendEmail({
    to: CONFIG.CORREO_GERENTE,
    replyTo: d.correo,
    subject: `Solicitud de cita SIN ESPACIO LIBRE: ${d.nombre} (${d.empresa})`,
    htmlBody:
      '<p style="font-family:Arial,sans-serif;font-size:15px">Alguien pidió una cita desde el sitio web, pero <b>no había espacios libres</b> en el rango y franja solicitados. Responde este correo para coordinar con la persona.</p>' +
      tablaDatos(d)
  });
}

// ---------- Prueba manual desde el editor de Apps Script ----------
// Ejecuta esta función una vez para autorizar los permisos y probar todo.

function probarAgenda() {
  const manana = Utilities.formatDate(new Date(Date.now() + 86400000), CONFIG.ZONA_HORARIA, 'yyyy-MM-dd');
  const enDiezDias = Utilities.formatDate(new Date(Date.now() + 10 * 86400000), CONFIG.ZONA_HORARIA, 'yyyy-MM-dd');
  const respuesta = doPost({
    postData: {
      contents: JSON.stringify({
        nombre: 'Prueba Agenda',
        correo: CONFIG.CORREO_GERENTE,
        empresa: 'Céntrica',
        cargo: 'Gerente',
        servicio: 'Consultoría digital',
        mensaje: 'Esta es una cita de prueba creada desde el editor de Apps Script.',
        franja: 'cualquiera',
        desde: manana,
        hasta: enDiezDias,
        acepta: true
      })
    }
  });
  console.log(respuesta.getContent());
}
