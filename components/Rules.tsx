import { Reveal } from "./Reveal";

const RULES = [
  {
    emoji: "🧢",
    title: "Que du positif",
    body: "Chaque question est écrite pour valoriser quelqu'un. Il n'existe aucun sondage négatif sur Stan, et il n'y en aura jamais.",
  },
  {
    emoji: "🤫",
    title: "Anonyme par défaut",
    body: "Tu sais qu'on a voté pour toi. Pas qui. À toi de décider si tu veux débloquer un indice.",
  },
  {
    emoji: "🚫",
    title: "Zéro message privé",
    body: "Personne ne peut t'écrire sur Stan. Ni tes potes, ni des inconnus. La messagerie n'existe tout simplement pas.",
  },
  {
    emoji: "👥",
    title: "Entre potes uniquement",
    body: "Seuls tes amis, tes contacts et tes camarades de classe peuvent voter pour toi. Les inconnus n'ont aucun moyen de t'atteindre.",
  },
];

export function Rules() {
  return (
    <section className="relative px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-black tracking-[0.18em] text-cyan uppercase">
            Les règles du jeu
          </p>
          <h2 className="display mt-4 max-w-2xl text-[clamp(2.1rem,5.5vw,3.6rem)] text-white text-balance">
            On a construit Stan pour qu&apos;il soit{" "}
            <span className="text-vote">impossible</span> d&apos;y être méchant.
          </h2>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed font-medium text-white/55">
            Ce ne sont pas des promesses de communication. C&apos;est comment
            l&apos;app est faite&nbsp;: ce qui n&apos;existe pas dans le code ne
            peut pas arriver.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {RULES.map((rule, i) => (
            <Reveal key={rule.title} delay={i * 90}>
              <article className="glass group flex h-full gap-5 rounded-3xl p-7 transition-colors duration-500 hover:border-white/20">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/[0.06] text-2xl transition-transform duration-500 group-hover:scale-110">
                  {rule.emoji}
                </span>
                <div>
                  <h3 className="text-lg font-black tracking-tight text-white">
                    {rule.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed font-medium text-white/55">
                    {rule.body}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
