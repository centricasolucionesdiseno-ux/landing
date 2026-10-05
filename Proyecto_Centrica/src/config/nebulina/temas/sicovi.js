/** SICOVI: gestión legislativa para Concejos y Asambleas. */
import { ir, tema, AGENDAR, CIERRE } from '../acciones';

export const TEMAS_SICOVI = {
  sicovi: {
    etiqueta: '¿Qué es SICOVI?',
    palabras: ['sicovi', 'concejo', 'concejos', 'concejal', 'concejales', 'asamblea', 'asambleas', 'asamblea departamental', 'diputado', 'diputados', 'ordenanza', 'ordenanzas', 'legislativo', 'legislativa', 'acuerdos municipales', 'concejo visible', 'sistema del concejo', 'sistema para el concejo', 'software para concejos', 'gestion del concejo'],
    respuesta: [
      'SICOVI (Sistema Concejo Visible) es nuestra plataforma de gestión legislativa para Concejos Municipales y Asambleas Departamentales de Colombia.',
      'Centraliza acuerdos u ordenanzas, proyectos, sesiones, comisiones y agenda, con trazabilidad completa y acceso público para la ciudadanía.'
    ],
    acciones: [tema('sicovi_modulos', '¿Qué gestiona?'), tema('sicovi_ciudadania', '¿Qué gana la ciudadanía?'), ir('/sicovi', 'Ver SICOVI'), AGENDAR]
  },
  sicovi_modulos: {
    etiqueta: '¿Qué gestiona SICOVI?',
    palabras: ['sesiones', 'comisiones', 'proyectos de acuerdo', 'proyectos de ordenanza', 'actas', 'agenda legislativa', 'que gestiona'],
    respuesta: [
      'SICOVI tiene módulos para acuerdos u ordenanzas, proyectos, sesiones, agenda y comisiones, cada uno con un equipo (squad) especializado. 🏛️',
      'Automatiza el flujo de trabajo interno de la corporación y cada Concejo o Asamblea tiene su información totalmente aislada.'
    ],
    acciones: CIERRE
  },
  sicovi_medellin: {
    etiqueta: '¿Dónde se usa?',
    palabras: ['concejo de medellin', 'caso de exito', 'casos de exito', 'referencias', 'quien lo usa', 'donde lo usan', 'simi'],
    respuesta: [
      'SICOVI está en el Concejo de Medellín. 🏛️ La ciudadanía consulta en línea 6 módulos (acuerdos, proyectos de acuerdo, agenda, invitaciones, citaciones y comisiones) y el historial legislativo desde 2008.',
      'Según el informe de gestión 2024 del Concejo, ese año se aprobaron 21 proyectos de acuerdo y se realizaron 27 citaciones de control político.'
    ],
    acciones: [ir('/sicovi', 'Ver SICOVI'), ...CIERRE]
  },
  sicovi_ciudadania: {
    etiqueta: '¿Qué gana la ciudadanía?',
    palabras: ['ciudadania', 'ciudadanos', 'transparencia', 'participacion', 'acceso publico'],
    respuesta: ['Con SICOVI cualquier ciudadano puede consultar en línea los acuerdos u ordenanzas, proyectos, sesiones y toda la actividad de su Concejo o Asamblea. Más transparencia y más participación. 🙌'],
    acciones: [ir('/sicovi', 'Ver SICOVI'), ...CIERRE]
  }
};
