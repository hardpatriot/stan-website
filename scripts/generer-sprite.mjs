/**
 * Fabrique la planche de symboles des emojis.
 *
 * Pourquoi : un <img src="…svg"> laisse le navigateur libre de rastériser le
 * fichier à la résolution de son choix. Safari iOS le fait, et les emojis
 * ressortent flous sur les écrans denses. Une géométrie posée directement
 * dans le DOM est retracée à chaque image à la résolution réelle : il n'y a
 * plus d'étape de rastérisation à rater.
 *
 * La planche définit chaque emoji UNE fois dans un <symbol>. Chaque usage
 * n'est ensuite qu'un <use> de quelques octets, quel que soit le nombre
 * d'occurrences dans la page.
 *
 * Deux précautions :
 * - les identifiants internes (dégradés, masques, filtres) sont préfixés par
 *   le nom de l'emoji, sinon deux emojis partageant un « clip0_31_1609 »
 *   s'écraseraient une fois réunis dans le même document ;
 * - la sortie est du vrai JSX, pas du HTML injecté, donc les noms d'attributs
 *   sont convertis à la convention React.
 *
 *   node scripts/generer-sprite.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DOSSIER_EMOJI = "public/emoji";
const SORTIE = "components/EmojiSprite.tsx";

/** Attributs SVG dont React attend une autre orthographe. */
const ATTRIBUTS = {
  "clip-path": "clipPath",
  "clip-rule": "clipRule",
  "color-interpolation-filters": "colorInterpolationFilters",
  "fill-opacity": "fillOpacity",
  "fill-rule": "fillRule",
  "flood-opacity": "floodOpacity",
  "stop-color": "stopColor",
  "stop-opacity": "stopOpacity",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-miterlimit": "strokeMiterlimit",
  "stroke-opacity": "strokeOpacity",
  "stroke-width": "strokeWidth",
  class: "className",
};

/** Les emojis cités quelque part dans les composants. */
function emojisUtilises() {
  const utilises = new Set();
  for (const f of readdirSync("components")) {
    if (!f.endsWith(".tsx") || f === "EmojiSprite.tsx") continue;
    const src = readFileSync(join("components", f), "utf8");
    for (const m of src.matchAll(/emoji:\s*"([a-z0-9_]+)"/g)) utilises.add(m[1]);
    for (const m of src.matchAll(/\/emoji\/([a-z0-9_]+)\.svg/g)) utilises.add(m[1]);
    for (const m of src.matchAll(/name="([a-z0-9_]+)"\s*(?:\/|className)/g)) {
      utilises.add(m[1]);
    }
  }
  return [...utilises].sort();
}

/** Préfixe les identifiants internes pour éviter toute collision. */
function isoler(nom, markup) {
  const prefixe = `${nom}-`;
  const ids = new Set();
  for (const m of markup.matchAll(/id="([^"]+)"/g)) ids.add(m[1]);
  let out = markup;
  for (const id of ids) {
    const e = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out
      .replace(new RegExp(`id="${e}"`, "g"), `id="${prefixe}${id}"`)
      .replace(new RegExp(`url\\(#${e}\\)`, "g"), `url(#${prefixe}${id})`)
      .replace(new RegExp(`href="#${e}"`, "g"), `href="#${prefixe}${id}"`);
  }
  return out;
}

/** Traduit les noms d'attributs et ferme les balises à la mode JSX. */
function enJsx(markup) {
  let out = markup;
  for (const [svg, react] of Object.entries(ATTRIBUTS)) {
    out = out.replace(new RegExp(`\\s${svg}=`, "g"), ` ${react}=`);
  }
  // `style="a:b"` deviendrait un objet en React : ces emojis n'en ont pas
  // besoin, on le retire plutôt que de le traduire à moitié.
  out = out.replace(/\sstyle="[^"]*"/g, "");
  return out;
}

const noms = emojisUtilises();
const symboles = [];

for (const nom of noms) {
  let svg;
  try {
    svg = readFileSync(join(DOSSIER_EMOJI, `${nom}.svg`), "utf8");
  } catch {
    console.warn(`  ignoré, fichier absent : ${nom}`);
    continue;
  }
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 32 32";
  const interieur = svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
  symboles.push(
    `      <symbol id="e-${nom}" viewBox="${viewBox}">${enJsx(isoler(nom, interieur))}</symbol>`,
  );
}

const contenu = `// FICHIER GÉNÉRÉ — ne pas modifier à la main.
// Régénérer avec : node scripts/generer-sprite.mjs
//
// Chaque emoji est défini une seule fois ici, puis référencé par <Emoji />.
// Voir scripts/generer-sprite.mjs pour la raison de ce détour.

export const EMOJIS = ${JSON.stringify(noms)} as const;

export type NomEmoji = (typeof EMOJIS)[number];

/** Posée une fois dans la page, invisible. */
export function EmojiSprite() {
  return (
    <svg
      aria-hidden
      focusable="false"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
${symboles.join("\n")}
    </svg>
  );
}

/** Un emoji, tracé en vectoriel à la résolution réelle de l'écran. */
export function Emoji({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <svg aria-hidden focusable="false" className={className}>
      <use href={\`#e-\${name}\`} />
    </svg>
  );
}
`;

writeFileSync(SORTIE, contenu);
console.log(
  `${symboles.length} emojis — ${Math.round(Buffer.byteLength(contenu) / 1024)} Ko`,
);
console.log(noms.join(", "));
