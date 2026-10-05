import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CircleAlert, LoaderCircle, SendHorizontal } from 'lucide-react';
import Turnstile from '../common/Turnstile';
import { RESPUESTA_DIAS_HABILES, TURNSTILE_SITEKEY } from '../../config/agenda';
import { NEBULINA_ENDPOINT } from '../../config/nebulina/ajustes';
import { esCorreoValido } from '../../utils/validacion';

const MAX_MENSAJE = 1000;

const validar = ({ nombre, correo, mensaje }, acepta, token) => {
  if (nombre.trim().length < 2) return 'Escribe tu nombre.';
  if (!esCorreoValido(correo)) return 'Escribe un correo válido para que podamos responderte.';
  if (mensaje.trim().length < 10) return 'Cuéntanos un poco más (mínimo 10 caracteres).';
  if (!acepta) return 'Debes aceptar el tratamiento de datos para enviar el mensaje.';
  return TURNSTILE_SITEKEY && !token ? 'Espera a que termine la verificación de seguridad.' : '';
};

/**
 * Mensaje para el gerente desde el chat. Se envía al correo del gerente desde
 * el servidor (Hostinger); al visitante no se le envía nada, así el formulario
 * no sirve para mandar correos a terceros.
 */
const MensajeGerente = ({ pagina, temas = [], perfil = {}, nombreInicial = '', onEnviado, onCancelar }) => {
  const [datos, setDatos] = useState({ nombre: nombreInicial, correo: '', mensaje: '' });
  const [acepta, setAcepta] = useState(false);
  const [trampa, setTrampa] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const reiniciarTurnstile = useRef(null);
  // Momento en que se abrió el formulario: el servidor rechaza envíos instantáneos (bots)
  const [abiertoEn] = useState(() => Date.now());
  const recibirToken = useCallback((nuevo) => setToken(nuevo), []);

  const actualizar = (event) => {
    const { name, value } = event.target;
    setDatos((actuales) => ({ ...actuales, [name]: value }));
    setError('');
  };

  const enviar = async (event) => {
    event.preventDefault();
    if (enviando) return;
    const problema = validar(datos, acepta, token);
    if (problema) {
      setError(problema);
      return;
    }
    setEnviando(true);
    try {
      const respuesta = await fetch(NEBULINA_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: datos.nombre.trim(),
          correo: datos.correo.trim(),
          mensaje: datos.mensaje.trim(),
          pagina,
          // Temas que consultó en el chat: le dan contexto al gerente
          temas,
          // Respuestas del diagnóstico (tipo de organización, necesidad, urgencia)
          perfil,
          acepta,
          website: trampa,
          turnstile: token,
          tiempo: Date.now() - abiertoEn
        }),
        signal: AbortSignal.timeout(20000)
      });
      const resultado = await respuesta.json();
      if (!resultado.ok) throw new Error(resultado.mensaje || 'No pudimos enviar tu mensaje.');
      onEnviado(datos.nombre.trim().split(' ')[0]);
    } catch (error_) {
      setToken('');
      reiniciarTurnstile.current?.();
      const sinConexion = error_.name === 'TimeoutError' || error_ instanceof TypeError || error_ instanceof SyntaxError;
      setError(sinConexion ? 'No pudimos conectar en este momento. Inténtalo de nuevo o escríbenos por WhatsApp.' : error_.message);
      setEnviando(false);
    }
  };

  return (
    <form className="nebulina-formulario" onSubmit={enviar} noValidate>
      <p className="nebulina-formulario-intro">
        Déjale tu mensaje a nuestro gerente comercial y te responderá a tu correo en máximo {RESPUESTA_DIAS_HABILES} días hábiles.
      </p>
      <label htmlFor="nebulina-nombre">Nombre</label>
      <input id="nebulina-nombre" name="nombre" type="text" autoComplete="name" maxLength={80} value={datos.nombre} onChange={actualizar} />
      <label htmlFor="nebulina-correo">Correo</label>
      <input id="nebulina-correo" name="correo" type="email" inputMode="email" autoComplete="email" maxLength={120} value={datos.correo} onChange={actualizar} />
      <label htmlFor="nebulina-mensaje">Mensaje</label>
      <textarea id="nebulina-mensaje" name="mensaje" rows={3} maxLength={MAX_MENSAJE} value={datos.mensaje} onChange={actualizar} />

      <div className="nebulina-formulario-acepta">
        <input id="nebulina-acepta" type="checkbox" checked={acepta} onChange={(event) => { setAcepta(event.target.checked); setError(''); }} />
        <label htmlFor="nebulina-acepta">
          Acepto el tratamiento de mis datos según la <Link to="/privacidad">Política de Privacidad</Link>.
        </label>
      </div>

      {/* Campo trampa: invisible para personas, los bots lo llenan */}
      <div className="form-trampa" aria-hidden="true">
        <label htmlFor="nebulina-website">Sitio web</label>
        <input id="nebulina-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={trampa} onChange={(event) => setTrampa(event.target.value)} />
      </div>

      {TURNSTILE_SITEKEY && <Turnstile sitekey={TURNSTILE_SITEKEY} onToken={recibirToken} reiniciarRef={reiniciarTurnstile} />}

      {error && <p className="nebulina-formulario-error" role="alert"><CircleAlert size={14} aria-hidden="true" /> {error}</p>}

      <div className="nebulina-formulario-acciones">
        <button type="button" className="btn-link" onClick={onCancelar}>Volver al chat</button>
        <button type="submit" className="btn btn-primary" disabled={enviando} aria-busy={enviando}>
          {enviando ? <LoaderCircle className="spin" size={16} aria-hidden="true" /> : <SendHorizontal size={16} aria-hidden="true" />}
          <span>{enviando ? 'Enviando...' : 'Enviar'}</span>
        </button>
      </div>
    </form>
  );
};

export default MensajeGerente;
