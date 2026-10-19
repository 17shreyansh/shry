"""
SHRY Brand Asset & Logo Exporter
=================================
Extracts and exports pixel-perfect, high-resolution logos and brand marks
from the SHRY website (https://shry.in).

Outputs:
  - Vector SVGs (Outlined paths, zero font dependency, scalable to infinite resolution)
  - Ultra High-Resolution PNGs (4K, 2K, 1K, 512px) with crisp anti-aliasing
  - Multiple variants: Dark mode, Light mode, Obsidian & Bone backgrounds, Monochrome
  - Navbar Wordmark ('SHRY•'), Brand Icon ('S•'), and Horizontal Lockup
"""

import os
import sys
import math
import urllib.request
from pathlib import Path
from PIL import Image, ImageFont, ImageDraw

# Brand color tokens from tailwind.config.mjs and globals.css
OBSIDIAN = "#08090B"   # Primary dark ground
SURFACE = "#111318"    # Elevated dark surface
BONE = "#E9E6DC"       # Signature light ground
INK = "#F5F5F0"        # Primary typography text color (light on dark)
ACCENT = "#BFEA5A"     # Signature electric lime accent
ACCENT_ALT = "#C8FF4D" # High-contrast favicon neon lime
WHITE = "#FFFFFF"
BLACK = "#000000"

# SVG Vector Path for 'SHRY' in Bricolage Grotesque ExtraBold with -0.06em tracking
# Extracted directly from official Bricolage Grotesque 96pt ExtraBold font outlines
SVG_WORDMARK_PATH = (
    "M299 674Q229 674 176.50 658Q124 642 89 612Q54 582 37.50 539.50Q21 497 23 445"
    "L173 412Q175 458 192.50 486.50Q210 515 240 528.50Q270 542 307 542Q337 542 360 534.50"
    "Q383 527 396.50 513.50Q410 500 410 482Q410 458 392 442.50Q374 427 342.50 416"
    "Q311 405 271 394Q228 382 185.50 367.50Q143 353 108 331Q73 309 51.50 274Q30 239 30 187"
    "Q30 123 62.50 78Q95 33 152.50 9.50Q210-14 284-14Q362-14 423 12.50Q484 39 517 90"
    "Q550 141 543 215L395 239Q396 209 389 186Q382 163 367.50 147Q353 131 331 122.50"
    "Q309 114 279 114Q248 114 227.50 122Q207 130 196.50 144Q186 158 186 176Q186 197 202 211"
    "Q218 225 248 235.50Q278 246 319 257Q362 269 405.50 283.50Q449 298 486 321.50"
    "Q523 345 545.50 382Q568 419 568 476Q568 542 533.50 586Q499 630 438.50 652Q378 674 299 674 "
    "M1122 660L960 660L960 0L1122 0L1122 660M727 660L565 660L565 0L727 0L727 660"
    "M1045 396L686 396L686 260L1045 260 "
    "M1304 660L1142 660L1142 0L1416 0Q1460 0 1499.50 7.50Q1539 15 1571.50 30Q1604 45 1628 68"
    "Q1652 91 1665 122.50Q1678 154 1678 194Q1678 225 1667.50 252.50Q1657 280 1634.50 302"
    "Q1612 324 1576.50 338.50Q1541 353 1492 359L1492 367Q1556 370 1591 392Q1626 414 1643.50 447.50"
    "Q1661 481 1670 520L1705 660L1526 660L1501 529Q1495 495 1482.50 474Q1470 453 1447 443"
    "Q1424 433 1386 433L1304 433L1304 660M1304 130L1304 308L1398 308Q1453 308 1482 287"
    "Q1511 266 1511 223Q1511 176 1484 153Q1457 130 1402 130 "
    "M2036 660L1874 660L1874 440L1659 0L1851 0L1955 294L1957 294L2060 0L2250 0L2036 440"
)

# SVG Path for the Icon S-Curve from favicon.svg
SVG_ICON_PATH = "M42 20c-3-4-8-5-12-4-5 1-8 4-8 8 0 5 5 6 10 8 5 2 10 3 10 9 0 5-5 8-11 8-5 0-9-2-12-6"

FONT_URL = "https://raw.githubusercontent.com/google/fonts/main/ofl/bricolagegrotesque/BricolageGrotesque%5Bopsz%2Cwdth%2Cwght%5D.ttf"


def ensure_font(base_dir: Path) -> Path:
    """Ensure Bricolage Grotesque TTF font is available locally."""
    font_path = base_dir / "scratch" / "BricolageGrotesque.ttf"
    if font_path.exists() and font_path.stat().st_size > 100000:
        return font_path

    font_path.parent.mkdir(parents=True, exist_ok=True)
    print(f"[*] Downloading Bricolage Grotesque font to {font_path.name}...")
    urllib.request.urlretrieve(FONT_URL, font_path)
    print("[+] Font successfully downloaded.")
    return font_path


def build_svg_wordmark(text_color: str, dot_color: str, bg_color: str | None = None, padding: int = 40) -> str:
    """Generate self-contained vector SVG for the navbar wordmark."""
    # Native content bounds: X: 22.8 to 2525 (width ~ 2502.2), Y: -14 to 674 (height ~ 688)
    # Normalized viewBox with padding:
    width = 2502 + 2 * padding
    height = 688 + 2 * padding
    offset_x = padding - 22.8
    offset_y = padding + 14

    bg_rect = f'  <rect width="100%" height="100%" fill="{bg_color}" rx="32"/>\n' if bg_color else ""

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width:.1f} {height:.1f}" width="{width:.1f}" height="{height:.1f}">
{bg_rect}  <g transform="translate({offset_x:.2f}, {offset_y:.2f})">
    <path d="{SVG_WORDMARK_PATH}" fill="{text_color}" />
    <!-- Baseline-aligned accent dot -->
    <circle cx="2397.2" cy="535" r="125" fill="{dot_color}" />
  </g>
</svg>"""
    return svg


def build_svg_icon(bg_color: str | None = OBSIDIAN, stroke_color: str = INK, dot_color: str = ACCENT) -> str:
    """Generate SVG for the brand icon (monogram tile)."""
    bg_tag = f'<rect width="64" height="64" rx="14" fill="{bg_color}"/>' if bg_color else ""
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  {bg_tag}
  <path d="{SVG_ICON_PATH}" fill="none" stroke="{stroke_color}" stroke-width="5" stroke-linecap="round"/>
  <circle cx="50" cy="14" r="4" fill="{dot_color}"/>
</svg>"""


def build_svg_lockup(text_color: str, dot_color: str, icon_stroke: str, bg_color: str | None = None) -> str:
    """Generate SVG for horizontal combination lockup (Icon Mark + Wordmark)."""
    # Icon scaled to match wordmark cap-height (cap-height ~ 660)
    # Icon 64x64 scaled by 10.3125 -> 660x660
    icon_scale = 10.3125
    icon_w = 64 * icon_scale
    gap = 260
    total_w = icon_w + gap + 2502 + 80
    total_h = 688 + 80

    bg_rect = f'  <rect width="100%" height="100%" fill="{bg_color}" rx="32"/>\n' if bg_color else ""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {total_w:.1f} {total_h:.1f}" width="{total_w:.1f}" height="{total_h:.1f}">
{bg_rect}  <!-- Brand Icon -->
  <g transform="translate(40, 40)">
    <g transform="scale({icon_scale:.4f})">
      <rect width="64" height="64" rx="14" fill="{OBSIDIAN if bg_color != OBSIDIAN else SURFACE}"/>
      <path d="{SVG_ICON_PATH}" fill="none" stroke="{icon_stroke}" stroke-width="5" stroke-linecap="round"/>
      <circle cx="50" cy="14" r="4" fill="{dot_color}"/>
    </g>
  </g>
  <!-- Wordmark -->
  <g transform="translate({40 + icon_w + gap - 22.8:.2f}, {40 + 14})">
    <path d="{SVG_WORDMARK_PATH}" fill="{text_color}" />
    <circle cx="2397.2" cy="535" r="125" fill="{dot_color}" />
  </g>
</svg>"""


def render_png_wordmark(
    font_path: Path,
    target_width: int,
    text_color: str,
    dot_color: str,
    bg_color: str | None = None,
    supersample: int = 2,
) -> Image.Image:
    """Render ultra high-resolution raster PNG for navbar wordmark with 2x Lanczos supersampling."""
    # Estimated font size for target width
    scale_factor = target_width / 2502.0
    nominal_font_size = int(1000.0 * scale_factor * supersample)
    font = ImageFont.truetype(str(font_path), nominal_font_size)

    tracking = -0.06 * nominal_font_size
    dot_size = nominal_font_size * (6.0 / 24.0)
    dot_gap = nominal_font_size * (2.0 / 24.0)

    chars = "SHRY"
    advances = [font.getlength(c) for c in chars]
    text_width = sum(advances) + tracking * (len(chars) - 1)
    content_width = text_width + dot_gap + dot_size

    ascent, descent = font.getmetrics()
    padding_x = int(0.04 * content_width)
    padding_y = int(0.12 * (ascent + descent))

    canvas_w = int(content_width + 2 * padding_x)
    canvas_h = int(ascent + descent + 2 * padding_y)

    # Initial high-res buffer
    img = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    baseline_y = padding_y + ascent
    cur_x = padding_x
    for ch in chars:
        draw.text((cur_x, baseline_y), ch, font=font, fill=text_color, anchor="ls")
        cur_x += font.getlength(ch) + tracking

    dot_x = cur_x - tracking + dot_gap
    draw.ellipse([dot_x, baseline_y - dot_size, dot_x + dot_size, baseline_y], fill=dot_color)

    # Crop to tight bounding box with standard proportional breathing margin
    bbox = img.getbbox()
    if bbox:
        bw = bbox[2] - bbox[0]
        bh = bbox[3] - bbox[1]
        pad = int(0.05 * bw)
        crop_box = (
            max(0, bbox[0] - pad),
            max(0, bbox[1] - pad),
            min(canvas_w, bbox[2] + pad),
            min(canvas_h, bbox[3] + pad),
        )
        cropped = img.crop(crop_box)
    else:
        cropped = img

    # Downsample with Lanczos for subpixel studio anti-aliasing
    final_w = int(cropped.width / supersample)
    final_h = int(cropped.height / supersample)
    resampled = cropped.resize((final_w, final_h), Image.Resampling.LANCZOS)

    if bg_color:
        bg = Image.new("RGBA", resampled.size, bg_color)
        bg.alpha_composite(resampled)
        return bg

    return resampled


def render_png_icon(target_size: int, stroke_color: str, dot_color: str, bg_color: str | None = OBSIDIAN) -> Image.Image:
    """Render high-resolution raster PNG for brand icon."""
    scale = target_size / 64.0
    ss = 2
    canvas_size = target_size * ss

    img = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Draw rounded squircle
    radius = int(14 * scale * ss)
    if bg_color:
        draw.rounded_rectangle([0, 0, canvas_size, canvas_size], radius=radius, fill=bg_color)

    # Convert S-path coordinates to scaled polyline for high-res rasterization
    # S curve path approximation:
    # M42 20 c-3-4 -8-5 -12-4 c-5 1 -8 4 -8 8 c0 5 5 6 10 8 c5 2 10 3 10 9 c0 5 -5 8 -11 8 c-5 0 -9-2 -12-6
    def bez3(p0, p1, p2, p3, steps=32):
        pts = []
        for i in range(steps + 1):
            u = i / steps
            k = 1 - u
            a = k * k * k
            b = 3 * k * k * u
            c = 3 * k * u * u
            d = u * u * u
            pts.append((a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]))
        return pts

    # S-curve segments (M42 20 c-3-4 -8-5 -12-4 c-5 1 -8 4 -8 8 c0 5 5 6 10 8 c5 2 10 3 10 9 c0 5 -5 8 -11 8 c-5 0 -9-2 -12-6)
    s1 = bez3((42, 20), (39, 16), (34, 15), (30, 16))
    s2 = bez3((30, 16), (25, 17), (22, 20), (22, 24))
    s3 = bez3((22, 24), (22, 29), (27, 30), (32, 32))
    s4 = bez3((32, 32), (37, 34), (42, 35), (42, 41))
    s5 = bez3((42, 41), (42, 46), (37, 49), (31, 49))
    s6 = bez3((31, 49), (26, 49), (22, 47), (19, 43))
    all_pts = s1 + s2 + s3 + s4 + s5 + s6

    scaled_pts = [(x * scale * ss, y * scale * ss) for (x, y) in all_pts]
    stroke_w = int(5 * scale * ss)

    # Draw smooth polyline with rounded joins
    for i in range(len(scaled_pts) - 1):
        draw.line([scaled_pts[i], scaled_pts[i + 1]], fill=stroke_color, width=stroke_w)
    # Caps
    r_cap = stroke_w / 2.0
    for p in (scaled_pts[0], scaled_pts[-1]):
        draw.ellipse([p[0] - r_cap, p[1] - r_cap, p[0] + r_cap, p[1] + r_cap], fill=stroke_color)

    # Dot
    dot_cx = 50 * scale * ss
    dot_cy = 14 * scale * ss
    dot_r = 4 * scale * ss
    draw.ellipse([dot_cx - dot_r, dot_cy - dot_r, dot_cx + dot_r, dot_cy + dot_r], fill=dot_color)

    return img.resize((target_size, target_size), Image.Resampling.LANCZOS)


def main():
    print("=" * 64)
    print("  SHRY HIGH QUALITY LOGO & BRAND ASSET EXPORTER")
    print("=" * 64)

    base_dir = Path(__file__).resolve().parent
    font_path = ensure_font(base_dir)

    # Destination directories
    export_dir = base_dir / "exports" / "logos"
    svg_dir = export_dir / "svg"
    png_dir = export_dir / "png"
    public_brand_dir = base_dir / "public" / "brand"

    for d in [svg_dir, png_dir / "4k", png_dir / "2k", png_dir / "1k", png_dir / "512px", public_brand_dir]:
        d.mkdir(parents=True, exist_ok=True)

    generated_files = []

    # 1. Generate SVGs
    print("\n[*] Generating Vector SVGs (Outlined paths, infinite scaling)...")
    svg_configs = [
        ("shry-logo-dark.svg", INK, ACCENT, None, "Dark Wordmark (Transparent)"),
        ("shry-logo-light.svg", OBSIDIAN, ACCENT, None, "Light Wordmark (Transparent)"),
        ("shry-logo-dark-bg.svg", INK, ACCENT, OBSIDIAN, "Dark Wordmark on Obsidian Ground"),
        ("shry-logo-light-bg.svg", OBSIDIAN, ACCENT, BONE, "Light Wordmark on Bone Ground"),
        ("shry-logo-mono-white.svg", WHITE, WHITE, None, "Monochrome White Wordmark"),
        ("shry-logo-mono-black.svg", BLACK, BLACK, None, "Monochrome Black Wordmark"),
    ]

    for fname, txt, dot, bg, label in svg_configs:
        content = build_svg_wordmark(txt, dot, bg)
        out_path = svg_dir / fname
        out_path.write_text(content, encoding="utf-8")
        generated_files.append((out_path, label))
        # Copy primary dark & light to public/brand
        if fname in ("shry-logo-dark.svg", "shry-logo-light.svg"):
            (public_brand_dir / fname).write_text(content, encoding="utf-8")

    # Icon SVGs
    icon_svg_configs = [
        ("shry-icon.svg", OBSIDIAN, INK, ACCENT, "Brand App Icon Tile (Obsidian)"),
        ("shry-icon-light.svg", BONE, OBSIDIAN, ACCENT, "Brand App Icon Tile (Bone)"),
        ("shry-icon-transparent.svg", None, INK, ACCENT, "Brand App Icon (Transparent S-mark)"),
    ]
    for fname, bg, stroke, dot, label in icon_svg_configs:
        content = build_svg_icon(bg, stroke, dot)
        out_path = svg_dir / fname
        out_path.write_text(content, encoding="utf-8")
        generated_files.append((out_path, label))
        if fname == "shry-icon.svg":
            (public_brand_dir / fname).write_text(content, encoding="utf-8")

    # Lockup SVGs
    lockup_svg_configs = [
        ("shry-lockup-dark.svg", INK, ACCENT, INK, None, "Horizontal Lockup Dark"),
        ("shry-lockup-light.svg", OBSIDIAN, ACCENT, OBSIDIAN, None, "Horizontal Lockup Light"),
    ]
    for fname, txt, dot, stroke, bg, label in lockup_svg_configs:
        content = build_svg_lockup(txt, dot, stroke, bg)
        out_path = svg_dir / fname
        out_path.write_text(content, encoding="utf-8")
        generated_files.append((out_path, label))
        (public_brand_dir / fname).write_text(content, encoding="utf-8")

    print(f"[+] Created {len(svg_configs) + len(icon_svg_configs) + len(lockup_svg_configs)} Vector SVG assets.")

    # 2. Generate Ultra High-Res PNGs
    print("\n[*] Generating Ultra High-Resolution PNGs with Lanczos Anti-Aliasing...")
    resolutions = [
        ("4k", 4096),
        ("2k", 2048),
        ("1k", 1024),
        ("512px", 512),
    ]

    png_configs = [
        ("shry-logo-dark.png", INK, ACCENT, None, "Dark Wordmark (Transparent)"),
        ("shry-logo-light.png", OBSIDIAN, ACCENT, None, "Light Wordmark (Transparent)"),
        ("shry-logo-dark-bg.png", INK, ACCENT, OBSIDIAN, "Dark Wordmark on Obsidian"),
        ("shry-logo-light-bg.png", OBSIDIAN, ACCENT, BONE, "Light Wordmark on Bone"),
    ]

    for res_name, res_width in resolutions:
        target_folder = png_dir / res_name
        for fname, txt, dot, bg, label in png_configs:
            out_img = render_png_wordmark(font_path, res_width, txt, dot, bg)
            out_path = target_folder / fname
            out_img.save(out_path, "PNG", optimize=True)
            generated_files.append((out_path, f"{label} [{res_name.upper()} {out_img.width}x{out_img.height}]"))

            # Save 2K versions to public/brand for immediate site use
            if res_name == "2k" and fname in ("shry-logo-dark.png", "shry-logo-light.png"):
                out_img.save(public_brand_dir / fname, "PNG", optimize=True)

    # Icon PNGs
    icon_res = [("1024", 1024), ("512", 512), ("256", 256), ("128", 128)]
    for rname, rsize in icon_res:
        icon_img = render_png_icon(rsize, INK, ACCENT, OBSIDIAN)
        out_path = png_dir / (f"{rsize}px" if rsize in (512, 1024) else "512px") / f"shry-icon-{rname}.png"
        icon_img.save(out_path, "PNG", optimize=True)
        generated_files.append((out_path, f"Icon App Tile [{rsize}x{rsize}]"))
        if rsize == 512:
            icon_img.save(public_brand_dir / "shry-icon-512.png", "PNG", optimize=True)

    # 3. Create Brand Asset Summary README
    readme_path = export_dir / "README.md"
    readme_content = f"""# SHRY Official Logo & Brand Asset Suite

Exported directly from the website typography and brand identity system.

## Brand Specification
- **Wordmark**: `SHRY•`
- **Typography**: Bricolage Grotesque ExtraBold (800)
- **Tracking**: `-0.06em`
- **Dot Alignment**: Baseline-aligned, gap `0.083em`, diameter `0.25em`
- **Colors**:
  - `Obsidian` (Dark Ground): `{OBSIDIAN}`
  - `Bone` (Light Ground): `{BONE}`
  - `Ink` (Text Light): `{INK}`
  - `Accent Lime`: `{ACCENT}`
  - `Favicon Lime`: `{ACCENT_ALT}`

## Vector SVG Files (`exports/logos/svg/`)
- `shry-logo-dark.svg`: Outlined navbar logo for dark & transparent backgrounds (No font required)
- `shry-logo-light.svg`: Outlined navbar logo for light backgrounds
- `shry-logo-dark-bg.svg`: Dark logo with solid obsidian background
- `shry-logo-light-bg.svg`: Light logo with signature bone background
- `shry-logo-mono-white.svg`: Pure white monochrome
- `shry-logo-mono-black.svg`: Pure black monochrome
- `shry-icon.svg`: Brand squircle app icon tile
- `shry-icon-transparent.svg`: Transparent S-mark + neon dot
- `shry-lockup-dark.svg`: Combination mark (Icon + Wordmark)
- `shry-lockup-light.svg`: Combination mark light

## High-Resolution PNGs (`exports/logos/png/`)
- `4k/`: Ultra high-resolution (4096px width, print, 4K displays, billboards)
- `2k/`: High-resolution (2048px width, presentations, Figma, retina web)
- `1k/`: Standard web resolution (1024px width)
- `512px/`: UI icons and avatars

All vector files contain mathematically pure Bézier curves and require zero external font files to open or render.
"""
    readme_path.write_text(readme_content, encoding="utf-8")

    # Summary Output
    print("\n" + "=" * 64)
    print("  EXPORT SUMMARY")
    print("=" * 64)
    print(f"Total assets exported: {len(generated_files)}")
    print(f"SVGs:   {svg_dir.resolve()}")
    print(f"PNGs:   {png_dir.resolve()}")
    print(f"Public: {public_brand_dir.resolve()}")
    print("=" * 64)


if __name__ == "__main__":
    main()
