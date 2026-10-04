// Reglas de validación compartidas por los formularios del sitio (el servidor
// vuelve a validar todo; esto solo evita envíos con errores evidentes).

// usuario@dominio.tld: las partes del dominio no contienen puntos (sin retroceso costoso)
export const CORREO_RE = /^[^\s@]+@(?:[^\s@.]+\.)+[^\s@.]{2,}$/;

export const esCorreoValido = (correo) => CORREO_RE.test(correo.trim());
