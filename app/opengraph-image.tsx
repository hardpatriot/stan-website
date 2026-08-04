import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Stan — Quelqu'un a voté pour toi.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * L'aperçu qui s'affiche quand quelqu'un colle stan-friends.com
 * dans un groupe WhatsApp / Snap / Insta. C'est souvent la première
 * chose que voit un nouvel utilisateur — donc elle compte.
 */
export default async function Image() {
  // Satori n'hérite pas des polices du site : il faut les lui passer,
  // sinon tout retombe sur une graisse normale et le titre perd sa force.
  const [cap, black, medium] = await Promise.all([
    readFile(join(process.cwd(), "public", "cap-512.png")),
    readFile(join(process.cwd(), "assets", "Roboto-Black.ttf")),
    readFile(join(process.cwd(), "assets", "Roboto-Medium.ttf")),
  ]);
  const capSrc = `data:image/png;base64,${cap.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 88px",
          background:
            "linear-gradient(140deg, #0b0716 0%, #120d24 38%, #1f1445 78%, #0f0a20 100%)",
          fontFamily: "Roboto",
          position: "relative",
        }}
      >
        {/* Nappe magenta */}
        <div
          style={{
            position: "absolute",
            top: -260,
            left: -160,
            width: 720,
            height: 720,
            borderRadius: 999,
            background:
              "radial-gradient(circle, rgba(217,28,189,0.42) 0%, rgba(230,0,110,0.16) 45%, transparent 70%)",
          }}
        />
        {/* Nappe violette */}
        <div
          style={{
            position: "absolute",
            bottom: -300,
            right: -180,
            width: 760,
            height: 760,
            borderRadius: 999,
            background:
              "radial-gradient(circle, rgba(129,140,248,0.34) 0%, transparent 68%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <img src={capSrc} width={78} height={78} alt="" style={{ borderRadius: 20 }} />
          <span
            style={{
              fontSize: 42,
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-0.03em",
            }}
          >
            Stan
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 44,
          }}
        >
          <span
            style={{
              fontSize: 92,
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-0.045em",
              lineHeight: 1,
            }}
          >
            Quelqu&apos;un a voté
          </span>
          <span
            style={{
              fontSize: 92,
              fontWeight: 900,
              color: "#ff4fb0",
              letterSpacing: "-0.045em",
              lineHeight: 1.05,
            }}
          >
            pour toi.
          </span>
        </div>

        <span
          style={{
            marginTop: 36,
            fontSize: 32,
            fontWeight: 500,
            color: "rgba(255,255,255,0.58)",
            letterSpacing: "-0.01em",
          }}
        >
          Que du positif. Jamais l&apos;inverse. — stan-friends.com
        </span>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Roboto", data: black, weight: 900, style: "normal" },
        { name: "Roboto", data: medium, weight: 500, style: "normal" },
      ],
    },
  );
}
