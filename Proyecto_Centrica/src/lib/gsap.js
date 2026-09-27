/**
 * GSAP se carga en diferido: no forma parte de la carga inicial, así la
 * página se pinta antes. Solo lo usan el parallax del hero y los contadores.
 */
let gsapPromise;

export const loadGsap = () => {
  gsapPromise ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
    ([{ gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger);
      return { gsap, ScrollTrigger };
    }
  );
  return gsapPromise;
};
