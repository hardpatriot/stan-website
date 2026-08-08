"use client";

import { useEffect, useRef } from "react";
import { Emoji } from "./EmojiSprite";
import { Reveal } from "./Reveal";

/*
 * Le bandeau des questions.
 *
 * Il défile par SCROLL natif, pas par `transform`. Une bande translatée de
 * 3 000 px devient une seule texture GPU : sur un écran 3x il en faudrait
 * 9 000 px de large, au-delà de ce que le matériel accepte, donc le navigateur
 * réduit la résolution et tout le contenu ressort flou, emojis compris.
 * Avec un scroll, il redessine seulement ce qui est visible, à pleine
 * résolution. Bonus : on peut le faire défiler au doigt.
 */

const ROW_A = [
  { emoji: "man_zombie", text: "Qui survivrait dans un film d'horreur ?" },
  { emoji: "squid", text: "Qui survit à Squid Game ?" },
  { emoji: "desert_island", text: "Avec qui t'aimerais être perdu sur une île déserte ?" },
  { emoji: "popcorn", text: "Qui mérite une série Netflix inspirée de sa vie ?" },
  { emoji: "clown_face", text: "Qui fait toujours les meilleures pranks ?" },
  { emoji: "nerd_face", text: "Qui dort en cours mais a 18/20 easy ?" },
];

const ROW_B = [
  { emoji: "flashlight", text: "Qui aimerait être téléporté avec toi dans Stranger Things ?" },
  { emoji: "money_bag", text: "Qui survit une semaine avec 3 € et des pâtes ?" },
  { emoji: "folded_hands", text: "Qui dit « merci » à l'IA au cas où elle prendrait le pouvoir un jour ?" },
  { emoji: "robot", text: "Qui sort toujours « non mais c'est plus rapide par là » ?" },
  { emoji: "alarm_clock", text: "Qui se lève 12 min avant les cours et arrive nickel" },
  { emoji: "speaking_head", text: "Qui a toujours le meilleur comeback" },
];

type Item = { emoji: string; text: string };

function Row({ items, vitesse }: { items: Item[]; vitesse: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const doubled = [...items, ...items];

  // Défilement automatique, interrompu dès que le pointeur se pose dessus.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let dernier = 0;
    let enPause = false;
    let visible = true;
    // On tient la position en nombre à virgule de notre côté : à 26 px par
    // seconde, un pas vaut 0,4 px, et `scrollLeft` arrondit à la lecture.
    // En le relisant à chaque image, on perdait le pas et le bandeau restait
    // immobile.
    let position = 0;

    const avancer = (t: number) => {
      if (!dernier) dernier = t;
      const dt = Math.min(50, t - dernier);
      dernier = t;

      if (!enPause) {
        position += (vitesse * dt) / 1000;
        // La liste est doublée : à mi-course on revient au début, sans que
        // le raccord se voie.
        const moitie = el.scrollWidth / 2;
        if (moitie > 0 && position >= moitie) position -= moitie;
        el.scrollLeft = position;
      }
      raf = requestAnimationFrame(avancer);
    };

    const demarrer = () => {
      if (raf || !visible || document.hidden) return;
      dernier = 0;
      raf = requestAnimationFrame(avancer);
    };
    const arreter = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const pause = () => {
      enPause = true;
    };
    const reprise = () => {
      enPause = false;
      // L'utilisateur a pu faire défiler à la main : on repart d'où il a
      // laissé le bandeau, sans saut.
      position = el.scrollLeft;
    };

    // Inutile de faire tourner une boucle pour un bandeau hors de l'écran.
    const observateur = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) demarrer();
        else arreter();
      },
      { rootMargin: "20% 0px" },
    );
    observateur.observe(el);

    const surVisibilite = () => (document.hidden ? arreter() : demarrer());
    document.addEventListener("visibilitychange", surVisibilite);

    el.addEventListener("pointerenter", pause);
    el.addEventListener("pointerleave", reprise);
    el.addEventListener("pointerdown", pause);
    el.addEventListener("pointerup", reprise);
    el.addEventListener("pointercancel", reprise);

    demarrer();

    return () => {
      arreter();
      observateur.disconnect();
      document.removeEventListener("visibilitychange", surVisibilite);
      el.removeEventListener("pointerenter", pause);
      el.removeEventListener("pointerleave", reprise);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("pointerup", reprise);
      el.removeEventListener("pointercancel", reprise);
    };
  }, [vitesse]);

  return (
    <div
      ref={ref}
      className="flex gap-3.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{ overscrollBehaviorX: "contain" }}
    >
      {doubled.map((item, i) => (
        <span
          key={`${item.text}-${i}`}
          className="pill flex shrink-0 items-center gap-2.5 rounded-full py-2.5 pr-5 pl-3 text-[15px] font-bold whitespace-nowrap text-white/75"
        >
          <Emoji name={item.emoji} className="h-[26px] w-[26px] shrink-0" />
          {item.text}
        </span>
      ))}
    </div>
  );
}

export function QuestionMarquee() {
  return (
    <section className="relative overflow-hidden py-10 sm:py-16">
      <Reveal className="px-5 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-sm font-black tracking-[0.18em] text-lavender uppercase">
            Les questions
          </p>
        </div>
      </Reveal>

      <div className="relative mt-7 flex flex-col gap-3.5">
        <Row items={ROW_A} vitesse={26} />
        <Row items={ROW_B} vitesse={19} />

        {/* Fondu sur les bords */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-night-950 to-transparent sm:w-40"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-night-950 to-transparent sm:w-40"
        />
      </div>
    </section>
  );
}
