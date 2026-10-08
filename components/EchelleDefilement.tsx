"use client";

import { useEffect, useRef } from "react";

/**
 * La barre de défilement du site : l'échelle crantée du Wall des Memories
 * (MemoryWallScrollRuler dans l'app).
 *
 * 25 crans, rangés le long du bord droit. Le cran qui correspond à
 * l'avancement s'allonge et s'épaissit, ses voisins un peu moins (sur 3
 * crans), les autres restent de fins traits discrets. Même dégradé que
 * l'app : rose Memories, blanc, cyan.
 *
 * Purement indicative, comme dans l'app : elle ne capte aucun toucher. Mise
 * à jour au défilement, une fois par image au plus, et seulement quand le
 * cran le plus proche change ou bouge d'un demi-cran : aucun coût au repos.
 */
const CRANS = 25;

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
        const emphase = Math.max(0, 1 - distance / 3);
        c.style.width = `${4 + 12 * emphase}px`;
        c.style.height = distance < 0.6 ? "2px" : "1px";
        c.style.opacity = String(0.18 + 0.72 * emphase);
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
      className="pointer-events-none fixed top-1/2 right-[5px] z-[60] flex -translate-y-1/2 flex-col items-end gap-[6px] opacity-70 transition-opacity duration-500 data-[actif]:opacity-100"
    >
      {Array.from({ length: CRANS }, (_, i) => (
        <span
          key={i}
          className="block rounded-full bg-[linear-gradient(90deg,#ff348d,#ffffff,#22d3ee)] transition-[width,opacity] duration-200 ease-out"
          style={{ width: 4, height: 1, opacity: 0.18 }}
        />
      ))}
    </div>
  );
}
