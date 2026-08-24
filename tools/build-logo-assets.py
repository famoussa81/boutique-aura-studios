"""Build deterministic web assets from an official raster logo.

This script never redraws the mark. It only removes the near-white JPEG
background, crops whitespace and exports standard web sizes.
"""

from pathlib import Path
import sys

from PIL import Image, ImageChops, ImageOps


def alpha_logo(source: Path) -> Image.Image:
    image = Image.open(source).convert("RGB")
    gray = ImageOps.grayscale(image)
    # JPEG crée de très faibles pixels gris jusque dans les marges. Une
    # seconde masque plus stricte sert uniquement à calculer le cadrage.
    bbox = gray.point(lambda value: 255 if value < 210 else 0).getbbox()
    if not bbox:
        raise ValueError("Logo vide")
    gray = gray.crop(bbox)
    alpha = ImageOps.invert(gray).point(lambda value: 0 if value < 18 else min(255, (value - 18) * 3))
    rgba = Image.new("RGBA", gray.size, (0, 0, 0, 0))
    rgba.putalpha(alpha)
    return rgba


def contain(image: Image.Image, size: tuple[int, int], padding: int, background=(255, 255, 255, 255)) -> Image.Image:
    canvas = Image.new("RGBA", size, background)
    fitted = image.copy()
    fitted.thumbnail((size[0] - padding * 2, size[1] - padding * 2), Image.Resampling.LANCZOS)
    x = (size[0] - fitted.width) // 2
    y = (size[1] - fitted.height) // 2
    canvas.alpha_composite(fitted, (x, y))
    return canvas


def main() -> None:
    if len(sys.argv) != 4:
        raise SystemExit("usage: build-logo-assets.py <horizontal-logo> <square-logo> <output-dir>")
    horizontal = alpha_logo(Path(sys.argv[1]))
    square = alpha_logo(Path(sys.argv[2]))
    output = Path(sys.argv[3])
    output.mkdir(parents=True, exist_ok=True)

    horizontal.thumbnail((900, 260), Image.Resampling.LANCZOS)
    horizontal.save(output / "tk-shoes-logo.png", optimize=True)
    # En-tête étroit : même fichier officiel, simplement recadré sous le
    # cintre pour garder T&K SHOES lisible sur un téléphone.
    nav = horizontal.crop((0, int(horizontal.height * 0.27), horizontal.width, horizontal.height))
    nav.save(output / "tk-shoes-nav.png", optimize=True)

    icon = contain(square, (512, 512), 48)
    icon.save(output / "tk-shoes-icon-512.png", optimize=True)
    contain(square, (180, 180), 16).convert("RGB").save(output / "apple-touch-icon.png", optimize=True)
    contain(square, (32, 32), 2).save(output / "favicon-32.png", optimize=True)
    icon.save(output / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

    share = Image.new("RGBA", (1200, 630), "white")
    share_logo = horizontal.copy()
    share_logo.thumbnail((760, 310), Image.Resampling.LANCZOS)
    share.alpha_composite(share_logo, ((1200 - share_logo.width) // 2, (630 - share_logo.height) // 2))
    share.convert("RGB").save(output / "tk-shoes-share.jpg", quality=88, optimize=True, progressive=True)


if __name__ == "__main__":
    main()
