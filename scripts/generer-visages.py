"""
Prépare les visages de la sphère.

Dépose les portraits dans `visages/` (PNG, JPG ou WebP, carrés de préférence),
puis lance :

    python3 scripts/generer-visages.py

Chaque visage est recadré au carré, détouré en rond, réduit à 192 px au plus
(jamais agrandi : un agrandissement ne crée pas de détail, il floute) et
enregistré en WebP dans `public/visages/`. La liste lue par la sphère est
réécrite dans `components/visages.ts`.

Deux fichiers au contenu identique ne comptent qu'une fois : la sphère ne
montre jamais deux fois le même visage.

192 px suffit : un visage mesure au plus 70 px à l'écran (56 sur téléphone),
soit 140 à 168 pixels réels sur les écrans courants. Exporter les portraits à
512 px depuis Figma laisse de la marge.
"""
import hashlib
import pathlib
from PIL import Image, ImageDraw

RACINE = pathlib.Path(__file__).resolve().parent.parent
SOURCE = RACINE / "visages"
SORTIE = RACINE / "public" / "visages"
# Les mêmes visages cerclés de l'anneau néon, pour la sphère : l'anneau est
# dans l'image, le navigateur n'a plus rien à découper à chaque image.
SORTIE_SPHERE = RACINE / "public" / "sphere" / "visages"
LISTE = RACINE / "components" / "visages.ts"
COTE_MAX = 192

SORTIE.mkdir(parents=True, exist_ok=True)
SORTIE_SPHERE.mkdir(parents=True, exist_ok=True)
for dossier in (SORTIE, SORTIE_SPHERE):
    for ancien in dossier.glob("*.webp"):
        ancien.unlink()


def anneau(visage, cote):
    """Le visage dans un anneau rose, violet, bleu (diagonale à 135°)."""
    k = 4  # calcul à 4x, puis réduction : bords lisses
    grand = cote * k
    epaisseur = max(2, round(cote * 0.036)) * k
    # Le dégradé diagonal de l'anneau
    degrade = Image.new("RGBA", (grand, grand))
    px = degrade.load()
    couleurs = [(0xFF, 0x4F, 0xD8), (0x9B, 0x5C, 0xFF), (0x3F, 0x7B, 0xFF)]
    for y in range(0, grand, k):
        for x in range(0, grand, k):
            t = (x + y) / (2 * grand)
            if t < 0.55:
                a, b, u = couleurs[0], couleurs[1], t / 0.55
            else:
                a, b, u = couleurs[1], couleurs[2], (t - 0.55) / 0.45
            c = tuple(round(a[i] + (b[i] - a[i]) * u) for i in range(3)) + (255,)
            for dy in range(k):
                for dx in range(k):
                    px[x + dx, y + dy] = c
    disque = Image.new("L", (grand, grand), 0)
    ImageDraw.Draw(disque).ellipse((0, 0, grand - 1, grand - 1), fill=255)
    fond = Image.new("RGBA", (grand, grand), (0, 0, 0, 0))
    fond.paste(degrade, (0, 0), disque)
    interieur = grand - 2 * epaisseur
    v = visage.resize((interieur, interieur), Image.LANCZOS)
    masque = Image.new("L", (interieur, interieur), 0)
    ImageDraw.Draw(masque).ellipse((0, 0, interieur - 1, interieur - 1), fill=255)
    fond.paste(v, (epaisseur, epaisseur), masque)
    return fond.resize((cote, cote), Image.LANCZOS)

vus = set()
noms = []
for f in sorted(SOURCE.iterdir()):
    if f.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp"}:
        continue
    im = Image.open(f).convert("RGBA")
    empreinte = hashlib.md5(im.tobytes()).hexdigest()
    if empreinte in vus:
        print(f"  doublon ignoré : {f.name}")
        continue
    vus.add(empreinte)

    cote = min(im.size)
    g = (im.width - cote) // 2
    h = (im.height - cote) // 2
    im = im.crop((g, h, g + cote, h + cote))
    if cote > COTE_MAX:
        im = im.resize((COTE_MAX, COTE_MAX), Image.LANCZOS)
        cote = COTE_MAX

    # Détourage rond, calculé à 4x puis réduit pour un bord lisse.
    masque = Image.new("L", (cote * 4, cote * 4), 0)
    ImageDraw.Draw(masque).ellipse((0, 0, cote * 4 - 1, cote * 4 - 1), fill=255)
    masque = masque.resize((cote, cote), Image.LANCZOS)
    alpha = Image.composite(im.getchannel("A"), Image.new("L", im.size, 0), masque)
    im.putalpha(alpha)

    nom = f"{len(noms) + 1:03d}.webp"
    im.save(SORTIE / nom, "WEBP", quality=80, method=6)
    anneau(im, cote).save(SORTIE_SPHERE / nom, "WEBP", quality=82, method=6)
    noms.append(nom)

LISTE.write_text(
    "// FICHIER GÉNÉRÉ, ne pas modifier à la main.\n"
    "// Régénérer avec : python3 scripts/generer-visages.py\n\n"
    "/** Les visages de la sphère, tous différents. */\n"
    f"export const VISAGES = {noms!r} as const;\n".replace("'", '"')
)
poids = sum((SORTIE / n).stat().st_size for n in noms)
print(f"{len(noms)} visages, {poids // 1024} Ko au total")
