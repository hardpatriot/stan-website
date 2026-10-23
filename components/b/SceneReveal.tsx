"use client";

import { useRef } from "react";
import { phase, useScene } from "./useScene";

/**
 * Scène 4 : le reveal, comme dans l'app.
 *
 * D'abord l'onglet Votes : les lignes de verre au liseré néon
 * (VotesNotificationGlassCard, rose → violet → bleu → cyan), icône Stan,
 * « Il a voté pour toi », l'heure à droite. La première ligne s'enfonce, puis
 * l'écran du vote s'ouvre : dégradé rose de BackgroundViewStyle.poll, avatar
 * flouté, la question, les quatre cartes avec la tienne entourée d'or et la
 * main, et en bas le bouton chrome « 🔒 Découvre qui a voté pour toi ».
 * Au bout du défilement, l'avatar flouté laisse place au visage.
 */
const W = 393;
const H = 852;

const LIGNES = [
  { icone: "/notif-boy.webp", texte: "Il a voté pour toi", quand: "À l'instant" },
  { icone: "/notif-girl.webp", texte: "Elle a voté pour toi", quand: "12min" },
  { icone: "/notif-girl.webp", texte: "Elle a voté pour toi", quand: "2h" },
  { icone: "/notif-boy.webp", texte: "Il a voté pour toi", quand: "5h" },
  { icone: "/notif-boy.webp", texte: "Iel a voté pour toi", quand: "1j" },
];

const CHOIX = [
  { nom: ["Lana", "Chung"], photo: "/visages/001.webp" },
  { nom: ["Inès", "Morel"], photo: "/visages/007.webp", toi: true },
  { nom: ["Léa", "Sacla"], photo: "/visages/005.webp" },
  { nom: ["Noha", "Kanté"], photo: "/visages/004.webp" },
];

const LEGENDES = [
  { a: 0, b: 0.4, haut: "Quelqu'un", bas: "a voté pour toi." },
  { a: 0.4, b: 0.76, haut: "Sur quelle question,", bas: "tu le sais déjà." },
  { a: 0.76, b: 1.01, haut: "Qui,", bas: "c'est à toi de le découvrir." },
];

/** Le liseré néon des lignes de vote, en bordure dégradée. */
const NEON = {
  background:
    "linear-gradient(135deg, rgba(64,61,105,0.68), rgba(38,33,74,0.58) 48%, rgba(14,15,41,0.72)) padding-box, linear-gradient(90deg, rgba(255,36,128,0.13), rgba(145,64,255,0.07) 42%, rgba(61,110,255,0.07) 72%, rgba(13,214,255,0.12)) padding-box, linear-gradient(#181231, #181231) padding-box, linear-gradient(90deg, rgba(255,36,128,0.92), rgba(145,64,255,0.8) 38%, rgba(61,110,255,0.76) 72%, rgba(13,214,255,0.92)) border-box",
  border: "1.1px solid transparent",
  boxShadow: "-1px 2px 10px rgba(255,36,128,0.12), 2px 0 8px rgba(13,214,255,0.08), 0 6px 20px rgba(0,0,0,0.3)",
};

export function SceneReveal() {
  const tel = useRef<HTMLDivElement>(null);
  const inbox = useRef<HTMLDivElement>(null);
  const premiere = useRef<HTMLDivElement>(null);
  const detail = useRef<HTMLDivElement>(null);
  const floute = useRef<HTMLImageElement>(null);
  const visage = useRef<HTMLImageElement>(null);
  const titreFlou = useRef<HTMLParagraphElement>(null);
  const titreNom = useRef<HTMLParagraphElement>(null);
  const bouton = useRef<HTMLDivElement>(null);
  const legendes = useRef<(HTMLDivElement | null)[]>([]);

  const ref = useScene<HTMLElement>((p) => {
    const t = tel.current;
    if (!t) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const large = vw >= 900;
    const k = Math.min(1, (vh * (large ? 0.76 : 0.66)) / H, (vw * (large ? 0.42 : 0.86)) / W);
    const entree = phase(p, 0, 0.14);
    t.style.transform = `translate3d(-50%, ${(1 - entree) * 9}vh, 0) scale(${(k * (0.88 + 0.12 * entree)).toFixed(4)})`;
    t.style.opacity = String(0.3 + 0.7 * entree);

    // La première ligne s'enfonce sous le doigt, puis l'écran du vote s'ouvre.
    const appui = phase(p, 0.26, 0.31) - phase(p, 0.31, 0.36);
    if (premiere.current) premiere.current.style.transform = `scale(${(1 - 0.05 * appui).toFixed(4)})`;
    const ouvre = phase(p, 0.33, 0.46);
    if (inbox.current) {
      inbox.current.style.opacity = String(1 - ouvre);
      inbox.current.style.transform = `scale(${(1 - 0.06 * ouvre).toFixed(4)})`;
    }
    if (detail.current) {
      detail.current.style.opacity = String(ouvre);
      detail.current.style.transform = `translate3d(0, ${((1 - ouvre) * 8).toFixed(2)}%, 0)`;
    }

    // Le bouton chrome respire, puis le visage remplace l'avatar flouté.
    const pret = phase(p, 0.5, 0.62);
    if (bouton.current) bouton.current.style.transform = `scale(${(0.96 + 0.04 * pret).toFixed(4)})`;
    const revele = phase(p, 0.8, 0.92);
    if (floute.current) floute.current.style.opacity = String(1 - revele);
    if (visage.current) {
      visage.current.style.opacity = String(revele);
      visage.current.style.transform = `scale(${(0.8 + 0.2 * revele).toFixed(4)})`;
    }
    if (titreFlou.current) titreFlou.current.style.opacity = String(1 - revele);
    if (titreNom.current) titreNom.current.style.opacity = String(revele);

    legendes.current.forEach((l, i) => {
      if (!l) return;
      const { a, b } = LEGENDES[i];
      const vis = (i === 0 ? 1 : phase(p, a, a + 0.06)) * (1 - phase(p, b - 0.06, b));
      l.style.opacity = String(vis);
      l.style.transform = `translate3d(0, ${(1 - vis) * 18}px, 0)`;
    });
  });

  return (
    <section ref={ref} className="relative h-[320svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="absolute inset-x-0 top-[13svh] z-10 px-6 text-center lg:inset-x-auto lg:top-1/2 lg:left-[8vw] lg:h-[15rem] lg:w-[40vw] lg:-translate-y-1/2 lg:text-left">
          {LEGENDES.map((l, i) => (
            <div
              key={i}
              ref={(el) => {
                legendes.current[i] = el;
              }}
              className="absolute inset-x-0 top-0"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <p className="display text-[clamp(2rem,7.5vw,4.4rem)] text-white">{l.haut}</p>
              <p className="display text-vote text-[clamp(2rem,7.5vw,4.4rem)]">{l.bas}</p>
            </div>
          ))}
        </div>

        <div
          ref={tel}
          className="absolute bottom-[3svh] left-1/2 origin-bottom lg:top-[54%] lg:bottom-auto lg:left-[68vw] lg:origin-center lg:!-translate-y-1/2"
          style={{ width: W, height: H, transform: "translate3d(-50%, 9vh, 0) scale(0.6)", opacity: 0.3 }}
        >
          <div
            className="relative h-full w-full overflow-hidden rounded-[56px] bg-black"
            style={{ boxShadow: "0 0 0 1.5px rgba(255,255,255,0.12), 0 60px 120px -40px rgba(0,0,0,0.95)" }}
          >
            {/* L'onglet Votes */}
            <div
              ref={inbox}
              className="absolute inset-0 px-4 pt-[74px]"
              style={{ background: "linear-gradient(180deg,#120d24,#1f1445)" }}
            >
              <p className="px-1 text-[30px] font-bold text-white">Votes</p>
              <div className="mt-5 flex flex-col gap-2.5">
                {LIGNES.map((l, i) => (
                  <div
                    key={i}
                    ref={i === 0 ? premiere : undefined}
                    className="flex items-center gap-3 rounded-[14px] px-3.5 py-3"
                    style={NEON}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- site statique */}
                    <img src={l.icone} alt="" className="h-12 w-12" />
                    <p className="flex-1 text-[17px] font-semibold text-white">{l.texte}</p>
                    <span className="text-[15px] text-white/60">{l.quand}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* L'écran du vote */}
            <div ref={detail} className="absolute inset-0 flex flex-col" style={{ opacity: 0 }}>
              <div
                className="relative flex flex-1 flex-col items-center justify-center gap-5 rounded-[16px] px-4 pt-10"
                style={{ background: "linear-gradient(180deg,#d91cbd,#e6006e)" }}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="relative h-[58px] w-[58px] overflow-hidden rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16)]">
                    {/* eslint-disable-next-line @next/next/no-img-element -- site statique */}
                    <img
                      ref={floute}
                      src="/notif-boy.webp"
                      alt=""
                      className="absolute inset-0 h-full w-full scale-[1.22] object-cover opacity-90 blur-[6px] saturate-[0.22]"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element -- site statique */}
                    <img
                      ref={visage}
                      src="/visages/002.webp"
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                      style={{ opacity: 0 }}
                    />
                  </div>
                  <div className="relative h-5 w-[220px] text-center">
                    <p ref={titreFlou} className="absolute inset-0 text-[15px] text-white/95">
                      Il a voté pour toi
                    </p>
                    <p ref={titreNom} className="absolute inset-0 text-[15px] font-bold text-white" style={{ opacity: 0 }}>
                      Lucas Chevalier a voté pour toi
                    </p>
                  </div>
                </div>
                <p className="flex min-h-[74px] items-center px-4 text-center text-[19px] font-bold text-white">
                  Qui survivrait dans un film d&apos;horreur&nbsp;?
                </p>
                <div className="grid grid-cols-2 gap-[10px]">
                  {CHOIX.map((c) => (
                    <div
                      key={c.photo}
                      className={`relative flex h-[147px] w-[147px] flex-col items-center justify-center rounded-[16px] ${c.toi ? "bg-white" : "bg-white/60"}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- site statique */}
                      <img src={c.photo} alt="" className="h-[67px] w-[67px] rounded-full object-cover" />
                      <p className="mt-2 text-center text-[18px] leading-tight font-semibold text-black">
                        {c.nom[0]}
                        <br />
                        {c.nom[1]}
                      </p>
                      {c.toi ? (
                        <>
                          <span className="b-or pointer-events-none absolute -inset-[1.75px] rounded-[17px]" />
                          {/* eslint-disable-next-line @next/next/no-img-element -- site statique */}
                          <img src="/hand.svg" alt="" className="b-main absolute -top-[30px] -right-[30px] z-10 h-[108px] w-[108px] max-w-none" />
                        </>
                      ) : null}
                    </div>
                  ))}
                </div>
                <p className="mb-6 text-[16px] font-semibold text-white">Stan-friends.fr</p>
              </div>

              {/* Le bouton chrome, sur le noir */}
              <div className="flex h-[96px] items-center justify-center">
                <div ref={bouton} className="relative">
                  <span className="absolute inset-x-2 inset-y-1 rounded-full bg-[#e6006e] opacity-60 blur-[20px]" />
                  <div
                    className="relative flex h-[56px] w-[338px] items-center justify-center rounded-full text-[20px] font-bold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.82), rgba(255,255,255,0.38) 18%, transparent 35%), linear-gradient(180deg, #ebebeb, #a8a8a8 25%, #cccccc 50%, #949494 75%, #dbdbdb)",
                      boxShadow: "inset 0 0 0 1.5px #b8b8b8, 0 15px 25px rgba(0,0,0,0.5)",
                    }}
                  >
                    🔒 Découvre qui a voté pour toi
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
