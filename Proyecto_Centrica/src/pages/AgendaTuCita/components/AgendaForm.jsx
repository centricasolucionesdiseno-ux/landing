import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CircleAlert, CircleCheck, Hourglass, LoaderCircle, RotateCcw, Video } from 'lucide-react';
import { EmailLink } from '../../../components/common/ContactLinks';
import Turnstile from '../../../components/common/Turnstile';
import {
  AGENDA_ENDPOINT, TURNSTILE_SITEKEY, CONTACTO, CARGOS, SERVICIOS, FRANJAS, ZONA_HORARIA,
  MAX_DIAS_RANGO, MAX_DIAS_ADELANTE, DURACION_MIN, CLAVE_BORRADOR
} from '../../../config/agenda';

const VACIO = { nombre: '', correo: '', empresa: '', cargo: '', servicio: '', mensaje: '', desde: '', hasta: '', franja: 'cualquiera' };
const CORREO_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_MENSAJE = 1000;

// 'YYYY-MM-DD' de hoy en Colombia (+ n días), sin depender de la zona del visitante
const fechaColombia = (sumarDias = 0) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: ZONA_HORARIA }).format(new Date(Date.now() + sumarDias * 86400000));
const diasEntre = (desde, hasta) => Math.round((Date.parse(hasta) - Date.parse(desde)) / 86400000);

const fechaLegible = (iso) => {
  const texto = new Intl.DateTimeFormat('es-CO', {
    timeZone: ZONA_HORARIA, weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit'
  }).format(new Date(iso));
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

// El borrador sobrevive a recargas y a cambiar de página, pero vive en
// sessionStorage: se borra al cerrar la pestaña, así en un computador compartido
// el siguiente usuario no ve los datos. Nunca guarda la aceptación de datos.
const almacen = () => window.sessionStorage;

// Solo se aceptan los campos conocidos y de tipo texto (el almacenamiento se
// puede manipular desde el navegador)
const cargarBorrador = () => {
  try {
    const guardado = JSON.parse(almacen().getItem(CLAVE_BORRADOR) || '{}');
    const datos = { ...VACIO };
    Object.keys(VACIO).forEach((campo) => {
      if (typeof guardado?.[campo] === 'string') datos[campo] = guardado[campo].slice(0, MAX_MENSAJE);
    });
    if (datos.desde && datos.desde < fechaColombia()) {
      datos.desde = '';
      datos.hasta = '';
    }
    return datos;
  } catch {
    return VACIO;
  }
};

const validar = (d, acepta, token) => {
  const errores = {};
  const hoy = fechaColombia();
  if (d.nombre.trim().length < 2) errores.nombre = 'Escribe tu nombre completo.';
  if (!CORREO_RE.test(d.correo.trim())) errores.correo = 'Escribe un correo válido, p. ej. juan@empresa.com.';
  if (d.empresa.trim().length < 2) errores.empresa = 'Escribe el nombre de tu empresa.';
  if (!d.desde) errores.desde = 'Elige desde qué fecha te sirve.';
  else if (d.desde < hoy) errores.desde = 'No puede ser una fecha pasada.';
  if (!d.hasta) errores.hasta = 'Elige hasta qué fecha te sirve.';
  else if (d.desde && d.hasta < d.desde) errores.hasta = 'Debe ser igual o posterior a la fecha inicial.';
  else if (d.desde && diasEntre(d.desde, d.hasta) > MAX_DIAS_RANGO) errores.hasta = `El rango no puede superar ${MAX_DIAS_RANGO} días.`;
  else if (diasEntre(hoy, d.hasta) > MAX_DIAS_ADELANTE) errores.hasta = `Máximo ${MAX_DIAS_ADELANTE} días a partir de hoy.`;
  if (d.mensaje.trim().length < 10) errores.mensaje = 'Cuéntanos el motivo de la cita (mínimo 10 caracteres).';
  if (!acepta) errores.acepta = 'Debes aceptar el tratamiento de datos para agendar.';
  if (TURNSTILE_SITEKEY && !token) errores.turnstile = 'Espera a que termine la verificación de seguridad.';
  return errores;
};

// Alternativa si la agenda en línea falla: correo al gerente con los datos ya escritos
const cuerpoCorreo = (d) => {
  const franja = FRANJAS.find((f) => f.value === d.franja)?.label ?? '';
  const cuerpo = [
    `Nombre: ${d.nombre}`,
    `Empresa: ${d.empresa}${d.cargo ? ` (${d.cargo})` : ''}`,
    `Correo: ${d.correo}`,
    d.servicio ? `Servicio de interés: ${d.servicio}` : '',
    `Fechas posibles: ${d.desde || '?'} a ${d.hasta || '?'} (${franja})`,
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
// recupera al montar en el navegador (ver AgendaTuCita: key según hidratación).
const AgendaForm = ({ restaurar = true }) => {
  const [datos, setDatos] = useState(() => (restaurar ? cargarBorrador() : VACIO));
  const [acepta, setAcepta] = useState(false);
  const [trampa, setTrampa] = useState('');
  const [errores, setErrores] = useState({});
  const [estado, setEstado] = useState({ tipo: 'inicial' });
  const [tokenHumano, setTokenHumano] = useState('');
  const reiniciarTurnstile = useRef(null);
  const resultadoRef = useRef(null);

  const hoy = fechaColombia();
  const limite = fechaColombia(MAX_DIAS_ADELANTE);
  const enviando = estado.tipo === 'enviando';

  // Guardar el borrador mientras se escribe
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        almacen().setItem(CLAVE_BORRADOR, JSON.stringify(datos));
      } catch {
        // Almacenamiento bloqueado: el formulario funciona igual, sin borrador
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [datos]);

  // Al mostrar el resultado, llevar el foco allí (lectores de pantalla y móvil)
  useEffect(() => {
    if (['agendada', 'pendiente'].includes(estado.tipo)) resultadoRef.current?.focus();
  }, [estado.tipo]);

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

  const propsCampo = (nombre, { ayuda = false } = {}) => ({
    id: `agenda-${nombre}`,
    name: nombre,
    value: datos[nombre],
    onChange: actualizar,
    'aria-invalid': errores[nombre] ? true : undefined,
    'aria-describedby': errores[nombre] ? `agenda-${nombre}-error` : ayuda ? `agenda-${nombre}-ayuda` : undefined
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

    if (!AGENDA_ENDPOINT) {
      setEstado({ tipo: 'error', mensaje: 'La agenda en línea todavía no está conectada.' });
      return;
    }

    setEstado({ tipo: 'enviando' });
    const limpios = Object.fromEntries(Object.entries(datos).map(([k, v]) => [k, v.trim()]));
    try {
      // Sin Content-Type propio (text/plain): Apps Script lo acepta sin petición previa CORS
      const respuesta = await fetch(AGENDA_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({ ...limpios, acepta, website: trampa, turnstile: tokenHumano }),
        signal: AbortSignal.timeout(30000)
      });
      const resultado = await respuesta.json();
      if (!resultado.ok) throw new Error(resultado.mensaje || 'No pudimos agendar la cita.');

      try {
        almacen().removeItem(CLAVE_BORRADOR);
      } catch {
        // sin almacenamiento, nada que borrar
      }
      setEstado({
        tipo: resultado.estado === 'pendiente' ? 'pendiente' : 'agendada',
        inicio: resultado.inicio,
        meet: typeof resultado.meet === 'string' && resultado.meet.startsWith('https://meet.google.com/') ? resultado.meet : '',
        correo: limpios.correo
      });
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

  if (estado.tipo === 'agendada' || estado.tipo === 'pendiente') {
    const agendada = estado.tipo === 'agendada';
    return (
      <div className="agenda-resultado" aria-live="polite">
        <span className={`agenda-resultado-icono${agendada ? ' is-ok' : ''}`} aria-hidden="true">
          {agendada ? <CircleCheck size={44} /> : <Hourglass size={40} />}
        </span>
        <h3 className="agenda-resultado-titulo" tabIndex={-1} ref={resultadoRef}>
          {agendada ? '¡Tu cita quedó agendada!' : '¡Recibimos tu solicitud!'}
        </h3>
        {agendada && estado.inicio && (
          <p className="agenda-resultado-fecha">
            {fechaLegible(estado.inicio)}
            <span>Hora de Colombia · {DURACION_MIN} minutos por Google Meet</span>
          </p>
        )}
        <p className="agenda-resultado-texto">
          {agendada ? (
            <>Te enviamos la invitación con el enlace de la reunión a <strong>{estado.correo}</strong>. Revisa también la carpeta de spam.</>
          ) : (
            <>No había espacios libres en las fechas que elegiste. Nuestro gerente comercial ya tiene tus datos y te escribirá a <strong>{estado.correo}</strong> para coordinar la reunión.</>
          )}
        </p>
        <div className="agenda-resultado-acciones">
          {estado.meet && (
            <a className="btn btn-primary" href={estado.meet} target="_blank" rel="noopener noreferrer">
              <Video size={18} aria-hidden="true" /> <span>Abrir enlace de Meet</span>
            </a>
          )}
          <button type="button" className="btn-link" onClick={reiniciar}>
            <RotateCcw size={16} aria-hidden="true" /> Agendar otra cita
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
        <div className="form-row">
          <Campo id="agenda-desde" label="Desde" error={errores.desde} className="form-group--compact">
            <input type="date" className="form-input" min={hoy} max={limite} {...propsCampo('desde')} />
          </Campo>
          <Campo
            id="agenda-hasta"
            label="Hasta"
            error={errores.hasta}
            ayuda={`Máximo ${MAX_DIAS_RANGO} días de rango`}
            className="form-group--compact"
          >
            <input type="date" className="form-input" min={datos.desde || hoy} max={limite} {...propsCampo('hasta', { ayuda: true })} />
          </Campo>
        </div>

        <div className="franjas" role="radiogroup" aria-label="Franja horaria preferida">
          {FRANJAS.map((franja) => (
            <label key={franja.value} className={`franja${datos.franja === franja.value ? ' is-checked' : ''}`}>
              <input type="radio" name="franja" value={franja.value} checked={datos.franja === franja.value} onChange={actualizar} />
              <span className="franja-label">{franja.label}</span>
              <span className="franja-horario">{franja.horario}</span>
            </label>
          ))}
        </div>
        <p className="form-hint">Buscamos el primer espacio libre de lunes a viernes (hora de Colombia) y te enviamos la invitación de Google Meet.</p>
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
          <><LoaderCircle className="spin" size={18} aria-hidden="true" /> <span>Agendando tu cita...</span></>
        ) : (
          <><span>Agendar cita</span> <ArrowRight className="btn-arrow" size={18} aria-hidden="true" /></>
        )}
      </button>
    </form>
  );
};

export default AgendaForm;
