/**
 * Revisa la coherencia de la base de conocimiento: que cada botón, sugerencia
 * e invitación apunte a un tema que existe, que las páginas y servicios
 * referenciados existan y que ningún tema quede mal formado.
 * @returns {string[]} problemas encontrados (vacío si todo está bien)
 */
import { SERVICIOS as SERVICIOS_FORMULARIO } from '../agenda';
import { TEMAS, TOTAL_TEMAS_DEFINIDOS } from './conocimiento';
import { SERVICIOS } from './servicios';
import { PAGINAS, PAGINA_POR_DEFECTO } from './paginas';
import { INACTIVIDAD, SIN_RESPUESTA } from './mensajes';
import { INVITACIONES, INVITACION_RECORRIDO } from './proactivo';
import { CIERRE_SUAVE, ORDEN_PERFIL, PERFIL, RECOMENDACION, RECOMENDACION_PUBLICA, RECORRIDO, SIGUIENTE_PASO, TEMA_DIAGNOSTICO, VENTA_CRUZADA } from './ventas';

const ID_RE = /^[a-z_]{1,40}$/;
const PALABRA_RE = /^[a-z0-9 ]+$/;
const RUTA_RE = /^\/[a-z0-9/-]*$/;
const TIPOS = new Set(['tema', 'pagina', 'agendar', 'whatsapp', 'correo', 'llamar']);
const RUTAS = new Set([...Object.keys(PAGINAS), ...Object.values(SERVICIOS).map(({ ruta }) => ruta)]);

const revisarAcciones = (acciones, donde, problemas) => {
  if (!Array.isArray(acciones)) {
    problemas.push(`${donde}: "acciones" debe ser una lista`);
    return;
  }
  for (const accion of acciones) {
    if (!TIPOS.has(accion?.tipo) || !accion.etiqueta) problemas.push(`${donde}: acción mal formada (${JSON.stringify(accion)})`);
    else if (accion.tipo === 'tema' && !TEMAS[accion.id]) problemas.push(`${donde}: el botón "${accion.etiqueta}" apunta al tema inexistente "${accion.id}"`);
    else if (accion.tipo === 'pagina' && !RUTAS.has(accion.ruta)) problemas.push(`${donde}: el botón "${accion.etiqueta}" apunta a la página desconocida "${accion.ruta}"`);
  }
};

const revisarTema = (id, contenido, problemas) => {
  const { palabras, respuesta, acciones } = contenido;
  if (!ID_RE.test(id)) problemas.push(`tema "${id}": el id solo puede tener minúsculas y "_"`);
  if (!Array.isArray(palabras) || palabras.length === 0) problemas.push(`tema "${id}": no tiene palabras clave`);
  else palabras.filter((frase) => !PALABRA_RE.test(frase)).forEach((frase) => problemas.push(`tema "${id}": "${frase}" debe ir en minúsculas, sin tildes ni signos`));
  if (!Array.isArray(respuesta) || respuesta.length === 0) problemas.push(`tema "${id}": no tiene respuesta`);
  revisarAcciones(acciones, `tema "${id}"`, problemas);
};

const revisarTemaReferenciado = (id, donde, problemas, conEtiqueta = false) => {
  if (!TEMAS[id]) problemas.push(`${donde}: el tema "${id}" no existe`);
  else if (conEtiqueta && !TEMAS[id].etiqueta) problemas.push(`${donde}: el tema "${id}" se sugiere como botón pero no tiene "etiqueta"`);
};

const revisarServicio = (id, donde, problemas) => {
  if (!SERVICIOS[id]) problemas.push(`${donde}: el servicio "${id}" no existe`);
};

// Cada servicio se debe poder preseleccionar en el formulario de citas
const revisarServicios = (problemas) => {
  for (const [id, { formulario, ruta }] of Object.entries(SERVICIOS)) {
    if (!SERVICIOS_FORMULARIO.includes(formulario)) problemas.push(`servicio "${id}": "${formulario}" no está en la lista del formulario de citas`);
    if (!PAGINAS[ruta]) problemas.push(`servicio "${id}": la página "${ruta}" no tiene contexto en paginas.js`);
  }
};

const revisarPaginas = (problemas) => {
  const POR_DEFECTO = '(por defecto)';
  for (const [ruta, pagina] of Object.entries({ ...PAGINAS, [POR_DEFECTO]: PAGINA_POR_DEFECTO })) {
    if (ruta !== POR_DEFECTO && !RUTA_RE.test(ruta)) problemas.push(`página "${ruta}": ruta inválida`);
    if (pagina.servicio) revisarServicio(pagina.servicio, `página "${ruta}"`, problemas);
    pagina.sugerencias.forEach((id) => revisarTemaReferenciado(id, `página "${ruta}"`, problemas, true));
  }
  for (const [ruta, invitacion] of Object.entries(INVITACIONES)) {
    if (!PAGINAS[ruta]) problemas.push(`invitación "${ruta}": la página no existe`);
    if (typeof invitacion.segundos !== 'number' || invitacion.segundos < 5) problemas.push(`invitación "${ruta}": debe esperar al menos 5 segundos`);
    revisarTemaReferenciado(invitacion.tema, `invitación "${ruta}"`, problemas);
  }
  revisarTemaReferenciado(INVITACION_RECORRIDO.tema, 'invitación de recorrido', problemas);
};

const revisarPerfil = (problemas) => {
  revisarTemaReferenciado(TEMA_DIAGNOSTICO, 'diagnóstico', problemas);
  for (const campo of ORDEN_PERFIL) {
    if (!PERFIL[campo]?.pregunta || !PERFIL[campo]?.opciones) {
      problemas.push(`perfil: falta la pregunta "${campo}"`);
      continue;
    }
    for (const [valor, { etiqueta, palabras }] of Object.entries(PERFIL[campo].opciones)) {
      if (!ID_RE.test(valor) || !etiqueta || !palabras?.every((frase) => PALABRA_RE.test(frase))) problemas.push(`perfil: la opción "${campo}.${valor}" está mal formada`);
    }
  }
};

const revisarVentas = (problemas) => {
  for (const necesidad of Object.keys(PERFIL.necesidad.opciones)) {
    if (!RECOMENDACION[necesidad]) problemas.push(`perfil: la necesidad "${necesidad}" no tiene recomendación`);
  }
  for (const [necesidad, recomendacion] of [...Object.entries(RECOMENDACION), ...Object.entries(RECOMENDACION_PUBLICA)]) {
    revisarServicio(recomendacion.servicio, `recomendación "${necesidad}"`, problemas);
    revisarTemaReferenciado(recomendacion.tema, `recomendación "${necesidad}"`, problemas, true);
  }
  for (const urgencia of Object.keys(PERFIL.urgencia.opciones)) {
    if (SIGUIENTE_PASO[urgencia]) revisarAcciones(SIGUIENTE_PASO[urgencia].acciones, `siguiente paso "${urgencia}"`, problemas);
    else problemas.push(`perfil: la urgencia "${urgencia}" no tiene siguiente paso`);
  }
  for (const [servicio, cruzada] of Object.entries(VENTA_CRUZADA)) {
    revisarServicio(servicio, 'venta cruzada', problemas);
    revisarTemaReferenciado(cruzada.tema, `venta cruzada de "${servicio}"`, problemas, true);
  }
  revisarAcciones(CIERRE_SUAVE.acciones, 'cierre suave', problemas);
  revisarAcciones(RECORRIDO.acciones, 'recorrido', problemas);
};

export const validarConocimiento = () => {
  const problemas = [];
  if (TOTAL_TEMAS_DEFINIDOS !== Object.keys(TEMAS).length) problemas.push('hay ids de temas repetidos entre archivos de temas/');
  for (const [id, contenido] of Object.entries(TEMAS)) revisarTema(id, contenido, problemas);
  revisarAcciones(SIN_RESPUESTA.acciones, 'sin respuesta', problemas);
  Object.entries(INACTIVIDAD).forEach(([tipo, { acciones }]) => revisarAcciones(acciones, `inactividad "${tipo}"`, problemas));
  revisarServicios(problemas);
  revisarPaginas(problemas);
  revisarPerfil(problemas);
  revisarVentas(problemas);
  return problemas;
};
