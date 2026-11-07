import http from "node:http";
import net from "node:net";

const port = Number.parseInt(process.env.PORT || "8080", 10);

function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(payload),
  });
  res.end(payload);
}

function sendPlain(res, status, text) {
  const payload = text.endsWith("\n") ? text : `${text}\n`;
  res.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(payload),
  });
  res.end(payload);
}

function isCurl(req) {
  const ua = req.headers["user-agent"];
  return typeof ua === "string" && /curl\//i.test(ua);
}

function normalizeIp(raw) {
  if (!raw) return "";
  let ip = String(raw).trim();
  if (ip.startsWith("::ffff:")) ip = ip.slice(7);
  if (ip.startsWith("[") && ip.endsWith("]")) ip = ip.slice(1, -1);
  const zone = ip.indexOf("%");
  if (zone !== -1) ip = ip.slice(0, zone);
  return ip;
}

function isPrivateIp(ip) {
  const v = net.isIP(ip);
  if (v === 4) {
    const parts = ip.split(".").map((n) => Number.parseInt(n, 10));
    if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return true;
    const [a, b] = parts;
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true;
    return false;
  }
  if (v === 6) {
    const lower = ip.toLowerCase();
    if (lower === "::1") return true;
    if (lower.startsWith("fc") || lower.startsWith("fd")) return true;
    if (lower.startsWith("fe80:")) return true;
    return false;
  }
  return true;
}

function clientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  const candidates = [];
  if (typeof xff === "string" && xff.length > 0) {
    for (const part of xff.split(",")) {
      const ip = normalizeIp(part);
      if (ip) candidates.push(ip);
    }
  }
  const real = normalizeIp(
    typeof req.headers["x-real-ip"] === "string" ? req.headers["x-real-ip"] : "",
  );
  if (real) candidates.push(real);
  const remote = normalizeIp(req.socket.remoteAddress || "");
  if (remote) candidates.push(remote);

  for (const ip of candidates) {
    if (!isPrivateIp(ip)) return ip;
  }
  return candidates[0] || "";
}

function countryCode(req) {
  const raw = req.headers["x-geoip2-country"];
  if (typeof raw !== "string") return "";
  const code = raw.trim().toUpperCase();
  if (!code || code === "NULL") return "";
  return code;
}

function countryNameEn(code) {
  if (!code) return "";
  try {
    const names = new Intl.DisplayNames(["en"], { type: "region" });
    const name = names.of(code);
    return typeof name === "string" ? name : "";
  } catch {
    return "";
  }
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const pathName = url.pathname.replace(/\/+$/, "") || "/";

  if (req.method === "GET" && pathName === "/health") {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (pathName === "/me" || pathName === "/api/me") {
    if (req.method !== "GET") {
      sendJson(res, 405, { error: "method_not_allowed" });
      return;
    }
    const ip = clientIp(req);
    const country = countryCode(req);
    if (isCurl(req)) {
      const name = countryNameEn(country);
      sendPlain(res, 200, name ? `${ip}\n${name}` : ip);
      return;
    }
    sendJson(res, 200, {
      ip,
      country,
    });
    return;
  }

  sendJson(res, 404, { error: "not_found" });
});

server.listen(port, "0.0.0.0");
