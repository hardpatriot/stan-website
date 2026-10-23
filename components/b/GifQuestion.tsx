/**
 * Le GIF d'une question, comme QuestionIllustrationView dans l'app : l'image
 * ajustée (126 de large au plus, 90 de haut), coins de 8, posée dans un écrin
 * sombre de 2 pt aux coins de 10, cerclé d'un liseré métal holographique à
 * 65 %, avec la mention KLIPY en bas à droite. `echelle` agrandit le tout
 * d'un bloc pour les grandes questions de la page.
 */
export function GifQuestion({
  src,
  ratio,
  echelle = 1,
  klipy = true,
}: {
  src: string;
  /** Largeur / hauteur du GIF. */
  ratio: number;
  echelle?: number;
  klipy?: boolean;
}) {
  const largeur = Math.min(126, 90 * ratio);
  const hauteur = largeur / ratio;
  return (
    <div
      className="relative shrink-0 rounded-[10px] bg-black/[0.12] p-[2px] shadow-[0_3px_4px_rgba(0,0,0,0.18)]"
      style={{ zoom: echelle }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- site statique, GIF animé */}
      <img
        src={src}
        alt=""
        width={Math.round(largeur)}
        height={Math.round(hauteur)}
        className="block rounded-[8px] object-cover"
        style={{ width: largeur, height: hauteur }}
      />
      {klipy ? (
        <span className="absolute right-[5px] bottom-[5px] rounded-[2px] bg-black/50 px-[1.5px] py-[0.5px] text-[6px] leading-none font-bold text-white">
          KLIPY
        </span>
      ) : null}
      {/* Le liseré métal holographique (QuestionGIFMetalBorder) */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[10px] opacity-65"
        style={{
          padding: 1.25,
          background:
            "linear-gradient(135deg, #f4f4f8, #9a9aa6 22%, #ffd9f2 38%, #c9f1ff 52%, #8f8f9c 68%, #fff6d6 84%, #b8b8c4)",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
    </div>
  );
}
