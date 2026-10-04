/**
 * Párpados que parpadean sobre una imagen de Nebulina: solo CSS (dos formas
 * que bajan y suben con transform), sin JavaScript ni imágenes extra. Va
 * dentro de un contenedor con position: relative del mismo tamaño que la
 * imagen. `variante` elige la posición de los ojos: avatar | hola | cuerpo
 * (ver nebulina-parpados en components.css).
 */
const Parpados = ({ variante }) => (
  <span className={`nebulina-parpados nebulina-parpados--${variante}`} aria-hidden="true">
    <span className="nebulina-parpado nebulina-parpado--izq" />
    <span className="nebulina-parpado nebulina-parpado--der" />
  </span>
);

export default Parpados;
