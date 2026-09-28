import { CONTACTO, UBICACION } from './agenda';

// Datos del responsable del tratamiento (NIT verificado con el dígito de la DIAN).
export const EMPRESA = {
  // Tal como figura en el registro mercantil (sin tilde)
  razonSocial: 'Centrica Soluciones Innovadoras S.A.S.',
  nit: '902.018.900-5',
  domicilio: `${UBICACION.direccion}, Colombia`,
  correo: CONTACTO.correo,
  telefono: CONTACTO.telefono,
  sitio: 'centricasoluciones.com',
  // Ficha pública de la empresa (enlazada desde el footer)
  ficha: 'https://directorio-empresas.einforma.co/informacion-empresa/centrica-soluciones-innovadoras-sas'
};

export const PRIVACIDAD = {
  vigencia: '24 de abril de 2026',
  actualizacion: '27 de septiembre de 2026'
};

export const TERMINOS = {
  vigencia: '24 de abril de 2026',
  actualizacion: '27 de septiembre de 2026'
};

export const AVISO_LEGAL = {
  vigencia: '24 de abril de 2026',
  actualizacion: '27 de septiembre de 2026'
};

export const COOKIES = {
  vigencia: '24 de abril de 2026',
  actualizacion: '27 de septiembre de 2026'
};
