# ip

Shows your public IP address and country. The browser asks a small local API; country comes from a GeoIP header when the reverse proxy provides one.

**Version:** `1.0.0`  
**Live:** https://ip.dmosk.net

## Stack

| Layer | Choice |
|-------|--------|
| UI | Vite + TypeScript (vanilla) |
| API | Node (`api/server.mjs`) — `GET /api/me`, `GET /health` |
| Country | `X-GeoIP2-Country` request header (optional); display via `Intl.DisplayNames` |

## Features

- Immediate public IP on `/{lang}/`
- One-click copy to clipboard
- Country name (localized) + ISO code and flag PNG when available
- Multilingual UI with the same locale set as the companion passgen app
- `/` redirects to `/{lang}/` (dev defaults to `/ru/`; production edge can use Accept-Language / GeoIP)
- SEO: per-locale pages, canonical + hreflang, `robots.txt`, `sitemap.xml`, 404 pages
- No third-party IP/geo APIs from the browser

## Languages and URLs

- Locale paths: `/ru/`, `/en/`, `/zh/`, `/es/`, `/hi/`, `/ar/`, `/bn/`, `/pt/`, `/fr/`, `/de/`, `/ja/`, `/id/`, `/pa/`, `/jv/`, `/te/`, `/tr/`, `/ko/`, `/mr/`, `/vi/`, `/ta/`, `/it/`, `/fa/`, `/tlh/`
- Language switcher uses local Twemoji flag PNGs; `ar` / `fa` use `dir="rtl"`
- Self-canonical URLs and full hreflang; `x-default` → `/en/`
- Build writes `dist/{lang}/`

## Local development

```bash
npm install
npm run dev
```

Open `/ru/`, `/en/`, `/zh/`, and other locale codes (in Vite dev the root redirects to `/ru/`). The Vite plugin serves `/api/me` for local use.

```bash
npm run build
npm run preview
```

Standalone API (optional; production usually puts nginx in front):

```bash
node api/server.mjs
```

Production-oriented build with indexing enabled:

```bash
# Windows (cmd)
set VITE_SITE_ORIGIN=https://ip.dmosk.net
set VITE_ALLOW_INDEX=true
npm run build

# Unix
VITE_SITE_ORIGIN=https://ip.dmosk.net VITE_ALLOW_INDEX=true npm run build
```

## Layout

```text
.
  package.json
  vite.config.ts
  index.html
  api/
    server.mjs            # GET /me|/api/me, GET /health
  public/                 # favicon, flags/, country-flags/
  src/
    main.ts
    style.css
    site-config.ts
    i18n*.ts
    seo-messages.ts
    localize-html.ts
    ...
```

## License

Source published for viewing and reuse as-is. Third-party assets (e.g. Twemoji-derived flag PNGs) keep their upstream licenses.