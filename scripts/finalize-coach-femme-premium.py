"""Adopte les dix visuels Coach Femme premium en 1200 x 1600.

Les noms versionnes evitent que le navigateur reutilise les anciennes images
avec fond gris. Les cartes et les selecteurs de coloris recoivent leur copie.
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
GENERATED = Path(r"C:\Users\PC\.codex\generated_images\01a0411b-0d90-7683-b5d5-a2fdbf603a98")

JOBS = {
    "exec-9ffb396f-823f-44fc-89db-153de2bac0b2.png": "coach-badge-beige-premium.jpg",
    "exec-fdec66f7-b014-4f12-9caf-a83f3198fbed.png": "coach-matelassee-bleu-premium.jpg",
    "exec-81ffd1c7-d12f-4700-9c22-8d25615971d1.png": "coach-matelassee-ivoire-premium.jpg",
    "exec-f2aa090a-9364-4a05-8fe8-c0beccba4892.png": "coach-matelassee-noir-premium.jpg",
    "exec-80f77f92-e38f-45fc-8c25-e5b9dcc853c7.png": "coach-matelassee-marron-premium.jpg",
    "exec-d5cb38fd-5b40-4e46-b138-c820fb4e7822.png": "coach-matelassee-rose-premium.jpg",
    "exec-71877095-5e61-44ff-98e9-2bacb1c2c3a2.png": "coach-mule-boucle-marron-premium.jpg",
    "exec-cc6bff40-2362-4da4-aa45-71b7c9ad82aa.png": "coach-mule-boucle-argent-premium.jpg",
    "exec-320af28b-4b0b-4f0f-b506-6730df4e24e9.png": "coach-mule-boucle-ivoire-premium.jpg",
    "exec-67729473-e3c4-4d17-a7a8-3b78b13e0a28.png": "coach-signature-marron-premium.jpg",
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


for source_name, filename in JOBS.items():
    image = Image.open(GENERATED / source_name).convert("RGB")
    image = pure_white_background(vertical_three_four(image))
    relative = Path("femme") / filename
    product = ROOT / "assets" / "products" / relative
    image.save(product, quality=93, optimize=True, progressive=True)
    for group in ("cards", "colors"):
        thumb = ROOT / "assets" / "thumbs" / group / "products" / relative
        thumb.parent.mkdir(parents=True, exist_ok=True)
        image.save(thumb, quality=88, optimize=True, progressive=True)
    print(product.relative_to(ROOT))
