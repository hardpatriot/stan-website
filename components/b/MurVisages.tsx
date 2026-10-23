"use client";

import { useEffect, useRef } from "react";
import { DownloadButton } from "../DownloadButton";

/**
 * Scène 5 : les visages cachés dans la nuit.
 *
 * Les portraits de la sphère sont semés sur tout l'écran, presque invisibles.
 * Le curseur les allume autour de lui et les écarte, avec la même répulsion
 * que la sphère ; un clic (ou un tap) lance l'onde de la sphère, un anneau qui
 * s'élargit en repoussant et en allumant tout sur son passage. Sur téléphone,
 * le doigt fait la même chose, et un pointeur fantôme se promène doucement
 * quand personne ne touche. Le texte reste au centre, comme avant.
 *
 * Que des translations, échelles et opacités, sur des images déjà rendues.
 */
const NB = 46;
const BASE = 0.035;
const RAYON = 280;
const POUSSEE = 46;
// L'onde du tap, reprise de EmojiSphere.
const ONDE_DUREE = 700;
const ONDE_RAYON_DEBUT = 90;
const ONDE_RAYON_FIN = 340;
const ONDE_POUSSEE = 105;

/** Pseudo-hasard stable : le mur est le même à chaque visite. */
function hasard(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** Une grille 8 × 6 secouée : couvre tout l'écran sans paquets ni trous. */
const SEMIS = Array.from({ length: NB }, (_, i) => {
  const col = i % 8;
  const lig = Math.floor(i / 8);
  return {
    x: (col + 0.5 + (hasard(i) - 0.5) * 0.7) / 8,
    y: (lig + 0.5 + (hasard(i + 99) - 0.5) * 0.7) / 6,
    taille: 0.82 + hasard(i + 7) * 0.36,
    photo: `/sphere/visages/${String(((i * 7) % 68) + 1).padStart(3, "0")}.webp`,
  };
});

export function MurVisages() {
  const scene = useRef<HTMLElement>(null);
  const visages = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    const el = scene.current;
    if (!el) return;
    const immobile = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tactile = window.matchMedia("(hover: none)").matches;
    const etat = SEMIS.map(() => ({ dx: 0, dy: 0, o: BASE, s: 1 }));
    // Le pointeur en coordonnées d'écran : la scène bouge sous un curseur
    // immobile pendant le défilement, et les visages s'allument quand même.
    const ptr = { x: -9999, y: -9999, actif: false, t: 0 };
    const onde = { x: 0, y: 0, t0: -1e9 };

    const bouger = (x: number, y: number) => {
      ptr.x = x;
      ptr.y = y;
      ptr.actif = true;
      ptr.t = performance.now();
    };
    const surSouris = (e: PointerEvent) => bouger(e.clientX, e.clientY);
    const sortie = () => {
      ptr.actif = false;
    };
    const toucher = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) bouger(t.clientX, t.clientY);
    };
    const taper = (e: PointerEvent) => {
      onde.x = e.clientX;
      onde.y = e.clientY;
      onde.t0 = performance.now();
      bouger(e.clientX, e.clientY);
    };
    window.addEventListener("pointermove", surSouris, { passive: true });
    document.addEventListener("pointerleave", sortie);
    el.addEventListener("pointerdown", taper, { passive: true });
    el.addEventListener("touchmove", toucher, { passive: true });
    el.addEventListener("touchstart", toucher, { passive: true });

    let raf = 0;
    const image = (t: number) => {
      const r = el.getBoundingClientRect();
      let px = ptr.x;
      let py = ptr.y;
      let actif = ptr.actif && (!tactile || t - ptr.t < 1200);
      // Personne ne touche sur téléphone : un pointeur fantôme se promène.
      if (!actif && tactile && !immobile) {
        px = r.left + r.width * (0.5 + 0.36 * Math.sin(t / 2300));
        py = r.top + r.height * (0.5 + 0.3 * Math.sin(t / 1700 + 1));
        actif = true;
      }
      const age = t - onde.t0;
      SEMIS.forEach((v, i) => {
        const img = visages.current[i];
        if (!img) return;
        const X = r.left + v.x * r.width;
        const Y = r.top + v.y * r.height;
        let cx = 0;
        let cy = 0;
        let lum = 0;
        if (actif) {
          const ex = X - px;
          const ey = Y - py;
          const d = Math.hypot(ex, ey) || 0.001;
          if (d < RAYON) {
            const f = 1 - d / RAYON;
            lum = f * f * (3 - 2 * f);
            const pousse = (POUSSEE * f * f) / d;
            cx += ex * pousse;
            cy += ey * pousse;
          }
        }
        if (age < ONDE_DUREE) {
          const p = age / ONDE_DUREE;
          const rayon = ONDE_RAYON_DEBUT + (ONDE_RAYON_FIN - ONDE_RAYON_DEBUT) * p;
          const ex = X - onde.x;
          const ey = Y - onde.y;
          const d = Math.hypot(ex, ey) || 0.001;
          if (d < rayon) {
            const f = 1 - d / rayon;
            const pousse = (ONDE_POUSSEE * (1 - p) * (1 - p) * f) / d;
            cx += ex * pousse;
            cy += ey * pousse;
            lum = Math.max(lum, f * (1 - p));
          }
        }
        const e = etat[i];
        // Arrivée rapide, retour lent : une traînée derrière le curseur.
        const k = lum > e.o ? 0.3 : 0.05;
        e.o += (BASE + (1 - BASE) * lum - e.o) * k;
        e.dx += (cx - e.dx) * 0.16;
        e.dy += (cy - e.dy) * 0.16;
        e.s += (0.94 + 0.12 * lum - e.s) * 0.16;
        img.style.opacity = e.o.toFixed(3);
        img.style.transform = `translate3d(${e.dx.toFixed(1)}px, ${e.dy.toFixed(1)}px, 0) scale(${(v.taille * e.s).toFixed(3)})`;
      });
      raf = requestAnimationFrame(image);
    };
    const observateur = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting) raf = requestAnimationFrame(image);
    });
    observateur.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      observateur.disconnect();
      window.removeEventListener("pointermove", surSouris);
      document.removeEventListener("pointerleave", sortie);
      el.removeEventListener("pointerdown", taper);
      el.removeEventListener("touchmove", toucher);
      el.removeEventListener("touchstart", toucher);
    };
  }, []);

  return (
    <section ref={scene} className="relative h-[100svh] min-h-[640px] overflow-hidden select-none">
      {SEMIS.map((v, i) => (
        // eslint-disable-next-line @next/next/no-img-element -- site statique
        <img
          key={i}
          ref={(el) => {
            visages.current[i] = el;
          }}
          src={v.photo}
          alt=""
          draggable={false}
          loading="lazy"
          className="absolute -mt-[clamp(32px,3.7vw,56px)] -ml-[clamp(32px,3.7vw,56px)] h-[clamp(64px,7.4vw,112px)] w-[clamp(64px,7.4vw,112px)]"
          style={{ left: `${v.x * 100}%`, top: `${v.y * 100}%`, opacity: BASE, transform: `scale(${v.taille})` }}
        />
      ))}

      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
        <h2 className="display max-w-[14ch] text-[clamp(2.4rem,7vw,4.6rem)] text-white text-balance">
          Stan tes potes. <span className="text-vote">Découvre ce qu&apos;ils pensent de toi.</span>
        </h2>
        <p className="mt-6 max-w-lg text-[17px] leading-relaxed font-medium text-white/60 [text-shadow:0_2px_14px_rgba(11,8,24,0.9)]">
          Là, quelqu&apos;un pense à toi. Peut-être ton Crush.
        </p>
        <div className="pointer-events-auto mt-10">
          <DownloadButton label="Télécharge Stan" />
        </div>
      </div>
    </section>
  );
}
