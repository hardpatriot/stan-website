"use client";

import { useEffect, useRef } from "react";
import { FRAGMENTS, SOMMETS } from "./FoilQR";

/**
 * Le reflet holographique de l'app (shader `inviteCardHolo`, portage WebGL de
 * FoilQR), calculé en direct, en deux usages :
 *
 * - `<Holo>Tu vas savoir.</Holo>` : sur un texte, découpé à la forme des
 *   lettres, partout où il y avait le dégradé rose du vote ;
 * - `<HoloFond />` : en fond d'un bouton, sous son texte blanc.
 *
 * Sans WebGL (ou avant le chargement), le dégradé rose d'origine reste en
 * place : rien n'est jamais illisible. Chaque contexte WebGL n'existe que
 * quand son élément est près de l'écran, puis il est rendu : la page ne garde
 * jamais plus de deux ou trois shaders en vie.
 */

/** Le temps du shader avance 2,4 fois plus vite que la montre. */
const VITESSE = 2.4;
const INTENSITE = 1.55;

// Variante du shader pour le site :
// - les motifs sont un peu agrandis (plan à 85 %), les nappes un peu
//   élargies : les rubans brillants de l'app, en plus fondus ;
// - le pigment de la carte (#241547) est éclairci en violet clair, pour que
//   les lettres restent lisibles sur la nuit ;
// - les reflets gardent leur éclat : la luminosité n'est plafonnée que tout
//   en haut, et seuls les reflets vraiment blancs virent au lilas (au
//   rose-violet sur un bouton), pour ne pas se confondre avec le texte blanc ;
// - un masque découpe le résultat (les lettres), ou rien pour un fond plein.
const FRAGMENTS_SITE = FRAGMENTS.replace(
  "vec2 plane = vec2(uv.x, uv.y * aspect);",
  "vec2 plane = vec2(uv.x, uv.y * aspect) * 0.85;",
)
  .replace(
    "float nappeA = pow(clamp(1.0 - abs(phaseA - 0.5) * 2.0, 0.0, 1.0), 2.6);",
    "float nappeA = pow(clamp(1.0 - abs(phaseA - 0.5) * 2.0, 0.0, 1.0), 2.2);",
  )
  .replace(
    "float nappeB = pow(clamp(1.0 - abs(phaseB - 0.5) * 2.0, 0.0, 1.0), 3.2);",
    "float nappeB = pow(clamp(1.0 - abs(phaseB - 0.5) * 2.0, 0.0, 1.0), 2.6);",
  )
  .replace("vec3 raw = spectrum(order, 2.4);", "vec3 raw = spectrum(order, 2.0);")
  .replace(
    "vec3 base = mix(vec3(0.141, 0.082, 0.278), vec3(0.082, 0.047, 0.169)",
    // Texte : pigment éclairci. Fond de bouton (plein) : le violet profond
    // d'origine de la carte, pour que le texte blanc ressorte.
    "vec3 base = mix(mix(vec3(0.50, 0.33, 0.92), vec3(0.141, 0.082, 0.278), plein), mix(vec3(0.36, 0.22, 0.80), vec3(0.082, 0.047, 0.169), plein)",
  )
  .replace(
    "uniform float intensity;",
    "uniform float intensity;\nuniform sampler2D masque;\nuniform float plein;\nuniform float plafond;\nuniform float saturation;",
  )
  .replace(
    "gl_FragColor = vec4(min(c, vec3(1.0)), 1.0);",
    "c = min(c, vec3(1.0));\n" +
      "  float lu = dot(c, vec3(0.2126, 0.7152, 0.0722));\n" +
      "  c = clamp(mix(vec3(lu), c, saturation), 0.0, 1.0);\n" +
      "  float sat = max(c.r, max(c.g, c.b)) - min(c.r, min(c.g, c.b));\n" +
      "  c = mix(mix(vec3(0.82, 0.52, 1.0), vec3(0.86, 0.32, 1.0), plein) * max(lu, 0.6), c, smoothstep(0.0, mix(0.12, 0.34, plein), sat));\n" +
      "  lu = dot(c, vec3(0.2126, 0.7152, 0.0722));\n" +
      "  c *= min(1.0, plafond / max(lu, 0.001));\n" +
      "  float a = mix(texture2D(masque, uv).a, 1.0, plein);\n" +
      "  gl_FragColor = vec4(c * a, a);",
  );

type Moteur = {
  gl: WebGLRenderingContext;
  tex: WebGLTexture | null;
  taille: (w: number, h: number) => void;
  image: (secondes: number) => void;
};

/** Compile le shader sur un canevas ; null si WebGL manque. */
function moteur(canvas: HTMLCanvasElement, plein: boolean, plafond: number, saturation: number): Moteur | null {
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
  if (!gl) return null;
  const shader = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, SOMMETS));
  gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAGMENTS_SITE));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const u = (n: string) => gl.getUniformLocation(prog, n);
  const uSize = u("size"), uTx = u("tiltX"), uTy = u("tiltY"), uTime = u("time");
  gl.uniform1f(u("intensity"), INTENSITE);
  gl.uniform1f(u("plein"), plein ? 1 : 0);
  gl.uniform1f(u("plafond"), plafond);
  gl.uniform1f(u("saturation"), saturation);
  gl.uniform1i(u("masque"), 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  let tex: WebGLTexture | null = null;
  if (!plein) {
    tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }
  const immobile = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return {
    gl,
    tex,
    taille: (w, h) => {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uSize, w, h);
    },
    // Pas de souris : le temps fait couler les reflets, et une lente bascule
    // automatique (un téléphone tenu en main) les fait balayer.
    image: (secondes) => {
      const s = immobile ? 7 : 7 + secondes * VITESSE;
      gl.uniform1f(uTx, immobile ? 0 : Math.sin(s * 0.33) * 0.55);
      gl.uniform1f(uTy, immobile ? 0 : Math.cos(s * 0.26) * 0.6);
      gl.uniform1f(uTime, s);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
  };
}

/**
 * Allume le shader quand `cible` approche de l'écran et l'éteint quand elle
 * s'éloigne. `creer` fabrique et pose le canevas, `ajuster` le dimensionne
 * (et le redimensionne quand `observe` change de taille).
 */
function cycleDeVie(
  cible: Element,
  observe: Element,
  creer: () => { canvas: HTMLCanvasElement; m: Moteur } | null,
  ajuster: (canvas: HTMLCanvasElement, m: Moteur) => void,
  attendre: Promise<unknown>,
) {
  const immobile = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const debut = performance.now();
  let actif: { canvas: HTMLCanvasElement; m: Moteur } | null = null;
  let raf = 0;
  let pret = false;
  let proche = false;
  const boucle = (t: number) => {
    if (!actif) return;
    actif.m.image((t - debut) / 1000);
    if (!immobile) raf = requestAnimationFrame(boucle);
  };
  const allumer = () => {
    if (actif || !pret) return;
    actif = creer();
    if (!actif) return;
    ajuster(actif.canvas, actif.m);
    raf = requestAnimationFrame(boucle);
  };
  const eteindre = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    if (!actif) return;
    actif.m.gl.getExtension("WEBGL_lose_context")?.loseContext();
    actif.canvas.remove();
    actif = null;
  };
  const io = new IntersectionObserver(
    ([e]) => {
      proche = e.isIntersecting;
      if (proche) allumer();
      else eteindre();
    },
    { rootMargin: "40% 0px" },
  );
  io.observe(cible);
  const ro = new ResizeObserver(() => {
    if (actif) ajuster(actif.canvas, actif.m);
  });
  ro.observe(observe);
  attendre.then(() => {
    pret = true;
    if (proche) allumer();
  });
  return () => {
    io.disconnect();
    ro.disconnect();
    eteindre();
  };
}

function nouveauCanevas() {
  const c = document.createElement("canvas");
  c.setAttribute("aria-hidden", "true");
  c.style.position = "absolute";
  c.style.pointerEvents = "none";
  return c;
}

export function Holo({ children, className = "" }: { children: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const span = ref.current;
    const hote = span?.parentElement;
    if (!span || !hote) return;
    if (getComputedStyle(hote).position === "static") hote.style.position = "relative";
    const masque = document.createElement("canvas");

    // Le masque : chaque caractère à l'endroit précis où le navigateur l'a
    // dessiné, sur la boîte qui englobe les lignes du texte.
    const ajuster = (canvas: HTMLCanvasElement, m: Moteur) => {
      const rects = Array.from(span.getClientRects());
      if (!rects.length) return;
      const hb = hote.getBoundingClientRect();
      const l = Math.min(...rects.map((r) => r.left)) - 4;
      const t = Math.min(...rects.map((r) => r.top)) - 4;
      const r = Math.max(...rects.map((x) => x.right)) + 4;
      const b = Math.max(...rects.map((x) => x.bottom)) + 4;
      Object.assign(canvas.style, {
        left: `${l - hb.left}px`,
        top: `${t - hb.top}px`,
        width: `${r - l}px`,
        height: `${b - t}px`,
      });
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      const w = Math.max(1, Math.round((r - l) * dpr));
      const h = Math.max(1, Math.round((b - t) * dpr));
      m.taille(w, h);
      masque.width = w;
      masque.height = h;
      const ctx = masque.getContext("2d");
      if (!ctx) return;
      const style = getComputedStyle(span);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, r - l, b - t);
      ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      ctx.fillStyle = "#fff";
      ctx.textBaseline = "alphabetic";
      const range = document.createRange();
      const marcheur = document.createTreeWalker(span, NodeFilter.SHOW_TEXT);
      for (let n = marcheur.nextNode(); n; n = marcheur.nextNode()) {
        const texte = n.textContent ?? "";
        for (let i = 0; i < texte.length; i++) {
          const ch = texte[i];
          if (!ch.trim()) continue;
          range.setStart(n, i);
          range.setEnd(n, i + 1);
          const rc = range.getBoundingClientRect();
          if (!rc.width) continue;
          ctx.fillText(ch, rc.left - l, rc.top - t + ctx.measureText(ch).fontBoundingBoxAscent);
        }
      }
      m.gl.bindTexture(m.gl.TEXTURE_2D, m.tex);
      m.gl.texImage2D(m.gl.TEXTURE_2D, 0, m.gl.RGBA, m.gl.RGBA, m.gl.UNSIGNED_BYTE, masque);
    };

    const creer = () => {
      const canvas = nouveauCanevas();
      const m = moteur(canvas, false, 0.9, 1.35);
      if (!m) return null;
      hote.appendChild(canvas);
      // Le dégradé de secours s'efface, le shader prend le relais.
      span.style.backgroundImage = "none";
      span.style.color = "transparent";
      return { canvas, m };
    };

    // Le masque attend la vraie police : sinon les lettres seraient décalées.
    return cycleDeVie(span, hote, creer, ajuster, document.fonts.ready);
  }, []);

  return (
    <span ref={ref} className={`text-vote ${className}`}>
      {children}
    </span>
  );
}

/** Le shader en fond plein, pour un bouton : il couvre son parent positionné. */
export function HoloFond() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const place = ref.current;
    if (!place) return;
    const ajuster = (canvas: HTMLCanvasElement, m: Moteur) => {
      const r = place.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      m.taille(Math.max(1, Math.round(r.width * dpr)), Math.max(1, Math.round(r.height * dpr)));
    };
    const creer = () => {
      const canvas = nouveauCanevas();
      Object.assign(canvas.style, { inset: "0", width: "100%", height: "100%" });
      // Sur le violet profond de la carte, reflets vifs mais jamais blancs :
      // les zones pâles virent au rose-violet et la luminosité est un peu
      // plafonnée, pour que le texte blanc du bouton ressorte partout.
      const m = moteur(canvas, true, 0.62, 1.6);
      if (!m) return null;
      place.appendChild(canvas);
      return { canvas, m };
    };
    return cycleDeVie(place, place, creer, ajuster, Promise.resolve());
  }, []);

  return <span ref={ref} aria-hidden className="absolute inset-0" />;
}
