/**
 * Fabrique les emojis vectoriels de la page.
 *
 * POURQUOI PAS UNE IMAGE
 * Un <img src="…svg"> laisse le navigateur libre de rastériser le fichier à la
 * résolution de son choix. Safari iOS le fait mal sur les écrans denses, et
 * les emojis ressortent flous. Une géométrie posée dans le DOM est retracée à
 * chaque image à la résolution réelle : il n'y a plus d'étape à rater.
 *
 * POURQUOI PAS <symbol> + <use>
 * C'était la solution la plus économe, mais un <use> crée un arbre fantôme.
 * Les filtres de ces emojis sont positionnés en coordonnées absolues
 * (`filterUnits="userSpaceOnUse"`, tel que Figma les exporte) et leur zone
 * atterrit à côté dans cet arbre : le dessin vire au noir. Constaté sur le
 * point d'interrogation. Les retirer ne marche pas non plus : certains
 * groupes SONT le flou, sans lui ils deviennent des aplats opaques, ce qui
 * cassait les mains jointes et la tête qui parle.
 *
 * CE QU'ON FAIT
 * Les définitions lourdes et partageables — dégradés, filtres — sont posées
 * UNE fois dans un bloc caché du document. Les formes, elles, sont écrites en
 * ligne à chaque usage, dans l'arbre normal : les filtres y fonctionnent
 * exactement comme dans le fichier d'origine.
 *
 * Les identifiants sont préfixés par le nom de l'emoji : sans ça, deux emojis
 * partageant un « paint0_linear » s'écraseraient une fois réunis.
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

/**
 * Les emojis cités quelque part dans les composants.
 *
 * On ratisse large : toute chaîne en minuscules qui correspond à un fichier
 * existant est retenue. C'est volontairement naïf, mais ça évite d'oublier un
 * emoji parce qu'il est déclaré sous une forme qu'on n'avait pas prévue —
 * ce qui est déjà arrivé deux fois.
 */
function emojisUtilises() {
  const disponibles = new Set(
    readdirSync(DOSSIER_EMOJI)
      .filter((f) => f.endsWith(".svg"))
      .map((f) => f.replace(/\.svg$/, "")),
  );
  const utilises = new Set();
  for (const f of readdirSync("components")) {
    if (!f.endsWith(".tsx") || f === "EmojiSprite.tsx") continue;
    const src = readFileSync(join("components", f), "utf8");
    for (const m of src.matchAll(/"([a-z][a-z0-9_]{2,})"/g)) {
      if (disponibles.has(m[1])) utilises.add(m[1]);
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

/** Traduit les noms d'attributs à la convention React. */
function enJsx(markup) {
  let out = markup;
  for (const [svg, react] of Object.entries(ATTRIBUTS)) {
    out = out.replace(new RegExp(`\\s${svg}=`, "g"), ` ${react}=`);
  }
  return out.replace(/\sstyle="[^"]*"/g, "");
}

const noms = emojisUtilises();
const definitions = [];
const formes = [];

for (const nom of noms) {
  let svg;
  try {
    svg = readFileSync(join(DOSSIER_EMOJI, `${nom}.svg`), "utf8");
  } catch {
    console.warn(`  ignoré, fichier absent : ${nom}`);
    continue;
  }
  const interieur = enJsx(
    isoler(nom, svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "")),
  );

  // On sépare ce qui se partage (le bloc <defs>) de ce qui se dessine.
  const defs = [...interieur.matchAll(/<defs>([\s\S]*?)<\/defs>/g)]
    .map((m) => m[1])
    .join("");
  const dessin = interieur.replace(/<defs>[\s\S]*?<\/defs>/g, "");

  if (defs) definitions.push(`        {/* ${nom} */}\n        ${defs}`);
  formes.push(`  ${JSON.stringify(nom)}: (\n    <>${dessin}</>\n  ),`);
}

const contenu = `// FICHIER GÉNÉRÉ — ne pas modifier à la main.
// Régénérer avec : node scripts/generer-sprite.mjs
//
// Voir scripts/generer-sprite.mjs pour la raison de cette construction.

import type { ReactNode } from "react";

export const EMOJIS = ${JSON.stringify(noms)} as const;

/** Les formes de chaque emoji, écrites en ligne à chaque usage. */
const FORMES: Record<string, ReactNode> = {
${formes.join("\n")}
};

/**
 * Les dégradés et filtres partagés, posés une seule fois dans le document.
 * À placer une fois dans la page, avant les emojis.
 */
export function EmojiSprite() {
  return (
    <svg
      aria-hidden
      focusable="false"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
${definitions.join("\n")}
      </defs>
    </svg>
  );
}

/**
 * Un emoji, tracé en vectoriel à la résolution réelle de l'écran.
 *
 * Le viewBox est indispensable : les filtres de ces emojis sont positionnés
 * en coordonnées absolues dans un repère de 32 unités.
 */
export function Emoji({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 32 32"
      fill="none"
      className={className}
    >
      {FORMES[name]}
    </svg>
  );
}
`;

writeFileSync(SORTIE, contenu);
console.log(
  `${formes.length} emojis — ${Math.round(Buffer.byteLength(contenu) / 1024)} Ko`,
);
