import { Emoji } from "./EmojiSprite";
import { GifMini } from "./GifMini";
import { Reveal } from "./Reveal";
import { Holo } from "./Holo";

/**
 * Reprend l'écran « Crée ta propre question » : le champ limité à 120
 * caractères, puis le classement de l'école où le top 3 passe dans les
 * vraies questions. Les GIF et les compteurs sont ceux de l'app.
 */

// Des questions activées en prod, courtes (une ligne), avec leur GIF.
const RANKING = [
  { gif: "254", text: "Qui t'envoie tous les matins «t'es où ?»", votes: 14, live: true },
  { gif: "387", text: "Qui connaît toutes les trends Tiktok", votes: 9, live: true },
  { gif: "508", text: "Qui master l'art du sarcasme", votes: 6, live: true },
  { gif: "145", text: "Qui est le/la plus hilarant·e ?", votes: 3, live: false },
];

export function CustomQuestions() {
  return (
    <section className="relative px-5 py-8 sm:px-8 sm:py-12 lg:py-14">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        {/* Le discours */}
        <div className="min-w-0">
          <Reveal>
            <p className="text-sm font-black tracking-[0.18em] text-cyan uppercase">
              Tes questions
            </p>
            <h2 className="display mt-4 text-[clamp(2.1rem,5.5vw,3.6rem)] text-white text-balance">
              Balance ta meilleure ref. <Holo>Le top 3 part dans les questions de ton école.</Holo>
            </h2>
          </Reveal>
        </div>

        {/* La maquette : une seule carte, le champ puis le classement */}
        <Reveal delay={120} className="min-w-0">
          <div className="neon overflow-hidden rounded-3xl">
            <div className="p-5 sm:p-6">
              <p className="text-[17px] font-semibold text-white">Crée ta propre question</p>
              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white/[0.06] py-2 pr-2 pl-4">
                <p className="min-w-0 flex-1 truncate text-[15px] font-medium text-white/80">
                  Qui survivrait dans un film d&apos;horreur&nbsp;?
                  <span className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[3px] animate-pulse bg-rose" />
                </p>
                <span className="shrink-0 rounded-full bg-[linear-gradient(105deg,#d91cbd,#e6006e)] px-4 py-2 text-[13px] font-bold text-white">
                  Publier
                </span>
              </div>
            </div>

            <p className="border-t border-white/[0.07] px-5 pt-4 pb-1 text-[12px] font-bold tracking-wide text-white/40 uppercase sm:px-6">
              Le classement de ton école
            </p>
            <ol className="px-2 pb-2 sm:px-3 sm:pb-3">
              {RANKING.map((item, i) => (
                <li
                  key={item.text}
                  className={`flex h-[62px] items-center gap-3 rounded-2xl px-3 ${item.live ? "" : "opacity-40"}`}
                >
                  <span className="w-4 shrink-0 text-center text-[14px] font-bold text-white/60">{i + 1}</span>
                  <GifMini id={item.gif} largeur={96} hauteur={40} carre />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold text-white">{item.text}</p>
                    {item.live ? (
                      <p className="mt-0.5 text-[12px] font-semibold text-[#4ADE80]">✓ Dans les questions</p>
                    ) : (
                      <p className="mt-0.5 text-[12px] font-medium text-white/45">Encore quelques votes</p>
                    )}
                  </div>
                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-white/[0.07] px-2.5 py-1">
                    <Emoji name="fire" className="h-[14px] w-[14px] shrink-0" />
                    <span className="text-[13px] font-bold text-white/70 tabular-nums">{item.votes}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
