# PDF Protection and Deployment

## Protection model

This site uses a browser-compatible preview model for the portfolio PDF content:

1. Source PDFs are kept in `source-pdfs/` and are not published in `public/assets`.
2. Each PDF is rendered into WebP page images under `public/assets/pdf-pages/`.
3. The React viewer displays one protected image page at a time. It has no browser-native PDF toolbar, disables right-click, drag, copy, common save/print shortcuts, and hides the page during print.

This is a static-site deterrent, not DRM. Because preview images are delivered to the visitor's browser, determined users can still record the screen, screenshot, or inspect delivered assets. Do not publish material that must remain confidential without an authenticated backend or private file service.

## PDF compatibility

Avoid encrypting the source PDFs before rendering. Empty-password AES encrypted PDFs can hang indefinitely in some browser or rendering combinations, especially after replacing files with the same name.

If a source PDF is encrypted, export or normalize it to an unencrypted PDF before rendering page images.

## Build and deploy

```bash
pnpm install
python3 scripts/normalize-pdfs.py
pnpm run render:pdf-pages
pnpm run build
```

Deploy the generated `dist` directory to any static host. The source PDF files should remain outside `public/`; only rendered WebP pages and the manifest are shipped.
