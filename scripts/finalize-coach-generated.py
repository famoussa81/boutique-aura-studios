"""Normalise les générations Coach retenues en visuels boutique 1200 × 1600.

Le script ne redessine pas les produits : il recadre le blanc excédentaire,
uniformise uniquement les pixels de fond presque blancs et produit les copies
utilisées par les cartes et les sélecteurs de coloris.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
GENERATED = Path(r"C:\Users\PC\.codex\generated_images\01a0411b-0d90-7683-b5d5-a2fdbf603a98")

JOBS = {
    "exec-06510548-35db-4499-bea9-2b3457372fcb.png": "homme/coach-sabot-boucle-marron-studio.jpg",
    "exec-699de841-7191-468b-b744-5b071485815d.png": "homme/coach-sabot-boucle-noir-studio.jpg",
    "exec-d764633e-13d0-45fd-a315-9c0732f550db.png": "homme/coach-sabot-boucle-bleu-studio.jpg",
    "exec-1b35ea0b-dad8-4dc4-89e8-3df551ca95b6.png": "femme/coach-double-bride-rose-studio.jpg",
    "exec-672ac7a1-f5a3-4fbe-96fe-ae73020f7fb4.png": "homme/coach-slide-signature-beige-studio.jpg",
    "exec-740acf59-ff90-4c45-887d-f26dbab663de.png": "homme/coach-slide-signature-bleu-studio.jpg",
    "exec-65f0e968-11e2-4215-bb1c-d36770cf2cf9.png": "homme/coach-slide-signature-marine-studio.jpg",
    "exec-96c64e64-fb80-41b3-8a41-75e967bd87ec.png": "homme/coach-slide-signature-olive-studio.jpg",
}


def vertical_three_four(image):
    target_ratio = 3 / 4
    if image.width / image.height < target_ratio:
        height = round(image.width / target_ratio)
        top = max(0, (image.height - height) // 2)
        image = image.crop((0, top, image.width, top + height))
    elif image.width / image.height > target_ratio:
        width = round(image.height * target_ratio)
        left = max(0, (image.width - width) // 2)
        image = image.crop((left, 0, left + width, image.height))
    return image.resize((1200, 1600), Image.Resampling.LANCZOS)


def pure_white_background(image):
    pixels = image.load()
    for y in range(image.height):
        for x in range(image.width):
            red, green, blue = pixels[x, y]
            if min(red, green, blue) >= 248:
                pixels[x, y] = (255, 255, 255)
    return image


for source_name, relative in JOBS.items():
    image = Image.open(GENERATED / source_name).convert("RGB")
    image = pure_white_background(vertical_three_four(image))
    product = ROOT / "assets" / "products" / relative
    product.parent.mkdir(parents=True, exist_ok=True)
    image.save(product, quality=93, optimize=True, progressive=True)
    for group in ("cards", "colors"):
        thumb = ROOT / "assets" / "thumbs" / group / "products" / relative
        thumb.parent.mkdir(parents=True, exist_ok=True)
        image.save(thumb, quality=88, optimize=True, progressive=True)
    print(product.relative_to(ROOT))
