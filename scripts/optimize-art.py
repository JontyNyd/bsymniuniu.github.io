#!/usr/bin/env python3
"""压缩第三方下载的大图，生成 Web 友好版本。"""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "assets" / "images"


def resize_jpg(src: str, dst: str, max_w: int, quality: int = 82) -> None:
    path = IMG / src
    if not path.exists():
        return
    img = Image.open(path)
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGBA")
    w, h = img.size
    if w > max_w:
        h = int(h * max_w / w)
        w = max_w
        img = img.resize((w, h), Image.LANCZOS)
    out = IMG / dst
    img.convert("RGB").save(out, quality=quality, optimize=True)
    print(f"wrote {out.name} ({out.stat().st_size // 1024} KB)")


def main() -> None:
    IMG.mkdir(parents=True, exist_ok=True)
    resize_jpg("battle-scene-bg.png", "battle-scene-bg.jpg", 1600, 82)
    resize_jpg("mountains-far.png", "mountains-far.jpg", 1400, 85)
    title = IMG / "title-bg.png"
    if title.exists() and title.stat().st_size > 500_000:
        img = Image.open(title)
        w, h = img.size
        if w > 1280:
            h = int(h * 1280 / w)
            img = img.resize((1280, h), Image.LANCZOS)
            img.save(title, optimize=True)
            print(f"resized title-bg.png ({title.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
