#!/usr/bin/env python3
"""Mağaza görselleri: icon 1024, adaptive-icon 1024, splash 1284x2778."""

from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    raise SystemExit("Pillow gerekli: pip3 install Pillow")

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"

BG = (10, 10, 15)
PRIMARY = (99, 102, 241)
REAL = (34, 197, 94)
AI = (244, 63, 94)
TEXT = (244, 244, 245)


def load_font(size: int):
    for name in (
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/Library/Fonts/Arial Bold.ttf",
    ):
        p = Path(name)
        if p.exists():
            try:
                return ImageFont.truetype(str(p), size)
            except OSError:
                continue
    return ImageFont.load_default()


def draw_icon(size: int) -> Image.Image:
    img = Image.new("RGBA", (size, size), BG + (255,))
    d = ImageDraw.Draw(img)
    pad = size * 0.12
    r = (size - pad * 2) / 2
    cx, cy = size / 2, size / 2
    d.rounded_rectangle(
        (pad, pad, size - pad, size - pad),
        radius=int(size * 0.18),
        outline=PRIMARY,
        width=max(2, int(size * 0.012)),
    )
    half_w = r * 0.38
    d.pieslice(
        (cx - r, cy - r, cx, cy + r),
        start=90,
        end=270,
        fill=REAL + (255,),
    )
    d.pieslice(
        (cx, cy - r, cx + r, cy + r),
        start=270,
        end=90,
        fill=AI + (255,),
    )
    d.line([(cx, cy - r * 0.85), (cx, cy + r * 0.85)], fill=TEXT + (180,), width=max(2, int(size * 0.008)))
    font = load_font(int(size * 0.11))
    d.text((cx, cy), "?", fill=TEXT + (255,), font=font, anchor="mm")
    return img


def draw_splash() -> Image.Image:
    w, h = 1284, 2778
    img = Image.new("RGBA", (w, h), BG + (255,))
    icon = draw_icon(512)
    ix = (w - 512) // 2
    iy = int(h * 0.32)
    img.paste(icon, (ix, iy), icon)
    d = ImageDraw.Draw(img)
    title_font = load_font(72)
    sub_font = load_font(36)
    d.text((w // 2, iy + 580), "Human or AI?", fill=TEXT + (255,), font=title_font, anchor="mm")
    d.text((w // 2, iy + 660), "Can you tell the difference?", fill=(161, 161, 170, 255), font=sub_font, anchor="mm")
    return img


def main():
    ASSETS.mkdir(parents=True, exist_ok=True)
    draw_icon(1024).save(ASSETS / "icon.png", "PNG", optimize=True)
    draw_icon(1024).save(ASSETS / "adaptive-icon.png", "PNG", optimize=True)
    draw_splash().save(ASSETS / "splash.png", "PNG", optimize=True)
    print("Generated:", ASSETS / "icon.png", ASSETS / "adaptive-icon.png", ASSETS / "splash.png")


if __name__ == "__main__":
    main()
