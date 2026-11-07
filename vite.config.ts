import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";
import {
  localizeIndexHtml,
  renderNotFoundHtml,
  renderRobotsTxt,
  renderSitemapXml,
} from "./src/localize-html";
import {
  DEFAULT_LOCALE,
  LOCALES,
  isLocale,
  localePath,
  type Locale,
} from "./src/site-config";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

function meApiPlugin(): Plugin {
  const handle = (
    req: { method?: string; url?: string; headers?: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string } },
    res: {
      statusCode: number;
      setHeader: (k: string, v: string) => void;
      end: (b?: string) => void;
    },
    next: () => void,
  ) => {
    if (!req.url) {
      next();
      return;
    }
    const url = new URL(req.url, "http://localhost");
    if (url.pathname !== "/api/me") {
      next();
      return;
    }
    if (req.method !== "GET") {
      res.statusCode = 405;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ error: "method_not_allowed" }));
      return;
    }
    const xff = req.headers?.["x-forwarded-for"];
    const xffStr = Array.isArray(xff) ? xff[0] : xff;
    const real = req.headers?.["x-real-ip"];
    const realStr = Array.isArray(real) ? real[0] : real;
    const geo = req.headers?.["x-geoip2-country"];
    const geoStr = Array.isArray(geo) ? geo[0] : geo;
    const ip =
      (typeof xffStr === "string" && xffStr.split(",")[0]?.trim()) ||
      (typeof realStr === "string" && realStr.trim()) ||
      req.socket?.remoteAddress ||
      "127.0.0.1";
    const ua = req.headers?.["user-agent"];
    const uaStr = Array.isArray(ua) ? ua[0] : ua;
    const curl = typeof uaStr === "string" && /curl\//i.test(uaStr);
    res.statusCode = 200;
    res.setHeader("Cache-Control", "no-store");
    const country =
      typeof geoStr === "string" ? geoStr.trim().toUpperCase() : "";
    if (curl) {
      let name = "";
      if (country && country !== "NULL") {
        try {
          name = new Intl.DisplayNames(["en"], { type: "region" }).of(country) || "";
        } catch {
          name = "";
        }
      }
      const plain = name ? `${ip}\n${name}\n` : `${ip}\n`;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.end(plain);
      return;
    }
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(
      JSON.stringify({
        ip,
        country,
      }),
    );
  };

  return {
    name: "me-api",
    configureServer(server) {
      server.middlewares.use(handle);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handle);
    },
  };
}

function stripLangParam(searchParams: URLSearchParams): string {
  searchParams.delete("lang");
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

function rootRedirectTarget(url: URL): { status: number; location: string } {
  const lang = url.searchParams.get("lang");
  if (lang && isLocale(lang.toLowerCase())) {
    const locale = lang.toLowerCase() as Locale;
    const params = new URLSearchParams(url.searchParams);
    const qs = stripLangParam(params);
    return { status: 301, location: `${localePath(locale)}${qs}` };
  }
  const params = new URLSearchParams(url.searchParams);
  const qs = stripLangParam(params);
  return { status: 302, location: `${localePath(DEFAULT_LOCALE)}${qs}` };
}

function langDevMiddleware(
  setLocale: (locale: Locale) => void,
): (
  req: { url?: string },
  res: {
    statusCode: number;
    setHeader: (k: string, v: string) => void;
    end: (b?: string) => void;
  },
  next: () => void,
) => void {
  return (req, res, next) => {
    if (!req.url) {
      next();
      return;
    }
    const url = new URL(req.url, "http://localhost");
    const { pathname } = url;
    const seg = pathname.split("/").filter(Boolean)[0] ?? "";
    const segLower = seg.toLowerCase();

    if (pathname === "/" || pathname === "/index.html") {
      const target = rootRedirectTarget(url);
      res.statusCode = target.status;
      res.setHeader("Location", target.location);
      res.end();
      return;
    }

    if (seg && seg !== segLower && isLocale(segLower)) {
      const rest = pathname.slice(seg.length + 1);
      res.statusCode = 301;
      res.setHeader("Location", `/${segLower}${rest || "/"}${url.search}`);
      res.end();
      return;
    }

    if (isLocale(segLower) && pathname === `/${segLower}`) {
      res.statusCode = 301;
      res.setHeader("Location", `/${segLower}/${url.search}`);
      res.end();
      return;
    }

    if (isLocale(segLower) && pathname === `/${segLower}/`) {
      setLocale(segLower);
      req.url = `/index.html${url.search}`;
      next();
      return;
    }

    if (/^\/[a-z]{2,3}(\/|$)/i.test(pathname) && !isLocale(segLower)) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(renderNotFoundHtml(DEFAULT_LOCALE));
      return;
    }

    next();
  };
}

function emitLangPages(): Plugin {
  let devLocale: Locale = DEFAULT_LOCALE;

  return {
    name: "emit-lang-pages",
    configureServer(server) {
      server.middlewares.use(
        langDevMiddleware((locale) => {
          devLocale = locale;
        }),
      );
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) {
          next();
          return;
        }
        const url = new URL(req.url, "http://localhost");
        if (url.pathname === "/" || url.pathname === "/index.html") {
          const target = rootRedirectTarget(url);
          res.statusCode = target.status;
          res.setHeader("Location", target.location);
          res.end();
          return;
        }
        const seg = url.pathname.split("/").filter(Boolean)[0] ?? "";
        if (isLocale(seg.toLowerCase()) && url.pathname === `/${seg}`) {
          res.statusCode = 301;
          res.setHeader("Location", `/${seg.toLowerCase()}/${url.search}`);
          res.end();
          return;
        }
        next();
      });
    },
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        return localizeIndexHtml(html, devLocale);
      },
    },
    closeBundle() {
      const dist = path.resolve(rootDir, "dist");
      const indexPath = path.join(dist, "index.html");
      if (!fs.existsSync(indexPath)) return;

      const template = fs.readFileSync(indexPath, "utf8");
      for (const locale of LOCALES) {
        const dir = path.join(dist, locale);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(
          path.join(dir, "index.html"),
          localizeIndexHtml(template, locale),
          "utf8",
        );
        fs.writeFileSync(
          path.join(dir, "404.html"),
          renderNotFoundHtml(locale),
          "utf8",
        );
      }

      fs.unlinkSync(indexPath);
      const root404 = path.join(dist, "404.html");
      if (fs.existsSync(root404)) {
        fs.writeFileSync(root404, renderNotFoundHtml(DEFAULT_LOCALE), "utf8");
      }

      fs.writeFileSync(path.join(dist, "sitemap.xml"), renderSitemapXml(), "utf8");
      fs.writeFileSync(path.join(dist, "robots.txt"), renderRobotsTxt(), "utf8");
    },
  };
}

export default defineConfig({
  root: ".",
  publicDir: "public",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  plugins: [meApiPlugin(), emitLangPages()],
});
