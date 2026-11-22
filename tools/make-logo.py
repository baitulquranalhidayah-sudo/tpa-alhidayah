#!/usr/bin/env python3
"""Membuat turunan aset logo dari file sumber (crop bulat, favicon, OG image)."""
from PIL import Image, ImageDraw, ImageFont
import os

SRC = "/home/day21/Gambar/watermarked_img_13261785207651445904.png"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "assets", "img")
LOGO_DIR = os.path.join(IMG, "logo")
ICON_DIR = os.path.join(IMG, "icons")
os.makedirs(LOGO_DIR, exist_ok=True)
os.makedirs(ICON_DIR, exist_ok=True)

im = Image.open(SRC).convert("RGB")
W, H = im.size

# --- deteksi bounding box badge (piksel berwarna/gelap, abaikan glow krem) ---
px = im.load()
hsv = im.convert("HSV").load()
def is_fg(p, h):
    s, v = h[1], h[2]
    return s > 45 or v < 150

minx, miny, maxx, maxy = W, H, 0, 0
for y in range(0, H):
    for x in range(0, W):
        if is_fg(px[x, y], hsv[x, y]):
            if x < minx: minx = x
            if y < miny: miny = y
            if x > maxx: maxx = x
            if y > maxy: maxy = y
print("bbox mentah:", minx, miny, maxx, maxy)

cx, cy = (minx + maxx) / 2, (miny + maxy) / 2
r = min(maxx - minx, maxy - miny) / 2
print("pusat:", cx, cy, "radius:", r)

# --- crop persegi dengan sedikit inset agar sisa krem terbuang ---
r = r - 2
box = (int(cx - r), int(cy - r), int(cx + r), int(cy + r))
base = im.crop(box)

def circle_mask(size, scale=4):
    m = Image.new("L", (size*scale, size*scale), 0)
    d = ImageDraw.Draw(m)
    d.ellipse((0, 0, size*scale-1, size*scale-1), fill=255)
    return m.resize((size, size), Image.LANCZOS)

def save_mark(size, name, bg=None, folder=LOGO_DIR):
    img = base.resize((size, size), Image.LANCZOS).convert("RGBA")
    img.putalpha(circle_mask(size))
    if bg:
        canvas = Image.new("RGBA", (size, size), bg)
        canvas.alpha_composite(img)
        img = canvas
    img.save(os.path.join(folder, name))
    print("tulis", name, size)

# aset utama
base.resize((512, 512), Image.LANCZOS).save(os.path.join(LOGO_DIR, "logo-raw.png"))
save_mark(512, "logo-full.png")
save_mark(256, "logo-mark.png")
save_mark(512, "icon-512.png", folder=ICON_DIR)
save_mark(192, "icon-192.png", folder=ICON_DIR)
save_mark(180, "apple-touch-icon.png", bg=(251, 249, 236, 255), folder=ICON_DIR)

# favicon multi-size
icons = []
for s in (16, 32, 48, 64):
    im2 = base.resize((s, s), Image.LANCZOS).convert("RGBA")
    im2.putalpha(circle_mask(s))
    icons.append(im2)
icons[-1].save(os.path.join(ICON_DIR, "favicon.ico"), format="ICO", sizes=[(16,16),(32,32),(48,48),(64,64)])
print("tulis favicon.ico")

# --- OG image 1200x630 ---
og = Image.new("RGB", (1200, 630), (17, 61, 64))
d = ImageDraw.Draw(og)
for y in range(630):
    t = y / 629
    col = (int(17 + (73-17)*t), int(61 + (114-61)*t), int(64 + (100-64)*t))
    d.line([(0, y), (1200, y)], fill=col)

mark = base.resize((300, 300), Image.LANCZOS).convert("RGBA")
mark.putalpha(circle_mask(300))
og.paste(mark, (90, 165), mark)

try:
    f_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf", 58)
    f_sub = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 29)
    f_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 23)
except Exception:
    f_title = f_sub = f_small = ImageFont.load_default()

x = 445
d.text((x, 205), "Baitul Qur'an", font=f_title, fill=(255, 255, 255))
d.text((x, 275), "Al-Hidayah", font=f_title, fill=(213, 173, 103))
d.text((x, 365), "Taman Pendidikan Al-Qur'an", font=f_sub, fill=(231, 198, 129))
d.text((x, 410), "Desa Keluang, Kec. Kuaro, Kab. Paser", font=f_small, fill=(214, 224, 220))
d.text((x, 442), "Kalimantan Timur", font=f_small, fill=(214, 224, 220))
d.rectangle([455, 500, 655, 504], fill=(213, 173, 103))
og.save(os.path.join(LOGO_DIR, "og-image.jpg"), quality=90)
print("tulis og-image.jpg")
