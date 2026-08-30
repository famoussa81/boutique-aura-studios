"""Prépare des visuels Coach sans modifier le produit ni ses marquages.

Le script ne génère rien : il cadre les pixels d'une photographie source
validée sur un fond #FFFFFF. Il sert seulement aux modèles où une vraie paire
est déjà visible dans le lot Telegram.
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(r"C:\Users\PC\Downloads\Telegram Desktop")
JOBS = {
    "homme/coach-slide-signature-noir-studio.jpg": "photo_41_2026-08-29_04-26-18.jpg",
}


def subject_box(image):
    # Le fond gris clair de la photo 41 est supprimé ensuite. Ici, seuil plus
    # bas pour cadrer la paire, sans transformer les pixels du produit.
    mask = image.convert("L").point(lambda value: 255 if value < 220 else 0)
    box = mask.getbbox()
    if not box:
        return (0, 0, image.width, image.height)
    left, top, right, bottom = box
    padding = 18
    return (
        max(0, left - padding), max(0, top - padding),
        min(image.width, right + padding), min(image.height, bottom + padding),
    )


def clean_background(image):
    """Remplace seulement le fond clair par #FFFFFF, sans dessiner le produit."""
    pixels = image.load()
    for y in range(image.height):
        for x in range(image.width):
            red, green, blue = pixels[x, y]
            if min(red, green, blue) >= 220:
                pixels[x, y] = (255, 255, 255)
    return image


def prepare(src, dest):
    image = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    image = image.crop(subject_box(image))
    image = clean_background(image)
    scale = min(1080 / image.width, 1120 / image.height)
    size = (max(1, round(image.width * scale)), max(1, round(image.height * scale)))
    image = image.resize(size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", (1200, 1600), "#FFFFFF")
    x = (canvas.width - image.width) // 2
    y = (canvas.height - image.height) // 2
    canvas.paste(image, (x, y))
    dest.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(dest, quality=92, optimize=True, progressive=True)


for rel, source_name in JOBS.items():
    output = ROOT / "assets" / "products" / rel
    prepare(SOURCE / source_name, output)
    thumb_rel = rel.replace("femme/", "femme/").replace("homme/", "homme/")
    for group in ("cards", "colors"):
        target = ROOT / "assets" / "thumbs" / group / "products" / thumb_rel
        target.parent.mkdir(parents=True, exist_ok=True)
        Image.open(output).save(target, quality=88, optimize=True, progressive=True)
    print(output.relative_to(ROOT))
