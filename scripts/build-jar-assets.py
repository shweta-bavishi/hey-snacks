"""
Builds the derived image assets for the §06 jar story.

    python3 scripts/build-jar-assets.py [--peanut path/to/peanut.png]

Inputs are the photographed cutouts already in public/jar/. Outputs:

  public/jar/peanut.webp         only with --peanut: re-cut from a new photo
  public/jar/coated/<kind>.webp  each sprite dusted in masala, for the post-shake jar
  public/jar/fill/<band>.webp    dense, shaded "back of the jar" pile, one per pour band
  public/jar/fill/mixed.webp     the same, after the shake: everything mixed and coated
  public/jar/masala-cloud.webp   loose powder cloud that drifts into the jar

Everything is seeded, so re-running gives byte-stable output for the same inputs.
Band geometry here mirrors BAND in src/data/jarStoryBeats.ts: keep them in sync.
"""

import argparse
import math
import os
import random

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JAR = os.path.join(ROOT, "public", "jar")
SPRITE_PX = 288
SPRITE_MARGIN = 3

# The particle field is the glass interior of jar-glass.webp (inset 24% 10% 7% 11%
# of a 520x786 photo), so 411 x 542. Rendered a little above that for retina.
FIELD_W, FIELD_H = 480, 633

SPRITES = {
    "makhana": ["makhana-1", "makhana-2", "makhana-3"],
    "almond": ["almond-1", "almond-2"],
    "cashew": ["cashew-1", "cashew-2"],
    "peanut": ["peanut"],
    "seed": ["seed-pumpkin", "seed-sunflower"],
}

# Percent of field width a sprite box spans. Same numbers as particleSize.
SIZE = {"makhana": 24, "almond": 25, "cashew": 25, "peanut": 21, "seed": 15}

# Percent of field height, centre of each piece. Same as BAND in jarStoryBeats.
BANDS = [
    ("makhana", 70, 98),
    ("almond", 55, 70),
    ("cashew", 43, 56),
    ("peanut", 32, 45),
    ("seed", 22, 33),
]
MIXED_BAND = (17, 98)

# Roasted masala: a golden turmeric-and-chilli dust, the colour of the
# reference shot of the finished mix, not a pink-orange wash.
POWDER = np.array([0.97, 0.66, 0.30])
POWDER_DUST = np.array([0.86, 0.55, 0.26])
# Everything comes out of the roaster a shade warmer and deeper.
ROAST = np.array([1.0, 0.94, 0.84])
# Mostly dark spice grains (pepper, roasted chilli), a few red, a little haldi.
# Bright confetti colours read as sprinkles, not seasoning.
SPECKS = [
    ((46, 26, 16), 0.34),  # kali mirch
    ((110, 32, 18), 0.28),  # roasted chilli, near pataka-sh
    ((150, 64, 28), 0.22),  # red-brown masala
    ((190, 58, 32), 0.12),  # lal mirch
    ((196, 130, 10), 0.04),  # haldi, malai-sh
]


def load(name):
    return Image.open(os.path.join(JAR, name + ".webp")).convert("RGBA")


def save(img, *parts, quality=82):
    path = os.path.join(JAR, *parts)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, "WEBP", quality=quality, method=6, alpha_quality=90)
    print("wrote", os.path.relpath(path, ROOT), f"{os.path.getsize(path) // 1024}KB")


def smooth_noise(rng, size, cells):
    """Value noise: a tiny random grid scaled up with bicubic. 0..1."""
    small = Image.fromarray((rng.random((cells, cells)) * 255).astype(np.uint8))
    return np.asarray(small.resize(size, Image.BICUBIC), dtype=np.float32) / 255


def pick_speck(rng):
    r = rng.random()
    for colour, weight in SPECKS:
        r -= weight
        if r <= 0:
            return colour
    return SPECKS[0][0]


# ---------------------------------------------------------------- peanut ----


def cut_sprite(src_path):
    """Crop to the opaque bounds and pad to the same square every sprite uses."""
    im = Image.open(src_path).convert("RGBA")
    alpha = im.getchannel("A").point(lambda v: 255 if v > 32 else 0)
    im = im.crop(alpha.getbbox())
    # Kill the faint halo left by the background removal.
    a = np.asarray(im.getchannel("A"), dtype=np.float32)
    a = np.clip((a - 24) * (255 / 231), 0, 255).astype(np.uint8)
    im.putalpha(Image.fromarray(a))
    inner = SPRITE_PX - SPRITE_MARGIN * 2
    scale = inner / max(im.size)
    im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    out = Image.new("RGBA", (SPRITE_PX, SPRITE_PX), (0, 0, 0, 0))
    out.alpha_composite(im, ((SPRITE_PX - im.width) // 2, (SPRITE_PX - im.height) // 2))
    return out


# ---------------------------------------------------------------- coating ---


def coat(sprite, seed):
    """
    Dust a sprite in masala the way a tumbled snack actually looks: a
    multiplied orange cast that keeps the photo's own shading, heavier in the
    creases where powder collects, patchy rather than painted on, a thin matte
    dust layer so it still reads on a black sunflower husk, then flakes.
    """
    rng = np.random.default_rng(seed)
    arr = np.asarray(sprite, dtype=np.float32) / 255
    rgb, a = arr[..., :3], arr[..., 3]
    size = sprite.size

    lum = rgb @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
    lum_img = Image.fromarray((lum * 255).astype(np.uint8))
    local = np.asarray(lum_img.filter(ImageFilter.GaussianBlur(7)), dtype=np.float32) / 255
    crease = np.clip((local - lum) * 5, 0, 1)

    patches = smooth_noise(rng, size, 7) * 0.65 + smooth_noise(rng, size, 22) * 0.35
    # Tumbled in a drum, so the coat is even all over with only gentle patches.
    cover = np.clip(0.78 + (patches - 0.5) * 0.55 + crease * 0.3, 0.5, 1.0)
    # Pale makhana takes the colour hardest; dark nuts mostly show dust.
    strength = 0.6 + 0.35 * np.clip(lum * 1.4 - 0.2, 0, 1)
    k = (cover * strength)[..., None]

    tinted = rgb * ROAST * (1 - k * (1 - POWDER))
    # Darker nuts roast darker still (almonds, peanut skins go deep brown).
    tinted = tinted * (0.8 + 0.2 * np.clip(lum * 1.6, 0, 1))[..., None]
    dust = (cover * 0.12 + crease * 0.08)[..., None]
    tinted = tinted * (1 - dust) + POWDER_DUST * dust

    out = Image.fromarray((np.dstack([np.clip(tinted, 0, 1), a]) * 255).astype(np.uint8))

    # Flakes and grains, clipped to the sprite so nothing floats off the edge.
    flakes = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(flakes)
    solid = np.argwhere(a > 0.92)
    if len(solid):
        count = int(len(solid) / 220)
        for _ in range(count):
            y, x = solid[rng.integers(len(solid))]
            colour = pick_speck(rng)
            alpha = int(170 + rng.random() * 80)
            r = 0.9 + rng.random() ** 2.8 * 3.2
            if r > 2.9:
                # A chilli flake: an irregular shard, not a dot.
                n = int(rng.integers(4, 7))
                rot = rng.random() * math.tau
                pts = [
                    (
                        x + math.cos(rot + i / n * math.tau) * r * (0.55 + rng.random() * 0.6),
                        y + math.sin(rot + i / n * math.tau) * r * (0.35 + rng.random() * 0.5),
                    )
                    for i in range(n)
                ]
                draw.polygon(pts, fill=colour + (alpha,))
            else:
                draw.ellipse((x - r, y - r * 0.85, x + r, y + r * 0.85), fill=colour + (alpha,))
    fa = np.asarray(flakes, dtype=np.float32)
    fa[..., 3] *= a
    out.alpha_composite(Image.fromarray(fa.astype(np.uint8)))
    return out


# ---------------------------------------------------------------- fill ------


def best_candidate(rnd, count, region, k=14):
    """Mitchell's best-candidate: an even scatter with no grid and no clumps."""
    x0, x1, y_of_x, y1 = region
    pts = []
    for _ in range(count):
        best, best_d = None, -1.0
        for _ in range(k if pts else 1):
            x = x0 + rnd.random() * (x1 - x0)
            y = y_of_x(x) + rnd.random() * (y1 - y_of_x(x))
            d = min(((x - px) ** 2 + ((y - py) * FIELD_H / FIELD_W) ** 2 for px, py in pts), default=1.0)
            if d > best_d:
                best, best_d = (x, y), d
        pts.append(best)
    return pts


def mound(y_top, rise=6.0):
    """A poured pile is higher in the middle than against the glass."""
    return lambda x: y_top + rise * ((x - 50) / 50) ** 2


def place(canvas, sprite, x, y, size_pct, scale, rotation):
    px = max(4, round(FIELD_W * size_pct / 100 * scale))
    img = sprite.resize((px, px), Image.LANCZOS).rotate(rotation, Image.BICUBIC, expand=True)
    canvas.alpha_composite(img, (round(FIELD_W * x / 100 - img.width / 2), round(FIELD_H * y / 100 - img.height / 2)))


def recede(canvas, light=0.68):
    """The back of the pile: further from the glass, so darker, flatter, softer."""
    arr = np.asarray(canvas, dtype=np.float32)
    rgb, a = arr[..., :3], arr[..., 3:]
    grey = rgb @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
    rgb = rgb * 0.92 + grey[..., None] * 0.08
    rgb = rgb * light * np.array([1.0, 0.94, 0.88], dtype=np.float32)
    img = Image.fromarray(np.dstack([rgb, a]).clip(0, 255).astype(np.uint8))
    return img.filter(ImageFilter.GaussianBlur(0.8))


def density(kind, y0, y1):
    """Enough pieces to cover the band about 3 times over, so no glass shows through."""
    side = FIELD_W * SIZE[kind] / 100 * 0.75
    area = FIELD_W * 0.92 * FIELD_H * (y1 - y0 + 6) / 100
    return max(6, int(area / (side * side) * 3))


def build_band(kind, y0, y1, sprites, seed):
    rnd = random.Random(seed)
    canvas = Image.new("RGBA", (FIELD_W, FIELD_H), (0, 0, 0, 0))
    # Reaches down into the band below so the two interlock instead of leaving a seam.
    pts = best_candidate(rnd, density(kind, y0, y1 + 3), (-4, 104, mound(y0 - 3), y1 + 3))
    for i, (x, y) in enumerate(pts):
        place(canvas, sprites[kind][i % len(sprites[kind])], x, y, SIZE[kind], 0.82 + rnd.random() * 0.26, rnd.uniform(-180, 180))
    return recede(canvas)


def build_mixed(coated, seed):
    """Every kind in its recipe share, shuffled through the whole fill, all coated."""
    rnd = random.Random(seed)
    canvas = Image.new("RGBA", (FIELD_W, FIELD_H), (0, 0, 0, 0))
    # Seeds are over-represented by count because they are small: they are
    # what fills the gaps between the big pieces, as in a real bowl of the mix.
    recipe = ["makhana"] * 5 + ["almond"] * 3 + ["cashew"] * 3 + ["peanut"] * 5 + ["seed"] * 9
    y0, y1 = MIXED_BAND
    total = round(sum(density(k, y0, y1) for k in recipe) / len(recipe) * 2.4)
    pts = best_candidate(rnd, total, (-4, 104, mound(y0 - 3), y1 + 4))
    rnd.shuffle(pts)
    for i, (x, y) in enumerate(pts):
        kind = recipe[i % len(recipe)]
        choices = coated[kind]
        place(canvas, choices[i % len(choices)], x, y, SIZE[kind], 0.82 + rnd.random() * 0.26, rnd.uniform(-180, 180))
    # Lighter than the pour bands: the finished jar should read as a full,
    # appetising mix, closer to the reference bowl than to a dim cut-away.
    return recede(canvas, light=0.84)


# ---------------------------------------------------------------- cloud -----


def build_cloud(seed):
    """A drift of loose powder: grains, not a blurred blob, so no gradient."""
    rng = np.random.default_rng(seed)
    w = h = 520
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    for _ in range(5200):
        x = rng.normal(0.5, 0.17) * w
        y = rng.normal(0.5, 0.15) * h
        if not (0 <= x < w and 0 <= y < h):
            continue
        dist = math.hypot((x / w - 0.5) / 0.17, (y / h - 0.5) / 0.15)
        alpha = int(np.clip(235 - dist * 70, 40, 235))
        r = 0.7 + rng.random() ** 3 * 2.6
        draw.ellipse((x - r, y - r, x + r, y + r), fill=pick_speck(rng) + (alpha,))
    return img


# ---------------------------------------------------------------- main ------


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--peanut", help="new peanut photo on a transparent background")
    args = parser.parse_args()

    if args.peanut:
        save(cut_sprite(args.peanut), "peanut.webp", quality=88)

    sprites = {kind: [load(n) for n in names] for kind, names in SPRITES.items()}
    coated = {}
    for kind, names in SPRITES.items():
        coated[kind] = []
        for i, name in enumerate(names):
            img = coat(sprites[kind][i], seed=sum(map(ord, name)))
            save(img, "coated", name + ".webp", quality=84)
            coated[kind].append(img)

    for i, (kind, y0, y1) in enumerate(BANDS):
        save(build_band(kind, y0, y1, sprites, seed=100 + i), "fill", kind + ".webp", quality=72)
    save(build_mixed(coated, seed=777), "fill", "mixed.webp", quality=74)
    save(build_cloud(seed=31), "masala-cloud.webp", quality=80)


if __name__ == "__main__":
    main()
