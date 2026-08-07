import Image from "next/image";
import { Reveal } from "./Reveal";

const ROW_A = [
  { emoji: "grinning_face_with_smiling_eyes", text: "Qui a le plus beau sourire ?" },
  { emoji: "face_with_tears_of_joy", text: "Qui te fait le plus rire ?" },
  { emoji: "fire", text: "Qui a le plus de style ?" },
  { emoji: "heart_hands", text: "Sur qui on peut toujours compter ?" },
  { emoji: "brain", text: "Qui a toujours la meilleure idée ?" },
  { emoji: "sun", text: "Qui est toujours de bonne humeur ?" },
];

const ROW_B = [
  { emoji: "sparkles", text: "Qui mérite plus d'attention ?" },
  { emoji: "headphone", text: "Qui a les meilleurs sons ?" },
  { emoji: "speech_balloon", text: "Qui sait le mieux écouter ?" },
  { emoji: "popcorn", text: "Avec qui tu matterais un film toute la nuit ?" },
  { emoji: "microphone", text: "Qui chante le mieux ?" },
  { emoji: "trophy", text: "Qui va réussir sa vie ?" },
];

type Item = { emoji: string; text: string };

function Row({ items, reverse = false }: { items: Item[]; reverse?: boolean }) {
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
        {doubled.map((item, i) => (
          <span
            key={`${item.text}-${i}`}
            className="pill flex shrink-0 items-center gap-2.5 rounded-full py-2.5 pr-5 pl-3 text-[15px] font-bold whitespace-nowrap text-white/75"
          >
            <Image
              src={`/emoji/${item.emoji}.svg`}
              alt=""
              width={26}
              height={26}
              className="h-[26px] w-[26px]"
            />
            {item.text}
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
            Les questions
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

    </section>
  );
}
