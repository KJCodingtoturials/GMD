"""
Generates the optimised web images used by the site from the original source files.

Run from the project root:  python scripts/make-images.py

Sources (kept untouched):  khubaib.png, logo.jpeg, cert*.jpeg
Outputs (img/):            founder.webp, founder-lg.webp, gm-mark.png, favicon.png,
                           og-cover.jpg, cert-*.webp
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "img"
OUT.mkdir(exist_ok=True)

# ---------------------------------------------------------------- founder portrait
# khubaib.png is a designed poster (text on the left, portrait on the right).
# We crop only the portrait so the page can carry its own typography.
src = Image.open(ROOT / "khubaib.png").convert("RGB")
W, H = src.size  # 2160 x 2700

# Paint out the poster typography that bleeds into the crop, using the poster's own backdrop colour.
backdrop = src.getpixel((int(W * 0.43), int(H * 0.30)))
clean = src.copy()
cd = ImageDraw.Draw(clean)
cd.rectangle((int(W * 0.40), int(H * 0.46), int(W * 0.495), int(H * 0.575)), fill=backdrop)   # tail of the name
cd.rectangle((int(W * 0.40), int(H * 0.655), int(W * 0.495), int(H * 0.725)), fill=backdrop)  # skill chip
portrait = clean.crop((int(W * 0.43), 0, W, int(H * 0.78)))

def save_width(img, name, width, quality=82):
    ratio = width / img.width
    out = img.resize((width, round(img.height * ratio)), Image.LANCZOS)
    out.save(OUT / name, "WEBP", quality=quality, method=6)
    print(f"{name}: {out.size}")
    return out

save_width(portrait, "founder.webp", 720)
save_width(portrait, "founder-lg.webp", 1100, 80)

# ---------------------------------------------------------------- GM monogram (transparent)
logo = Image.open(ROOT / "logo.jpeg").convert("RGB")
mark = logo.crop((340, 70, 840, 440))
# Turn the black backdrop into alpha so the glowing mark sits cleanly on any dark surface.
rgba = Image.new("RGBA", mark.size)
px_in, px_out = mark.load(), rgba.load()
for y in range(mark.height):
    for x in range(mark.width):
        r, g, b = px_in[x, y]
        a = max(r, g, b)
        if a < 14:
            px_out[x, y] = (0, 0, 0, 0)
        else:
            f = 255 / a
            px_out[x, y] = (min(255, int(r * f)), min(255, int(g * f)), min(255, int(b * f)), a)
rgba = rgba.crop(rgba.getbbox())
side = max(rgba.size)
square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
square.paste(rgba, ((side - rgba.width) // 2, (side - rgba.height) // 2))
square.resize((160, 160), Image.LANCZOS).save(OUT / "gm-mark.png", optimize=True)
fav = Image.new("RGBA", (96, 96), (6, 9, 15, 255))
small = square.resize((78, 78), Image.LANCZOS)
fav.paste(small, (9, 9), small)
fav.save(OUT / "favicon.png", optimize=True)
print("gm-mark.png, favicon.png")

# ---------------------------------------------------------------- certificates
for name, target in (("cert 1.jpeg", "cert-shopify-meta-ads.webp"),
                     ("cert.jpeg", "cert-meta-ads.webp"),
                     ("cert 3.jpeg", "cert-ai-social.webp")):
    im = Image.open(ROOT / name).convert("RGB")
    out = save_width(im, target, 900, 80)

# ---------------------------------------------------------------- Open Graph cover (1200x630)
bg = Image.new("RGB", (1200, 630), (6, 9, 15))
glow = Image.new("RGB", (1200, 630), (6, 9, 15))
d = ImageDraw.Draw(glow)
d.ellipse((620, -120, 1320, 560), fill=(18, 70, 120))
glow = glow.filter(ImageFilter.GaussianBlur(120))
bg = Image.blend(bg, glow, 0.9)
ph = portrait.copy()
ph.thumbnail((900, 630))
ph = ph.resize((int(630 * ph.width / ph.height), 630), Image.LANCZOS)
mask = Image.linear_gradient("L").rotate(90).resize(ph.size)  # fade portrait into the left
bg.paste(ph, (1200 - ph.width, 0), mask)
d = ImageDraw.Draw(bg)

def font(names, size):
    for n in names:
        try:
            return ImageFont.truetype(n, size)
        except OSError:
            continue
    return ImageFont.load_default()

bold = ["segoeuib.ttf", "arialbd.ttf"]
reg = ["segoeui.ttf", "arial.ttf"]
d.text((72, 96), "GROWTH MATRIX DIGITAL", font=font(bold, 26), fill=(120, 205, 255))
d.text((72, 160), "Abu Khubaib", font=font(bold, 84), fill=(244, 247, 251))
d.text((72, 252), "Yaseen", font=font(bold, 84), fill=(244, 247, 251))
d.text((72, 372), "Meta Ads strategy, a free youth skills\nprogram and free consultations.", font=font(reg, 32), fill=(160, 176, 196), spacing=10)
d.rectangle((72, 520, 232, 524), fill=(232, 184, 74))
bg.save(OUT / "og-cover.jpg", quality=86, optimize=True)
print("og-cover.jpg")
