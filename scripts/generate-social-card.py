"""Regenerate the portrait-free 1200×630 social card using the site's local fonts.

Requires Pillow: python3 -m pip install Pillow
Run from the repository root: python3 scripts/generate-social-card.py
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
SCALE = 2
WIDTH, HEIGHT = 1200, 630
PAPER = (250, 249, 246)
INK = (35, 45, 43)
ACCENT = (23, 86, 82)
SOFT = (92, 104, 102)
LINE = (211, 220, 216)


def font(filename: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(ROOT / "public" / "fonts" / filename, size * SCALE)


image = Image.new("RGB", (WIDTH * SCALE, HEIGHT * SCALE), PAPER)
draw = ImageDraw.Draw(image)


def text(x: int, y: int, label: str, typeface: ImageFont.FreeTypeFont, color=INK):
    draw.text((x * SCALE, y * SCALE), label, font=typeface, fill=color)


text(76, 60, "Quintero-L, O.", font("ClashDisplay-Variable.ttf", 43), ACCENT)
draw.line((76 * SCALE, 148 * SCALE, 1124 * SCALE, 148 * SCALE), fill=LINE, width=2 * SCALE)

text(76, 189, "BIOLOGÍA   ·   COMPUTACIÓN   ·   SISTEMAS", font("Satoshi-Variable.ttf", 22), ACCENT)
text(76, 260, "Quintero-L, O.", font("ClashDisplay-Variable.ttf", 108), INK)
text(80, 430, "Oscar Alexis Quintero López", font("Satoshi-Variable.ttf", 32), SOFT)

draw.line((76 * SCALE, 529 * SCALE, 1124 * SCALE, 529 * SCALE), fill=LINE, width=2 * SCALE)
text(76, 554, "INVESTIGACIÓN  /  RESEARCH", font("Satoshi-Variable.ttf", 21), ACCENT)
text(924, 554, "oquinterol.com", font("Satoshi-Variable.ttf", 21), SOFT)

image.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS).save(
    ROOT / "public" / "social-card.png", optimize=True
)
