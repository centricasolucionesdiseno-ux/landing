import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Mic, Phone, RotateCcw, SendHorizontal, Square, Volume2, VolumeX, X } from 'lucide-react';
import { WhatsAppIcon } from '../common/ContactLinks';
import { enlaceWhatsApp, PESTANA_NUEVA } from '../../utils/contactLinks';
import { prefersReducedMotion } from '../../utils/motion';
import { SITE_URL } from '../../config/seo';
import { ORDEN_PERFIL, SEGUNDOS_CERRAR_SIN_RESPUESTA, SEGUNDOS_PREGUNTAR_SI_SIGUE, SERVICIOS } from '../../config/nebulina';
import {
  bienvenida, comentarioDePagina, etiquetaDePerfil, paginaDe, pausaEscribiendo, respuestaDeTema, respuestaInactividad,
  respuestaPerfil, responder, saludoInicial, servicioDeTema
} from './motor';
import { borrarConversacion, cargarConversacion, conOferta, conTema, guardarConversacion, MEMORIA_INICIAL } from './memoria';
import { leerRecorrido } from './recorrido';
import useVoz from './useVoz';
import { callar, leer } from './voz';
import MensajeGerente from './MensajeGerente';
import Parpados from './Parpados';
import Avatar from '../../assets/images/Imagenes/Nebulina-Avatar-128.webp';
import '../../styles/nebulina-chat.css';

const MAX_PREGUNTA = 300;
// La primera vez que usa el micrófono, Nebulina explica cómo se procesa la voz
const AVISO_VOZ = 'Te escucho. 🎙️ Tu navegador convierte tu voz en texto (según el navegador, en tu equipo o en los servidores de su fabricante); a Céntrica solo llega lo que se escribe en el chat, nunca el audio.';
// Cualquiera de estas acciones dentro del chat cuenta como actividad del visitante
const EVENTOS_ACTIVIDAD = ['pointerdown', 'keydown', 'input', 'wheel', 'touchstart'];

// Respuestas del diagnóstico en texto: "Entidad pública · Lo antes posible"
const perfilEnTexto = (perfil = {}) =>
  ORDEN_PERFIL.map((campo) => etiquetaDePerfil(campo, perfil[campo])).filter(Boolean).join(' · ');

// Mensaje de WhatsApp ya escrito: el gerente sabe desde qué página, sobre qué
// servicio y con qué perfil llega
const mensajeWhatsApp = (ruta, servicio, perfil) => {
  const sobre = SERVICIOS[servicio] ? ` sobre ${SERVICIOS[servicio].texto}` : '';
  const resumen = perfilEnTexto(perfil);
  const conPerfil = resumen ? ` (${resumen})` : '';
  return `Hola, vengo del chat de Nebulina (${SITE_URL}${ruta}). Me gustaría recibir información${sobre}.${conPerfil}`;
};

const Accion = ({ accion, ruta, servicio, perfil, onTema, onPerfil, onCorreo }) => {
  switch (accion.tipo) {
    case 'pagina':
      return <Link className="nebulina-chip" to={accion.ruta}>{accion.etiqueta}</Link>;
    case 'whatsapp':
      return (
        <a className="nebulina-chip nebulina-chip--whatsapp" href={enlaceWhatsApp(mensajeWhatsApp(ruta, servicio, perfil))} {...PESTANA_NUEVA}>
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
    case 'perfil':
      return <button type="button" className="nebulina-chip" onClick={() => onPerfil(accion.campo, accion.valor, accion.etiqueta)}>{accion.etiqueta}</button>;
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
const NebulinaChat = ({ abierto, onCerrar, temaInicial = null }) => {
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
  const temaPedido = useRef(temaInicial);
  // Memoria al día para los temporizadores (sin reiniciarlos con cada cambio)
  const memoriaRef = useRef(memoria);
  // La última pregunta llegó por voz: la respuesta también se lee en voz alta
  const respuestaEnVoz = useRef(false);
  const ultimoLeido = useRef(guardada?.mensajes.at(-1)?.id ?? 0);

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

  // Recuerda nombre, servicio, temas consultados, diagnóstico y ofertas hechas
  // (el perfil y los temas van en el aviso al gerente)
  const recordar = useCallback((respuesta) =>
    setMemoria((actual) => ({
      ...actual,
      nombre: respuesta.nombre ?? actual.nombre,
      servicio: servicioDeTema(respuesta.tema) ?? respuesta.servicioElegido ?? actual.servicio,
      temas: conTema(actual.temas, respuesta.tema),
      perfil: respuesta.perfil ?? actual.perfil,
      diagnostico: respuesta.diagnostico ?? null,
      ofertas: conOferta(actual.ofertas, respuesta.oferta)
    })), []);

  // Al abrir: bienvenida, o la respuesta a la invitación que pulsó el visitante
  useEffect(() => {
    const ruta = rutaAnunciada.current;
    const tema = temaPedido.current;
    if (tema) {
      const respuesta = respuestaDeTema(tema, ruta, guardada?.memoria ?? MEMORIA_INICIAL);
      recordar(respuesta);
      responderComoNebulina(guardada ? respuesta : { ...respuesta, parrafos: [saludoInicial(), ...respuesta.parrafos] });
    } else if (!guardada) {
      responderComoNebulina(bienvenida(ruta));
    }
    const pendientes = temporizadores.current;
    return () => pendientes.forEach(clearTimeout);
  }, [guardada, recordar, responderComoNebulina]);

  // Conservar la conversación al recargar o navegar (sessionStorage)
  useEffect(() => {
    memoriaRef.current = memoria;
    if (mensajes.length) guardarConversacion(mensajes, memoria);
  }, [mensajes, memoria]);

  // Al navegar con el chat abierto, Nebulina comenta la nueva página
  useEffect(() => {
    if (pathname === rutaAnunciada.current) return undefined;
    rutaAnunciada.current = pathname;
    if (!abierto) return undefined;
    // Pausa breve: primero carga la página nueva, luego Nebulina la comenta
    const timer = setTimeout(() => {
      const comentario = comentarioDePagina(pathname, memoriaRef.current, leerRecorrido().servicios);
      if (!comentario) return;
      recordar(comentario);
      responderComoNebulina(comentario);
    }, 600);
    return () => clearTimeout(timer);
  }, [pathname, abierto, recordar, responderComoNebulina]);

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

  const contestar = (textoVisitante, respuesta, porVoz = false) => {
    respuestaEnVoz.current = porVoz;
    agregar('visitante', { parrafos: [textoVisitante] });
    recordar(respuesta);
    responderComoNebulina(respuesta);
  };

  const preguntar = (texto, porVoz = false) => {
    const limpio = texto.trim().slice(0, MAX_PREGUNTA);
    if (!limpio || escribiendo) return;
    contestar(limpio, responder(limpio, pathname, memoria), porVoz);
  };

  // ---------- Voz ----------

  const voz = useVoz({
    // Si Nebulina aún está escribiendo, lo dictado queda en la caja para enviarlo
    onDictado: (texto) => (escribiendo ? setPregunta(texto) : preguntar(texto, true)),
    onActividad: () => setActividad((n) => n + 1),
    onAviso: (texto) => agregar('nebulina', { parrafos: [texto] })
  });

  const alternarMicrofono = () => {
    if (voz.disponible.dictado && !voz.escuchando && !memoria.avisoVoz) {
      agregar('nebulina', { parrafos: [AVISO_VOZ] });
      setMemoria((actual) => ({ ...actual, avisoVoz: true }));
    }
    voz.alternarMicrofono();
    // Sin dictado en el navegador: la caja queda lista para el dictado del teclado
    if (!voz.disponible.dictado) entradaRef.current?.focus();
  };

  // Lee en voz alta cada respuesta nueva si el visitante lo activó o si preguntó hablando
  useEffect(() => {
    const ultimoMensaje = mensajes.at(-1);
    if (!ultimoMensaje || ultimoMensaje.id <= ultimoLeido.current) return;
    ultimoLeido.current = ultimoMensaje.id;
    if (ultimoMensaje.autor === 'nebulina' && abierto && (voz.leerEnVoz || respuestaEnVoz.current)) leer(ultimoMensaje.parrafos);
  }, [mensajes, abierto, voz.leerEnVoz]);

  // Al cerrar el chat: micrófono apagado y sin voz
  const { dejarDeEscuchar } = voz;
  useEffect(() => {
    if (abierto) return;
    dejarDeEscuchar();
    callar();
  }, [abierto, dejarDeEscuchar]);

  const elegirTema = (id, etiqueta) => {
    if (escribiendo) return;
    contestar(etiqueta, respuestaDeTema(id, pathname, memoria));
  };

  const elegirPerfil = (campo, valor, etiqueta) => {
    const respuesta = escribiendo ? null : respuestaPerfil(campo, valor, pathname, memoria);
    if (respuesta) contestar(etiqueta, respuesta);
  };

  const enviarPregunta = (event) => {
    event.preventDefault();
    preguntar(pregunta);
    setPregunta('');
  };

  const nuevaConversacion = () => {
    callar();
    respuestaEnVoz.current = false;
    temporizadores.current.forEach(clearTimeout);
    temporizadores.current.length = 0;
    temaPedido.current = null;
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
        <span className="nebulina-viva nebulina-chat-avatar">
          <img src={Avatar} width="128" height="128" alt="" />
          <Parpados variante="avatar" />
        </span>
        <div>
          <h2 id="nebulina-chat-titulo" className="nebulina-chat-titulo">Nebulina</h2>
          <p className="nebulina-chat-estado"><span aria-hidden="true" /> En línea · Asistente virtual de Céntrica</p>
        </div>
        <div className="nebulina-chat-botones">
          {voz.disponible.lectura && (
            <button
              type="button"
              className="nebulina-chat-boton"
              onClick={voz.alternarLectura}
              aria-pressed={voz.leerEnVoz}
              aria-label="Leer las respuestas en voz alta"
              title={voz.leerEnVoz ? 'Dejar de leer en voz alta' : 'Leer las respuestas en voz alta'}
            >
              {voz.leerEnVoz ? <Volume2 size={18} aria-hidden="true" /> : <VolumeX size={18} aria-hidden="true" />}
            </button>
          )}
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
                perfil={memoria.perfil}
                onTema={elegirTema}
                onPerfil={elegirPerfil}
                onCorreo={() => setFormulario(true)}
              />
            ))}
          </div>
        )}
        {formulario && (
          <MensajeGerente
            pagina={pathname}
            temas={memoria.temas}
            perfil={memoria.perfil}
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
            value={voz.escuchando ? voz.parcial : pregunta}
            onChange={(event) => setPregunta(event.target.value)}
            maxLength={MAX_PREGUNTA}
            placeholder={voz.escuchando ? 'Te escucho...' : 'Escribe o dicta tu pregunta...'}
            readOnly={voz.escuchando}
            autoComplete="off"
          />
          {/* Siempre visible: si el navegador no tiene dictado, Nebulina lo explica */}
          <button
            type="button"
            className={`nebulina-microfono${voz.escuchando ? ' is-escuchando' : ''}`}
            onClick={alternarMicrofono}
            aria-pressed={voz.escuchando}
            aria-label={voz.escuchando ? 'Dejar de escuchar' : 'Hablar con Nebulina'}
            title={voz.escuchando ? 'Dejar de escuchar' : 'Hablar con Nebulina'}
          >
            {voz.escuchando ? <Square size={16} aria-hidden="true" /> : <Mic size={20} aria-hidden="true" />}
          </button>
          <button type="submit" aria-label="Enviar pregunta" disabled={!pregunta.trim() || escribiendo || voz.escuchando}>
            <SendHorizontal size={20} aria-hidden="true" />
          </button>
        </form>
      )}
    </dialog>
  );
};

export default NebulinaChat;
