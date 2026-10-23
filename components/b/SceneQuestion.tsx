"use client";

import { Holo } from "../Holo";
import Image from "next/image";
import { useRef, useState } from "react";
import { FenetreQrInvitation, numeroSaisi, ouvrirMessages } from "../Invitation";
import { WaveFill } from "../WaveFill";
import { GifQuestion } from "./GifQuestion";
import { phase, useScene } from "./useScene";

/**
 * Scène 2 : l'écran de vote, recopié du code de l'app.
 *
 * Barre d'état, barre d'onglets (Votes · Stan · Profil), carte plein écran
 * au dégradé violet de la série, « 1 sur 12 » et ses 12 segments, le GIF de
 * la question dans son écrin métal, la question en 18 semibold, les quatre
 * cartes de verre blanc-lilas 147 × 147, puis Shuffle et Skip. En défilant,
 * une carte s'enfonce sous le doigt, puis les vagues de résultat montent.
 *
 * Le seul ajout par rapport à l'app : « Mets les prénoms de tes potes ». Un
 * prénom remplace une carte ; un numéro ouvre Messages avec l'invitation
 * prête (ou un QR code sur ordinateur). Le site n'envoie rien lui-même.
 */
const W = 393;
const H = 852;
const BARRE = 54;
const ONGLETS = 64;
const SERIE = 12;

const PARTS = [0.18, 0.47, 0.26, 0.09];
const POTES_DEPART = ["Lana Chung", "Lucas Chevalier", "Léa Sacla", "Noha Kanté"];
const PHOTOS: Record<string, string> = {
  "Lana Chung": "/visages/001.webp",
  "Lucas Chevalier": "/visages/002.webp",
  "Léa Sacla": "/visages/005.webp",
  "Noha Kanté": "/visages/004.webp",
};

function decouper(nom: string) {
  const [prenom, ...reste] = nom.trim().split(/\s+/);
  return [prenom, reste.join(" ")];
}

function initiales(nom: string) {
  return decouper(nom)
    .map((m) => m.charAt(0))
    .join("")
    .toUpperCase();
}

const CHOISI = 1;

const LEGENDES = [
  { a: 0.0, b: 0.34, haut: "Chaque jour,", bas: "des questions sur tes potes." },
  { a: 0.34, b: 0.66, haut: "Tu choisis.", bas: "Ton nom reste masqué." },
  { a: 0.66, b: 1.01, haut: "Toi aussi, on te choisit.", bas: "Peut-être ton Crush…" },
];

function BarreEtat() {
  return (
    <div
      aria-hidden
      className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-[34px] text-[16px] font-semibold text-white"
      style={{ height: BARRE }}
    >
      <span>21:47</span>
      <span className="absolute top-[11px] left-1/2 h-[34px] w-[120px] -translate-x-1/2 rounded-full bg-black" />
      <span className="flex items-center gap-[6px]">
        <svg viewBox="0 0 18 12" width="18" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg viewBox="0 0 17 12.5" width="17" fill="none">
          <path d="M1.7 4.6a9.8 9.8 0 0 1 13.6 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M4.5 7.6a5.8 5.8 0 0 1 8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="8.5" cy="10.6" r="1.55" fill="currentColor" />
        </svg>
        <svg viewBox="0 0 27 13" width="26" fill="none">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="currentColor" opacity="0.4" />
          <rect x="2" y="2" width="20" height="9" rx="2" fill="currentColor" />
          <path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2z" fill="currentColor" opacity="0.4" />
        </svg>
      </span>
    </div>
  );
}

/** TabBarView : l'onglet choisi au centre, blanc à texte rose, cerclé d'un halo. */
function BarreOnglets() {
  return (
    <div
      aria-hidden
      className="absolute inset-x-0 z-10 flex items-center justify-center gap-5"
      style={{ top: BARRE, height: ONGLETS }}
    >
      {[{ t: "Votes", badge: 2 }, { t: "Stan", actif: true }, { t: "Profil" }].map((o) => (
        <span
          key={o.t}
          className="relative flex shrink-0 items-center justify-center rounded-full font-semibold"
          style={
            o.actif
              ? {
                  width: 122,
                  height: 46,
                  fontSize: 18.5,
                  background: "#fff",
                  color: "#ff2d55",
                  boxShadow: "0 0 0 5px rgba(255,255,255,0.22)",
                }
              : {
                  width: 110,
                  height: 42,
                  fontSize: 17,
                  color: "#fff",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.32), rgba(255,255,255,0.14))",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.55), inset 0 0 0 1px rgba(255,255,255,0.25), 0 4px 12px rgba(0,0,0,0.12)",
                }
          }
        >
          {o.t}
          {o.badge ? (
            <span
              className="absolute -top-[6px] -right-[4px] flex min-w-[20px] items-center justify-center rounded-[7px] px-[6px] py-[3px] text-[12px] font-bold text-white"
              style={{
                background: "linear-gradient(180deg,#FF3B5C,#f81b5d)",
                boxShadow: "0 2px 5px rgba(248,27,93,0.55), inset 0 0 0 0.8px rgba(255,255,255,0.35)",
              }}
            >
              {o.badge}
            </span>
          ) : null}
        </span>
      ))}
    </div>
  );
}

/** PollChoiceLightGlassCard + ProfileCard, à l'identique. */
function Carte({
  nom,
  part,
  resultat,
  refCarte,
}: {
  nom: string;
  part: number;
  resultat: boolean;
  refCarte: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={refCarte}
      className="relative flex h-[147px] w-[147px] flex-col items-center justify-center overflow-hidden rounded-[16px]"
      style={{
        background:
          "radial-gradient(circle at 42% 28%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.34) 52%, rgba(255,255,255,0) 76%), linear-gradient(160deg, #ffffff 0%, #fefcff 46%, #f9f2fd 100%)",
        boxShadow:
          "0 8px 11px rgba(91,33,182,0.42), 0 4px 5px rgba(0,0,0,0.15), inset 0 0 0 1.55px rgba(255,255,255,0.92)",
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[3.2px] rounded-[13px]"
        style={{
          border: "0.85px solid rgba(255,255,255,0.6)",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 46%, rgba(184,155,209,0.18) 100%)",
        }}
      />
      {PHOTOS[nom] ? (
        // eslint-disable-next-line @next/next/no-img-element -- site statique
        <img
          src={PHOTOS[nom]}
          alt=""
          className="relative h-[67px] w-[67px] rounded-full object-cover"
          style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.25)" }}
        />
      ) : (
        // InitialsView, quand un pote n'a pas de photo
        <span
          className="relative flex h-[67px] w-[67px] items-center justify-center rounded-full bg-[#8E8E93] text-[17px] font-semibold text-white"
          style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.25)" }}
        >
          {initiales(nom)}
        </span>
      )}
      <span className="relative mt-[8px] px-2 text-center text-[18px] leading-[1.15] font-semibold text-black">
        {decouper(nom)[0]}
        <br />
        {decouper(nom)[1]}
      </span>
      {resultat ? <WaveFill percentage={part} width={147} height={147} /> : null}
    </div>
  );
}

export function SceneQuestion() {
  const tel = useRef<HTMLDivElement>(null);
  const cartes = useRef<(HTMLDivElement | null)[]>([]);
  const legendes = useRef<(HTMLDivElement | null)[]>([]);
  const [resultat, setResultat] = useState(false);
  const [potes, setPotes] = useState(POTES_DEPART);
  const [saisie, setSaisie] = useState(false);
  const [brouillon, setBrouillon] = useState("");
  const [qrPour, setQrPour] = useState<string | null>(null);

  const valider = (e: React.FormEvent) => {
    e.preventDefault();
    const numero = numeroSaisi(brouillon);
    if (numero) {
      if (!ouvrirMessages(numero)) setQrPour(numero);
    } else if (brouillon.trim()) {
      setPotes((p) => [brouillon.trim(), ...p.slice(0, 3)]);
    }
    setBrouillon("");
  };
  const etat = useRef(false);

  const ref = useScene<HTMLElement>((p) => {
    const t = tel.current;
    if (!t) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const large = vw >= 900;
    const total = H + 22;
    const k = Math.min(1, (vh * (large ? 0.8 : 0.68)) / total, (vw * (large ? 0.42 : 0.86)) / (W + 22));
    const entree = phase(p, 0, 0.16);
    const sortie = phase(p, 0.88, 1);
    const s = k * (0.88 + 0.12 * entree) * (1 - 0.05 * sortie);
    t.style.transform = `translate3d(-50%, ${((1 - entree) * 9 - sortie * 5).toFixed(2)}vh, 0) scale(${s.toFixed(4)})`;
    t.style.opacity = String((0.3 + 0.7 * entree) * (1 - 0.6 * sortie));

    // Le doigt appuie sur la carte (scaleEffect 0,95 de ProfileCard).
    const appui = phase(p, 0.38, 0.43) - phase(p, 0.45, 0.5);
    cartes.current.forEach((c, i) => {
      if (c) c.style.transform = i === CHOISI ? `scale(${(1 - 0.05 * appui).toFixed(4)})` : "";
    });

    // Les vagues ne montent qu'une fois, puis repartent si on remonte.
    const montre = p > 0.5;
    if (montre !== etat.current) {
      etat.current = montre;
      setResultat(montre);
    }

    legendes.current.forEach((l, i) => {
      if (!l) return;
      const { a, b } = LEGENDES[i];
      // L'une s'efface juste avant la frontière, la suivante apparaît juste
      // après : jamais deux légendes l'une sur l'autre, jamais de long vide.
      const vis = (i === 0 ? 1 : phase(p, a, a + 0.045)) * (i === LEGENDES.length - 1 ? 1 : 1 - phase(p, b - 0.045, b));
      l.style.opacity = String(vis);
      l.style.transform = `translate3d(0, ${(1 - vis) * 18}px, 0)`;
    });
  });

  return (
    <section ref={ref} className="relative h-[230svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="absolute inset-x-0 top-[12svh] z-10 px-6 text-center lg:inset-x-auto lg:top-1/2 lg:left-[8vw] lg:h-[15rem] lg:w-[40vw] lg:-translate-y-1/2 lg:text-left">
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
              <p className="display text-[clamp(2rem,7.5vw,4.4rem)]">
                <Holo>{l.bas}</Holo>
              </p>
            </div>
          ))}
        </div>

        {/* Le téléphone : châssis graphite, puis l'écran de l'app */}
        <div
          ref={tel}
          className="absolute bottom-[3svh] left-1/2 origin-bottom rounded-[64px] p-[11px] lg:top-[52%] lg:bottom-auto lg:left-[68vw] lg:origin-center lg:!-translate-y-1/2"
          style={{
            transform: "translate3d(-50%, 9vh, 0) scale(0.6)",
            opacity: 0.3,
            background: "linear-gradient(150deg,#3a3550,#1c1830 22%,#0f0c1c 50%,#1c1830 78%,#45405c)",
            boxShadow:
              "inset 0 0 0 1.5px rgba(255,255,255,0.16), 0 60px 120px -40px rgba(0,0,0,0.95), 0 0 90px -30px rgba(96,1,255,0.5)",
          }}
        >
          <div
            className="relative overflow-hidden rounded-[54px]"
            style={{
              width: W,
              height: H,
              background: "linear-gradient(180deg,#6001FF,#5601FF,#4B01FF,#4001FF,#3501FF,#2A01FF,#1F01FF,#1501FF)",
            }}
          >
            <BarreEtat />
            <BarreOnglets />

            <div className="absolute inset-0 flex flex-col items-center" style={{ paddingTop: BARRE + ONGLETS }}>
              {/* « 1 sur 12 » + HolographicPageControlView */}
              <div className="flex flex-col items-center gap-2 pt-[22px]">
                <p className="text-[18px] leading-none font-semibold text-white">1 sur {SERIE}</p>
                <div className="flex gap-1">
                  {Array.from({ length: SERIE }, (_, i) => (
                    <span
                      key={i}
                      className="h-[3.2px] w-[23.52px] rounded-full"
                      style={{
                        background:
                          i === 0
                            ? "linear-gradient(90deg,#ff8ad8,#ffe68a,#8cffcf,#8ad8ff)"
                            : "rgba(142,142,147,0.85)",
                        boxShadow: i === 0 ? "0 0 2px rgba(204,72,255,0.45)" : undefined,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* PollView */}
              <div className="mt-[14px] flex flex-1 flex-col items-center">
                <div className="mt-[6px] flex h-[98px] w-[132px] items-center justify-center">
                  <GifQuestion src="/animes/halloween.webp" ratio={245 / 140} klipy={false} />
                </div>
                <p className="mt-[20px] px-5 text-center text-[18px] leading-[1.25] font-semibold text-white">
                  Qui survivrait dans un film d&apos;horreur&nbsp;?
                </p>
                {/* Ajouter ses potes : le seul ajout par rapport à l'app */}
                <div className="mt-[18px] w-[304px]">
                  {saisie ? (
                    <form onSubmit={valider} className="flex gap-2">
                      <input
                        autoFocus
                        value={brouillon}
                        onChange={(e) => setBrouillon(e.target.value)}
                        maxLength={22}
                        placeholder="Prénom ou numéro d'un pote"
                        // « tel » : choisir un contact proposé par Safari insère son numéro.
                        autoComplete="tel"
                        name="tel"
                        autoCorrect="off"
                        autoCapitalize="words"
                        className="min-w-0 flex-1 rounded-full bg-white px-4 py-2 text-[15px] font-semibold text-[#0b0716] outline-none placeholder:text-black/35"
                      />
                      {numeroSaisi(brouillon) ? (
                        <button
                          type="submit"
                          className="flex h-[38px] shrink-0 items-center justify-center rounded-full bg-white px-4 text-[14px] font-black text-[#e6006e] active:scale-95"
                        >
                          Inviter
                        </button>
                      ) : (
                        <button
                          type="submit"
                          aria-label="Ajouter ce pote"
                          className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-black/20 text-[20px] leading-none font-semibold text-white active:scale-90"
                        >
                          +
                        </button>
                      )}
                    </form>
                  ) : (
                    <button
                      onClick={() => setSaisie(true)}
                      className="mx-auto block rounded-full bg-black/15 px-4 py-1.5 text-[13px] font-semibold text-white/90 transition hover:bg-black/25"
                    >
                      ✏️ Mets les prénoms de tes potes
                    </button>
                  )}
                </div>
                <div className="flex-1" />
                <div className="grid grid-cols-2 gap-[10px]">
                  {potes.map((nom, i) => (
                    <Carte
                      key={`${nom}-${i}`}
                      nom={nom}
                      part={PARTS[i]}
                      resultat={resultat}
                      refCarte={(el) => {
                        cartes.current[i] = el;
                      }}
                    />
                  ))}
                </div>
                <div className="flex-1" />
                <div className="flex items-center gap-[30px]">
                  <Image src="/shuffle.png" alt="" width={121} height={60} className="h-[60px] w-auto" />
                  <Image src="/skip.png" alt="" width={121} height={60} className="h-[60px] w-auto" />
                </div>
                <div className="flex-1" />
              </div>
            </div>

            <span className="absolute bottom-[14px] left-1/2 h-[5px] w-[130px] -translate-x-1/2 rounded-full bg-white/70" />
          </div>
        </div>
        {qrPour ? <FenetreQrInvitation numero={qrPour} onClose={() => setQrPour(null)} /> : null}
      </div>
    </section>
  );
}
