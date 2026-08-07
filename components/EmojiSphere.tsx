"use client";

import { useEffect, useRef } from "react";
import { AppStoreButton } from "./AppStoreButton";
import { Emoji } from "./EmojiSprite";

/*
 * La sphère de questions.
 *
 * On la traverse au défilement : la caméra part de 4,5 rayons et descend à
 * 0,8, donc elle franchit la coque. Les emojis sont épluchés de l'avant vers
 * l'arrière pendant l'approche, si bien que la sphère s'ouvre et se dissout
 * autour du lecteur au lieu de lui jeter des pictogrammes au visage.
 *
 * RÈGLE ABSOLUE, dont découle tout le reste : un élément n'est JAMAIS agrandi
 * au-delà de sa taille de mise en page. Le navigateur ne rastérise le
 * vectoriel qu'une fois, à une échelle qu'il choisit ; au-delà de 1 il
 * agrandit ce raster, et le flou revient. La taille posée dans la page est
 * donc la taille MAXIMALE, et l'animation ne fait que réduire. Un emoji qui
 * atteindrait l'échelle 1 est retiré avant d'y arriver.
 *
 * Corollaire : pas de `perspective` ni de `preserve-3d` CSS, qui délèguent
 * l'échelle de rastérisation au navigateur sans qu'on puisse la vérifier. La
 * projection est calculée ici et sortie en transformation 2D.
 */

/**
 * La palette de la sphère.
 *
 * Chaque emoji n'est défini qu'une fois dans le document ; les copies à
 * l'écran ne coûtent que quelques octets. C'est donc la VARIÉTÉ qui pèse, pas
 * le nombre d'éléments — d'où une palette resserrée et beaucoup de copies.
 * Dans une sphère qui tourne, deux exemplaires du même emoji à des
 * profondeurs différentes ne se remarquent pas.
 */
const PALETTE = [
  "man_zombie", "squid", "desert_island", "popcorn", "clown_face", "nerd_face",
  "flashlight", "money_bag", "folded_hands", "robot", "alarm_clock", "school",
  "handshake", "red_question_mark", "bell", "fire", "hourglass_not_done",
  "flushed_face", "face_with_tears_of_joy", "eyes", "speaking_head",
  "partying_face", "star", "sun", "trophy", "heart_hands", "sparkles", "skull",
  "battery", "speech_balloon", "microphone", "smiling_face_with_sunglasses",
  "flexed_biceps", "high_voltage", "ghost", "grinning_face_with_smiling_eyes",
  "skateboard", "sleeping_face", "zany_face", "warning", "loudspeaker",
  "grinning_face", "smirking_face", "baguette_bread",
];

/** Nombre d'éléments affichés, copies comprises. */
const ELEMENTS_MAX = 110;

const OR = Math.PI * (3 - Math.sqrt(5)); // angle d'or, 137,5°

/** Taille de mise en page, donc taille MAXIMALE à l'écran. */
const TAILLE = 76;
/** Échelle de référence : garde l'échelle réelle bien en dessous de 1. */
const K_REF = 0.52;

const D_DEBUT = 4.5;
const D_FIN = 0.8;

const OMEGA = (6 * Math.PI) / 180; // 6°/s, un tour par minute
const INCLINAISON = (-6 * Math.PI) / 180;
const AMPL_LACET = (18 * Math.PI) / 180;
const AMPL_TANGAGE = (12 * Math.PI) / 180;

const TAU_ROT = 140;
const TAU_SCROLL = 120;

function combien(): number {
  if (typeof window === "undefined") return ELEMENTS_MAX;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 40;
  return window.innerWidth <= 640 ? 64 : ELEMENTS_MAX;
}

/** Répartition en spirale de Fibonacci : la seule qui espace régulièrement. */
function positions(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const y = 1 - (2 * (i + 0.5)) / n;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const t = i * OR;
    return { x: r * Math.cos(t), y, z: r * Math.sin(t) };
  });
}

function lissage(dt: number, tau: number) {
  return 1 - Math.exp(-dt / tau);
}

function palier(bord0: number, bord1: number, v: number) {
  const t = Math.min(1, Math.max(0, (v - bord0) / (bord1 - bord0)));
  return t * t * (3 - 2 * t);
}

export function EmojiSphere() {
  const section = useRef<HTMLElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const avant = useRef<HTMLDivElement>(null);
  const bouton = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const sec = section.current;
    const sc = scene.current;
    if (!sec || !sc) return;

    const n = combien();
    const base = positions(n);
    const doux = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Les éléments au-delà du compte retenu ne servent pas sur cet écran.
    items.current.forEach((el, i) => {
      if (el) el.style.display = i < n ? "" : "none";
    });

    let lacetAuto = 0;
    let lacet = 0;
    let tangage = 0;
    let cibleLacet = 0;
    let cibleTangage = 0;
    let s = 0;
    let cibleS = 0;
    let precedent = performance.now();
    let raf = 0;

    const bouger = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = sc.getBoundingClientRect();
      cibleLacet = ((e.clientX - r.left) / r.width - 0.5) * 2 * AMPL_LACET;
      cibleTangage = ((e.clientY - r.top) / r.height - 0.5) * 2 * AMPL_TANGAGE;
    };
    const relacher = () => {
      cibleLacet = 0;
      cibleTangage = 0;
    };

    const boucle = (t: number) => {
      const dt = Math.min(50, Math.max(8, t - precedent));
      precedent = t;

      // Avancement du défilement, compté en hauteurs d'écran.
      const hEcran = window.innerHeight || 1;
      const r = sec.getBoundingClientRect();
      cibleS = Math.min(2.2, Math.max(0, -r.top / hEcran));
      s += (cibleS - s) * lissage(dt, TAU_SCROLL);

      if (!doux) lacetAuto += OMEGA * (dt / 1000);
      const a = lissage(dt, TAU_ROT);
      lacet += (cibleLacet - lacet) * a;
      tangage += (cibleTangage - tangage) * a;

      const sc01 = Math.min(1, s);
      const D = D_DEBUT - (D_DEBUT - D_FIN) * sc01;

      // La parallaxe s'éteint à mesure qu'on entre dans la sphère.
      const attenue = 1 - sc01;
      const ly = lacetAuto + lacet * attenue;
      const lp = INCLINAISON + tangage * attenue;
      const cy = Math.cos(ly), sy = Math.sin(ly);
      const cp = Math.cos(lp), sp = Math.sin(lp);

      const w = sc.clientWidth || window.innerWidth;
      const h = sc.clientHeight || window.innerHeight;
      const F = Math.min(1.0723 * h, 1.84 * w);

      for (let i = 0; i < n; i++) {
        const el = items.current[i];
        if (!el) continue;
        const p = base[i];

        // Rotation : lacet autour de Y, puis tangage autour de X.
        const x1 = p.x * cy + p.z * sy;
        const z1 = -p.x * sy + p.z * cy;
        const y2 = p.y * cp - z1 * sp;
        const z2 = p.y * sp + z1 * cp;

        const den = D - z2;
        if (den <= 0.05) {
          el.style.visibility = "hidden";
          continue;
        }

        // L'échelle ne peut pas franchir 1 : au-delà, l'emoji est retiré.
        const k = (K_REF * D_DEBUT) / den;
        if (k >= 1) {
          el.style.visibility = "hidden";
          continue;
        }

        const X = (F * x1) / den;
        const Y = (-F * y2) / den;

        // Fondu de sortie juste avant la limite, plus l'estompe de profondeur.
        const proche = 1 - palier(0.85, 1, k);
        const profondeur = 0.4 + 0.6 * ((z2 + 1) / 2);
        const sortie = 1 - palier(1.6, 2, s);

        el.style.visibility = "visible";
        el.style.opacity = String(proche * profondeur * sortie);
        el.style.transform = `translate3d(${X.toFixed(1)}px, ${Y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${k.toFixed(4)})`;
        el.style.zIndex = String(1000 + Math.round(z2 * 500));
      }

      const entree = 1 - palier(0.05, 0.45, s);
      if (avant.current) avant.current.style.opacity = String(entree);
      if (bouton.current) bouton.current.style.opacity = String(entree);
      raf = requestAnimationFrame(boucle);
    };

    raf = requestAnimationFrame(boucle);
    sc.addEventListener("pointermove", bouger, { passive: true });
    sc.addEventListener("pointerleave", relacher, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      sc.removeEventListener("pointermove", bouger);
      sc.removeEventListener("pointerleave", relacher);
    };
  }, []);

  return (
    <section ref={section} className="relative h-[220svh]">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        {/* L'accroche, au-dessus de la sphère */}
        <div
          ref={avant}
          className="relative z-[3000] shrink-0 px-5 pt-20 text-center sm:pt-24"
        >
          {/* Deux lignes imposées : sans ça, l'équilibrage automatique
              regroupe tout sur une seule ligne dès que l'écran est large. */}
          <h1 className="display mx-auto max-w-3xl text-[clamp(2.2rem,7vw,4.4rem)] text-white">
            <span className="block">Ils ont voté.</span>
            <span className="text-vote block">Tu vas savoir.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[clamp(0.95rem,2.2vw,1.15rem)] leading-relaxed font-medium text-white/55 text-balance">
            Si tes potes pouvaient dire ce qu&apos;ils pensent de toi en
            anonyme, ils diraient quoi&nbsp;? Tu croyais tout savoir.
            C&apos;est le moment de vérifier.
          </p>
        </div>

        {/* La sphère occupe tout l'espace restant : son centre se place donc
            naturellement sous le texte, quelle que soit la hauteur d'écran. */}
        <div ref={scene} className="relative flex-1">
          {Array.from({ length: ELEMENTS_MAX }, (_, i) => (
            <span
              key={i}
              ref={(el) => {
                items.current[i] = el;
              }}
              aria-hidden
              className="absolute top-1/2 left-1/2 origin-center will-change-transform"
              style={{ width: TAILLE, height: TAILLE, opacity: 0 }}
            >
              <Emoji
                name={PALETTE[i % PALETTE.length]}
                className="h-full w-full"
              />
            </span>
          ))}

          {/* Le bouton, au cœur de la sphère.
              `pointer-events-none` sur le bloc et réactivé sur le seul bouton :
              sans ça, le centre deviendrait un trou mort et la sphère
              cesserait de répondre au survol là où on la regarde. */}
          <div
            ref={bouton}
            className="pointer-events-none absolute inset-0 z-[3000] flex items-center justify-center"
          >
            <div className="pointer-events-auto">
              <AppStoreButton label="Télécharger l'app" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
