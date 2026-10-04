// Cualquier parte del sitio puede abrir el chat (p. ej. el botón de la sección
// "Conoce a Nebulina") sin depender del componente: se comunica por un evento.
export const EVENTO_ABRIR = 'nebulina:abrir';

export const abrirNebulina = () => window.dispatchEvent(new CustomEvent(EVENTO_ABRIR));
