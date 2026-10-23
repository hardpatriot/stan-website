"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { DownloadButton } from "../DownloadButton";

/**
 * Scène 1 : l'écran verrouillé. La page s'ouvre sur ce que l'élève voit
 * vraiment : l'heure, puis les notifications de Stan qui tombent une à une,
 * avec le texte exact des pushs de vote du serveur.
 */
const NOTIFS = [
  { quand: "maintenant", corps: "Elle a pensé à toi… viens voir" },
  { quand: "il y a 2 min", corps: "Il a pensé à toi… viens voir" },
  { quand: "il y a 9 min", corps: "Elle a pensé à toi… viens voir" },
];

function heureLocale() {
  const d = new Date();
  return {
    heure: d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    jour: d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }),
  };
}

export function EcranVerrouille() {
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
    <section className="relative flex min-h-[100svh] flex-col items-center overflow-hidden px-5 pt-24 pb-16 sm:pt-28">
      {/* L'heure, comme un écran verrouillé */}
      <p className="b-rise text-center text-[15px] font-semibold tracking-wide text-white/55 capitalize">
        {t.jour}
      </p>
      <p
        className="b-rise mt-1 text-center text-[clamp(5.2rem,22vw,9.5rem)] leading-none font-light tracking-[-0.04em] text-white/90 tabular-nums"
        style={{ animationDelay: "80ms" }}
      >
        {t.heure}
      </p>

      {/* Les notifications, empilées comme dans le centre de notifications */}
      <div className="relative mt-10 flex w-full max-w-[420px] flex-col gap-2.5">
        {NOTIFS.map((n, i) => (
          <div
            key={i}
            className="b-notif flex items-start gap-3 rounded-[22px] px-3.5 py-3"
            style={{ animationDelay: `${700 + i * 900}ms`, zIndex: 10 - i }}
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

      <div className="b-rise mt-14 flex flex-col items-center text-center" style={{ animationDelay: "3300ms" }}>
        <h1 className="display text-[clamp(2.4rem,9vw,4.6rem)] text-white">
          <span className="block">Ils ont voté.</span>
          <span className="text-vote block">Tu vas savoir.</span>
        </h1>
        <div className="mt-8">
          <DownloadButton label="Télécharge Stan" />
        </div>
      </div>

      <span
        aria-hidden
        className="b-indice absolute bottom-6 left-1/2 h-9 w-[22px] -translate-x-1/2 rounded-full border border-white/25"
      />
    </section>
  );
}
