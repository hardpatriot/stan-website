"use client";

import { useEffect, useRef } from "react";

/**
 * Une scène épinglée : la section mesure plusieurs écrans, son contenu reste
 * collé pendant qu'on défile, et `onFrame` reçoit l'avancement de 0 à 1.
 *
 * Une boucle par scène, qui ne tourne que tant que la scène est à l'écran,
 * lissée (le doigt sur iPhone envoie le défilement par à-coups). `onFrame`
 * n'écrit que des transformations et des opacités : rien à recalculer pour
 * le navigateur, tout reste sur le processeur graphique.
 */
export function useScene<T extends HTMLElement>(
  onFrame: (p: number, el: T) => void,
  lissage = 0.16,
) {
  const ref = useRef<T>(null);
  const rappel = useRef(onFrame);
  useEffect(() => {
    rappel.current = onFrame;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const immobile = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let p = -1;
    let haut = 0;
    let course = 1;
    const mesurer = () => {
      const r = el.getBoundingClientRect();
      haut = r.top + window.scrollY;
      course = Math.max(1, el.offsetHeight - window.innerHeight);
    };
    const image = () => {
      const cible = Math.min(1, Math.max(0, (window.scrollY - haut) / course));
      p = p < 0 || immobile ? cible : p + (cible - p) * lissage;
      if (Math.abs(cible - p) < 0.0005) p = cible;
      rappel.current(p, el);
      raf = requestAnimationFrame(image);
    };
    const observateur = new IntersectionObserver(
      ([e]) => {
        cancelAnimationFrame(raf);
        raf = 0;
        if (e.isIntersecting) {
          mesurer();
          raf = requestAnimationFrame(image);
        }
      },
      { rootMargin: "20% 0px" },
    );
    observateur.observe(el);
    window.addEventListener("resize", mesurer, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      observateur.disconnect();
      window.removeEventListener("resize", mesurer);
    };
  }, [lissage]);

  return ref;
}

/** Avancement local d'une phase : 0 avant `a`, 1 après `b`, adouci entre les deux. */
export function phase(p: number, a: number, b: number) {
  const t = Math.min(1, Math.max(0, (p - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
