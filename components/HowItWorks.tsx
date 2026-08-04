import { Reveal } from "./Reveal";

const STEPS = [
  {
    emoji: "🗳️",
    title: "Tu votes pour tes potes",
    body: "Des sondages courts, toujours positifs. Tu choisis simplement qui mérite le compliment.",
    tint: "from-[#a78bfa] to-[#6366f1]",
  },
  {
    emoji: "🔔",
    title: "La personne reçoit la notif",
    body: "« Quelqu'un a voté pour toi. » Sans savoir qui, sans savoir pourquoi. Pour l'instant.",
    tint: "from-[#d91cbd] to-[#e6006e]",
  },
  {
    emoji: "👀",
    title: "Elle découvre qu'elle compte",
    body: "Le moment où on comprend qu'on a marqué quelqu'un. C'est tout le point de Stan.",
    tint: "from-[#47dbff] to-[#6366f1]",
  },
];

export function HowItWorks() {
  return (
    <section className="relative px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-black tracking-[0.18em] text-rose uppercase">
            Comment ça marche
          </p>
          <h2 className="display mt-4 max-w-2xl text-[clamp(2.1rem,5.5vw,3.6rem)] text-white text-balance">
            Trois secondes pour voter.{" "}
            <span className="text-aura">Toute la journée</span> pour s&apos;en
            remettre.
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
                <span
                  className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${step.tint} text-2xl shadow-[0_12px_30px_-10px_rgba(0,0,0,0.7)]`}
                >
                  {step.emoji}
                </span>
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
