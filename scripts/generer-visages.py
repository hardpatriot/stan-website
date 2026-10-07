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
from PIL import Image, ImageChops, ImageDraw, ImageFilter

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


def _degrade_diagonal(taille, couleurs):
    """Dégradé à 135° entre trois couleurs : la première en haut à gauche,
    la dernière en bas à droite. Sans boucle pixel par pixel."""
    v = Image.linear_gradient("L").resize((taille, taille))
    h = v.rotate(90).transpose(Image.FLIP_LEFT_RIGHT)
    lin = ImageChops.add(v, h, scale=2)
    a, b, c = (Image.new("RGBA", (taille, taille), col + (255,)) for col in couleurs)
    premier = lin.point(lambda x: min(255, x * 2))
    second = lin.point(lambda x: max(0, x * 2 - 255))
    return Image.composite(c, Image.composite(b, a, premier), second)


def _vertical(taille, haut, bas):
    """Masque vertical : `haut` en haut, `bas` en bas (0 à 255)."""
    g = Image.linear_gradient("L").resize((taille, taille))
    return g.point(lambda v: round(haut + (bas - haut) * v / 255))


def anneau(visage, cote):
    """Le visage en bulle 3D : ombre portée et anneau néon biseauté.

    Pas de reflet blanc sur la photo : il voilait le visage (retiré le 08/10).

    Tout est dans l'image : la sphère n'affiche qu'une image, sans filtre ni
    découpe à calculer à chaque image.
    """
    k = 4
    S = cote * k
    toile = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    cx, cy = S / 2, S * 0.47
    R = S * 0.455
    w = S * 0.042

    # 1. L'ombre portée, douce, décalée vers le bas : la bulle décolle du fond.
    ombre = Image.new("L", (S, S), 0)
    ImageDraw.Draw(ombre).ellipse((cx - R * 0.94, cy - R * 0.84 + S * 0.07, cx + R * 0.94, cy + R * 1.0 + S * 0.07), fill=150)
    ombre = ombre.filter(ImageFilter.GaussianBlur(S * 0.03))
    toile.paste(Image.new("RGBA", (S, S), (10, 4, 30, 255)), (0, 0), ombre)

    def disque(r):
        m = Image.new("L", (S, S), 0)
        ImageDraw.Draw(m).ellipse((cx - r, cy - r, cx + r, cy + r), fill=255)
        return m

    # 2. L'anneau néon, biseauté : éclairé en haut, plus sombre en bas.
    anneau_rgba = _degrade_diagonal(S, [(0xFF, 0x4F, 0xD8), (0x9B, 0x5C, 0xFF), (0x3F, 0x7B, 0xFF)])
    anneau_rgba = Image.composite(Image.new("RGBA", (S, S), (255, 255, 255, 255)), anneau_rgba, _vertical(S, 80, 0))
    anneau_rgba = Image.composite(Image.new("RGBA", (S, S), (20, 6, 50, 255)), anneau_rgba, _vertical(S, 0, 110))
    toile.paste(anneau_rgba, (0, 0), disque(R))

    # 3. Le visage, légèrement ombré vers le bas pour le volume.
    r = R - w
    v = visage.resize((round(2 * r), round(2 * r)), Image.LANCZOS)
    calque = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    calque.paste(v, (round(cx - r), round(cy - r)))
    calque = Image.composite(Image.new("RGBA", (S, S), (12, 4, 32, 255)), calque, _vertical(S, 0, 45))
    toile.paste(calque, (0, 0), disque(r))

    # 5. Un liseré clair sur le haut de l'anneau : l'arête qui prend la lumière.
    arete = Image.new("L", (S, S), 0)
    ImageDraw.Draw(arete).arc((cx - R + k, cy - R + k, cx + R - k, cy + R - k), 200, 340, fill=170, width=max(1, round(S * 0.008)))
    arete = arete.filter(ImageFilter.GaussianBlur(S * 0.003))
    toile.paste(Image.new("RGBA", (S, S), (255, 255, 255, 255)), (0, 0), arete)

    return toile.resize((cote, cote), Image.LANCZOS)


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
