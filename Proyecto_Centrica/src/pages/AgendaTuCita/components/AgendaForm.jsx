import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarClock, CircleAlert, LoaderCircle, MailCheck, RotateCcw } from 'lucide-react';
import { EmailLink } from '../../../components/common/ContactLinks';
import Turnstile from '../../../components/common/Turnstile';
import {
  AGENDA_ENDPOINT, TURNSTILE_SITEKEY, CONTACTO, CARGOS, SERVICIOS, FRANJAS, ZONA_HORARIA,
  MAX_DIAS_ADELANTE, CLAVE_BORRADOR, BORRADOR_HORAS, RESPUESTA_DIAS_HABILES
} from '../../../config/agenda';
import { esCorreoValido } from '../../../utils/validacion';

const VACIO = { nombre: '', correo: '', empresa: '', cargo: '', servicio: '', mensaje: '', fecha: '', franja: 'cualquiera' };
const MAX_MENSAJE = 1000;

// 'YYYY-MM-DD' de hoy en Colombia (+ n días), sin depender de la zona del visitante
const fechaColombia = (sumarDias = 0) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: ZONA_HORARIA }).format(new Date(Date.now() + sumarDias * 86400000));
// 0 = domingo, 6 = sábado (mediodía UTC: el mismo día en cualquier zona)
const diaSemana = (fecha) => new Date(`${fecha}T12:00:00Z`).getUTCDay();

// "Lunes 6 de octubre"
const fechaLegible = (fecha) => {
  const texto = new Intl.DateTimeFormat('es-CO', { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long' })
    .format(new Date(`${fecha}T12:00:00Z`))
    .replace(',', '');
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

// El borrador vive en sessionStorage: sobrevive a recargas y a cambiar de
// página, y se borra al cerrar la pestaña (en un computador compartido el
// siguiente usuario no ve los datos). Además vence a las BORRADOR_HORAS horas
// y nunca guarda la aceptación de datos.
const almacen = () => window.sessionStorage;
// La franja y el servicio tienen valor sin que la persona escriba nada: no cuentan como borrador
const tieneDatos = (d) => Object.keys(VACIO).some((campo) => !['franja', 'servicio'].includes(campo) && d[campo].trim() !== '');

// Servicio preseleccionado desde el chat de Nebulina: /contacto?servicio=Nebula%20ERP
const servicioDeLaUrl = () => {
  const servicio = new URLSearchParams(window.location.search).get('servicio');
  return SERVICIOS.includes(servicio) ? servicio : '';
};

const borrarBorrador = () => {
  try {
    almacen().removeItem(CLAVE_BORRADOR);
  } catch {
    // Almacenamiento bloqueado: no hay nada que borrar
  }
};

// Solo se aceptan los campos conocidos y de tipo texto (el almacenamiento se
// puede manipular desde el navegador). Devuelve null si no hay borrador útil.
const cargarBorrador = () => {
  try {
    const guardado = JSON.parse(almacen().getItem(CLAVE_BORRADOR) || 'null');
    if (!guardado || typeof guardado.guardado !== 'number' || Date.now() - guardado.guardado > BORRADOR_HORAS * 3600000) {
      borrarBorrador();
      return null;
    }
    const datos = { ...VACIO };
    Object.keys(VACIO).forEach((campo) => {
      if (typeof guardado.datos?.[campo] === 'string') datos[campo] = guardado.datos[campo].slice(0, MAX_MENSAJE);
    });
    if (datos.fecha && datos.fecha <= fechaColombia()) datos.fecha = '';
    return tieneDatos(datos) ? datos : null;
  } catch {
    return null;
  }
};

const validar = (d, acepta, token) => {
  const errores = {};
  if (d.nombre.trim().length < 2) errores.nombre = 'Escribe tu nombre completo.';
  if (!esCorreoValido(d.correo)) errores.correo = 'Escribe un correo válido, p. ej. juan@empresa.com.';
  if (d.empresa.trim().length < 2) errores.empresa = 'Escribe el nombre de tu empresa.';
  if (!d.fecha) errores.fecha = 'Elige el día de la cita.';
  else if (d.fecha <= fechaColombia()) errores.fecha = 'Elige una fecha a partir de mañana.';
  else if (d.fecha > fechaColombia(MAX_DIAS_ADELANTE)) errores.fecha = `Máximo ${MAX_DIAS_ADELANTE} días a partir de hoy.`;
  else if ([0, 6].includes(diaSemana(d.fecha))) errores.fecha = 'Elige un día de lunes a viernes.';
  if (d.mensaje.trim().length < 10) errores.mensaje = 'Cuéntanos el motivo de la cita (mínimo 10 caracteres).';
  if (!acepta) errores.acepta = 'Debes aceptar el tratamiento de datos para agendar.';
  if (TURNSTILE_SITEKEY && !token) errores.turnstile = 'Espera a que termine la verificación de seguridad.';
  return errores;
};

// Alternativa si la agenda en línea falla: correo al gerente con los datos ya escritos
const cuerpoCorreo = (d) => {
  const franja = FRANJAS.find((f) => f.value === d.franja)?.label ?? '';
  const cargo = d.cargo ? ` (${d.cargo})` : '';
  const cuerpo = [
    `Nombre: ${d.nombre}`,
    `Empresa: ${d.empresa}${cargo}`,
    `Correo: ${d.correo}`,
    d.servicio ? `Servicio de interés: ${d.servicio}` : '',
    `Fecha: ${d.fecha || '?'} (${franja})`,
    '',
    d.mensaje
  ].filter(Boolean).join('\n');
  return cuerpo;
};

const Campo = ({ id, label, error, ayuda, className = '', children }) => (
  <div className={`form-group${error ? ' has-error' : ''} ${className}`.trim()}>
    <label htmlFor={id} className="form-label">{label}</label>
    {children}
    {error ? (
      <p id={`${id}-error`} className="form-error"><CircleAlert size={14} aria-hidden="true" /> {error}</p>
    ) : ayuda && <p id={`${id}-ayuda`} className="form-hint">{ayuda}</p>}
  </div>
);

// El HTML generado en el build trae el formulario vacío; el borrador se
// busca al montar en el navegador (ver AgendaTuCita: key según hidratación).
const AgendaForm = ({ restaurar = true }) => {
  // Si quedó una solicitud a medias, primero se pregunta si continuar o cancelar
  const [pendiente, setPendiente] = useState(() => (restaurar ? cargarBorrador() : null));
  const [datos, setDatos] = useState(() => (restaurar ? { ...VACIO, servicio: servicioDeLaUrl() } : VACIO));
  const [acepta, setAcepta] = useState(false);
  const [trampa, setTrampa] = useState('');
  const [errores, setErrores] = useState({});
  const [estado, setEstado] = useState({ tipo: 'inicial' });
  const [tokenHumano, setTokenHumano] = useState('');
  const reiniciarTurnstile = useRef(null);
  const resultadoRef = useRef(null);
  // Momento en que se mostró el formulario: el servidor rechaza envíos instantáneos (bots)
  const [montadoEn] = useState(() => Date.now());

  const enviando = estado.tipo === 'enviando';

  // Guardar el borrador mientras se escribe (no mientras se decide qué hacer con el anterior)
  useEffect(() => {
    if (pendiente) return undefined;
    const timer = setTimeout(() => {
      try {
        if (tieneDatos(datos)) almacen().setItem(CLAVE_BORRADOR, JSON.stringify({ datos, guardado: Date.now() }));
        else almacen().removeItem(CLAVE_BORRADOR);
      } catch {
        // Almacenamiento bloqueado: el formulario funciona igual, sin borrador
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [datos, pendiente]);

  // Al mostrar el resultado, llevar el foco allí (lectores de pantalla y móvil)
  useEffect(() => {
    if (estado.tipo === 'por_confirmar') resultadoRef.current?.focus();
  }, [estado.tipo]);

  const continuarPendiente = () => {
    setDatos(pendiente);
    setPendiente(null);
  };

  const cancelarPendiente = () => {
    borrarBorrador();
    setPendiente(null);
  };

  const quitarError = (nombre) =>
    setErrores((actuales) => {
      if (!actuales[nombre]) return actuales;
      const resto = { ...actuales };
      delete resto[nombre];
      return resto;
    });

  // Estable (useCallback): el widget de Turnstile no se vuelve a montar en cada render
  const recibirToken = useCallback((token) => {
    setTokenHumano(token);
    if (token) {
      setErrores((actuales) => {
        if (!actuales.turnstile) return actuales;
        const resto = { ...actuales };
        delete resto.turnstile;
        return resto;
      });
    }
  }, []);

  const actualizar = (event) => {
    const { name, value } = event.target;
    setDatos((actuales) => ({ ...actuales, [name]: value }));
    quitarError(name);
  };

  // El lector de pantalla lee el error si lo hay; si no, la ayuda del campo
  const descripcionDe = (nombre, ayuda) => {
    if (errores[nombre]) return `agenda-${nombre}-error`;
    return ayuda ? `agenda-${nombre}-ayuda` : undefined;
  };

  const propsCampo = (nombre, { ayuda = false } = {}) => ({
    id: `agenda-${nombre}`,
    name: nombre,
    value: datos[nombre],
    onChange: actualizar,
    'aria-invalid': errores[nombre] ? true : undefined,
    'aria-describedby': descripcionDe(nombre, ayuda)
  });

  const enviar = async (event) => {
    event.preventDefault();
    if (enviando) return;

    const encontrados = validar(datos, acepta, tokenHumano);
    setErrores(encontrados);
    const primero = Object.keys(encontrados)[0];
    if (primero) {
      document.getElementById(`agenda-${primero}`)?.focus();
      return;
    }

    setEstado({ tipo: 'enviando' });
    const limpios = Object.fromEntries(Object.entries(datos).map(([k, v]) => [k, v.trim()]));
    try {
      const respuesta = await fetch(AGENDA_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...limpios, acepta, website: trampa, turnstile: tokenHumano, tiempo: Date.now() - montadoEn }),
        signal: AbortSignal.timeout(30000)
      });
      const resultado = await respuesta.json();
      if (!resultado.ok) throw new Error(resultado.mensaje || 'No pudimos enviar la solicitud.');

      borrarBorrador();
      setEstado({ tipo: 'por_confirmar', correo: limpios.correo, venceHoras: Number(resultado.venceHoras) || 24 });
    } catch (error) {
      // El token anti-bots sirve una sola vez: pedir uno nuevo para reintentar
      setTokenHumano('');
      reiniciarTurnstile.current?.();
      const sinConexion = error.name === 'TimeoutError' || error instanceof TypeError || error instanceof SyntaxError;
      setEstado({ tipo: 'error', mensaje: sinConexion ? 'No pudimos conectar con la agenda en este momento.' : error.message });
    }
  };

  const reiniciar = () => {
    setDatos(VACIO);
    setAcepta(false);
    setErrores({});
    setEstado({ tipo: 'inicial' });
  };

  if (pendiente) {
    return (
      <section className="agenda-resultado agenda-pendiente" aria-labelledby="agenda-pendiente-titulo">
        <span className="agenda-resultado-icono" aria-hidden="true">
          <CalendarClock size={40} />
        </span>
        <h3 id="agenda-pendiente-titulo" className="agenda-resultado-titulo">
          Tienes un agendamiento pendiente
        </h3>
        <p className="agenda-resultado-texto">
          Empezaste a solicitar una cita
          {pendiente.fecha && <> para el <strong>{fechaLegible(pendiente.fecha).toLowerCase()}</strong></>}
          {pendiente.servicio && <> sobre <strong>{pendiente.servicio}</strong></>}
          {' '}y no la enviaste. ¿Quieres seguir con ella o cancelarla?
        </p>
        <div className="agenda-resultado-acciones">
          <button type="button" className="btn btn-primary" onClick={continuarPendiente}>
            <span>Seguir con mi solicitud</span> <ArrowRight className="btn-arrow" size={18} aria-hidden="true" />
          </button>
          <button type="button" className="btn-link" onClick={cancelarPendiente}>
            <RotateCcw size={16} aria-hidden="true" /> Cancelarla y empezar de nuevo
          </button>
        </div>
      </section>
    );
  }

  if (estado.tipo === 'por_confirmar') {
    return (
      <div className="agenda-resultado" aria-live="polite">
        <span className="agenda-resultado-icono is-ok" aria-hidden="true">
          <MailCheck size={42} />
        </span>
        <h3 className="agenda-resultado-titulo" tabIndex={-1} ref={resultadoRef}>¡Revisa tu correo!</h3>
        <p className="agenda-resultado-texto">
          Te enviamos un enlace a <strong>{estado.correo}</strong> para confirmar tu solicitud. Vence en {estado.venceHoras} horas;
          si no lo ves, revisa la carpeta de spam.
        </p>
        <p className="agenda-resultado-texto">
          Cuando la confirmes, nuestro gerente comercial la revisará y te enviará la invitación con el enlace de la videollamada
          en máximo {RESPUESTA_DIAS_HABILES} días hábiles.
        </p>
        <div className="agenda-resultado-acciones">
          <button type="button" className="btn-link" onClick={reiniciar}>
            <RotateCcw size={16} aria-hidden="true" /> Solicitar otra cita
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="agenda-form" onSubmit={enviar} noValidate>
      <div className="form-row">
        <Campo id="agenda-nombre" label="Nombre completo *" error={errores.nombre}>
          <input type="text" className="form-input" autoComplete="name" placeholder="Ej: Juan Pérez" maxLength={80} {...propsCampo('nombre')} />
        </Campo>
        <Campo id="agenda-correo" label="Correo laboral *" error={errores.correo}>
          <input type="email" className="form-input" autoComplete="email" inputMode="email" placeholder="juan@empresa.com" maxLength={120} {...propsCampo('correo')} />
        </Campo>
      </div>

      <div className="form-row">
        <Campo id="agenda-empresa" label="Empresa *" error={errores.empresa}>
          <input type="text" className="form-input" autoComplete="organization" placeholder="Nombre de tu empresa" maxLength={100} {...propsCampo('empresa')} />
        </Campo>
        <Campo id="agenda-cargo" label="Cargo">
          <select className="form-select" {...propsCampo('cargo')}>
            <option value="">Selecciona tu cargo</option>
            {CARGOS.map((cargo) => <option key={cargo} value={cargo}>{cargo}</option>)}
          </select>
        </Campo>
      </div>

      <Campo id="agenda-servicio" label="Servicio de interés">
        <select className="form-select" {...propsCampo('servicio')}>
          <option value="">Selecciona un servicio</option>
          {SERVICIOS.map((servicio) => <option key={servicio} value={servicio}>{servicio}</option>)}
        </select>
      </Campo>

      <fieldset className="form-fieldset">
        <legend className="form-label">¿Cuándo te sirve la cita? *</legend>
        <Campo id="agenda-fecha" label="Día" error={errores.fecha} ayuda="De lunes a viernes, a partir de mañana" className="form-group--compact">
          <input type="date" className="form-input" min={fechaColombia(1)} max={fechaColombia(MAX_DIAS_ADELANTE)} {...propsCampo('fecha', { ayuda: true })} />
        </Campo>

        <div className="franjas" role="radiogroup" aria-label="Franja horaria preferida">
          {FRANJAS.map((franja) => (
            <label key={franja.value} className={`franja${datos.franja === franja.value ? ' is-checked' : ''}`}>
              <input type="radio" name="franja" value={franja.value} checked={datos.franja === franja.value} onChange={actualizar} />
              <span className="franja-label">{franja.label}</span>
              <span className="franja-horario">{franja.horario}</span>
            </label>
          ))}
        </div>
        <p className="form-hint">Hora de Colombia. Nuestro gerente comercial confirma la hora exacta y te envía la invitación con el enlace de la videollamada.</p>
      </fieldset>

      <Campo
        id="agenda-mensaje"
        label="Motivo de la cita *"
        error={errores.mensaje}
        ayuda={`${datos.mensaje.length}/${MAX_MENSAJE} caracteres`}
      >
        <textarea
          className="form-textarea"
          rows={5}
          maxLength={MAX_MENSAJE}
          placeholder="Cuéntanos sobre tu proyecto y qué te gustaría tratar en la reunión..."
          {...propsCampo('mensaje', { ayuda: true })}
        />
      </Campo>

      <div className={`form-check${errores.acepta ? ' has-error' : ''}`}>
        <input
          type="checkbox"
          id="agenda-acepta"
          checked={acepta}
          onChange={(event) => {
            setAcepta(event.target.checked);
            quitarError('acepta');
          }}
          aria-invalid={errores.acepta ? true : undefined}
          aria-describedby={errores.acepta ? 'agenda-acepta-error' : undefined}
        />
        <label htmlFor="agenda-acepta">
          Acepto el tratamiento de mis datos personales para agendar esta reunión, según la{' '}
          <Link to="/privacidad">Política de Privacidad</Link> (Ley 1581 de 2012).
        </label>
        {errores.acepta && <p id="agenda-acepta-error" className="form-error"><CircleAlert size={14} aria-hidden="true" /> {errores.acepta}</p>}
      </div>

      {/* Campo trampa: invisible para personas, los bots lo llenan */}
      <div className="form-trampa" aria-hidden="true">
        <label htmlFor="agenda-website">Sitio web</label>
        <input id="agenda-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={trampa} onChange={(event) => setTrampa(event.target.value)} />
      </div>

      {TURNSTILE_SITEKEY && (
        <div className={`form-group${errores.turnstile ? ' has-error' : ''}`}>
          <Turnstile sitekey={TURNSTILE_SITEKEY} onToken={recibirToken} reiniciarRef={reiniciarTurnstile} />
          {errores.turnstile && <p className="form-error"><CircleAlert size={14} aria-hidden="true" /> {errores.turnstile}</p>}
        </div>
      )}

      {estado.tipo === 'error' && (
        <div className="form-alerta" role="alert">
          <CircleAlert size={20} aria-hidden="true" />
          <p>
            {estado.mensaje} Puedes intentarlo de nuevo o{' '}
            <EmailLink asunto={`Solicitud de cita - ${datos.empresa || datos.nombre}`} cuerpo={cuerpoCorreo(datos)}>
              enviarnos la solicitud por correo
            </EmailLink>{' '}
            a {CONTACTO.correo}.
          </p>
        </div>
      )}

      <button type="submit" className="btn btn-primary form-submit" disabled={enviando} aria-busy={enviando}>
        {enviando ? (
          <><LoaderCircle className="spin" size={18} aria-hidden="true" /> <span>Enviando solicitud...</span></>
        ) : (
          <><span>Solicitar cita</span> <ArrowRight className="btn-arrow" size={18} aria-hidden="true" /></>
        )}
      </button>
    </form>
  );
};

export default AgendaForm;
