from pathlib import Path

from PIL import Image


ASSETS = Path(__file__).resolve().parents[1] / "public" / "assets"
IMAGES = {
    "profile-photo-new.png": ("profile-photo-new.webp", 384),
    "profile-photo-layer-1.png": ("profile-photo-layer-1.webp", 720),
    "hero-effect-reference.png": ("hero-effect-reference.webp", 1000),
    "power-smart-brain.jpg": ("power-smart-brain.webp", 1280),
    "tcm-university-dashboard.png": ("tcm-university-dashboard.webp", 1280),
    "work-highlights.png": ("work-highlights.webp", 720),
}


def convert(source_name: str, output_name: str, max_width: int) -> None:
    source = ASSETS / source_name
    output = ASSETS / output_name
    with Image.open(source) as image:
        scale = min(1, max_width / image.width)
        size = (round(image.width * scale), round(image.height * scale))
        optimized = image.resize(size, Image.Resampling.LANCZOS)
        optimized.save(output, "WEBP", quality=82, method=6)
    print(f"{source_name}: {source.stat().st_size // 1024} KB -> {output_name}: {output.stat().st_size // 1024} KB")


for source, (output, width) in IMAGES.items():
    convert(source, output, width)
