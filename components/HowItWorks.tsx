import Image from "next/image";
import { Reveal } from "./Reveal";

const STEPS = [
  {
    emoji: "sparkles",
    title: "Tu votes",
    body: "Des questions courtes, que des trucs bien. Tu choisis juste qui le mérite.",
    tint: "from-[#a78bfa] to-[#6366f1]",
  },
  {
    emoji: "bell",
    title: "La notif tombe",
    body: "« Quelqu'un a voté pour toi. » Sans savoir qui. Pour l'instant.",
    tint: "from-[#d91cbd] to-[#e6006e]",
  },
  {
    emoji: "eyes",
    title: "On capte qu'on compte",
    body: "Le moment où tu réalises que quelqu'un pense du bien de toi. C'est tout Stan.",
    tint: "from-[#47dbff] to-[#6366f1]",
  },
];

export function HowItWorks() {
  return (
    <section className="relative px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-black tracking-[0.18em] text-rose uppercase">
            Ça marche comment
          </p>
          <h2 className="display mt-4 max-w-2xl text-[clamp(2.1rem,5.5vw,3.6rem)] text-white text-balance">
            3 secondes pour voter.{" "}
            <span className="text-aura">Toute la journée</span> à sourire.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 110}>
              <article className="glass group relative h-full overflow-hidden rounded-3xl p-7 transition-colors duration-500 hover:border-white/20">
                <span
                  aria-hidden
                  className={`absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br ${step.tint} opacity-15 blur-2xl transition-opacity duration-500 group-hover:opacity-30`}
                />
                <Image
                  src={`/emoji/${step.emoji}.svg`}
                  alt=""
                  width={56}
                  height={56}
                  className="relative h-14 w-14 drop-shadow-[0_6px_10px_rgba(0,0,0,0.45)] transition-transform duration-500 group-hover:scale-110"
                />
                <p className="relative mt-6 text-xs font-black tracking-[0.2em] text-white/30">
                  0{i + 1}
                </p>
                <h3 className="relative mt-2 text-xl font-black tracking-tight text-white">
                  {step.title}
                </h3>
                <p className="relative mt-3 text-[15px] leading-relaxed font-medium text-white/55">
                  {step.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
