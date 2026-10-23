"use client";

import { useEffect, useRef } from "react";
import { DownloadButton } from "../DownloadButton";

/**
 * Scène 5 : le mur des visages. Tous les portraits sont éteints, presque
 * invisibles dans la nuit. Ils s'allument sous la souris (ou sous le doigt
 * sur téléphone) et s'éteignent doucement derrière, comme une traînée.
 * Quand personne ne touche, quelques visages s'allument d'eux-mêmes.
 *
 * Que de l'opacité et de l'échelle, sur des images déjà rendues.
 */
const TOTAL = 40;
const MOBILE = 30;

function photo(i: number) {
  return `/sphere/visages/${String(((i * 7) % 68) + 1).padStart(3, "0")}.webp`;
}

export function MurVisages() {
  const mur = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mur.current;
    if (!el) return;
    const immobile = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const allumer = (v: Element | null, duree: number) => {
      if (!(v instanceof HTMLElement) || !v.classList.contains("b-visage")) return;
      v.classList.add("on");
      clearTimeout(Number(v.dataset.t));
      v.dataset.t = String(window.setTimeout(() => v.classList.remove("on"), duree));
    };

    // Souris : on allume ce qui est sous le pointeur.
    let dernier = 0;
    const survol = (e: PointerEvent) => {
      if (e.pointerType === "mouse") allumer(document.elementFromPoint(e.clientX, e.clientY), 260);
    };
    // Doigt : le défilement natif garde la main, on lit juste la position.
    const toucher = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) allumer(document.elementFromPoint(t.clientX, t.clientY), 700);
      dernier = performance.now();
    };
    el.addEventListener("pointermove", survol, { passive: true });
    el.addEventListener("pointerover", survol, { passive: true });
    el.addEventListener("touchstart", toucher, { passive: true });
    el.addEventListener("touchmove", toucher, { passive: true });

    // Au repos, des visages s'allument tout seuls, tant que le mur est visible.
    let iv = 0;
    const visages = () => Array.from(el.querySelectorAll<HTMLElement>(".b-visage")).filter((v) => v.offsetParent);
    const observateur = new IntersectionObserver(([e]) => {
      clearInterval(iv);
      if (e.isIntersecting && !immobile) {
        iv = window.setInterval(() => {
          if (performance.now() - dernier < 1500) return;
          const liste = visages();
          allumer(liste[Math.floor(Math.random() * liste.length)], 1100);
        }, 450);
      }
    });
    observateur.observe(el);
    return () => {
      clearInterval(iv);
      observateur.disconnect();
      el.removeEventListener("pointermove", survol);
      el.removeEventListener("pointerover", survol);
      el.removeEventListener("touchstart", toucher);
      el.removeEventListener("touchmove", toucher);
    };
  }, []);

  return (
    <section className="relative px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="display text-[clamp(2.4rem,8vw,5rem)] text-white text-balance">
          Là, quelqu&apos;un <span className="text-vote">pense à toi.</span>
        </p>
        <p className="mt-5 text-[17px] font-medium text-white/55">
          <span className="hidden sm:inline">Passe la souris sur les visages.</span>
          <span className="sm:hidden">Glisse ton doigt sur les visages.</span> Peut-être ton Crush.
        </p>
      </div>

      <div
        ref={mur}
        className="mx-auto mt-14 grid max-w-[1180px] grid-cols-5 gap-2.5 sm:gap-4 lg:grid-cols-10"
      >
        {Array.from({ length: TOTAL }, (_, i) => (
          // eslint-disable-next-line @next/next/no-img-element -- site statique
          <img
            key={i}
            src={photo(i)}
            alt=""
            loading="lazy"
            draggable={false}
            className={`b-visage aspect-square w-full select-none ${i >= MOBILE ? "hidden lg:block" : ""}`}
          />
        ))}
      </div>

      <div className="mx-auto mt-20 flex max-w-3xl flex-col items-center text-center">
        <p className="display text-[clamp(2.2rem,7vw,4.4rem)] text-white text-balance">
          Stan tes potes. <span className="text-vote">Découvre ce qu&apos;ils pensent de toi.</span>
        </p>
        <div className="mt-10">
          <DownloadButton label="Télécharge Stan" />
        </div>
      </div>
    </section>
  );
}
