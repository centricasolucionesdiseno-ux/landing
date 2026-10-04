import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Phone, RotateCcw, SendHorizontal, X } from 'lucide-react';
import { WhatsAppIcon } from '../common/ContactLinks';
import { enlaceWhatsApp, PESTANA_NUEVA } from '../../utils/contactLinks';
import { prefersReducedMotion } from '../../utils/motion';
import { SITE_URL } from '../../config/seo';
import { SEGUNDOS_CERRAR_SIN_RESPUESTA, SEGUNDOS_PREGUNTAR_SI_SIGUE, SERVICIOS } from '../../config/nebulina';
import { bienvenida, cambioDePagina, paginaDe, pausaEscribiendo, respuestaDeTema, respuestaInactividad, responder, servicioDeTema } from './motor';
import { borrarConversacion, cargarConversacion, conTema, guardarConversacion, MEMORIA_INICIAL } from './memoria';
import MensajeGerente from './MensajeGerente';
import Avatar from '../../assets/images/Imagenes/Nebulina-Avatar-128.webp';
import '../../styles/nebulina-chat.css';

const MAX_PREGUNTA = 300;
// Cualquiera de estas acciones dentro del chat cuenta como actividad del visitante
const EVENTOS_ACTIVIDAD = ['pointerdown', 'keydown', 'input', 'wheel', 'touchstart'];

// Mensaje de WhatsApp ya escrito: el gerente sabe desde qué página y sobre qué servicio llega
const mensajeWhatsApp = (ruta, servicio) => {
  const sobre = SERVICIOS[servicio] ? ` sobre ${SERVICIOS[servicio].texto}` : '';
  return `Hola, vengo del chat de Nebulina (${SITE_URL}${ruta}). Me gustaría recibir información${sobre}.`;
};

const Accion = ({ accion, ruta, servicio, onTema, onCorreo }) => {
  switch (accion.tipo) {
    case 'pagina':
      return <Link className="nebulina-chip" to={accion.ruta}>{accion.etiqueta}</Link>;
    case 'whatsapp':
      return (
        <a className="nebulina-chip nebulina-chip--whatsapp" href={enlaceWhatsApp(mensajeWhatsApp(ruta, servicio))} {...PESTANA_NUEVA}>
          <WhatsAppIcon size={14} /> {accion.etiqueta}
        </a>
      );
    case 'llamar':
      return (
        <a className="nebulina-chip" href={accion.href}>
          <Phone size={14} aria-hidden="true" /> {accion.etiqueta}
        </a>
      );
    case 'correo':
      return (
        <button type="button" className="nebulina-chip" onClick={onCorreo}>
          <Mail size={14} aria-hidden="true" /> {accion.etiqueta}
        </button>
      );
    default:
      return <button type="button" className="nebulina-chip" onClick={() => onTema(accion.id, accion.etiqueta)}>{accion.etiqueta}</button>;
  }
};

const Burbuja = ({ mensaje }) => (
  <div className={`nebulina-mensaje nebulina-mensaje--${mensaje.autor}`}>
    {mensaje.autor === 'nebulina' && <img className="nebulina-mensaje-avatar" src={Avatar} width="128" height="128" alt="" />}
    <div className="nebulina-mensaje-cuerpo">
      {mensaje.parrafos.map((parrafo) => <p key={parrafo}>{parrafo}</p>)}
    </div>
  </div>
);

/**
 * Panel del chat. Todo el texto se pinta como texto (nunca como HTML), así lo
 * que escriba el visitante no puede inyectar código en la página.
 */
const NebulinaChat = ({ abierto, onCerrar }) => {
  const { pathname } = useLocation();
  // La conversación de esta pestaña (si recargó la página) o una nueva
  const [guardada] = useState(cargarConversacion);
  const [mensajes, setMensajes] = useState(() => guardada?.mensajes ?? []);
  const [memoria, setMemoria] = useState(() => guardada?.memoria ?? MEMORIA_INICIAL);
  const [escribiendo, setEscribiendo] = useState(false);
  const [pregunta, setPregunta] = useState('');
  const [formulario, setFormulario] = useState(false);
  // Cambia con cada interacción del visitante: reinicia el conteo de inactividad
  const [actividad, setActividad] = useState(0);
  const dialogoRef = useRef(null);
  const contador = useRef(guardada?.mensajes.length ?? 0);
  const temporizadores = useRef([]);
  const logRef = useRef(null);
  const entradaRef = useRef(null);
  const rutaAnunciada = useRef(pathname);

  const agregar = useCallback((autor, contenido) => {
    contador.current += 1;
    const { parrafos, acciones = [], inactividad = null } = contenido;
    setMensajes((actuales) => [...actuales, { id: contador.current, autor, parrafos, acciones, inactividad }]);
  }, []);

  // Nebulina "escribe" un momento antes de responder, como una persona
  const responderComoNebulina = useCallback((respuesta) => {
    setEscribiendo(true);
    const timer = setTimeout(() => {
      setEscribiendo(false);
      agregar('nebulina', respuesta);
    }, pausaEscribiendo(respuesta.parrafos, prefersReducedMotion()));
    temporizadores.current.push(timer);
  }, [agregar]);

  // Bienvenida si no había conversación
  useEffect(() => {
    if (!guardada) responderComoNebulina(bienvenida(rutaAnunciada.current));
    const pendientes = temporizadores.current;
    return () => pendientes.forEach(clearTimeout);
  }, [guardada, responderComoNebulina]);

  // Conservar la conversación al recargar o navegar (sessionStorage)
  useEffect(() => {
    if (mensajes.length) guardarConversacion(mensajes, memoria);
  }, [mensajes, memoria]);

  // Al navegar con el chat abierto, Nebulina comenta la nueva página
  useEffect(() => {
    if (pathname === rutaAnunciada.current) return undefined;
    rutaAnunciada.current = pathname;
    const comentario = cambioDePagina(pathname);
    if (!comentario || !abierto) return undefined;
    // Pausa breve: primero carga la página nueva, luego Nebulina la comenta
    const timer = setTimeout(() => responderComoNebulina(comentario), 600);
    return () => clearTimeout(timer);
  }, [pathname, abierto, responderComoNebulina]);

  // Siempre visible el último mensaje
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, [mensajes, escribiendo, formulario]);

  useEffect(() => {
    if (abierto && !formulario) entradaRef.current?.focus();
  }, [abierto, formulario]);

  // Interacciones dentro del chat (escribir, tocar, desplazar, llenar el formulario)
  useEffect(() => {
    if (!abierto) return undefined;
    const registrar = (event) => {
      if (dialogoRef.current?.contains(event.target)) setActividad((n) => n + 1);
    };
    EVENTOS_ACTIVIDAD.forEach((tipo) => document.addEventListener(tipo, registrar, { passive: true }));
    return () => EVENTOS_ACTIVIDAD.forEach((tipo) => document.removeEventListener(tipo, registrar));
  }, [abierto]);

  // Inactividad: tras una respuesta sin interacción, Nebulina pregunta si sigue ahí;
  // si tampoco hay respuesta, se despide y cierra (sin quitarle el foco a la página)
  useEffect(() => {
    const ultimoMensaje = mensajes.at(-1);
    const esperaRespuesta = abierto && !escribiendo && ultimoMensaje?.autor === 'nebulina';
    if (!esperaRespuesta || ultimoMensaje.inactividad === 'despedida') return undefined;
    const yaPregunto = ultimoMensaje.inactividad === 'pregunta';
    const segundos = yaPregunto ? SEGUNDOS_CERRAR_SIN_RESPUESTA : SEGUNDOS_PREGUNTAR_SI_SIGUE;
    const timer = setTimeout(() => {
      if (!yaPregunto) {
        responderComoNebulina(respuestaInactividad('pregunta', pathname, memoria));
        return;
      }
      agregar('nebulina', respuestaInactividad('despedida', pathname, memoria));
      onCerrar(false);
    }, segundos * 1000);
    return () => clearTimeout(timer);
  }, [mensajes, abierto, escribiendo, actividad, pathname, memoria, agregar, responderComoNebulina, onCerrar]);

  // Esc cierra el chat
  useEffect(() => {
    if (!abierto) return undefined;
    const alPresionar = (event) => {
      if (event.key === 'Escape') onCerrar();
    };
    document.addEventListener('keydown', alPresionar);
    return () => document.removeEventListener('keydown', alPresionar);
  }, [abierto, onCerrar]);

  // Recuerda nombre, servicio del que se habla y temas consultados (van en el aviso al gerente)
  const recordar = (respuesta) =>
    setMemoria((actual) => ({
      nombre: respuesta.nombre ?? actual.nombre,
      servicio: servicioDeTema(respuesta.tema) ?? actual.servicio,
      temas: conTema(actual.temas, respuesta.tema)
    }));

  const contestar = (textoVisitante, respuesta) => {
    agregar('visitante', { parrafos: [textoVisitante] });
    recordar(respuesta);
    responderComoNebulina(respuesta);
  };

  const preguntar = (texto) => {
    const limpio = texto.trim().slice(0, MAX_PREGUNTA);
    if (!limpio || escribiendo) return;
    contestar(limpio, responder(limpio, pathname, memoria));
  };

  const elegirTema = (id, etiqueta) => {
    if (escribiendo) return;
    contestar(etiqueta, respuestaDeTema(id, pathname, memoria));
  };

  const enviarPregunta = (event) => {
    event.preventDefault();
    preguntar(pregunta);
    setPregunta('');
  };

  const nuevaConversacion = () => {
    temporizadores.current.forEach(clearTimeout);
    temporizadores.current.length = 0;
    borrarConversacion();
    contador.current = 0;
    setMensajes([]);
    setMemoria(MEMORIA_INICIAL);
    setFormulario(false);
    setEscribiendo(false);
    responderComoNebulina(bienvenida(pathname));
  };

  const mensajeEnviado = (nombre) => {
    setFormulario(false);
    setMemoria((actual) => ({ ...actual, nombre: actual.nombre ?? nombre }));
    responderComoNebulina({
      parrafos: [`¡Listo, ${nombre}! 🙌 Le pasé tu mensaje a nuestro gerente comercial. Te responderá a tu correo muy pronto.`]
    });
  };

  const servicioActual = memoria.servicio ?? paginaDe(pathname).servicio ?? null;
  const ultimo = mensajes.at(-1);
  const acciones = !escribiendo && ultimo?.autor === 'nebulina' ? ultimo.acciones : [];

  return (
    // <dialog> no modal: el resto de la página sigue usable con el chat abierto
    <dialog id="nebulina-chat" ref={dialogoRef} className="nebulina-chat" open={abierto} aria-labelledby="nebulina-chat-titulo">
      <header className="nebulina-chat-cabecera">
        <img className="nebulina-chat-avatar" src={Avatar} width="128" height="128" alt="" />
        <div>
          <h2 id="nebulina-chat-titulo" className="nebulina-chat-titulo">Nebulina</h2>
          <p className="nebulina-chat-estado"><span aria-hidden="true" /> En línea · Asistente virtual de Céntrica</p>
        </div>
        <div className="nebulina-chat-botones">
          <button type="button" className="nebulina-chat-boton" onClick={nuevaConversacion} aria-label="Empezar una conversación nueva" title="Nueva conversación">
            <RotateCcw size={18} aria-hidden="true" />
          </button>
          <button type="button" className="nebulina-chat-boton" onClick={() => onCerrar()} aria-label="Cerrar el chat" title="Cerrar">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="nebulina-chat-log" ref={logRef} role="log" aria-live="polite" aria-relevant="additions">
        {mensajes.map((mensaje) => <Burbuja key={mensaje.id} mensaje={mensaje} />)}
        {escribiendo && (
          <output className="nebulina-escribiendo" aria-label="Nebulina está escribiendo">
            <span /><span /><span />
          </output>
        )}
        {acciones.length > 0 && !formulario && (
          <div className="nebulina-chips">
            {acciones.map((accion) => (
              <Accion
                key={`${accion.tipo}-${accion.id ?? accion.ruta ?? accion.etiqueta}`}
                accion={accion}
                ruta={pathname}
                servicio={servicioActual}
                onTema={elegirTema}
                onCorreo={() => setFormulario(true)}
              />
            ))}
          </div>
        )}
        {formulario && (
          <MensajeGerente
            pagina={pathname}
            temas={memoria.temas}
            nombreInicial={memoria.nombre ?? ''}
            onEnviado={mensajeEnviado}
            onCancelar={() => setFormulario(false)}
          />
        )}
      </div>

      {!formulario && (
        <form className="nebulina-chat-entrada" onSubmit={enviarPregunta}>
          <label htmlFor="nebulina-pregunta" className="visually-hidden">Escribe tu pregunta</label>
          <input
            id="nebulina-pregunta"
            ref={entradaRef}
            type="text"
            value={pregunta}
            onChange={(event) => setPregunta(event.target.value)}
            maxLength={MAX_PREGUNTA}
            placeholder="Escribe tu pregunta..."
            autoComplete="off"
          />
          <button type="submit" aria-label="Enviar pregunta" disabled={!pregunta.trim() || escribiendo}>
            <SendHorizontal size={20} aria-hidden="true" />
          </button>
        </form>
      )}
    </dialog>
  );
};

export default NebulinaChat;
