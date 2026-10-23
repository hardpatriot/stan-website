import { CarrouselEtapes } from "./CarrouselEtapes";
import { Holo } from "./Holo";
import { Reveal } from "./Reveal";
import { StepCard } from "./StepCard";

/** Les quatre étapes sont celles de la fiche App Store, dans le même ordre. */
const STEPS = [
  {
    icon: "ecole",
    title: "Rejoins ton école",
    body: "Tu retrouves ta classe et les potes qui sont déjà sur Stan.",
  },
  {
    icon: "amis",
    title: "Ajoute tes amis",
    body: "Tes contacts, tes camarades. Que des gens que tu connais en vrai.",
  },
  {
    icon: "questions",
    title: "Réponds aux questions",
    body: "Des questions courtes sur tes potes. Que des trucs bien, jamais l'inverse.",
  },
  {
    icon: "notif",
    title: "Reçois la notif",
    body: "Quelqu'un t'a choisi. Tu le sais tout de suite. Tu ne sais pas qui.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative px-5 py-8 sm:px-8 sm:py-12 lg:py-14">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-black tracking-[0.18em] text-lavender uppercase">
            Ça marche comment
          </p>
          <h2 className="display mt-4 max-w-2xl text-[clamp(2.1rem,5.5vw,3.6rem)] text-white text-balance">
            4 étapes,{" "}
            <Holo>{"après t'attends le vote de tes potes ou de ton Crush\u00a0!"}</Holo>
          </h2>
        </Reveal>

        {/* Sur mobile : un carrousel qu'on fait défiler au doigt, avec un
            calage sur chaque carte. Quatre cartes empilées demandaient un
            scroll interminable. À partir de `sm`, on retrouve une grille. */}
        <CarrouselEtapes>
          {STEPS.map((step, i) => (
            <Reveal
              key={step.title}
              delay={i * 100}
              className="w-[74vw] max-w-[280px] shrink-0 snap-start sm:w-auto sm:max-w-none"
            >
              <StepCard
                icon={step.icon}
                numero={i + 1}
                titre={step.title}
                corps={step.body}
              />
            </Reveal>
          ))}
        </CarrouselEtapes>
      </div>
    </section>
  );
}
