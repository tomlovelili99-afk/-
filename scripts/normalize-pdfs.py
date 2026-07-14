#!/usr/bin/env python3
"""Normalize PDFs in public/assets for reliable PDF.js preview."""

from __future__ import annotations

import os
from pathlib import Path

from pypdf import PdfReader, PdfWriter


ROOT = Path(__file__).resolve().parents[1]
PDF_ROOT = ROOT / "public" / "assets"
SOURCE_PASSWORD = os.environ.get("PDF_SOURCE_PASSWORD", "")


def unlock(reader: PdfReader, path: Path) -> None:
    if not reader.is_encrypted:
        return

    for candidate in dict.fromkeys((SOURCE_PASSWORD, "")):
        if reader.decrypt(candidate):
            return
    raise RuntimeError(f"Cannot unlock {path.name}; set PDF_SOURCE_PASSWORD.")


def normalize_pdf(path: Path) -> None:
    reader = PdfReader(path)
    unlock(reader, path)

    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)

    metadata = {str(key): str(value) for key, value in (reader.metadata or {}).items() if value is not None}
    if metadata:
        writer.add_metadata(metadata)

    temporary = path.with_suffix(".normalizing.pdf")
    with temporary.open("wb") as output:
        writer.write(output)
    temporary.replace(path)

    verification = PdfReader(path)
    print(f"Normalized: {path.relative_to(ROOT)} ({len(verification.pages)} pages, encrypted={verification.is_encrypted})")


def main() -> None:
    pdf_files = sorted(PDF_ROOT.rglob("*.pdf"))
    if not pdf_files:
        print("No PDF files found.")
        return

    for pdf_file in pdf_files:
        normalize_pdf(pdf_file)


if __name__ == "__main__":
    main()
