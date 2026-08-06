import Link from "next/link";
import { Reveal } from "./Reveal";

const FACTS = [
  { value: "0", label: "donnée vendue ou partagée à des annonceurs" },
  { value: "0", label: "suivi de ta position après l'inscription" },
  { value: "24 h", label: "pour traiter une demande de suppression de compte" },
];

export function Safety() {
  return (
    <section className="relative px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="glass relative overflow-hidden rounded-[2rem] px-7 py-11 sm:px-12 sm:py-14">
            <span
              aria-hidden
              className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(71,219,255,0.18),transparent_70%)] blur-2xl"
            />

            <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
              <div className="max-w-md">
                <h2 className="display text-[clamp(1.8rem,4vw,2.6rem)] text-white text-balance">
                  Tes parents peuvent lire cette page.
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed font-medium text-white/55">
                  Stan est fait pour des ados. Du coup on s&apos;impose des
                  règles, et on les écrit noir sur blanc.
                </p>
                <Link
                  href="/centre-de-securite"
                  className="group mt-6 inline-flex items-center gap-2 text-[15px] font-black text-white transition hover:text-cyan"
                >
                  Le centre de sécurité
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>

              <dl className="grid gap-6 sm:grid-cols-3 lg:max-w-md">
                {FACTS.map((fact) => (
                  <div key={fact.label}>
                    <dt className="display text-4xl text-aura">{fact.value}</dt>
                    <dd className="mt-2 text-[13px] leading-snug font-medium text-white/45">
                      {fact.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
