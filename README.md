# stan-friends.com

Le site vitrine de Stan. Une landing page + les 3 pages légales. Aucune base de
données, aucun compte, aucun formulaire : tout est généré en statique.

## Stack

- **Next.js 16** (App Router) — tout est prérendu en statique au build
- **Tailwind CSS 4** — le thème est défini dans `app/globals.css`
- **Hébergement** : Vercel, plan gratuit

## Lancer en local

```bash
npm install
npm run dev
```

→ http://localhost:3000

## Les pages

| URL | Fichier |
|---|---|
| `/` | `app/page.tsx` |
| `/conditions-dutilisation` | `app/conditions-dutilisation/page.tsx` |
| `/centre-de-securite` | `app/centre-de-securite/page.tsx` |
| `/politique-de-confidentialite` | `app/politique-de-confidentialite/page.tsx` |

⚠️ **Ne jamais renommer les 3 URLs légales.** Celle de la politique de
confidentialité est déclarée dans App Store Connect : si elle casse, Apple le
signale à la prochaine soumission.

## La charte

Les couleurs viennent directement de l'app iOS, pour que le site et
l'application soient raccord :

| Rôle | Valeur | Source dans l'app |
|---|---|---|
| Fond nuit | `#120D24` → `#1F1445` | `BackgroundViewStyle.standard` |
| Gradient du vote | `#D91CBD` → `#E6006E` | `BackgroundViewStyle.poll` |
| Violet Aura | `#A78BFA` → `#6366F1` | `FriendsActionPalette` |
| Typo | Roboto 400/500/700/900 | `.custom("Roboto")` |

## Déploiement

Chaque `git push` sur `main` déclenche un déploiement automatique sur Vercel.

```bash
npm run build   # vérifier que ça compile avant de pousser
```

## Modifier le contenu

- **Les textes de la landing** : dans les composants de `components/`
  (`Hero`, `HowItWorks`, `Rules`, `Safety`, `FinalCta`).
- **Les questions de la démo** : constante `QUESTIONS` en haut de
  `components/VoteDemo.tsx`.
- **Les questions du bandeau défilant** : `ROW_A` / `ROW_B` dans
  `components/QuestionMarquee.tsx`.
- **L'image de partage** (aperçu WhatsApp / Snap) : `app/opengraph-image.tsx`.
