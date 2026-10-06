import { Pinceau } from "./Pinceau";
import { Reveal } from "./Reveal";
import { StepCard } from "./StepCard";

/** Les quatre étapes sont celles de la fiche App Store, dans le même ordre. */
const STEPS = [
  {
    icon: "school",
    title: "Rejoins ton école",
    body: "Tu retrouves ta classe et les potes qui sont déjà sur Stan.",
    teinte: "#a78bfa",
  },
  {
    icon: "handshake",
    title: "Ajoute tes amis",
    body: "Tes contacts, tes camarades. Que des gens que tu connais en vrai.",
    teinte: "#47dbff",
  },
  {
    icon: "red_question_mark",
    title: "Réponds aux questions",
    body: "Des questions courtes sur tes potes. Que des trucs bien, jamais l'inverse.",
    teinte: "#f50384",
  },
  {
    icon: "bell",
    title: "Reçois la notif",
    body: "Quelqu'un t'a choisi. Tu le sais tout de suite. Tu ne sais pas qui.",
    teinte: "#e6006e",
  },
];

export function HowItWorks() {
  return (
    <section className="relative px-5 py-14 sm:px-8 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-black tracking-[0.18em] text-rose uppercase">
            Ça marche comment
          </p>
          <h2 className="punch mt-4 inline-block max-w-3xl -rotate-2 text-[clamp(2.2rem,6vw,4rem)] text-white">
            Quatre étapes. Après, t&apos;attends la notif.
            <Pinceau className="mt-[0.04em] w-[70%]" />
          </h2>
        </Reveal>

        {/* Sur mobile : un carrousel qu'on fait défiler au doigt, avec un
            calage sur chaque carte. Quatre cartes empilées demandaient un
            scroll interminable. À partir de `sm`, on retrouve une grille. */}
        <div className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:mx-0 sm:mt-14 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
          {STEPS.map((step, i) => (
            <Reveal
              key={step.title}
              delay={i * 100}
              className="w-[74vw] max-w-[280px] shrink-0 snap-center sm:w-auto sm:max-w-none"
            >
              <StepCard
                icon={step.icon}
                numero={i + 1}
                titre={step.title}
                corps={step.body}
                teinte={step.teinte}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
