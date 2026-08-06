import Image from "next/image";
import { Reveal } from "./Reveal";

const RULES = [
  {
    icon: "/cap-512.png",
    title: "Que du positif",
    body: "Toutes les questions servent à dire du bien. Il y a zéro sondage négatif sur Stan, et il y en aura jamais.",
  },
  {
    icon: "/emoji/shushing_face.svg",
    title: "Personne sait qui a voté",
    body: "Tu sais qu'on a voté pour toi. Pas qui. Sauf si tu débloques un indice.",
  },
  {
    icon: "/emoji/prohibited.svg",
    title: "Personne peut t'écrire",
    body: "Y a pas de messages sur Stan. Ni tes potes, ni des inconnus. Ça existe juste pas.",
  },
  {
    icon: "/emoji/handshake.svg",
    title: "Que tes potes",
    body: "Seuls tes amis, tes contacts et ta classe peuvent voter pour toi. Les inconnus, aucune chance.",
  },
];

export function Rules() {
  return (
    <section className="relative px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-black tracking-[0.18em] text-cyan uppercase">
            Les règles
          </p>
          <h2 className="display mt-4 max-w-2xl text-[clamp(2.1rem,5.5vw,3.6rem)] text-white text-balance">
            Sur Stan, être méchant,{" "}
            <span className="text-vote">c&apos;est même pas possible.</span>
          </h2>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed font-medium text-white/55">
            C&apos;est pas une promesse, c&apos;est comment l&apos;app est
            faite. Ce qui existe pas peut pas arriver.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {RULES.map((rule, i) => (
            <Reveal key={rule.title} delay={i * 90}>
              <article className="glass group flex h-full gap-5 rounded-3xl p-7 transition-colors duration-500 hover:border-white/20">
                <Image
                  src={rule.icon}
                  alt=""
                  width={48}
                  height={48}
                  className="h-12 w-12 shrink-0 rounded-xl drop-shadow-[0_6px_10px_rgba(0,0,0,0.45)] transition-transform duration-500 group-hover:scale-110"
                />
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
