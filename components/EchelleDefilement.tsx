"use client";

import { useEffect, useRef } from "react";

/**
 * La barre de défilement du site : l'échelle crantée du Wall des Memories
 * (MemoryWallScrollRuler dans l'app).
 *
 * 81 crans, répartis sur toute la hauteur du bord droit, un sur cinq plus
 * long comme sur une règle. Le cran qui correspond à
 * l'avancement s'allonge et s'épaissit, ses voisins un peu moins (sur 3
 * crans), les autres restent de fins traits discrets. Même dégradé que
 * l'app : rose Memories, blanc, cyan.
 *
 * Purement indicative, comme dans l'app : elle ne capte aucun toucher. Mise
 * à jour au défilement, une fois par image au plus, et seulement quand le
 * cran le plus proche change ou bouge d'un demi-cran : aucun coût au repos.
 */
// Plus de crans que dans l'app : l'échelle couvre toute la hauteur de
// l'écran, du dessous de la barre Stan jusqu'en bas, et on lit d'un coup
// d'œil où l'on est dans la page.
const CRANS = 81;
/** Un cran sur cinq est un repère, plus long : la lecture d'une règle. */
const REPERE = 5;
/** Portée de la mise en avant, en crans : le pic s'étend sur 6 crans. */
const PORTEE = 6;

export function EchelleDefilement() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const crans = Array.from(el.children) as HTMLElement[];
    let raf = 0;
    let dernier = -1;
    let veille: ReturnType<typeof setTimeout> | undefined;

    const dessiner = () => {
      raf = 0;
      const etendue = document.documentElement.scrollHeight - window.innerHeight;
      el.style.opacity = etendue > 1 ? "" : "0";
      const progres = etendue > 1 ? Math.min(1, Math.max(0, window.scrollY / etendue)) : 0;
      // Au demi-cran près : inutile de réécrire 25 styles pour un pixel.
      const position = Math.round(progres * (CRANS - 1) * 2) / 2;
      if (position === dernier) return;
      dernier = position;
      crans.forEach((c, i) => {
        const distance = Math.abs(i - position);
        // Courbe en cloche : un pic net au cran courant, des voisins qui
        // descendent en douceur.
        const lin = Math.max(0, 1 - distance / PORTEE);
        const emphase = Math.pow(lin * lin * (3 - 2 * lin), 1.8);
        const base = i % REPERE === 0 ? 8 : 4;
        c.style.width = `${base + (18 - base) * emphase}px`;
        c.style.height = distance < 0.6 ? "2px" : "1px";
        c.style.opacity = String((i % REPERE === 0 ? 0.32 : 0.16) + 0.72 * emphase);
      });
    };
    const surDefilement = () => {
      el.dataset.actif = "1";
      clearTimeout(veille);
      veille = setTimeout(() => delete el.dataset.actif, 900);
      if (!raf) raf = requestAnimationFrame(dessiner);
    };

    dessiner();
    window.addEventListener("scroll", surDefilement, { passive: true });
    window.addEventListener("resize", surDefilement, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(veille);
      window.removeEventListener("scroll", surDefilement);
      window.removeEventListener("resize", surDefilement);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-[calc(env(safe-area-inset-top)+var(--banniere,0px)+84px)] right-[5px] bottom-[calc(env(safe-area-inset-bottom)+28px)] z-[60] flex flex-col items-end justify-between opacity-70 transition-opacity duration-500 data-[actif]:opacity-100 sm:top-[calc(var(--banniere,0px)+96px)] sm:bottom-8"
    >
      {Array.from({ length: CRANS }, (_, i) => (
        <span
          key={i}
          className="block rounded-full bg-[linear-gradient(90deg,#ff348d,#ffffff,#22d3ee)] transition-[width,opacity] duration-200 ease-out"
          style={{
            width: i % REPERE === 0 ? 8 : 4,
            height: 1,
            opacity: i % REPERE === 0 ? 0.32 : 0.16,
          }}
        />
      ))}
    </div>
  );
}
