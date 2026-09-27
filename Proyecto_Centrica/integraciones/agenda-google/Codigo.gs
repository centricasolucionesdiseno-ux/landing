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
 * Instalación: ver README.md
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
  CALENDARIO_FESTIVOS: 'es.co#holiday@group.v.calendar.google.com',
  SERVICIOS: ['Fábrica de software', 'Nebula ERP', 'Sicovi', 'Análisis con IA', 'Consultoría digital', 'Otro'],
  CARGOS: ['CEO', 'CTO', 'Director TI', 'Gerente', 'Otro']
};

// ---------- Punto de entrada ----------

function doPost(e) {
  try {
    const datos = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    // Campo trampa para bots: si viene lleno, se responde "ok" sin hacer nada
    if (datos.website) return responder({ ok: true, estado: 'agendada' });

    const error = validar(datos);
    if (error) return responder({ ok: false, codigo: 'datos_invalidos', mensaje: error });

    if (superaLimite(datos.correo)) {
      return responder({
        ok: false,
        codigo: 'limite',
        mensaje: 'Ya recibimos varias solicitudes con este correo hoy. Te contactaremos pronto.'
      });
    }

    // Evita que dos solicitudes simultáneas tomen el mismo espacio
    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
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

const texto = (valor, max) => (typeof valor === 'string' ? valor.trim().slice(0, max) : '');
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
  d.mensaje = texto(d.mensaje, 1000);

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

function superaLimite(correo) {
  const cache = CacheService.getScriptCache();
  const clave = 'agenda:' + correo;
  const cuenta = Number(cache.get(clave) || 0) + 1;
  cache.put(clave, String(cuenta), 86400);
  return cuenta > CONFIG.MAX_SOLICITUDES_POR_CORREO_DIA;
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
  const descripcion = [
    d.servicio ? `Servicio de interés: ${d.servicio}` : '',
    '',
    'Motivo de la cita:',
    d.mensaje,
    '',
    `Solicitada por: ${d.nombre} <${d.correo}>`,
    `Empresa: ${d.empresa}`,
    d.cargo ? `Cargo: ${d.cargo}` : '',
    '',
    'Agendada desde el formulario "Agenda tu cita" de centricasoluciones.com'
  ]
    .filter((linea, i, arr) => linea !== '' || arr[i - 1] !== '')
    .join('\n');

  // Servicio avanzado "Google Calendar API": necesario para crear el enlace de Meet
  return Calendar.Events.insert(
    {
      summary: `Reunión Céntrica · ${d.servicio || 'Asesoría'} · ${d.empresa}`,
      description: descripcion,
      start: { dateTime: espacio.inicio.toISOString(), timeZone: CONFIG.ZONA_HORARIA },
      end: { dateTime: espacio.fin.toISOString(), timeZone: CONFIG.ZONA_HORARIA },
      attendees: [{ email: d.correo, displayName: d.nombre }],
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
