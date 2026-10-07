"use client";

import { useEffect, useRef } from "react";

/**
 * Le carrousel des étapes sur téléphone : il avance seul d'une carte toutes
 * les 4 s, revient au début après la dernière, et se laisse prendre au doigt
 * (il reprend 6 s après qu'on l'a lâché). À partir de `sm`, c'est une grille
 * fixe : rien ne bouge.
 *
 * Les cartes ont un halo néon : le conteneur de défilement le couperait net en
 * haut et en bas. On lui donne de la marge intérieure pour que le halo tienne
 * dedans, et les bords gauche et droit s'effacent dans le fond.
 */
export function CarrouselEtapes({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let minuterie: ReturnType<typeof setInterval> | undefined;
    let attente: ReturnType<typeof setTimeout> | undefined;
    let visible = false;

    const defile = () => el.scrollWidth > el.clientWidth + 4;
    const avancer = () => {
      if (!defile()) return;
      const cartes = Array.from(el.children) as HTMLElement[];
      const pas = cartes[1] ? cartes[1].offsetLeft - cartes[0].offsetLeft : el.clientWidth;
      const fin = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
      el.scrollTo({ left: fin ? 0 : el.scrollLeft + pas, behavior: "smooth" });
    };
    const lancer = () => {
      clearInterval(minuterie);
      if (visible && !document.hidden) minuterie = setInterval(avancer, 4000);
    };
    const arreter = () => {
      clearInterval(minuterie);
      clearTimeout(attente);
    };
    const toucher = () => arreter();
    const lacher = () => {
      clearTimeout(attente);
      attente = setTimeout(lancer, 6000);
    };

    const observateur = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) lancer();
        else arreter();
      },
      { threshold: 0.4 },
    );
    observateur.observe(el);
    const surVisibilite = () => (document.hidden ? arreter() : lancer());
    document.addEventListener("visibilitychange", surVisibilite);
    el.addEventListener("touchstart", toucher, { passive: true });
    el.addEventListener("touchend", lacher, { passive: true });
    el.addEventListener("touchcancel", lacher, { passive: true });

    return () => {
      arreter();
      observateur.disconnect();
      document.removeEventListener("visibilitychange", surVisibilite);
      el.removeEventListener("touchstart", toucher);
      el.removeEventListener("touchend", lacher);
      el.removeEventListener("touchcancel", lacher);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="-mx-5 mt-4 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pt-6 pb-12 [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)] [scrollbar-width:none] sm:mx-0 sm:mt-8 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pt-6 sm:pb-0 sm:[mask-image:none] lg:grid-cols-4 [&::-webkit-scrollbar]:hidden"
    >
      {children}
    </div>
  );
}
