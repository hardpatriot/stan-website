"""
Prépare les visages de la sphère.

Dépose les portraits dans `visages/` (PNG, JPG ou WebP, carrés de préférence),
puis lance :

    python3 scripts/generer-visages.py

Chaque visage est recadré au carré, détouré en rond, réduit à 256 px au plus
(jamais agrandi : un agrandissement ne crée pas de détail, il floute) et
enregistré en WebP dans `public/visages/`. La liste lue par la sphère est
réécrite dans `components/visages.ts`.

Deux fichiers au contenu identique ne comptent qu'une fois : la sphère ne
montre jamais deux fois le même visage.

256 px suffit : un visage mesure au plus 70 px à l'écran (56 sur téléphone),
soit 210 pixels réels sur l'écran le plus dense. Exporter les portraits à
512 px depuis Figma laisse de la marge.
"""
import hashlib
import pathlib
from PIL import Image, ImageDraw

RACINE = pathlib.Path(__file__).resolve().parent.parent
SOURCE = RACINE / "visages"
SORTIE = RACINE / "public" / "visages"
LISTE = RACINE / "components" / "visages.ts"
COTE_MAX = 256

SORTIE.mkdir(parents=True, exist_ok=True)
for ancien in SORTIE.glob("*.webp"):
    ancien.unlink()

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
    im.save(SORTIE / nom, "WEBP", quality=86, method=6)
    noms.append(nom)

LISTE.write_text(
    "// FICHIER GÉNÉRÉ, ne pas modifier à la main.\n"
    "// Régénérer avec : python3 scripts/generer-visages.py\n\n"
    "/** Les visages de la sphère, tous différents. */\n"
    f"export const VISAGES = {noms!r} as const;\n".replace("'", '"')
)
poids = sum((SORTIE / n).stat().st_size for n in noms)
print(f"{len(noms)} visages, {poids // 1024} Ko au total")
