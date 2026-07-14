#!/usr/bin/env python3
"""Render private source PDFs into public JPG page previews."""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "source-pdfs"
OUTPUT_ROOT = ROOT / "public" / "assets" / "pdf-pages"
APP_MANIFEST = ROOT / "src" / "pdf-page-manifest.json"
PDFS = {
    "portfolio": SOURCE_DIR / "portfolio.pdf",
    "fande": SOURCE_DIR / "fande-securities-brand-book.pdf",
}
RENDER_SETTINGS = {
    "portfolio": {
        "desktop": {"dpi": "360", "quality": "94"},
        "mobile": {"dpi": "220", "quality": "84"},
    },
    "fande": {
        "desktop": {"dpi": "160", "quality": "80"},
        "mobile": {"dpi": "54", "quality": "68"},
    },
}
PDFTOPPM = shutil.which("pdftoppm")
PDFINFO = shutil.which("pdfinfo")


def require_tools() -> None:
    missing = [name for name, path in {"pdftoppm": PDFTOPPM, "pdfinfo": PDFINFO}.items() if not path]
    if missing:
        raise RuntimeError(f"Missing required PDF tools: {', '.join(missing)}")


def page_count(path: Path) -> int:
    result = subprocess.run([PDFINFO, str(path)], check=True, capture_output=True, text=True)
    for line in result.stdout.splitlines():
        if line.startswith("Pages:"):
            return int(line.split(":", 1)[1].strip())
    raise RuntimeError(f"Could not read page count for {path}")


def render_variant(
    slug: str,
    pdf_path: Path,
    total: int,
    settings: dict[str, str],
    output_dir: Path,
    public_prefix: str,
    label: str,
) -> list[str]:
    pages: list[str] = []

    with tempfile.TemporaryDirectory(prefix=f"{slug}-{label}-pages-") as temp_name:
        temp_dir = Path(temp_name)

        for index in range(1, total + 1):
            page_name = f"page-{index:03}.jpg"
            prefix = temp_dir / f"page-{index:03}"
            subprocess.run(
                [
                    PDFTOPPM,
                    "-r",
                    settings["dpi"],
                    "-f",
                    str(index),
                    "-l",
                    str(index),
                    "-singlefile",
                    "-jpeg",
                    "-jpegopt",
                    f"quality={settings['quality']},optimize=y,progressive=y",
                    str(pdf_path),
                    str(prefix),
                ],
                check=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
            pages.append(f"{public_prefix}/{page_name}")
            if index == 1 or index == total or index % 10 == 0:
                print(f"{slug} {label}: rendered {index}/{total} pages", flush=True)

        if len(pages) != total:
            raise RuntimeError(f"{slug} {label}: expected {total} pages, rendered {len(pages)}")

        if output_dir.exists():
            shutil.rmtree(output_dir)
        output_dir.parent.mkdir(parents=True, exist_ok=True)
        os.replace(temp_dir, output_dir)

    return pages


def render_pdf(slug: str, pdf_path: Path) -> dict[str, object]:
    if not pdf_path.exists():
        raise FileNotFoundError(pdf_path)

    output_dir = OUTPUT_ROOT / slug
    mobile_dir = output_dir / "mobile"
    settings = RENDER_SETTINGS.get(
        slug,
        {
            "desktop": {"dpi": "180", "quality": "90"},
            "mobile": {"dpi": "112", "quality": "78"},
        },
    )
    total = page_count(pdf_path)
    temp_desktop_dir = output_dir.with_name(f".{slug}-desktop-temp")
    pages = render_variant(
        slug,
        pdf_path,
        total,
        settings["desktop"],
        temp_desktop_dir,
        f"/assets/pdf-pages/{slug}",
        "desktop",
    )
    mobile_pages = render_variant(
        slug,
        pdf_path,
        total,
        settings["mobile"],
        temp_desktop_dir / "mobile",
        f"/assets/pdf-pages/{slug}/mobile",
        "mobile",
    )

    if output_dir.exists():
        shutil.rmtree(output_dir)
    os.replace(temp_desktop_dir, output_dir)

    print(f"Rendered {slug}: {total} pages", flush=True)
    return {"pages": pages, "mobilePages": mobile_pages, "pageCount": total}


def main() -> None:
    require_tools()
    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
    selected_slugs = [slug for slug in sys.argv[1:] if slug != "--"] or list(PDFS.keys())
    unknown_slugs = sorted(set(selected_slugs) - set(PDFS))
    if unknown_slugs:
        raise RuntimeError(f"Unknown PDF slug(s): {', '.join(unknown_slugs)}")

    existing_manifest_path = OUTPUT_ROOT / "manifest.json"
    if existing_manifest_path.exists():
        manifest = json.loads(existing_manifest_path.read_text(encoding="utf-8"))
    else:
        manifest = {}

    for slug in selected_slugs:
        manifest[slug] = render_pdf(slug, PDFS[slug])

    manifest_path = OUTPUT_ROOT / "manifest.json"
    manifest_json = json.dumps(manifest, ensure_ascii=False, indent=2)
    manifest_path.write_text(manifest_json, encoding="utf-8")
    APP_MANIFEST.write_text(manifest_json, encoding="utf-8")
    print(f"Wrote {manifest_path.relative_to(ROOT)}", flush=True)
    print(f"Wrote {APP_MANIFEST.relative_to(ROOT)}", flush=True)


if __name__ == "__main__":
    main()
