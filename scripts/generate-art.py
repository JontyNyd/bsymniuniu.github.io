#!/usr/bin/env python3
"""生成《榜上有名》本地美术资源（无需外网）。"""
from __future__ import annotations

import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "images"


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def make_parchment() -> None:
    w, h = 512, 512
    img = Image.new("RGB", (w, h), (212, 188, 142))
    px = img.load()
    rng = random.Random(42)
    for y in range(h):
        for x in range(w):
            n = rng.random()
            fiber = math.sin(x * 0.08 + y * 0.03) * 6
            stain = max(0, 1 - math.hypot(x - 380, y - 120) / 180) * 18
            edge = min(x, y, w - x, h - y) / 40
            edge = min(1, edge)
            r = int(lerp(175, 228, n * 0.35 + fiber * 0.02 + edge * 0.15) - stain)
            g = int(lerp(148, 198, n * 0.3 + fiber * 0.02 + edge * 0.12) - stain * 0.8)
            b = int(lerp(98, 150, n * 0.25 + fiber * 0.015 + edge * 0.1) - stain * 0.6)
            px[x, y] = (max(0, min(255, r)), max(0, min(255, g)), max(0, min(255, b)))
    img = img.filter(ImageFilter.GaussianBlur(0.6))
    draw = ImageDraw.Draw(img)
    for _ in range(12):
        cx, cy = rng.randint(40, w - 40), rng.randint(40, h - 40)
        rx, ry = rng.randint(30, 90), rng.randint(20, 60)
        color = (rng.randint(150, 185), rng.randint(125, 160), rng.randint(80, 115), 35)
        tmp = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        tdraw = ImageDraw.Draw(tmp)
        tdraw.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=color)
        img = Image.alpha_composite(img.convert("RGBA"), tmp).convert("RGB")
    draw = ImageDraw.Draw(img)
    for i in range(0, w, 64):
        draw.line([(i, 0), (i + 20, h)], fill=(180, 155, 110), width=1)
    out = OUT / "parchment.png"
    img.save(out, optimize=True)
    print(f"wrote {out} ({out.stat().st_size} bytes)")


def roof_point(x: float, span: float, peak: float, curve: float) -> tuple[float, float]:
    t = x / span
    y = peak * (1 - (2 * abs(t - 0.5)) ** curve)
    return x, y


def make_chinese_roof() -> None:
    w, h = 480, 160
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    body = (58, 36, 22, 255)
    tile = (92, 58, 34, 255)
    highlight = (168, 118, 52, 220)
    gold = (201, 162, 39, 255)

    base_y = 118
    span = 440
    ox = 20

    def eave_points(side: str) -> list[tuple[int, int]]:
        pts: list[tuple[int, int]] = []
        steps = 80
        for i in range(steps + 1):
            t = i / steps
            if side == "left":
                x = ox + span * 0.5 * (1 - t)
            else:
                x = ox + span * 0.5 + span * 0.5 * t
            rel = abs(x - (ox + span * 0.5)) / (span * 0.5)
            lift = (rel ** 1.6) * 42
            ridge_drop = (1 - rel) * 36
            y = base_y - ridge_drop - lift * 0.15
            if side == "left" and t < 0.12:
                y -= (0.12 - t) / 0.12 * 18
            if side == "right" and t > 0.88:
                y -= (t - 0.88) / 0.12 * 18
            pts.append((int(x), int(y)))
        return pts

    left = eave_points("left")
    right = eave_points("right")
    ridge_top = min(p[1] for p in left + right) - 8
    poly = left + [(ox + span // 2, ridge_top)] + list(reversed(right)) + [(ox + span, base_y), (ox, base_y)]
    draw.polygon(poly, fill=body)

    for side_pts in (left, right):
        for i in range(0, len(side_pts) - 1, 3):
            x1, y1 = side_pts[i]
            x2, y2 = side_pts[min(i + 3, len(side_pts) - 1)]
            draw.line([(x1, y1 + 4), (x2, y2 + 4)], fill=tile, width=2)

    draw.line(left, fill=highlight, width=3)
    draw.line(right, fill=highlight, width=3)
    draw.ellipse((ox + span // 2 - 14, ridge_top - 10, ox + span // 2 + 14, ridge_top + 10), fill=gold)
    draw.rectangle((ox + span // 2 - 3, ridge_top - 22, ox + span // 2 + 3, ridge_top + 4), fill=gold)

    for tip_x in (ox + 6, ox + span - 6):
        draw.polygon(
            [(tip_x, base_y - 8), (tip_x - 10, base_y + 6), (tip_x + 10, base_y + 6)],
            fill=gold,
        )

    beam_y = base_y + 2
    draw.rectangle((ox + 30, beam_y, ox + span - 30, beam_y + 10), fill=(44, 26, 16, 255))
    for bx in range(ox + 40, ox + span - 40, 28):
        draw.rectangle((bx, beam_y, bx + 8, beam_y + 18), fill=(70, 42, 24, 255))

    out = OUT / "chinese-roof.png"
    img.save(out, optimize=True)
    print(f"wrote {out} ({out.stat().st_size} bytes)")


def make_cloud() -> None:
    w, h = 200, 100
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    blobs = [
        (50, 58, 34, 28, (245, 230, 200, 200)),
        (78, 52, 40, 32, (255, 240, 210, 220)),
        (108, 55, 36, 30, (250, 235, 205, 210)),
        (132, 60, 28, 24, (240, 225, 195, 190)),
        (62, 68, 52, 22, (230, 215, 185, 180)),
        (98, 70, 58, 24, (235, 220, 190, 185)),
    ]
    for cx, cy, rx, ry, color in blobs:
        draw.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=color)
    draw.arc((30, 40, 170, 90), 200, 340, fill=(201, 162, 39, 160), width=3)
    img = img.filter(ImageFilter.GaussianBlur(0.8))
    out = OUT / "cloud.png"
    img.save(out, optimize=True)
    print(f"wrote {out} ({out.stat().st_size} bytes)")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    make_parchment()
    make_chinese_roof()
    make_cloud()
    print("done.")


if __name__ == "__main__":
    main()
