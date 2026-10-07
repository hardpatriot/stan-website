"use client";

import { useEffect, useRef } from "react";
import { DownloadButton } from "./DownloadButton";
import { PALETTE } from "./palette-sphere";
import { VISAGES } from "./visages";

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



/** Nombre d'éléments affichés, copies comprises. */
const ELEMENTS_MAX = 110;
/** Sur téléphone, on n'en anime qu'une partie. */
const ELEMENTS_MOBILE = 64;

/**
 * Les éléments animés sur téléphone : 64 indices répartis sur les 110, pour
 * que la sélection couvre toute la sphère et pas seulement son sommet.
 */
const SOUS_ENSEMBLE_MOBILE = Array.from({ length: ELEMENTS_MOBILE }, (_, j) =>
  Math.round((j * (ELEMENTS_MAX - 1)) / (ELEMENTS_MOBILE - 1)),
);

/**
 * Ordre de van der Corput : n'importe quel début de liste est déjà bien
 * réparti. Avec 8 visages comme avec 80, ils s'égrènent sur toute la sphère.
 */
function reparti<T>(liste: T[]): T[] {
  const cle = (i: number) => {
    let r = 0;
    let f = 0.5;
    for (let v = i + 1; v > 0; v >>= 1, f /= 2) if (v & 1) r += f;
    return r;
  };
  return liste
    .map((v, i) => ({ v, k: cle(i) }))
    .sort((a, b) => a.k - b.k)
    .map((e) => e.v);
}

/**
 * Le contenu de chaque emplacement : un visage, ou un emoji tant qu'il n'y a
 * pas assez de visages pour remplir la sphère.
 *
 * Les visages prennent d'abord les emplacements animés sur téléphone, pour
 * être tous visibles partout, puis le reste. Chaque visage n'apparaît qu'une
 * fois ; chaque emoji aussi.
 */
type Contenu = { visage: string } | { emoji: string };
const CONTENUS: Contenu[] = (() => {
  const mobile = new Set(SOUS_ENSEMBLE_MOBILE);
  const reste = Array.from({ length: ELEMENTS_MAX }, (_, i) => i).filter(
    (i) => !mobile.has(i),
  );
  const priorite = [...reparti([...mobile]), ...reparti(reste)];
  const contenus: (Contenu | null)[] = Array(ELEMENTS_MAX).fill(null);
  VISAGES.slice(0, ELEMENTS_MAX).forEach((v, j) => {
    contenus[priorite[j]] = { visage: v };
  });
  let e = 0;
  return contenus.map((c) => c ?? { emoji: PALETTE[e++ % PALETTE.length] });
})();

const OR = Math.PI * (3 - Math.sqrt(5)); // angle d'or, 137,5°

/**
 * Taille de mise en page, donc taille MAXIMALE à l'écran.
 * Pilotée en CSS pour rester plus généreuse au bureau sans que le calcul
 * change : l'échelle est un rapport, elle ne dépend pas de cette valeur.
 */
const TAILLE_CSS = "var(--taille-emoji)";
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

/**
 * Déformation au pointeur, au bureau uniquement.
 *
 * Les emojis proches du curseur sont repoussés vers l'extérieur, avec une
 * force qui décroît doucement jusqu'au bord du champ. Chaque emoji rejoint
 * sa position cible avec son propre amortissement, si bien que la sphère se
 * creuse et se referme au lieu de sauter d'un état à l'autre.
 *
 * L'échelle n'est jamais touchée : elle est déjà à la limite du non-flou.
 */
const RAYON_EFFET = 210;
const POUSSEE_MAX = 46;

/**
 * Au doigt, sur téléphone : toucher la sphère y envoie une onde. Les éléments
 * sont chassés autour du point touché, l'onde s'élargit en 0,7 s en
 * s'affaiblissant, puis la sphère se referme d'elle-même. Tant que le doigt
 * reste posé sans faire défiler, la sphère reste creusée sous lui.
 */
const ONDE_DUREE = 700;
const ONDE_RAYON_DEBUT = 90;
const ONDE_RAYON_FIN = 300;
const ONDE_POUSSEE = 105;
const DOIGT_RAYON = 150;
const DOIGT_POUSSEE = 60;
const TAU_DEFORME = 180;

/**
 * Longueur de la section, et part de cette longueur consacrée à la traversée.
 *
 * L'écran reste épinglé pendant (hauteur de section − 1 écran), donc
 * l'avancement va de 0 à 0,6 ici. La traversée se termine à 0,5 : il reste
 * un dixième d'écran avant que le héros ne prenne la suite, juste de quoi
 * ne pas enchaîner brutalement.
 */
const HAUTEUR_SECTION = "125svh";
/**
 * L'écran reste épinglé pendant (hauteur de section − 1 écran), soit 0,40 ici.
 * On règle la fin de traversée sur exactement cette valeur : la sphère finit
 * de se dissoudre au moment précis où l'épinglage lâche, donc il n'y a jamais
 * d'écran épinglé qui ne montre plus rien.
 */
const S_FIN = 0.25;

/** Les indices animés sur cet écran. */
function actifs(): number[] {
  if (typeof window !== "undefined" && window.innerWidth <= 640) {
    return SOUS_ENSEMBLE_MOBILE;
  }
  return Array.from({ length: ELEMENTS_MAX }, (_, i) => i);
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

/**
 * Un emplacement de la sphère : une simple image, rien d'autre.
 *
 * Visages (anneau néon compris) et emojis sont des images déjà détourées,
 * rastérisées à 3 fois leur taille maximale à l'écran : la sphère ne fait que
 * les réduire, jamais les agrandir, donc rien ne floute. Le navigateur n'a ni
 * coins arrondis à découper ni vectoriel à redessiner à chaque image : c'est
 * ce qui rend l'animation fluide sur téléphone.
 */
function Element({ c }: { c: Contenu }) {
  const src =
    "emoji" in c ? `/sphere/emoji/${c.emoji}.webp` : `/sphere/visages/${c.visage}`;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- site statique, image déjà à la bonne taille
    <img
      src={src}
      alt=""
      draggable={false}
      decoding="async"
      loading="lazy"
      className="pointer-events-none block h-full w-full select-none [-webkit-touch-callout:none] [-webkit-user-drag:none]"
    />
  );
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

    const indices = actifs();
    const n = indices.length;
    const base = positions(n);
    const doux = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const large = window.innerWidth > 640;

    // La position de la section ne change pas pendant l'animation : on la lit
    // une fois plutôt que d'interroger la mise en page à chaque image.
    let hautSection = sec.offsetTop;
    const remesurer = () => {
      hautSection = sec.offsetTop;
    };
    window.addEventListener("resize", remesurer, { passive: true });

    // Les éléments hors de la sélection ne servent pas sur cet écran.
    const garde = new Set(indices);
    items.current.forEach((el, i) => {
      if (el) el.style.display = garde.has(i) ? "" : "none";
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

    // Dernières valeurs écrites, pour ne pas répéter une écriture identique.
    const vus = Array.from({ length: n }, () => ({ v: "", z: 0, o: -1 }));
    // Déplacement courant de chaque emoji sous l'effet du pointeur.
    const dx = new Float32Array(n);
    const dy = new Float32Array(n);

    // Position du pointeur dans le repère de la scène, centre à l'origine.
    let px = 0;
    let py = 0;
    let survole = false;
    // Le doigt posé, et la dernière onde lancée.
    let doigt = false;
    let onde = { x: 0, y: 0, t0: -1e9 };

    const versScene = (e: PointerEvent) => {
      const r = sc.getBoundingClientRect();
      return { x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2 };
    };
    const poser = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      const p = versScene(e);
      onde = { x: p.x, y: p.y, t0: performance.now() };
      px = p.x;
      py = p.y;
      doigt = true;
    };
    const glisserDoigt = (e: PointerEvent) => {
      if (e.pointerType === "mouse" || !doigt) return;
      const p = versScene(e);
      px = p.x;
      py = p.y;
    };
    // Le doigt part, ou le navigateur reprend la main pour faire défiler.
    const leverDoigt = () => {
      doigt = false;
    };

    const bouger = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return glisserDoigt(e);
      const r = sc.getBoundingClientRect();
      cibleLacet = ((e.clientX - r.left) / r.width - 0.5) * 2 * AMPL_LACET;
      cibleTangage = ((e.clientY - r.top) / r.height - 0.5) * 2 * AMPL_TANGAGE;
      px = e.clientX - r.left - r.width / 2;
      py = e.clientY - r.top - r.height / 2;
      survole = large;
    };
    const relacher = () => {
      cibleLacet = 0;
      cibleTangage = 0;
      survole = false;
    };

    const boucle = (t: number) => {
      const dt = Math.min(50, Math.max(8, t - precedent));
      precedent = t;

      // Avancement du défilement, compté en hauteurs d'écran.
      const hEcran = window.innerHeight || 1;
      cibleS = Math.min(1.5, Math.max(0, (window.scrollY - hautSection) / hEcran));
      s += (cibleS - s) * lissage(dt, TAU_SCROLL);

      if (!doux) lacetAuto += OMEGA * (dt / 1000);
      const a = lissage(dt, TAU_ROT);
      lacet += (cibleLacet - lacet) * a;
      tangage += (cibleTangage - tangage) * a;

      const sc01 = Math.min(1, s / S_FIN);
      const D = D_DEBUT - (D_DEBUT - D_FIN) * sc01;

      // La parallaxe s'éteint à mesure qu'on entre dans la sphère.
      const attenue = 1 - sc01;
      const ly = lacetAuto + lacet * attenue;
      const lp = INCLINAISON + tangage * attenue;
      const cy = Math.cos(ly), sy = Math.sin(ly);
      const cp = Math.cos(lp), sp = Math.sin(lp);

      const w = sc.clientWidth || window.innerWidth;
      const h = sc.clientHeight || window.innerHeight;
      // La focale est choisie pour que la sphère REMPLISSE la hauteur
      // disponible : son rayon apparent vaut F / D0, on veut donc
      // F ≈ 2 × hauteur pour un rayon d'un peu moins d'une demi-hauteur.
      // Sans ça, les 110 emojis se tassaient en un amas cinq fois trop dense.
      const F = large
        ? Math.min(1.84 * h, 1.54 * w)
        : Math.min(1.95 * h, 1.62 * w);

      for (let i = 0; i < n; i++) {
        const el = items.current[indices[i]];
        if (!el) continue;
        const p = base[i];

        // Rotation : lacet autour de Y, puis tangage autour de X.
        const x1 = p.x * cy + p.z * sy;
        const z1 = -p.x * sy + p.z * cy;
        const y2 = p.y * cp - z1 * sp;
        const z2 = p.y * sp + z1 * cp;

        const den = D - z2;
        // L'échelle ne peut pas franchir 1 : au-delà, l'emoji est retiré.
        const k = den > 0.05 ? (K_REF * D_DEBUT) / den : 2;
        if (k >= 1) {
          if (vus[i].v !== "hidden") {
            el.style.visibility = "hidden";
            vus[i].v = "hidden";
          }
          continue;
        }

        const X = (F * x1) / den;
        const Y = (-F * y2) / den;

        // Répulsion : plus l'emoji est près du curseur, plus il s'écarte.
        let cx = 0;
        let cy2 = 0;
        // L'onde du doigt : un anneau qui s'élargit en s'affaiblissant.
        const age = t - onde.t0;
        if (age < ONDE_DUREE) {
          const p = age / ONDE_DUREE;
          const rayon = ONDE_RAYON_DEBUT + (ONDE_RAYON_FIN - ONDE_RAYON_DEBUT) * p;
          const ex = X - onde.x;
          const ey = Y - onde.y;
          const d = Math.sqrt(ex * ex + ey * ey) || 0.001;
          if (d < rayon) {
            const f = 1 - d / rayon;
            const pousse = (ONDE_POUSSEE * (1 - p) * (1 - p) * f) / d;
            cx += ex * pousse;
            cy2 += ey * pousse;
          }
        }
        // Le doigt posé creuse la sphère sous lui.
        if (doigt) {
          const ex = X - px;
          const ey = Y - py;
          const d2 = ex * ex + ey * ey;
          if (d2 < DOIGT_RAYON * DOIGT_RAYON) {
            const d = Math.sqrt(d2) || 0.001;
            const f = 1 - d / DOIGT_RAYON;
            const pousse = (DOIGT_POUSSEE * f * f) / d;
            cx += ex * pousse;
            cy2 += ey * pousse;
          }
        }
        if (survole) {
          const ex = X - px;
          const ey = Y - py;
          const d2 = ex * ex + ey * ey;
          if (d2 < RAYON_EFFET * RAYON_EFFET) {
            const d = Math.sqrt(d2) || 0.001;
            // Décroissance douce : pleine poussée au contact, nulle au bord.
            const f = 1 - d / RAYON_EFFET;
            const pousse = (POUSSEE_MAX * f * f) / d;
            cx += ex * pousse;
            cy2 += ey * pousse;
          }
        }
        const ad = lissage(dt, TAU_DEFORME);
        dx[i] += (cx - dx[i]) * ad;
        dy[i] += (cy2 - dy[i]) * ad;

        // Fondu de sortie juste avant la limite, plus l'estompe de profondeur.
        const proche = 1 - palier(0.85, 1, k);
        const profondeur = 0.4 + 0.6 * ((z2 + 1) / 2);
        // Fondu vers le bas de l'écran épinglé : quand la sphère s'ouvre, les
        // éléments qui descendent s'effacent au lieu d'être coupés net par le
        // bord, là où la section suivante arrive. Calculé ici, élément par
        // élément : un masque sur toute la sphère coûterait une passe de
        // rendu de plus à chaque image.
        const yEcran = h / 2 + Y + dy[i];
        const sortie = 1 - palier(h * 0.7, h * 0.97, yEcran);

        if (vus[i].v !== "visible") {
          el.style.visibility = "visible";
          vus[i].v = "visible";
        }
        // Le plan de profondeur ne change que par paliers : inutile de
        // réécrire l'empilement à chaque image.
        const z = 1000 + Math.round(z2 * 40);
        if (vus[i].z !== z) {
          el.style.zIndex = String(z);
          vus[i].z = z;
        }
        // L'opacité ne bouge que par petits paliers : on évite d'écrire une
        // valeur que l'œil ne distingue pas de la précédente.
        const o = Math.round(proche * profondeur * sortie * 50) / 50;
        if (vus[i].o !== o) {
          el.style.opacity = String(o);
          vus[i].o = o;
        }
        // `translate: -50% -50%` est posé une fois en CSS : la chaîne écrite
        // ici est d'autant plus courte à analyser, soixante fois par seconde.
        el.style.transform =
          "translate3d(" +
          (((X + dx[i]) * 10) | 0) / 10 +
          "px," +
          (((Y + dy[i]) * 10) | 0) / 10 +
          "px,0) scale(" +
          ((k * 1000) | 0) / 1000 +
          ")";
      }

      const entree = 1 - palier(0.45, 0.95, sc01);
      if (avant.current) avant.current.style.opacity = String(entree);
      if (bouton.current) bouton.current.style.opacity = String(entree);
      raf = requestAnimationFrame(boucle);
    };


    let visible = true;
    const demarrer = () => {
      if (raf) return;
      precedent = performance.now();
      raf = requestAnimationFrame(boucle);
    };
    const arreter = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const observateur = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible && !document.hidden) demarrer();
        else arreter();
      },
      { rootMargin: "10% 0px" },
    );
    observateur.observe(sec);

    // Un onglet en arrière-plan fige de toute façon l'animation ; on évite
    // en plus de relancer une boucle au retour si la section est passée.
    const surVisibilite = () => {
      if (document.hidden || !visible) arreter();
      else demarrer();
    };
    document.addEventListener("visibilitychange", surVisibilite);

    demarrer();
    sc.addEventListener("pointermove", bouger, { passive: true });
    sc.addEventListener("pointerleave", relacher, { passive: true });
    sc.addEventListener("pointerdown", poser, { passive: true });
    sc.addEventListener("pointerup", leverDoigt, { passive: true });
    sc.addEventListener("pointercancel", leverDoigt, { passive: true });

    return () => {
      arreter();
      observateur.disconnect();
      document.removeEventListener("visibilitychange", surVisibilite);
      window.removeEventListener("resize", remesurer);
      sc.removeEventListener("pointermove", bouger);
      sc.removeEventListener("pointerleave", relacher);
      sc.removeEventListener("pointerdown", poser);
      sc.removeEventListener("pointerup", leverDoigt);
      sc.removeEventListener("pointercancel", leverDoigt);
    };
  }, []);

  return (
    <section
      ref={section}
      className="relative"
      style={{ height: HAUTEUR_SECTION }}
    >
      <div
        className="sticky top-0 flex h-[100svh] flex-col overflow-hidden [--taille-emoji:56px] sm:[--taille-emoji:70px]"
      >
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
          <p className="mx-auto mt-5 max-w-[50rem] text-[clamp(0.95rem,2.2vw,1.1rem)] leading-relaxed font-medium text-white/55 text-balance">
            Des questions sur tes potes, vos délires, vos crushs. Tu choisis
            qui te vient en tête. Eux aussi te choisissent, mais leur nom est
            masqué. Un pote qui joue le jeu… ou ton crush qui tente un
            truc&nbsp;?
            <span className="mt-2 block font-semibold text-white/80">
              Là, tu veux savoir qui c&apos;est&nbsp;!
            </span>
          </p>
        </div>

        {/* La sphère occupe tout l'espace restant : son centre se place donc
            naturellement sous le texte, quelle que soit la hauteur d'écran. */}
        <div
          ref={scene}
          className="relative flex-1 select-none [-webkit-touch-callout:none] [-webkit-tap-highlight-color:transparent]"
        >
          {Array.from({ length: ELEMENTS_MAX }, (_, i) => (
            <span
              key={i}
              ref={(el) => {
                items.current[i] = el;
              }}
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-1/2 origin-center [contain:layout_style_paint] [translate:-50%_-50%]"
              style={{ width: TAILLE_CSS, height: TAILLE_CSS, opacity: 0 }}
            >
              <Element c={CONTENUS[i]} />
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
              <DownloadButton label="Télécharge Stan" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
