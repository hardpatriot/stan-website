"use client";

import { useEffect, useRef } from "react";
import { FRAGMENTS, SOMMETS } from "./FoilQR";

/**
 * Le texte holographique du Secret Crush (HolographicPrivacyText), en vrai.
 *
 * Dans l'app : le texte en blanc, et par-dessus le même texte peint du
 * pigment de la carte QR (#2A1856 vers #150C2B) passé dans le shader
 * `inviteCardHolo` à l'intensité 1,35, posé à 45 %. Ici c'est exactement ce
 * shader (le portage WebGL de FoilQR), calculé en direct et découpé à la
 * forme des lettres : on place chaque caractère à l'endroit précis où le
 * navigateur l'a dessiné, dans un masque que le shader lit.
 *
 * Les reflets coulent avec le temps et une bascule automatique, sans souris. La
 * boucle ne tourne que quand le titre est à l'écran ; le texte blanc reste
 * du vrai texte, sélectionnable et lu par les moteurs de recherche.
 */
// Plus vif que dans l'app (0,45 et 1,35) : ici le texte est immense et ne
// bouge pas sous le doigt, il faut plus d'éclat pour le même effet.
const OPACITE = 0.62;
const INTENSITE = 1.6;
/** Le temps du shader avance 2,4 fois plus vite que la montre. */
const VITESSE = 2.4;

// Le pigment de la carte (#241547) éclairci en lavande : sur des lettres
// blanches, le violet sombre donnait des creux gris ternes entre les reflets.
const FRAGMENTS_TEXTE = FRAGMENTS.replace(
  "vec3 base = mix(vec3(0.141, 0.082, 0.278), vec3(0.082, 0.047, 0.169)",
  "vec3 base = mix(vec3(0.40, 0.27, 0.72), vec3(0.28, 0.18, 0.58)",
).replace(
  "uniform float intensity;",
  "uniform float intensity;\nuniform sampler2D masque;\nuniform float opacite;",
).replace(
  "gl_FragColor = vec4(min(c, vec3(1.0)), 1.0);",
  "float a = texture2D(masque, uv).a * opacite;\n  gl_FragColor = vec4(min(c, vec3(1.0)) * a, a);",
);

export function TexteHolo({
  avant,
  holo,
  className = "",
}: {
  /** Le début du titre, en blanc simple. */
  avant?: string;
  /** La partie holographique. */
  holo: string;
  className?: string;
}) {
  const titre = useRef<HTMLHeadingElement>(null);
  const cible = useRef<HTMLSpanElement>(null);
  const toile = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const h = titre.current;
    const span = cible.current;
    const canvas = toile.current;
    if (!h || !span || !canvas) return;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) return; // reste le texte blanc

    const shader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, SOMMETS));
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAGMENTS_TEXTE));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
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
    gl.uniform1f(u("opacite"), OPACITE);
    gl.uniform1i(u("masque"), 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const masque = document.createElement("canvas");

    // Le masque : chaque caractère, à sa place exacte dans la page.
    const construire = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      const boite = h.getBoundingClientRect();
      const w = Math.max(1, Math.round(boite.width * dpr));
      const hh = Math.max(1, Math.round(boite.height * dpr));
      canvas.width = w;
      canvas.height = hh;
      masque.width = w;
      masque.height = hh;
      gl.viewport(0, 0, w, hh);
      gl.uniform2f(uSize, w, hh);
      const ctx = masque.getContext("2d");
      if (!ctx) return;
      const style = getComputedStyle(span);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, boite.width, boite.height);
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
          const r = range.getBoundingClientRect();
          if (!r.width) continue;
          const m = ctx.measureText(ch);
          ctx.fillText(ch, r.left - boite.left, r.top - boite.top + m.fontBoundingBoxAscent);
        }
      }
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, masque);
    };

    // Pas de souris ni de défilement : le temps fait couler les reflets, et une
    // lente bascule automatique (comme un téléphone qu'on tient dans la main)
    // fait balayer la diffraction d'un bord à l'autre.
    const immobile = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const debut = performance.now();
    let raf = 0;
    const dessiner = (t: number) => {
      const s = immobile ? 7 : 7 + ((t - debut) / 1000) * VITESSE;
      gl.uniform1f(uTx, immobile ? 0 : Math.sin(s * 0.33) * 0.55);
      gl.uniform1f(uTy, immobile ? 0 : Math.cos(s * 0.26) * 0.6);
      gl.uniform1f(uTime, s);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!immobile) raf = requestAnimationFrame(dessiner);
    };

    let pret = false;
    const relancer = () => {
      construire();
      pret = true;
      if (!raf) raf = requestAnimationFrame(dessiner);
    };
    const observateur = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (e.isIntersecting && pret) raf = requestAnimationFrame(dessiner);
    });
    observateur.observe(h);
    const redim = new ResizeObserver(() => pret && construire());
    redim.observe(h);
    // Le masque attend la vraie police : sinon les lettres seraient décalées.
    document.fonts.ready.then(relancer);

    return () => {
      cancelAnimationFrame(raf);
      observateur.disconnect();
      redim.disconnect();
    };
  }, []);

  return (
    <h2 ref={titre} className={`relative ${className}`}>
      {avant ? <>{avant} </> : null}
      <span ref={cible} className="text-white [text-shadow:0_1px_1px_rgba(0,0,0,0.25)]">
        {holo}
      </span>
      <canvas ref={toile} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
    </h2>
  );
}
