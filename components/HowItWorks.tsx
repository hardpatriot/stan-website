import Image from "next/image";
import { Reveal } from "./Reveal";

/** Les quatre étapes sont celles de la fiche App Store, dans le même ordre. */
const STEPS = [
  {
    icon: "/emoji/school.svg",
    title: "Rejoins ton école",
    body: "Tu retrouves ta classe et les potes qui sont déjà sur Stan.",
    tint: "from-[#a78bfa] to-[#6366f1]",
  },
  {
    icon: "/emoji/handshake.svg",
    title: "Ajoute tes amis",
    body: "Tes contacts, tes camarades. Que des gens que tu connais en vrai.",
    tint: "from-[#47dbff] to-[#6366f1]",
  },
  {
    icon: "/emoji/red_question_mark.svg",
    title: "Réponds aux questions",
    body: "Des sondages courts sur tes potes. Que des trucs bien, jamais l'inverse.",
    tint: "from-[#f7a25b] to-[#f50384]",
  },
  {
    icon: "/emoji/bell.svg",
    title: "Reçois la notif",
    body: "Quelqu'un t'a choisi. Tu le sais tout de suite, mais tu sais pas qui.",
    tint: "from-[#d91cbd] to-[#e6006e]",
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
            Quatre étapes. Après,{" "}
            <span className="text-aura">t&apos;attends la notif.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 100}>
              <article className="glass group relative h-full overflow-hidden rounded-3xl p-7 transition-colors duration-500 hover:border-white/20">
                <span
                  aria-hidden
                  className={`absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br ${step.tint} opacity-15 blur-2xl transition-opacity duration-500 group-hover:opacity-30`}
                />
                <Image
                  src={step.icon}
                  alt=""
                  width={56}
                  height={56}
                  className="relative h-14 w-14 rounded-xl drop-shadow-[0_6px_10px_rgba(0,0,0,0.45)] transition-transform duration-500 group-hover:scale-110"
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
