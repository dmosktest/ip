# ip

Shows your public IP address and country. The browser asks a small local API; country comes from a GeoIP header when the reverse proxy provides one.

**Version:** `1.0.3`  
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
- Multilingual UI with the shared locale set used by companion apps
- `/` redirects to `/{lang}/` (dev defaults to `/ru/`; production edge can use Accept-Language / GeoIP)
- SEO body below the tool (benefits, how-to, tips, uses, FAQ) plus JSON-LD `WebApplication` and `FAQPage`
- `robots.txt`, `sitemap.xml`, per-language 404 pages
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
