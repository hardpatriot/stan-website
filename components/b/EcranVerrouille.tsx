"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Scène 1 : l'écran verrouillé. La page s'ouvre sur ce que l'élève voit
 * vraiment : l'heure, puis les notifications de Stan qui tombent une à une,
 * avec le texte exact des pushs de vote du serveur.
 */
const NOTIFS = [
  { quand: "maintenant", corps: "Elle a pensé à toi… viens voir" },
  { quand: "il y a 2 min", corps: "Il a pensé à toi… viens voir" },
  { quand: "il y a 9 min", corps: "Elle a pensé à toi… viens voir" },
  { quand: "il y a 17 min", corps: "Quelqu'un a pensé à toi… viens voir" },
  { quand: "il y a 34 min", corps: "Il a pensé à toi… viens voir" },
];

function heureLocale() {
  const d = new Date();
  return {
    heure: d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    jour: d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }),
  };
}

export function EcranVerrouille() {
  // Rien ne bouge tant que le haut de la pile n'est pas bien entré dans
  // l'écran (au quart inférieur) : l'heure apparaît, puis les notifications
  // descendent une à une, en douceur, et restent. Une seule fois.
  // Une classe posée par carte : l'animation est en CSS, sur la
  // transformation et l'opacité.
  const notifs = useRef<(HTMLDivElement | null)[]>([]);
  const heure = useRef<HTMLDivElement>(null);
  const pile = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = pile.current;
    // Moins d'animations demandées : tout est affiché d'emblée (en CSS).
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const minuteurs: ReturnType<typeof setTimeout>[] = [];
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        heure.current?.classList.add("b-pop");
        notifs.current.forEach((n, i) => {
          if (n) minuteurs.push(setTimeout(() => n.classList.add("b-pop"), 250 + i * 420));
        });
      },
      { rootMargin: "0px 0px -25% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      minuteurs.forEach(clearTimeout);
    };
  }, []);

  // L'heure du visiteur, posée après le premier rendu (la page est statique).
  const [t, setT] = useState({ heure: "21:47", jour: "jeudi 23 octobre" });
  useEffect(() => {
    const maj = () => setT(heureLocale());
    const id = setTimeout(maj, 0);
    const iv = setInterval(maj, 20_000);
    return () => {
      clearTimeout(id);
      clearInterval(iv);
    };
  }, []);

  return (
    <section className="relative">
      <div className="flex min-h-[100svh] flex-col items-center justify-center px-5 py-16">
      {/* L'heure, comme un écran verrouillé */}
      <div ref={heure} className="b-attend flex flex-col items-center">
        <p className="text-center text-[15px] font-semibold tracking-wide text-white/55 capitalize">{t.jour}</p>
        <p className="mt-1 text-center text-[clamp(4.6rem,20vw,8.5rem)] leading-none font-light tracking-[-0.04em] text-white/90 tabular-nums">
          {t.heure}
        </p>
      </div>

      {/* Les notifications, empilées comme dans le centre de notifications */}
      <div ref={pile} className="relative mt-7 flex w-full max-w-[420px] flex-col gap-2.5">
        {NOTIFS.map((n, i) => (
          <div
            key={i}
            ref={(el) => {
              notifs.current[i] = el;
            }}
            className="b-notif b-attend flex items-start gap-3 rounded-[22px] px-3.5 py-3"
            style={{ zIndex: 20 - i }}
          >
            <Image
              src="/cap-180.png"
              alt=""
              width={38}
              height={38}
              className="mt-0.5 h-[38px] w-[38px] shrink-0 rounded-[9px]"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-[12px] font-semibold tracking-wide text-white/45 uppercase">Stan</p>
                <span className="shrink-0 text-[12px] text-white/45">{n.quand}</span>
              </div>
              <p className="mt-0.5 text-[15px] leading-snug font-bold text-white">
                👀 Quelqu&apos;un vient de voter pour toi
              </p>
              <p className="mt-0.5 text-[15px] text-white/75">{n.corps}</p>
            </div>
          </div>
        ))}
      </div>

      </div>
    </section>
  );
}
