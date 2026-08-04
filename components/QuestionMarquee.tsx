import { Reveal } from "./Reveal";

const ROW_A = [
  "😁 Qui a le plus beau sourire ?",
  "😂 Qui te fait le plus rire ?",
  "🔥 Qui a le plus de style ?",
  "🫶 Sur qui on peut toujours compter ?",
  "🧠 Qui a toujours la meilleure idée ?",
  "☀️ Qui est toujours de bonne humeur ?",
];

const ROW_B = [
  "✨ Qui mérite plus d'attention ?",
  "🎧 Qui a les meilleurs goûts en musique ?",
  "💬 Qui sait le mieux écouter ?",
  "🍿 Avec qui tu regarderais un film toute la nuit ?",
  "🎨 Qui est le plus créatif ?",
  "🏆 Qui va réussir sa vie ?",
];

function Row({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="flex w-max gap-3.5">
      <div
        className="animate-marquee flex w-max gap-3.5"
        style={{
          animationDirection: reverse ? "reverse" : "normal",
          animationDuration: reverse ? "52s" : "44s",
        }}
      >
        {doubled.map((q, i) => (
          <span
            key={`${q}-${i}`}
            className="glass shrink-0 rounded-full px-5 py-3 text-[15px] font-bold whitespace-nowrap text-white/75"
          >
            {q}
          </span>
        ))}
      </div>
    </div>
  );
}

export function QuestionMarquee() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <Reveal className="px-5 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-sm font-black tracking-[0.18em] text-lavender uppercase">
            Un aperçu des sondages
          </p>
        </div>
      </Reveal>

      <div className="relative mt-9 flex flex-col gap-3.5">
        <Row items={ROW_A} />
        <Row items={ROW_B} reverse />

        {/* Fondu sur les bords */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-night-950 to-transparent sm:w-40"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-night-950 to-transparent sm:w-40"
        />
      </div>

      <Reveal className="mt-9 px-5 sm:px-8">
        <p className="mx-auto max-w-md text-center text-[15px] leading-relaxed font-medium text-white/45">
          Des centaines de questions, écrites une par une. Aucune ne sert à
          chambrer&nbsp;: elles servent toutes à valoriser quelqu&apos;un.
        </p>
      </Reveal>
    </section>
  );
}
