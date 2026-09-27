// Configuración de la página de Contacto / "Agenda tu cita". Las listas y
// límites deben coincidir con CONFIG en integraciones/agenda-google/Codigo.gs
// (el script vuelve a validar lo mismo del lado de Google).

// URL de la aplicación web de Apps Script (archivo .env, ver .env.example)
export const AGENDA_ENDPOINT = import.meta.env.VITE_AGENDA_ENDPOINT || '';

export const CONTACTO = {
  correo: 'gerenciacomercial@centricasoluciones.com',
  telefono: '+57 300 205 7325',
  telefonoEnlace: 'tel:+573002057325',
  // WhatsApp: número en formato internacional, sin "+" ni espacios
  whatsapp: '573002057325',
  mensajeWhatsApp: 'Hola, me gustaría recibir información sobre los servicios de Céntrica.',
  oficina: 'Cra. 82C #30-35, Belén, Medellín, Antioquia',
  horario: 'Lunes a Viernes: 8:00 AM - 6:00 PM'
};

// Redes sociales: se muestran solo las que tengan URL
export const REDES = [
  { red: 'LinkedIn', url: '' },
  { red: 'GitHub', url: '' },
  { red: 'X (Twitter)', url: '' }
];

// Ubicación de la oficina (pin exacto de Google Maps)
export const UBICACION = {
  direccion: 'Cra. 82C #30-35, Belén, Medellín, Antioquia',
  lat: 6.2314177,
  lng: -75.6051407
};

export const CARGOS = ['CEO', 'CTO', 'Director TI', 'Gerente', 'Otro'];
export const SERVICIOS = ['Fábrica de software', 'Nebula ERP', 'Sicovi', 'Análisis con IA', 'Consultoría digital', 'Otro'];

export const FRANJAS = [
  { value: 'manana', label: 'Mañana', horario: '8:00 – 12:00 m.' },
  { value: 'tarde', label: 'Tarde', horario: '2:00 – 6:00 p. m.' },
  { value: 'cualquiera', label: 'Cualquier hora', horario: 'Lo antes posible' }
];

export const ZONA_HORARIA = 'America/Bogota';
export const MAX_DIAS_RANGO = 60;
export const MAX_DIAS_ADELANTE = 90;
export const DURACION_MIN = 30;
