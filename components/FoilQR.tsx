"use client";

import { useEffect, useRef } from "react";

/**
 * La finition holographique de la carte QR de l'app, sur le web.
 *
 * Portage ligne à ligne du shader Metal `inviteCardHolo`
 * (Uplift/DesignComponents/InviteCardHoloShader.metal) en WebGL : même champ
 * fluide, mêmes nappes ondulées, même diffraction dont l'ordre zéro est blanc,
 * même palette Stan (rose, or, menthe, bleu, violet), sur le même fond violet
 * profond que la carte (#241547 vers #150C2B). Sans panneau de QR.
 *
 * L'inclinaison du téléphone devient ici celle de la souris sur le bouton ;
 * au repos, une lente oscillation. Le canevas est dessiné à la densité réelle
 * de l'écran : aucun agrandissement, rien de flou. Il s'arrête hors de
 * l'écran, et reste immobile pour qui demande moins d'animations.
 */
const SOMMETS = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAGMENTS = `
precision highp float;
uniform vec2 size;
uniform float tiltX;
uniform float tiltY;
uniform float time;
uniform float intensity;

float hash21(vec2 v) {
  v = fract(v * vec2(123.34, 456.21));
  v += dot(v, v + 45.32);
  return fract(v.x * v.y);
}
float noise2(vec2 v) {
  vec2 cell = floor(v);
  vec2 local = fract(v);
  local = local * local * (3.0 - 2.0 * local);
  float a = hash21(cell);
  float b = hash21(cell + vec2(1.0, 0.0));
  float c = hash21(cell + vec2(0.0, 1.0));
  float d = hash21(cell + vec2(1.0, 1.0));
  return mix(mix(a, b, local.x), mix(c, d, local.x), local.y);
}
vec2 flow(vec2 p, float t) {
  vec2 drift = vec2(t * 0.045, -t * 0.03);
  float n1 = noise2(p * 1.6 + drift);
  float n2 = noise2(p * 1.6 + vec2(5.2, 1.3) - drift);
  vec2 warp = vec2(n1, n2) - 0.5;
  float n3 = noise2(p * 3.1 + warp * 1.8 + drift * 1.7);
  float n4 = noise2(p * 3.1 + vec2(2.7, 8.1) - warp * 1.8);
  return warp * 0.7 + (vec2(n3, n4) - 0.5) * 0.3;
}
vec3 spectrum(float order, float sharpness) {
  vec3 wave = order * vec3(550.0 / 610.0, 1.0, 550.0 / 465.0);
  vec3 peak = pow(abs(cos(3.14159265 * wave)) + 1e-5, vec3(sharpness));
  return peak / (1.0 + abs(wave) * 0.10);
}
vec3 stanTint(float phase) {
  vec3 rose = vec3(1.00, 0.18, 0.44);
  vec3 gold = vec3(0.97, 0.75, 0.25);
  vec3 mint = vec3(0.30, 0.88, 0.76);
  vec3 blue = vec3(0.30, 0.64, 1.00);
  vec3 violet = vec3(0.61, 0.36, 1.00);
  float p = fract(phase) * 5.0;
  vec3 c = mix(rose, gold, clamp(p, 0.0, 1.0));
  c = mix(c, mint, clamp(p - 1.0, 0.0, 1.0));
  c = mix(c, blue, clamp(p - 2.0, 0.0, 1.0));
  c = mix(c, violet, clamp(p - 3.0, 0.0, 1.0));
  return mix(c, rose, clamp(p - 4.0, 0.0, 1.0));
}

void main() {
  // Repère de Metal : origine en haut à gauche.
  vec2 position = vec2(gl_FragCoord.x, size.y - gl_FragCoord.y);
  vec2 uv = position / size;
  float aspect = size.y / size.x;
  vec2 plane = vec2(uv.x, uv.y * aspect);
  vec2 tilt = vec2(tiltY, -tiltX);
  float tiltMag = min(length(tilt), 1.0);

  // Le fond de la carte QR : 241547 vers 150C2B.
  vec3 base = mix(vec3(0.141, 0.082, 0.278), vec3(0.082, 0.047, 0.169), clamp((uv.x + uv.y) * 0.5, 0.0, 1.0));

  vec2 border = min(uv, 1.0 - uv);
  float edge = min(border.x, border.y * aspect);
  float frameWeight = 1.0 - smoothstep(0.010, 0.09, edge);

  vec2 field = plane + tilt * 0.22;
  vec2 warp = flow(field, time);

  float phaseA = fract(dot(plane, vec2(0.62, 0.78)) + warp.x * 0.55 - time * 0.06 + tilt.x * 0.60 - tilt.y * 0.35);
  float nappeA = pow(clamp(1.0 - abs(phaseA - 0.5) * 2.0, 0.0, 1.0), 2.6);
  float phaseB = fract(dot(plane, vec2(0.48, -0.86)) + warp.y * 0.55 + time * 0.045 - tilt.x * 0.35 + tilt.y * 0.55 + 0.41);
  float nappeB = pow(clamp(1.0 - abs(phaseB - 0.5) * 2.0, 0.0, 1.0), 3.2);
  vec3 tintA = stanTint(phaseA * 0.8 + tilt.x * 0.3 + 0.10);
  vec3 tintB = stanTint(phaseB * 0.8 - tilt.y * 0.3 + 0.55);

  vec2 axisDir = normalize(vec2(0.80 + tilt.x * 0.5, 0.60 + tilt.y * 0.5));
  float axis = dot(plane - vec2(0.5, aspect * 0.5) + tilt * 0.30, axisDir) + warp.x * 0.25;
  float order = axis * 2.4 + tilt.x * 1.6 + tilt.y * 0.8 + time * 0.035;
  vec3 raw = spectrum(order, 2.4);
  float white = min(raw.r, min(raw.g, raw.b));
  vec3 chroma = raw - white;
  vec3 tint = stanTint(axis * 0.8 + tilt.x * 0.3 + time * 0.015);

  vec3 foil = chroma * tint * 1.7 + white * vec3(1.0, 0.98, 0.95) * 0.5;
  foil += tintA * nappeA * 1.25 + tintB * nappeB * 0.95;

  vec2 lightPos = vec2(0.30 + tilt.x * 0.35, aspect * (0.24 - tilt.y * 0.35));
  vec2 toLight = plane - lightPos;
  float pool = exp(-dot(toLight, toLight) * 3.4);

  float lift = 0.50 + 0.50 * tiltMag;
  float bodyAmt = 0.62 + 0.38 * frameWeight;
  float amount = intensity * lift * bodyAmt;

  vec3 c = base * (0.86 + 0.14 * clamp(nappeA + nappeB, 0.0, 1.0));
  c += foil * amount;
  c += vec3(1.0, 0.96, 0.98) * pool * amount * 0.32;
  float rim = 1.0 - smoothstep(0.0, 0.012, edge);
  c += vec3(1.0) * rim * 0.22 * lift;

  gl_FragColor = vec4(min(c, vec3(1.0)), 1.0);
}
`;

export function FoilQR({
  intensity = 1.0,
  className = "",
}: {
  intensity?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!gl) return; // le fond CSS de secours reste visible

    const shader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, SOMMETS));
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAGMENTS));
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
    const uSize = u("size"), uTx = u("tiltX"), uTy = u("tiltY"), uTime = u("time"), uInt = u("intensity");
    gl.uniform1f(uInt, intensity);

    const immobile = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hote = canvas.parentElement ?? canvas;

    // Dessiné à la densité réelle de l'écran.
    const dimensionner = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uSize, w, h);
    };

    // La souris joue le rôle du gyroscope ; au repos, une lente oscillation.
    let cibleX = 0, cibleY = 0, tx = 0, ty = 0, survol = false;
    const bouger = (e: PointerEvent) => {
      const r = hote.getBoundingClientRect();
      cibleX = ((e.clientY - r.top) / r.height - 0.5) * 1.6;
      cibleY = ((e.clientX - r.left) / r.width - 0.5) * 1.6;
      survol = true;
    };
    const quitter = () => { survol = false; };
    hote.addEventListener("pointermove", bouger);
    hote.addEventListener("pointerleave", quitter);

    const debut = performance.now();
    let raf = 0;
    const dessiner = (t: number) => {
      dimensionner();
      const s = immobile ? 0 : (t - debut) / 1000;
      if (!survol) {
        cibleX = Math.sin(s * 0.6) * 0.35;
        cibleY = Math.cos(s * 0.45) * 0.45;
      }
      tx += (cibleX - tx) * 0.08;
      ty += (cibleY - ty) * 0.08;
      gl.uniform1f(uTx, tx);
      gl.uniform1f(uTy, ty);
      gl.uniform1f(uTime, s);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!immobile) raf = requestAnimationFrame(dessiner);
    };

    const observateur = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (e.isIntersecting) raf = requestAnimationFrame(dessiner);
    });
    observateur.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      observateur.disconnect();
      hote.removeEventListener("pointermove", bouger);
      hote.removeEventListener("pointerleave", quitter);
    };
  }, [intensity]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none block h-full w-full bg-[linear-gradient(135deg,#241547,#150c2b)] ${className}`}
    />
  );
}
