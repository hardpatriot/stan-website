import Image from "next/image";
import { Reveal } from "./Reveal";

/**
 * Reprend l'écran « Crée ta propre question » : le champ limité à 120
 * caractères, puis le classement de l'école où le top 3 passe dans les
 * vrais sondages. Les emojis et les compteurs sont ceux de l'app.
 */

const RANKING = [
  {
    emoji: "robot",
    text: "Qui sort toujours « non mais c'est plus rapide par là » ?",
    votes: 14,
    live: true,
  },
  {
    emoji: "hourglass_not_done",
    text: "Qui arrive toujours en retard avec une excuse improbable ?",
    votes: 9,
    live: true,
  },
  {
    emoji: "flushed_face",
    text: "Qui met toujours les stories les plus improbables",
    votes: 6,
    live: true,
  },
  {
    emoji: "face_with_tears_of_joy",
    text: "À qui il arrive toujours des galères improbables",
    votes: 3,
    live: false,
  },
];

export function CustomQuestions() {
  return (
    <section className="relative px-5 py-14 sm:px-8 sm:py-24 lg:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        {/* Le discours */}
        <div className="min-w-0">
          <Reveal>
            <p className="text-sm font-black tracking-[0.18em] text-cyan uppercase">
              Tes questions
            </p>
            <h2 className="display mt-4 text-[clamp(2.1rem,5.5vw,3.6rem)] text-white text-balance">
              Balance ta meilleure ref.{" "}
              <span className="text-vote">
                Le top 3 part dans les sondages de ton école.
              </span>
            </h2>
            <p className="mt-6 max-w-lg text-[17px] leading-relaxed font-medium text-white/55">
              Tu écris ta question, ton école vote. Les trois qui récoltent le
              plus de 🔥 entrent dans les vrais sondages, et là tout le monde y
              répond.
            </p>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed font-medium text-white/35">
              120 caractères, pas un de plus. Et tout passe par la modération
              avant d&apos;arriver dans les sondages.
            </p>
          </Reveal>
        </div>

        {/* La maquette : champ de saisie + classement */}
        <Reveal delay={120} className="min-w-0">
          <div className="flex flex-col gap-4">
            {/* Le champ */}
            <div className="glass rounded-3xl p-6">
              <p className="text-lg font-black tracking-tight text-white">
                Crée ta propre question
              </p>
              <p className="mt-1.5 text-[14px] leading-relaxed font-medium text-white/45">
                Balance ta meilleure ref, le top 3 entre dans les vrais sondages
                de l&apos;école
              </p>
              <div className="mt-5 rounded-2xl bg-white/[0.06] px-4 py-3.5">
                <p className="text-[15px] font-medium text-white/80">
                  Qui survivrait dans un film d&apos;horreur&nbsp;?
                  <span className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[3px] animate-pulse bg-rose" />
                </p>
              </div>
              <div className="mt-2.5 flex items-center justify-between">
                <span className="text-[12px] font-bold text-white/30">
                  39/120
                </span>
                <span className="rounded-full bg-[linear-gradient(105deg,#d91cbd,#e6006e)] px-4 py-1.5 text-[13px] font-black text-white">
                  Publier
                </span>
              </div>
            </div>

            {/* Le classement */}
            <div className="glass overflow-hidden rounded-3xl">
              <p className="px-6 pt-6 pb-4 text-[12px] font-black tracking-wide text-white/45 uppercase">
                Le classement de ton école
              </p>
              <ul>
                {RANKING.map((item, i) => (
                  <li
                    key={item.text}
                    className={`flex items-center gap-3 border-t border-white/[0.07] px-5 py-3.5 ${
                      item.live ? "" : "opacity-45"
                    }`}
                  >
                    <span className="w-5 shrink-0 text-center text-[14px] font-black text-white/85">
                      {i + 1}
                    </span>
                    <Image
                      src={`/emoji/${item.emoji}.svg`}
                      alt=""
                      width={30}
                      height={30}
                      className="h-[30px] w-[30px] shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-semibold text-white/90">
                        {item.text}
                      </p>
                      {item.live && (
                        <p className="mt-0.5 text-[11px] font-black text-[#4ADE80]">
                          ✓ Dans les sondages
                        </p>
                      )}
                    </div>
                    <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/[0.08] px-3 py-1.5">
                      <Image
                        src="/emoji/fire.svg"
                        alt=""
                        width={15}
                        height={15}
                        className="h-[15px] w-[15px]"
                      />
                      <span className="text-[13px] font-black text-white/70">
                        {item.votes}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
